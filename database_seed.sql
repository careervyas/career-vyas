-- ============================================================
-- Career Vyas — Sample Seed Data
-- Run this in Supabase SQL Editor to populate the explore pages
-- ============================================================

-- ==================
-- CAREER PROFILES
-- ==================
INSERT INTO career_profiles (title, slug, icon, stream, summary, avg_salary, study_duration, growth_outlook, skills_needed, top_companies, view_count)
VALUES 
  ('Software Engineer', 'software-engineer', '💻', 'Technology', 'Build the digital products that power the modern world. Software engineers design, develop, and maintain applications across web, mobile, and backend systems.', '₹8L – ₹40L per year', '4 Years (B.Tech)', 'Excellent — 25% growth by 2030', ARRAY['Python', 'JavaScript', 'Data Structures', 'System Design', 'Git'], ARRAY['Google', 'Microsoft', 'Amazon', 'Flipkart', 'Infosys'], 0),

  ('Data Scientist', 'data-scientist', '📊', 'Technology', 'Extract insights from massive datasets to guide business decisions. Data Scientists work at the intersection of statistics, programming, and domain expertise.', '₹10L – ₹50L per year', '4 Years (B.Tech / B.Sc)', 'Very High — AI boom driving demand', ARRAY['Python', 'R', 'Machine Learning', 'SQL', 'TensorFlow'], ARRAY['Meta', 'Netflix', 'Walmart Labs', 'Ola', 'Zomato'], 0),

  ('Doctor (MBBS)', 'doctor-mbbs', '🩺', 'Medicine', 'Diagnose and treat patients across a wide range of medical conditions. One of the most respected and impactful careers in India.', '₹6L – ₹30L per year', '5.5 Years (MBBS + Internship)', 'Stable — Always in demand', ARRAY['Biology', 'Clinical Skills', 'Patient Communication', 'Anatomy', 'Pharmacology'], ARRAY['AIIMS', 'Private Hospitals', 'WHO', 'PHC'], 0),

  ('Chartered Accountant', 'chartered-accountant', '📈', 'Finance', 'Manage financial records, audits, and taxation for individuals and corporations. CA is one of the most prestigious professional qualifications in India.', '₹7L – ₹35L per year', '4-5 Years (CA Course)', 'High — Essential for every business', ARRAY['Accounting', 'Taxation', 'Financial Reporting', 'Auditing', 'Tally'], ARRAY['Deloitte', 'PwC', 'KPMG', 'Big Corporates', 'Self Practice'], 0),

  ('Civil Services Officer (IAS/IPS)', 'civil-services-ias-ips', '🏛️', 'Government', 'Serve the nation through public administration, policy implementation, and governance. The UPSC Civil Services is the pinnacle of competitive exams in India.', '₹56,000 – ₹2.5L per month (pay scale)', '2-3 Years of Preparation', 'Stable — Government job with lifetime security', ARRAY['General Studies', 'Essay Writing', 'CSAT', 'Optional Subject', 'Interview Skills'], ARRAY['Government of India', 'State Governments', 'PSUs'], 0),

  ('Product Manager', 'product-manager', '🚀', 'Technology', 'Bridge the gap between users, business, and engineering to ship products that matter. PMs own the vision and roadmap of a product.', '₹15L – ₹60L per year', '4 Years (Any Degree + MBA preferred)', 'High — Every tech startup needs PMs', ARRAY['Product Thinking', 'Data Analysis', 'User Research', 'Roadmapping', 'Communication'], ARRAY['Google', 'Razorpay', 'PhonePe', 'CRED', 'Swiggy'], 0),

  ('Architect', 'architect', '🏗️', 'Design & Construction', 'Design buildings and spaces that shape how people live, work, and play. Architects combine creativity, technical knowledge, and an understanding of human needs.', '₹5L – ₹25L per year', '5 Years (B.Arch)', 'Steady — Driven by real estate & infrastructure boom', ARRAY['AutoCAD', 'Structural Design', '3D Modeling', 'Building Codes', 'Revit'], ARRAY['Hafeez Contractor', 'CP Kukreja', 'Government PWD', 'Real Estate Firms'], 0),

  ('Graphic Designer', 'graphic-designer', '🎨', 'Creative Arts', 'Communicate ideas visually through branding, UI, marketing, and digital content. Graphic Designers are needed across every industry.', '₹3L – ₹18L per year', '3-4 Years (B.Des / BFA)', 'Good — Rapidly growing in the digital startup ecosystem', ARRAY['Adobe Photoshop', 'Figma', 'Illustrator', 'Typography', 'Brand Identity'], ARRAY['Ogilvy', 'Dentsu', 'Startups', 'Freelance', 'Advertising Agencies'], 0)

ON CONFLICT (slug) DO NOTHING;

-- ==================
-- COURSES
-- ==================
INSERT INTO courses (title, slug, description, duration, eligibility, type)
VALUES
  ('Bachelor of Technology (B.Tech)', 'btech', 'The most popular undergraduate engineering degree in India. Covers disciplines like CS, Mechanical, Civil, Electrical, and more. Gateway to top tech careers and MBA programs.', '4 Years', '10+2 with PCM, 60%+ marks', 'Undergraduate Degree'),

  ('Bachelor of Medicine and Surgery (MBBS)', 'mbbs', 'The foundational medical degree required to practice as a doctor. Covers human anatomy, physiology, pathology, and clinical rotations across major hospital departments.', '5.5 Years (incl. Internship)', '10+2 with PCB, NEET qualified', 'Undergraduate Degree'),

  ('Master of Business Administration (MBA)', 'mba', 'A postgraduate degree focused on leadership, management, finance, and strategy. Transforms engineers and graduates into business leaders. IIM MBA is the gold standard.', '2 Years', 'Any Bachelors degree, CAT/GMAT required', 'Postgraduate Degree'),

  ('Bachelor of Commerce (B.Com)', 'bcom', 'A versatile commerce degree covering accounting, taxation, business law, and economics. A common entry point for students pursuing CA, CS or MBA.', '3 Years', '10+2 with Commerce stream preferred', 'Undergraduate Degree'),

  ('Bachelor of Science in Data Science', 'bsc-data-science', 'An emerging undergraduate program that covers statistics, Python, machine learning, and AI. Offered by IITs, BITS and leading private universities.', '3-4 Years', '10+2 with Mathematics, 60%+ marks', 'Undergraduate Degree'),

  ('Bachelor of Design (B.Des)', 'bdes', 'A creative undergraduate program covering product design, graphic design, or UX/UI design. Offered by NID, NID-affiliated colleges, and IITs.', '4 Years', '10+2 any stream, Design Aptitude Test required', 'Undergraduate Degree'),

  ('Chartered Accountancy (CA)', 'chartered-accountancy', 'One of India's most prestigious professional qualifications by ICAI. Split into Foundation, Intermediate, and Final levels with articleship training.', '4-5 Years', '10+2 for Foundation / Graduation for Direct Entry', 'Professional Certification'),

  ('B.Arch (Bachelor of Architecture)', 'barch', 'A 5-year professional degree required to become a licensed architect in India. Combines studio design work, technical knowledge, and historical studies.', '5 Years', '10+2 with Mathematics, NATA qualified', 'Undergraduate Degree')

ON CONFLICT (slug) DO NOTHING;

-- ==================
-- EXAMS
-- ==================
INSERT INTO exams (name, slug, full_form, level, mode, description, syllabus)
VALUES
  ('JEE Main', 'jee-main', 'Joint Entrance Examination - Main', 'National', 'Online CBT', 'The gateway examination for admission to NITs, IIITs, and other centrally funded technical institutions. JEE Main score is also the eligibility criteria for JEE Advanced.', 'Physics: Mechanics, Thermodynamics, Optics, Modern Physics
Chemistry: Physical, Organic, Inorganic Chemistry
Mathematics: Algebra, Calculus, Coordinate Geometry, Trigonometry'),

  ('JEE Advanced', 'jee-advanced', 'Joint Entrance Examination - Advanced', 'National', 'Online CBT', 'The most competitive engineering entrance exam in India, conducted by IITs for admission to the prestigious IITs. Only top 2.5 lakh JEE Main qualifiers are eligible.', 'Physics, Chemistry, Mathematics at a deeper conceptual level than JEE Main. Focus on multi-concept problems and application-based questions.'),

  ('NEET UG', 'neet-ug', 'National Eligibility cum Entrance Test - Undergraduate', 'National', 'Offline OMR', 'The single national entrance test for admission to MBBS, BDS, AYUSH, and other undergraduate medical programs across India. Managed by NTA.', 'Physics: 20% of paper
Chemistry: 20% of paper
Biology (Botany + Zoology): 60% of paper
Based on NCERT syllabus of Class 11 and 12'),

  ('CAT', 'cat', 'Common Admission Test', 'National', 'Online CBT', 'The premier MBA entrance examination for admission to IIMs and 1200+ B-schools across India. Conducted annually by one of the IIMs on a rotating basis.', 'Verbal Ability & Reading Comprehension (VARC)
Data Interpretation & Logical Reasoning (DILR)
Quantitative Ability (QA)
Score valid for 1 year'),

  ('UPSC CSE', 'upsc-cse', 'UPSC Civil Services Examination', 'National', 'Offline (Written) + Interview', 'India''s toughest competitive exam, conducted by UPSC annually to recruit IAS, IPS, IFS, and other allied services officers. A three-stage process: Prelims, Mains, and Interview.', 'Prelims: General Studies Paper I + CSAT
Mains: 9 papers including General Studies, Essay, Optional Subject
Interview: Personality Test (275 marks)'),

  ('GATE', 'gate', 'Graduate Aptitude Test in Engineering', 'National', 'Online CBT', 'Conducted jointly by IISc and IITs for admission to M.Tech and Ph.D programs. GATE score is also used for recruitment by PSUs like BHEL, ONGC, NTPC, and more.', 'General Aptitude (15 marks)
Subject-specific paper based on B.Tech stream
Engineering Mathematics (optional for some papers)'),

  ('NATA', 'nata', 'National Aptitude Test in Architecture', 'National', 'Online (Part A) + Offline (Part B)', 'The primary entrance examination for B.Arch admission across India, except IITs and NITs. Conducted by COA (Council of Architecture).', 'Part A: Diagrammatic Reasoning, Numerical Reasoning, Verbal Reasoning, Inductive Reasoning
Part B: Drawing test — 3D perception, imagination, architectural awareness')

ON CONFLICT (slug) DO NOTHING;

-- ==================
-- COLLEGES
-- ==================
INSERT INTO colleges (name, slug, location, type, avg_package, top_recruiters, description)
VALUES
  ('Indian Institute of Technology Bombay', 'iit-bombay', 'Mumbai, Maharashtra', 'Central University (IIT)', '₹28 LPA (Average)', 'Microsoft, Google, Goldman Sachs, DE Shaw, McKinsey', 'IIT Bombay is consistently ranked among the top 2 engineering institutes in India. Known for its world-class research, vibrant campus life, and exceptional placement record. Offers B.Tech, M.Tech, M.Sc, and Ph.D programs across 16+ departments.'),

  ('Indian Institute of Technology Delhi', 'iit-delhi', 'New Delhi', 'Central University (IIT)', '₹26 LPA (Average)', 'Samsung, Amazon, Qualcomm, BCG, Bain', 'IIT Delhi is the top-ranked engineering institute in India''s capital. Renowned for its cutting-edge research facilities, strong industry connections, and alumni network spanning government. Offers engineering, design, and management programs.'),

  ('All India Institute of Medical Sciences Delhi', 'aiims-delhi', 'New Delhi', 'Central University (Medical)', '₹12 LPA (Average)', 'Central Government Hospitals, Private Hospitals, Research Institutions', 'AIIMS Delhi is the crown jewel of medical education in India. The most sought-after medical institution, with the highest cut-off for NEET. Graduates are known across the world for clinical excellence and groundbreaking research.'),

  ('Indian Institute of Management Ahmedabad', 'iim-ahmedabad', 'Ahmedabad, Gujarat', 'Central University (IIM)', '₹35 LPA (Average CTC)', 'McKinsey, BCG, Bain, Goldman Sachs, Amazon', 'IIMA is India''s top business school and globally recognized. The PGP (MBA) program at IIMA is among the most selective in the world. Boasts a legendary alumni network spanning industry leaders, policymakers, and entrepreneurs.'),

  ('National Institute of Technology Trichy', 'nit-trichy', 'Tiruchirappalli, Tamil Nadu', 'Central University (NIT)', '₹18 LPA (Average)', 'Samsung, Qualcomm, TCS, Infosys, Texas Instruments', 'NIT Trichy is the top-ranked NIT in India. Offers exceptional engineering education across disciplines including CSE, ECE, Mechanical, and Civil. Known for its strong alumni network and high placement record for Tier-1 companies.'),

  ('Delhi University (DU)', 'delhi-university', 'New Delhi', 'Central University', '₹8 LPA (Average)', 'Big 4 Firms, Media Companies, Government, Startups', 'Delhi University is one of the most prestigious central universities in India, renowned for its undergraduate programs in humanities, commerce, and science. Colleges like SRCC, Hindu, and Lady Shri Ram are highly coveted.'),

  ('Christ University', 'christ-university', 'Bengaluru, Karnataka', 'Deemed University', '₹6 LPA (Average)', 'Accenture, Wipro, Capgemini, Startups, Media', 'A leading deemed university in South India known for its diverse academic programs in law, management, science, and arts. Strong focus on holistic development, with active research centers and a multicultural student community.'),

  ('Manipal Institute of Technology', 'manipal-institute-of-technology', 'Manipal, Karnataka', 'Deemed University', '₹14 LPA (Average)', 'Amazon, Microsoft, Infosys, Cognizant, HDFC', 'MIT Manipal is one of India''s top private engineering institutes, part of the prestigious Manipal Academy of Higher Education. Exceptional placement record and strong industry collaborations make it a top choice outside IITs/NITs.')

ON CONFLICT (slug) DO NOTHING;
