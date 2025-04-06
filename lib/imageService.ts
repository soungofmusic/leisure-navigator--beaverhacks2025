// Service to fetch images from the web based on search terms

/**
 * Fetches an image URL for a given search term using a free image API
 * This uses Unsplash Source API which is free and doesn't require authentication
 */
export const getImageUrl = (searchTerm: string): string => {
  // Encode the search term for URL
  const encodedSearchTerm = encodeURIComponent(searchTerm);
  
  // Use Unsplash Source API for free images without authentication
  return `https://source.unsplash.com/featured/?${encodedSearchTerm}`;
};

/**
 * Gets a list of image URLs for a given search term
 * @param searchTerm The term to search for
 * @param count Number of images to return
 */
export const getImageUrls = (searchTerm: string, count: number = 1): string[] => {
  const urls: string[] = [];
  
  // Add a random number to make each URL unique
  for (let i = 0; i < count; i++) {
    urls.push(`${getImageUrl(searchTerm)}&random=${Math.random()}`);
  }
  
  return urls;
};
