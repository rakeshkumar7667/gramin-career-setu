-- ==============================================================================
-- Gramin Career Setu: Standalone Authentication & Password Hashing
-- Flyway Migration: V6__auth_and_password_hash.sql
-- ==============================================================================

ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);
