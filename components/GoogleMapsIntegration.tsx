'use client';

import React, { useState, useEffect } from 'react';
import Map from './Map';
import PlacesAutocomplete from './PlacesAutocomplete';
import { useUser } from '../context/UserContext';

interface GoogleMapsIntegrationProps {
  height?: string;
  showSearch?: boolean;
  showCurrentLocation?: boolean;
  showSearchThisArea?: boolean;
  markers?: Array<{
    position: { lat: number; lng: number };
    title: string;
    description?: string;
    id: string;
  }>;
  center?: { lat: number; lng: number };
  onMarkerClick?: (markerId: string) => void;
  onAreaSearch?: (searchParams: { 
    center: { lat: number; lng: number }; 
    radius: number;
  }) => void;
}

const GoogleMapsIntegration: React.FC<GoogleMapsIntegrationProps> = ({
  height = '400px',
  showSearch = true,
  showCurrentLocation = true,
  showSearchThisArea = false,
  markers = [],
  center,
  onMarkerClick,
  onAreaSearch,
}) => {
  const { preferences, updatePreferences } = useUser();
  const [apiKeysLoaded, setApiKeysLoaded] = useState(false);
  
  // Check if API keys are available
  useEffect(() => {
    // Use the proper environment variable names from the .env file
    const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 
                   process.env.GOOGLE_MAPS_API_KEY || '';
    const placesKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || 
                     process.env.GOOGLE_PLACES_API_KEY || '';
    
    const mapsKeyPresent = !!mapsKey;
    const placesKeyPresent = !!placesKey;
    
    console.log('Google Maps API Keys availability:', { 
      mapsKeyPresent, 
      placesKeyPresent,
      mapsKeyPrefix: mapsKey ? mapsKey.substring(0, 5) + '...' : 'Not found',
      placesKeyPrefix: placesKey ? placesKey.substring(0, 5) + '...' : 'Not found'
    });
    
    // Only need one key since we're using the same key for both services
    setApiKeysLoaded(mapsKeyPresent || placesKeyPresent);
  }, []);
  
  // Safely initialize map center with fallbacks to ensure it's never undefined
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(
    center || 
    (preferences.location && preferences.location.lat && preferences.location.lng
      ? { lat: preferences.location.lat, lng: preferences.location.lng }
      : { lat: 45.5152, lng: -122.6784 }) // Default to Portland, OR if no saved location
  );
  // Track when user manually moves the map
  const [userMovedMap, setUserMovedMap] = useState(false);
  const [zoom, setZoom] = useState(13);

  const handlePlaceSelect = (place: { address: string; coordinates: { lat: number; lng: number } }) => {
    setMapCenter(place.coordinates);
    setZoom(15); // Zoom in when a specific place is selected
  };
  
  // Update map center when the center prop changes
  useEffect(() => {
    if (center) {
      console.log('Center prop changed, updating map center:', center);
      setMapCenter(center);
    }
  }, [center]);

  const handleSaveCurrentLocation = (location = mapCenter) => {
    if (location) {
      // Update user preferences with provided location (or current map center) as their location
      updatePreferences({
        ...preferences,
        location
      });
    }
  };
  
  // Handle Search This Area button click
  const handleAreaSearch = (boundsData: {
    center: { lat: number; lng: number };
    radius: number;
    bounds: google.maps.LatLngBounds;
  }) => {
    if (onAreaSearch) {
      // Update map center
      setMapCenter(boundsData.center);
      
      // Call the parent handler with search parameters
      onAreaSearch({
        center: boundsData.center,
        radius: boundsData.radius
      });
    }
  };

  const [locationPrompted, setLocationPrompted] = useState(false);
  // Create a ref to track if geolocation has been requested (persists between renders)
  const [locationPermissionRequested, setLocationPermissionRequested] = useState(false);

  // Get current location and update map center
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      // Only show the browser permission dialog if it hasn't been shown before
      if (!locationPermissionRequested) {
        setLocationPermissionRequested(true);
        console.log('First time requesting location permission');
      } else {
        console.log('Using existing location permission');
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setMapCenter(currentLocation);
          setZoom(15);
          
          // Save as user location if user preferences exist
          if (preferences) {
            handleSaveCurrentLocation(currentLocation);
          }
          
          // If this was triggered by the onAreaSearch, call that handler too
          if (onAreaSearch) {
            onAreaSearch({
              center: currentLocation,
              radius: 10000 // Default 10km radius
            });
          }
        },
        (error) => {
          console.error('Error getting current location:', error);
          alert('Unable to retrieve your location. Please enable location services or enter manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };
  
  // No longer automatically prompt for location when component mounts
  // We'll only request location when the user explicitly clicks the button
  useEffect(() => {
    // Just check if the user already has a saved location, but don't prompt
    const hasLocation = !!preferences?.location?.lat && !!preferences?.location?.lng;
    
    if (hasLocation && !locationPrompted) {
      setLocationPrompted(true);
      // If they have a saved location, we can use it without prompting
      if (preferences.location && preferences.location.lat && preferences.location.lng) {
        setMapCenter({
          lat: preferences.location.lat,
          lng: preferences.location.lng
        });
      }
    }
  }, [preferences?.location, locationPrompted]);

  return (
    <div className="w-full">
      {showSearch && (
        <div className="mb-4">
          <PlacesAutocomplete onPlaceSelect={handlePlaceSelect} placeholder="Search for activities near a location" />
        </div>
      )}
      
      <div className="relative">
        {!apiKeysLoaded ? (
          <div className="flex items-center justify-center w-full" style={{height}}>
            <div className="p-4 text-center bg-yellow-100 rounded-md">
              <p className="text-yellow-800 font-medium">Google Maps API keys are not loaded correctly.</p>
              <p className="text-sm text-yellow-700 mt-2">Please check your environment variables.</p>
            </div>
          </div>
        ) : (
          <Map 
            center={mapCenter} 
            zoom={zoom} 
            markers={markers}
            onMarkerClick={onMarkerClick}
            height={height}
            showSearchThisArea={showSearchThisArea}
            onBoundsChanged={handleAreaSearch}
            onCenterChanged={(newCenter) => {
              console.log('Map center changed in GoogleMapsIntegration:', newCenter);
              setMapCenter(newCenter);
              setUserMovedMap(true);
            }}
          />
        )}
        
        <div className="absolute bottom-4 left-4 flex flex-wrap space-x-2 space-y-2">
          {showCurrentLocation && (
            <>
              <button 
                onClick={getCurrentLocation}
                className="px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-md shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center space-x-1"
                aria-label="Get current location"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span>Use My Location</span>
              </button>
              
              <button 
                onClick={() => {
                  handleSaveCurrentLocation();
                  setUserMovedMap(false);
                  // Show feedback toast or alert
                  alert('Location saved successfully!');
                }}
                className={`px-3 py-2 text-sm font-medium ${userMovedMap ? 'text-white bg-blue-600 hover:bg-blue-700' : 'text-primary-700 bg-white hover:bg-primary-50'} border ${userMovedMap ? 'border-blue-500' : 'border-primary-300'} rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                  userMovedMap ? 'animate-pulse' : ''
                }`}
                aria-label="Save current location"
              >
                {userMovedMap ? 'Save This Location' : 'Save as My Location'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoogleMapsIntegration;
