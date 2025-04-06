import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@googlemaps/google-maps-services-js';
import { LeisureActivity, ActivityType } from '../../../types';
import { mockLeisureActivities } from '../../../lib/mockData';

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

// Default center location for Portland, OR
const DEFAULT_CENTER = {
  lat: 45.5152,
  lng: -122.6784
};

// Default radius for searches in meters
const DEFAULT_RADIUS = 10000; // 10km

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const client = new Client({});
  
  // Get filters from URL params
  // Type filter (can be multiple values)
  const typeParam = searchParams.getAll('type');
  const activityTypes = typeParam.length > 0 ? typeParam : Object.keys(TYPE_TO_PLACES_TYPES);
  
  // Location filter
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const locationCenter = (lat && lng) ? 
    { lat: parseFloat(lat), lng: parseFloat(lng) } : 
    DEFAULT_CENTER;
  
  // Search query
  const query = searchParams.get('query') || '';
  
  // Radius in meters
  const radius = searchParams.get('radius');
  const searchRadius = radius ? parseInt(radius) : DEFAULT_RADIUS;
  
  try {
    // Log the environment variables we have (safely)
    console.log('Environment check:');
    console.log(`GOOGLE_PLACES_API_KEY present: ${!!process.env.GOOGLE_PLACES_API_KEY}`);
    console.log(`NEXT_PUBLIC_GOOGLE_PLACES_API_KEY present: ${!!process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`);
    console.log(`GOOGLE_MAPS_API_KEY present: ${!!process.env.GOOGLE_MAPS_API_KEY}`);
    console.log(`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY present: ${!!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`);

    // If no API keys, return an error
    if (!process.env.GOOGLE_PLACES_API_KEY && !process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY) {
      console.error('No Google Places API key available. Please add it to your .env file.');
      return NextResponse.json(
        {
          success: false,
          message: 'Google Places API key is missing. Please add it to your .env file.',
          data: []
        },
        { status: 400 }
      );
    }
    
    const activities: LeisureActivity[] = [];
    const processedPlaceIds = new Set<string>();
    
    console.log(`Searching for activities with types: ${activityTypes.join(', ')}`);
    console.log(`Location: ${locationCenter.lat}, ${locationCenter.lng} with radius ${searchRadius}m`);
    
    // For each activity type, search for places
    for (const activityType of activityTypes) {
      const placeTypes = TYPE_TO_PLACES_TYPES[activityType] || ['point_of_interest'];
      
      // We need at least 5 results per type
      const resultsNeeded = 5 - activities.filter(a => a.type === activityType).length;
      if (resultsNeeded <= 0) continue;
      
      // Try each place type until we get enough results
      for (const placeType of placeTypes) {
        // Skip if we already have enough results for this type
        if (activities.filter(a => a.type === activityType).length >= 5) break;
        
        try {
          console.log(`Searching for ${placeType} places as ${activityType}`);
          
          // Get the API key and check if it's available
          const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || '';
          if (!apiKey) {
            console.error('No Google Places API key found!');
            continue; // Skip this place type if no API key
          }
          
          console.log(`Using API key: ${apiKey.substring(0, 5)}...`);
          console.log(`Making request to Google Places API for ${placeType} places...`);
            
          const response = await client.placesNearby({
            params: {
              location: [locationCenter.lat, locationCenter.lng],
              radius: searchRadius,
              type: placeType as any,
              keyword: query,
              key: apiKey
            },
            timeout: 5000
          });
          
          console.log(`Google Places API response status: ${response.data.status}`);
          
          if (response.data.status === 'OK' && response.data.results) {
            console.log(`Found ${response.data.results.length} ${placeType} places`);
            
            // Process each place and convert to LeisureActivity
            for (const place of response.data.results) {
              // Skip places we've already processed (might be returned for multiple types)
              if (processedPlaceIds.has(place.place_id)) continue;
              processedPlaceIds.add(place.place_id);
              
              // Get photo reference if available
              let photoUrl = '/placeholder-image.jpg';
              if (place.photos && place.photos.length > 0 && place.photos[0].photo_reference && apiKey) {
                photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`;
              }
              
              // Calculate price based on place.price_level which is 0-4
              // 0: Free, 1: Inexpensive, 2: Moderate, 3: Expensive, 4: Very Expensive
              let isFree = false;
              let cost = 0;
              
              // Set price estimates based on activity type and price level
              if (place.price_level !== undefined) {
                isFree = place.price_level === 0;
                
                // Estimated cost ranges based on type and price_level
                const priceEstimates: Record<ActivityType, number[]> = {
                  'outdoor': [0, 5, 15, 30, 60],
                  'indoor': [0, 10, 25, 45, 80],
                  'cultural': [0, 15, 30, 50, 100],
                  'entertainment': [0, 20, 45, 80, 150],
                  'sports': [0, 15, 40, 75, 120],
                  'culinary': [0, 15, 35, 75, 150],
                  'educational': [0, 12, 25, 40, 80],
                  'nightlife': [0, 25, 50, 100, 200],
                  'wellness': [0, 30, 60, 100, 180],
                  'other': [0, 15, 30, 60, 100]
                };
                
                // Get prices for this activity type or use 'other' as fallback
                const pricesForType = priceEstimates[activityType as ActivityType] || priceEstimates['other'];
                
                // Use the price level index (0-4) to get the appropriate cost estimate
                cost = pricesForType[place.price_level];
                
                // For specific types, check if they tend to be free
                if (['park', 'library', 'university', 'natural_feature'].includes(placeType)) {
                  // Parks, libraries, etc. are often free even if Google doesn't specify
                  isFree = place.price_level <= 1;
                  if (isFree) cost = 0;
                }
              } else {
                // Fallback logic if price_level is not available
                switch (activityType) {
                  case 'outdoor':
                    // Many outdoor activities tend to be free or inexpensive
                    isFree = ['park', 'natural_feature', 'campground'].includes(placeType);
                    cost = isFree ? 0 : 15;
                    break;
                  case 'cultural':
                    // Museums and cultural sites typically charge admission
                    isFree = false;
                    cost = 25;
                    break;
                  case 'culinary':
                    // Restaurants and food places are rarely free
                    isFree = false;
                    cost = 30;
                    break;
                  case 'nightlife':
                    // Nightlife tends to be more expensive
                    isFree = false;
                    cost = 50;
                    break;
                  case 'indoor':
                    // Indoor activities vary widely
                    isFree = ['library'].includes(placeType);
                    cost = isFree ? 0 : 20;
                    break;
                  default:
                    // Default reasonable estimate
                    isFree = place.business_status === 'CLOSED_PERMANENTLY';
                    cost = isFree ? 0 : 25;
                }
              }
              
              console.log(`Price for ${place.name}: isFree=${isFree}, cost=${cost}, price_level=${place.price_level || 'unknown'}`);
              
              // Convert place to LeisureActivity format
              const activity: LeisureActivity = {
                id: place.place_id,
                title: place.name,
                description: place.vicinity || `A ${activityType} activity in Portland.`,
                type: activityType as ActivityType, // Cast to ActivityType
                location: {
                  address: place.vicinity || '',
                  coordinates: {
                    lat: place.geometry?.location?.lat || locationCenter.lat,
                    lng: place.geometry?.location?.lng || locationCenter.lng
                  }
                },
                schedule: {
                  startDate: new Date().toISOString(),
                  endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
                  recurring: true,
                  recurrencePattern: 'Hours vary by day'
                },
                price: {
                  isFree: isFree,
                  cost: cost,
                  currency: 'USD'
                },
                contactInfo: {
                  phone: '',
                  website: ''
                },
                images: [photoUrl],
                rating: place.rating || 0,
                tags: [...new Set([...place.types || [], activityType])]
              };
              
              activities.push(activity);
              
              // Break if we have enough activities for this type
              if (activities.filter(a => a.type === activityType).length >= 5) break;
            }
          } else {
            console.warn(`No ${placeType} places found: ${response.data.status}`);
          }
        } catch (typeError) {
          console.error(`Error searching for ${placeType} places:`, typeError);
        }
      }
    }
    
    console.log(`Returning ${activities.length} activities`);
    
    return NextResponse.json({
      success: true,
      count: activities.length,
      data: activities
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    
    // Return mock data as fallback if available
    if (mockLeisureActivities && mockLeisureActivities.length > 0) {
      console.log('Returning mock activities as fallback data');
      return NextResponse.json({
        success: true,
        count: mockLeisureActivities.length,
        data: mockLeisureActivities,
        source: 'fallback'
      });
    }
    
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching activities',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
