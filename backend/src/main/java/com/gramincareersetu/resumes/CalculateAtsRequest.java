package com.gramincareersetu.resumes;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CalculateAtsRequest(
        @NotBlank(message = "Resume JSON cannot be empty")
        @Size(max = 100000, message = "Resume payload exceeds maximum permitted size of 100KB")
        String resumeJson
) {}
