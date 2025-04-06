'use client';

import React, { useState } from 'react';
import Map from './Map';
import PlacesAutocomplete from './PlacesAutocomplete';
import { useUser } from '@/context/UserContext';

interface GoogleMapsIntegrationProps {
  height?: string;
  showSearch?: boolean;
  showCurrentLocation?: boolean;
  markers?: Array<{
    position: { lat: number; lng: number };
    title: string;
    description?: string;
    id: string;
  }>;
  onMarkerClick?: (markerId: string) => void;
}

const GoogleMapsIntegration: React.FC<GoogleMapsIntegrationProps> = ({
  height = '400px',
  showSearch = true,
  showCurrentLocation = true,
  markers = [],
  onMarkerClick,
}) => {
  const { preferences, updatePreferences } = useUser();
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(
    preferences.location || { lat: 45.5152, lng: -122.6784 } // Default to Portland, OR if no saved location
  );
  const [zoom, setZoom] = useState(13);

  const handlePlaceSelect = (place: { address: string; coordinates: { lat: number; lng: number } }) => {
    setMapCenter(place.coordinates);
    setZoom(15); // Zoom in when a specific place is selected
  };

  const handleSaveCurrentLocation = () => {
    if (mapCenter) {
      // Update user preferences with current map center as their location
      updatePreferences({
        ...preferences,
        location: mapCenter
      });
    }
  };

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
        />
        
        {showCurrentLocation && (
          <div className="absolute bottom-4 left-4 flex space-x-2">
            <button 
              onClick={getCurrentLocation}
              className="px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-md shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Get current location"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </button>
            
            <button 
              onClick={handleSaveCurrentLocation}
              className="px-3 py-2 text-sm font-medium text-primary-700 bg-white border border-primary-300 rounded-md shadow-md hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Save current location"
            >
              Save as My Location
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleMapsIntegration;
