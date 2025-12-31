import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';

interface RatingStarsProps {
  rating: number; // 0-5
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  label?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export default function RatingStars({
  rating,
  size = 'md',
  interactive = false,
  onChange,
  label,
}: RatingStarsProps) {
  const handleClick = (stars: number) => {
    if (interactive && onChange) {
      onChange(stars);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {label && <span className="text-sm text-gray-600 mr-2">{label}:</span>}
      
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= rating;
        const Icon = isFilled ? StarIcon : StarIconOutline;
        
        return (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            disabled={!interactive}
            className={`${sizeClasses[size]} ${
              interactive
                ? 'cursor-pointer hover:scale-110 transition-transform'
                : 'cursor-default'
            } ${isFilled ? 'text-yellow-400' : 'text-gray-300'}`}
            aria-label={`${star} estrellas`}
          >
            <Icon />
          </button>
        );
      })}
      
      {rating > 0 && (
        <span className="ml-2 text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
