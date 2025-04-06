'use client';

import React, { useRef, useEffect, useState } from 'react';
import { getMapsLoader, isMapsApiAvailable } from '../lib/googleMapsService';

interface MapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    position: { lat: number; lng: number };
    title: string;
    description?: string;
    id: string;
  }>;
  onMarkerClick?: (markerId: string) => void;
  onMapClick?: (e: google.maps.MapMouseEvent) => void;
  height?: string;
}

const Map: React.FC<MapProps> = ({
  center = { lat: 45.5152, lng: -122.6784 }, // Default to Portland, OR
  zoom = 13,
  markers = [],
  onMarkerClick,
  onMapClick,
  height = '500px',
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapMarkers, setMapMarkers] = useState<google.maps.Marker[]>([]);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  useEffect(() => {
    const initMap = async () => {
      // Check if Maps API is available using our utility function
      if (!isMapsApiAvailable()) {
        console.log('Google Maps API key is missing');
        setApiKeyMissing(true);
        return;
      }
      
      // Get the shared loader instance
      const loader = getMapsLoader();
      
      try {
        const google = await loader.load();
        
        if (mapRef.current && !map) {
          const newMap = new google.maps.Map(mapRef.current, {
            center,
            zoom,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
            zoomControl: true,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'on' }],
              },
            ],
          });

          setMap(newMap);
          setInfoWindow(new google.maps.InfoWindow());

          if (onMapClick) {
            newMap.addListener('click', onMapClick);
          }
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        setApiKeyMissing(true);
      }
    };

    initMap();
  }, [center, zoom, onMapClick, map]);

  // Update markers when they change
  useEffect(() => {
    if (!map || !infoWindow) return;

    // Clear existing markers
    mapMarkers.forEach((marker) => marker.setMap(null));
    setMapMarkers([]);

    // Add new markers
    const newMapMarkers = markers.map((markerData) => {
      const marker = new google.maps.Marker({
        position: markerData.position,
        map,
        title: markerData.title,
        animation: google.maps.Animation.DROP,
      });

      marker.addListener('click', () => {
        if (markerData.description) {
          infoWindow.setContent(
            `<div class="info-window">
              <h3 class="font-semibold">${markerData.title}</h3>
              <p>${markerData.description}</p>
            </div>`
          );
          infoWindow.open(map, marker);
        }
        
        if (onMarkerClick) {
          onMarkerClick(markerData.id);
        }
      });

      return marker;
    });

    setMapMarkers(newMapMarkers);

    // Clean up
    return () => {
      newMapMarkers.forEach((marker) => marker.setMap(null));
    };
  }, [map, markers, infoWindow, onMarkerClick]);

  useEffect(() => {
    if (map) {
      map.setCenter(center);
      map.setZoom(zoom);
    }
  }, [center, zoom, map]);

  if (apiKeyMissing) {
    return (
      <div 
        style={{ width: '100%', height }} 
        className="rounded-lg shadow-md bg-gray-100 flex items-center justify-center p-6 text-center"
      >
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Map View Unavailable</h3>
          <p className="text-gray-600 mb-4">
            Google Maps API key is missing. To enable maps, add your API key to the .env.local file:
          </p>
          <div className="bg-gray-200 p-3 rounded-md text-left text-sm font-mono mb-4">
            <p>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here</p>
            <p>NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_api_key_here</p>
            <p className="mt-2 text-xs text-gray-600">Or use non-prefixed versions in your .env file:</p>
            <p>GOOGLE_MAPS_API_KEY=your_api_key_here</p>
            <p>GOOGLE_PLACES_API_KEY=your_api_key_here</p>
          </div>
          <p className="text-gray-500 text-sm">
            Get API keys from the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a>
          </p>
        </div>
      </div>
    );
  }
  
  return <div ref={mapRef} style={{ width: '100%', height }} className="rounded-lg shadow-md" />;
};

export default Map;
