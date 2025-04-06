import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getServerSession } from 'next-auth/next';
import { db, doc, getDoc, updateDoc } from '../../../lib/firebase';

// OAuth2 configuration for Google Calendar API
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Calendar API endpoint to add an event to Google Calendar
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { accessToken } = session as any;
    
    // If no access token, redirect to OAuth flow
    if (!accessToken) {
      // Generate authorization URL
      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar'],
      });
      
      return NextResponse.json(
        { success: false, authUrl, message: 'Authorization required' },
        { status: 403 }
      );
    }
    
    // Set credentials
    oauth2Client.setCredentials({ access_token: accessToken });
    
    // Create Calendar API client
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    // Parse request body
    const { title, description, location, startDateTime, endDateTime } = await request.json();
    
    // Validate required fields
    if (!title || !startDateTime) {
      return NextResponse.json(
        { success: false, message: 'Title and start date/time are required' },
        { status: 400 }
      );
    }
    
    // Create calendar event
    const event = {
      summary: title,
      description,
      location,
      start: {
        dateTime: startDateTime,
        timeZone: 'America/Los_Angeles', // Default timezone, could be made dynamic
      },
      end: {
        dateTime: endDateTime || new Date(new Date(startDateTime).getTime() + 60 * 60 * 1000).toISOString(), // Default to 1 hour if no end time
        timeZone: 'America/Los_Angeles',
      },
      reminders: {
        useDefault: true,
      },
    };
    
    // Insert the event
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });
    
    // Store the event reference in Firestore for the user
    if (session.user.email) {
      const userRef = doc(db, 'users', session.user.email);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        await updateDoc(userRef, {
          calendarEvents: [...(userDoc.data()?.calendarEvents || []), {
            id: response.data.id,
            title,
            startDateTime,
            endDateTime: endDateTime || new Date(new Date(startDateTime).getTime() + 60 * 60 * 1000).toISOString(),
            createdAt: new Date().toISOString()
          }]
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      event: response.data,
      htmlLink: response.data.htmlLink
    });
  } catch (error) {
    console.error('Error adding event to calendar:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error adding event to calendar',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Get user's calendar events
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { accessToken } = session as any;
    
    // If no access token, redirect to OAuth flow
    if (!accessToken) {
      // Generate authorization URL
      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar.readonly'],
      });
      
      return NextResponse.json(
        { success: false, authUrl, message: 'Authorization required' },
        { status: 403 }
      );
    }
    
    // Set credentials
    oauth2Client.setCredentials({ access_token: accessToken });
    
    // Create Calendar API client
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    // Get events for the next 7 days
    const timeMin = new Date().toISOString();
    const timeMax = new Date();
    timeMax.setDate(timeMax.getDate() + 7);
    
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin,
      timeMax: timeMax.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });
    
    return NextResponse.json({
      success: true,
      events: response.data.items
    });
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching calendar events',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
