package com.gameverse.service;

import com.gameverse.dto.FavoriteRequest;
import com.gameverse.entity.Favorite;
import com.gameverse.entity.User;
import com.gameverse.repository.FavoriteRepository;
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
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;

    @Transactional
    public void toggleFavorite(FavoriteRequest request) {
        User user = getCurrentUser();
        
        favoriteRepository.findByUserIdAndGameId(user.getId(), request.getGameId())
                .ifPresentOrElse(
                        favorite -> favoriteRepository.delete(favorite),
                        () -> {
                            Favorite favorite = Favorite.builder()
                                    .user(user)
                                    .gameId(request.getGameId())
                                    .build();
                            favoriteRepository.save(favorite);
                        }
                );
    }

    public List<Integer> getUserFavorites() {
        User user = getCurrentUser();
        return favoriteRepository.findByUserId(user.getId())
                .stream()
                .map(Favorite::getGameId)
                .collect(Collectors.toList());
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}

