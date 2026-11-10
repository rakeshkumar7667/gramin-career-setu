package com.gramincareersetu.schemes;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SchemeRepository extends JpaRepository<GovernmentSchemeEntity, String> {

    List<GovernmentSchemeEntity> findByStatusOrderByCreatedAtAsc(String status);

    Page<GovernmentSchemeEntity> findByStatus(String status, Pageable pageable);

    Page<GovernmentSchemeEntity> findByCategoryAndStatus(String category, String status, Pageable pageable);
}
