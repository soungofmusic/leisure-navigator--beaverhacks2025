'use client';

import React, { useState, useEffect } from 'react';
import { ActivityType } from '../types';
import PlacesAutocomplete from './PlacesAutocomplete';

interface SearchFiltersProps {
  onSearch?: (query: string) => void;
  onFilterChange: (filters: {
    types: ActivityType[];
    distance: number;
    location?: { lat: number; lng: number };
  }) => void;
  defaultLocation?: { lat: number; lng: number };
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ 
  onSearch, 
  onFilterChange,
  defaultLocation = { lat: 45.5152, lng: -122.6784 } // Portland, OR as default
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<ActivityType[]>([]);
  const [distance, setDistance] = useState(10); // Distance in miles
  const [location, setLocation] = useState(defaultLocation);

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
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleTypeToggle = (type: ActivityType) => {
    setSelectedTypes((prev) => {
      const newSelection = prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type];
      
      onFilterChange({
        types: newSelection,
        distance,
        location,
      });
      
      return newSelection;
    });
  };


  const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setDistance(value);
    onFilterChange({
      types: selectedTypes,
      distance: value,
      location,
    });
  };

  const handleLocationSelect = (place: { address: string; coordinates: { lat: number; lng: number } }) => {
    setLocation(place.coordinates);
    onFilterChange({
      types: selectedTypes,
      distance,
      location: place.coordinates,
    });
  };

  return (
    <div className="space-y-4">


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

      <div className="mb-4">
        <h3 className="mb-2 font-medium">Location</h3>
        <PlacesAutocomplete 
          onPlaceSelect={handleLocationSelect} 
          placeholder="Change location (default: Portland, OR)"
        />
      </div>

      <div className="mb-4">
        <h3 className="mb-2 font-medium">Distance</h3>
        <div className="flex items-center space-x-2">
          <input
            type="range"
            min="1"
            max="50"
            value={distance}
            onChange={handleDistanceChange}
            className="w-full"
          />
          <span className="text-sm font-medium text-gray-700">{distance} mi</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs">Nearby</span>
          <span className="text-xs">50+ miles</span>
        </div>
      </div>


    </div>
  );
};

export default SearchFilters;
