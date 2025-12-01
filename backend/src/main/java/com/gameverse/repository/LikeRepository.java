package com.gameverse.repository;

import com.gameverse.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByUserIdAndGameId(Long userId, Integer gameId);
    
    Long countByGameId(Integer gameId);
    
    boolean existsByUserIdAndGameId(Long userId, Integer gameId);
}

