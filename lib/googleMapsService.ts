import { Loader } from '@googlemaps/js-api-loader';

// Singleton pattern to ensure we only create one loader instance
let mapsLoader: Loader | null = null;

// Get consistent API keys
export const getMapsApiKey = (): string => {
  return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 
         process.env.GOOGLE_MAPS_API_KEY || 
         '';
};

export const getPlacesApiKey = (): string => {
  return process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || 
         process.env.GOOGLE_PLACES_API_KEY || 
         '';
};

// Get consistent Maps loader
export const getMapsLoader = (): Loader => {
  if (!mapsLoader) {
    // Prioritize Maps API key, fallback to Places API key if needed
    const apiKey = getMapsApiKey() || getPlacesApiKey();
    
    mapsLoader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places'],
    });
    
    console.log('Created new Google Maps loader instance');
  }
  
  return mapsLoader;
};

// Check if Google Maps API key is available
export const isMapsApiAvailable = (): boolean => {
  return !!getMapsApiKey() || !!getPlacesApiKey();
};
