package com.gramincareersetu.users;

import java.time.Instant;
import java.util.UUID;

public record UserProfileDto(
        UUID id,
        UUID userId,
        String district,
        String mandal,
        String village,
        String qualification,
        String careerInterest,
        String profileJson,
        Instant updatedAt
) {
    public static UserProfileDto fromEntity(UserProfileEntity entity) {
        return new UserProfileDto(
                entity.getId(),
                entity.getUserId(),
                entity.getDistrict(),
                entity.getMandal(),
                entity.getVillage(),
                entity.getQualification(),
                entity.getCareerInterest(),
                entity.getProfileJson(),
                entity.getUpdatedAt()
        );
    }
}
