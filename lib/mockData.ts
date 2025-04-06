import { LeisureActivity, ActivityType } from '../types';
import { getImageUrl, getGoogleImageUrl } from './imageService';
import { enhanceActivityDescription } from './groqService';

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
  },
  {
    id: '11',
    title: 'Portland Timbers Soccer Match',
    description: 'Experience the electric atmosphere of a Portland Timbers soccer match at Providence Park. Join the Timbers Army fan club for an unforgettable sporting event.',
    type: 'sports',
    location: {
      address: '1844 SW Morrison St, Portland, OR 97205',
      coordinates: {
        lat: 45.5216,
        lng: -122.6916,
      },
    },
    schedule: {
      startDate: '2025-03-01T19:30:00',
      endDate: '2025-10-31T22:00:00',
      recurring: true,
      recurrencePattern: 'Home matches on weekends, typically 7:30 PM',
    },
    price: {
      isFree: false,
      cost: 45,
      currency: 'USD',
    },
    contactInfo: {
      phone: '503-553-5400',
      website: 'https://www.timbers.com',
    },
    images: [getImageUrl('portland timbers soccer')],
    rating: 4.8,
    tags: ['sports', 'soccer', 'live events', 'timbers'],
  },
  {
    id: '12',
    title: 'OMSI - Oregon Museum of Science and Industry',
    description: 'Explore interactive exhibits, planetarium shows, and hands-on science demonstrations at this educational museum for all ages.',
    type: 'educational',
    location: {
      address: '1945 SE Water Ave, Portland, OR 97214',
      coordinates: {
        lat: 45.5083,
        lng: -122.6653,
      },
    },
    schedule: {
      startDate: '2025-01-01T09:30:00',
      endDate: '2025-12-31T17:30:00',
      recurring: true,
      recurrencePattern: 'Tuesday-Sunday, 9:30 AM - 5:30 PM, Closed Mondays',
    },
    price: {
      isFree: false,
      cost: 15,
      currency: 'USD',
    },
    contactInfo: {
      phone: '503-797-4000',
      website: 'https://omsi.edu',
    },
    images: [getImageUrl('oregon museum of science industry portland')],
    rating: 4.7,
    tags: ['museum', 'science', 'educational', 'family-friendly'],
  },
  {
    id: '13',
    title: 'Dante\'s Live Music Venue',
    description: 'A legendary Portland nightlife destination featuring live music, performances, and dancing in an intimate venue with full bar service.',
    type: 'nightlife',
    location: {
      address: '350 W Burnside St, Portland, OR 97209',
      coordinates: {
        lat: 45.5230,
        lng: -122.6747,
      },
    },
    schedule: {
      startDate: '2025-01-01T20:00:00',
      endDate: '2025-12-31T02:30:00',
      recurring: true,
      recurrencePattern: 'Thursday-Saturday, 8:00 PM - 2:30 AM',
    },
    price: {
      isFree: false,
      cost: 15,
      currency: 'USD',
    },
    contactInfo: {
      phone: '503-226-6630',
      website: 'https://www.danteslive.com',
    },
    images: [getImageUrl('dantes live music portland')],
    rating: 4.5,
    tags: ['nightlife', 'live music', 'dancing', 'bar'],
  },
  {
    id: '14',
    title: 'Knot Springs Wellness Club',
    description: 'A luxurious urban wellness retreat offering soaking pools, sauna, steam room, and massage services with panoramic views of the city.',
    type: 'wellness',
    location: {
      address: '33 NE 3rd Ave, Portland, OR 97232',
      coordinates: {
        lat: 45.5234,
        lng: -122.6639,
      },
    },
    schedule: {
      startDate: '2025-01-01T06:00:00',
      endDate: '2025-12-31T22:00:00',
      recurring: true,
      recurrencePattern: 'Daily, 6:00 AM - 10:00 PM',
    },
    price: {
      isFree: false,
      cost: 65,
      currency: 'USD',
    },
    contactInfo: {
      phone: '503-222-5668',
      website: 'https://www.knotsprings.com',
    },
    images: [getImageUrl('knot springs wellness portland')],
    rating: 4.6,
    tags: ['wellness', 'spa', 'relaxation', 'massage'],
  },
  {
    id: '15',
    title: 'Portland Aerial Tram',
    description: 'A unique transportation experience offering spectacular views of Portland, Mount Hood, and the Willamette River during a scenic aerial ride.',
    type: 'other',
    location: {
      address: '3303 SW Bond Ave, Portland, OR 97239',
      coordinates: {
        lat: 45.4999,
        lng: -122.6712,
      },
    },
    schedule: {
      startDate: '2025-01-01T05:30:00',
      endDate: '2025-12-31T21:30:00',
      recurring: true,
      recurrencePattern: 'Weekdays 5:30 AM - 9:30 PM, Weekends 9:00 AM - 5:00 PM',
    },
    price: {
      isFree: false,
      cost: 5.55,
      currency: 'USD',
    },
    contactInfo: {
      phone: '503-494-8283',
      website: 'https://www.gobytram.com',
    },
    images: [getImageUrl('portland aerial tram')],
    rating: 4.7,
    tags: ['scenic', 'views', 'transportation', 'unique'],
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

// Generate activities for a given location
async function generateActivitiesForLocation(locationName: string, lat: number, lng: number, count: number): Promise<LeisureActivity[]> {
  const activities: LeisureActivity[] = [];
  
  for (let i = 0; i < count; i++) {
    const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const tags = sampleTags[activityType] || [];
    const selectedTags = tags
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 2);
    
    // Generate random activity names and descriptions based on the location
    const activityNames = {
      'outdoor': [
        'Hiking Adventure',
        'Nature Walk',
        'Park Exploration',
        'Outdoor Recreation',
        'Scenic Viewpoints'
      ],
      'indoor': [
        'Museum Visit',
        'Indoor Recreation',
        'Shopping Experience',
        'Indoor Entertainment',
        'Exhibition Viewing'
      ],
      'cultural': [
        'Cultural Experience',
        'Art Appreciation',
        'Heritage Tour',
        'Historical Visit',
        'Cultural Workshop'
      ],
      'entertainment': [
        'Live Performance',
        'Entertainment Venue',
        'Family Fun',
        'Exciting Show',
        'Entertainment Experience',
        'Cinema Experience',
        'Music Venue',
        'Comedy Club',
        'Entertainment District'
      ],
      'culinary': [
        'Food Tour',
        'Farmers Market',
        'Culinary Experience',
        'Brewery Tour',
        'Wine Tasting'
      ],
      'sports': [
        'Sports Event',
        'Athletic Activity',
        'Game Day', 
        'Sports Venue',
        'Team Competition'
      ],
      'educational': [
        'Learning Experience',
        'Educational Tour',
        'Workshop',
        'Class',
        'Seminar'
      ],
      'nightlife': [
        'Evening Entertainment',
        'Night Event',
        'After Hours Fun',
        'Nightclub Experience',
        'Late Night Activity'
      ],
      'wellness': [
        'Spa Day',
        'Relaxation Session',
        'Wellness Retreat',
        'Health Activity',
        'Mindfulness Practice'
      ],
      'other': [
        'Local Experience',
        'Special Event',
        'Unique Activity',
        'Community Gathering',
        'Hidden Gem'
      ]
    };
    
    const names = activityNames[activityType] || activityNames['outdoor'];
    const activityName = names[Math.floor(Math.random() * names.length)];
    
    const descriptions = {
      'outdoor': [
        `Explore the beautiful outdoor spaces of ${locationName} with this exciting adventure.`,
        `Discover hidden natural gems in ${locationName} on this outdoor excursion.`,
        `Experience the stunning landscapes and fresh air of ${locationName}.`,
        `Enjoy recreational activities in the scenic environment of ${locationName}.`,
      ],
      'indoor': [
        `Visit fascinating indoor attractions in ${locationName} with this engaging activity.`,
        `Discover the interesting indoor spaces of ${locationName}.`,
        `Enjoy a climate-controlled experience in ${locationName} regardless of weather.`,
        `Explore indoor wonders in the heart of ${locationName}.`,
      ],
      'cultural': [
        `Immerse yourself in the rich cultural heritage of ${locationName}.`,
        `Experience the artistic and cultural treasures of ${locationName}.`,
        `Discover the historical and cultural significance of ${locationName}.`,
        `Explore the cultural identity and artistic expressions of ${locationName}.`,
      ],
      'entertainment': [
        `Enjoy exciting entertainment options in ${locationName}.`,
        `Experience thrilling performances and shows in ${locationName}.`,
        `Have a fantastic time with top-quality entertainment in ${locationName}.`,
        `Be entertained by the vibrant scene in ${locationName}.`,
      ],
      'culinary': [
        `Savor the flavors of ${locationName} with this delicious culinary experience.`,
        `Taste local specialties and discover food gems in ${locationName}.`,
        `Indulge in ${locationName}'s food and drink scene with this culinary adventure.`,
        `Experience the tastes and aromas that make ${locationName}'s food scene special.`,
      ],
      'sports': [
        `Participate in or watch thrilling sports activities in ${locationName}.`,
        `Get active with sports and recreational activities in ${locationName}.`,
        `Experience the excitement of sports events in ${locationName}.`,
        `Join the local sports community in ${locationName} for a fun activity.`,
      ],
      'educational': [
        `Expand your knowledge with educational experiences in ${locationName}.`,
        `Learn something new through hands-on activities in ${locationName}.`,
        `Engage your mind with interesting facts and discoveries in ${locationName}.`,
        `Participate in educational workshops and classes in ${locationName}.`,
      ],
      'nightlife': [
        `Experience the vibrant nightlife and evening entertainment in ${locationName}.`,
        `Enjoy after-hours fun in the exciting atmosphere of ${locationName}.`,
        `Discover the best night spots and venues in ${locationName}.`,
        `Immerse yourself in the energetic nighttime scene of ${locationName}.`,
      ],
      'wellness': [
        `Relax and rejuvenate with wellness activities in ${locationName}.`,
        `Focus on self-care and health with specialized services in ${locationName}.`,
        `Restore balance and find tranquility in ${locationName}.`,
        `Improve your wellbeing with therapeutic experiences in ${locationName}.`,
      ],
      'other': [
        `Discover unique and interesting activities in ${locationName}.`,
        `Try something different with this special experience in ${locationName}.`,
        `Explore one of ${locationName}'s hidden gems and local favorites.`,
        `Enjoy a memorable activity that showcases the best of ${locationName}.`,
      ],
    };
    
    const descList = descriptions[activityType] || descriptions['outdoor'];
    const basicDescription = descList[Math.floor(Math.random() * descList.length)];
    
    // Enhanced description with Groq (if API key is available)
    let description = basicDescription;
    try {
      // Only enhance some descriptions to manage API usage (30% chance)
      if (Math.random() > 0.7) {
        // Add isEnhanced flag to indicate AI enhancement
        const enhancedDescription = await enhanceActivityDescription(basicDescription, activityType);
        if (enhancedDescription !== basicDescription) {
          description = enhancedDescription;
        }
      }
    } catch (error) {
      console.error(`Failed to enhance description with Groq: ${error}`);
      // Use the basic description if enhancement fails
    }
    
    // Generate a slightly offset location from the provided coordinates
    const latOffset = (Math.random() - 0.5) * 0.05;
    const lngOffset = (Math.random() - 0.5) * 0.05;
    
    // Create a search term for Google image search
    const imageSearchTerm = `${activityName} ${locationName} ${activityType}`;
    
    const activity: LeisureActivity = {
      id: `gen-${locationName.replace(/\s+/g, '-').toLowerCase()}-${i + 1}`,
      title: activityName,
      description,
      type: activityType,
      location: {
        address: `${locationName}, OR`,
        coordinates: {
          lat: lat + latOffset,
          lng: lng + lngOffset,
        },
      },
      schedule: {
        startDate: '2025-04-01T10:00:00',
        endDate: '2025-12-31T17:00:00',
        recurring: true,
        recurrencePattern: 'Daily, 10:00 AM - 5:00 PM',
      },
      price: {
        isFree: Math.random() > 0.5,
        cost: Math.random() > 0.5 ? getRandomPrice(10, 50) : undefined,
        currency: 'USD',
      },
      contactInfo: {
        website: `https://www.${locationName.replace(/\s+/g, '').toLowerCase()}.example.com`,
      },
      // Use Unsplash as a fallback while we implement Google Images API completely
      // For the production version, you'll want to preload these images or handle asynchronously
      images: [getImageUrl(imageSearchTerm)],
      rating: getRandomRating(),
      tags: selectedTags,
      // Flag to indicate if description was enhanced by AI
      isAIEnhanced: description !== basicDescription
    };
    
    activities.push(activity);
  }
  
  return activities;
};

// Function to fetch activities based on filters
export const fetchActivities = (filters?: any): Promise<LeisureActivity[]> => {
  return new Promise(async (resolve) => {
    // Simulate network delay
    setTimeout(async () => {
      let filteredActivities = [...mockLeisureActivities];
      const minimumResultCount = 5; // Ensure at least this many results per filter
      
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
        const locationActivities = await generateActivitiesForLocation(locationName, lat, lng, 7);
        
        // Add them to the activities list
        filteredActivities = [...filteredActivities, ...locationActivities];
      }
      
      // Apply filters if provided
      if (filters) {
        if (filters.type && filters.type.length > 0) {
          // Filter by activity type
          filteredActivities = filteredActivities.filter(activity => 
            filters.type.includes(activity.type)
          );
          
          // Ensure we have at least 5 results for each selected type
          for (const activityType of filters.type) {
            const resultsForType = filteredActivities.filter(activity => activity.type === activityType);
            
            if (resultsForType.length < minimumResultCount) {
              const additionalNeeded = minimumResultCount - resultsForType.length;
              
              // Generate additional activities for this type
              const baseActivity = resultsForType[0] || mockLeisureActivities.find(a => a.type === activityType);
              
              if (baseActivity) {
                for (let i = 0; i < additionalNeeded; i++) {
                  const newActivity: LeisureActivity = {
                    ...JSON.parse(JSON.stringify(baseActivity)),
                    id: `generated-${activityType}-${i}`,
                    title: `${baseActivity.title} - ${i + 1}`,
                    description: `${baseActivity.description.split('.')[0]}. Dynamic activity based on popular demand.`,
                    location: {
                      ...baseActivity.location,
                      coordinates: {
                        lat: baseActivity.location.coordinates.lat + (Math.random() - 0.5) * 0.01,
                        lng: baseActivity.location.coordinates.lng + (Math.random() - 0.5) * 0.01
                      }
                    },
                    rating: Number((baseActivity.rating || 4.5) - 0.1 * Math.random()).toFixed(1) as unknown as number,
                    tags: [...baseActivity.tags, 'popular']
                  };
                  
                  filteredActivities.push(newActivity);
                }
              }
            }
          }
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
