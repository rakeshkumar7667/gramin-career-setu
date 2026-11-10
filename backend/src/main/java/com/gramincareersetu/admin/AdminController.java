package com.gramincareersetu.admin;

import com.gramincareersetu.audit.AuditLogEntity;
import com.gramincareersetu.auth.SecurityUtils;
import com.gramincareersetu.common.ApiResponse;
import com.gramincareersetu.common.PagedResponse;
import com.gramincareersetu.jobs.JobApplicationDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'VOLUNTEER')")
public class AdminController {

    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminStatsDto>> getStats() {
        AdminStatsDto stats = adminService.getStats();
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @GetMapping("/applications")
    public ResponseEntity<ApiResponse<PagedResponse<JobApplicationDto>>> getApplications(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        int safePage = Math.max(0, page);
        int safeSize = Math.max(1, Math.min(size, 100));
        Pageable pageable = PageRequest.of(safePage, safeSize, Sort.by("createdAt").descending());
        PagedResponse<JobApplicationDto> result = adminService.getApplications(status, pageable);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @PatchMapping("/applications/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<JobApplicationDto>> updateApplicationStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateApplicationStatusRequest request
    ) {
        String actor = SecurityUtils.getCurrentUserLogin().orElse("admin");
        JobApplicationDto updated = adminService.updateApplicationStatus(id, request, actor);
        return ResponseEntity.ok(ApiResponse.ok("Application status updated", updated));
    }

    @GetMapping("/audit-logs")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<PagedResponse<AuditLogEntity>>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        int safePage = Math.max(0, page);
        int safeSize = Math.max(1, Math.min(size, 100));
        Pageable pageable = PageRequest.of(safePage, safeSize, Sort.by("createdAt").descending());
        PagedResponse<AuditLogEntity> result = adminService.getAuditLogs(pageable);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }
}
