-- ==============================================================================
-- Gramin Career Setu: Performance Optimization & Search Indexing
-- Flyway Migration: V5__job_search_trigram_and_quiz_indexes.sql
-- ==============================================================================

-- 1. Composite index for user quiz attempts retrieval ordered by creation date
CREATE INDEX IF NOT EXISTS idx_quiz_user_created ON quiz_attempts(user_id, created_at DESC);

-- 2. Composite index for user resume retrieval ordered by update date
CREATE INDEX IF NOT EXISTS idx_resumes_user_updated ON resumes(user_id, updated_at DESC);

-- 3. Search indexes for job titles and company
CREATE INDEX IF NOT EXISTS idx_jobs_title_en ON jobs(title_en);
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company);

