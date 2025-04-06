# Google Developer APIs Integration Guide

This guide will help you set up and integrate Google Maps and Google Places APIs with the Leisure Navigator application.

## Prerequisites

1. A Google Cloud Platform account
2. A project created in the Google Cloud Console
3. Billing enabled for your project (Google Maps Platform offers $200 free monthly credit)

## Setting Up Google Maps and Places APIs

### Step 1: Create a Project (if you haven't already)

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on "Select a project" at the top of the page and then "New Project"
3. Name your project (e.g., "Leisure Navigator") and click "Create"

### Step 2: Enable Required APIs

1. From your project dashboard, navigate to "APIs & Services" > "Library"
2. Search for and enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API (optional, but useful for address lookups)

### Step 3: Create API Key

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. A new API key will be created. Click "Restrict Key" to set limitations on where and how your key can be used
4. Under "Application restrictions," you can restrict the key to websites, with your domain (for production) or localhost (for development)
5. Under "API restrictions," restrict the key to only the APIs you're using (Maps JavaScript API, Places API, etc.)

### Step 4: Configure the API Key in Your Application

1. Create a `.env.local` file in the root of your project (this file is already in `.gitignore` for security)
2. Add the following entries to your `.env.local` file:
   ```
   GOOGLE_MAPS_API_KEY=your_api_key_here
   GOOGLE_PLACES_API_KEY=your_api_key_here
   ```
   (You can use the same API key for both if it has access to both APIs)

## Using Google Maps in Your Application

The Leisure Navigator app now includes two main components for Google integration:

1. **Map Component**: Displays an interactive Google Map with markers for leisure activities
2. **PlacesAutocomplete Component**: Provides address search functionality with Google Places autocomplete
3. **GoogleMapsIntegration Component**: Combines both features with enhanced location awareness

## Best Practices for Google Maps Integration

1. **API Key Security**:
   - Never hardcode API keys in your code or commit them to version control
   - Use environment variables as shown above
   - Restrict API keys to specific domains and APIs
   - Set up usage quotas to avoid unexpected billing

2. **Performance Optimization**:
   - Load the Google Maps JavaScript API asynchronously using the Loader
   - Only load the libraries you need (e.g., 'places' for autocomplete)

3. **Error Handling**:
   - Always include error handling for API calls
   - Provide fallback UI when maps fail to load

## Deployment Considerations

When deploying your application, make sure to:

1. Set the appropriate environment variables on your hosting platform
2. Update API key restrictions to include your production domain
3. Monitor your API usage in the Google Cloud Console to avoid exceeding the free tier limits

## Additional Resources

- [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript/overview)
- [Google Places API Documentation](https://developers.google.com/maps/documentation/places/web-service/overview)
- [Google Cloud Console](https://console.cloud.google.com/)
