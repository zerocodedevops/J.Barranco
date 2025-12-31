import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'full';
  message?: string;
}

/**
 * Componente de loading spinner reutilizable
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'full', 
  message = 'Cargando...' 
}) => {
  const sizeClasses = {
    sm: 'h-32',
    md: 'h-64',
    lg: 'h-96',
    full: 'h-screen'
  };

  return (
    <div className={`${sizeClasses[size]} bg-gray-light flex items-center justify-center`}>
      <div className="text-brand-blue text-2xl font-semibold animate-pulse">
        {message}
      </div>
    </div>
  );
};

export default LoadingSpinner;
