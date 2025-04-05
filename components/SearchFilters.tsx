'use client';

import React, { useState } from 'react';
import { ActivityType } from '@/types';

interface SearchFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: {
    types: ActivityType[];
    priceRange: { min: number; max: number };
  }) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch, onFilterChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<ActivityType[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });

  const activityTypes: { label: string; value: ActivityType }[] = [
    { label: 'Outdoor', value: 'outdoor' },
    { label: 'Indoor', value: 'indoor' },
    { label: 'Cultural', value: 'cultural' },
    { label: 'Entertainment', value: 'entertainment' },
    { label: 'Sports', value: 'sports' },
    { label: 'Culinary', value: 'culinary' },
    { label: 'Educational', value: 'educational' },
    { label: 'Nightlife', value: 'nightlife' },
    { label: 'Wellness', value: 'wellness' },
    { label: 'Other', value: 'other' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleTypeToggle = (type: ActivityType) => {
    setSelectedTypes((prev) => {
      const newSelection = prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type];
      
      onFilterChange({
        types: newSelection,
        priceRange,
      });
      
      return newSelection;
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newPriceRange = { ...priceRange, [name]: Number(value) };
    
    setPriceRange(newPriceRange);
    onFilterChange({
      types: selectedTypes,
      priceRange: newPriceRange,
    });
  };

  return (
    <div className="p-4 space-y-4 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSearch} className="flex space-x-2">
        <input
          type="text"
          placeholder="Search activities, places, or keywords..."
          className="input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="btn-primary">
          Search
        </button>
      </form>

      <div>
        <h3 className="mb-2 font-medium">Activity Type</h3>
        <div className="flex flex-wrap gap-2">
          {activityTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => handleTypeToggle(type.value)}
              className={`px-3 py-1 text-sm font-medium rounded-full ${
                selectedTypes.includes(type.value)
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-medium">Price Range</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">${priceRange.min}</span>
          <input
            type="range"
            name="min"
            min="0"
            max="100"
            value={priceRange.min}
            onChange={handlePriceChange}
            className="w-full"
          />
          <span className="text-sm text-gray-500">${priceRange.max}</span>
          <input
            type="range"
            name="max"
            min="0"
            max="300"
            value={priceRange.max}
            onChange={handlePriceChange}
            className="w-full"
          />
        </div>
        <div className="flex justify-between">
          <span className="text-xs">Free</span>
          <span className="text-xs">$300+</span>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
