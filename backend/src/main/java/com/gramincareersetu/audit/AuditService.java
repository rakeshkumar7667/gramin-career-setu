package com.gramincareersetu.audit;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Service
public class AuditService {

    private static final Logger log = LoggerFactory.getLogger(AuditService.class);

    private final AuditLogRepository auditLogRepository;

    @Autowired
    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    /**
     * Record an audit event, automatically resolving the real client IP and User-Agent from the HTTP request context.
     */
    public void record(String actorId, String actorEmail, String action, String resourceType, String resourceId, String details) {
        String ipAddress = resolveClientIp();
        String userAgent = resolveUserAgent();
        record(actorId, actorEmail, action, resourceType, resourceId, ipAddress, userAgent, details);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void record(String actorId, String actorEmail, String action, String resourceType, String resourceId, String ipAddress, String userAgent, String details) {
        try {
            AuditLogEntity logEntry = new AuditLogEntity(
                    actorId,
                    actorEmail,
                    action,
                    resourceType,
                    resourceId,
                    ipAddress != null ? ipAddress : "127.0.0.1",
                    userAgent != null ? userAgent : "Unknown",
                    details
            );
            auditLogRepository.save(logEntry);
            log.debug("Audit log recorded: {} on {}:{} from IP {}", action, resourceType, resourceId, ipAddress);
        } catch (Exception e) {
            log.error("Failed to record audit log: ", e);
        }
    }

    private String resolveClientIp() {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                String xForwardedFor = request.getHeader("X-Forwarded-For");
                if (xForwardedFor != null && !xForwardedFor.isBlank()) {
                    return xForwardedFor.split(",")[0].trim();
                }
                String xRealIp = request.getHeader("X-Real-IP");
                if (xRealIp != null && !xRealIp.isBlank()) {
                    return xRealIp.trim();
                }
                return request.getRemoteAddr() != null ? request.getRemoteAddr() : "127.0.0.1";
            }
        } catch (Exception e) {
            log.trace("Could not resolve client IP from request context: {}", e.getMessage());
        }
        return "127.0.0.1";
    }

    private String resolveUserAgent() {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                String ua = request.getHeader("User-Agent");
                if (ua != null && !ua.isBlank()) {
                    return ua.length() > 500 ? ua.substring(0, 500) : ua;
                }
            }
        } catch (Exception e) {
            log.trace("Could not resolve user agent: {}", e.getMessage());
        }
        return "Unknown";
    }
}
