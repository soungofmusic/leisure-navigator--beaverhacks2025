'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">Leisure Navigator</span>
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
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
              Home
            </Link>
            <Link href="/discover" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
              Discover
            </Link>
            <Link href="/saved" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
              Saved
            </Link>
            <Link href="/profile" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
              Profile
            </Link>
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </nav>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <nav className="flex flex-col mt-4 space-y-2 md:hidden">
            <Link href="/" className="py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
              Home
            </Link>
            <Link href="/discover" className="py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
              Discover
            </Link>
            <Link href="/saved" className="py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
              Saved
            </Link>
            <Link href="/profile" className="py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
              Profile
            </Link>
            <button 
              onClick={toggleTheme} 
              className="flex items-center py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Light Mode
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  Dark Mode
                </>
              )}
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
