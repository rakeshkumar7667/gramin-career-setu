package com.gramincareersetu.resumes;

import java.time.Instant;
import java.util.UUID;

public record ResumeDto(
        UUID id,
        UUID userId,
        String templateId,
        String resumeJson,
        int atsScore,
        int resumeScore,
        Instant updatedAt
) {
    public static ResumeDto fromEntity(ResumeEntity entity) {
        return new ResumeDto(
                entity.getId(),
                entity.getUserId(),
                entity.getTemplateId(),
                entity.getResumeJson(),
                entity.getAtsScore(),
                entity.getResumeScore(),
                entity.getUpdatedAt()
        );
    }
}
