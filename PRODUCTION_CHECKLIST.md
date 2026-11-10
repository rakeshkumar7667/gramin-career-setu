# Production Readiness Checklist

The Gramin Career Setu platform has been hardened with a Spring Boot 3.3 modular monolith backend, Keycloak OIDC authentication, PostgreSQL relational persistence with Flyway migrations, pessimistic concurrency controls, security headers, rate limiting, and automated backup tooling.

---

## 1. Architectural & Engineering Hardening Status

- [x] **Server-Side API & Relational Database**: Spring Boot 3.3 REST API backed by PostgreSQL and Flyway schema migrations (V1 through V4).
- [x] **Managed Identity Provider**: Keycloak 24 OIDC integration with pre-configured realm, PKCE S256 public client, and role mapping (`ROLE_STUDENT`, `ROLE_VOLUNTEER`, `ROLE_ADMIN`).
- [x] **Authentication Hardening**: Insecure fallback JWT decoders completely removed; test decoder isolated to `src/test/java`; fail-closed `prod` default profile.
- [x] **Server-Side Authorization**: `@PreAuthorize("hasRole('ADMIN')")` enforced on all admin mutations; actuator endpoints locked down.
- [x] **Concurrency & Race Condition Defenses**: Pessimistic row locking on workshop registration (`findByIdForUpdate`), database unique constraints on registrations and applications, and collision-resistant application IDs.
- [x] **Input Validation & DoS Protection**: Sliding-window rate limiting filter on public write endpoints, bounded pagination (`page >= 0`, `1 <= size <= 100`), allowlisted sort fields, and 100KB payload cap on resume JSON.
- [x] **Client-Side State Consistency**: Real OIDC PKCE code flow; client-side segregation of offline demo mode (`isDemoSession: true`); server response awaited before job application persistence; workshop cancellation synced with backend; sensitive offline queue PII obfuscated.
- [x] **HTTP Security Headers**: `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`, and `Permissions-Policy` injected on responses; proxy client IP forwarding enabled.
- [x] **Disaster Recovery & Backups**: Automated PostgreSQL backup and restore scripts (`scripts/backup-db.*`, `scripts/restore-db.*`) with automated 7-day retention rotation and forward-only rollback runbook (`docs/database-backup-and-rollback-policy.md`).
- [x] **API Documentation**: OpenAPI 3 / Swagger UI integrated via Springdoc (`/swagger-ui.html` and `/v3/api-docs`).
- [x] **CI/CD Quality Gates**: GitHub Actions workflow (`.github/workflows/ci.yml`) running backend Maven tests, frontend Node.js tests, npm high-severity security audits, and Docker image build verification.

---

## 2. Pre-Deployment Infrastructure Checklist (Before Handling Real Users)

Before launching to live rural users in production:

1. **Environment Secrets Configuration**:
   - Copy `.env.example` to `.env`.
   - Generate strong, random secrets for `POSTGRES_PASSWORD`, `REDIS_PASSWORD`, `KEYCLOAK_ADMIN_PASSWORD`, and `SPRING_SECURITY_OIDC_CLIENT_SECRET`.
   - Never commit `.env` to source control.

2. **Managed SMS/Email Gateway Provisioning**:
   - Integrate a production SMS provider (e.g. Twilio, MSG91, or CDAC SMS Gateway for government schemes) for phone verification and transactional alerts.
   - Configure SMTP credentials in `application-prod.yml` or via environment variables (`SPRING_MAIL_HOST`, `SPRING_MAIL_USERNAME`, `SPRING_MAIL_PASSWORD`).

3. **SSL/TLS & Domain Termination**:
   - Deploy reverse proxy (Nginx, Caddy, or Cloudflare CDN) terminating HTTPS with modern TLS 1.3 certificates.
   - Enable HTTP Strict Transport Security (`HSTS: max-age=31536000; includeSubDomains; preload`).

4. **Production Data Seed / Synchronization**:
   - Replace sample data in `V2__seed_initial_data.sql` with verified active rural job postings, state/central scholarships, and accredited workshops.
   - Establish scheduled ingestion or admin workflow for ongoing job and scheme updates.

5. **External Monitoring & Log Aggregation**:
   - Connect Prometheus scraper to `/actuator/prometheus` (behind admin/internal network authentication).
   - Configure external uptime monitoring (e.g. Uptime Kuma, Pingdom) targeting `/actuator/health/liveness` and `/actuator/health/readiness`.
   - Ensure logs are shipped to centralized storage (Grafana Loki, ELK, or CloudWatch) with sensitive data redaction active.
