package com.gameverse.service;

import com.gameverse.dto.ReviewRequest;
import com.gameverse.dto.ReviewResponse;
import com.gameverse.entity.Review;
import com.gameverse.entity.User;
import com.gameverse.repository.ReviewRepository;
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
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReviewResponse createReview(ReviewRequest request) {
        User user = getCurrentUser();
        
        Review review = Review.builder()
                .user(user)
                .gameId(request.getGameId())
                .comment(request.getComment())
                .build();

        review = reviewRepository.save(review);

        return ReviewResponse.builder()
                .id(review.getId())
                .userId(review.getUser().getId())
                .username(review.getUser().getUsername())
                .gameId(review.getGameId())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }

    public List<ReviewResponse> getReviewsByGameId(Integer gameId) {
        return reviewRepository.findByGameIdOrderByCreatedAtDesc(gameId)
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
    }

    public List<ReviewResponse> getReviewsByUserId(Long userId) {
        return reviewRepository.findByUserId(userId)
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
    }

    @Transactional
    public void deleteReview(Long reviewId) {
        User user = getCurrentUser();
        
        if (!reviewRepository.existsByIdAndUserId(reviewId, user.getId())) {
            throw new RuntimeException("Review not found or you don't have permission to delete it");
        }
        
        reviewRepository.deleteById(reviewId);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}

