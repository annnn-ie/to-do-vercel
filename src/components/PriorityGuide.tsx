
import React from 'react';
import { cn } from '@/lib/utils';

export const PriorityGuide: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-4 mt-4 mb-8">
      <div className="flex items-center gap-2">
        <div className="priority-indicator priority-low" />
        <span className="text-xs text-gray-500">Low (!)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="priority-indicator priority-medium" />
        <span className="text-xs text-gray-500">Medium (!!)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="priority-indicator priority-high" />
        <span className="text-xs text-gray-500">High (!!!)</span>
      </div>
    </div>
  );
};
