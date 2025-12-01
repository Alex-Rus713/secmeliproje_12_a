package com.gameverse.controller;

import com.gameverse.dto.LikeRequest;
import com.gameverse.service.LikeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    @PostMapping
    public ResponseEntity<Void> toggleLike(@Valid @RequestBody LikeRequest request) {
        likeService.toggleLike(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/game/{gameId}")
    public ResponseEntity<Long> getLikeCount(@PathVariable Integer gameId) {
        return ResponseEntity.ok(likeService.getLikeCount(gameId));
    }
}

