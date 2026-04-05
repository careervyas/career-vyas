# Career Vyas — Content Blueprints & JSON Schemas

This file defines the standard blueprint for each content type plus the exact JSON structure
that maps to the Supabase schema. Claude should read the relevant section during Step 2.

---

## CONTENT TYPE 1: Career Profile

### Priority Matrix

| Priority | Sections |
|----------|----------|
| HIGH (must-have) | hero_stats, overview, is_right_for_you, how_to_become, eligibility, roles_responsibilities, salary_insights, entrance_exams, recommended_courses |
| MED (high-impact) | career_progression, day_in_life, skills_required, working_environment, related_careers |
| LOW (supplementary) | expert_tips, faqs, mentor_cta |

### JSON Schema — career_profile

```json
{
  "id": "uuid | auto",
  "slug": "string | e.g. ias-officer",
  "name": "string | e.g. IAS Officer",
  "category": "string | e.g. Government / Civil Services",
  "work_type": "string | enum: Field, Desk, Mixed",
  "industry": "string | e.g. Public Administration",
  "sector": "string | enum: Government, Private, Both",

  "hero_stats": {
    "avg_salary_entry_lpa": "number | e.g. 8.5",
    "avg_salary_mid_lpa": "number",
    "avg_salary_senior_lpa": "number",
    "demand_level": "string | enum: High, Medium, Low",
    "difficulty_level": "string | enum: Very High, High, Medium, Low",
    "avg_years_to_entry": "number | years from graduation to first role"
  },

  "overview": {
    "summary": "string | 2-3 sentence description",
    "what_they_do": "string | clear one-liner",
    "field_or_desk": "string | brief description of work nature"
  },

  "is_right_for_you": {
    "ideal_traits": ["string"],
    "pros": ["string"],
    "cons": ["string"],
    "not_for_you_if": ["string"]
  },

  "how_to_become": [
    {
      "step": "number",
      "title": "string",
      "description": "string",
      "typical_duration": "string | e.g. 3-4 years"
    }
  ],

  "eligibility": {
    "min_qualification": "string",
    "age_min": "number",
    "age_max": "number",
    "age_relaxations": [
      { "category": "string", "upper_age": "number", "max_attempts": "number | null if unlimited" }
    ],
    "nationality": "string",
    "other_requirements": ["string"]
  },

  "skills_required": {
    "hard_skills": [{ "skill": "string", "importance": "string | High/Medium/Low" }],
    "soft_skills": [{ "skill": "string", "importance": "string" }]
  },

  "roles_responsibilities": ["string"],

  "working_environment": {
    "primary_setting": "string | e.g. Office + Field",
    "work_hours_per_week": "string | e.g. 50-60",
    "travel_required": "boolean",
    "posting_nature": "string | e.g. Pan-India transfers every 3-5 years"
  },

  "career_progression": [
    {
      "level": "string | e.g. SDO / SDM",
      "typical_years_experience": "string | e.g. 0-5 years",
      "salary_lpa": "number",
      "key_responsibilities": "string"
    }
  ],

  "day_in_the_life": {
    "morning": "string",
    "afternoon": "string",
    "evening": "string",
    "sample_tasks": ["string"]
  },

  "salary_insights": {
    "entry_lpa": "number",
    "mid_lpa": "number",
    "senior_lpa": "number",
    "govt_vs_private_note": "string | null if only one sector",
    "allowances_perks": ["string"],
    "top_paying_states": ["string"]
  },

  "entrance_exams": [
    {
      "exam_name": "string",
      "conducting_body": "string",
      "level": "string | National/State",
      "slug": "string | link to exam_profile"
    }
  ],

  "recommended_courses": [
    {
      "course_name": "string",
      "duration": "string",
      "slug": "string | link to course_profile"
    }
  ],

  "related_careers": [
    {
      "name": "string",
      "similarity_note": "string",
      "slug": "string"
    }
  ],

  "expert_tips": ["string"],

  "faqs": [
    { "question": "string", "answer": "string" }
  ],

  "data_quality": {
    "completeness_pct": "number | 0-100",
    "gaps_remaining": ["string | field names that are null"],
    "sources": ["string | URL or source name"],
    "last_processed": "string | ISO date"
  }
}
```

---

## CONTENT TYPE 2: Exam Profile

### Priority Matrix

| Priority | Sections |
|----------|----------|
| HIGH | hero_stats, overview, important_dates, eligibility, exam_pattern, cutoffs, participating_colleges |
| MED | subject_weightage, syllabus_highlights, prep_resources, previous_papers, result_counselling |
| LOW | related_exams, faqs, college_predictor_note |

### JSON Schema — exam_profile

```json
{
  "id": "uuid | auto",
  "slug": "string | e.g. wbjee",
  "name": "string | e.g. WBJEE",
  "full_name": "string | e.g. West Bengal Joint Entrance Examination",
  "conducting_body": "string",
  "level": "string | enum: National, State, University",
  "frequency": "string | e.g. Once a year",
  "mode": "string | enum: Online, Offline, Both",
  "medium": ["string | e.g. English, Bengali"],
  "official_website": "string | URL",
  "courses_covered": ["string | e.g. B.Tech, B.Pharm"],

  "hero_stats": {
    "total_applicants_approx": "number | e.g. 100000",
    "total_seats_approx": "number",
    "difficulty_level": "string | enum: Very High, High, Medium, Low",
    "acceptance_rate_pct": "number | null if unknown"
  },

  "important_dates": {
    "registration_start": "string | YYYY-MM-DD or 'Typically April'",
    "registration_end": "string",
    "application_correction_window": "string | null if not available",
    "admit_card_release": "string",
    "exam_date": "string",
    "result_date": "string",
    "counselling_start": "string"
  },

  "eligibility": {
    "nationality": "string",
    "age_min": "number",
    "age_max": "number | null if no upper limit",
    "qualification": "string | e.g. 10+2 with PCM",
    "min_percentage": "number | e.g. 45",
    "subjects_required": ["string"],
    "special_conditions": ["string | e.g. age limit for Marine Engineering"]
  },

  "exam_pattern": {
    "total_duration_minutes": "number",
    "total_questions": "number",
    "total_marks": "number",
    "papers": [
      {
        "paper_name": "string | e.g. Paper 1 - Mathematics",
        "subjects": ["string"],
        "questions": "number",
        "marks": "number",
        "duration_minutes": "number"
      }
    ],
    "question_types": [
      {
        "category": "string | e.g. Category I",
        "type": "string | e.g. Single correct MCQ",
        "marks_correct": "number",
        "marks_wrong": "number | negative value e.g. -0.25"
      }
    ],
    "negative_marking": "boolean"
  },

  "subject_weightage": [
    {
      "subject": "string",
      "weightage_pct": "number",
      "high_priority_chapters": ["string"]
    }
  ],

  "syllabus_highlights": [
    {
      "subject": "string",
      "key_topics": ["string"],
      "syllabus_pdf_url": "string | null"
    }
  ],

  "cutoffs": {
    "note": "string | e.g. Rank-based, varies by college and category",
    "year": "number | most recent year available",
    "by_category": [
      {
        "category": "string | e.g. General",
        "opening_rank": "number | null",
        "closing_rank": "number | null"
      }
    ],
    "by_college": [
      {
        "college_name": "string",
        "course": "string",
        "category": "string",
        "closing_rank": "number"
      }
    ]
  },

  "prep_resources": {
    "recommended_books": [
      { "title": "string", "subject": "string", "author": "string | null" }
    ],
    "study_plan_note": "string | brief guidance e.g. 6-month plan overview",
    "mock_test_sources": ["string | URL or platform name"]
  },

  "previous_papers": [
    {
      "year": "number",
      "download_url": "string | null",
      "answer_key_url": "string | null"
    }
  ],

  "result_counselling": {
    "result_process": "string",
    "counselling_authority": "string | e.g. WBJEEB",
    "counselling_rounds": "number",
    "document_checklist": ["string"]
  },

  "participating_colleges": [
    {
      "name": "string",
      "location": "string",
      "type": "string | Govt/Private",
      "seats_approx": "number | null",
      "slug": "string | link to college_profile | null"
    }
  ],

  "related_exams": [
    { "name": "string", "level": "string", "slug": "string" }
  ],

  "faqs": [
    { "question": "string", "answer": "string" }
  ],

  "data_quality": {
    "completeness_pct": "number",
    "gaps_remaining": ["string"],
    "sources": ["string"],
    "last_processed": "string"
  }
}
```

---

## CONTENT TYPE 3: Course Profile

### Priority Matrix

| Priority | Sections |
|----------|----------|
| HIGH | hero_stats, overview, eligibility, semester_syllabus, specializations, top_exams, top_colleges, career_opportunities, salary_insights |
| MED | skills_developed, recruiters, higher_education, scholarships |
| LOW | related_courses, faqs |

### JSON Schema — course_profile

```json
{
  "id": "uuid | auto",
  "slug": "string | e.g. b-pharmacy",
  "name": "string | e.g. B.Pharmacy",
  "full_name": "string | e.g. Bachelor of Pharmacy",
  "degree_type": "string | enum: Certificate, Diploma, UG, PG, Doctoral",
  "duration_years": "number",
  "stream": "string | e.g. Science / Healthcare",
  "mode": "string | enum: Full-time, Part-time, Online, Distance",

  "hero_stats": {
    "avg_fees_min_lpa": "number | annual fees in lakhs",
    "avg_fees_max_lpa": "number",
    "avg_salary_entry_lpa": "number",
    "avg_salary_max_lpa": "number",
    "demand_level": "string | enum: High, Medium, Low",
    "job_growth_pct": "number | YoY % growth | null if unknown"
  },

  "overview": {
    "summary": "string | 2-3 sentences",
    "why_choose": ["string | key reasons, each a short sentence"],
    "govt_job_potential": "string | High/Medium/Low with note"
  },

  "eligibility": {
    "min_qualification": "string | e.g. 10+2",
    "required_subjects": ["string"],
    "min_percentage": "number",
    "age_min": "number | null if no limit",
    "entrance_required": "boolean",
    "lateral_entry": "boolean"
  },

  "specializations": [
    {
      "name": "string | e.g. Pharmaceutical Chemistry",
      "demand_level": "string | High/Medium/Low",
      "career_scope": "string | brief note"
    }
  ],

  "semester_syllabus": [
    {
      "semester": "number | 1-8",
      "core_subjects": ["string"],
      "practical_subjects": ["string | null if none"],
      "electives": ["string | null if none"]
    }
  ],

  "top_entrance_exams": [
    {
      "name": "string",
      "level": "string | National/State",
      "conducting_body": "string",
      "application_window": "string | e.g. Feb-April",
      "slug": "string"
    }
  ],

  "top_colleges": [
    {
      "rank": "number",
      "name": "string",
      "location": "string",
      "avg_fees_lpa": "number | null",
      "avg_package_lpa": "number | null",
      "slug": "string | null"
    }
  ],

  "skills_developed": {
    "technical": ["string"],
    "lab_clinical": ["string"],
    "soft_skills": ["string"],
    "certifications_valued": ["string"]
  },

  "career_opportunities": [
    {
      "job_title": "string",
      "description": "string | 1-2 sentences",
      "avg_salary_lpa": "number",
      "growth_potential": "string | High/Medium/Low"
    }
  ],

  "salary_insights": {
    "entry_lpa": "number",
    "mid_lpa": "number",
    "senior_lpa": "number",
    "govt_vs_private": "string | note on difference",
    "top_paying_roles": ["string"]
  },

  "top_recruiters": [
    {
      "company": "string",
      "sector": "string | e.g. Pharma Manufacturing",
      "roles_hired_for": ["string"],
      "avg_ctc_lpa": "number | null"
    }
  ],

  "higher_education": [
    {
      "course": "string | e.g. M.Pharm",
      "duration": "string",
      "entrance_exam": "string | null",
      "career_uplift": "string | brief note"
    }
  ],

  "scholarships": [
    {
      "name": "string",
      "type": "string | Govt/Merit/Need-based",
      "amount": "string | e.g. Full tuition",
      "eligibility": "string"
    }
  ],

  "related_courses": [
    { "name": "string", "similarity_note": "string", "slug": "string" }
  ],

  "faqs": [
    { "question": "string", "answer": "string" }
  ],

  "data_quality": {
    "completeness_pct": "number",
    "gaps_remaining": ["string"],
    "sources": ["string"],
    "last_processed": "string"
  }
}
```

---

## CONTENT TYPE 4: College Profile

### Priority Matrix

| Priority | Sections |
|----------|----------|
| HIGH | hero_stats, about, rankings, courses_programs, placements, cutoffs |
| MED | admission_process, fee_structure, infrastructure, hostel, scholarships |
| LOW | student_life, faculty, reviews, related_colleges, faqs |

### JSON Schema — college_profile

```json
{
  "id": "uuid | auto",
  "slug": "string | e.g. nit-warangal",
  "name": "string | e.g. National Institute of Technology, Warangal",
  "short_name": "string | e.g. NIT Warangal",
  "type": "string | enum: Central Govt, State Govt, Deemed, Private, Autonomous",
  "affiliation": "string | e.g. Autonomous (Deemed University)",
  "location_city": "string",
  "location_state": "string",
  "campus_size_acres": "number | null",
  "founded_year": "number",
  "official_website": "string | URL",
  "address": "string",
  "google_maps_url": "string | null",

  "hero_stats": {
    "nirf_rank_overall": "number | null",
    "nirf_rank_engineering": "number | null",
    "naac_grade": "string | null | e.g. A++",
    "avg_package_lpa": "number",
    "highest_package_lpa": "number",
    "total_courses": "number",
    "campus_size_acres": "number | null",
    "student_strength": "number | null"
  },

  "about": {
    "description": "string | 3-4 sentences",
    "notable_facts": ["string"],
    "notable_alumni": ["string | null"]
  },

  "rankings": [
    {
      "agency": "string | e.g. NIRF, QS, India Today",
      "category": "string | e.g. Engineering, Overall",
      "rank": "number",
      "year": "number"
    }
  ],

  "accreditations": [
    {
      "body": "string | e.g. NAAC, NBA",
      "status": "string | e.g. A+ grade",
      "valid_until": "string | null"
    }
  ],

  "courses_programs": [
    {
      "degree": "string | e.g. B.Tech, M.Tech, MBA, Ph.D",
      "streams": ["string"],
      "duration_years": "number",
      "total_seats": "number | null",
      "entrance_exam": "string | e.g. JEE Advanced",
      "eligibility_summary": "string",
      "first_year_fees_inr": "number"
    }
  ],

  "admission_process": {
    "authority": "string | e.g. JoSAA / CSAB for B.Tech",
    "steps": ["string"],
    "document_checklist": ["string"],
    "important_dates_note": "string"
  },

  "cutoffs": {
    "year": "number",
    "source": "string | e.g. JoSAA 2024",
    "by_branch": [
      {
        "branch": "string",
        "degree": "string",
        "category": "string | e.g. General",
        "opening_rank": "number",
        "closing_rank": "number"
      }
    ]
  },

  "fee_structure": {
    "note": "string | covers all 4 years or first year only",
    "by_program": [
      {
        "program": "string",
        "annual_tuition_inr": "number",
        "hostel_fees_annual_inr": "number | null",
        "total_annual_inr": "number | null",
        "sc_st_waiver": "boolean | null"
      }
    ]
  },

  "placements": {
    "report_year": "number",
    "source": "string | URL or placement report",
    "students_placed_pct": "number",
    "avg_package_lpa": "number",
    "median_package_lpa": "number | null",
    "highest_package_lpa": "number",
    "highest_package_company": "string | null",
    "top_recruiters": ["string"],
    "sector_split": {
      "core_engineering_pct": "number | null",
      "it_software_pct": "number | null",
      "finance_pct": "number | null",
      "psu_pct": "number | null",
      "higher_studies_pct": "number | null"
    },
    "branch_wise": [
      {
        "branch": "string",
        "placed_pct": "number | null",
        "avg_package_lpa": "number | null"
      }
    ]
  },

  "infrastructure": {
    "labs": ["string | e.g. Advanced Computing Lab"],
    "library": "string | brief description",
    "sports_facilities": ["string"],
    "medical_centre": "boolean",
    "canteen_cafeteria": "boolean",
    "auditorium": "boolean"
  },

  "hostel": {
    "available": "boolean",
    "boys_hostels": "number | count",
    "girls_hostels": "number | count",
    "capacity_students": "number | null",
    "annual_fees_inr": "number | null",
    "facilities": ["string"]
  },

  "scholarships": [
    {
      "name": "string",
      "type": "string | Govt/Institute/External",
      "amount": "string",
      "eligibility": "string"
    }
  ],

  "student_life": {
    "tech_fest": "string | null | e.g. Technozion",
    "cultural_fest": "string | null",
    "clubs": ["string"],
    "nss_ncc": "boolean"
  },

  "faculty": {
    "total_count": "number | null",
    "phd_holders_pct": "number | null",
    "student_faculty_ratio": "string | null | e.g. 15:1"
  },

  "location_access": {
    "nearest_railway_km": "number | null",
    "nearest_railway_name": "string | null",
    "nearest_airport_km": "number | null",
    "nearest_airport_name": "string | null"
  },

  "reviews_summary": {
    "overall_rating": "number | out of 5 | null",
    "academics_rating": "number | null",
    "placements_rating": "number | null",
    "infrastructure_rating": "number | null",
    "student_life_rating": "number | null",
    "review_count": "number | null",
    "source": "string | e.g. Shiksha, CollegeDekho"
  },

  "related_colleges": [
    { "name": "string", "slug": "string", "similarity_note": "string" }
  ],

  "faqs": [
    { "question": "string", "answer": "string" }
  ],

  "data_quality": {
    "completeness_pct": "number",
    "gaps_remaining": ["string"],
    "sources": ["string"],
    "last_processed": "string"
  }
}
```
