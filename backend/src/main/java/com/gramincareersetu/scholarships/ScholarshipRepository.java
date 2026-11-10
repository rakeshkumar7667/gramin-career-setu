package com.gramincareersetu.scholarships;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScholarshipRepository extends JpaRepository<ScholarshipEntity, String> {

    List<ScholarshipEntity> findByStatusOrderByCreatedAtAsc(String status);

    Page<ScholarshipEntity> findByStatus(String status, Pageable pageable);

    Page<ScholarshipEntity> findByCategoryAndStatus(String category, String status, Pageable pageable);
}
