'use client';

import React, { useState, useEffect } from 'react';
// Now using API endpoint instead of mock data
import { LeisureActivity, ActivityType } from '../../types';
import SearchFilters from '../../components/SearchFilters';
import MultimodalSearch from '../../components/MultimodalSearch';
import ActivityCard from '../../components/ActivityCard';
import GoogleMapsIntegration from '../../components/GoogleMapsIntegration';
import { useUser } from '../../context/UserContext';

export default function DiscoverPage() {
  const { preferences } = useUser();
  const [activities, setActivities] = useState<LeisureActivity[]>([]);
  const [activeFilters, setActiveFilters] = useState<{ 
    types: ActivityType[],
    location?: { lat: number; lng: number } 
  }>({ types: [] });
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
  const [searchRadius, setSearchRadius] = useState<number>(10000); // Default 10km radius
  const [sortOption, setSortOption] = useState<'rating' | 'reviewCount' | null>(null);
  // Key for forcing MultimodalSearch component to refresh when location changes
  const [searchComponentKey, setSearchComponentKey] = useState<number>(0);

  // Update displayed activities when filtered activities or visible count changes
  useEffect(() => {
    setDisplayedActivities(filteredActivities.slice(0, visibleCount));
  }, [filteredActivities, visibleCount]);
  
  // Force MultimodalSearch to refresh when mapCenter changes significantly
  useEffect(() => {
    // Update the key when map center changes significantly (only to 2 decimal places)
    setSearchComponentKey(prev => prev + 1);
    console.log(`Map center updated to: ${mapCenter.lat.toFixed(4)}, ${mapCenter.lng.toFixed(4)}`);
  }, [mapCenter.lat.toFixed(2), mapCenter.lng.toFixed(2)]);
  
  // Load initial activities
  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        console.log('Fetching activities from API...');
        
        // Create query params with location if available
        const queryParams = new URLSearchParams();
        
        // Include location parameters if available
        if (preferences.location && preferences.location.lat) {
          console.log('Using user preferred location for initial search');
          queryParams.set('lat', preferences.location.lat.toString());
          queryParams.set('lng', preferences.location.lng.toString());
          queryParams.set('radius', searchRadius.toString());
        } else {
          console.log('Using default Portland location for initial search');
          queryParams.set('lat', mapCenter.lat.toString());
          queryParams.set('lng', mapCenter.lng.toString());
          queryParams.set('radius', searchRadius.toString());
        }
        
        // Use fetch to call our API endpoint with location parameters
        const response = await fetch(`/api/activities?${queryParams.toString()}`);
        console.log('API response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        
        const result = await response.json();
        console.log('API response data:', result);
        
        let data = result.data || [];
        console.log(`Received ${data.length} activities`);
        
        // Apply sorting if needed
        if (sortOption && data.length > 0) {
          if (sortOption === 'rating') {
            data.sort((a: LeisureActivity, b: LeisureActivity) => {
              // Safely access rating property or fall back to 0
              const ratingA = a.googleDetails?.rating ?? a.rating ?? 0;
              const ratingB = b.googleDetails?.rating ?? b.rating ?? 0;
              return ratingB - ratingA;
            });
          } else if (sortOption === 'reviewCount') {
            data.sort((a: LeisureActivity, b: LeisureActivity) => {
              // Safely access review counts or fall back to 0
              const countA = a.googleDetails?.userRatingsTotal ?? 0;
              const countB = b.googleDetails?.userRatingsTotal ?? 0;
              return countB - countA;
            });
          }
        }
        
        if (data.length === 0) {
          console.warn('No activities returned from API, using emergency fallback data');
          // Emergency fallback to basic data so the UI isn't empty
          const fallbackData: LeisureActivity[] = [
            {
              id: 'fallback-1',
              title: 'Portland Japanese Garden',
              description: 'A traditional Japanese garden with beautiful views of Mt. Hood.',
              type: 'outdoor',
              location: {
                address: '611 SW Kingston Ave, Portland, OR 97205',
                coordinates: { lat: 45.5188, lng: -122.7060 }
              },
              schedule: {
                startDate: new Date().toISOString(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
                recurring: true,
                recurrencePattern: 'Daily, 9:00 AM - 5:00 PM'
              },
              price: {
                isFree: false,
                cost: 18.95,
                currency: 'USD'
              },
              contactInfo: {
                phone: '503-223-1321',
                website: 'https://japanesegarden.org'
              },
              rating: 4.8,
              images: ['/placeholder-image.jpg'],
              tags: ['garden', 'japanese', 'outdoor']
            },
            {
              id: 'fallback-2',
              title: 'Powell\'s City of Books',
              description: 'The largest independent new and used bookstore in the world.',
              type: 'indoor',
              location: {
                address: '1005 W Burnside St, Portland, OR 97209',
                coordinates: { lat: 45.5231, lng: -122.6822 }
              },
              schedule: {
                startDate: new Date().toISOString(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
                recurring: true,
                recurrencePattern: 'Daily, 9:00 AM - 11:00 PM'
              },
              price: {
                isFree: true,
                cost: 0,
                currency: 'USD'
              },
              contactInfo: {
                phone: '800-878-7323',
                website: 'https://www.powells.com'
              },
              rating: 4.9,
              images: ['/placeholder-image.jpg'],
              tags: ['books', 'shopping', 'indoor']
            }
          ];
          setActivities(fallbackData);
          setFilteredActivities(fallbackData);
        } else {
          setActivities(data);
          setFilteredActivities(data);
        }
        
        // Reset visible count when loading new activities
        setVisibleCount(10);
      } catch (err) {
        setError('Failed to load activities. Please try again later.');
        console.error('Error loading activities:', err);
        
        // Provide fallback data even on error so UI isn't empty
        const fallbackData: LeisureActivity[] = [
          {
            id: 'error-fallback-1',
            title: 'Error loading activities',
            description: 'Please try again later or contact support.',
            type: 'other',
            location: {
              address: 'Portland, OR',
              coordinates: { lat: 45.5152, lng: -122.6784 }
            },
            schedule: {
              startDate: new Date().toISOString(),
              endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
              recurring: false,
              recurrencePattern: ''
            },
            price: {
              isFree: true,
              cost: 0,
              currency: 'USD'
            },
            contactInfo: {
              phone: '',
              website: ''
            },
            rating: 0,
            images: ['/placeholder-image.jpg'],
            tags: ['error']
          }
        ];
        setActivities(fallbackData);
        setFilteredActivities(fallbackData);
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

  // Handle marker click
  const handleMarkerClick = (activityId: string) => {
    setSelectedActivityId(activityId);
    const activity = activities.find(a => a.id === activityId);
    if (activity) {
      setMapCenter(activity.location.coordinates);
    }
  };

  // Handle sorting change
  const handleSortChange = (option: 'rating' | 'reviewCount' | null) => {
    setSortOption(option);
    
    // Sort the current activities without fetching new ones
    if (activities.length > 0) {
      let sortedActivities = [...activities];
      
      if (option === 'rating') {
        // Sort by rating (highest first)
        sortedActivities.sort((a, b) => {
          // Fall back to rating property if googleDetails not available
          const ratingA = a.googleDetails?.rating || a.rating || 0;
          const ratingB = b.googleDetails?.rating || b.rating || 0;
          return ratingB - ratingA;
        });
      } else if (option === 'reviewCount') {
        // Sort by number of reviews (highest first)
        sortedActivities.sort((a, b) => {
          // Safely access review counts or fall back to 0
          const countA = a.googleDetails?.userRatingsTotal || 0;
          const countB = b.googleDetails?.userRatingsTotal || 0;
          return countB - countA;
        });
      }
      
      setFilteredActivities(sortedActivities);
      setDisplayedActivities(sortedActivities.slice(0, visibleCount));
    }
  };
  
  // Handle area search from map
  const handleAreaSearch = async ({ center, radius }: { center: { lat: number; lng: number }; radius: number }) => {
    try {
      // Update map center and search radius - these will be reflected in search
      setMapCenter(center);
      setSearchRadius(radius);
      
      // Clear any previous search query when location changes significantly
      const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (searchInput && searchInput.value) {
        console.log('Location changed significantly - refreshing search with new location');
      }
      
      console.log(`Searching area around ${center.lat}, ${center.lng} with radius ${radius}m`);
      
      // Start loading
      setLoading(true);
      
      // Fetch activities for the selected area
      const queryParams = new URLSearchParams({
        lat: center.lat.toString(),
        lng: center.lng.toString(),
        radius: radius.toString()
      });
      
      // Add any active filters
      if (activeFilters && activeFilters.types && activeFilters.types.length > 0) {
        activeFilters.types.forEach(type => queryParams.append('type', type));
      }
      
      // Make the API request with the new location parameters
      const response = await fetch(`/api/activities?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const result = await response.json();
      const data = result.data || [];
      
      // Sort data if a sort option is selected
      let processedData = [...data];
      
      if (sortOption === 'rating') {
        processedData.sort((a, b) => {
          // Fall back to rating property if googleDetails not available
          const ratingA = a.googleDetails?.rating || a.rating || 0;
          const ratingB = b.googleDetails?.rating || b.rating || 0;
          return ratingB - ratingA;
        });
      } else if (sortOption === 'reviewCount') {
        processedData.sort((a, b) => {
          // Safely access review counts or fall back to 0
          const countA = a.googleDetails?.userRatingsTotal || 0;
          const countB = b.googleDetails?.userRatingsTotal || 0;
          return countB - countA;
        });
      }
      
      // Update activities with the new data
      setActivities(data);
      setFilteredActivities(processedData);
      setDisplayedActivities(processedData.slice(0, visibleCount));
      
      // Display a message about the search
      alert(`Found ${data.length} activities near this area!`);
    } catch (error) {
      console.error('Error searching area:', error);
      setError('Failed to search this area. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle search queries (supports both traditional and AI-powered searches)
  const handleSearch = async (filters: {
    types?: ActivityType[];
    tags?: string[];
    query?: string;
  }) => {
    try {
      setLoading(true);
      console.log('Smart search with location:', mapCenter, 'and filters:', activeFilters);
      
      // Build URL parameters
      const params = new URLSearchParams();
      
      // Add query parameter if it exists
      if (filters.query) {
        params.append('query', filters.query);
      }
      
      // Add type parameters - combine from both active filters and search filters
      const typesToUse = [...(activeFilters.types || []), ...(filters.types || [])];
      // Create a unique array of types (without using Set for TS compatibility)
      const uniqueTypes = typesToUse.filter((type, index, self) => 
        self.indexOf(type) === index
      );
      if (uniqueTypes.length > 0) {
        uniqueTypes.forEach(type => params.append('type', type));
      }
      
      // Add tags if provided from search
      if (filters.tags && filters.tags.length > 0) {
        filters.tags.forEach(tag => params.append('tag', tag));
      }
      
      // Include current map center (location) in search
      params.append('lat', mapCenter.lat.toString());
      params.append('lng', mapCenter.lng.toString());
      
      // Include current search radius
      params.append('radius', searchRadius.toString());
      
      console.log('Smart search API call:', `/api/activities?${params.toString()}`);
      
      // Call the API with the constructed URL
      const response = await fetch(`/api/activities?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Smart search results:', result.data?.length || 0, 'activities found');
      setFilteredActivities(result.data || []);
      
      // Reset visible count when search terms change
      setVisibleCount(10);
    } catch (err) {
      setError('Failed to search activities. Please try again later.');
      console.error('Smart search error:', err);
    } finally {
      setLoading(false);
    }
  };


  // Handle filter changes
  const handleFilterChange = async (filters: {
    types: ActivityType[];
    distance: number;
    location?: { lat: number; lng: number };
  }) => {
    try {
      setLoading(true);
      // Save active filters for reference including location
      setActiveFilters({ 
        types: filters.types,
        location: filters.location 
      });
      
      // Update map center if location is provided in filters
      if (filters.location) {
        setMapCenter(filters.location);
        console.log('Updated map center from filters:', filters.location);
      }
      
      // Build URL parameters
      const params = new URLSearchParams();
      
      // Add type parameters if they exist
      if (filters.types.length > 0) {
        filters.types.forEach(type => params.append('type', type));
      }
      
      // Add location parameters if they exist
      if (filters.location) {
        params.append('lat', filters.location.lat.toString());
        params.append('lng', filters.location.lng.toString());
      }
      
      // Add radius parameter (convert miles to meters)
      if (filters.distance) {
        params.append('radius', (filters.distance * 1609.34).toString());
      }
      
      // Call the API with the constructed URL
      const response = await fetch(`/api/activities?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const result = await response.json();
      const data = result.data || [];
      setActivities(data);
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

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Discover Activities</h1>
        
        {/* Sorting controls in top right */}
        <div className="flex space-x-2">
          <div className="relative inline-block">
            <select
              value={sortOption || ''}
              onChange={(e) => handleSortChange(e.target.value as 'rating' | 'reviewCount' | null)}
              className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded-md shadow leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Sort Activities</option>
              <option value="rating">Highest Rating</option>
              <option value="reviewCount">Most Reviews</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Sidebar with filters */}
        <div className="lg:col-span-1">
          <div className="p-4 bg-white rounded-lg shadow-md">
            <div className="mb-6">
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                Smart Search
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Search using text, voice commands, or snap a photo
              </p>
              {/* Smart natural language search - key ensures re-rendering when location changes */}
              <MultimodalSearch 
                key={searchComponentKey}
                onSearch={handleSearch} 
                location={mapCenter} 
              />
            </div>
            <div className="mb-6">
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                Filters
              </h3>
              <SearchFilters 
                onFilterChange={handleFilterChange}
                defaultLocation={mapCenter}
              />
            </div>
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
                      
                      {/* Load More button - show with special highlight when activity types are selected */}
                      {displayedActivities.length < filteredActivities.length && (
                        <div className={`mt-8 text-center ${activeFilters.types.length > 0 ? 'p-4 bg-blue-50 rounded-lg border border-blue-200' : ''}`}>
                          {activeFilters.types.length > 0 && (
                            <p className="mb-3 font-medium text-blue-700">
                              Viewing filtered results for: {activeFilters.types.join(', ')}
                            </p>
                          )}
                          <button 
                            onClick={handleLoadMore}
                            className={`px-6 py-3 text-sm font-medium text-white transition-colors rounded-lg ${activeFilters.types.length > 0 ? 'bg-blue-600 hover:bg-blue-700 shadow-md' : 'bg-primary-600 hover:bg-primary-700'}`}
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
                    showSearchThisArea={true}
                    markers={filteredActivities.map((activity) => ({
                      id: activity.id,
                      title: activity.title,
                      description: activity.type,
                      position: activity.location.coordinates,
                    }))}
                    center={mapCenter}
                    onMarkerClick={handleMarkerClick}
                    onAreaSearch={handleAreaSearch}
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
