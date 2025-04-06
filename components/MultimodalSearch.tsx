'use client';

import React, { useState, useRef } from 'react';
// TypeScript declarations are handled in types/speech-recognition.d.ts
import { processNaturalLanguageQuery, processImageContent } from '../lib/groqService';
import { ActivityType } from '../types';
import { Tooltip } from 'react-tooltip';

interface MultimodalSearchProps {
  onSearch: (filters: {
    types?: ActivityType[];
    priceRange?: { min: number; max: number };
    tags?: string[];
    query?: string;
    location?: { lat: number; lng: number };
  }) => void;
  location?: { lat: number; lng: number };
}

const MultimodalSearch: React.FC<MultimodalSearchProps> = ({ onSearch, location }) => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputMode, setInputMode] = useState<'text' | 'voice' | 'image'>('text');
  const [isListening, setIsListening] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Check if browser supports speech recognition
  const hasSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  
  const handleTextSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!query.trim()) return;
    
    setIsProcessing(true);
    
    try {
      // First, immediately search with just the raw query and location if available
      onSearch({ query, location });
      
      // Then process with AI for more structured filters including location context
      const filters = await processNaturalLanguageQuery(query, location);
      
      // Update search with structured filters and preserve location
      onSearch({
        ...filters,
        query, // Keep original query for display purposes
        location, // Include current location in search
      });
    } catch (error) {
      console.error('Error processing natural language search:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const startVoiceRecognition = () => {
    if (!hasSpeechRecognition) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }
    
    setIsListening(true);
    setInputMode('voice');
    
    // Use any available SpeechRecognition implementation
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      console.error('Speech recognition is not available');
      setIsListening(false);
      return;
    }
    const recognition = new SpeechRecognitionAPI();
    
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
      
      // Auto-submit the voice query
      setTimeout(() => {
        handleTextSearch();
      }, 500);
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type and size
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image size must be less than 5MB.');
      return;
    }
    
    setInputMode('image');
    
    // Create image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    // Process the image
    processImageWithGroq(file);
  };
  
  const processImageWithGroq = async (file: File) => {
    setIsProcessing(true);
    
    try {
      // Convert image to base64
      const base64Image = await fileToBase64(file);
      
      // Process the image with Groq
      const result = await processImageContent(base64Image);
      
      // Set the query text to the extracted text
      setQuery(result.extractedText);
      
      // Use AI to determine search filters from the extracted content with location context
      const filters = await processNaturalLanguageQuery(result.extractedText, location);
      
      // Update search with structured filters and include location
      onSearch({
        ...filters,
        query: result.extractedText,
        location, // Include current location in search
      });
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process the image. Please try again or use text search instead.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove the data:image/jpeg;base64, prefix
        const base64Content = base64String.split(',')[1];
        resolve(base64Content);
      };
      reader.onerror = (error) => reject(error);
    });
  };
  
  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };
  
  const resetImageUpload = () => {
    setImagePreview(null);
    setInputMode('text');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="w-full max-w-3xl">
      {/* Location is being used for search but display is handled by parent component */}
      <form onSubmit={handleTextSearch} className="relative">
        <div className="relative">
          {/* Main input field */}
          <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-primary-500 dark:focus-within:ring-primary-400 focus-within:border-primary-500 dark:focus-within:border-primary-400">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder=""
              className="w-full px-4 py-3 pr-48 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
              disabled={isProcessing || isListening}
            />
            
            {/* Input mode buttons */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-3">
              {/* Voice input button */}
              {hasSpeechRecognition && (
                <button
                  type="button"
                  onClick={startVoiceRecognition}
                  disabled={isProcessing || isListening}
                  className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none flex items-center justify-center w-8 h-8"
                  data-tooltip-id="voice-tooltip"
                  data-tooltip-content="Search by voice"
                >
                  {isListening ? (
                    <span className="flex items-center justify-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                    </span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  )}
                </button>
              )}
              
              {/* Image upload button */}
              <button
                type="button"
                onClick={triggerImageUpload}
                disabled={isProcessing}
                className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none flex items-center justify-center w-8 h-8"
                data-tooltip-id="image-tooltip"
                data-tooltip-content="Search by image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              {/* Search button */}
              <button
                type="submit"
                disabled={isProcessing || isListening || !query.trim()}
                className="px-4 py-1.5 bg-primary-600 dark:bg-primary-500 text-white rounded-md hover:bg-primary-700 dark:hover:bg-primary-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 focus:outline-none"
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Search</span>
                  </div>
                ) : (
                  <span>Search</span>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Image preview area */}
        {imagePreview && (
          <div className="mt-2 relative">
            <div className="relative border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden h-32 w-full">
              <img src={imagePreview} alt="Uploaded" className="h-full w-auto mx-auto object-contain" />
              <button
                type="button"
                onClick={resetImageUpload}
                className="absolute top-2 right-2 bg-white dark:bg-gray-700 rounded-full p-1 shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {isProcessing ? 'Analyzing image content...' : 'Image processed for search'}
            </p>
          </div>
        )}
        
        {/* Status message */}
        {(isProcessing && !imagePreview) && (
          <p className="mt-1 text-xs text-gray-500">
            Processing with AI to understand your request...
          </p>
        )}
        
        {isListening && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 animate-pulse">
            Listening... Speak now
          </p>
        )}
      </form>
      
      {/* Tooltips */}
      <Tooltip id="voice-tooltip" />
      <Tooltip id="image-tooltip" />
    </div>
  );
};

export default MultimodalSearch;
