import { LeisureActivity } from '@/types';

/**
 * Fetch activities from the server API
 * @param lat - Latitude for activity search
 * @param lng - Longitude for activity search 
 * @param radius - Search radius in meters
 * @returns Promise with array of LeisureActivity objects
 */
export const fetchActivities = async (
  lat: number, 
  lng: number, 
  radius: number = 10000
): Promise<LeisureActivity[]> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.set('lat', lat.toString());
    queryParams.set('lng', lng.toString());
    queryParams.set('radius', radius.toString());
    
    // Use fetch to call our API endpoint with location parameters
    const response = await fetch(`/api/activities?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching activities:', error);
    throw error;
  }
};
