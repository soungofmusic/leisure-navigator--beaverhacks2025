import { NextRequest, NextResponse } from 'next/server';
import { fetchActivityById } from '../../../../lib/mockData';

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
    
    // First try to fetch from mock data (which works on server-side)
    const mockActivity = await fetchActivityById(id);
    
    if (mockActivity) {
      console.log('API route: Found activity in mock data:', mockActivity.title);
      return NextResponse.json({ 
        data: mockActivity,
        source: 'mock'
      });
    }
    
    // For now, we're not going to try to use Google Places API on the server
    // as it requires browser context. Instead, we'll return a not found response
    // and let the client handle direct mock data loading
    console.log('API route: Activity not found in mock data');
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
