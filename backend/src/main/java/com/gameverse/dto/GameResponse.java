package com.gameverse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameResponse {
    private Integer id;
    private String name;
    private String description;
    private String backgroundImage;
    private List<String> screenshots;
    private List<String> genres;
    private List<String> platforms;
    private String released;
    private Double rating;
    private Integer ratingsCount;
    private String website;
    private String redditUrl;
    private String metacritic;
    private String trailerUrl;
    private Object systemRequirements;
    private Double userRating;
    private Long userRatingCount;
    private Long likeCount;
    private Boolean isLiked;
    private Boolean isFavorited;
    private List<ReviewResponse> reviews;
}

