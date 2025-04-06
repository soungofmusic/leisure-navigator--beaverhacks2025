'use client';

import React, { useState } from 'react';
import { ActivityType } from '@/types';

interface ActivityFilterProps {
  selectedTypes: ActivityType[];
  selectedTags: string[];
  onTypeChange: (types: ActivityType[]) => void;
  onTagChange: (tags: string[]) => void;
  popularTags: string[];
}

const ActivityFilter: React.FC<ActivityFilterProps> = ({
  selectedTypes,
  selectedTags,
  onTypeChange,
  onTagChange,
  popularTags
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

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

  const handleTypeToggle = (type: ActivityType) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    
    onTypeChange(newTypes);
  };

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    onTagChange(newTags);
  };

  const clearAllFilters = () => {
    onTypeChange([]);
    onTagChange([]);
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div 
        className="flex justify-between items-center p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="font-medium text-lg">Filter Activities</h3>
        <div className="flex items-center">
          {(selectedTypes.length > 0 || selectedTags.length > 0) && (
            <span className="bg-primary-100 text-primary-800 text-xs font-medium rounded-full px-2 py-1 mr-2">
              {selectedTypes.length + selectedTags.length} active
            </span>
          )}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className={`w-5 h-5 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 border-t border-gray-100">
          <div className="mb-4">
            <h4 className="font-medium mb-2">Activity Types</h4>
            <div className="flex flex-wrap gap-2">
              {activityTypes.map(type => (
                <button
                  key={type.value}
                  onClick={() => handleTypeToggle(type.value)}
                  className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                    selectedTypes.includes(type.value)
                      ? 'bg-primary-100 text-primary-700 border border-primary-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium mb-2">Popular Tags</h4>
            <div className="flex flex-wrap gap-2">
              {popularTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-primary-100 text-primary-700 border border-primary-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          
          {(selectedTypes.length > 0 || selectedTags.length > 0) && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-primary-600 hover:text-primary-800 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityFilter;
