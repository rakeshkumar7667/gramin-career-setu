package com.gramincareersetu.schemes;

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
@RequestMapping("/api/v1/schemes")
public class SchemeController {

    private final SchemeService schemeService;

    public SchemeController(SchemeService schemeService) {
        this.schemeService = schemeService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getSchemes(
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "false") boolean all
    ) {
        if (all) {
            List<GovernmentSchemeDto> list = schemeService.getAllActiveSchemes();
            return ResponseEntity.ok(ApiResponse.ok("Government schemes retrieved successfully", list));
        }

        int safePage = Math.max(0, page);
        int safeSize = Math.max(1, Math.min(size, 100));
        Page<GovernmentSchemeDto> pageResult = schemeService.getSchemes(
                category,
                PageRequest.of(safePage, safeSize, Sort.by("createdAt").ascending())
        );
        return ResponseEntity.ok(ApiResponse.ok("Government schemes retrieved successfully", pageResult));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GovernmentSchemeDto>> getSchemeById(@PathVariable String id) {
        GovernmentSchemeDto dto = schemeService.getSchemeById(id);
        return ResponseEntity.ok(ApiResponse.ok("Government scheme details retrieved", dto));
    }
}
