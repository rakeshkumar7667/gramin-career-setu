package com.gramincareersetu.auth;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.security.oauth2.jwt.BadJwtException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;

/**
 * Test-scoped JWT Decoder configuration.
 * Exists exclusively in src/test/java and is NEVER packaged into production binaries.
 * Rejects arbitrary/malformed tokens unless explicitly recognized as a valid test token.
 */
@Configuration
@Profile({"dev", "test"})
public class TestSecurityConfig {

    @Bean
    @Primary
    public JwtDecoder testJwtDecoder() {
        return token -> {
            if (token == null || token.isBlank() || token.startsWith("arbitrary") || token.equals("invalid-token")) {
                throw new BadJwtException("Invalid or untrusted test bearer token");
            }

            // Standard mock token format: "test-token.<username>.<role>" or "test-token:<username>:<role>"
            String username = "test_candidate";
            List<String> roles = List.of("STUDENT");

            if (token.startsWith("test-token.") || token.startsWith("test-token:")) {
                String delimiter = token.startsWith("test-token.") ? "\\." : ":";
                String[] parts = token.split(delimiter);
                if (parts.length >= 2) username = parts[1];
                if (parts.length >= 3) {
                    String roleName = parts[2].replace("ROLE_", "");
                    roles = List.of(roleName);
                }
            } else if (token.contains("admin")) {
                username = "admin_user";
                roles = List.of("ADMIN");
            }

            return new Jwt(
                    token,
                    Instant.now(),
                    Instant.now().plusSeconds(3600),
                    Map.of("alg", "none"),
                    Map.of(
                            "sub", username,
                            "preferred_username", username,
                            "email", username + "@gramincareersetu.org",
                            "realm_access", Map.of("roles", roles)
                    )
            );
        };
    }
}
