package com.gramincareersetu.scholarships;

public record ScholarshipDto(
        String id,
        String titleTe,
        String titleEn,
        String category,
        String eligibility,
        String amountRange,
        String deadline,
        String portalUrl,
        String status
) {
    public static ScholarshipDto fromEntity(ScholarshipEntity entity) {
        return new ScholarshipDto(
                entity.getId(),
                entity.getTitleTe(),
                entity.getTitleEn(),
                entity.getCategory(),
                entity.getEligibility(),
                entity.getAmountRange(),
                entity.getDeadline(),
                entity.getPortalUrl(),
                entity.getStatus()
        );
    }
}
