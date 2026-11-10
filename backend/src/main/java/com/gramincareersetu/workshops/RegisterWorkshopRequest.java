package com.gramincareersetu.workshops;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterWorkshopRequest(
        @NotBlank(message = "Participant name is required")
        @Size(min = 2, max = 255, message = "Name must be between 2 and 255 characters")
        String name,

        @NotBlank(message = "Phone number is required")
        @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be a valid 10-digit mobile number")
        String phone,

        String idempotencyKey
) {}
