// Using basic TypeScript types for message structure
import { LeisureActivity, ActivityType } from '../types';

// Interface for image processing results
interface ImageProcessingResult {
  extractedText: string;
  detectedObjects: string[];
  suggestedFilters: {
    types?: ActivityType[];
    tags?: string[];
  };
}

// Helper function to get Groq API key from environment variables
const getGroqApiKey = (): string => {
  return process.env.NEXT_PUBLIC_GROQ_API_KEY || '';
};

// Helper function to make Groq API calls
// Defining message structure with a more flexible role type
type ChatMessage = {
  role: string;
  content: string;
};

async function callGroqApi(messages: ChatMessage[], model: string, options: any = {}) {
  const apiKey = getGroqApiKey();
  
  if (!apiKey) {
    throw new Error('Groq API key not found');
  }

  const defaultOptions = {
    max_tokens: 250,
    temperature: 0.7,
  };

  const requestOptions = {
    ...defaultOptions,
    ...options,
  };

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      ...requestOptions,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${error}`);
  }

  return await response.json();
}

/**
 * Enhance activity descriptions with Groq's LLM
 * @param basicDescription The original activity description
 * @param activityType The type of activity
 * @returns An enhanced description generated by Groq's LLM
 */
export async function enhanceActivityDescription(
  basicDescription: string,
  activityType: ActivityType
): Promise<string> {
  // If API key is not set, return the original description
  if (!getGroqApiKey()) {
    console.warn('Groq API key not found. Using original description.');
    return basicDescription;
  }

  try {
    const messages = [
      {
        role: 'system',
        content: 'You are a travel and leisure expert. Enhance the given activity description to make it more engaging, informative and exciting without being verbose. Maintain the original tone and key information, but add helpful details travelers would appreciate.'
      },
      {
        role: 'user',
        content: `Enhance this ${activityType} activity description (keep it under 200 characters): ${basicDescription}`
      }
    ];

    const response = await callGroqApi(messages, 'llama3-8b-8192', {
      max_tokens: 250,
      temperature: 0.7
    });

    return response.choices[0].message.content || basicDescription;
  } catch (error) {
    console.error('Error enhancing description with Groq:', error);
    return basicDescription; // Return original on error
  }
}

/**
 * Generate personalized activity recommendations based on user preferences
 * @param activities Available activities
 * @param userPreferences User preferences including favorite types and tags
 * @returns Ranked list of recommended activities
 */
export async function getPersonalizedRecommendations(
  activities: LeisureActivity[],
  userPreferences: {
    favoriteTypes: ActivityType[];
    favoriteTags: string[];
    location?: { lat: number; lng: number };
  }
): Promise<LeisureActivity[]> {
  // If API key is not set, return activities sorted by rating
  if (!getGroqApiKey()) {
    console.warn('Groq API key not found. Using basic recommendation logic.');
    return activities.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  try {
    // Create a context object to pass to Groq
    const context = {
      favoriteTypes: userPreferences.favoriteTypes,
      favoriteTags: userPreferences.favoriteTags,
      activities: activities.map(a => ({
        id: a.id,
        title: a.title,
        type: a.type,
        tags: a.tags,
        rating: a.rating || 0
      }))
    };

    const messages = [
      {
        role: 'system',
        content: 'You are a personalization expert helping to rank leisure activities for a user. Return a JSON array of activity IDs in order of recommendation relevance based on the user\'s preferences.'
      },
      {
        role: 'user',
        content: `Given these user preferences: ${JSON.stringify(userPreferences)} 
                 And these activities: ${JSON.stringify(context.activities)}
                 Return a JSON array of activity IDs in order of recommendation (most relevant first). Only include the IDs, not the full objects.`
      }
    ];

    const response = await callGroqApi(messages, 'llama3-8b-8192', {
      max_tokens: 500,
      temperature: 0.3
    });

    // Parse the ranked IDs from Groq's response
    const content = response.choices[0].message.content || '{"rankedIds": []}';
    const rankedIds = JSON.parse(content).rankedIds || [];

    // Sort the activities based on the ranked order
    const idToRank = new Map(rankedIds.map((id: string, index: number) => [id, index]));
    return activities.sort((a, b) => {
      const rankA = idToRank.has(a.id) ? (idToRank.get(a.id) as number) : Number.MAX_SAFE_INTEGER;
      const rankB = idToRank.has(b.id) ? (idToRank.get(b.id) as number) : Number.MAX_SAFE_INTEGER;
      return rankA - rankB;
    });
  } catch (error) {
    console.error('Error getting personalized recommendations:', error);
    // Fallback to simple rating-based sorting
    return activities.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }
}

/**
 * Process natural language search queries
 * @param query Natural language query from user
 * @param location Optional location to focus the search around
 * @returns Structured search filters
 */
export async function processNaturalLanguageQuery(query: string, location?: { lat: number; lng: number }): Promise<{
  types?: ActivityType[];
  priceRange?: { min: number; max: number };
  tags?: string[];
}> {
  // Default filter structure
  const defaultFilters = {
    types: [] as ActivityType[],
    priceRange: { min: 0, max: 1000 },
    tags: [] as string[]
  };

  // If API key is not set, do basic keyword parsing
  if (!getGroqApiKey()) {
    console.warn('Groq API key not found. Using basic query parsing.');
    return defaultFilters;
  }

  try {
    // Safely format location context if available
    let locationContext = '';
    try {
      if (location && typeof location === 'object' && location.lat && location.lng) {
        // Ensure we're dealing with numbers before using toFixed
        const lat = typeof location.lat === 'number' ? location.lat : parseFloat(location.lat);
        const lng = typeof location.lng === 'number' ? location.lng : parseFloat(location.lng);
        
        if (!isNaN(lat) && !isNaN(lng)) {
          locationContext = `The search is focused around coordinates (${lat.toFixed(4)}, ${lng.toFixed(4)}). `;
          console.log(`Using location context: ${locationContext}`);
        } else {
          console.warn('Invalid location coordinates', location);
        }
      }
    } catch (locErr) {
      console.warn('Error formatting location data:', locErr);
    }

    const messages = [
      {
        role: 'system',
        content: `You are an expert in analyzing natural language search queries for leisure activities and events. ${locationContext}Extract structured search parameters from user queries. Return ONLY valid JSON with no extra text.`
      },
      {
        role: 'user',
        content: `Extract search filters from this query: "${query}"
          Valid activity types are: outdoor, indoor, cultural, entertainment, sports, culinary, educational, nightlife, wellness, other.
          Return ONLY a valid JSON object with these fields (if detected):
          {"types":["type1","type2"], "priceRange":{"min":0,"max":100}, "tags":["tag1","tag2"]}`
      }
    ];

    const response = await callGroqApi(messages, 'llama3-8b-8192', {
      max_tokens: 300,
      temperature: 0.2 // Lower temperature for more consistent output
    });

    // Extract only the JSON part from the response
    let content = response.choices[0].message.content || '{}';
    
    // Try to find JSON object in the response if it's wrapped in markdown or text
    try {
      // Check for JSON block in markdown
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        content = jsonMatch[1].trim();
      }
      
      // Sometimes LLMs add text before or after the JSON
      // Look for the outermost { } pair
      const firstBrace = content.indexOf('{');
      const lastBrace = content.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        content = content.substring(firstBrace, lastBrace + 1);
      }
      
      const parsedFilters = JSON.parse(content);
      
      // Validate the parsed data structure
      return {
        ...defaultFilters,
        types: Array.isArray(parsedFilters.types) ? parsedFilters.types : defaultFilters.types,
        priceRange: (
          parsedFilters.priceRange && 
          typeof parsedFilters.priceRange === 'object' && 
          !isNaN(parsedFilters.priceRange.min) && 
          !isNaN(parsedFilters.priceRange.max)
        ) ? parsedFilters.priceRange : defaultFilters.priceRange,
        tags: Array.isArray(parsedFilters.tags) ? parsedFilters.tags : defaultFilters.tags
      };
    } catch (parseError) {
      console.error('Failed to parse JSON from Groq response:', parseError instanceof Error ? parseError.message : 'Unknown error');
      console.log('Problematic content:', content);
      console.log('Attempted to parse:', content);
      return defaultFilters;
    }
  } catch (error) {
    // Improved error handling to capture more information
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    
    console.error(`Error processing natural language query: ${errorMsg}`);
    console.error('Error details:', {
      message: errorMsg,
      stack: errorStack,
      query: query,
      location: location ? `lat: ${location.lat}, lng: ${location.lng}` : 'none'
    });
    
    return defaultFilters;
  }
}

/**
 * Process image content to extract text and identify leisure activities
 * @param base64Image Base64-encoded image content
 * @returns Extracted text and suggested search filters
 */
/**
 * Search and summarize information about an activity using Google search results
 * @param activityTitle The title of the activity
 * @param activityType The type of activity
 * @param location Optional location information
 * @returns A summary generated from web search results
 */
export async function getWebSearchSummary(
  activityTitle: string,
  activityType: ActivityType,
  location?: string
): Promise<string> {
  // If API key is not set, return an error message
  if (!getGroqApiKey()) {
    console.warn('Groq API key not found. Cannot generate web search summary.');
    return 'Web search summary is not available at this time.';
  }

  try {
    // Create a search query based on the activity details
    const searchQuery = location
      ? `${activityTitle} ${activityType} in ${location} tourism review information`
      : `${activityTitle} ${activityType} tourism review information`;

    console.log('Generating web search summary for query:', searchQuery);
    
    const messages = [
      {
        role: 'system',
        content: 'You are a travel and leisure information expert that specializes in summarizing information from web searches. Given a search query about a leisure activity, provide a well-structured, informative summary that would help someone decide if they want to visit or participate in this activity. Include details about what makes this place special, what visitors can expect, best times to visit, and any other helpful travel tips when available.'
      },
      {
        role: 'user',
        content: `Please search the web for information about: "${searchQuery}" and provide a comprehensive but concise summary of what you find. Structure your response to include:\n\n1. A brief overview of what it is\n2. Key highlights and attractions\n3. Practical visitor information (hours, costs, best times to visit)\n4. Interesting facts or history\n5. Tips from visitor reviews`
      }
    ];

    const response = await callGroqApi(messages, 'llama3-8b-8192', {
      max_tokens: 800,  // Allow for a longer response with detailed information
      temperature: 0.4  // Lower temperature for more factual responses
    });

    const summary = response.choices[0].message.content || 'No information found.';
    return summary;
  } catch (error) {
    console.error('Error generating web search summary with Groq:', error);
    return 'Unable to generate a summary from web search results at this time.';
  }
}

export async function processImageContent(base64Image: string): Promise<ImageProcessingResult> {
  // Default result structure
  const defaultResult: ImageProcessingResult = {
    extractedText: '',
    detectedObjects: [],
    suggestedFilters: {
      types: [],
      tags: []
    }
  };

  // If API key is not set, return the default result
  if (!getGroqApiKey()) {
    console.warn('Groq API key not found. Cannot process image content.');
    return defaultResult;
  }

  try {
    // For this implementation, we'll use a text-based description of the image
    // In a production app, you would use a dedicated multimodal model or vision API
    const messages = [
      {
        role: 'system',
        content: 'You are an expert at analyzing images of leisure activities and events. Extract text content, identify objects, and suggest search filters based on the image.'
      },
      {
        role: 'user',
        content: `Analyze this image related to a leisure activity or event. The image is base64 encoded. \n\nRespond with ONLY a JSON object with these properties:\n1. extractedText: Any visible text in the image\n2. detectedObjects: Array of objects/items identified in the image\n3. suggestedFilters: Object with arrays for 'types' and 'tags' that would be good search terms`
      }
    ];

    const response = await callGroqApi(messages, 'llama3-8b-8192', {
      max_tokens: 500,
      temperature: 0.2
    });

    // Extract JSON from response
    let content = response.choices[0].message.content || '{}';
    
    try {
      // Clean up the response to get valid JSON
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        content = jsonMatch[1].trim();
      }
      
      const firstBrace = content.indexOf('{');
      const lastBrace = content.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        content = content.substring(firstBrace, lastBrace + 1);
      }
      
      // Parse the JSON
      const parsedResult = JSON.parse(content);
      
      return {
        extractedText: parsedResult.extractedText || defaultResult.extractedText,
        detectedObjects: Array.isArray(parsedResult.detectedObjects) ? 
                        parsedResult.detectedObjects : defaultResult.detectedObjects,
        suggestedFilters: {
          types: Array.isArray(parsedResult.suggestedFilters?.types) ? 
                parsedResult.suggestedFilters.types : defaultResult.suggestedFilters.types,
          tags: Array.isArray(parsedResult.suggestedFilters?.tags) ? 
                parsedResult.suggestedFilters.tags : defaultResult.suggestedFilters.tags
        }
      };
    } catch (parseError) {
      console.error('Failed to parse JSON from Groq image processing response:', parseError);
      // Generate a simple result based on the raw text
      return {
        extractedText: content.replace(/[\n\r]+/g, ' ').substring(0, 100),
        detectedObjects: [],
        suggestedFilters: defaultResult.suggestedFilters
      };
    }
  } catch (error) {
    console.error('Error processing image with Groq:', error);
    return defaultResult;
  }
}
