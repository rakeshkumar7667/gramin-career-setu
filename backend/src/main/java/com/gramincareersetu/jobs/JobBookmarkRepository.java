package com.gramincareersetu.jobs;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobBookmarkRepository extends JpaRepository<JobBookmarkEntity, UUID> {

    List<JobBookmarkEntity> findByUserId(UUID userId);

    Optional<JobBookmarkEntity> findByUserIdAndJobId(UUID userId, String jobId);

    boolean existsByUserIdAndJobId(UUID userId, String jobId);

    void deleteByUserIdAndJobId(UUID userId, String jobId);
}
