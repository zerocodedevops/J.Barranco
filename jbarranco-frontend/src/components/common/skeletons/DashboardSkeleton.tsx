import React from 'react';
import Skeleton from '../Skeleton';

const DashboardCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <Skeleton variant="text" width={120} height={20} />
        <Skeleton variant="circular" width={40} height={40} />
      </div>
      <Skeleton variant="text" width={80} height={32} className="mb-2" />
      <Skeleton variant="text" width={150} height={16} />
    </div>
  );
};

interface DashboardGridSkeletonProps {
  cards?: number;
}

const DashboardGridSkeleton: React.FC<DashboardGridSkeletonProps> = ({ cards = 4 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: cards }).map((_, index) => (
        <DashboardCardSkeleton key={index} />
      ))}
    </div>
  );
};

const ChartSkeleton: React.FC<{ height?: number }> = ({ height = 300 }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <Skeleton variant="text" width={200} height={24} className="mb-6" />
      <Skeleton variant="rectangular" width="100%" height={height} />
    </div>
  );
};

export { DashboardCardSkeleton, DashboardGridSkeleton, ChartSkeleton };
