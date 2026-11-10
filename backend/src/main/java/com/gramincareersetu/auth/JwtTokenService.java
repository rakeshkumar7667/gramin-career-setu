package com.gramincareersetu.auth;

import com.gramincareersetu.users.UserEntity;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import javax.crypto.SecretKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtTokenService {

    private static final Logger log = LoggerFactory.getLogger(JwtTokenService.class);

    /** HS256 needs at least 256 bits of key material. */
    private static final int MIN_SECRET_BYTES = 32;

    private final SecretKey key;
    private final long validityInMilliseconds;

    public JwtTokenService(
            @Value("${app.jwt.secret:}") String secret,
            @Value("${app.jwt.expiration-ms:86400000}") long validityInMilliseconds // 24 hours
    ) {
        // There used to be a literal signing secret as the default value here,
        // committed to the repository. Anyone who could read the source could
        // mint a valid token for any user, including an admin.
        //
        // With no secret configured we now generate a random one at startup.
        // Tokens then stop working across restarts, which is a visible nuisance
        // in development and exactly the prompt an operator needs to set
        // app.jwt.secret (or APP_JWT_SECRET) before deploying anything real.
        byte[] keyBytes;
        if (secret == null || secret.trim().length() < MIN_SECRET_BYTES) {
            keyBytes = new byte[MIN_SECRET_BYTES];
            new SecureRandom().nextBytes(keyBytes);
            log.warn("app.jwt.secret is not set (or is shorter than {} characters). "
                    + "Generated a random signing key for this run: sessions will not survive a "
                    + "restart. Set app.jwt.secret before deploying.", MIN_SECRET_BYTES);
        } else {
            keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        }

        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.validityInMilliseconds = validityInMilliseconds;
    }

    public String generateToken(UserEntity user, String primaryRole) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + validityInMilliseconds);

        return Jwts.builder()
                .subject(user.getId().toString())
                .claim("phone", user.getPhone() != null ? user.getPhone() : "")
                .claim("name", user.getFullName())
                .claim("email", user.getEmail() != null ? user.getEmail() : "")
                .claim("role", primaryRole)
                .claim("roles", user.getRoles())
                .issuedAt(now)
                .expiration(validity)
                .signWith(key)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Claims claims = parseClaims(token);
            return !claims.getExpiration().before(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public UUID getUserId(String token) {
        Claims claims = parseClaims(token);
        return UUID.fromString(claims.getSubject());
    }

    public String getPhone(String token) {
        Claims claims = parseClaims(token);
        return claims.get("phone", String.class);
    }

    @SuppressWarnings("unchecked")
    public List<String> getRoles(String token) {
        Claims claims = parseClaims(token);
        Object rolesObj = claims.get("roles");
        if (rolesObj instanceof List<?>) {
            return (List<String>) rolesObj;
        }
        String singleRole = claims.get("role", String.class);
        if (singleRole != null) {
            return List.of(singleRole);
        }
        return List.of("STUDENT");
    }

    public long getExpirationMs() {
        return validityInMilliseconds;
    }
}
