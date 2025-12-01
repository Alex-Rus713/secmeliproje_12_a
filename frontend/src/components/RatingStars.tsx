import { FaStar } from 'react-icons/fa';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

const RatingStars = ({ 
  rating, 
  maxRating = 5, 
  size = 20, 
  interactive = false,
  onRatingChange 
}: RatingStarsProps) => {
  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[...Array(maxRating)].map((_, index) => {
        const value = index + 1;
        const filled = value <= Math.round(rating);
        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(value)}
            disabled={!interactive}
            className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
          >
            <FaStar
              size={size}
              color={filled ? '#FCD34D' : '#4B5563'}
              className={filled ? 'fill-current' : ''}
            />
          </button>
        );
      })}
      {rating > 0 && (
        <span className="ml-2 text-text-secondary text-sm">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default RatingStars;

