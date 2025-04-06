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
  onBoundsChanged?: (boundsData: { 
    center: { lat: number; lng: number }; 
    radius: number;
    bounds: google.maps.LatLngBounds;
  }) => void;
  onCenterChanged?: (center: { lat: number; lng: number }) => void;
  showSearchThisArea?: boolean;
  height?: string;
}

const Map: React.FC<MapProps> = ({
  center = { lat: 45.5152, lng: -122.6784 }, // Default to Portland, OR
  zoom = 10,
  markers = [],
  height = '400px',
  showSearchThisArea = false,
  onMarkerClick,
  onBoundsChanged,
  onMapClick,
  onCenterChanged,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [markerInstances, setMarkerInstances] = useState<google.maps.Marker[]>([]);
  const [activeInfoWindow, setActiveInfoWindow] = useState<google.maps.InfoWindow | null>(null);
  const [apiLoaded, setApiLoaded] = useState(false);
  const [mapBounds, setMapBounds] = useState<google.maps.LatLngBounds | null>(null);
  const [showSearchButton, setShowSearchButton] = useState(false);

  // State for search this area button
  const searchButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      console.log('Initializing map...');
      // Check if Maps API is available using our utility function
      if (!isMapsApiAvailable()) {
        console.log('Google Maps API key is missing');
        setApiLoaded(false);
        return;
      }
      
      // Get the shared loader instance
      const loader = getMapsLoader();
      
      try {
        await loader.load();
        console.log('Google Maps API loaded successfully');
        setApiLoaded(true);
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        setApiLoaded(false);
      }
    };

    initMap();
  }, []);

  useEffect(() => {
    if (!apiLoaded || !mapRef.current) return;
    
    console.log('Creating map instance with center:', center);
    // Initialize map once the API is loaded
    try {
      const map = new google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapTypeControl: false,
        fullscreenControl: true,
        streetViewControl: false,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP,
        },
      });

      console.log('Map instance created successfully');
      setMapInstance(map);
      
      // Create an InfoWindow instance
      const infoWindow = new google.maps.InfoWindow();
      setActiveInfoWindow(infoWindow);

    } catch (error) {
      console.error('Error creating map instance:', error);
    }
  }, [apiLoaded, center, zoom, mapRef]);

  useEffect(() => {
    if (!mapInstance) return;

    // Only add bounds_changed listener if onBoundsChanged callback is provided
    if (onBoundsChanged) {
      mapInstance.addListener('bounds_changed', () => {
        const bounds = mapInstance.getBounds();
        
        if (bounds) {
          const center = mapInstance.getCenter();
          // Approximate radius calculation in meters
          const ne = bounds.getNorthEast();
          
          if (center && ne) {
            const radius = haversineDistance(
              { lat: center.lat(), lng: center.lng() },
              { lat: ne.lat(), lng: ne.lng() }
            );
            
            onBoundsChanged({
              center: { lat: center.lat(), lng: center.lng() },
              radius,
              bounds
            });
          }
        }
      });
    }  
    // Only add center_changed listener if onCenterChanged callback is provided
    if (onCenterChanged) {
      console.log('Adding center_changed listener');
      mapInstance.addListener('center_changed', () => {
        const newCenter = mapInstance.getCenter();
        if (newCenter) {
          const centerObj = {
            lat: newCenter.lat(),
            lng: newCenter.lng()
          };
          console.log('Map center changed:', centerObj);
          onCenterChanged(centerObj);
        }
      });
    }
    
    // Add click event listener if onMapClick is provided
    if (onMapClick) {
      mapInstance.addListener('click', (e: google.maps.MapMouseEvent) => {
        onMapClick(e);
      });
    }
    
    // Cleanup function
    return () => {
      // Cleanup happens in other useEffect hooks
      google.maps.event.clearInstanceListeners(mapInstance);
    };
  }, [apiLoaded, onBoundsChanged, onMapClick, onCenterChanged]);

  // Calculate distance in meters between two points
  const haversineDistance = (p1: { lat: number; lng: number }, p2: { lat: number; lng: number }) => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371000; // Earth radius in meters

    const dLat = toRad(p2.lat - p1.lat);
    const dLng = toRad(p2.lng - p1.lng);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(p1.lat)) * Math.cos(toRad(p2.lat)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Only create or update markers when the map, markers array, or activeInfoWindow changes
  useEffect(() => {
    if (!mapInstance || !activeInfoWindow) return;
    
    console.log('Setting up markers:', markers.length);
    
    // Clear existing markers only once at the beginning of the effect
    markerInstances.forEach((marker) => marker.setMap(null));
    
    // Create new markers array for tracking
    const newMarkers: google.maps.Marker[] = [];
    
    // Setup markers if they exist
    if (markers.length > 0) {
      markers.forEach((markerData) => {
        // Create the marker
        const marker = new google.maps.Marker({
          position: markerData.position,
          map: mapInstance,
          title: markerData.title,
          // Remove animation to prevent flickering
          animation: undefined
        });
        
        // Track the new marker
        newMarkers.push(marker);

        // Add click event for markers if callback provided
        if (onMarkerClick) {
          marker.addListener('click', () => {
            if (onMarkerClick) {
              onMarkerClick(markerData.id);
            }
            
            if (activeInfoWindow && markerData.description) {
              activeInfoWindow.setContent(
                `<div class="p-2">
                  <h3 class="font-medium text-base">${markerData.title}</h3>
                  ${markerData.description ? `<p class="text-sm mt-1">${markerData.description}</p>` : ''}
                </div>`
              );
              activeInfoWindow.open(mapInstance, marker);
            }
          });
        }
      });
      
      // Update state with new markers array
      setMarkerInstances(newMarkers);
    }
    
    // Only clean up when component unmounts or dependencies change
    return () => {
      console.log('Cleaning up markers:', newMarkers.length);
      newMarkers.forEach(marker => marker.setMap(null));
    };
  }, [mapInstance, markers, onMarkerClick, activeInfoWindow]);

  useEffect(() => {
    if (mapInstance) {
      mapInstance.setCenter(center);
      mapInstance.setZoom(zoom);
    }
  }, [center, zoom, mapInstance]);

  if (!apiLoaded) {
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

  // Calculate the radius from the bounds in meters
  const calculateRadiusFromBounds = (bounds: google.maps.LatLngBounds): number => {
    if (!bounds) return 10000; // Default 10km radius
    
    // Get northeast and southwest corners
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    
    // Calculate center
    const center = new google.maps.LatLng(
      (ne.lat() + sw.lat()) / 2,
      (ne.lng() + sw.lng()) / 2
    );
    
    // Calculate distance from center to northeast corner (diagonal half-width)
    const radiusInMeters = google.maps.geometry.spherical.computeDistanceBetween(
      center,
      ne
    );
    
    return radiusInMeters;
  };

  // Handle search this area button click
  const handleSearchThisArea = () => {
    if (!mapBounds || !mapInstance || !onBoundsChanged) return;
    
    const center = mapBounds.getCenter();
    const radius = calculateRadiusFromBounds(mapBounds);
    
    onBoundsChanged({
      center: { lat: center.lat(), lng: center.lng() },
      radius,
      bounds: mapBounds
    });
    
    // Hide button after search
    setShowSearchButton(false);
  };

  return (
    <div style={{ position: 'relative', height, width: '100%' }}>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
      
      {/* Search This Area button */}
      {showSearchThisArea && showSearchButton && onBoundsChanged && (
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          zIndex: 1000 
        }}>
          <button
            onClick={handleSearchThisArea}
            className="px-4 py-2 font-medium text-white bg-primary-600 rounded-md shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
          >
            Search This Area
          </button>
        </div>
      )}
    </div>
  );
};

export default Map;
