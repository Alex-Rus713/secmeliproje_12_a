package com.gameverse.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FavoriteRequest {
    @NotNull(message = "Game ID is required")
    private Integer gameId;
}

