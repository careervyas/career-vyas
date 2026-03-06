-- ============================================================
-- Career Vyas — Quick Seed (2 entries per table)
-- Paste this in Supabase → SQL Editor → Run
-- ============================================================

-- CAREERS
INSERT INTO career_profiles (title, slug, summary, description, icon, salary_range, demand, study_duration)
VALUES
(
  'Software Engineer',
  'software-engineer',
  'Build the digital products that power the modern world.',
  'Software Engineers design, develop, and maintain software systems. From mobile apps to enterprise platforms, they work across the full stack using languages like Python, JavaScript, Java, and more. A career in software offers exceptional growth, remote work opportunities, and high salaries.',
  '💻',
  '₹6L – ₹50L/year',
  'Very High',
  '4 years (B.Tech/B.E.)'
),
(
  'Data Scientist',
  'data-scientist',
  'Turn raw data into insights that drive business decisions.',
  'Data Scientists collect, analyze, and interpret large datasets to help organizations make better decisions. They use statistics, machine learning, and programming (Python/R) to uncover patterns and build predictive models. High demand across fintech, healthcare, and e-commerce.',
  '📊',
  '₹8L – ₹40L/year',
  'Very High',
  '4 years + M.Sc/MBA preferred'
)
ON CONFLICT (slug) DO NOTHING;

-- COURSES
INSERT INTO courses (title, slug, description, type, duration, eligibility)
VALUES
(
  'B.Tech (Computer Science)',
  'btech-computer-science',
  'A 4-year undergraduate engineering degree that covers data structures, algorithms, software development, computer networks, and AI/ML. One of the most sought-after degrees in India with placements at top tech companies.',
  'UG Degree',
  '4 Years',
  '10+2 with PCM, JEE score'
),
(
  'MBA (Master of Business Administration)',
  'mba-master-of-business-administration',
  'A 2-year postgraduate management degree covering marketing, finance, operations, strategy and leadership. Top B-school MBAs from IIMs and ISB open doors to CXO roles, consulting, and investment banking.',
  'PG Degree',
  '2 Years',
  'Graduation in any stream, CAT/GMAT score'
)
ON CONFLICT (slug) DO NOTHING;

-- EXAMS
INSERT INTO exams (name, slug, full_form, description, level)
VALUES
(
  'JEE Advanced',
  'jee-advanced',
  'Joint Entrance Examination Advanced',
  'JEE Advanced is the gateway to IITs (Indian Institutes of Technology) — the most prestigious engineering institutions in India. Only the top 2.5 lakh JEE Main qualifiers can appear. The exam tests deep understanding of Physics, Chemistry, and Mathematics.',
  'National'
),
(
  'CAT',
  'cat',
  'Common Admission Test',
  'CAT is the national-level MBA entrance exam for admission to IIMs and 1000+ top B-schools in India. It tests Verbal Ability, Data Interpretation & Logical Reasoning, and Quantitative Aptitude. Conducted by IIMs annually.',
  'National'
)
ON CONFLICT (slug) DO NOTHING;

-- COLLEGES
INSERT INTO colleges (name, slug, description, type, city, state, ranking)
VALUES
(
  'IIT Bombay',
  'iit-bombay',
  'Indian Institute of Technology Bombay is one of India''s premier engineering institutions, consistently ranked #1 in India. Known for exceptional research, world-class faculty, and placements at top global firms. Located in Mumbai, it offers B.Tech, M.Tech, MBA, and Ph.D programs.',
  'IIT',
  'Mumbai',
  'Maharashtra',
  1
),
(
  'IIM Ahmedabad',
  'iim-ahmedabad',
  'Indian Institute of Management Ahmedabad is Asia''s finest business school and consistently ranks among the world''s top management institutions. The flagship PGP (MBA) program has placement packages averaging ₹35L+. Entry requires a top CAT percentile.',
  'IIM',
  'Ahmedabad',
  'Gujarat',
  1
)
ON CONFLICT (slug) DO NOTHING;

-- MENTORS
INSERT INTO mentors (name, college, expertise, bio, image_url, is_active)
VALUES
(
  'Rahul Mehta',
  'IIT Bombay',
  ARRAY['JEE Preparation', 'Computer Science', 'Software Engineering', 'Career Guidance', 'Tech Interviews'],
  'I cracked JEE Advanced in my first attempt and spent 6 years at Google as a Senior Software Engineer. I now mentor students on JEE preparation, CS career paths, and how to break into top tech companies. I have helped 200+ students get into IITs and land offers at Google, Amazon, and Microsoft.',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul',
  true
),
(
  'Priya Sharma',
  'IIM Ahmedabad',
  ARRAY['CAT Preparation', 'MBA Admissions', 'Career Transition', 'Consulting', 'GD/PI Coaching'],
  'I scored 99.8 percentile in CAT and completed my MBA from IIM Ahmedabad. After 5 years in consulting at McKinsey, I decided to help students navigate the MBA journey — from CAT prep to B-school selection to GD/PI preparation. I have guided 150+ students into top IIMs.',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
  true
);

-- Done!
SELECT 'Seeded: ' || count(*) || ' career(s)' FROM career_profiles
UNION ALL SELECT 'Seeded: ' || count(*) || ' course(s)' FROM courses
UNION ALL SELECT 'Seeded: ' || count(*) || ' exam(s)' FROM exams
UNION ALL SELECT 'Seeded: ' || count(*) || ' college(s)' FROM colleges
UNION ALL SELECT 'Seeded: ' || count(*) || ' mentor(s)' FROM mentors;
