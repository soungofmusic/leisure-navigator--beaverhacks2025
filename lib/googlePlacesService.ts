import { getMapsLoader, isMapsApiAvailable } from './googleMapsService';

/**
 * Interface for Google Place details relevant to our application
 */
export interface GooglePlaceDetails {
  placeId: string;
  name: string;
  rating?: number; // Google's rating (1.0 to 5.0)
  userRatingsTotal?: number; // Number of user ratings
  reviews?: GoogleReview[];
  photos?: string[]; // Array of photo references
  url?: string; // URL to the Google Maps page for this place
  website?: string; // URL to the place's website
  formattedAddress?: string;
  internationalPhoneNumber?: string;
}

/**
 * Interface for Google Review structure
 */
export interface GoogleReview {
  authorName: string;
  rating: number;
  relativeTimeDescription: string; // e.g., "a month ago"
  text: string;
  time: number; // Timestamp
  profilePhotoUrl?: string;
}

/**
 * Cache place details to minimize API calls
 */
const placeDetailsCache = new Map<string, GooglePlaceDetails>();

/**
 * Find a place by its name and address to get its Place ID
 * @param name Place name
 * @param address Place address (optional)
 * @returns Place ID if found
 */
export async function findPlaceId(name: string, address?: string): Promise<string | null> {
  if (!isMapsApiAvailable()) {
    console.error('Google Maps API key is missing');
    return null;
  }

  try {
    // Wait for the Maps API to load
    await getMapsLoader().load();
    
    // Create a PlacesService instance (requires a div element but won't be displayed)
    const placesServiceDiv = document.createElement('div');
    const placesService = new google.maps.places.PlacesService(placesServiceDiv);
    
    // Search query using name and address if available
    const searchQuery = address ? `${name} ${address}` : name;
    
    // Use textSearch which is more flexible than findPlaceFromQuery
    return new Promise((resolve, reject) => {
      placesService.textSearch(
        {
          query: searchQuery
        },
        (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results?.length) {
            // Return the first match's place ID
            resolve(results[0].place_id || null);
          } else {
            console.warn(`No places found for: ${searchQuery}`, status);
            resolve(null);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error finding place ID:', error);
    return null;
  }
}

/**
 * Get details for a place by its ID
 * @param placeId Google Place ID
 * @returns Place details
 */
export async function getPlaceDetails(placeId: string): Promise<GooglePlaceDetails | null> {
  // Return cached details if available
  if (placeDetailsCache.has(placeId)) {
    return placeDetailsCache.get(placeId) || null;
  }
  
  if (!isMapsApiAvailable()) {
    console.error('Google Maps API key is missing');
    return null;
  }

  try {
    // Wait for the Maps API to load
    await getMapsLoader().load();
    
    // Create a PlacesService instance
    const placesServiceDiv = document.createElement('div');
    const placesService = new google.maps.places.PlacesService(placesServiceDiv);
    
    // Get place details
    return new Promise((resolve, reject) => {
      placesService.getDetails(
        {
          placeId,
          fields: [
            'name',
            'rating',
            'user_ratings_total',
            'reviews',
            'photos',
            'url',
            'website',
            'formatted_address',
            'international_phone_number'
          ]
        },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            // Format the place details
            const details: GooglePlaceDetails = {
              placeId,
              name: place.name || '',
              rating: place.rating,
              userRatingsTotal: place.user_ratings_total,
              formattedAddress: place.formatted_address,
              internationalPhoneNumber: place.international_phone_number,
              url: place.url,
              website: place.website,
              reviews: place.reviews?.map(review => ({
                authorName: review.author_name,
                rating: review.rating || 0, // Ensure rating is never undefined
                relativeTimeDescription: review.relative_time_description,
                text: review.text,
                time: review.time,
                profilePhotoUrl: review.profile_photo_url
              })),
              photos: place.photos?.map(photo => photo.getUrl({
                maxWidth: 800,
                maxHeight: 600
              }))
            };
            
            // Cache the details
            placeDetailsCache.set(placeId, details);
            
            resolve(details);
          } else {
            console.warn(`Could not get details for place: ${placeId}`, status);
            resolve(null);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error getting place details:', error);
    return null;
  }
}

/**
 * Get Google rating for an activity by matching name and location
 * @param name Activity name
 * @param address Activity address
 * @returns Place details with rating information
 */
export async function getGoogleRating(name: string, address?: string): Promise<{
  rating: number | null;
  totalRatings: number | null;
  placeId: string | null;
}> {
  const defaultResult = { rating: null, totalRatings: null, placeId: null };
  
  try {
    // Find the place ID first
    const placeId = await findPlaceId(name, address);
    if (!placeId) return defaultResult;
    
    // Get the place details which include ratings
    const placeDetails = await getPlaceDetails(placeId);
    if (!placeDetails) return { ...defaultResult, placeId };
    
    return {
      rating: placeDetails.rating || null,
      totalRatings: placeDetails.userRatingsTotal || null,
      placeId
    };
  } catch (error) {
    console.error('Error fetching Google rating:', error);
    return defaultResult;
  }
}
