import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div 
      className={`animate-pulse bg-slate-200 rounded ${className}`}
      style={{ animationDuration: '1.5s' }}
    />
  );
};

export const FormSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 w-full">
      <div className="space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-12 w-full rounded-2xl" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-12 w-full rounded-2xl" />
      </div>
      <Skeleton className="h-14 w-full rounded-2xl mt-4" />
    </div>
  );
};
