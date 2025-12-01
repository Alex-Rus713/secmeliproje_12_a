package com.gameverse.repository;

import com.gameverse.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    Optional<Rating> findByUserIdAndGameId(Long userId, Integer gameId);
    
    List<Rating> findByGameId(Integer gameId);
    
    @Query("SELECT AVG(r.rating) FROM Rating r WHERE r.gameId = :gameId")
    Double findAverageRatingByGameId(Integer gameId);
    
    @Query("SELECT COUNT(r) FROM Rating r WHERE r.gameId = :gameId")
    Long countByGameId(Integer gameId);
    
    @Query("SELECT r FROM Rating r WHERE r.user.id = :userId ORDER BY r.createdAt DESC")
    List<Rating> findByUserId(Long userId);
}

