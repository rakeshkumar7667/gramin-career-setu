package com.gramincareersetu.auth.dto;

import java.util.Set;
import java.util.UUID;

public record UserAuthDto(
        UUID id,
        String fullName,
        String phone,
        String email,
        String role,
        Set<String> roles,
        String district,
        String mandal,
        String village,
        String qualification,
        String locale
) {}
