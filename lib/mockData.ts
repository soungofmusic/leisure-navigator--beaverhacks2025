import { LeisureActivity, ActivityType } from '../types';
import { getImageUrl, getImageUrls } from './imageService';

// Mock leisure activities data for Portland, OR
export const mockLeisureActivities: LeisureActivity[] = [
  {
    id: '1',
    title: 'Portland Japanese Garden',
    description: 'Experience tranquility in the heart of the city at this authentic Japanese garden, featuring meticulously maintained plants, scenic paths, and traditional architecture.',
    type: 'outdoor',
    location: {
      address: '611 SW Kingston Ave, Portland, OR 97205',
      coordinates: {
        lat: 45.5191,
        lng: -122.7084,
      },
    },
    schedule: {
      startDate: '2025-04-01T10:00:00',
      endDate: '2025-12-31T17:00:00',
      recurring: true,
      recurrencePattern: 'Daily, 10:00 AM - 5:00 PM',
    },
    price: {
      isFree: false,
      cost: 18.95,
      currency: 'USD',
    },
    contactInfo: {
      phone: '503-223-1321',
      email: 'info@japanesegarden.org',
      website: 'https://japanesegarden.org',
    },
    images: [getImageUrl('portland japanese garden')],
    rating: 4.8,
    tags: ['garden', 'nature', 'peaceful', 'cultural'],
  },
  {
    id: '2',
    title: 'Powell\'s City of Books',
    description: 'The world\'s largest independent bookstore, offering new and used books across multiple floors. A must-visit Portland landmark for book lovers.',
    type: 'indoor',
    location: {
      address: '1005 W Burnside St, Portland, OR 97209',
      coordinates: {
        lat: 45.5232,
        lng: -122.6819,
      },
    },
    schedule: {
      startDate: '2025-01-01T09:00:00',
      endDate: '2025-12-31T22:00:00',
      recurring: true,
      recurrencePattern: 'Daily, 9:00 AM - 10:00 PM',
    },
    price: {
      isFree: true,
    },
    contactInfo: {
      phone: '800-878-7323',
      website: 'https://www.powells.com',
    },
    images: [getImageUrl('powells city of books portland')],
    rating: 4.9,
    tags: ['books', 'shopping', 'iconic', 'literary'],
  },
  {
    id: '3',
    title: 'Portland Art Museum',
    description: 'Founded in 1892, this is the oldest art museum on the West Coast featuring a diverse collection of art from around the world.',
    type: 'cultural',
    location: {
      address: '1219 SW Park Ave, Portland, OR 97205',
      coordinates: {
        lat: 45.5169,
        lng: -122.6836,
      },
    },
    schedule: {
      startDate: '2025-01-01T10:00:00',
      endDate: '2025-12-31T17:00:00',
      recurring: true,
      recurrencePattern: 'Wednesday-Sunday, 10:00 AM - 5:00 PM. Closed Mondays and Tuesdays.',
    },
    price: {
      isFree: false,
      cost: 25,
      currency: 'USD',
    },
    contactInfo: {
      phone: '503-226-2811',
      website: 'https://portlandartmuseum.org',
    },
    images: [getImageUrl('portland art museum')],
    rating: 4.6,
    tags: ['art', 'museum', 'culture', 'exhibitions'],
  },
  {
    id: '4',
    title: 'Forest Park Hiking',
    description: 'Explore over 80 miles of trails in one of the largest urban forests in the United States. Perfect for hiking, trail running, or a peaceful nature walk.',
    type: 'outdoor',
    location: {
      address: 'NW 29th Ave & Upshur St, Portland, OR 97210',
      coordinates: {
        lat: 45.5369,
        lng: -122.7185,
      },
    },
    schedule: {
      startDate: '2025-01-01T05:00:00',
      endDate: '2025-12-31T22:00:00',
      recurring: true,
      recurrencePattern: 'Daily, 5:00 AM - 10:00 PM',
    },
    price: {
      isFree: true,
    },
    contactInfo: {
      website: 'https://www.portland.gov/parks/forest-park',
    },
    images: [getImageUrl('forest park portland')],
    rating: 4.9,
    tags: ['hiking', 'nature', 'trails', 'outdoor recreation'],
  },
  {
    id: '5',
    title: 'Portland Saturday Market',
    description: 'The largest continuously operating outdoor arts and crafts market in the United States. Browse handmade goods, enjoy street food, and experience live entertainment.',
    type: 'entertainment',
    location: {
      address: '2 SW Naito Pkwy, Portland, OR 97204',
      coordinates: {
        lat: 45.5224,
        lng: -122.6699,
      },
    },
    schedule: {
      startDate: '2025-03-01T10:00:00',
      endDate: '2025-12-24T17:00:00',
      recurring: true,
      recurrencePattern: 'Saturdays 10:00 AM - 5:00 PM, Sundays 11:00 AM - 4:30 PM',
    },
    price: {
      isFree: true,
    },
    contactInfo: {
      phone: '503-222-6072',
      email: 'info@portlandsaturdaymarket.com',
      website: 'https://www.portlandsaturdaymarket.com',
    },
    images: [getImageUrl('portland saturday market')],
    rating: 4.7,
    tags: ['shopping', 'arts', 'crafts', 'food', 'local'],
  },
  {
    id: '6',
    title: 'Pittock Mansion',
    description: 'Historic French Renaissance-style chateau with panoramic views of Portland and Mount Hood. Explore the mansion and beautifully landscaped grounds.',
    type: 'cultural',
    location: {
      address: '3229 NW Pittock Dr, Portland, OR 97210',
      coordinates: {
        lat: 45.5251,
        lng: -122.7162,
      },
    },
    schedule: {
      startDate: '2025-02-01T10:00:00',
      endDate: '2025-12-31T16:00:00',
      recurring: true,
      recurrencePattern: 'Daily, 10:00 AM - 4:00 PM',
    },
    price: {
      isFree: false,
      cost: 14.50,
      currency: 'USD',
    },
    contactInfo: {
      phone: '503-823-3623',
      website: 'https://pittockmansion.org',
    },
    images: [getImageUrl('pittock mansion portland')],
    rating: 4.7,
    tags: ['historic', 'mansion', 'views', 'architecture'],
  },
  {
    id: '7',
    title: 'Lan Su Chinese Garden',
    description: 'An authentic Ming Dynasty-style garden built by Suzhou artisans, offering a peaceful retreat in the heart of downtown Portland.',
    type: 'cultural',
    location: {
      address: '239 NW Everett St, Portland, OR 97209',
      coordinates: {
        lat: 45.5256,
        lng: -122.6729,
      },
    },
    schedule: {
      startDate: '2025-01-01T10:00:00',
      endDate: '2025-12-31T17:00:00',
      recurring: true,
      recurrencePattern: 'Daily, 10:00 AM - 5:00 PM',
    },
    price: {
      isFree: false,
      cost: 14,
      currency: 'USD',
    },
    contactInfo: {
      phone: '503-228-8131',
      email: 'info@lansugarden.org',
      website: 'https://lansugarden.org',
    },
    images: [getImageUrl('lan su chinese garden portland')],
    rating: 4.8,
    tags: ['garden', 'cultural', 'peaceful', 'tea house'],
  },
  {
    id: '8',
    title: 'Washington Park',
    description: 'A 410-acre recreational area featuring the Oregon Zoo, Portland Children\'s Museum, World Forestry Center, Hoyt Arboretum, and more.',
    type: 'outdoor',
    location: {
      address: '4033 SW Canyon Rd, Portland, OR 97221',
      coordinates: {
        lat: 45.5121,
        lng: -122.7159,
      },
    },
    schedule: {
      startDate: '2025-01-01T05:00:00',
      endDate: '2025-12-31T22:00:00',
      recurring: true,
      recurrencePattern: 'Daily, 5:00 AM - 10:00 PM',
    },
    price: {
      isFree: true,
    },
    contactInfo: {
      phone: '503-823-2525',
      website: 'https://www.portland.gov/parks/washington-park',
    },
    images: [getImageUrl('washington park portland')],
    rating: 4.8,
    tags: ['park', 'family-friendly', 'outdoors', 'attractions'],
  },
  {
    id: '9',
    title: 'Alberta Arts District',
    description: 'A vibrant neighborhood known for its colorful street art, independent boutiques, restaurants, and the monthly Last Thursday art walk.',
    type: 'entertainment',
    location: {
      address: 'NE Alberta St, Portland, OR 97211',
      coordinates: {
        lat: 45.5593,
        lng: -122.6464,
      },
    },
    schedule: {
      startDate: '2025-01-01T07:00:00',
      endDate: '2025-12-31T22:00:00',
      recurring: true,
      recurrencePattern: 'Daily, stores and restaurants have varying hours',
    },
    price: {
      isFree: true,
    },
    contactInfo: {
      website: 'https://albertamainst.org',
    },
    images: [getImageUrl('alberta arts district portland')],
    rating: 4.6,
    tags: ['arts', 'shopping', 'dining', 'street art'],
  },
  {
    id: '10',
    title: 'Portland Brewery Tour',
    description: 'Explore Portland\'s famous craft beer scene with a guided tour of local breweries. Learn about brewing processes and taste a variety of craft beers.',
    type: 'culinary',
    location: {
      address: 'Various locations, Portland, OR',
      coordinates: {
        lat: 45.5231,
        lng: -122.6765,
      },
    },
    schedule: {
      startDate: '2025-01-01T13:00:00',
      endDate: '2025-12-31T20:00:00',
      recurring: true,
      recurrencePattern: 'Daily, 1:00 PM - 8:00 PM',
    },
    price: {
      isFree: false,
      cost: 79,
      currency: 'USD',
    },
    contactInfo: {
      phone: '503-810-0808',
      website: 'https://brewvana.com',
    },
    images: [getImageUrl('portland brewery')],
    rating: 4.9,
    tags: ['beer', 'brewery', 'tours', 'tastings'],
  }
];

// Sample activity types to choose from
const activityTypes: ActivityType[] = [
  'outdoor', 'indoor', 'cultural', 'entertainment', 'culinary'
];

// Sample tags to choose from
const sampleTags: Record<ActivityType, string[]> = {
  'outdoor': ['nature', 'hiking', 'parks', 'scenic', 'trails', 'walking', 'biking', 'water'],
  'indoor': ['shopping', 'museum', 'gallery', 'library', 'bookstore', 'mall', 'arcade'],
  'cultural': ['historic', 'museum', 'art', 'theater', 'music', 'architecture', 'heritage'],
  'entertainment': ['nightlife', 'theater', 'music', 'comedy', 'sports', 'games', 'shows'],
  'culinary': ['restaurant', 'cafe', 'bakery', 'brewery', 'winery', 'food', 'drinks', 'dining'],
  'sports': ['basketball', 'soccer', 'tennis', 'golf', 'baseball', 'running', 'fitness'],
  'educational': ['workshop', 'class', 'tour', 'lecture', 'seminar', 'learning', 'history'],
  'nightlife': ['club', 'bar', 'pub', 'lounge', 'dancing', 'live music', 'concert'],
  'wellness': ['spa', 'yoga', 'meditation', 'massage', 'relaxation', 'health', 'retreat'],
  'other': ['unique', 'special', 'seasonal', 'festival', 'event', 'community', 'local']
};

// Generate a random price between min and max
const getRandomPrice = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate a random rating between 3.5 and 5.0
const getRandomRating = (): number => {
  return Number((Math.random() * 1.5 + 3.5).toFixed(1));
};

// Generate activities for a specific location
const generateActivitiesForLocation = (locationName: string, lat: number, lng: number, count: number = 5): LeisureActivity[] => {
  const activities: LeisureActivity[] = [];
  
  // Popular prefixes for activity names
  const prefixes = [
    '', 'Downtown', 'Historic', 'Old Town', 'Central', 'Riverside', 
    'Lakeside', 'Uptown', 'Modern', 'Traditional', 'Local', 'Famous'
  ];
  
  // Common activity name formats
  const activityTemplates = [
    '{{prefix}} {{location}} Park',
    '{{prefix}} {{location}} Museum',
    '{{prefix}} {{location}} Gardens',
    '{{prefix}} {{location}} Shopping District',
    '{{location}} Hiking Trails',
    '{{location}} Food Market',
    '{{location}} Historical Site',
    '{{prefix}} {{location}} Art Gallery',
    '{{location}} Brewery Tour',
    '{{location}} Cultural Center',
    '{{location}} Scenic Viewpoint',
    '{{prefix}} {{location}} Theater',
    '{{location}} Local Cuisine Tour',
    '{{location}} Wine Tasting',
    '{{location}} Outdoor Adventure'
  ];
  
  // Sample descriptions
  const descriptionTemplates = [
    'Explore the beautiful sights of {{location}} at this popular destination.',
    'Experience the unique culture and history of {{location}} through this fascinating activity.',
    'A must-visit attraction for anyone coming to {{location}}.',
    'Locals and tourists alike rave about this {{location}} highlight.',
    'Discover why this is one of the most popular things to do in {{location}}.',
    'Immerse yourself in the natural beauty surrounding {{location}}.',
    'Learn about the rich heritage and traditions of {{location}}.',
    'Get a taste of what makes {{location}} special with this experience.',
    'Enjoy the sights and sounds of {{location}} at this popular venue.',
    'Relax and unwind while enjoying this classic {{location}} activity.'
  ];
  
  for (let i = 0; i < count; i++) {
    // Pick a random activity type
    const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    
    // Pick a random prefix or empty string
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    
    // Pick a random activity template
    const activityTemplate = activityTemplates[Math.floor(Math.random() * activityTemplates.length)];
    
    // Generate title from template
    const title = activityTemplate
      .replace('{{prefix}}', prefix)
      .replace('{{location}}', locationName);
      
    // Pick a random description template
    const descriptionTemplate = descriptionTemplates[Math.floor(Math.random() * descriptionTemplates.length)];
    
    // Generate description from template
    const description = descriptionTemplate.replace(/\{\{location\}\}/g, locationName);
    
    // Generate random coordinates near the provided location
    const latOffset = (Math.random() - 0.5) * 0.1; // Random offset within ~5km
    const lngOffset = (Math.random() - 0.5) * 0.1;
    
    // Determine if the activity is free or has a cost
    const isFree = Math.random() > 0.7; // 30% chance of being free
    
    // Pick 2-4 random tags from the corresponding type
    const availableTags = sampleTags[type];
    const numTags = Math.floor(Math.random() * 3) + 2; // 2 to 4 tags
    const shuffledTags = [...availableTags].sort(() => Math.random() - 0.5);
    const tags = shuffledTags.slice(0, numTags);
    
    // Get random image for the activity
    const imageSearchTerm = `${title} ${locationName} ${type}`;
    
    activities.push({
      id: `gen_${locationName.toLowerCase().replace(/\s+/g, '_')}_${i + 1}`,
      title,
      description,
      type,
      location: {
        address: `${locationName}`,
        coordinates: {
          lat: lat + latOffset,
          lng: lng + lngOffset
        }
      },
      schedule: {
        startDate: '2025-04-01T09:00:00',
        endDate: '2025-12-31T18:00:00',
        recurring: true,
        recurrencePattern: 'Daily, 9:00 AM - 6:00 PM'
      },
      price: isFree ? { isFree: true } : {
        isFree: false,
        cost: getRandomPrice(10, 50),
        currency: 'USD'
      },
      contactInfo: {
        website: `https://example.com/${locationName.toLowerCase().replace(/\s+/g, '-')}`
      },
      images: [getImageUrl(imageSearchTerm)],
      rating: getRandomRating(),
      tags
    });
  }
  
  return activities;
};

// Function to fetch activities based on filters
export const fetchActivities = (filters?: any): Promise<LeisureActivity[]> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      let filteredActivities = [...mockLeisureActivities];
      
      // Add location-based activities if location is provided
      if (filters && filters.location) {
        const { lat, lng } = filters.location;
        
        // Reverse geocode to get the location name based on coordinates
        // For simplicity, we'll just use generic names based on coordinates
        let locationName = 'Portland';
        
        // If different from Portland's coordinates, use a different name
        if (Math.abs(lat - 45.5152) > 0.01 || Math.abs(lng - (-122.6784)) > 0.01) {
          // For demo purposes, we'll name locations based on their position
          if (lat > 45.5152) {
            locationName = 'North Portland';
          } else if (lat < 45.5152) {
            locationName = 'South Portland';
          }
          
          if (lng > -122.6784) {
            locationName = 'East ' + locationName;
          } else if (lng < -122.6784) {
            locationName = 'West ' + locationName;
          }
        }
        
        // Generate new activities for this location
        const locationActivities = generateActivitiesForLocation(locationName, lat, lng, 7);
        
        // Add them to the activities list
        filteredActivities = [...filteredActivities, ...locationActivities];
      }
      
      // Apply filters if provided
      if (filters) {
        if (filters.type && filters.type.length > 0) {
          filteredActivities = filteredActivities.filter(activity => 
            filters.type.includes(activity.type)
          );
        }
        
        if (filters.query) {
          const query = filters.query.toLowerCase();
          filteredActivities = filteredActivities.filter(activity => 
            activity.title.toLowerCase().includes(query) || 
            activity.description.toLowerCase().includes(query) ||
            activity.tags.some((tag: string) => tag.toLowerCase().includes(query))
          );
        }
        
        if (filters.priceRange) {
          filteredActivities = filteredActivities.filter(activity => {
            if (activity.price.isFree) {
              return filters.priceRange.min === 0;
            }
            return (
              activity.price.cost !== undefined &&
              activity.price.cost >= filters.priceRange.min &&
              activity.price.cost <= filters.priceRange.max
            );
          });
        }

        // Filter by distance if specified
        if (filters.distance && filters.location) {
          const { lat, lng } = filters.location;
          const maxDistanceKm = filters.distance * 1.60934; // Convert miles to km
          
          filteredActivities = filteredActivities.filter(activity => {
            const activityLat = activity.location.coordinates.lat;
            const activityLng = activity.location.coordinates.lng;
            
            // Calculate rough distance using Haversine formula
            const distance = calculateDistance(
              lat, lng,
              activityLat, activityLng
            );
            
            return distance <= maxDistanceKm;
          });
        }
      }
      
      resolve(filteredActivities);
    }, 800); // Simulate network delay
  });
};

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Function to fetch a single activity by ID
export const fetchActivityById = (id: string): Promise<LeisureActivity | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const activity = mockLeisureActivities.find(activity => activity.id === id) || null;
      resolve(activity);
    }, 500); // Simulate network delay
  });
};
