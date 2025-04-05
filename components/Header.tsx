'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary-600">Leisure Navigator</span>
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="p-2 text-gray-500 rounded-md hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-6">
            <Link href="/" className="text-gray-700 hover:text-primary-600">
              Home
            </Link>
            <Link href="/discover" className="text-gray-700 hover:text-primary-600">
              Discover
            </Link>
            <Link href="/saved" className="text-gray-700 hover:text-primary-600">
              Saved
            </Link>
          </nav>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <nav className="flex flex-col mt-4 space-y-2 md:hidden">
            <Link href="/" className="py-2 text-gray-700 hover:text-primary-600">
              Home
            </Link>
            <Link href="/discover" className="py-2 text-gray-700 hover:text-primary-600">
              Discover
            </Link>
            <Link href="/saved" className="py-2 text-gray-700 hover:text-primary-600">
              Saved
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
