package com.gramincareersetu.scholarships;

import com.gramincareersetu.common.ApiResponse;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/scholarships")
public class ScholarshipController {

    private final ScholarshipService scholarshipService;

    public ScholarshipController(ScholarshipService scholarshipService) {
        this.scholarshipService = scholarshipService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getScholarships(
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "false") boolean all
    ) {
        if (all) {
            List<ScholarshipDto> list = scholarshipService.getAllActiveScholarships();
            return ResponseEntity.ok(ApiResponse.ok("Scholarships retrieved successfully", list));
        }

        int safePage = Math.max(0, page);
        int safeSize = Math.max(1, Math.min(size, 100));
        Page<ScholarshipDto> pageResult = scholarshipService.getScholarships(
                category,
                PageRequest.of(safePage, safeSize, Sort.by("createdAt").ascending())
        );
        return ResponseEntity.ok(ApiResponse.ok("Scholarships retrieved successfully", pageResult));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ScholarshipDto>> getScholarshipById(@PathVariable String id) {
        ScholarshipDto dto = scholarshipService.getScholarshipById(id);
        return ResponseEntity.ok(ApiResponse.ok("Scholarship details retrieved", dto));
    }
}
