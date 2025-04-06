import { NextRequest, NextResponse } from 'next/server';
import { SpeechClient } from '@google-cloud/speech';
import { db, addDoc, collection } from '../../../lib/firebase';

// Create a Speech-to-Text client
let speechClient: SpeechClient;

try {
  speechClient = new SpeechClient({
    credentials: {
      client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n')
    },
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
  });
} catch (error) {
  console.error('Error initializing Speech client:', error);
}

export async function POST(request: NextRequest) {
  try {
    // Check if Speech client is initialized
    if (!speechClient) {
      return NextResponse.json(
        { success: false, message: 'Speech-to-Text API not configured properly' },
        { status: 500 }
      );
    }

    // Get audio data from request
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const userId = formData.get('userId') as string;
    
    if (!audioFile) {
      return NextResponse.json(
        { success: false, message: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Configure request
    const audio = {
      content: buffer.toString('base64')
    };
    
    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
    };
    
    const request = {
      audio: audio,
      config: config,
    };

    // Detect speech
    const [response] = await speechClient.recognize(request);
    const transcription = response.results
      ?.map(result => result.alternatives?.[0]?.transcript)
      .filter(Boolean)
      .join('\n');

    // Log the request in Firestore
    if (userId) {
      await addDoc(collection(db, 'voiceSearches'), {
        userId,
        timestamp: new Date().toISOString(),
        transcription,
        detectedText: transcription
      });
    }

    return NextResponse.json({
      success: true,
      transcription,
    });
  } catch (error) {
    console.error('Error processing speech:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error processing speech',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
