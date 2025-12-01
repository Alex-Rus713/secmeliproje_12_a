import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

interface GameCardProps {
  game: {
    id: number;
    name: string;
    background_image: string;
    rating: number;
    released?: string;
    genres?: Array<{ name: string }>;
  };
}

const GameCard = ({ game }: GameCardProps) => {
  return (
    <Link to={`/games/${game.id}`}>
      <div className="group bg-background-card rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl">
        <div className="relative overflow-hidden">
          <img
            src={game.background_image || '/placeholder-game.jpg'}
            alt={game.name}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded flex items-center space-x-1">
            <FaStar className="text-yellow-400" size={14} />
            <span className="text-white text-sm font-semibold">{game.rating?.toFixed(1) || 'N/A'}</span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-white font-semibold text-lg mb-2 line-clamp-1">{game.name}</h3>
          {game.genres && game.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {game.genres.slice(0, 2).map((genre, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary bg-opacity-20 text-primary text-xs rounded"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}
          {game.released && (
            <p className="text-text-secondary text-sm">{new Date(game.released).getFullYear()}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default GameCard;

