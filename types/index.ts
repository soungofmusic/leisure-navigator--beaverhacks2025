export interface LeisureActivity {
  id: string;
  title: string;
  description: string;
  type: ActivityType;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  schedule: {
    startDate: string;
    endDate: string;
    recurring?: boolean;
    recurrencePattern?: string;
  };
  price: {
    isFree: boolean;
    cost?: number;
    currency?: string;
    level?: number; // Price level from Google Places API (0-4)
  };
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  images?: string[];
  rating?: number;
  reviews?: Review[];
  tags: string[];
  isAIEnhanced?: boolean; // Flag indicating if description was enhanced by Groq AI
  googleDetails?: {
    placeId: string;
    rating: number; // Google rating (0-5)
    userRatingsTotal: number; // Total number of Google reviews
    priceLevel?: number; // Price level from Google Places API (0-4)
    types?: string[]; // Place types from Google Places API
    url?: string; // Google Maps URL
    website?: string; // Official website
    formattedAddress?: string;
    vicinity?: string; // Nearby area/address
    photos?: string[]; // Photo references
  }
}

export type ActivityType = 
  | 'outdoor'
  | 'indoor'
  | 'cultural'
  | 'entertainment'
  | 'sports'
  | 'culinary'
  | 'educational'
  | 'nightlife'
  | 'wellness'
  | 'other';

export interface Review {
  id: string;
  userId: string;
  username: string;
  rating: number;
  comment?: string;
  date: string;
}

export interface SearchFilters {
  type?: ActivityType[];
  priceRange?: {
    min: number;
    max: number;
  };
  date?: string;
  tags?: string[];
  location?: {
    lat: number;
    lng: number;
    radius: number; // in meters
  };
  query?: string;
}

export interface UserPreferences {
  favoriteTypes: ActivityType[];
  favoriteTags: string[];
  savedActivities: string[]; // activity IDs
  location?: {
    lat: number;
    lng: number;
  };
}
