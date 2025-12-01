package com.gameverse.controller;

import com.gameverse.dto.GameRatingSummary;
import com.gameverse.dto.RatingRequest;
import com.gameverse.dto.RatingResponse;
import com.gameverse.service.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping
    public ResponseEntity<RatingResponse> submitRating(@Valid @RequestBody RatingRequest request) {
        return ResponseEntity.ok(ratingService.submitRating(request));
    }

    @GetMapping("/game/{gameId}")
    public ResponseEntity<GameRatingSummary> getGameRatings(@PathVariable Integer gameId) {
        return ResponseEntity.ok(ratingService.getGameRatings(gameId));
    }
}

