package com.gramincareersetu.workshops;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkshopRegistrationRepository extends JpaRepository<WorkshopRegistrationEntity, UUID> {

    List<WorkshopRegistrationEntity> findByWorkshopId(String workshopId);

    List<WorkshopRegistrationEntity> findByUserId(UUID userId);

    Optional<WorkshopRegistrationEntity> findByIdempotencyKey(String idempotencyKey);

    Optional<WorkshopRegistrationEntity> findByWorkshopIdAndIdempotencyKey(String workshopId, String idempotencyKey);

    Optional<WorkshopRegistrationEntity> findByWorkshopIdAndPhone(String workshopId, String phone);

    boolean existsByWorkshopIdAndPhone(String workshopId, String phone);

    long countByWorkshopId(String workshopId);

    void deleteByWorkshopIdAndPhone(String workshopId, String phone);
}
