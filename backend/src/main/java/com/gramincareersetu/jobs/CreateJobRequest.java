package com.gramincareersetu.jobs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateJobRequest(
        @NotBlank(message = "Job ID is required (e.g., J23)")
        @Size(max = 64, message = "Job ID must not exceed 64 characters")
        String id,

        @NotBlank(message = "Telugu title is required")
        @Size(max = 255, message = "Telugu title must not exceed 255 characters")
        String titleTe,

        @NotBlank(message = "English title is required")
        @Size(max = 255, message = "English title must not exceed 255 characters")
        String titleEn,

        @NotBlank(message = "Category is required")
        @Size(max = 50, message = "Category must not exceed 50 characters")
        String category,

        String qualification,
        String examName,
        String whereToApply,
        String salaryRange,
        String prepTime,
        String freeResource,
        String company,
        String location,
        String status
) {}
