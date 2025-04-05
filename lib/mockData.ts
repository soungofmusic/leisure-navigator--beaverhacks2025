import { LeisureActivity } from '@/types';

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
    images: ['/japanese-garden.jpg'],
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
    images: ['/powells-books.jpg'],
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
    images: ['/art-museum.jpg'],
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
    images: ['/forest-park.jpg'],
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
    images: ['/saturday-market.jpg'],
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
    images: ['/pittock-mansion.jpg'],
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
    images: ['/lan-su-garden.jpg'],
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
    images: ['/washington-park.jpg'],
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
    images: ['/alberta-arts.jpg'],
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
    images: ['/brewery-tour.jpg'],
    rating: 4.9,
    tags: ['beer', 'brewery', 'tours', 'tastings'],
  }
];

// Function to fetch activities based on filters
export const fetchActivities = (filters?: any): Promise<LeisureActivity[]> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      let filteredActivities = [...mockLeisureActivities];
      
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
      }
      
      resolve(filteredActivities);
    }, 800); // Simulate network delay
  });
};

// Function to fetch a single activity by ID
export const fetchActivityById = (id: string): Promise<LeisureActivity | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const activity = mockLeisureActivities.find(activity => activity.id === id) || null;
      resolve(activity);
    }, 500); // Simulate network delay
  });
};
