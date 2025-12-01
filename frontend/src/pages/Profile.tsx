import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { reviewsAPI, ratingsAPI, favoritesAPI, gamesAPI } from '../services/api';
import RatingStars from '../components/RatingStars';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'reviews' | 'ratings' | 'favorites'>('reviews');

  const { data: reviews } = useQuery({
    queryKey: ['userReviews'],
    queryFn: () => reviewsAPI.getReviewsByGameId(0), // This would need a proper endpoint
    enabled: false,
  });

  const { data: favorites } = useQuery({
    queryKey: ['userFavorites'],
    queryFn: () => favoritesAPI.getUserFavorites(),
    enabled: !!user,
  });

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto">
        {/* Profile Header */}
        <div className="bg-background-card rounded-lg p-8 mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-3xl">
                {user?.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{user?.username}</h1>
              <p className="text-text-secondary mb-1">{user?.email}</p>
              <p className="text-text-secondary text-sm">Joined {new Date().toLocaleDateString()}</p>
            </div>
            <div className="ml-auto">
              <button className="px-6 py-2 bg-primary hover:bg-primary-dark rounded-lg transition-colors">
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-800">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'reviews'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            My Reviews
          </button>
          <button
            onClick={() => setActiveTab('ratings')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'ratings'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            My Ratings
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'favorites'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            My Favorites
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <p className="text-text-secondary text-center py-8">
                Your reviews will appear here. Start reviewing games to see them!
              </p>
            </div>
          )}

          {activeTab === 'ratings' && (
            <div className="space-y-4">
              <p className="text-text-secondary text-center py-8">
                Your ratings will appear here. Rate games to see them!
              </p>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div>
              {favorites && favorites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((gameId) => (
                    <FavoriteGameCard key={gameId} gameId={gameId} />
                  ))}
                </div>
              ) : (
                <p className="text-text-secondary text-center py-8">
                  You haven't favorited any games yet. Start exploring!
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FavoriteGameCard = ({ gameId }: { gameId: number }) => {
  const { data: game } = useQuery({
    queryKey: ['game', gameId],
    queryFn: () => gamesAPI.getGameById(gameId),
  });

  if (!game) return null;

  return (
    <Link to={`/games/${gameId}`}>
      <div className="bg-background-card rounded-lg overflow-hidden hover:scale-105 transition-transform">
        <img
          src={game.backgroundImage || '/placeholder-game.jpg'}
          alt={game.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-white font-semibold mb-2">{game.name}</h3>
          {game.userRating && (
            <RatingStars rating={game.userRating} size={16} />
          )}
        </div>
      </div>
    </Link>
  );
};

export default Profile;

