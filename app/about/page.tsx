'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-primary-500 to-primary-700">
        <div className="container">
          <div className="text-white text-center max-w-3xl mx-auto">
            <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">
              About Leisure Navigator
            </h1>
            <p className="mb-6 text-xl opacity-90">
              Your personalized guide to discovering exciting leisure activities
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-secondary-900 mb-8">Our Mission</h2>
            <p className="text-lg text-secondary-700 mb-6">
              At Leisure Navigator, we're on a mission to help people rediscover the joy of leisure time in our busy, digital world. We believe that meaningful experiences and activities should be easily accessible to everyone, regardless of where they are or how much time they have available.
            </p>
            <p className="text-lg text-secondary-700 mb-6">
              Our platform combines cutting-edge technology with personalized recommendations to help you find activities that match your interests, location, and schedule. Whether you're looking for a spontaneous adventure or planning your weekend, Leisure Navigator is your companion for discovering the best experiences around you.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="mb-12 text-3xl font-bold text-center text-secondary-900">Key Features</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="p-6 transition-transform bg-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center justify-center w-12 h-12 mb-4 text-white rounded-full bg-primary-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Smart Location Discovery</h3>
              <p className="text-secondary-600">
                Find activities near you using our advanced location-based search powered by Google Maps and Places API.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 transition-transform bg-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center justify-center w-12 h-12 mb-4 text-white rounded-full bg-primary-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Personalized Recommendations</h3>
              <p className="text-secondary-600">
                Get tailored activity suggestions based on your preferences, past activities, and time availability.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 transition-transform bg-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center justify-center w-12 h-12 mb-4 text-white rounded-full bg-primary-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Multimodal Search</h3>
              <p className="text-secondary-600">
                Search for activities using text, voice commands, or by snapping a photo of a flyer or poster.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 transition-transform bg-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center justify-center w-12 h-12 mb-4 text-white rounded-full bg-primary-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Calendar Integration</h3>
              <p className="text-secondary-600">
                Easily add activities to your calendar and get reminders for upcoming events.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 transition-transform bg-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center justify-center w-12 h-12 mb-4 text-white rounded-full bg-primary-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">User Profiles</h3>
              <p className="text-secondary-600">
                Create a personalized profile to track your favorite activities and receive better recommendations over time.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 transition-transform bg-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center justify-center w-12 h-12 mb-4 text-white rounded-full bg-primary-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Community Sharing</h3>
              <p className="text-secondary-600">
                Share discovered activities with friends and see what activities are trending in your community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-secondary-900 mb-8">Our Technology</h2>
            <p className="text-lg text-secondary-700 mb-6">
              Leisure Navigator is built using cutting-edge technologies to provide you with the best possible experience:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-5 border rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Frontend</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Next.js - React framework with server-side rendering</li>
                  <li>Tailwind CSS - For beautiful, responsive design</li>
                  <li>TypeScript - For type-safe code</li>
                </ul>
              </div>
              <div className="p-5 border rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Backend & Services</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Firebase - Authentication and data storage</li>
                  <li>Google Maps API - Location-based services</li>
                  <li>Google Places API - Points of interest data</li>
                  <li>Google Cloud Platform - Hosting and deployment</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-16 bg-secondary-100">
        <div className="container">
          <div className="max-w-3xl p-8 mx-auto text-center rounded-lg bg-gradient-to-r from-primary-600 to-primary-700">
            <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">Ready to discover exciting activities?</h2>
            <p className="mb-6 text-lg text-white opacity-90">
              Start exploring leisure activities tailored to your preferences now.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/discover" className="btn-primary bg-white text-primary-700 hover:bg-secondary-100">
                Explore Activities
              </Link>
              <Link href="/profile" className="px-4 py-2 font-medium text-white border-2 border-white rounded-md hover:bg-white hover:text-primary-700">
                Create Profile
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
