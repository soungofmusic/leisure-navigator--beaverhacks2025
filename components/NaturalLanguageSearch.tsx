'use client';

import React, { useState } from 'react';
import { processNaturalLanguageQuery } from '../lib/groqService';
import { ActivityType } from '../types';

interface NaturalLanguageSearchProps {
  onSearch: (filters: {
    types?: ActivityType[];
    priceRange?: { min: number; max: number };
    tags?: string[];
    query?: string;
  }) => void;
}

const NaturalLanguageSearch: React.FC<NaturalLanguageSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setIsProcessing(true);
    
    try {
      // First, immediately search with just the raw query
      onSearch({ query });
      
      // Then process with AI for more structured filters
      const filters = await processNaturalLanguageQuery(query);
      
      // Update search with structured filters
      onSearch({
        ...filters,
        query, // Keep original query for display purposes
      });
    } catch (error) {
      console.error('Error processing natural language search:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe what you're looking for... (e.g., 'outdoor activities for kids under $20')"
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <button
            type="submit"
            disabled={isProcessing}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-gray-400"
          >
            {isProcessing ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>AI</span>
              </div>
            ) : (
              <span>Search</span>
            )}
          </button>
        </div>
        {isProcessing && (
          <p className="mt-1 text-xs text-gray-500">
            Processing with AI to understand your request...
          </p>
        )}
      </form>
    </div>
  );
};

export default NaturalLanguageSearch;
