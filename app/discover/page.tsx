'use client';

import React, { useState, useEffect } from 'react';
import { fetchActivities } from '../../lib/mockData';
import { LeisureActivity, ActivityType } from '../../types';
import SearchFilters from '../../components/SearchFilters';
import MultimodalSearch from '../../components/MultimodalSearch';
import ActivityCard from '../../components/ActivityCard';
import GoogleMapsIntegration from '../../components/GoogleMapsIntegration';
import { useUser } from '../../context/UserContext';

export default function DiscoverPage() {
  const { preferences } = useUser();
  const [activities, setActivities] = useState<LeisureActivity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<LeisureActivity[]>([]);
  const [displayedActivities, setDisplayedActivities] = useState<LeisureActivity[]>([]);
  const [visibleCount, setVisibleCount] = useState(10); // Initially show 10 activities
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

  // Update displayed activities when filtered activities or visible count changes
  useEffect(() => {
    setDisplayedActivities(filteredActivities.slice(0, visibleCount));
  }, [filteredActivities, visibleCount]);
  
  // Load initial activities
  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        const data = await fetchActivities();
        setActivities(data);
        setFilteredActivities(data);
        // Reset visible count when loading new activities
        setVisibleCount(10);
      } catch (err) {
        setError('Failed to load activities. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);
  
  // Handle loading more activities
  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + 5); // Load 5 more activities
  };

  // Handle search queries (supports both traditional and AI-powered searches)
  const handleSearch = async (filters: {
    types?: ActivityType[];
    priceRange?: { min: number; max: number };
    tags?: string[];
    query?: string;
  }) => {
    try {
      setLoading(true);
      const data = await fetchActivities(filters);
      setFilteredActivities(data);
      // Reset visible count when search terms change
      setVisibleCount(10);
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
      // Reset visible count when filters change
      setVisibleCount(10);
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
          <div className="p-4 bg-white rounded-lg shadow-md">
            <div className="mb-6">
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                Search Activities
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Search using text, voice commands, or snap a photo
              </p>
              <MultimodalSearch onSearch={handleSearch} />
              <div className="mt-2 p-2 bg-gray-50 rounded-md">
                <p className="text-xs text-gray-600">Try searches like:</p>
                <ul className="mt-1 text-xs text-gray-600 list-disc list-inside">
                  <li>Outdoor activities for kids under $20</li>
                  <li>Cultural experiences with food</li>
                  <li>Evening entertainment in downtown</li>
                </ul>
              </div>
            </div>
            
            <h2 className="mb-4 text-lg font-semibold">Filters</h2>
            <SearchFilters 
              onSearch={(query) => handleSearch({ query })} 
              onFilterChange={handleFilterChange}
              defaultLocation={mapCenter}
            />
            
            {/* View toggle */}
            <div className="mt-4">
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
                    <>
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {displayedActivities.map((activity) => (
                          <ActivityCard key={activity.id} activity={activity} />
                        ))}
                      </div>
                      
                      {/* Load More button - only show if there are more activities to load */}
                      {displayedActivities.length < filteredActivities.length && (
                        <div className="mt-8 text-center">
                          <button 
                            onClick={handleLoadMore}
                            className="px-6 py-3 text-sm font-medium text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700"
                          >
                            Load 5 More Activities
                          </button>
                          <p className="mt-2 text-sm text-gray-600">
                            Showing {displayedActivities.length} of {filteredActivities.length} activities
                          </p>
                        </div>
                      )}
                    </>
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
