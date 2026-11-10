package com.gramincareersetu.resumes;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResumeRepository extends JpaRepository<ResumeEntity, UUID> {

    Optional<ResumeEntity> findTopByUserIdOrderByUpdatedAtDesc(UUID userId);

    boolean existsByUserId(UUID userId);
}
