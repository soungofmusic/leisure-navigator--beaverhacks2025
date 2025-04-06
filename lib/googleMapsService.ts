import { Loader } from '@googlemaps/js-api-loader';

// Singleton pattern to ensure we only create one loader instance
let mapsLoader: Loader | null = null;

// Get Maps API key
export const getMapsApiKey = (): string => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || 
                process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 
                '';
  
  console.log('Google Maps API Key:', apiKey ? apiKey.substring(0, 6) + '...' : 'Not found');
  return apiKey;
};

// Get Places API key
export const getPlacesApiKey = (): string => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY || 
               process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || 
               '';
  
  console.log('Google Places API Key:', apiKey ? apiKey.substring(0, 6) + '...' : 'Not found');
  return apiKey;
};

// Get consistent Maps loader
export const getMapsLoader = (): Loader => {
  if (!mapsLoader) {
    // Prioritize Maps API key, fallback to Places API key if needed
    const apiKey = getMapsApiKey() || getPlacesApiKey();
    
    mapsLoader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places', 'geometry'],
    });
    
    console.log('Created new Google Maps loader instance with places and geometry libraries');
  }
  
  return mapsLoader;
};

// Check if Google Maps API key is available
export const isMapsApiAvailable = (): boolean => {
  const mapsKeyPresent = !!getMapsApiKey();
  const placesKeyPresent = !!getPlacesApiKey();
  console.log('Maps API available check:', { mapsKeyPresent, placesKeyPresent });
  return mapsKeyPresent || placesKeyPresent;
};
