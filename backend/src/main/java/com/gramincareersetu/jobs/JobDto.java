package com.gramincareersetu.jobs;

public record JobDto(
        String id,
        String titleTe,
        String titleEn,
        String category,
        String qualification,
        String examName,
        String whereToApply,
        String salaryRange,
        String prepTime,
        String freeResource,
        String company,
        String location,
        String status
) {
    public static JobDto fromEntity(JobEntity entity) {
        return new JobDto(
                entity.getId(),
                entity.getTitleTe(),
                entity.getTitleEn(),
                entity.getCategory(),
                entity.getQualification(),
                entity.getExamName(),
                entity.getWhereToApply(),
                entity.getSalaryRange(),
                entity.getPrepTime(),
                entity.getFreeResource(),
                entity.getCompany(),
                entity.getLocation(),
                entity.getStatus()
        );
    }
}
