-- ==============================================================================
-- Gramin Career Setu: Concurrency & Duplicate Protection Hardening
-- Flyway Migration: V4__concurrency_and_security_hardening.sql
-- ==============================================================================

-- 1. Unique constraint to prevent duplicate phone registrations per workshop (race condition defense)
ALTER TABLE workshop_registrations
    ADD CONSTRAINT uk_workshop_reg_workshop_phone UNIQUE (workshop_id, phone);

-- 2. Unique constraint to prevent duplicate phone applications per job posting
ALTER TABLE job_applications
    ADD CONSTRAINT uk_job_app_job_phone UNIQUE (job_id, phone);

-- 3. Indexes for fast phone lookups and abuse monitoring
CREATE INDEX idx_job_app_phone ON job_applications(phone);
CREATE INDEX idx_workshop_reg_phone ON workshop_registrations(phone);
