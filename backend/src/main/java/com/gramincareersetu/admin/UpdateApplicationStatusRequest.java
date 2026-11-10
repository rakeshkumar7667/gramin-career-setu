package com.gramincareersetu.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record UpdateApplicationStatusRequest(
        @NotBlank(message = "Status is required")
        @Pattern(regexp = "^(SUBMITTED|UNDER_REVIEW|SHORTLISTED|REJECTED|HIRED)$", message = "Status must be one of: SUBMITTED, UNDER_REVIEW, SHORTLISTED, REJECTED, HIRED")
        String status,

        String note
) {}
