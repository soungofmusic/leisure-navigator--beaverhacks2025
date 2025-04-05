import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary-500 to-primary-700">
        <div className="container">
          <div className="grid items-center grid-cols-1 gap-8 md:grid-cols-2">
            <div className="text-white">
              <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">
                Discover Exciting Leisure Activities Near You
              </h1>
              <p className="mb-6 text-xl opacity-90">
                Find personalized recommendations based on your location, preferences, and available time.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/discover" className="btn-primary">
                  Start Exploring
                </Link>
                <Link href="/about" className="px-4 py-2 font-medium text-white border-2 border-white rounded-md hover:bg-white hover:text-primary-700">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-md aspect-square">
                <Image
                  src="/hero-image.jpg"
                  alt="People enjoying leisure activities"
                  fill
                  className="object-cover rounded-lg shadow-xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="mb-12 text-3xl font-bold text-center text-secondary-900">How Leisure Navigator Works</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="p-6 transition-transform bg-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center justify-center w-12 h-12 mb-4 text-white rounded-full bg-primary-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Location-Based Discovery</h3>
              <p className="text-secondary-600">
                Find activities and events in your vicinity using Google Maps and Places integration.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 transition-transform bg-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center justify-center w-12 h-12 mb-4 text-white rounded-full bg-primary-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Multimodal Input</h3>
              <p className="text-secondary-600">
                Search using text, voice commands, or even snap photos of flyers and posters.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 transition-transform bg-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center justify-center w-12 h-12 mb-4 text-white rounded-full bg-primary-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Calendar Integration</h3>
              <p className="text-secondary-600">
                Sync events directly to your Google Calendar to manage your leisure time efficiently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary-100">
        <div className="container">
          <div className="max-w-3xl p-8 mx-auto text-center rounded-lg bg-gradient-to-r from-primary-600 to-primary-700">
            <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">Ready to explore leisure activities?</h2>
            <p className="mb-6 text-lg text-white opacity-90">
              Start your journey to discover exciting activities tailored to your preferences.
            </p>
            <Link href="/discover" className="btn-primary bg-white text-primary-700 hover:bg-secondary-100">
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
