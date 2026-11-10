-- ==============================================================================
-- Gramin Career Setu: Core Relational Database Schema
-- Flyway Migration: V1__init_core_schema.sql
-- ==============================================================================

-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    keycloak_id VARCHAR(128) UNIQUE,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    locale VARCHAR(10) DEFAULT 'te' NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    version BIGINT DEFAULT 0 NOT NULL
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_status ON users(status);

-- 2. User Roles Table
CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, role)
);

CREATE INDEX idx_user_roles_role ON user_roles(role);

-- 3. User Profiles Table (Rural Demographics)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY,
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    district VARCHAR(100),
    mandal VARCHAR(100),
    village VARCHAR(100),
    qualification VARCHAR(100),
    career_interest VARCHAR(100),
    profile_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    version BIGINT DEFAULT 0 NOT NULL
);

-- 4. Jobs Table
CREATE TABLE jobs (
    id VARCHAR(64) PRIMARY KEY,
    title_te VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    qualification VARCHAR(255),
    exam_name VARCHAR(255),
    where_to_apply VARCHAR(512),
    salary_range VARCHAR(100),
    prep_time VARCHAR(100),
    free_resource VARCHAR(512),
    company VARCHAR(255),
    location VARCHAR(255),
    status VARCHAR(20) DEFAULT 'ACTIVE' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    version BIGINT DEFAULT 0 NOT NULL
);

CREATE INDEX idx_jobs_category ON jobs(category);
CREATE INDEX idx_jobs_status ON jobs(status);

-- 5. Job Applications Table
CREATE TABLE job_applications (
    id VARCHAR(64) PRIMARY KEY,
    job_id VARCHAR(64) NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    applicant_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    village VARCHAR(255) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(30) DEFAULT 'SUBMITTED' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    version BIGINT DEFAULT 0 NOT NULL
);

CREATE INDEX idx_applications_job_id ON job_applications(job_id);
CREATE INDEX idx_applications_user_id ON job_applications(user_id);
CREATE INDEX idx_applications_status ON job_applications(status);

-- 6. Job Bookmarks Table
CREATE TABLE job_bookmarks (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id VARCHAR(64) NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uk_user_job_bookmark UNIQUE (user_id, job_id)
);

CREATE INDEX idx_bookmarks_user ON job_bookmarks(user_id);

-- 7. Workshops Table
CREATE TABLE workshops (
    id VARCHAR(64) PRIMARY KEY,
    title_te VARCHAR(255),
    title_en VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    speaker VARCHAR(255),
    event_date TIMESTAMP,
    capacity INT DEFAULT 100 NOT NULL,
    status VARCHAR(20) DEFAULT 'UPCOMING' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    version BIGINT DEFAULT 0 NOT NULL
);

CREATE INDEX idx_workshops_status ON workshops(status);

-- 8. Workshop Registrations Table
CREATE TABLE workshop_registrations (
    id UUID PRIMARY KEY,
    workshop_id VARCHAR(64) NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    idempotency_key VARCHAR(128) UNIQUE,
    status VARCHAR(20) DEFAULT 'REGISTERED' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_workshop_reg_workshop ON workshop_registrations(workshop_id);
CREATE INDEX idx_workshop_reg_user ON workshop_registrations(user_id);

-- 9. Resumes Table
CREATE TABLE resumes (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    template_id VARCHAR(50) DEFAULT 'modern' NOT NULL,
    resume_json TEXT,
    ats_score INT DEFAULT 0 NOT NULL,
    resume_score INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    version BIGINT DEFAULT 0 NOT NULL
);

CREATE INDEX idx_resumes_user ON resumes(user_id);

-- 10. Audit Logs Table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY,
    actor_id VARCHAR(128),
    actor_email VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100),
    ip_address VARCHAR(45),
    user_agent VARCHAR(512),
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_audit_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at);
