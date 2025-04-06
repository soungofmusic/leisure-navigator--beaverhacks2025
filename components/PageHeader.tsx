'use client';

import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, className = 'bg-primary-700' }) => {
  return (
    <div className={`py-12 text-white ${className} shadow-md`}>
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white drop-shadow-sm">{title}</h1>
        {description && <p className="text-lg text-white max-w-3xl font-medium">{description}</p>}
      </div>
    </div>
  );
};

export default PageHeader;
