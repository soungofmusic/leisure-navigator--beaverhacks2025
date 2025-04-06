'use client';

import React, { useState, useEffect } from 'react';
import { fetchActivities } from '../../lib/mockData';
import { LeisureActivity, ActivityType } from '../../types';
import SearchFilters from '../../components/SearchFilters';
import ActivityCard from '../../components/ActivityCard';
import GoogleMapsIntegration from '../../components/GoogleMapsIntegration';
import { useUser } from '../../context/UserContext';

export default function DiscoverPage() {
  const { preferences } = useUser();
  const [activities, setActivities] = useState<LeisureActivity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<LeisureActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'list' | 'map'>('list');
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(
    preferences.location || {
      lat: 45.5152,
      lng: -122.6784, // Portland, OR
    }
  );

  // Load initial activities
  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        const data = await fetchActivities();
        setActivities(data);
        setFilteredActivities(data);
      } catch (err) {
        setError('Failed to load activities. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  // Handle search queries
  const handleSearch = async (query: string) => {
    try {
      setLoading(true);
      const data = await fetchActivities({ query });
      setFilteredActivities(data);
    } catch (err) {
      setError('Failed to search activities. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = async (filters: {
    types: ActivityType[];
    priceRange: number;
    distance: number;
    location?: { lat: number; lng: number };
  }) => {
    try {
      setLoading(true);
      
      // Update map center if location is provided
      if (filters.location) {
        setMapCenter(filters.location);
      }
      
      // Convert price range to min/max format for the API
      const priceRangeForApi = {
        min: 0,
        max: filters.priceRange
      };
      
      const data = await fetchActivities({
        type: filters.types.length > 0 ? filters.types : undefined,
        priceRange: priceRangeForApi,
        distance: filters.distance,
        location: filters.location,
      });
      
      setFilteredActivities(data);
    } catch (err) {
      setError('Failed to filter activities. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle marker click
  const handleMarkerClick = (activityId: string) => {
    setSelectedActivityId(activityId);
    const activity = activities.find(a => a.id === activityId);
    if (activity) {
      setMapCenter(activity.location.coordinates);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="mb-6 text-3xl font-bold">Discover Activities</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Sidebar with filters */}
        <div className="lg:col-span-1">
          <SearchFilters 
            onSearch={handleSearch} 
            onFilterChange={handleFilterChange}
            defaultLocation={mapCenter}
          />
          
          {/* View toggle */}
          <div className="p-4 mt-4 bg-white rounded-lg shadow-md">
            <h3 className="mb-2 font-medium">View Mode</h3>
            <div className="flex p-1 space-x-1 bg-gray-100 rounded-md">
              <button
                onClick={() => setActiveView('list')}
                className={`flex-1 py-2 text-sm font-medium rounded-md ${
                  activeView === 'list'
                    ? 'bg-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setActiveView('map')}
                className={`flex-1 py-2 text-sm font-medium rounded-md ${
                  activeView === 'map'
                    ? 'bg-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Map View
              </button>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-t-4 rounded-full border-gray-200 border-t-primary-600 animate-spin"></div>
            </div>
          ) : error ? (
            <div className="p-4 text-red-700 bg-red-100 rounded-md">
              <p>{error}</p>
            </div>
          ) : (
            <>
              {activeView === 'list' ? (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    {filteredActivities.length} activities found
                  </p>
                  
                  {filteredActivities.length === 0 ? (
                    <div className="p-8 text-center bg-white rounded-lg shadow-md">
                      <h3 className="mb-2 text-xl font-semibold text-gray-800">No activities found</h3>
                      <p className="text-gray-600">
                        Try adjusting your filters or search for something else.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {filteredActivities.map((activity) => (
                        <ActivityCard key={activity.id} activity={activity} />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg shadow-md">
                  <GoogleMapsIntegration
                    height="600px"
                    showSearch={true}
                    showCurrentLocation={true}
                    markers={filteredActivities.map((activity) => ({
                      id: activity.id,
                      title: activity.title,
                      description: activity.price.isFree
                        ? 'Free'
                        : `$${activity.price.cost}`,
                      position: activity.location.coordinates,
                    }))}
                    center={mapCenter}
                    onMarkerClick={handleMarkerClick}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
