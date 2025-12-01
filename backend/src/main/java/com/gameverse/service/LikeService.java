package com.gameverse.service;

import com.gameverse.dto.LikeRequest;
import com.gameverse.entity.Like;
import com.gameverse.entity.User;
import com.gameverse.repository.LikeRepository;
import com.gameverse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final UserRepository userRepository;

    @Transactional
    public void toggleLike(LikeRequest request) {
        User user = getCurrentUser();
        
        likeRepository.findByUserIdAndGameId(user.getId(), request.getGameId())
                .ifPresentOrElse(
                        like -> likeRepository.delete(like),
                        () -> {
                            Like like = Like.builder()
                                    .user(user)
                                    .gameId(request.getGameId())
                                    .build();
                            likeRepository.save(like);
                        }
                );
    }

    public Long getLikeCount(Integer gameId) {
        return likeRepository.countByGameId(gameId);
    }

    public Boolean isLiked(Integer gameId) {
        try {
            User user = getCurrentUser();
            return likeRepository.existsByUserIdAndGameId(user.getId(), gameId);
        } catch (Exception e) {
            return false;
        }
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}

