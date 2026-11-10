package com.gramincareersetu.workshops;

import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkshopRepository extends JpaRepository<WorkshopEntity, String> {

    List<WorkshopEntity> findByStatusOrderByEventDateAsc(String status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT w FROM WorkshopEntity w WHERE w.id = :id")
    Optional<WorkshopEntity> findByIdForUpdate(@Param("id") String id);
}
