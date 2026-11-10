package com.gramincareersetu.auth;

import com.gramincareersetu.users.UserEntity;
import com.gramincareersetu.users.UserService;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

/**
 * Centralized, secure authentication resolver that extracts verified user identities
 * from Spring Security's Authentication context without hardcoded mock fallbacks.
 */
@Component
public class AuthenticatedUserResolver {

    private final UserService userService;

    @Autowired
    public AuthenticatedUserResolver(UserService userService) {
        this.userService = userService;
    }

    /**
     * Resolves the authenticated UserEntity.
     * Throws AccessDeniedException if the authentication is null, anonymous, or invalid.
     */
    public UserEntity resolve(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Authentication required to access this resource");
        }

        String keycloakId = null;
        String email = null;
        String fullName = null;
        Set<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        if (authentication.getPrincipal() instanceof Jwt jwt) {
            keycloakId = jwt.getSubject();
            email = jwt.getClaimAsString("email");
            fullName = jwt.getClaimAsString("name");
            if (fullName == null) {
                fullName = jwt.getClaimAsString("preferred_username");
            }
        } else if (!"anonymousUser".equalsIgnoreCase(authentication.getName())) {
            keycloakId = authentication.getName();
            email = authentication.getName() + "@gramincareersetu.org";
            fullName = authentication.getName();
        }

        if (keycloakId == null || keycloakId.isBlank() || "anonymousUser".equalsIgnoreCase(keycloakId)) {
            throw new AccessDeniedException("Valid user identity required. Anonymous access is prohibited.");
        }

        return userService.getOrCreateUserFromPrincipal(keycloakId, email, fullName, roles);
    }

    /**
     * Safely attempts to resolve the user's UUID without throwing.
     */
    public Optional<UUID> resolveUserId(Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return Optional.empty();
            }
            UserEntity user = resolve(authentication);
            return Optional.ofNullable(user.getId());
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    /**
     * Checks if the caller holds administrative privileges (ROLE_ADMIN or ROLE_SUPER_ADMIN).
     */
    public boolean isAdmin(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equalsIgnoreCase(a.getAuthority()) ||
                               "ROLE_SUPER_ADMIN".equalsIgnoreCase(a.getAuthority()));
    }
}
