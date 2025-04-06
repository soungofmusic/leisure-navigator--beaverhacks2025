import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc, query, where, Firestore } from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, Auth, User } from 'firebase/auth';
import { getFunctions, httpsCallable, Functions } from 'firebase/functions';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || ''
};

// Check if Firebase config is valid
const isFirebaseConfigValid = (
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== '' && 
  firebaseConfig.projectId && 
  firebaseConfig.projectId !== ''
);

// Initialize Firebase
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let functions: Functions;

// Mock implementations for when Firebase is not configured
const mockCollection = {
  // This creates a proper collection reference-like object
  docs: [],
  id: 'mock-collection',
  path: 'mock-collection',
};

const mockFirestore = {
  // Return a proper collection reference-like object
  collection: () => mockCollection,
  doc: () => ({ id: 'mock-doc', path: 'mock-doc' }),
  getDoc: async () => ({ exists: () => false, data: () => ({}) }),
  getDocs: async () => ({ docs: [] }),
  addDoc: async () => ({ id: 'mock-doc-id' }),
  updateDoc: async () => ({}),
  deleteDoc: async () => ({}),
  query: () => mockCollection,
  where: () => ({})
};

const mockAuth = {
  currentUser: null,
  onAuthStateChanged: (callback: any) => {
    callback(null);
    return () => {};
  },
  signInWithPopup: async () => ({ user: null }),
  signOut: async () => {}
};

try {
  if (isFirebaseConfigValid) {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
      db = getFirestore(app);
      auth = getAuth(app);
      functions = getFunctions(app);
    } else {
      app = getApps()[0];
      db = getFirestore(app);
      auth = getAuth(app);
      functions = getFunctions(app);
    }
    console.log('Firebase initialized successfully');
  } else {
    console.warn('Firebase configuration is incomplete or missing. Using mock implementations.');
    // @ts-ignore - Use mock implementations
    db = mockFirestore as Firestore;
    // @ts-ignore
    auth = mockAuth as Auth;
    // @ts-ignore
    functions = { httpsCallable: () => async () => ({ data: {} }) } as Functions;
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
  // @ts-ignore - Use mock implementations
  db = mockFirestore as Firestore;
  // @ts-ignore
  auth = mockAuth as Auth;
  // @ts-ignore
  functions = { httpsCallable: () => async () => ({ data: {} }) } as Functions;
}

// Authentication helpers
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    if (!isFirebaseConfigValid) {
      console.warn('Firebase is not configured. Authentication will not work.');
      return null;
    }
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    return null;
  }
};

const logoutUser = async () => {
  try {
    if (!isFirebaseConfigValid) {
      console.warn('Firebase is not configured. Authentication will not work.');
      return;
    }
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

// Firestore collection references - check if db exists first
let usersCollection;
let preferencesCollection;
let activityHistoryCollection;

// Define collections only after we confirm Firebase is properly initialized
if (isFirebaseConfigValid) {
  try {
    usersCollection = collection(db, 'users');
    preferencesCollection = collection(db, 'preferences');
    activityHistoryCollection = collection(db, 'activityHistory');
  } catch (error) {
    console.error('Error initializing Firestore collections:', error);
    // Use mock collections as fallback
    usersCollection = mockCollection;
    preferencesCollection = mockCollection;
    activityHistoryCollection = mockCollection;
  }
} else {
  // When Firebase is not configured, use mock collections directly
  console.log('Using mock Firestore collections for development');
  usersCollection = mockCollection;
  preferencesCollection = mockCollection;
  activityHistoryCollection = mockCollection;
}

export {
  app,
  db,
  auth,
  functions,
  signInWithGoogle,
  logoutUser,
  googleProvider,
  onAuthStateChanged,
  usersCollection,
  preferencesCollection,
  activityHistoryCollection,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  httpsCallable
};

export type { User };
