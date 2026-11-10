package com.gramincareersetu.jobs;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface JobRepository extends JpaRepository<JobEntity, String>, JpaSpecificationExecutor<JobEntity> {

    Page<JobEntity> findByStatus(String status, Pageable pageable);

    Page<JobEntity> findByCategoryAndStatus(String category, String status, Pageable pageable);

    List<JobEntity> findByCategory(String category);
}
