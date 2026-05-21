import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="store-utility-card p-6 flex flex-col justify-between animate-pulse min-h-[160px]">
          <div className="flex items-center gap-4 w-full">
            {/* Avatar skeleton */}
            <div className="w-12 h-12 rounded-full bg-[var(--border-soft)] flex-shrink-0" />
            
            {/* Text details skeleton */}
            <div className="space-y-3 w-full">
              <div className="h-4 bg-[var(--border-hard)] rounded w-3/4" />
              <div className="h-3 bg-[var(--border-soft)] rounded w-1/2" />
            </div>
          </div>

          {/* Action buttons skeleton */}
          <div className="flex items-center gap-2 mt-6 w-full justify-end">
            <div className="w-8 h-8 rounded-full bg-[var(--border-soft)]" />
            <div className="w-8 h-8 rounded-full bg-[var(--border-soft)]" />
          </div>
        </div>
      ))}
    </div>
  );
};
