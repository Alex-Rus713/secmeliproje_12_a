export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
}

export interface Game {
  id: number;
  name: string;
  background_image: string;
  rating: number;
  released: string;
  genres?: Array<{ name: string }>;
  platforms?: Array<{ platform: { name: string } }>;
}

export interface GameResponse {
  id: number;
  name: string;
  description: string;
  backgroundImage: string;
  screenshots: string[];
  genres: string[];
  platforms: string[];
  released: string;
  rating: number;
  ratingsCount: number;
  website: string;
  redditUrl: string;
  metacritic: string;
  trailerUrl: string;
  systemRequirements: any;
  userRating: number;
  userRatingCount: number;
  likeCount: number;
  isLiked: boolean;
  isFavorited: boolean;
  reviews: ReviewResponse[];
}

export interface ReviewResponse {
  id: number;
  userId: number;
  username: string;
  gameId: number;
  comment: string;
  createdAt: string;
}

export interface RatingResponse {
  id: number;
  userId: number;
  username: string;
  gameId: number;
  rating: number;
  createdAt: string;
}

export interface GameRatingSummary {
  averageRating: number;
  totalRatings: number;
  ratings: RatingResponse[];
}

export interface ReviewRequest {
  gameId: number;
  comment: string;
}

export interface RatingRequest {
  gameId: number;
  rating: number;
}

