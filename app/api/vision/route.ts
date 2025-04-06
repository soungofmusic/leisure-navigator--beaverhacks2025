import { NextRequest, NextResponse } from 'next/server';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { db, addDoc, collection } from '../../../lib/firebase';

// Create a Vision API client
let visionClient: ImageAnnotatorClient;

try {
  visionClient = new ImageAnnotatorClient({
    credentials: {
      client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n')
    },
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
  });
} catch (error) {
  console.error('Error initializing Vision client:', error);
}

export async function POST(request: NextRequest) {
  try {
    // Check if Vision client is initialized
    if (!visionClient) {
      return NextResponse.json(
        { success: false, message: 'Vision API not configured properly' },
        { status: 500 }
      );
    }

    // Get image data from request
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const userId = formData.get('userId') as string;
    
    if (!imageFile) {
      return NextResponse.json(
        { success: false, message: 'No image file provided' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Configure request for Vision API
    const [result] = await visionClient.annotateImage({
      image: {
        content: buffer.toString('base64')
      },
      features: [
        { type: 'LANDMARK_DETECTION' },
        { type: 'LABEL_DETECTION', maxResults: 10 },
        { type: 'LOGO_DETECTION' },
        { type: 'TEXT_DETECTION' },
        { type: 'IMAGE_PROPERTIES' }
      ]
    });

    // Extract results
    const landmarks = result.landmarkAnnotations || [];
    const labels = result.labelAnnotations || [];
    const logos = result.logoAnnotations || [];
    const text = result.textAnnotations?.[0]?.description || '';
    
    // Analyze for leisure activity types based on labels
    const leisureKeywords = {
      outdoor: ['park', 'nature', 'mountain', 'beach', 'hiking', 'trail', 'forest', 'garden', 'outdoor'],
      indoor: ['museum', 'gallery', 'mall', 'theater', 'cinema', 'restaurant', 'cafe', 'library'],
      cultural: ['museum', 'art', 'gallery', 'theater', 'performance', 'concert', 'festival', 'historic'],
      entertainment: ['concert', 'theater', 'cinema', 'show', 'performance', 'amusement', 'fair', 'festival'],
      culinary: ['restaurant', 'cafe', 'food', 'dining', 'cuisine', 'bakery', 'brewery', 'winery'],
      sports: ['stadium', 'arena', 'court', 'field', 'gym', 'fitness', 'sport', 'game', 'athletic'],
      educational: ['museum', 'gallery', 'exhibition', 'library', 'science', 'educational', 'workshop', 'learning'],
      nightlife: ['bar', 'pub', 'club', 'lounge', 'nightclub', 'disco', 'nightlife'],
      wellness: ['spa', 'yoga', 'meditation', 'wellness', 'retreat', 'relaxation', 'massage', 'health']
    };

    // Find matching activity types
    const detectedActivityTypes: Record<string, number> = {};
    
    labels.forEach((label) => {
      const labelText = label.description?.toLowerCase() || '';
      
      Object.entries(leisureKeywords).forEach(([type, keywords]) => {
        if (keywords.some(keyword => labelText.includes(keyword))) {
          detectedActivityTypes[type] = (detectedActivityTypes[type] || 0) + (label.score || 0);
        }
      });
    });
    
    // Sort activity types by confidence score
    const sortedActivityTypes = Object.entries(detectedActivityTypes)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .map(([type]) => type);
    
    // Extract event information from text if available
    let eventInfo = null;
    
    // Basic event detection - look for dates, times, and location markers in the text
    if (text) {
      const datePattern = /\b(\d{1,2}[-/\.]\d{1,2}[-/\.]\d{2,4}|\w+ \d{1,2}(?:st|nd|rd|th)?,? \d{4}|\d{1,2} \w+ \d{4})\b/g;
      const timePattern = /\b(\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM)(?:\s*-\s*\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM))?)\b/g;
      
      const dates = text.match(datePattern) || [];
      const times = text.match(timePattern) || [];
      
      if (dates.length > 0 || times.length > 0) {
        eventInfo = {
          dates,
          times,
          potentialEventName: extractEventName(text),
          potentialLocation: extractLocation(text, landmarks)
        };
      }
    }
    
    // Log the image analysis in Firestore
    if (userId) {
      await addDoc(collection(db, 'imageAnalysis'), {
        userId,
        timestamp: new Date().toISOString(),
        labels: labels.map(label => ({
          description: label.description,
          score: label.score
        })),
        landmarks: landmarks.map(landmark => ({
          description: landmark.description,
          score: landmark.score
        })),
        detectedActivityTypes: sortedActivityTypes,
        eventInfo
      });
    }

    return NextResponse.json({
      success: true,
      labels: labels.map(label => ({
        description: label.description,
        score: label.score
      })),
      landmarks: landmarks.map(landmark => ({
        description: landmark.description,
        score: landmark.score
      })),
      logos: logos.map(logo => ({
        description: logo.description,
        score: logo.score
      })),
      text,
      detectedActivityTypes: sortedActivityTypes,
      eventInfo,
      suggestedSearch: sortedActivityTypes.length > 0 
        ? `${sortedActivityTypes[0]} activities ${eventInfo?.potentialLocation || ''}`.trim()
        : null
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error processing image',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper function to extract potential event name from text
function extractEventName(text: string): string | null {
  // Look for common event name patterns
  // e.g., "Join us for [Event Name]" or "[Event Name] - Details"
  const eventPatterns = [
    /join us for "(.*?)"/i,
    /presenting "(.*?)"/i,
    /welcome to "(.*?)"/i,
    /introducing "(.*?)"/i,
    /\b(festival|concert|exhibition|show|fair|expo|conference|workshop)\b[:\s-]+(.*?)(?:\.|,|\n|$)/i
  ];
  
  for (const pattern of eventPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  // If no specific pattern matches, look for capitalized phrases that might be event names
  const capitalizedPhrasePattern = /\b([A-Z][A-Za-z]*(?:\s+[A-Z][A-Za-z]*)+)\b/g;
  const capitalizedPhrases = text.match(capitalizedPhrasePattern);
  
  if (capitalizedPhrases && capitalizedPhrases.length > 0) {
    // Filter out common non-event phrases
    const filteredPhrases = capitalizedPhrases.filter(phrase => 
      !phrase.match(/Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|January|February|March|April|May|June|July|August|September|October|November|December/)
    );
    
    if (filteredPhrases.length > 0) {
      return filteredPhrases[0];
    }
  }
  
  return null;
}

// Helper function to extract location information
function extractLocation(text: string, landmarks: any[]): string | null {
  // First check if we have landmark data
  if (landmarks && landmarks.length > 0 && landmarks[0].description) {
    return landmarks[0].description;
  }
  
  // Look for location patterns in text
  const locationPatterns = [
    /\bat\s+(.*?)(?:\.|,|\n|$)/i,
    /\blocation:\s+(.*?)(?:\.|,|\n|$)/i,
    /\bvenue:\s+(.*?)(?:\.|,|\n|$)/i,
    /\bheld at\s+(.*?)(?:\.|,|\n|$)/i,
    /\baddress:\s+(.*?)(?:\.|,|\n|$)/i
  ];
  
  for (const pattern of locationPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return null;
}
