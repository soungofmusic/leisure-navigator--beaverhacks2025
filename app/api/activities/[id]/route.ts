import { NextRequest, NextResponse } from 'next/server';
import { fetchActivityById } from '../../../../lib/mockData';
import { LeisureActivity } from '../../../../types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the activity ID from the URL parameter
    const id = params.id;
    console.log('API route: Fetching activity details for ID:', id);
    
    if (!id) {
      console.log('API route: Missing activity ID');
      return NextResponse.json(
        { error: 'Activity ID is required' },
        { status: 400 }
      );
    }
    
    // Try to fetch from mock data (which works on server-side)
    try {
      const mockActivity = await fetchActivityById(id);
      
      if (mockActivity) {
        console.log('API route: Found activity in mock data:', mockActivity.title);
        return NextResponse.json({ 
          data: mockActivity,
          source: 'mock'
        });
      }
    } catch (mockErr) {
      console.error('API route: Error fetching from mock data:', mockErr);
    }
    
    // If we have a generated ID, attempt to create a dynamic activity
    if (id.startsWith('generated-')) {
      console.log('API route: Creating dynamic activity for generated ID:', id);
      try {
        // Parse type from ID format: generated-{type}-{index}
        const parts = id.split('-');
        if (parts.length >= 3) {
          const activityType = parts[1];
          
          // Create a fallback generic activity
          const dynamicActivity: LeisureActivity = {
            id: id,
            title: `${activityType.charAt(0).toUpperCase() + activityType.slice(1)} Activity`,
            description: `This is a dynamically generated ${activityType} activity based on your search location.`,
            type: activityType as any,
            location: {
              address: 'Near your search location',
              coordinates: { lat: 0, lng: 0 }
            },
            schedule: {
              startDate: new Date().toISOString(),
              endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
              recurring: false
            },
            rating: 4.5,
            tags: [activityType, 'recommended'],
            price: { isFree: false, cost: 0 },
            contactInfo: {},
            images: []
          };
          
          return NextResponse.json({
            data: dynamicActivity,
            source: 'generated'
          });
        }
      } catch (genErr) {
        console.error('API route: Error creating dynamic activity:', genErr);
      }
    }
    
    // If we get here, we couldn't find or create the activity
    console.log('API route: Activity not found and could not be generated');
    return NextResponse.json(
      { error: 'Activity not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('API route: Error fetching activity details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity details', details: String(error) },
      { status: 500 }
    );
  }
}
