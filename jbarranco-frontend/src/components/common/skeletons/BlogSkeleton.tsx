import React from 'react';
import Skeleton from '../Skeleton';

const BlogPostSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      {/* Image skeleton */}
      <Skeleton variant="rectangular" height={192} className="w-full" />
      
      {/* Content */}
      <div className="p-6">
        {/* Category badge */}
        <Skeleton variant="rectangular" width={80} height={24} className="mb-3" />
        
        {/* Title */}
        <Skeleton variant="text" height={28} className="mb-2 w-full" />
        <Skeleton variant="text" height={28} className="mb-4 w-3/4" />
        
        {/* Description */}
        <Skeleton variant="text" height={16} className="mb-2 w-full" />
        <Skeleton variant="text" height={16} className="mb-2 w-full" />
        <Skeleton variant="text" height={16} className="mb-4 w-5/6" />
        
        {/* Date + Read more */}
        <div className="flex items-center justify-between">
          <Skeleton variant="text" width={100} height={16} />
          <Skeleton variant="rectangular" width={120} height={36} />
        </div>
      </div>
    </div>
  );
};

const BlogListSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <BlogPostSkeleton key={index} />
      ))}
    </div>
  );
};

export { BlogPostSkeleton, BlogListSkeleton };
