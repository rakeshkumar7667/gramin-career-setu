package com.gramincareersetu.jobs;

import java.time.Instant;
import java.util.UUID;

public record JobApplicationDto(
        String id,
        String jobId,
        String applicantName,
        String phone,
        String village,
        UUID userId,
        String status,
        Instant createdAt
) {
    public static JobApplicationDto fromEntity(JobApplicationEntity entity) {
        return new JobApplicationDto(
                entity.getId(),
                entity.getJobId(),
                entity.getApplicantName(),
                entity.getPhone(),
                entity.getVillage(),
                entity.getUserId(),
                entity.getStatus(),
                entity.getCreatedAt()
        );
    }
}
