'use client';

import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
      <span className="ml-3 text-gray-600 dark:text-gray-300">Loading...</span>
    </div>
  );
};

export default Loading;
