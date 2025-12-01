package com.gameverse.service;

import com.gameverse.dto.GameRatingSummary;
import com.gameverse.dto.RatingRequest;
import com.gameverse.dto.RatingResponse;
import com.gameverse.entity.Rating;
import com.gameverse.entity.User;
import com.gameverse.repository.RatingRepository;
import com.gameverse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;

    @Transactional
    public RatingResponse submitRating(RatingRequest request) {
        User user = getCurrentUser();
        
        Rating rating = ratingRepository.findByUserIdAndGameId(user.getId(), request.getGameId())
                .map(existingRating -> {
                    existingRating.setRating(request.getRating());
                    return existingRating;
                })
                .orElse(Rating.builder()
                        .user(user)
                        .gameId(request.getGameId())
                        .rating(request.getRating())
                        .build());

        rating = ratingRepository.save(rating);

        return RatingResponse.builder()
                .id(rating.getId())
                .userId(rating.getUser().getId())
                .username(rating.getUser().getUsername())
                .gameId(rating.getGameId())
                .rating(rating.getRating())
                .createdAt(rating.getCreatedAt())
                .build();
    }

    public GameRatingSummary getGameRatings(Integer gameId) {
        Double averageRating = ratingRepository.findAverageRatingByGameId(gameId);
        Long totalRatings = ratingRepository.countByGameId(gameId);
        
        List<RatingResponse> ratings = ratingRepository.findByGameId(gameId)
                .stream()
                .map(rating -> RatingResponse.builder()
                        .id(rating.getId())
                        .userId(rating.getUser().getId())
                        .username(rating.getUser().getUsername())
                        .gameId(rating.getGameId())
                        .rating(rating.getRating())
                        .createdAt(rating.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return GameRatingSummary.builder()
                .averageRating(averageRating)
                .totalRatings(totalRatings)
                .ratings(ratings)
                .build();
    }

    public List<RatingResponse> getRatingsByUserId(Long userId) {
        return ratingRepository.findByUserId(userId)
                .stream()
                .map(rating -> RatingResponse.builder()
                        .id(rating.getId())
                        .userId(rating.getUser().getId())
                        .username(rating.getUser().getUsername())
                        .gameId(rating.getGameId())
                        .rating(rating.getRating())
                        .createdAt(rating.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}

