package com.gramincareersetu.jobs;

import com.gramincareersetu.auth.SecurityUtils;
import com.gramincareersetu.common.ApiResponse;
import com.gramincareersetu.common.PagedResponse;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/jobs")
public class JobController {

    private final JobService jobService;

    @Autowired
    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<JobDto>>> getJobs(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDir
    ) {
        int safePage = Math.max(0, page);
        int boundedSize = Math.min(Math.max(size, 1), 50);
        java.util.Set<String> allowedSorts = java.util.Set.of("id", "titleEn", "titleTe", "category", "salaryRange", "createdAt");
        String safeSortBy = (sortBy != null && allowedSorts.contains(sortBy)) ? sortBy : "id";
        Sort sort = sortDir.equalsIgnoreCase("DESC") ? Sort.by(safeSortBy).descending() : Sort.by(safeSortBy).ascending();
        Pageable pageable = PageRequest.of(safePage, boundedSize, sort);

        PagedResponse<JobDto> result = jobService.getJobs(category, query, pageable);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobDto>> getJobById(@PathVariable String id) {
        JobDto job = jobService.getJobById(id);
        return ResponseEntity.ok(ApiResponse.ok(job));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<JobDto>> createJob(@Valid @RequestBody CreateJobRequest request) {
        JobDto created = jobService.createJob(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Job created successfully", created));
    }

    @PostMapping("/{id}/apply")
    public ResponseEntity<ApiResponse<JobApplicationDto>> applyForJob(
            @PathVariable String id,
            @Valid @RequestBody ApplyJobRequest request
    ) {
        UUID userId = SecurityUtils.getCurrentUserId()
                .map(s -> {
                    try {
                        return UUID.fromString(s);
                    } catch (Exception e) {
                        return null;
                    }
                })
                .orElse(null);

        JobApplicationDto application = jobService.applyForJob(id, request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Application submitted successfully", application));
    }

    @PostMapping("/{id}/bookmark")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> toggleBookmark(@PathVariable String id) {
        UUID userId = SecurityUtils.getCurrentUserId()
                .map(s -> {
                    try {
                        return UUID.fromString(s);
                    } catch (Exception e) {
                        return UUID.nameUUIDFromBytes(s.getBytes());
                    }
                })
                .orElse(UUID.nameUUIDFromBytes("anonymous".getBytes()));

        boolean bookmarked = jobService.toggleBookmark(id, userId);
        return ResponseEntity.ok(ApiResponse.ok(Map.of("isBookmarked", bookmarked)));
    }

    @GetMapping("/bookmarks")
    public ResponseEntity<ApiResponse<List<JobDto>>> getBookmarks() {
        UUID userId = SecurityUtils.getCurrentUserId()
                .map(s -> {
                    try {
                        return UUID.fromString(s);
                    } catch (Exception e) {
                        return UUID.nameUUIDFromBytes(s.getBytes());
                    }
                })
                .orElse(UUID.nameUUIDFromBytes("anonymous".getBytes()));

        List<JobDto> bookmarks = jobService.getUserBookmarks(userId);
        return ResponseEntity.ok(ApiResponse.ok(bookmarks));
    }
}
