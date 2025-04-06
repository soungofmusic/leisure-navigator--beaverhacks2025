'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserPreferences } from '../types';

interface UserContextType {
  preferences: UserPreferences;
  updatePreferences: (preferences: UserPreferences) => void;
  saveActivity: (activityId: string) => void;
  unsaveActivity: (activityId: string) => void;
  isActivitySaved: (activityId: string) => boolean;
}

const defaultPreferences: UserPreferences = {
  favoriteTypes: [],
  favoriteTags: [],
  savedActivities: [],
  location: undefined
};

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  // Load preferences from localStorage on initial render
  useEffect(() => {
    try {
      const storedPreferences = localStorage.getItem('userPreferences');
      if (storedPreferences) {
        setPreferences(JSON.parse(storedPreferences));
      }
    } catch (error) {
      console.error('Failed to load user preferences from localStorage:', error);
    }
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save user preferences to localStorage:', error);
    }
  }, [preferences]);

  const updatePreferences = (newPreferences: UserPreferences) => {
    setPreferences(newPreferences);
  };

  const saveActivity = (activityId: string) => {
    setPreferences(prev => {
      if (prev.savedActivities.includes(activityId)) {
        return prev;
      }
      return {
        ...prev,
        savedActivities: [...prev.savedActivities, activityId]
      };
    });
  };

  const unsaveActivity = (activityId: string) => {
    setPreferences(prev => ({
      ...prev,
      savedActivities: prev.savedActivities.filter(id => id !== activityId)
    }));
  };

  const isActivitySaved = (activityId: string) => {
    return preferences.savedActivities.includes(activityId);
  };

  const value = {
    preferences,
    updatePreferences,
    saveActivity,
    unsaveActivity,
    isActivitySaved
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
