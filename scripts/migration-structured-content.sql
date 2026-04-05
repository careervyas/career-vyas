-- Career Vyas: Schema Migration for Structured Content
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- ─── COLLEGES ────────────────────────────────────────────
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS campus_size text;
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS map_link text;
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS ranking text;
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS courses_offered jsonb DEFAULT '[]';
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS fee_structure jsonb;
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS hostel_info text;
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS campus_facilities text;
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS placement_stats jsonb;

-- ─── CAREER PROFILES ────────────────────────────────────
ALTER TABLE career_profiles ADD COLUMN IF NOT EXISTS overview text;
ALTER TABLE career_profiles ADD COLUMN IF NOT EXISTS roles_responsibilities text;
ALTER TABLE career_profiles ADD COLUMN IF NOT EXISTS benefits text;
ALTER TABLE career_profiles ADD COLUMN IF NOT EXISTS how_to_become text;
ALTER TABLE career_profiles ADD COLUMN IF NOT EXISTS eligibility text;
ALTER TABLE career_profiles ADD COLUMN IF NOT EXISTS skills_needed jsonb DEFAULT '[]';
ALTER TABLE career_profiles ADD COLUMN IF NOT EXISTS top_companies jsonb DEFAULT '[]';

-- ─── COURSES ─────────────────────────────────────────────
ALTER TABLE courses ADD COLUMN IF NOT EXISTS overview text;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS syllabus text;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS career_prospects text;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS top_colleges text;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS entrance_exams text;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS fee_range text;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS specializations jsonb DEFAULT '[]';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS details text;

-- ─── EXAMS ───────────────────────────────────────────────
ALTER TABLE exams ADD COLUMN IF NOT EXISTS mode text DEFAULT 'Online CBT';
ALTER TABLE exams ADD COLUMN IF NOT EXISTS category text DEFAULT 'Competitive';
ALTER TABLE exams ADD COLUMN IF NOT EXISTS overview text;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS eligibility text;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS exam_pattern text;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS important_dates text;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS preparation_tips text;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS accepting_colleges text;

-- ─── CONTENT RELATIONSHIPS ──────────────────────────────
ALTER TABLE content_relationships ADD COLUMN IF NOT EXISTS target_slug text;
ALTER TABLE content_relationships ADD COLUMN IF NOT EXISTS source_slug text;
ALTER TABLE content_relationships ADD COLUMN IF NOT EXISTS relationship_type text;
