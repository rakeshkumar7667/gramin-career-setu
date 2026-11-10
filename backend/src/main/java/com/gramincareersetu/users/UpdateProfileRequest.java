package com.gramincareersetu.users;

import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @Size(max = 255, message = "Full name must not exceed 255 characters")
        String fullName,

        @Size(max = 20, message = "Phone must not exceed 20 characters")
        String phone,

        @Size(max = 10, message = "Locale must not exceed 10 characters")
        String locale,

        @Size(max = 100, message = "District must not exceed 100 characters")
        String district,

        @Size(max = 100, message = "Mandal must not exceed 100 characters")
        String mandal,

        @Size(max = 100, message = "Village must not exceed 100 characters")
        String village,

        @Size(max = 100, message = "Qualification must not exceed 100 characters")
        String qualification,

        @Size(max = 100, message = "Career interest must not exceed 100 characters")
        String careerInterest,

        String profileJson
) {}
