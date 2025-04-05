'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import UserPreferences from '@/components/UserPreferences';
import { UserPreferences as UserPreferencesType, LeisureActivity } from '@/types';
import { fetchActivities } from '@/lib/mockData';
import ActivityCard from '@/components/ActivityCard';

export default function ProfilePage() {
  const [preferences, setPreferences] = useState<UserPreferencesType>({
    favoriteTypes: [],
    favoriteTags: [],
    savedActivities: [],
    location: undefined,
  });
  
  const [savedActivities, setSavedActivities] = useState<LeisureActivity[]>([]);
  const [recommendedActivities, setRecommendedActivities] = useState<LeisureActivity[]>([]);
  const [loading, setLoading] = useState(false);

  // Load user preferences from local storage on initial render
  useEffect(() => {
    const storedPreferences = localStorage.getItem('userPreferences');
    if (storedPreferences) {
      try {
        setPreferences(JSON.parse(storedPreferences));
      } catch (error) {
        console.error('Failed to parse stored preferences:', error);
      }
    }
  }, []);

  // Load saved activities
  useEffect(() => {
    const loadSavedActivities = async () => {
      if (preferences.savedActivities.length > 0) {
        setLoading(true);
        try {
          const allActivities = await fetchActivities();
          const saved = allActivities.filter(activity => 
            preferences.savedActivities.includes(activity.id)
          );
          setSavedActivities(saved);
        } catch (error) {
          console.error('Error loading saved activities:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setSavedActivities([]);
      }
    };

    loadSavedActivities();
  }, [preferences.savedActivities]);

  // Generate recommended activities based on user preferences
  useEffect(() => {
    const getRecommendations = async () => {
      if (preferences.favoriteTypes.length > 0 || preferences.favoriteTags.length > 0) {
        setLoading(true);
        try {
          const allActivities = await fetchActivities();
          
          // Score each activity based on user preferences
          const scoredActivities = allActivities.map(activity => {
            let score = 0;
            
            // Score based on activity type
            if (preferences.favoriteTypes.includes(activity.type)) {
              score += 3;
            }
            
            // Score based on tags
            const matchingTags = activity.tags.filter(tag => 
              preferences.favoriteTags.includes(tag)
            );
            score += matchingTags.length;
            
            return { activity, score };
          });
          
          // Sort by score and take top 4
          const topRecommendations = scoredActivities
            .sort((a, b) => b.score - a.score)
            .filter(item => item.score > 0)
            .slice(0, 4)
            .map(item => item.activity);
          
          setRecommendedActivities(topRecommendations);
        } catch (error) {
          console.error('Error generating recommendations:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setRecommendedActivities([]);
      }
    };

    getRecommendations();
  }, [preferences.favoriteTypes, preferences.favoriteTags]);

  // Save preferences
  const handleSavePreferences = (newPreferences: UserPreferencesType) => {
    setPreferences(newPreferences);
    localStorage.setItem('userPreferences', JSON.stringify(newPreferences));
  };

  return (
    <div className="container py-8">
      <h1 className="mb-6 text-3xl font-bold">Your Profile</h1>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <UserPreferences 
            onSave={handleSavePreferences}
            initialPreferences={preferences}
          />
        </div>
        
        <div className="md:col-span-2">
          {/* Recommendations Section */}
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Recommended For You</h2>
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="w-8 h-8 border-4 border-t-4 rounded-full border-gray-200 border-t-primary-600 animate-spin"></div>
              </div>
            ) : recommendedActivities.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {recommendedActivities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            ) : (
              <div className="p-6 bg-gray-50 rounded-md">
                <p className="text-gray-600">
                  Set your activity preferences to get personalized recommendations.
                </p>
              </div>
            )}
            
            <div className="mt-4 text-right">
              <Link href="/discover" className="text-primary-600 hover:underline">
                Discover more activities →
              </Link>
            </div>
          </div>
          
          {/* Saved Activities Section */}
          <div>
            <h2 className="mb-4 text-2xl font-semibold">Saved Activities</h2>
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="w-8 h-8 border-4 border-t-4 rounded-full border-gray-200 border-t-primary-600 animate-spin"></div>
              </div>
            ) : savedActivities.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {savedActivities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            ) : (
              <div className="p-6 bg-gray-50 rounded-md">
                <p className="text-gray-600">
                  You haven't saved any activities yet. When you find activities you like, save them for later!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
