import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { db, addDoc, collection } from '@/lib/firebase';
import { FirebaseError } from 'firebase/app';

// Fetches detailed place information using Google Places API
export async function GET(request: NextRequest) {
  try {
    // Get place ID from query parameters
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get('placeId');
    const userId = searchParams.get('userId');

    if (!placeId) {
      return NextResponse.json(
        { success: false, message: 'Place ID is required' },
        { status: 400 }
      );
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

    // Make request to Google Places API - Details endpoint
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,geometry,formatted_phone_number,website,opening_hours,price_level,rating,user_ratings_total,reviews,photos,editorial_summary,url&key=${apiKey}`;
    
    const detailsResponse = await axios.get(detailsUrl);
    
    if (detailsResponse.data.status !== 'OK') {
      return NextResponse.json(
        { 
          success: false, 
          message: `Google Places API error: ${detailsResponse.data.status}`,
          error: detailsResponse.data.error_message 
        },
        { status: 500 }
      );
    }

    const placeDetails = detailsResponse.data.result;
    
    // Process photos to include URLs
    if (placeDetails.photos && placeDetails.photos.length > 0) {
      placeDetails.photos = placeDetails.photos.map((photo: any) => ({
        ...photo,
        url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${apiKey}`
      }));
    }
    
    // Log the search in activity history if userId is provided
    if (userId && db) {
      try {
        // Safely wrap Firebase operations
        const safeCollection = () => {
          try {
            return collection(db, 'placeHistory');
          } catch (e) {
            console.log('Error creating collection reference:', e);
            return null;
          }
        };

        const collectionRef = safeCollection();
        if (collectionRef) {
          try {
            await addDoc(collectionRef, {
              userId,
              placeId,
              placeName: placeDetails.name,
              timestamp: new Date().toISOString(),
              location: placeDetails.geometry?.location || null
            });
          } catch (err) {
            console.log('Firebase write error, skipping logging:', err instanceof FirebaseError ? err.code : err);
          }
        }
      } catch (error) {
        console.error('Error logging place view to history:', error);
        // Continue execution even if logging fails
      }
    }

    return NextResponse.json({
      success: true,
      data: placeDetails
    });
  } catch (error) {
    console.error('Error fetching place details:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching place details',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Fetches nearby places based on location and type
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      location, 
      type, 
      radius = 5000, 
      keyword,
      minPrice,
      maxPrice,
      openNow,
      userId
    } = body;

    if (!location || (!location.lat && !location.lng)) {
      return NextResponse.json(
        { success: false, message: 'Location is required with lat and lng' },
        { status: 400 }
      );
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

    // Build query parameters
    const params = new URLSearchParams();
    params.append('location', `${location.lat},${location.lng}`);
    params.append('radius', radius.toString());
    
    if (type) params.append('type', type);
    if (keyword) params.append('keyword', keyword);
    if (minPrice !== undefined) params.append('minprice', minPrice.toString());
    if (maxPrice !== undefined) params.append('maxprice', maxPrice.toString());
    if (openNow) params.append('opennow', 'true');
    
    params.append('key', apiKey);

    // Make request to Google Places API - Nearby Search endpoint
    const nearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params.toString()}`;
    
    const nearbyResponse = await axios.get(nearbyUrl);
    
    if (nearbyResponse.data.status !== 'OK' && nearbyResponse.data.status !== 'ZERO_RESULTS') {
      return NextResponse.json(
        { 
          success: false, 
          message: `Google Places API error: ${nearbyResponse.data.status}`,
          error: nearbyResponse.data.error_message 
        },
        { status: 500 }
      );
    }

    const places = nearbyResponse.data.results;
    const nextPageToken = nearbyResponse.data.next_page_token;
    
    // Log the search in activity history if userId is provided
    if (userId && db) {
      try {
        // Safely wrap Firebase operations
        const safeCollection = () => {
          try {
            return collection(db, 'searchHistory');
          } catch (e) {
            console.log('Error creating collection reference:', e);
            return null;
          }
        };

        const collectionRef = safeCollection();
        if (collectionRef) {
          try {
            await addDoc(collectionRef, {
              userId,
              searchParams: { location, type, radius, keyword, minPrice, maxPrice, openNow },
              timestamp: new Date().toISOString(),
              resultCount: places.length
            });
          } catch (err) {
            console.log('Firebase write error, skipping logging:', err instanceof FirebaseError ? err.code : err);
          }
        }
      } catch (error) {
        console.error('Error logging search to history:', error);
        // Continue execution even if logging fails
      }
    }

    return NextResponse.json({
      success: true,
      data: places,
      nextPageToken: nextPageToken || null,
      count: places.length
    });
  } catch (error) {
    console.error('Error finding nearby places:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error finding nearby places',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
