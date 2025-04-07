# Leisure Navigator

![Leisure Navigator Logo](public/logo.png)

A smart leisure discovery application developed for BeaverHacks 2025. Leisure Navigator helps users find personalized activity recommendations with AI-enhanced descriptions and web search summaries.

## Features

- **Activity Discovery:** Search and filter leisure activities by type, location, and preferences
- **Interactive Maps:** View activities on Google Maps with detailed information
- **AI-Enhanced Information:** Get detailed descriptions and web search summaries powered by GROQ
- **Recommendations:** Receive personalized activity suggestions based on your interests
- **User Authentication:** Secure login with Firebase Authentication
- **Dark/Light Mode:** Toggle between visual themes for comfortable viewing

## Tech Stack

- **Frontend:** Next.js 13 (App Router), React, TypeScript, Tailwind CSS
- **APIs:** Google Maps, Google Places, GROQ AI
- **Authentication & Database:** Firebase
- **Deployment:** Google Cloud Platform (App Engine)

## Getting Started

### Prerequisites
Before you begin, make sure you have the following installed and available:

- **Node.js**: Version 18 or higher
- **Package Manager**: npm or yarn
- **API Keys**:
  - Google Maps API key
  - Google Places API key
  - GROQ API key (for AI features)
- **Firebase**: A Firebase project with authentication enabled

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/soungofmusic/leisure-navigator--beaverhacks2025.git
   cd leisure-navigator--beaverhacks2025
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory (see `.env.example` for required variables)

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

The application is configured for deployment to Google App Engine:

```bash
gcloud app deploy
```

## Project Story

Check out our [PROJECT_STORY.md](PROJECT_STORY.md) for details about our BeaverHacks 2025 journey, including our inspiration, challenges, and lessons learned.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
