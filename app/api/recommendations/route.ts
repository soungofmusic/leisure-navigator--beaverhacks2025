import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { db, collection, doc, getDoc, query, where, getDocs, addDoc } from '../../../lib/firebase';

// Helper function to extract activity types from place details
function extractActivityTypes(place: any): string[] {
  const types = place.types || [];
  const keywords = new Set<string>();
  
  // Map Google Places types to our activity categories
  const typeMapping: Record<string, string[]> = {
    outdoor: ['park', 'campground', 'natural_feature', 'rv_park', 'zoo', 'aquarium', 'hiking_area'],
    indoor: ['shopping_mall', 'library', 'movie_theater', 'bowling_alley', 'spa', 'gym'],
    cultural: ['museum', 'art_gallery', 'tourist_attraction', 'church', 'hindu_temple', 'mosque', 'synagogue'],
    entertainment: ['amusement_park', 'movie_theater', 'night_club', 'casino', 'bowling_alley', 'stadium'],
    culinary: ['restaurant', 'cafe', 'bakery', 'bar', 'food', 'meal_takeaway', 'meal_delivery'],
    sports: ['stadium', 'bowling_alley', 'gym', 'sports_complex', 'swimming_pool'],
    educational: ['museum', 'library', 'university', 'school', 'book_store'],
    nightlife: ['bar', 'night_club', 'casino'],
    wellness: ['spa', 'gym', 'health', 'beauty_salon', 'hair_care']
  };
  
  types.forEach((type: string) => {
    Object.entries(typeMapping).forEach(([category, mappedTypes]) => {
      if (mappedTypes.includes(type)) {
        keywords.add(category);
      }
    });
  });
  
  // Convert Set to Array with explicit typing
  return Array.from(keywords) as string[];
}

// Main function to get personalized recommendations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Use current location if provided, otherwise get user's saved location
    let userLocation;
    if (lat && lng) {
      userLocation = { lat: parseFloat(lat), lng: parseFloat(lng) };
    } else {
      // Get user's preferences from Firestore
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (!userDoc.exists()) {
        return NextResponse.json(
          { success: false, message: 'User not found' },
          { status: 404 }
        );
      }
      
      const userData = userDoc.data();
      if (userData.preferences?.location) {
        userLocation = userData.preferences.location;
      } else {
        return NextResponse.json(
          { success: false, message: 'User location not available' },
          { status: 400 }
        );
      }
    }

    // Get user's preferred activity types and tags
    const userDocResult = await getDoc(doc(db, 'users', userId));
    const userPrefs = userDocResult?.data()?.preferences || {};
    const favoriteTypes = userPrefs.favoriteTypes || [];
    const favoriteTags = userPrefs.favoriteTags || [];
    
    // Get user's activity history
    const historyQuery = query(
      collection(db, 'placeHistory'),
      where('userId', '==', userId)
    );
    const historySnap = await getDocs(historyQuery);
    
    // Get search history
    const searchQuery = query(
      collection(db, 'searchHistory'),
      where('userId', '==', userId)
    );
    const searchSnap = await getDocs(searchQuery);
    
    // Extract and analyze user patterns
    const viewedPlaces = new Set<string>();
    const placeTypes = new Map<string, number>();
    
    historySnap.forEach(doc => {
      const data = doc.data();
      viewedPlaces.add(data.placeId);
    });
    
    searchSnap.forEach(doc => {
      const data = doc.data();
      if (data.searchParams.type) {
        placeTypes.set(
          data.searchParams.type, 
          (placeTypes.get(data.searchParams.type) || 0) + 1
        );
      }
    });
    
    // Sort activity types by frequency
    const sortedTypes = Array.from(placeTypes.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([type]) => type);
    
    // Combine user preferences and behavior for recommendation
    // Using Array.from instead of spread operator to be compatible with all TS targets
    const combinedTypes = [...favoriteTypes, ...sortedTypes.slice(0, 3)];
    const uniqueTypesSet = new Set(combinedTypes);
    const recommendationTypes = Array.from(uniqueTypesSet);
    
    // If no preferences or history, use default popular categories
    if (recommendationTypes.length === 0) {
      recommendationTypes.push('tourist_attraction', 'restaurant', 'museum');
    }
    
    // Check for API key
    const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      console.error('No Google Places API key available.');
      return NextResponse.json(
        {
          success: false,
          message: 'Google Places API key is missing. Please add it to your .env file.',
        },
        { status: 400 }
      );
    }

    // Get recommendations for each type
    const recommendationsPromises = recommendationTypes.slice(0, 3).map(async (type) => {
      const params = new URLSearchParams();
      params.append('location', `${userLocation.lat},${userLocation.lng}`);
      params.append('radius', '10000'); // 10km radius
      params.append('type', type);
      params.append('key', apiKey);
      
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params.toString()}`;
      const response = await axios.get(url);
      
      if (response.data.status === 'OK') {
        return response.data.results
          .filter((place: any) => !viewedPlaces.has(place.place_id))
          .slice(0, 5)
          .map((place: any) => ({
            ...place,
            activityTypes: extractActivityTypes(place),
            recommendedBecause: [
              favoriteTypes.includes(type) ? 'matches your preferred activities' : null,
              sortedTypes.includes(type) ? 'based on your search history' : null
            ].filter(Boolean)
          }));
      }
      return [];
    });
    
    const recommendationsArrays = await Promise.all(recommendationsPromises);
    
    // Combine and deduplicate recommendations
    const seen = new Set<string>();
    const combinedRecommendations = recommendationsArrays
      .flat()
      .filter(place => {
        if (seen.has(place.place_id)) return false;
        seen.add(place.place_id);
        return true;
      })
      .slice(0, limit);
    
    // Log this recommendation request
    try {
      await addDoc(collection(db, 'recommendationHistory'), {
        userId,
        timestamp: new Date().toISOString(),
        location: userLocation,
        baseTypes: recommendationTypes,
        resultCount: combinedRecommendations.length
      });
    } catch (error) {
      console.error('Error logging recommendation to history:', error);
      // Continue execution even if logging fails
    }

    return NextResponse.json({
      success: true,
      data: combinedRecommendations,
      count: combinedRecommendations.length,
      baseTypes: recommendationTypes
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error generating recommendations',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
