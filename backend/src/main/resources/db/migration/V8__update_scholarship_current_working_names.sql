-- ==============================================================================
-- Gramin Career Setu: Update Scholarships to Current Working Names
-- Flyway Migration: V8__update_scholarship_current_working_names.sql
-- ==============================================================================

-- 1. Update existing scholarship records to official current working names
UPDATE scholarships
SET title_te = 'పోస్ట్-మెట్రిక్ ఫీజు రీయింబర్స్‌మెంట్ (RTF)',
    title_en = 'Post-Matric Fee Reimbursement (RTF - Full Tuition Fee)',
    category = 'Degree & Professional',
    eligibility = 'SC/ST/BC/EWS/Kapu/Minority students enrolled in ITI, Polytechnic, Degree, Engineering, Medicine',
    amount_range = 'Full Tuition Fee Reimbursement (Direct to College)',
    portal_url = 'https://jnanabhumi.ap.gov.in'
WHERE id = 'SCH-01';

UPDATE scholarships
SET title_te = 'పోస్ట్-మెట్రిక్ వసతి & మెయింటెనెన్స్ అలవెన్స్ (MTF)',
    title_en = 'Post-Matric Maintenance Allowance (MTF - Hostel & Living)',
    category = 'Higher Education',
    eligibility = 'College students (ITI ₹10,000, Poly ₹15,000, Degree ₹20,000/yr) staying in college hostels or attached rooms',
    amount_range = '₹10,000 – ₹20,000 / year',
    portal_url = 'https://jnanabhumi.ap.gov.in'
WHERE id = 'SCH-02';

UPDATE scholarships
SET title_te = 'ఏఐసీటీఈ ప్రగతి స్కాలర్‌షిప్ (బాలికలకు)',
    title_en = 'AICTE Pragati Scholarship Scheme for Girl Students',
    category = 'Technical & Diploma',
    eligibility = 'Girl students admitted to AICTE approved 1st year Degree/Diploma, Family income < ₹8 Lakhs',
    amount_range = '₹50,000 / year',
    portal_url = 'https://scholarships.gov.in'
WHERE id = 'SCH-03';

UPDATE scholarships
SET title_te = 'పీఎం-యుఎస్‌పీ సెంట్రల్ సెక్టార్ స్కాలర్‌షిప్ (PM-USP CSSS)',
    title_en = 'PM-USP Central Sector Scheme of Scholarship (CSSS for College & University)',
    category = 'College & University',
    eligibility = 'Class 12 pass > 80th percentile in State Board, family income < ₹4.5 Lakhs, pursuing regular graduation',
    amount_range = '₹12,000 – ₹20,000 / year',
    portal_url = 'https://scholarships.gov.in'
WHERE id = 'SCH-04';

UPDATE scholarships
SET title_te = 'పీఎం-యశస్వి స్కాలర్‌షిప్ పథకం (OBC, EBC & DNT)',
    title_en = 'PM-YASASVI Post-Matric & Pre-Matric Scholarship Scheme',
    category = 'School & College',
    eligibility = 'OBC, EBC, DNT students in Class 9-12 or Top-class Higher Education, annual family income < ₹2.5 Lakhs',
    amount_range = '₹75,000 – ₹1,25,000 / year',
    portal_url = 'https://scholarships.gov.in'
WHERE id = 'SCH-05';

-- 2. Insert additional flagship active central scholarships
INSERT INTO scholarships (id, title_te, title_en, category, eligibility, amount_range, deadline, portal_url, status) VALUES
('SCH-06', 'నేషనల్ మీన్స్-కమ్-మెరిట్ స్కాలర్‌షిప్ (NMMSS)', 'National Means-cum-Merit Scholarship Scheme (NMMSS)', 'School Education', 'Class 8 pass students from govt/local body schools with >= 55% marks, family income < ₹3,50,000', '₹12,000 / year', 'October 31', 'https://scholarships.gov.in', 'ACTIVE'),
('SCH-07', 'ఏఐసీటీఈ సక్షమ్ స్కాలర్‌షిప్ (దివ్యాంగ విద్యార్థులకు)', 'AICTE Saksham Scholarship Scheme for Specially-Abled (Divyang) Students', 'Technical & Diploma', 'Specially-abled students (disability not less than 40%) admitted to AICTE technical Degree/Diploma', '₹50,000 / year', 'October 31', 'https://scholarships.gov.in', 'ACTIVE'),
('SCH-08', 'ఇన్‌స్పైర్ స్కాలర్‌షిప్ ఫర్ హైయర్ ఎడ్యుకేషన్ (SHE)', 'INSPIRE Scholarship for Higher Education (SHE)', 'Science & Research', 'Top 1% rankers in Class 12th Board pursuing Basic and Natural Sciences (B.Sc, B.S., Int. M.Sc)', '₹80,000 / year', 'November 30', 'https://online-inspire.gov.in', 'ACTIVE');
