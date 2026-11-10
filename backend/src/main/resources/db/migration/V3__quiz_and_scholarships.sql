-- ==============================================================================
-- Gramin Career Setu: Quiz Assessments, Scholarships, and Government Schemes
-- Flyway Migration: V3__quiz_and_scholarships.sql
-- ==============================================================================

-- 1. Quiz Attempts Table
CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    technical_score INT NOT NULL,
    government_score INT NOT NULL,
    business_score INT NOT NULL,
    vocational_score INT NOT NULL,
    recommended_track VARCHAR(50) NOT NULL,
    answers_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_quiz_user ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_track ON quiz_attempts(recommended_track);

-- 2. Scholarships Table
CREATE TABLE scholarships (
    id VARCHAR(64) PRIMARY KEY,
    title_te VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    eligibility VARCHAR(255),
    amount_range VARCHAR(100),
    deadline VARCHAR(100),
    portal_url VARCHAR(512),
    status VARCHAR(20) DEFAULT 'ACTIVE' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_scholarships_category ON scholarships(category);

-- 3. Government Schemes Table
CREATE TABLE government_schemes (
    id VARCHAR(64) PRIMARY KEY,
    title_te VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    ministry VARCHAR(255),
    benefit VARCHAR(255),
    eligibility VARCHAR(255),
    application_url VARCHAR(512),
    category VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_schemes_category ON government_schemes(category);

-- Seed Scholarships Data
INSERT INTO scholarships (id, title_te, title_en, category, eligibility, amount_range, deadline, portal_url, status) VALUES
('SCH-01', 'జగనన్న విద్యా దీవెన', 'Jagananna Vidya Deevena (Full Fee Reimbursement)', 'Degree & Professional', 'SC/ST/BC/EWS Students enrolled in ITI/Polytechnic/Degree', 'Full Tuition Fee (Up to ₹50,000/yr)', 'Annual State Cycle', 'https://jnanabhumi.ap.gov.in', 'ACTIVE'),
('SCH-02', 'జగనన్న వసతి దీవెన', 'Jagananna Vasathi Deevena (Hostel & Food)', 'Higher Education', 'College students staying in hostels / rural commuters', '₹10,000 – ₹20,000 / year', 'Annual State Cycle', 'https://jnanabhumi.ap.gov.in', 'ACTIVE'),
('SCH-03', 'ఏఐసీటీఈ ప్రగతి స్కాలర్‌షిప్', 'AICTE Pragati Scholarship for Girls', 'Technical & Diploma', 'Girl students admitted to AICTE approved 1st year degree/diploma', '₹50,000 / year', 'October 31', 'https://scholarships.gov.in', 'ACTIVE'),
('SCH-04', 'సెంట్రల్ సెక్టార్ స్కాలర్‌షిప్', 'Central Sector Scheme of Scholarships (CSSS)', 'College & University', 'Class 12th pass > 80th percentile, family income < 4.5 Lakhs', '₹12,000 – ₹20,000 / year', 'December 31', 'https://scholarships.gov.in', 'ACTIVE'),
('SCH-05', 'పీఎం యశస్వి స్కాలర్‌షిప్', 'PM YASASVI Pre/Post Matric Scholarship', 'School & College', 'OBC/EBC/DNT students studying in Class 9 to 12', '₹75,000 – ₹1,25,000 / year', 'November 30', 'https://yet.nta.ac.in', 'ACTIVE');

-- Seed Government Schemes Data
INSERT INTO government_schemes (id, title_te, title_en, ministry, benefit, eligibility, application_url, category, status) VALUES
('SCHEME-01', 'పీఎం ముద్ర యోజన', 'Pradhan Mantri MUDRA Yojana (PMMY)', 'Ministry of Finance', 'Collateral-free business loans up to ₹10 Lakhs (Shishu, Kishore, Tarun)', 'Rural youth starting Kirana, Tailoring, Food units', 'https://www.mudra.org.in', 'MSME & Self-Employment', 'ACTIVE'),
('SCHEME-02', 'పీఎం విశ్వకర్మ యోజన', 'PM Vishwakarma Scheme', 'Ministry of MSME', '₹15,000 Toolkit incentive + collateral free loans at 5%', 'Traditional artisans: Carpenters, Blacksmiths, Electricians, Potters', 'https://pmvishwakarma.gov.in', 'Artisans & Trades', 'ACTIVE'),
('SCHEME-03', 'పీఎం కుసుమ్ సోలార్ పథకం', 'PM KUSUM Solar Pump Scheme', 'Ministry of New & Renewable Energy', 'Up to 60% subsidy for setting up solar irrigation pumps on agricultural lands', 'Farmers and rural agricultural landholders', 'https://pmkusum.mnre.gov.in', 'Agriculture', 'ACTIVE'),
('SCHEME-04', 'పీఎం ఎఫ్‌ఎంఈ మైక్రో ఫుడ్ ప్రాసెసింగ్', 'PM Formalisation of Micro Food Processing (PMFME)', 'Ministry of Food Processing', '35% credit-linked capital subsidy up to ₹10 Lakhs for micro food units', 'Pickle, Spice, Flour, Dairy units in rural mandals', 'https://pmfme.mofpi.gov.in', 'Agri-Business', 'ACTIVE');
