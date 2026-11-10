package com.gramincareersetu.schemes;

public record GovernmentSchemeDto(
        String id,
        String titleTe,
        String titleEn,
        String ministry,
        String benefit,
        String eligibility,
        String applicationUrl,
        String category,
        String status
) {
    public static GovernmentSchemeDto fromEntity(GovernmentSchemeEntity entity) {
        return new GovernmentSchemeDto(
                entity.getId(),
                entity.getTitleTe(),
                entity.getTitleEn(),
                entity.getMinistry(),
                entity.getBenefit(),
                entity.getEligibility(),
                entity.getApplicationUrl(),
                entity.getCategory(),
                entity.getStatus()
        );
    }
}
