'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LeisureActivity } from '@/types';
import Map from '@/components/Map';
import SaveActivityButton from '@/components/SaveActivityButton';
import { enhanceActivityDescription, getWebSearchSummary } from '@/lib/groqService';

interface ActivityDetailPageProps {
  params: {
    id: string;
  };
}

export default function ActivityDetailPage({ params }: ActivityDetailPageProps) {
  const [activity, setActivity] = useState<LeisureActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enhancedDescription, setEnhancedDescription] = useState<string | null>(null);
  const [isLoadingEnhanced, setIsLoadingEnhanced] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  
  // State for web search summary
  const [webSearchSummary, setWebSearchSummary] = useState<string | null>(null);
  const [isLoadingWebSearch, setIsLoadingWebSearch] = useState(false);
  const [webSearchError, setWebSearchError] = useState<string | null>(null);

  useEffect(() => {
    const loadActivity = async () => {
      try {
        setLoading(true);
        console.log('Loading activity details for ID:', params.id);
        
        // Get activity ID from URL parameters
        const id = params.id;
        
        // First try to fetch from API
        try {
          console.log('Attempting to fetch from API:', `/api/activities/${id}`);
          const response = await fetch(`/api/activities/${id}`);
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error('API error response:', errorText);
            throw new Error(`API error: ${response.status} - ${errorText}`);
          }

          const data = await response.json();
          if (!data.data) {
            console.error('API returned unexpected data format:', data);
            throw new Error('Invalid data format returned from API');
          }
          
          setActivity(data.data);
          console.log('Loaded activity from API:', data.data.title);
          return;
        } catch (apiError) {
          console.error('Error fetching from API:', apiError);
          // Fall through to client-side fetching
        }

        // If API fails, try to fetch directly from mockData on client side
        try {
          console.log('Attempting to fetch from client-side mock data');
          const { fetchActivityById } = await import('@/lib/mockData');
          const activity = await fetchActivityById(id);
          
          if (!activity) {
            throw new Error('Activity not found in mock data');
          }
          
          console.log('Loaded activity from client mock data:', activity.title);
          setActivity(activity);
          return;
        } catch (mockError) {
          console.error('Error fetching from mock data:', mockError);
          
          // Create fallback for generated IDs
          if (id.startsWith('generated-')) {
            try {
              console.log('Creating fallback for generated ID:', id);
              const parts = id.split('-');
              if (parts.length >= 3) {
                const activityType = parts[1];
                
                // Create a fallback dynamic activity
                const fallbackActivity: LeisureActivity = {
                  id: id,
                  title: `${activityType.charAt(0).toUpperCase() + activityType.slice(1)} Activity`,
                  description: `This is a dynamically generated ${activityType} activity based on your search location.`,
                  type: activityType as any,
                  location: {
                    address: 'Near your search location',
                    coordinates: { lat: 0, lng: 0 }
                  },
                  schedule: {
                    startDate: new Date().toISOString(),
                    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
                    recurring: false
                  },
                  rating: 4.5,
                  tags: [activityType, 'recommended'],
                  price: { isFree: false, cost: 0 },
                  contactInfo: {},
                  images: []
                };
                
                setActivity(fallbackActivity);
                return;
              }
            } catch (fallbackError) {
              console.error('Error creating fallback activity:', fallbackError);
            }
          }
          
          throw mockError;
        }
      } catch (err) {
        console.error('Error loading activity:', err);
        setError('Failed to load activity details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadActivity();
  }, [params.id]);

  // Function to fetch enhanced information using GROQ
  const getEnhancedInformation = async () => {
    if (!activity) return;
    
    try {
      setIsLoadingEnhanced(true);
      setAiError(null);
      
      // Use GROQ to enhance the activity description
      const enhanced = await enhanceActivityDescription(
        activity.description,
        activity.type
      );
      
      setEnhancedDescription(enhanced);
    } catch (err) {
      console.error('Error getting enhanced information:', err);
      setAiError('Could not load AI-enhanced details. Please try again later.');
    } finally {
      setIsLoadingEnhanced(false);
    }
  };
  
  // Function to fetch web search summary using GROQ
  const getWebSearchInformation = async () => {
    if (!activity) return;
    
    try {
      setIsLoadingWebSearch(true);
      setWebSearchError(null);
      
      // Get location string from activity if available
      const locationStr = activity.location?.address || '';
      
      // Use GROQ to get web search summary
      const summary = await getWebSearchSummary(
        activity.title,
        activity.type,
        locationStr
      );
      
      setWebSearchSummary(summary);
    } catch (err) {
      console.error('Error getting web search summary:', err);
      setWebSearchError('Could not load web search information. Please try again later.');
    } finally {
      setIsLoadingWebSearch(false);
    }
  };

  if (loading) {
    return (
      <div className="container flex items-center justify-center py-16">
        <div className="w-12 h-12 border-4 border-t-4 rounded-full border-gray-200 border-t-primary-600 animate-spin"></div>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="container py-16">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h1 className="mb-4 text-2xl font-bold text-gray-800">Error</h1>
          <p className="text-red-600">{error || 'Activity not found'}</p>
          <Link href="/discover" className="inline-block mt-4 btn-primary">
            Back to Discover
          </Link>
        </div>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container py-8">
      <Link 
        href="/discover" 
        className="inline-flex items-center mb-4 text-sm font-medium text-primary-600 hover:text-primary-700"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className="w-4 h-4 mr-1"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to Discover
      </Link>

      <div className="overflow-hidden bg-white rounded-lg shadow-md">
        {/* Activity Header */}
        <div className="relative h-64 md:h-96">
          {activity.images && activity.images.length > 0 ? (
            <Image
              src={activity.images[0]}
              alt={activity.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-200">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
          <div className="absolute top-4 right-4 px-3 py-1 text-sm font-medium text-white rounded-full bg-primary-600">
            {activity.type}
          </div>
        </div>

        {/* Activity Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <h1 className="mb-2 text-3xl font-bold text-gray-800">{activity.title}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 text-yellow-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                  <span className="ml-1 font-medium">
                    {activity.rating ? activity.rating.toFixed(1) : 'N/A'}
                  </span>
                </div>
              </div>
              <div className="mt-6 mb-6">
                <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">Description</h2>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
                  <p className="text-gray-800 dark:text-gray-200">{activity.description}</p>
                </div>
                
                {/* Enhanced description section */}
                {enhancedDescription && (
                  <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h3 className="text-md font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                      </svg>
                      AI-Enhanced Description
                    </h3>
                    <div className="prose dark:prose-invert max-w-none">
                      {enhancedDescription.split('\n\n').map((paragraph, i) => (
                        <p key={i} className="mb-2 text-gray-800 dark:text-gray-200">{paragraph}</p>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* AI Enhancement buttons */}
                <div className="flex flex-wrap gap-2 mt-6">
                  {/* GROQ Enhanced Information Button */}
                  <button 
                    className="inline-flex items-center px-4 py-2 text-sm font-bold text-white rounded-md bg-primary-700 hover:bg-primary-800 shadow-sm"
                    onClick={getEnhancedInformation}
                    disabled={isLoadingEnhanced}
                  >
                    {isLoadingEnhanced ? (
                      <>
                        <svg className="w-4 h-4 mr-2 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Generate AI-Enhanced Details
                      </>
                    )}
                  </button>
                  
                  {/* Web Search Summary Button */}
                  <button 
                    className="inline-flex items-center px-4 py-2 text-sm font-bold text-white rounded-md bg-emerald-700 hover:bg-emerald-800 shadow-sm"
                    onClick={getWebSearchInformation}
                    disabled={isLoadingWebSearch}
                  >
                    {isLoadingWebSearch ? (
                      <>
                        <svg className="w-4 h-4 mr-2 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Searching...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
                        </svg>
                        Web Search Summary
                      </>
                    )}
                  </button>
                </div>
                
                {/* Display Enhanced Information */}
                {enhancedDescription && (
                  <div className="p-5 mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg shadow-sm">
                    <div className="flex items-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300">AI-Enhanced Description</h3>
                    </div>
                    <div className="prose prose-blue dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
                      {enhancedDescription.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="mb-3">{paragraph}</p>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Display Web Search Summary */}
                {webSearchSummary && (
                  <div className="p-5 mt-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg shadow-sm">
                    <div className="flex items-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-2 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-300">Web Search Summary</h3>
                    </div>
                    <div className="prose prose-emerald dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
                      {webSearchSummary.split('\n\n').map((section, index) => {
                        // Check if this section is a header (starts with ###)
                        if (section.trim().startsWith('###')) {
                          return (
                            <h4 key={index} className="mt-4 mb-2 font-bold text-emerald-700 dark:text-emerald-400">
                              {section.replace(/^###\s*/, '')}
                            </h4>
                          );
                        }
                        // Check if this is a list of items
                        else if (section.trim().startsWith('- ')) {
                          return (
                            <ul key={index} className="list-disc list-inside mb-3 ml-2">
                              {section.split('\n').map((item, j) => (
                                <li key={`${index}-${j}`} className="mb-1">{item.replace(/^-\s*/, '')}</li>
                              ))}
                            </ul>
                          );
                        }
                        // Regular paragraph
                        else {
                          return <p key={index} className="mb-3">{section}</p>;
                        }
                      })}
                    </div>
                  </div>
                )}
                
                {/* Display Error Messages */}
                {aiError && (
                  <div className="p-4 mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-700 dark:text-red-300 font-medium">{aiError}</p>
                  </div>
                )}
                
                {webSearchError && (
                  <div className="p-4 mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-700 dark:text-red-300 font-medium">{webSearchError}</p>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">Schedule</h2>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                  <p className="flex items-center mb-3 text-gray-800 dark:text-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    <span className="font-bold mr-1">Start:</span>
                    <span>{formatDate(activity.schedule.startDate)}</span>
                  </p>
                  <p className="flex items-center mb-3 text-gray-800 dark:text-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    <span className="font-bold mr-1">End:</span>
                    <span>{formatDate(activity.schedule.endDate)}</span>
                  </p>
                  {activity.schedule.recurring && activity.schedule.recurrencePattern && (
                    <p className="flex items-center text-gray-800 dark:text-gray-200">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                      <span className="font-bold mr-1">Recurring:</span>
                      <span>{activity.schedule.recurrencePattern}</span>
                    </p>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {activity.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm font-medium text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="md:col-span-1">
              <div className="p-4 mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">Location</h2>
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <p className="text-gray-800 dark:text-gray-200">{activity.location.address}</p>
                </div>
                <div className="h-48 mb-4 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                  <Map
                    center={activity.location.coordinates}
                    zoom={15}
                    markers={[
                      {
                        id: activity.id,
                        title: activity.title,
                        position: activity.location.coordinates,
                      },
                    ]}
                    height="100%"
                  />
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${activity.location.coordinates.lat},${activity.location.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full py-2 text-sm font-medium text-white rounded-md bg-primary-700 hover:bg-primary-800 shadow-sm transition duration-150 ease-in-out"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                  </svg>
                  Get Directions
                </a>
              </div>
              
              {activity.contactInfo && (
                <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                  <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                    </svg>
                    Contact Information
                  </h2>
                  {activity.contactInfo.phone && (
                    <div className="flex items-center mb-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3 text-primary-600 dark:text-primary-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Phone</div>
                        <a href={`tel:${activity.contactInfo.phone}`} className="text-primary-700 dark:text-primary-300 font-medium hover:underline">
                          {activity.contactInfo.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {activity.contactInfo.email && (
                    <div className="flex items-center mb-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3 text-primary-600 dark:text-primary-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email</div>
                        <a href={`mailto:${activity.contactInfo.email}`} className="text-primary-700 dark:text-primary-300 font-medium hover:underline">
                          {activity.contactInfo.email}
                        </a>
                      </div>
                    </div>
                  )}
                  {activity.contactInfo.website && (
                    <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3 text-primary-600 dark:text-primary-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                      </svg>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Website</div>
                        <a href={activity.contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-primary-700 dark:text-primary-300 font-medium hover:underline">
                          Visit Official Website
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-6">
                <button 
                  className="flex items-center justify-center w-full py-2 mb-2 text-sm font-medium text-white rounded bg-primary-600 hover:bg-primary-700"
                  onClick={() => alert('Calendar functionality will be implemented in the future!')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  Add to Calendar
                </button>
                <SaveActivityButton 
                  activityId={activity.id}
                  buttonStyle="full"
                  className="flex items-center justify-center w-full py-2 text-sm font-medium bg-white rounded border border-primary-600 hover:bg-primary-50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
