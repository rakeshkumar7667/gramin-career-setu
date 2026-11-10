-- ==============================================================================
-- Gramin Career Setu: Expanded Sectors (Aviation, Healthcare, Agriculture, Defence, etc.)
-- Flyway Migration: V7__add_expanded_sector_jobs_and_fix_urls.sql
-- ==============================================================================

-- 1. Update outdated URLs from initial seed data to live authoritative portals
UPDATE jobs SET where_to_apply = 'https://psc.ap.gov.in', free_resource = 'https://psc.ap.gov.in' WHERE id = 'J01';
UPDATE jobs SET free_resource = 'https://www.indiapost.gov.in' WHERE id = 'J02';
UPDATE jobs SET where_to_apply = 'https://www.rrbapply.gov.in', free_resource = 'https://indianrailways.gov.in' WHERE id = 'J04';
UPDATE jobs SET where_to_apply = 'https://www.skillindiadigital.gov.in', free_resource = 'https://www.dgt.gov.in' WHERE id IN ('J07', 'J08', 'J09');
UPDATE jobs SET where_to_apply = 'https://www.skillindiadigital.gov.in', free_resource = 'https://www.skillindiadigital.gov.in' WHERE id = 'J10';
UPDATE jobs SET where_to_apply = 'https://www.ncs.gov.in' WHERE id = 'J14';
UPDATE jobs SET where_to_apply = 'https://ride.swiggy.com' WHERE id = 'J16';
UPDATE jobs SET where_to_apply = 'https://www.skillindiadigital.gov.in/content/pmkvy', free_resource = 'https://www.skillindiadigital.gov.in' WHERE id = 'J20';

-- 2. Insert newly researched jobs across aviation, healthcare, agriculture, defence, education, banking, tech
INSERT INTO jobs (id, title_te, title_en, category, qualification, exam_name, where_to_apply, salary_range, prep_time, free_resource, company, location, status) VALUES
('J23', 'కమర్షియల్ ఎయిర్ పైలట్', 'Commercial Air Pilot (CPL)', 'aviation', '10+2 with Physics & Math', 'DGCA CPL / IGRUA Entrance Exam', 'https://igrua.gov.in', '₹1,50,000 – ₹4,00,000', '18 – 24 months', 'https://www.dgca.gov.in', 'Airlines & Aviation Academy', 'Pan India / International', 'ACTIVE'),
('J24', 'ఎయిర్ హోస్టెస్ / క్యాబిన్ క్రూ', 'Air Hostess / Cabin Crew', 'aviation', '10+2 / Intermediate (Any Stream)', 'Airline Selection & Medical Assessment', 'https://careers.airindia.com', '₹40,000 – ₹90,000', '3 – 6 months', 'https://www.ncs.gov.in', 'Commercial Airlines', 'Major Airports / Metro Bases', 'ACTIVE'),
('J25', 'ఎయిర్‌పోర్ట్ గ్రౌండ్ స్టాఫ్', 'Airport Ground Operations Executive', 'aviation', '10+2 / Any Graduate Degree', 'AAI Junior Executive / Airline Selection', 'https://www.aai.aero', '₹25,000 – ₹50,000', '2 – 4 months', 'https://www.aai.aero', 'Airports Authority of India (AAI)', 'Airports in AP & South Hubs', 'ACTIVE'),
('J26', 'మెడికల్ డాక్టర్ (MBBS)', 'Medical Doctor (MBBS)', 'healthcare', '10+2 with BiPC (50%) - NEET UG', 'NEET-UG National Medical Entrance', 'https://mcc.nic.in', '₹60,000 – ₹1,50,000', '5.5 years (inc. internship)', 'https://nta.ac.in', 'Government & Trust Hospitals', 'State & District Hospitals', 'ACTIVE'),
('J27', 'స్టాఫ్ నర్స్ / నర్సింగ్ ఆఫీసర్', 'Staff Nurse / Nursing Officer', 'healthcare', 'GNM Diploma / B.Sc Nursing', 'AIIMS NORCET / State Health Exam', 'https://www.aiimsexams.ac.in', '₹30,000 – ₹70,000', '3 – 4 years course + 3-6 mos prep', 'https://hmfw.ap.gov.in', 'AIIMS & State Health Dept', 'Primary Health Centres (PHC)', 'ACTIVE'),
('J28', 'ఫార్మాసిస్ట్', 'Registered Pharmacist', 'healthcare', 'D.Pharm / B.Pharm', 'State Pharmacy Council / DME Recruitment', 'https://hmfw.ap.gov.in', '₹20,000 – ₹45,000', '2 – 4 years course + 2 mos prep', 'https://www.ncs.gov.in', 'Govt Hospitals & Retail Pharmacy', 'District & Mandal Towns', 'ACTIVE'),
('J29', 'గ్రామీణ ఆరోగ్య కార్యకర్త (ANM)', 'Auxiliary Nurse Midwife (ANM / MPHW)', 'healthcare', '10th Pass / 10+2 + ANM Training', 'NHM / Health Sub-Centre Recruitment', 'https://hmfw.ap.gov.in', '₹15,000 – ₹32,000', '2 years training course', 'https://nhm.gov.in', 'National Health Mission (NHM)', 'Village Health Sub-Centres', 'ACTIVE'),
('J30', 'గ్రామ వ్యవసాయ సహాయకుడు', 'Village Agriculture Assistant', 'agriculture', 'Diploma in Agriculture / B.Sc Agri', 'APPSC / State Agriculture Recruitment', 'https://psc.ap.gov.in', '₹22,000 – ₹45,000', '2-4 years study + 3 mos prep', 'https://angrau.ac.in', 'Department of Agriculture AP', 'Rythu Bharosa Kendras (RBK)', 'ACTIVE'),
('J31', 'భారత సైన్యం అగ్నివీర్', 'Indian Army Agniveer', 'defence', '10th Pass (45%) / 10+2', 'Army Common Entrance Exam (CEE) & Rally', 'https://joinindianarmy.nic.in', '₹30,000 – ₹40,000', '6 – 12 months (Physical & Study)', 'https://joinindianarmy.nic.in', 'Indian Armed Forces', 'Pan India Base Stations', 'ACTIVE'),
('J32', 'భారత వైమానిక దళం అగ్నివీర్‌వాయు', 'Indian Air Force Agniveervayu', 'defence', '10+2 with Math, Physics, English (50%)', 'Agnipath Vayu STAR Online Exam', 'https://agnipathvayu.cdac.in', '₹30,000 – ₹40,000', '6 – 12 months', 'https://agnipathvayu.cdac.in', 'Indian Air Force', 'Air Force Stations Pan India', 'ACTIVE'),
('J33', 'సెకండరీ గ్రేడ్ టీచర్ (SGT)', 'School Teacher (SGT / DSC)', 'education', '10+2 + D.Ed / B.Ed + TET', 'AP TET & District Selection Committee (DSC)', 'https://apdsc.apcfss.in', '₹28,000 – ₹55,000', '6 – 12 months', 'https://cse.ap.gov.in', 'School Education Department AP', 'Government Primary & High Schools', 'ACTIVE'),
('J34', 'బ్యాంక్ ప్రొబేషనరీ ఆఫీసర్ (PO)', 'Bank Probationary Officer (PO)', 'banking', 'Any Graduate Degree', 'IBPS PO / SBI PO Exam', 'https://www.ibps.in', '₹52,000 – ₹85,000', '6 – 12 months', 'https://www.ibps.in', 'Public Sector Banks & SBI', 'District & Rural Branches', 'ACTIVE'),
('J35', 'జూనియర్ సాఫ్ట్‌వేర్ డెవలపర్', 'Junior Software Developer', 'technology', 'B.Tech / BCA / B.Sc CS / IT Diploma', 'Technical Assessment & Coding Interview', 'https://www.ncs.gov.in', '₹25,000 – ₹55,000', '6 – 9 months', 'https://swayam.gov.in', 'IT Companies & Digital Startups', 'Hybrid / Technology Hubs', 'ACTIVE');
