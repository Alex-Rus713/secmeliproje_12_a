import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { gamesAPI } from '../services/api';
import GameCard from '../components/GameCard';
import { FiSearch } from 'react-icons/fi';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { data: gamesData, isLoading } = useQuery({
    queryKey: ['popularGames'],
    queryFn: () => gamesAPI.getPopularGames(1, 20),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/games?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const trendingGenres = ['RPG', 'Shooter', 'Action', 'Indie', 'Strategy', 'Adventure'];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary/20 via-background to-background">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Your Universe of Games Awaits
          </h1>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Search for games, genres, developers, and more to discover your next adventure.
          </p>
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex items-center bg-background-card rounded-lg px-4 py-3 shadow-lg">
              <FiSearch className="text-text-secondary mr-3" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for games, genres, developers..."
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-text-secondary"
              />
              <button
                type="submit"
                className="ml-4 px-6 py-2 bg-primary hover:bg-primary-dark rounded-lg transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Popular Games Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">Popular Right Now</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-background-card rounded-lg h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {gamesData?.results?.map((game: any) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trending Genres Section */}
      <section className="py-12 px-4 bg-background-card">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">Trending Genres</h2>
          <div className="flex flex-wrap gap-4">
            {trendingGenres.map((genre) => (
              <button
                key={genre}
                onClick={() => navigate(`/games?genre=${genre}`)}
                className="px-6 py-3 bg-primary hover:bg-primary-dark rounded-lg transition-colors font-semibold"
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

