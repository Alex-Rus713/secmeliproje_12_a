import axios from 'axios';
import type { 
  AuthResponse, 
  GameResponse, 
  ReviewRequest, 
  ReviewResponse, 
  RatingRequest, 
  RatingResponse,
  GameRatingSummary 
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (username: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', { username, email, password });
    return response.data;
  },
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  },
};

// Games API
export const gamesAPI = {
  getPopularGames: async (page: number = 1, pageSize: number = 20) => {
    const response = await api.get(`/games?page=${page}&pageSize=${pageSize}`);
    return response.data;
  },
  getGameById: async (id: number): Promise<GameResponse> => {
    const response = await api.get<GameResponse>(`/games/${id}`);
    return response.data;
  },
  searchGames: async (query: string, page: number = 1, pageSize: number = 20) => {
    const response = await api.get(`/games/search?query=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}`);
    return response.data;
  },
};

// Reviews API
export const reviewsAPI = {
  createReview: async (request: ReviewRequest): Promise<ReviewResponse> => {
    const response = await api.post<ReviewResponse>('/reviews', request);
    return response.data;
  },
  getReviewsByGameId: async (gameId: number): Promise<ReviewResponse[]> => {
    const response = await api.get<ReviewResponse[]>(`/reviews/game/${gameId}`);
    return response.data;
  },
  deleteReview: async (id: number): Promise<void> => {
    await api.delete(`/reviews/${id}`);
  },
};

// Ratings API
export const ratingsAPI = {
  submitRating: async (request: RatingRequest): Promise<RatingResponse> => {
    const response = await api.post<RatingResponse>('/ratings', request);
    return response.data;
  },
  getGameRatings: async (gameId: number): Promise<GameRatingSummary> => {
    const response = await api.get<GameRatingSummary>(`/ratings/game/${gameId}`);
    return response.data;
  },
};

// Likes API
export const likesAPI = {
  toggleLike: async (gameId: number): Promise<void> => {
    await api.post('/likes', { gameId });
  },
  getLikeCount: async (gameId: number): Promise<number> => {
    const response = await api.get<number>(`/likes/game/${gameId}`);
    return response.data;
  },
};

// Favorites API
export const favoritesAPI = {
  toggleFavorite: async (gameId: number): Promise<void> => {
    await api.post('/favorites', { gameId });
  },
  getUserFavorites: async (): Promise<number[]> => {
    const response = await api.get<number[]>('/favorites/me');
    return response.data;
  },
};

export default api;

