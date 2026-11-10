package com.gramincareersetu.jobs;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplicationEntity, String> {

    List<JobApplicationEntity> findByUserId(UUID userId);

    Page<JobApplicationEntity> findByJobId(String jobId, Pageable pageable);

    Page<JobApplicationEntity> findByStatus(String status, Pageable pageable);

    boolean existsByJobIdAndPhone(String jobId, String phone);
}
