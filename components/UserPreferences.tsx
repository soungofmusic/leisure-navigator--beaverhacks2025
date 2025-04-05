'use client';

import React, { useState, useEffect } from 'react';
import { UserPreferences as UserPreferencesType } from '@/types';

interface UserPreferencesProps {
  preferences: UserPreferencesType;
  onPreferencesUpdate: (preferences: UserPreferencesType) => void;
}

const defaultPreferences: UserPreferencesType = {
  favoriteTypes: [],
  favoriteTags: [],
  savedActivities: [],
  location: undefined
};

const UserPreferences: React.FC<UserPreferencesProps> = ({ 
  preferences, 
  onPreferencesUpdate 
}) => {
  const [localPreferences, setLocalPreferences] = useState<UserPreferencesType>(preferences);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  const activityTypes: { label: string; value: string }[] = [
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

  const handleTypeToggle = (type: string) => {
    const newPreferences = {...localPreferences};
    newPreferences.favoriteTypes = localPreferences.favoriteTypes.includes(type)
      ? localPreferences.favoriteTypes.filter(t => t !== type)
      : [...localPreferences.favoriteTypes, type];
    
    setLocalPreferences(newPreferences);
    onPreferencesUpdate(newPreferences);
  };

  const handleTagToggle = (tag: string) => {
    const newPreferences = {...localPreferences};
    newPreferences.favoriteTags = localPreferences.favoriteTags.includes(tag)
      ? localPreferences.favoriteTags.filter(t => t !== tag)
      : [...localPreferences.favoriteTags, tag];
    
    setLocalPreferences(newPreferences);
    onPreferencesUpdate(newPreferences);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPreferences = {...localPreferences};
          newPreferences.location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocalPreferences(newPreferences);
          onPreferencesUpdate(newPreferences);
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
                onClick={() => handleTypeToggle(type.value)}
                className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                  localPreferences.favoriteTypes.includes(type.value)
                    ? 'bg-primary-100 text-primary-700 border border-primary-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
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
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                  localPreferences.favoriteTags.includes(tag)
                    ? 'bg-primary-100 text-primary-700 border border-primary-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
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
            {localPreferences.location ? (
              <div className="py-2 px-3 bg-gray-100 rounded-md flex-grow">
                <p className="text-sm text-gray-700">
                  Lat: {localPreferences.location.lat.toFixed(6)}, Lng: {localPreferences.location.lng.toFixed(6)}
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
