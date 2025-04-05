'use client';

import React from 'react';
import { useUser } from '@/context/UserContext';

interface SaveActivityButtonProps {
  activityId: string;
  className?: string;
  buttonStyle?: 'icon-only' | 'text' | 'full';
}

const SaveActivityButton: React.FC<SaveActivityButtonProps> = ({ 
  activityId,
  className = '',
  buttonStyle = 'full'
}) => {
  const { isActivitySaved, saveActivity, unsaveActivity } = useUser();
  const isSaved = isActivitySaved(activityId);

  const handleToggleSave = () => {
    if (isSaved) {
      unsaveActivity(activityId);
    } else {
      saveActivity(activityId);
    }
  };

  const renderButtonContent = () => {
    switch (buttonStyle) {
      case 'icon-only':
        return (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill={isSaved ? 'currentColor' : 'none'} 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="w-5 h-5"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" 
            />
          </svg>
        );
      
      case 'text':
        return isSaved ? 'Saved' : 'Save';
      
      case 'full':
      default:
        return (
          <>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill={isSaved ? 'currentColor' : 'none'} 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-4 h-4 mr-1"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" 
              />
            </svg>
            {isSaved ? 'Saved' : 'Save for Later'}
          </>
        );
    }
  };

  return (
    <button 
      onClick={handleToggleSave}
      className={`flex items-center justify-center transition-colors ${
        isSaved 
          ? 'text-primary-600 hover:text-primary-800' 
          : 'text-gray-600 hover:text-primary-600'
      } ${className}`}
      aria-label={isSaved ? 'Unsave activity' : 'Save activity'}
    >
      {renderButtonContent()}
    </button>
  );
};

export default SaveActivityButton;
