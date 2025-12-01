import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { gamesAPI } from '../services/api';
import GameCard from '../components/GameCard';

const Games = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [page, setPage] = useState(1);

  const { data: gamesData, isLoading } = useQuery({
    queryKey: ['games', searchQuery, page],
    queryFn: () => {
      if (searchQuery) {
        return gamesAPI.searchGames(searchQuery, page, 20);
      }
      return gamesAPI.getPopularGames(page, 20);
    },
  });

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'All Games'}
        </h1>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="bg-background-card rounded-lg h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
              {gamesData?.results?.map((game: any) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>

            {/* Pagination */}
            {gamesData && gamesData.count > 20 && (
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-background-card hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-text-secondary">
                  Page {page} of {Math.ceil(gamesData.count / 20)}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= Math.ceil(gamesData.count / 20)}
                  className="px-4 py-2 bg-background-card hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Games;

