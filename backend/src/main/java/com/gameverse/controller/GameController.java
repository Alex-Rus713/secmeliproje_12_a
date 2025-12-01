package com.gameverse.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.gameverse.dto.GameResponse;
import com.gameverse.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/games")
@RequiredArgsConstructor
public class GameController {

    private final GameService gameService;

    @GetMapping
    public Mono<ResponseEntity<JsonNode>> getPopularGames(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize) {
        return gameService.getPopularGames(page, pageSize)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<GameResponse>> getGameById(@PathVariable Integer id) {
        return gameService.getGameById(id)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/search")
    public Mono<ResponseEntity<JsonNode>> searchGames(
            @RequestParam String query,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize) {
        return gameService.searchGames(query, page, pageSize)
                .map(ResponseEntity::ok);
    }
}

