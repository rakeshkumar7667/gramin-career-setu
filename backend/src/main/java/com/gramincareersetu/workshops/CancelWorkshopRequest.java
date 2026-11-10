package com.gramincareersetu.workshops;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record CancelWorkshopRequest(
        @NotBlank(message = "Phone number is required to cancel registration")
        @Pattern(regexp = "^[6-9]\\d{9}$", message = "Phone must be a valid 10-digit mobile number")
        String phone,

        String cancellationCode
) {}
