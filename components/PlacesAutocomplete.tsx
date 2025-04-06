'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface PlacesAutocompleteProps {
  onPlaceSelect: (place: {
    address: string;
    coordinates: { lat: number; lng: number };
  }) => void;
  placeholder?: string;
  className?: string;
}

const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = ({
  onPlaceSelect,
  placeholder = 'Search for a location',
  className = '',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.GOOGLE_PLACES_API_KEY || '',
      version: 'weekly',
      libraries: ['places'],
    });

    loader.load().then(() => {
      setLoaded(true);
    }).catch(err => {
      console.error('Error loading Google Places API', err);
    });
  }, []);

  useEffect(() => {
    if (!loaded || !inputRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ['establishment', 'geocode'],
      fields: ['address_components', 'formatted_address', 'geometry', 'name'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      
      if (!place.geometry || !place.geometry.location) {
        console.error('No details available for this place');
        return;
      }

      const formattedAddress = place.formatted_address || place.name || '';
      const coordinates = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };

      onPlaceSelect({
        address: formattedAddress,
        coordinates,
      });
    });

    return () => {
      // Cleanup if needed
      google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [loaded, onPlaceSelect]);

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${className}`}
        disabled={!loaded}
      />
      {!loaded && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="w-5 h-5 border-t-2 border-primary-500 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default PlacesAutocomplete;
