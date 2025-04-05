'use client';

import React, { useState, useEffect } from 'react';
import UserPreferences from '@/components/UserPreferences';
import { LeisureActivity } from '@/types';
import { mockLeisureActivities } from '@/lib/mockData';
import ActivityCard from '@/components/ActivityCard';
import { useUser } from '@/context/UserContext';

const ProfilePage: React.FC = () => {
  const { preferences, updatePreferences } = useUser();
  const [recommendedActivities, setRecommendedActivities] = useState<LeisureActivity[]>([]);
  const [savedActivities, setSavedActivities] = useState<LeisureActivity[]>([]);
  
  // Update recommended activities based on preferences
  useEffect(() => {
    if (preferences.favoriteTypes.length === 0 && preferences.favoriteTags.length === 0) {
      setRecommendedActivities([]);
      return;
    }

    const filtered = mockLeisureActivities.filter(activity => {
      const matchesType = preferences.favoriteTypes.length === 0 || 
        preferences.favoriteTypes.includes(activity.type);
      
      const matchesTags = preferences.favoriteTags.length === 0 ||
        activity.tags.some(tag => preferences.favoriteTags.includes(tag));
      
      return matchesType && matchesTags;
    });

    setRecommendedActivities(filtered);
  }, [preferences.favoriteTypes, preferences.favoriteTags]);
  
  // Get saved activities
  useEffect(() => {
    const savedActivityList = mockLeisureActivities.filter(activity => 
      preferences.savedActivities.includes(activity.id)
    );
    setSavedActivities(savedActivityList);
  }, [preferences.savedActivities]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Your Preferences</h2>
            <UserPreferences 
              preferences={preferences} 
              onPreferencesUpdate={updatePreferences} 
            />
          </div>
        </div>
        
        <div className="md:col-span-2">
          {recommendedActivities.length > 0 ? (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Recommended For You</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendedActivities.slice(0, 4).map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          ) : preferences.favoriteTypes.length > 0 || preferences.favoriteTags.length > 0 ? (
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <p className="text-gray-600">No activities match your preferences. Try selecting different preferences.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <p className="text-gray-600">Select your favorite activity types and tags to see personalized recommendations.</p>
            </div>
          )}
          
          {savedActivities.length > 0 ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">Your Saved Activities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedActivities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Your Saved Activities</h2>
              <p className="text-gray-600">You haven't saved any activities yet. Explore the app and save activities you're interested in!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
