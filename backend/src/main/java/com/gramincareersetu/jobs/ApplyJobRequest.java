package com.gramincareersetu.jobs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ApplyJobRequest(
        @NotBlank(message = "Applicant full name is required")
        @Size(min = 2, max = 255, message = "Name must be between 2 and 255 characters")
        String applicantName,

        @NotBlank(message = "Phone number is required")
        @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be a valid 10-digit mobile number")
        String phone,

        @NotBlank(message = "Village / Mandal / Town is required")
        @Size(min = 2, max = 255, message = "Village location must be between 2 and 255 characters")
        String village
) {}
