'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LeisureActivity } from '../types';
import SaveActivityButton from './SaveActivityButton';
import AiEnhancedBadge from './AiEnhancedBadge';
import { getGoogleImageUrl } from '../lib/imageService';
import { getGoogleRating } from '../lib/googlePlacesService';

interface ActivityCardProps {
  activity: LeisureActivity;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const [imageError, setImageError] = useState(false);
  const [dynamicImageUrl, setDynamicImageUrl] = useState<string | null>(null);
  const [googleRating, setGoogleRating] = useState<number | null>(null);
  const [googleTotalRatings, setGoogleTotalRatings] = useState<number | null>(null);
  const [googlePlaceId, setGooglePlaceId] = useState<string | null>(null);
  
  
  // Determine the image URL to use
  const fallbackImageUrl = activity.images && activity.images.length > 0 
    ? activity.images[0] 
    : '/placeholder.jpg';
    
  // The image URL to display - use dynamic URL if available, fallback if not, placeholder if error
  const displayImageUrl = imageError ? '/placeholder.jpg' : (dynamicImageUrl || fallbackImageUrl);
  
  // Handle image load error
  const handleImageError = () => {
    console.log('Image error occurred, using placeholder image');
    setImageError(true);
  };
  
  // Fetch Google image when component mounts
  useEffect(() => {
    const fetchGoogleImage = async () => {
      try {
        // Create a descriptive search term
        const searchTerm = `${activity.title} ${activity.type} ${activity.location.address}`;
        const googleImageUrl = await getGoogleImageUrl(searchTerm);
        
        if (googleImageUrl) {
          setDynamicImageUrl(googleImageUrl);
        }
      } catch (error) {
        console.error('Error fetching Google image:', error);
        // Will use the fallback image if Google search fails
      }
    };
    
    fetchGoogleImage();
  }, [activity.title, activity.type, activity.location.address]);
  
  // Fetch Google ratings when component mounts
  useEffect(() => {
    const fetchGoogleRatings = async () => {
      try {
        const result = await getGoogleRating(activity.title, activity.location.address);
        
        if (result.rating !== null) {
          setGoogleRating(result.rating);
          setGoogleTotalRatings(result.totalRatings);
          setGooglePlaceId(result.placeId);
        }
      } catch (error) {
        console.error('Error fetching Google ratings:', error);
      }
    };
    
    fetchGoogleRatings();
  }, [activity.title, activity.location.address]);

  return (
    <div className="overflow-hidden transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg">
      <div className="relative h-48">
        {(activity.images && activity.images.length > 0) || dynamicImageUrl ? (
          <div className="relative w-full h-full">
            <Image
              src={displayImageUrl}
              alt={activity.title}
              fill
              className="object-cover"
              unoptimized
              priority
              onError={handleImageError}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-200">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
        <div className="absolute top-2 right-2 px-2 py-1 text-xs font-medium text-white rounded-full bg-primary-600">
          {activity.type}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="mb-1 text-lg font-semibold">{activity.title}</h3>
        
        <div className="flex items-center mb-2 text-sm text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          <span className="truncate">{activity.location.address}</span>
        </div>
        
        <div className="relative mb-3">
          <p className="h-12 overflow-hidden text-sm text-gray-700">
            {activity.description.length > 100
              ? `${activity.description.substring(0, 100)}...`
              : activity.description}
          </p>
          {activity.isAIEnhanced && (
            <div className="absolute top-0 right-0">
              <AiEnhancedBadge />
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {/* Google rating */}
            {googleRating !== null ? (
              <div className="flex items-center" title={`Google rating based on ${googleTotalRatings} reviews`}>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.46 8.06l-2.15-.36c-.2-.03-.35-.18-.4-.37l-.93-2.01c-.38-.81-1.56-.81-1.95 0l-.93 2.01c-.05.19-.21.34-.41.37l-2.15.36c-.85.14-1.19 1.13-.57 1.7l1.55 1.39c.15.13.22.33.17.52l-.42 2.02c-.2.84.71 1.52 1.47 1.1L12.18 15c.17-.09.37-.09.54 0l1.95 1.08c.76.42 1.67-.26 1.47-1.1l-.42-2.02c-.05-.19.02-.39.17-.52l1.55-1.39c.63-.56.29-1.55-.56-1.7z"/>
                  </svg>
                  <span className="text-xs font-medium text-gray-600">Google Review</span>
                  <span className="text-sm font-medium">
                    {googleRating.toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({googleTotalRatings})
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 text-yellow-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
                <span className="ml-1 text-sm font-medium">
                  {activity.rating ? activity.rating.toFixed(1) : 'N/A'}
                </span>
              </div>
            )}
          </div>

        </div>
        
        <div className="flex flex-wrap mb-3 gap-1">
          {activity.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full"
            >
              {tag}
            </span>
          ))}
          {activity.tags.length > 3 && (
            <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
              +{activity.tags.length - 3}
            </span>
          )}
        </div>
        
        <div className="flex flex-col space-y-2">
          <Link 
            href={`/activities/${activity.id}`} 
            className="block w-full py-2 text-sm font-medium text-center text-white rounded bg-primary-600 hover:bg-primary-700"
          >
            View Details
          </Link>
          <SaveActivityButton 
            activityId={activity.id} 
            buttonStyle="full" 
            className="py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50"
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
