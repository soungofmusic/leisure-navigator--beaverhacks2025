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
