-- ============================================================
-- SQL Command to add 'new_layout_data' column to all profiles
-- Paste this in Supabase -> SQL Editor -> Run
-- ============================================================

-- Add to careers
ALTER TABLE career_profiles 
ADD COLUMN IF NOT EXISTS new_layout_data JSONB DEFAULT '{}'::jsonb;

-- Add to colleges
ALTER TABLE college_profiles 
ADD COLUMN IF NOT EXISTS new_layout_data JSONB DEFAULT '{}'::jsonb;

-- Add to courses
ALTER TABLE course_profiles 
ADD COLUMN IF NOT EXISTS new_layout_data JSONB DEFAULT '{}'::jsonb;

-- Add to exams
ALTER TABLE exam_profiles 
ADD COLUMN IF NOT EXISTS new_layout_data JSONB DEFAULT '{}'::jsonb;

-- Success Message
SELECT 'Successfully added new_layout_data to all profile tables!' as result;
