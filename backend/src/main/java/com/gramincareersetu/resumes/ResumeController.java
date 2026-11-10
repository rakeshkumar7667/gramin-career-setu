package com.gramincareersetu.resumes;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gramincareersetu.auth.AuthenticatedUserResolver;
import com.gramincareersetu.common.ApiResponse;
import com.gramincareersetu.common.BadRequestException;
import com.gramincareersetu.users.UserEntity;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/resumes")
public class ResumeController {

    private final ResumeService resumeService;
    private final AuthenticatedUserResolver userResolver;
    private final ObjectMapper objectMapper;

    @Autowired
    public ResumeController(
            ResumeService resumeService,
            AuthenticatedUserResolver userResolver,
            ObjectMapper objectMapper
    ) {
        this.resumeService = resumeService;
        this.userResolver = userResolver;
        this.objectMapper = objectMapper;
    }

    @GetMapping("/my-resume")
    public ResponseEntity<ApiResponse<ResumeDto>> getMyResume(Authentication authentication) {
        UserEntity user = userResolver.resolve(authentication);
        ResumeDto resume = resumeService.getResumeByUserId(user.getId());
        return ResponseEntity.ok(ApiResponse.ok(resume));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ResumeDto>> saveResume(
            Authentication authentication,
            @Valid @RequestBody SaveResumeRequest request
    ) {
        UserEntity user = userResolver.resolve(authentication);
        ResumeDto saved = resumeService.saveResume(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Resume saved successfully", saved));
    }

    @PostMapping("/calculate-ats")
    public ResponseEntity<ApiResponse<AtsEvaluationDto>> calculateAtsScore(@RequestBody(required = false) String rawBody) {
        if (rawBody == null || rawBody.isBlank()) {
            throw new BadRequestException("Resume payload cannot be empty");
        }

        String resumeJson = rawBody;
        // If client sent {"resumeJson": "..."}, unwrap it; otherwise accept raw JSON payload
        if (rawBody.trim().startsWith("{")) {
            try {
                JsonNode node = objectMapper.readTree(rawBody);
                if (node.has("resumeJson") && node.get("resumeJson").isTextual()) {
                    resumeJson = node.get("resumeJson").asText();
                }
            } catch (Exception ignored) {
                // Keep rawBody if JSON parsing fails here; evaluateAts handles validation
            }
        }

        AtsEvaluationDto evaluation = resumeService.evaluateAts(resumeJson);
        return ResponseEntity.ok(ApiResponse.ok("ATS evaluation completed", evaluation));
    }
}
