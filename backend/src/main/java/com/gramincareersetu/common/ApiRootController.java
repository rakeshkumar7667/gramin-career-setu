package com.gramincareersetu.common;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "API Root", description = "Root discovery and service information")
public class ApiRootController {

    @GetMapping(value = {"/api/v1", "/api/v1/"})
    @Operation(summary = "Get API service status, version and available endpoints")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getApiInfo() {
        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "service", "Gramin Career Setu REST API",
                "version", "1.0.0",
                "status", "UP",
                "docs", "/swagger-ui.html",
                "endpoints", Map.of(
                        "auth", "/api/v1/auth",
                        "jobs", "/api/v1/jobs",
                        "workshops", "/api/v1/workshops",
                        "scholarships", "/api/v1/scholarships",
                        "schemes", "/api/v1/schemes",
                        "admin", "/api/v1/admin"
                )
        )));
    }
}
