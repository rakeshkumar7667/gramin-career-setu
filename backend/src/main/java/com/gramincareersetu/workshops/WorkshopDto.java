package com.gramincareersetu.workshops;

import java.time.Instant;

public record WorkshopDto(
        String id,
        String titleTe,
        String titleEn,
        String category,
        String speaker,
        Instant eventDate,
        int capacity,
        String status
) {
    public static WorkshopDto fromEntity(WorkshopEntity entity) {
        return new WorkshopDto(
                entity.getId(),
                entity.getTitleTe(),
                entity.getTitleEn(),
                entity.getCategory(),
                entity.getSpeaker(),
                entity.getEventDate(),
                entity.getCapacity(),
                entity.getStatus()
        );
    }
}
