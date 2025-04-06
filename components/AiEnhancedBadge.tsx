'use client';

import React from 'react';
import { Tooltip } from 'react-tooltip';

interface AiEnhancedBadgeProps {
  showLabel?: boolean;
  className?: string;
}

const AiEnhancedBadge: React.FC<AiEnhancedBadgeProps> = ({ 
  showLabel = false, 
  className = ''
}) => {
  return (
    <>
      <div 
        className={`flex items-center gap-1 ${className}`}
        data-tooltip-id="ai-enhanced-tooltip"
        data-tooltip-content="This description was enhanced by AI to provide you with better information"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary-600"
        >
          <path d="M12 2c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2s-2-.9-2-2V4c0-1.1.9-2 2-2z" />
          <path d="M12 16c1.1 0 2 .9 2 2v1c0 .55-.45 1-1 1h-2c-.55 0-1-.45-1-1v-1c0-1.1.9-2 2-2z" />
          <path d="M19.49 9A9 9 0 0 0 12 4.5V3" />
          <path d="M12 20.5A9 9 0 0 0 19.49 15" />
          <path d="M4.51 15A9 9 0 0 0 12 20.5v.5" />
          <path d="M12 3.5A9 9 0 0 0 4.51 9" />
        </svg>
        {showLabel && <span className="text-xs font-medium">AI Enhanced</span>}
      </div>
      <Tooltip id="ai-enhanced-tooltip" className="z-50" />
    </>
  );
};

export default AiEnhancedBadge;
