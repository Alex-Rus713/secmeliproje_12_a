package com.gameverse.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LikeRequest {
    @NotNull(message = "Game ID is required")
    private Integer gameId;
}

