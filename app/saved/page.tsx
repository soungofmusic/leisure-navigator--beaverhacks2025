'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import ActivityCard from '@/components/ActivityCard';
import { LeisureActivity } from '@/types';
import PageHeader from '@/components/PageHeader';
import Loading from '@/components/Loading';
import { fetchActivities } from '@/lib/api';
import { fetchActivityById } from '@/lib/mockData';

export default function SavedActivitiesPage() {
  const { preferences } = useUser();
  const [savedActivities, setSavedActivities] = useState<LeisureActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [allActivities, setAllActivities] = useState<LeisureActivity[]>([]);

  // Load saved activities by ID
  useEffect(() => {
    const loadSavedActivities = async () => {
      setLoading(true);
      try {
        if (preferences.savedActivities.length === 0) {
          setSavedActivities([]);
          return;
        }
        
        // Create an array to store the loaded saved activities
        const loadedActivities: LeisureActivity[] = [];
        
        // For each saved activity ID, try to load the activity details
        for (const activityId of preferences.savedActivities) {
          try {
            // First try to fetch from API
            const response = await fetch(`/api/activities/${activityId}`);
            if (response.ok) {
              const result = await response.json();
              if (result.data) {
                loadedActivities.push(result.data);
                continue; // Skip to next activity if this one was found
              }
            }
            
            // If API fails, try to load from mock data
            const mockActivity = await fetchActivityById(activityId);
            if (mockActivity) {
              loadedActivities.push(mockActivity);
            } else {
              console.log(`Could not find saved activity with ID: ${activityId}`);
            }
          } catch (err) {
            console.error(`Error loading saved activity ${activityId}:`, err);
          }
        }
        
        setSavedActivities(loadedActivities);
      } catch (error) {
        console.error('Error loading saved activities:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSavedActivities();
  }, [preferences.savedActivities]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <PageHeader
        title="Saved Activities"
        description="Your collection of saved activities for future reference"
        className="bg-gradient-to-r from-primary-600 to-primary-800 text-white shadow-lg"
      />

      <main className="container py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loading />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Your Saved Activities
              </h2>
              
              {savedActivities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedActivities.map((activity) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">No saved activities yet</h3>
                  <p className="text-gray-700 dark:text-gray-300 max-w-md mx-auto">
                    Browse activities and click the bookmark icon to save them for later. Your saved activities will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
