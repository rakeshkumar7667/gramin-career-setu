package com.gramincareersetu.resumes;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SaveResumeRequest(
        @Size(max = 50, message = "Template ID must not exceed 50 characters")
        String templateId,

        @NotBlank(message = "Resume content JSON is required")
        String resumeJson
) {}
