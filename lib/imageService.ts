// Service to fetch images from the web based on search terms

/**
 * Fetches an image URL from Google Custom Search API based on a search term
 * @param searchTerm The search term to use for fetching the image
 * @returns Promise with the image URL or null if not found
 */
export async function getGoogleImageUrl(searchTerm: string): Promise<string | null> {
  // Get API key and Search Engine ID from environment variables
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_CUSTOM_SEARCH_API_KEY;
  const searchEngineId = process.env.NEXT_PUBLIC_GOOGLE_SEARCH_ENGINE_ID;
  
  if (!apiKey || !searchEngineId) {
    console.error('Google Custom Search API key or Search Engine ID not found');
    return getPlaceholderImageUrl(searchTerm);
  }
  
  // Encode the search term for use in a URL
  const encodedSearchTerm = encodeURIComponent(searchTerm);
  
  try {
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodedSearchTerm}&searchType=image&num=1`
    );
    
    if (!response.ok) {
      throw new Error(`Google Custom Search API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check if there are any search results
    if (data.items && data.items.length > 0) {
      return data.items[0].link;
    } else {
      console.warn(`No image results found for search term: ${searchTerm}`);
      return getPlaceholderImageUrl(searchTerm);
    }
  } catch (error) {
    console.error('Error fetching image from Google Custom Search API:', error);
    return getPlaceholderImageUrl(searchTerm);
  }
}

/**
 * Returns a URL to a placeholder image if the Google API fails
 * @param searchTerm The search term to use for the placeholder
 * @returns A placeholder image URL
 */
function getPlaceholderImageUrl(searchTerm: string): string {
  // Use local placeholder images from the project
  const searchTermLower = searchTerm.toLowerCase();
  
  // Map of keywords to specific local images
  const localImageMap: Record<string, string> = {
    'japanese garden': '/japanese-garden.jpg',
    'powells': '/powells-books.jpg',
    'art museum': '/art-museum.jpg',
    'forest park': '/forest-park.jpg',
    'saturday market': '/saturday-market.jpg',
    'pittock mansion': '/pittock-mansion.jpg',
    'lan su': '/lan-su-garden.jpg',
    'washington park': '/washington-park.jpg',
    'alberta': '/alberta-arts.jpg',
    'brewery': '/brewery-tour.jpg'
  };
  
  // Find a matching local image
  for (const [keyword, imagePath] of Object.entries(localImageMap)) {
    if (searchTermLower.includes(keyword)) {
      return imagePath;
    }
  }
  
  // If no specific match, return a generic placeholder based on activity type
  if (searchTermLower.includes('outdoor')) return '/forest-park.jpg';
  if (searchTermLower.includes('indoor')) return '/powells-books.jpg';
  if (searchTermLower.includes('cultural')) return '/japanese-garden.jpg';
  if (searchTermLower.includes('culinary')) return '/brewery-tour.jpg';
  if (searchTermLower.includes('entertainment')) return '/alberta-arts.jpg';
  
  // Default fallback
  return '/placeholder.jpg';
}

/**
 * Legacy function that returns a URL to fetch an image from Unsplash based on a search term
 * Kept for backward compatibility
 * @param searchTerm The search term to use for fetching the image
 */
export function getImageUrl(searchTerm: string): string {
  // Encode the search term for use in a URL
  const encodedSearchTerm = encodeURIComponent(searchTerm);
  
  // Return the URL for the Unsplash Source API (as fallback)
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
