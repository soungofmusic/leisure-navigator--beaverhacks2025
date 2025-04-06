'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { LeisureActivity } from '@/types';
import { mockLeisureActivities } from '@/lib/mockData';
import ActivityCard from './ActivityCard';

const FeaturedActivities: React.FC = () => {
  const { preferences } = useUser();
  const [featuredActivities, setFeaturedActivities] = useState<LeisureActivity[]>([]);
  
  useEffect(() => {
    // Base selection on user preferences if they exist, otherwise show a diverse mix
    if (preferences.favoriteTypes.length > 0 || preferences.favoriteTags.length > 0) {
      // Filter activities that match user preferences
      const filtered = mockLeisureActivities.filter(activity => {
        const matchesType = preferences.favoriteTypes.length === 0 || 
          preferences.favoriteTypes.includes(activity.type);
        
        const matchesTags = preferences.favoriteTags.length === 0 ||
          activity.tags.some(tag => preferences.favoriteTags.includes(tag));
        
        return matchesType || matchesTags;
      });
      
      // Sort by rating and take the top 4
      const sorted = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      setFeaturedActivities(sorted.slice(0, 4));
    } else {
      // No preferences, so select a diverse mix of high-rated activities
      const diverseSelection = mockLeisureActivities
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 8);
      
      // Ensure diversity by type
      const typeMap = new Map<string, LeisureActivity[]>();
      
      diverseSelection.forEach(activity => {
        if (!typeMap.has(activity.type)) {
          typeMap.set(activity.type, []);
        }
        typeMap.get(activity.type)?.push(activity);
      });
      
      // Select one activity from each different type, up to 4
      const diverse: LeisureActivity[] = [];
      for (const [_, activities] of typeMap) {
        if (diverse.length < 4) {
          diverse.push(activities[0]);
        }
      }
      
      setFeaturedActivities(diverse);
    }
  }, [preferences]);

  if (featuredActivities.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Featured Activities</h2>
        {(preferences.favoriteTypes.length > 0 || preferences.favoriteTags.length > 0) && (
          <span className="text-sm text-gray-600">Based on your preferences</span>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featuredActivities.map(activity => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedActivities;
