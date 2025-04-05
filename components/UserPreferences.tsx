'use client';

import React, { useState, useEffect } from 'react';
import { ActivityType, UserPreferences as UserPreferencesType } from '@/types';

interface UserPreferencesProps {
  onSave: (preferences: UserPreferencesType) => void;
  initialPreferences?: UserPreferencesType;
}

const defaultPreferences: UserPreferencesType = {
  favoriteTypes: [],
  favoriteTags: [],
  savedActivities: [],
  location: undefined
};

const UserPreferences: React.FC<UserPreferencesProps> = ({ 
  onSave, 
  initialPreferences = defaultPreferences 
}) => {
  const [preferences, setPreferences] = useState<UserPreferencesType>(initialPreferences);
  const [isEditing, setIsEditing] = useState(false);
  
  const activityTypes: { label: string; value: ActivityType }[] = [
    { label: 'Outdoor', value: 'outdoor' },
    { label: 'Indoor', value: 'indoor' },
    { label: 'Cultural', value: 'cultural' },
    { label: 'Entertainment', value: 'entertainment' },
    { label: 'Sports', value: 'sports' },
    { label: 'Culinary', value: 'culinary' },
    { label: 'Educational', value: 'educational' },
    { label: 'Nightlife', value: 'nightlife' },
    { label: 'Wellness', value: 'wellness' },
    { label: 'Other', value: 'other' },
  ];

  const popularTags = [
    'family-friendly',
    'pet-friendly',
    'free',
    'nature',
    'art',
    'music',
    'food',
    'shopping',
    'historic',
    'tours',
    'kids',
    'adults-only',
    'romantic',
    'group',
    'scenic',
  ];

  const toggleActivityType = (type: ActivityType) => {
    setPreferences(prev => {
      const types = prev.favoriteTypes.includes(type)
        ? prev.favoriteTypes.filter(t => t !== type)
        : [...prev.favoriteTypes, type];
      
      return { ...prev, favoriteTypes: types };
    });
  };

  const toggleTag = (tag: string) => {
    setPreferences(prev => {
      const tags = prev.favoriteTags.includes(tag)
        ? prev.favoriteTags.filter(t => t !== tag)
        : [...prev.favoriteTags, tag];
      
      return { ...prev, favoriteTags: tags };
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPreferences(prev => ({
            ...prev,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to retrieve your location. Please enable location services or enter manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleSave = () => {
    onSave(preferences);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Preferences</h2>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded hover:bg-primary-50"
          >
            Edit
          </button>
        ) : (
          <div className="flex space-x-2">
            <button 
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded hover:bg-primary-700"
            >
              Save
            </button>
          </div>
        )}
      </div>

      <div className="p-4 space-y-6">
        {/* Favorite Activity Types */}
        <div>
          <h3 className="mb-2 font-medium">Favorite Activity Types</h3>
          <div className="flex flex-wrap gap-2">
            {activityTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => isEditing && toggleActivityType(type.value)}
                className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                  preferences.favoriteTypes.includes(type.value)
                    ? 'bg-primary-500 text-white'
                    : isEditing 
                      ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' 
                      : 'bg-gray-50 text-gray-400'
                } ${!isEditing && 'cursor-default'}`}
                disabled={!isEditing}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Favorite Tags */}
        <div>
          <h3 className="mb-2 font-medium">Favorite Tags</h3>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => isEditing && toggleTag(tag)}
                className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                  preferences.favoriteTags.includes(tag)
                    ? 'bg-primary-500 text-white'
                    : isEditing 
                      ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' 
                      : 'bg-gray-50 text-gray-400'
                } ${!isEditing && 'cursor-default'}`}
                disabled={!isEditing}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Location Preferences */}
        <div>
          <h3 className="mb-2 font-medium">Default Location</h3>
          <div className="flex items-center space-x-2">
            {preferences.location ? (
              <div className="py-2 px-3 bg-gray-100 rounded-md flex-grow">
                <p className="text-sm text-gray-700">
                  Lat: {preferences.location.lat.toFixed(6)}, Lng: {preferences.location.lng.toFixed(6)}
                </p>
              </div>
            ) : (
              <div className="py-2 px-3 bg-gray-100 rounded-md flex-grow">
                <p className="text-sm text-gray-500 italic">No location set</p>
              </div>
            )}
            
            {isEditing && (
              <button 
                onClick={getCurrentLocation}
                className="px-4 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded hover:bg-primary-50"
              >
                Use Current
              </button>
            )}
          </div>
        </div>

        {!isEditing && preferences.savedActivities.length > 0 && (
          <div>
            <h3 className="mb-2 font-medium">Saved Activities</h3>
            <p className="text-sm text-gray-600">
              You have {preferences.savedActivities.length} saved activities
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPreferences;
