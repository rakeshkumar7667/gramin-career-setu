package com.gramincareersetu.auth.dto;

public record AuthResponse(
        String token,
        String tokenType,
        long expiresInMs,
        UserAuthDto user
) {
    public static AuthResponse of(String token, long expiresInMs, UserAuthDto user) {
        return new AuthResponse(token, "Bearer", expiresInMs, user);
    }
}
