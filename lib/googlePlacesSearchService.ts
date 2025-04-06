import { getMapsLoader, isMapsApiAvailable } from './googleMapsService';
import { LeisureActivity } from '../types';
import { getPlaceDetails } from './googlePlacesService';

// Default center location for Portland, OR
const DEFAULT_CENTER = {
  lat: 45.5152,
  lng: -122.6784
};

// Map of activity types to Google Places types
const TYPE_TO_PLACES_TYPES: Record<string, string[]> = {
  'outdoor': ['park', 'campground', 'natural_feature', 'zoo'],
  'indoor': ['shopping_mall', 'museum', 'movie_theater', 'bowling_alley', 'library', 'aquarium'],
  'cultural': ['museum', 'art_gallery', 'tourist_attraction'],
  'entertainment': ['amusement_park', 'movie_theater', 'casino', 'stadium', 'bowling_alley'],
  'culinary': ['restaurant', 'cafe', 'bakery', 'bar'],
  'sports': ['stadium', 'gym', 'sports_complex', 'bowling_alley'],
  'educational': ['museum', 'library', 'university', 'school', 'aquarium', 'zoo'],
  'nightlife': ['night_club', 'bar', 'casino'],
  'wellness': ['spa', 'gym', 'beauty_salon', 'health', 'yoga'],
  'other': ['point_of_interest', 'establishment']
};

// Default radius for searches in meters
const DEFAULT_RADIUS = 10000; // 10km

/**
 * Search for activities in an area using Google Places API
 * @param filters Filters to apply (type, query, etc.)
 * @param center Center location for the search
 * @param radius Radius of search in meters
 * @returns Promise with array of leisure activities
 */
export async function searchActivities(
  filters?: any, 
  center = DEFAULT_CENTER, 
  radius = DEFAULT_RADIUS
): Promise<LeisureActivity[]> {
  if (!isMapsApiAvailable()) {
    console.error('Google Maps API key is missing');
    return [];
  }

  try {
    console.log('Searching for activities with filters:', filters);
    
    // Check if Maps API is available
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.error('Google Maps API not loaded properly');
      // Wait for the Maps API to load
      await getMapsLoader().load();
      console.log('Google Maps API loaded');
    }
    
    // Create a PlacesService instance
    const placesServiceDiv = document.createElement('div');
    document.body.appendChild(placesServiceDiv); // Need to append to DOM for Places service to work
    
    console.log('Creating PlacesService instance');
    const placesService = new google.maps.places.PlacesService(placesServiceDiv);
    console.log('PlacesService created');
    
    if (!placesService) {
      console.error('Failed to create PlacesService instance');
      return [];
    }
    
    let activities: LeisureActivity[] = [];
    const activityTypes = (filters?.type && filters.type.length > 0) ? 
      filters.type : 
      Object.keys(TYPE_TO_PLACES_TYPES);

    // For each selected activity type, search Google Places
    for (const activityType of activityTypes) {
      const placeTypes = TYPE_TO_PLACES_TYPES[activityType] || ['point_of_interest'];
      
      // For each place type associated with this activity type
      for (const placeType of placeTypes) {
        // Skip if we already have enough results for this type
        if (activities.filter(a => a.type === activityType).length >= 5) {
          break;
        }

        const request: google.maps.places.PlaceSearchRequest = {
          location: new google.maps.LatLng(center.lat, center.lng),
          radius,
          type: placeType, // Using string type instead of PlaceType enum
          keyword: filters?.query || ''
        };
        
        console.log(`Searching for ${placeType} places with radius ${radius}m`);
        console.log('Search request:', request);

        try {
          const places = await searchPlaces(placesService, request);
          
          // Get details for each place and convert to LeisureActivity
          for (const place of places) {
            // Skip if we don't have a place_id
            if (!place.place_id) continue;
            
            // Skip if this place was already added (might be returned for multiple types)
            if (activities.some(a => a.id === place.place_id)) continue;

            // Get detailed information about the place
            const details = await getPlaceDetails(place.place_id);
            if (!details) continue;

            // Create a LeisureActivity from the place details
            const activity: LeisureActivity = {
              id: place.place_id,
              title: place.name || "",
              description: place.vicinity || "",
              type: activityType,
              location: {
                address: details.formattedAddress || place.vicinity || "",
                coordinates: {
                  lat: place.geometry?.location?.lat() || center.lat,
                  lng: place.geometry?.location?.lng() || center.lng
                }
              },
              schedule: {
                // Default schedule since Google doesn't provide detailed scheduling
                startDate: new Date().toISOString(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
                recurring: true,
                recurrencePattern: "Daily, Hours vary by day"
              },
              price: {
                // Price info based on Google's price level
                isFree: place.price_level === 0,
                cost: place.price_level ? place.price_level * 25 : 0, // Rough estimate
                currency: 'USD',
                level: place.price_level || 0
              },
              contactInfo: {
                phone: details.internationalPhoneNumber || "",
                website: details.website || details.url || ""
              },
              images: details.photos || ["/placeholder-image.jpg"],
              rating: details.rating || 0,
              // Get categories from types if available
              tags: place.types?.filter(t => t !== 'establishment' && t !== 'point_of_interest') || [],
              // Add Google details for sorting and filtering
              googleDetails: {
                placeId: place.place_id || "",
                rating: place.rating || 0,
                userRatingsTotal: place.user_ratings_total || 0,
                priceLevel: place.price_level || 0,
                types: place.types || [],
                url: details.url || "",
                website: details.website || "",
                formattedAddress: details.formattedAddress || "",
                vicinity: place.vicinity || "",
                photos: details.photos || []
              }
            };
            
            activities.push(activity);
          }
        } catch (error) {
          console.error(`Error searching for ${placeType} places:`, error);
        }
      }
    }

    // Apply additional filters if needed
    if (filters?.query) {
      const query = filters.query.toLowerCase();
      activities = activities.filter(activity => 
        activity.title.toLowerCase().includes(query) || 
        activity.description.toLowerCase().includes(query) ||
        activity.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Ensure we have at least 5 results per activity type when possible
    return activities;
  } catch (error) {
    console.error('Error searching for activities:', error);
    return [];
  }
}

/**
 * Helper function to search for places
 */
function searchPlaces(
  service: google.maps.places.PlacesService, 
  request: google.maps.places.PlaceSearchRequest
): Promise<google.maps.places.PlaceResult[]> {
  return new Promise((resolve, reject) => {
    service.nearbySearch(request, (results, status) => {
      console.log(`Places API returned status: ${status}`);
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        console.log(`Found ${results.length} places:`, results.map(r => r.name));
        resolve(results);
      } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        console.log('No places found for this search');
        resolve([]);
      } else {
        console.warn(`Places search failed with status: ${status}`, request);
        // Try a fallback search without the type restriction
        if (request.type) {
          console.log('Trying fallback search without type restriction');
          const fallbackRequest = {...request};
          delete fallbackRequest.type;
          
          service.nearbySearch(fallbackRequest, (fallbackResults, fallbackStatus) => {
            console.log(`Fallback search status: ${fallbackStatus}`);
            if (fallbackStatus === google.maps.places.PlacesServiceStatus.OK && fallbackResults) {
              console.log(`Found ${fallbackResults.length} places in fallback search`);
              resolve(fallbackResults);
            } else {
              console.error('Both original and fallback searches failed');
              resolve([]);
            }
          });
        } else {
          resolve([]);
        }
      }
    });
  });
}
