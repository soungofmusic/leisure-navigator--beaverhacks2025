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
    const mapsKeyPresent = !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const placesKeyPresent = !!process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
    console.log('Google Maps API Keys loaded:', { mapsKeyPresent, placesKeyPresent });
    setApiKeysLoaded(mapsKeyPresent && placesKeyPresent);
  }, []);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(
    center || preferences.location || { lat: 45.5152, lng: -122.6784 } // Default to Portland, OR if no saved location
  );
  const [zoom, setZoom] = useState(13);

  const handlePlaceSelect = (place: { address: string; coordinates: { lat: number; lng: number } }) => {
    setMapCenter(place.coordinates);
    setZoom(15); // Zoom in when a specific place is selected
  };
  
  // Update map center when the center prop changes
  useEffect(() => {
    if (center) {
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

  // Get current location and update map center
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
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
  
  // Prompt user to share location if they haven't been prompted yet
  useEffect(() => {
    if (!locationPrompted && showCurrentLocation) {
      setLocationPrompted(true);
      
      // Check if user already has a saved location
      const hasLocation = !!preferences?.location?.lat;
      
      if (!hasLocation) {
        // Ask user to share location using browser dialog
        const shareLocation = window.confirm(
          'Would you like to share your location to find activities near you?'
        );
        
        if (shareLocation) {
          getCurrentLocation();
        }
      }
    }
  }, [preferences?.location, locationPrompted, showCurrentLocation]);

  return (
    <div className="w-full">
      {showSearch && (
        <div className="mb-4">
          <PlacesAutocomplete onPlaceSelect={handlePlaceSelect} placeholder="Search for activities near a location" />
        </div>
      )}
      
      <div className="relative">
        <Map 
          center={mapCenter} 
          zoom={zoom} 
          markers={markers}
          onMarkerClick={onMarkerClick}
          height={height}
          showSearchThisArea={showSearchThisArea}
          onBoundsChanged={handleAreaSearch}
        />
        
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
                <span>Share My Location</span>
              </button>
              
              <button 
                onClick={() => handleSaveCurrentLocation()}
                className="px-3 py-2 text-sm font-medium text-primary-700 bg-white border border-primary-300 rounded-md shadow-md hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Save current location"
              >
                Save as My Location
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoogleMapsIntegration;
