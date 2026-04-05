-- ============================================================
-- Career Vyas — Supabase Schema Migration
-- Elevates existing tables to support the full blueprint
-- Run in Supabase SQL Editor
-- ============================================================

-- DROP existing tables safely to recreate them with the new JSONB layout
DROP TABLE IF EXISTS career_profiles CASCADE;
DROP TABLE IF EXISTS exam_profiles CASCADE;
DROP TABLE IF EXISTS course_profiles CASCADE;
DROP TABLE IF EXISTS college_profiles CASCADE;
DROP TABLE IF EXISTS processing_log CASCADE;

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLE 1: career_profiles
-- ============================================================
create table if not exists career_profiles (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  category text,
  work_type text check (work_type in ('Field', 'Desk', 'Mixed')),
  industry text,
  sector text check (sector in ('Government', 'Private', 'Both')),

  -- Hero stats (most-searched quick facts)
  hero_stats jsonb default '{}',
  /*
  hero_stats shape:
  {
    "avg_salary_entry_lpa": 8.5,
    "avg_salary_mid_lpa": 14.0,
    "avg_salary_senior_lpa": 22.0,
    "demand_level": "High",
    "difficulty_level": "Very High",
    "avg_years_to_entry": 3
  }
  */

  overview jsonb default '{}',
  is_right_for_you jsonb default '{}',
  how_to_become jsonb default '[]',   -- array of step objects
  eligibility jsonb default '{}',
  skills_required jsonb default '{}',
  roles_responsibilities jsonb default '[]',
  working_environment jsonb default '{}',
  career_progression jsonb default '[]',
  day_in_the_life jsonb default '{}',
  salary_insights jsonb default '{}',
  entrance_exams jsonb default '[]',
  recommended_courses jsonb default '[]',
  related_careers jsonb default '[]',
  expert_tips jsonb default '[]',
  faqs jsonb default '[]',

  -- Data quality tracking
  data_quality jsonb default '{"completeness_pct": 0, "gaps_remaining": [], "sources": []}',

  -- Metadata
  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for career_profiles
create index if not exists idx_career_profiles_slug on career_profiles(slug);
create index if not exists idx_career_profiles_sector on career_profiles(sector);
create index if not exists idx_career_profiles_completeness
  on career_profiles(((data_quality->>'completeness_pct')::int));

-- ============================================================
-- TABLE 2: exam_profiles
-- ============================================================
create table if not exists exam_profiles (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  full_name text,
  conducting_body text,
  level text check (level in ('National', 'State', 'University', 'Institute')),
  frequency text,
  mode text check (mode in ('Online', 'Offline', 'Both')),
  medium jsonb default '[]',           -- array of languages
  official_website text,
  courses_covered jsonb default '[]',  -- array of course names

  hero_stats jsonb default '{}',
  /*
  hero_stats shape:
  {
    "total_applicants_approx": 100000,
    "total_seats_approx": 25000,
    "difficulty_level": "High",
    "acceptance_rate_pct": 25
  }
  */

  important_dates jsonb default '{}',
  eligibility jsonb default '{}',
  exam_pattern jsonb default '{}',
  subject_weightage jsonb default '[]',
  syllabus_highlights jsonb default '[]',
  cutoffs jsonb default '{}',
  prep_resources jsonb default '{}',
  previous_papers jsonb default '[]',
  result_counselling jsonb default '{}',
  participating_colleges jsonb default '[]',
  related_exams jsonb default '[]',
  faqs jsonb default '[]',

  data_quality jsonb default '{"completeness_pct": 0, "gaps_remaining": [], "sources": []}',

  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_exam_profiles_slug on exam_profiles(slug);
create index if not exists idx_exam_profiles_level on exam_profiles(level);
create index if not exists idx_exam_profiles_completeness
  on exam_profiles(((data_quality->>'completeness_pct')::int));

-- ============================================================
-- TABLE 3: course_profiles
-- ============================================================
create table if not exists course_profiles (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  full_name text,
  degree_type text check (degree_type in ('Certificate', 'Diploma', 'UG', 'PG', 'Doctoral', 'Integrated')),
  duration_years numeric(3,1),
  stream text,
  mode text check (mode in ('Full-time', 'Part-time', 'Online', 'Distance')),

  hero_stats jsonb default '{}',
  /*
  hero_stats shape:
  {
    "avg_fees_min_lpa": 0.4,
    "avg_fees_max_lpa": 2.0,
    "avg_salary_entry_lpa": 2.5,
    "avg_salary_max_lpa": 6.0,
    "demand_level": "High",
    "job_growth_pct": 12
  }
  */

  overview jsonb default '{}',
  eligibility jsonb default '{}',
  specializations jsonb default '[]',
  semester_syllabus jsonb default '[]',
  top_entrance_exams jsonb default '[]',
  top_colleges jsonb default '[]',
  skills_developed jsonb default '{}',
  career_opportunities jsonb default '[]',
  salary_insights jsonb default '{}',
  top_recruiters jsonb default '[]',
  higher_education jsonb default '[]',
  scholarships jsonb default '[]',
  related_courses jsonb default '[]',
  faqs jsonb default '[]',

  data_quality jsonb default '{"completeness_pct": 0, "gaps_remaining": [], "sources": []}',

  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_course_profiles_slug on course_profiles(slug);
create index if not exists idx_course_profiles_degree_type on course_profiles(degree_type);
create index if not exists idx_course_profiles_completeness
  on course_profiles(((data_quality->>'completeness_pct')::int));

-- ============================================================
-- TABLE 4: college_profiles
-- ============================================================
create table if not exists college_profiles (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  short_name text,
  type text check (type in ('Central Govt', 'State Govt', 'Deemed', 'Private', 'Autonomous')),
  affiliation text,
  location_city text,
  location_state text,
  campus_size_acres numeric(8,2),
  founded_year smallint,
  official_website text,
  address text,
  google_maps_url text,

  hero_stats jsonb default '{}',
  /*
  hero_stats shape:
  {
    "nirf_rank_overall": null,
    "nirf_rank_engineering": 18,
    "naac_grade": "A++",
    "avg_package_lpa": 14.5,
    "highest_package_lpa": 52.0,
    "total_courses": 45,
    "campus_size_acres": 248,
    "student_strength": 5000
  }
  */

  about jsonb default '{}',
  rankings jsonb default '[]',
  accreditations jsonb default '[]',
  courses_programs jsonb default '[]',
  admission_process jsonb default '{}',
  cutoffs jsonb default '{}',
  fee_structure jsonb default '{}',
  placements jsonb default '{}',
  infrastructure jsonb default '{}',
  hostel jsonb default '{}',
  scholarships jsonb default '[]',
  student_life jsonb default '{}',
  faculty jsonb default '{}',
  location_access jsonb default '{}',
  reviews_summary jsonb default '{}',
  related_colleges jsonb default '[]',
  faqs jsonb default '[]',

  data_quality jsonb default '{"completeness_pct": 0, "gaps_remaining": [], "sources": []}',

  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_college_profiles_slug on college_profiles(slug);
create index if not exists idx_college_profiles_state on college_profiles(location_state);
create index if not exists idx_college_profiles_type on college_profiles(type);
create index if not exists idx_college_profiles_nirf
  on college_profiles(((hero_stats->>'nirf_rank_engineering')::int));
create index if not exists idx_college_profiles_completeness
  on college_profiles(((data_quality->>'completeness_pct')::int));

-- ============================================================
-- HELPER TABLE: processing_log
-- Tracks batch processing runs for auditability
-- ============================================================
create table if not exists processing_log (
  id uuid primary key default uuid_generate_v4(),
  content_type text check (content_type in ('career_profile', 'exam_profile', 'course_profile', 'college_profile')),
  entity_slug text,
  source_file text,
  status text check (status in ('success', 'partial', 'failed')),
  completeness_before int,
  completeness_after int,
  gaps_filled jsonb default '[]',
  gaps_remaining jsonb default '[]',
  sources_used jsonb default '[]',
  error_message text,
  processed_at timestamptz default now()
);

create index if not exists idx_processing_log_type on processing_log(content_type);
create index if not exists idx_processing_log_status on processing_log(status);

-- ============================================================
-- FUNCTIONS: Updated_at auto-trigger
-- ============================================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_career_profiles_updated
  before update on career_profiles
  for each row execute function update_updated_at();

create trigger trg_exam_profiles_updated
  before update on exam_profiles
  for each row execute function update_updated_at();

create trigger trg_course_profiles_updated
  before update on course_profiles
  for each row execute function update_updated_at();

create trigger trg_college_profiles_updated
  before update on college_profiles
  for each row execute function update_updated_at();

-- ============================================================
-- VIEWS: Useful for analytics and editorial dashboard
-- ============================================================

-- Content completeness overview
create or replace view content_completeness_overview as
select
  'career_profile' as content_type,
  count(*) as total,
  count(*) filter (where (data_quality->>'completeness_pct')::int >= 80) as high_quality,
  count(*) filter (where (data_quality->>'completeness_pct')::int between 50 and 79) as medium_quality,
  count(*) filter (where (data_quality->>'completeness_pct')::int < 50) as low_quality,
  round(avg((data_quality->>'completeness_pct')::int), 1) as avg_completeness
from career_profiles
union all
select
  'exam_profile',
  count(*),
  count(*) filter (where (data_quality->>'completeness_pct')::int >= 80),
  count(*) filter (where (data_quality->>'completeness_pct')::int between 50 and 79),
  count(*) filter (where (data_quality->>'completeness_pct')::int < 50),
  round(avg((data_quality->>'completeness_pct')::int), 1)
from exam_profiles
union all
select
  'course_profile',
  count(*),
  count(*) filter (where (data_quality->>'completeness_pct')::int >= 80),
  count(*) filter (where (data_quality->>'completeness_pct')::int between 50 and 79),
  count(*) filter (where (data_quality->>'completeness_pct')::int < 50),
  round(avg((data_quality->>'completeness_pct')::int), 1)
from course_profiles
union all
select
  'college_profile',
  count(*),
  count(*) filter (where (data_quality->>'completeness_pct')::int >= 80),
  count(*) filter (where (data_quality->>'completeness_pct')::int between 50 and 79),
  count(*) filter (where (data_quality->>'completeness_pct')::int < 50),
  round(avg((data_quality->>'completeness_pct')::int), 1)
from college_profiles;

-- ============================================================
-- ROW LEVEL SECURITY (enable after confirming schema)
-- ============================================================
-- alter table career_profiles enable row level security;
-- alter table exam_profiles enable row level security;
-- alter table course_profiles enable row level security;
-- alter table college_profiles enable row level security;

-- Public read policy (uncomment when ready)
-- create policy "Public read access" on career_profiles for select using (is_published = true);
-- (repeat for other tables)
