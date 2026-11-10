package com.gramincareersetu.common;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Duration;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Robust, distributed-ready rate limiting and abuse mitigation filter for public submission endpoints.
 * Prioritizes Redis distributed counters when available, with in-memory fallback for offline/dev modes.
 * Sanitizes IP resolution against spoofed headers by verifying the immediate upstream proxy.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 10)
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RateLimitingFilter.class);

    @Value("${app.rate-limiting.enabled:true}")
    private boolean enabled;

    @Value("${app.rate-limiting.max-requests-per-minute:25}")
    private int maxRequestsPerMinute;

    private final Optional<StringRedisTemplate> redisTemplate;
    private final ConcurrentHashMap<String, RequestCounter> requestCounts = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    @Autowired
    public RateLimitingFilter(Optional<StringRedisTemplate> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if (!enabled || !isProtectedEndpoint(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        String clientIp = resolveClientIp(request);
        String endpoint = request.getRequestURI();
        String key = clientIp + ":" + endpoint;
        long currentMinute = System.currentTimeMillis() / 60000;

        boolean rateLimitExceeded = false;

        if (redisTemplate.isPresent()) {
            try {
                String redisKey = "gcs:ratelimit:" + key;
                Long currentCount = redisTemplate.get().opsForValue().increment(redisKey);
                if (currentCount != null && currentCount == 1) {
                    redisTemplate.get().expire(redisKey, Duration.ofMinutes(1));
                }
                if (currentCount != null && currentCount > maxRequestsPerMinute) {
                    rateLimitExceeded = true;
                }
            } catch (Exception e) {
                log.warn("Redis rate-limiting check failed, falling back to in-memory counter: {}", e.getMessage());
                rateLimitExceeded = checkInMemoryRateLimit(key, currentMinute);
            }
        } else {
            rateLimitExceeded = checkInMemoryRateLimit(key, currentMinute);
        }

        if (rateLimitExceeded) {
            log.warn("Rate limit exceeded for IP {} on endpoint {}", PiiUtils.maskPhone(clientIp), endpoint);
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setHeader("Retry-After", "60");

            ApiResponse<Void> apiResponse = ApiResponse.error("Too many requests from this address. Please wait a minute before submitting again.");
            response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean checkInMemoryRateLimit(String key, long currentMinute) {
        RequestCounter counter = requestCounts.compute(key, (k, existing) -> {
            if (existing == null || existing.minute != currentMinute) {
                return new RequestCounter(currentMinute, 1);
            }
            existing.count.incrementAndGet();
            return existing;
        });

        // Periodic cleanup of stale entries when map exceeds threshold
        if (requestCounts.size() > 2000) {
            requestCounts.entrySet().removeIf(entry -> entry.getValue().minute < currentMinute);
        }

        return counter.count.get() > maxRequestsPerMinute;
    }

    private boolean isProtectedEndpoint(HttpServletRequest request) {
        if (!"POST".equalsIgnoreCase(request.getMethod())) {
            return false;
        }
        String uri = request.getRequestURI();
        return (uri.startsWith("/api/v1/jobs/") && uri.endsWith("/apply"))
                || (uri.startsWith("/api/v1/workshops/") && (uri.endsWith("/register") || uri.endsWith("/cancel")))
                || uri.equals("/api/v1/resumes/calculate-ats")
                || uri.equals("/api/v1/quiz/submit");
    }

    private String resolveClientIp(HttpServletRequest request) {
        String remoteAddr = request.getRemoteAddr();

        // Only trust forwarded headers if the immediate connection is from a trusted local loopback/proxy
        boolean isLocalProxy = "127.0.0.1".equals(remoteAddr)
                || "0:0:0:0:0:0:0:1".equals(remoteAddr)
                || "localhost".equalsIgnoreCase(remoteAddr)
                || (remoteAddr != null && (remoteAddr.startsWith("172.") || remoteAddr.startsWith("10.")));

        if (isLocalProxy) {
            String xForwardedFor = request.getHeader("X-Forwarded-For");
            if (xForwardedFor != null && !xForwardedFor.isBlank()) {
                String[] ips = xForwardedFor.split(",");
                for (String ip : ips) {
                    String trimmed = ip.trim();
                    if (!trimmed.isBlank() && !"unknown".equalsIgnoreCase(trimmed)) {
                        return trimmed;
                    }
                }
            }
            String xRealIp = request.getHeader("X-Real-IP");
            if (xRealIp != null && !xRealIp.isBlank()) {
                return xRealIp.trim();
            }
        }

        return remoteAddr != null ? remoteAddr : "127.0.0.1";
    }

    private static class RequestCounter {
        final long minute;
        final AtomicInteger count;

        RequestCounter(long minute, int initialCount) {
            this.minute = minute;
            this.count = new AtomicInteger(initialCount);
        }
    }
}
