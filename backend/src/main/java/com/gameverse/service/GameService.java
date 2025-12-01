package com.gameverse.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.gameverse.client.RawgApiClient;
import com.gameverse.dto.GameResponse;
import com.gameverse.dto.ReviewResponse;
import com.gameverse.entity.User;
import com.gameverse.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GameService {

    private final RawgApiClient rawgApiClient;
    private final ReviewRepository reviewRepository;
    private final RatingRepository ratingRepository;
    private final LikeRepository likeRepository;
    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;

    public Mono<JsonNode> getPopularGames(int page, int pageSize) {
        return rawgApiClient.getPopularGames(page, pageSize);
    }

    public Mono<GameResponse> getGameById(Integer gameId) {
        return rawgApiClient.getGameById(gameId)
                .map(gameNode -> buildGameResponse(gameNode, gameId));
    }

    public Mono<JsonNode> searchGames(String query, int page, int pageSize) {
        return rawgApiClient.searchGames(query, page, pageSize);
    }

    private GameResponse buildGameResponse(JsonNode gameNode, Integer gameId) {
        Long userId = getCurrentUserId();

        // Get user reviews
        List<ReviewResponse> reviews = reviewRepository.findByGameIdOrderByCreatedAtDesc(gameId)
                .stream()
                .map(review -> ReviewResponse.builder()
                        .id(review.getId())
                        .userId(review.getUser().getId())
                        .username(review.getUser().getUsername())
                        .gameId(review.getGameId())
                        .comment(review.getComment())
                        .createdAt(review.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        // Get user rating summary
        Double averageRating = ratingRepository.findAverageRatingByGameId(gameId);
        Long ratingCount = ratingRepository.countByGameId(gameId);

        // Get like count
        Long likeCount = likeRepository.countByGameId(gameId);

        // Check if current user liked/favorited
        Boolean isLiked = userId != null && likeRepository.existsByUserIdAndGameId(userId, gameId);
        Boolean isFavorited = userId != null && favoriteRepository.existsByUserIdAndGameId(userId, gameId);

        return GameResponse.builder()
                .id(gameId)
                .name(gameNode.has("name") ? gameNode.get("name").asText() : null)
                .description(gameNode.has("description_raw") ? gameNode.get("description_raw").asText() : 
                            gameNode.has("description") ? gameNode.get("description").asText() : null)
                .backgroundImage(gameNode.has("background_image") ? gameNode.get("background_image").asText() : null)
                .screenshots(rawgApiClient.extractScreenshots(gameNode))
                .genres(rawgApiClient.extractGenres(gameNode))
                .platforms(rawgApiClient.extractPlatforms(gameNode))
                .released(gameNode.has("released") ? gameNode.get("released").asText() : null)
                .rating(gameNode.has("rating") ? gameNode.get("rating").asDouble() : null)
                .ratingsCount(gameNode.has("ratings_count") ? gameNode.get("ratings_count").asInt() : null)
                .website(gameNode.has("website") ? gameNode.get("website").asText() : null)
                .redditUrl(gameNode.has("reddit_url") ? gameNode.get("reddit_url").asText() : null)
                .metacritic(gameNode.has("metacritic") ? gameNode.get("metacritic").asText() : null)
                .trailerUrl(rawgApiClient.extractTrailerUrl(gameNode))
                .userRating(averageRating)
                .userRatingCount(ratingCount)
                .likeCount(likeCount)
                .isLiked(isLiked)
                .isFavorited(isFavorited)
                .reviews(reviews)
                .build();
    }

    private Long getCurrentUserId() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() && 
                !authentication.getName().equals("anonymousUser")) {
                return userRepository.findByEmail(authentication.getName())
                        .map(User::getId)
                        .orElse(null);
            }
        } catch (Exception e) {
            log.debug("Could not get current user ID", e);
        }
        return null;
    }
}

