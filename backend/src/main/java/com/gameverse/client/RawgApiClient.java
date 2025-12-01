package com.gameverse.client;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class RawgApiClient {

    @Value("${rawg.api.key}")
    private String apiKey;

    @Value("${rawg.api.base-url}")
    private String baseUrl;

    private final WebClient webClient;

    @Cacheable(value = "games", key = "'popular_' + #page + '_' + #pageSize")
    public Mono<JsonNode> getPopularGames(int page, int pageSize) {
        log.info("Fetching popular games from RAWG API - page: {}, size: {}", page, pageSize);
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/games")
                        .queryParam("key", apiKey)
                        .queryParam("page", page)
                        .queryParam("page_size", pageSize)
                        .queryParam("ordering", "-rating")
                        .build())
                .retrieve()
                .bodyToMono(JsonNode.class)
                .doOnError(error -> log.error("Error fetching popular games from RAWG API", error));
    }

    @Cacheable(value = "games", key = "'game_' + #gameId")
    public Mono<JsonNode> getGameById(Integer gameId) {
        log.info("Fetching game details from RAWG API - gameId: {}", gameId);
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/games/{id}")
                        .queryParam("key", apiKey)
                        .build(gameId))
                .retrieve()
                .bodyToMono(JsonNode.class)
                .doOnError(error -> log.error("Error fetching game details from RAWG API for gameId: {}", gameId, error));
    }

    @Cacheable(value = "games", key = "'search_' + #query + '_' + #page")
    public Mono<JsonNode> searchGames(String query, int page, int pageSize) {
        log.info("Searching games from RAWG API - query: {}, page: {}", query, page);
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/games")
                        .queryParam("key", apiKey)
                        .queryParam("search", query)
                        .queryParam("page", page)
                        .queryParam("page_size", pageSize)
                        .build())
                .retrieve()
                .bodyToMono(JsonNode.class)
                .doOnError(error -> log.error("Error searching games from RAWG API", error));
    }

    public List<String> extractScreenshots(JsonNode gameNode) {
        List<String> screenshots = new ArrayList<>();
        if (gameNode.has("short_screenshots")) {
            gameNode.get("short_screenshots").forEach(screenshot ->
                    screenshots.add(screenshot.get("image").asText())
            );
        }
        return screenshots;
    }

    public List<String> extractGenres(JsonNode gameNode) {
        List<String> genres = new ArrayList<>();
        if (gameNode.has("genres")) {
            gameNode.get("genres").forEach(genre ->
                    genres.add(genre.get("name").asText())
            );
        }
        return genres;
    }

    public List<String> extractPlatforms(JsonNode gameNode) {
        List<String> platforms = new ArrayList<>();
        if (gameNode.has("platforms")) {
            gameNode.get("platforms").forEach(platform ->
                    platforms.add(platform.get("platform").get("name").asText())
            );
        }
        return platforms;
    }

    public String extractTrailerUrl(JsonNode gameNode) {
        if (gameNode.has("movies") && gameNode.get("movies").size() > 0) {
            return gameNode.get("movies").get(0).get("data").get("480").asText();
        }
        return null;
    }
}

