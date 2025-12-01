package com.gameverse.controller;

import com.gameverse.dto.FavoriteRequest;
import com.gameverse.service.FavoriteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping
    public ResponseEntity<Void> toggleFavorite(@Valid @RequestBody FavoriteRequest request) {
        favoriteService.toggleFavorite(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<List<Integer>> getUserFavorites() {
        return ResponseEntity.ok(favoriteService.getUserFavorites());
    }
}

