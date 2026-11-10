package com.gramincareersetu.users;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

public record UserDto(
        UUID id,
        String keycloakId,
        String email,
        String phone,
        String fullName,
        String locale,
        String status,
        Set<String> roles,
        UserProfileDto profile,
        Instant createdAt
) {
    public static UserDto fromEntity(UserEntity user, UserProfileEntity profile) {
        return new UserDto(
                user.getId(),
                user.getKeycloakId(),
                user.getEmail(),
                user.getPhone(),
                user.getFullName(),
                user.getLocale(),
                user.getStatus(),
                user.getRoles(),
                profile != null ? UserProfileDto.fromEntity(profile) : null,
                user.getCreatedAt()
        );
    }
}
