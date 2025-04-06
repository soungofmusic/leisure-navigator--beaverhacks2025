'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserPreferences } from '../types';
import { auth, db, doc, getDoc, setDoc, onAuthStateChanged, signInWithGoogle, logoutUser } from '../lib/firebase';
import type { User } from '../lib/firebase';

interface UserContextType {
  user: User | null;
  loading: boolean;
  preferences: UserPreferences;
  updatePreferences: (preferences: UserPreferences) => void;
  saveActivity: (activityId: string) => void;
  unsaveActivity: (activityId: string) => void;
  isActivitySaved: (activityId: string) => boolean;
  signIn: () => Promise<User | null>;
  signOut: () => Promise<void>;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  // Handle authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setLoading(true);
      if (authUser) {
        setUser(authUser);
        // Load user preferences from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', authUser.uid));
          if (userDoc.exists() && userDoc.data().preferences) {
            setPreferences(userDoc.data().preferences as UserPreferences);
          } else {
            // If no preferences in Firestore, check localStorage
            try {
              const storedPreferences = localStorage.getItem('userPreferences');
              if (storedPreferences) {
                const parsedPrefs = JSON.parse(storedPreferences);
                setPreferences(parsedPrefs);
                // Save localStorage preferences to Firestore
                await setDoc(doc(db, 'users', authUser.uid), {
                  preferences: parsedPrefs,
                  email: authUser.email,
                  lastUpdated: new Date().toISOString()
                }, { merge: true });
              }
            } catch (localError) {
              console.error('Failed to load user preferences from localStorage:', localError);
            }
          }
        } catch (error) {
          console.error('Failed to load user preferences from Firestore:', error);
        }
      } else {
        setUser(null);
        // Load preferences from localStorage when not authenticated
        try {
          const storedPreferences = localStorage.getItem('userPreferences');
          if (storedPreferences) {
            setPreferences(JSON.parse(storedPreferences));
          }
        } catch (error) {
          console.error('Failed to load user preferences from localStorage:', error);
        }
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Save preferences to storage (Firestore if authenticated, localStorage always)
  useEffect(() => {
    try {
      // Always save to localStorage as fallback
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      
      // If authenticated, also save to Firestore
      if (user) {
        const saveToFirestore = async () => {
          try {
            await setDoc(doc(db, 'users', user.uid), {
              preferences,
              lastUpdated: new Date().toISOString()
            }, { merge: true });
          } catch (error) {
            console.error('Failed to save user preferences to Firestore:', error);
          }
        };
        saveToFirestore();
      }
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  }, [preferences, user]);

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

  const signIn = async () => {
    try {
      const user = await signInWithGoogle();
      return user;
    } catch (error) {
      console.error('Error signing in:', error);
      return null;
    }
  };

  const signOut = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    loading,
    preferences,
    updatePreferences,
    saveActivity,
    unsaveActivity,
    isActivitySaved,
    signIn,
    signOut
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
