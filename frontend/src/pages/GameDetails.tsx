import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gamesAPI, reviewsAPI, ratingsAPI, likesAPI, favoritesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import RatingStars from '../components/RatingStars';
import { FaHeart, FaStar, FaEdit } from 'react-icons/fa';
import { useState } from 'react';
import type { ReviewRequest, RatingRequest } from '../types';

const GameDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [reviewText, setReviewText] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);

  const { data: game, isLoading } = useQuery({
    queryKey: ['game', id],
    queryFn: () => gamesAPI.getGameById(Number(id)),
    enabled: !!id,
  });

  const { data: reviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => reviewsAPI.getReviewsByGameId(Number(id)),
    enabled: !!id,
  });

  const likeMutation = useMutation({
    mutationFn: () => likesAPI.toggleLike(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game', id] });
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: () => favoritesAPI.toggleFavorite(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game', id] });
    },
  });

  const reviewMutation = useMutation({
    mutationFn: (request: ReviewRequest) => reviewsAPI.createReview(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', id] });
      setReviewText('');
    },
  });

  const ratingMutation = useMutation({
    mutationFn: (request: RatingRequest) => ratingsAPI.submitRating(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game', id] });
      setSelectedRating(0);
    },
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewText.trim().length >= 10 && id) {
      reviewMutation.mutate({ gameId: Number(id), comment: reviewText });
    }
  };

  const handleSubmitRating = () => {
    if (selectedRating > 0 && id) {
      ratingMutation.mutate({ gameId: Number(id), rating: selectedRating });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Game not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Images */}
          <div>
            <img
              src={game.backgroundImage || '/placeholder-game.jpg'}
              alt={game.name}
              className="w-full h-96 object-cover rounded-lg mb-4"
            />
            {game.screenshots && game.screenshots.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {game.screenshots.slice(0, 3).map((screenshot, index) => (
                  <img
                    key={index}
                    src={screenshot}
                    alt={`Screenshot ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                ))}
              </div>
            )}
            {game.trailerUrl && (
              <div className="mt-4">
                <video src={game.trailerUrl} controls className="w-full rounded-lg" />
              </div>
            )}
          </div>

          {/* Right Column - Info */}
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">{game.name}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {game.genres?.map((genre, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary bg-opacity-20 text-primary rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>
            <div className="flex items-center space-x-4 mb-6">
              {game.platforms?.map((platform, index) => (
                <span key={index} className="text-text-secondary text-sm">
                  {platform}
                </span>
              ))}
            </div>

            {/* Ratings */}
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-2">
                <span className="text-text-secondary">RAWG Rating:</span>
                <RatingStars rating={game.rating || 0} />
                <span className="text-text-secondary">({game.ratingsCount} ratings)</span>
              </div>
              {game.userRating && (
                <div className="flex items-center space-x-4">
                  <span className="text-text-secondary">User Rating:</span>
                  <RatingStars rating={game.userRating} />
                  <span className="text-text-secondary">({game.userRatingCount} ratings)</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {isAuthenticated && (
              <div className="flex flex-wrap gap-4 mb-6">
                <button
                  onClick={() => likeMutation.mutate()}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                    game.isLiked
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <FaHeart className={game.isLiked ? 'fill-current' : ''} />
                  <span>{game.likeCount || 0} Likes</span>
                </button>
                <button
                  onClick={() => favoriteMutation.mutate()}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                    game.isFavorited
                      ? 'bg-yellow-600 hover:bg-yellow-700'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <FaStar className={game.isFavorited ? 'fill-current' : ''} />
                  <span>Favorite</span>
                </button>
              </div>
            )}

            {/* Description */}
            <div className="mb-6">
              <p className="text-text-secondary leading-relaxed">
                {game.description || 'No description available.'}
              </p>
            </div>
          </div>
        </div>

        {/* System Requirements */}
        {game.systemRequirements && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">System Requirements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-background-card p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Minimum</h3>
                <pre className="text-text-secondary text-sm whitespace-pre-wrap">
                  {JSON.stringify(game.systemRequirements, null, 2)}
                </pre>
              </div>
              <div className="bg-background-card p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Recommended</h3>
                <pre className="text-text-secondary text-sm whitespace-pre-wrap">
                  {JSON.stringify(game.systemRequirements, null, 2)}
                </pre>
              </div>
            </div>
          </section>
        )}

        {/* User Reviews */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">User Reviews</h2>

          {/* Add Review Form */}
          {isAuthenticated && (
            <div className="bg-background-card p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">Write a Review</h3>
              <div className="mb-4">
                <label className="block text-text-secondary mb-2">Your Rating</label>
                <RatingStars
                  rating={selectedRating}
                  interactive
                  onRatingChange={setSelectedRating}
                />
                {selectedRating > 0 && (
                  <button
                    onClick={handleSubmitRating}
                    className="mt-2 px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg transition-colors"
                  >
                    Submit Rating
                  </button>
                )}
              </div>
              <form onSubmit={handleSubmitReview}>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full bg-background p-4 rounded-lg text-white placeholder-text-secondary mb-4 min-h-[120px]"
                  required
                  minLength={10}
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary hover:bg-primary-dark rounded-lg transition-colors"
                >
                  Submit Review
                </button>
              </form>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="bg-background-card p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {review.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">{review.username}</p>
                        <p className="text-text-secondary text-sm">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-text-secondary mt-4">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-text-secondary text-center py-8">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default GameDetails;

