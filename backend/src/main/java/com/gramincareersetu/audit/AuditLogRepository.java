package com.gramincareersetu.audit;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLogEntity, UUID> {

    Page<AuditLogEntity> findByOrderByCreatedAtDesc(Pageable pageable);

    Page<AuditLogEntity> findByResourceTypeOrderByCreatedAtDesc(String resourceType, Pageable pageable);
}
