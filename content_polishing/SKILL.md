---
name: career-vyas-content
description: >
  Use this skill whenever working on Career Vyas platform content — processing, upgrading,
  backfilling, or restructuring any of the 4 content types: Career Profiles, Exam Profiles,
  Course Profiles, and College Profiles. Triggers on: "process content", "backfill",
  "upgrade content", "restructure docx", "update db", "fill gaps", "content pipeline",
  "refine career vyas", or any mention of Career Vyas content quality improvement.
  This skill standardises existing content against the Career Vyas blueprint, web-searches
  for missing data, and outputs a Supabase-ready JSON payload.
compatibility: pandoc, supabase-py, web_search tool, python 3.10+
---

# Career Vyas Content Processing Skill

## What This Skill Does

Takes an existing Career Vyas content piece (docx file or raw text), restructures it
against the 4-type blueprint standard, identifies data gaps, fills them via targeted web
search, and outputs a validated JSON payload ready for Supabase upsert.

**Four content types supported:**
- `career_profile` — e.g. IAS Officer, Software Engineer, CA
- `exam_profile`   — e.g. WBJEE, JEE Main, UPSC CSE, NEET
- `course_profile` — e.g. B.Pharmacy, B.Tech CSE, MBA
- `college_profile`— e.g. NIT Warangal, IIT Bombay, BITS Pilani

---

## Step 0 — Detect Content Type

Read the file or content. Determine type from:
- Filename prefix/keywords (WBJEE → exam, IAS → career, NIT → college, B.Pharm → course)
- Document title / first heading
- Key phrases: "entrance examination" → exam; "founded in" + "campus" → college;
  "undergraduate programme" + "duration" → course; "roles and responsibilities" → career

Set `CONTENT_TYPE` to one of: `career_profile`, `exam_profile`, `course_profile`, `college_profile`

---

## Step 1 — Parse Existing Content

```bash
pandoc "$FILE" -t markdown --wrap=none 2>/dev/null
```

Extract all text content. Build a `CURRENT_SECTIONS` map of what the file already covers.
Do NOT discard any existing content — preserve and restructure it.

---

## Step 2 — Load Blueprint for Detected Type

Read the relevant section from `references/blueprints.md`.

Each blueprint defines:
- Required sections (Priority: HIGH)
- High-impact sections (Priority: MED)
- Supplementary sections (Priority: LOW)
- JSON field name + expected data type for each section

---

## Step 3 — Gap Analysis

Compare `CURRENT_SECTIONS` against the blueprint.
Build a `GAPS` list: fields in the blueprint that are missing, empty, or low-quality in the
current content.

Quality signals that indicate a gap even if section exists:
- Salary data missing or only 1 data point
- Dates listed without a year (e.g. "July 2022" but no 2023/2024 data)
- College list without fees or ranks
- Career section with no progression path
- Exam section with no cutoff data

Prioritise gaps: fill HIGH-priority gaps first, then MED, then LOW if time allows.

---

## Step 4 — Web Search Gap Filling

For each item in `GAPS`, construct a targeted search query using the templates in
`references/search-strategies.md`. Run searches using the web_search tool.

**Search discipline:**
- Use the entity name + specific data point (e.g. "NIT Warangal NIRF rank 2024")
- Cross-reference at least 2 sources for numerical data (salary, rank, cutoff, package)
- Prefer official sources: NIRF.org, nta.ac.in, official college websites, UPSC.gov.in
- For salary data: AmbitionBox, Glassdoor, PayScale, LinkedIn Salary Insights
- For placement data: Official college placement reports or NIRF data
- For cutoff data: JoSAA, official counselling portals, Shiksha, CollegeDekho
- Always note the source URL and year for every filled data point

**Do not hallucinate.** If a data point cannot be found via search after 2 attempts,
set it to `null` and flag it in `data_quality.gaps_remaining`.

---

## Step 5 — Assemble Structured JSON

Using the JSON schema defined in `references/blueprints.md` for the detected content type,
assemble the complete structured payload. Rules:

- Map existing content to the correct fields
- Insert web-searched data into the appropriate fields
- All text should be clean prose (no markdown bullets from the original docx unless it's a list field)
- Salary figures always in INR LPA (e.g. 4.5 means 4.5 LPA)
- Dates in ISO format where possible, or `"YYYY-MM-DD"` string
- Arrays must have at least 1 item or be `null` (not `[]`)
- Include `data_quality` object with: `completeness_pct`, `gaps_remaining[]`, `sources[]`

---

## Step 6 — Output

Return:

1. **Structured JSON** — Supabase-ready payload (see schema in `references/blueprints.md`)
2. **Gap report** — what was filled, what remains null, sources used
3. **SQL upsert snippet** — ready to run against Supabase (use the schema from `references/supabase-schema.sql`)

---

## Batch Processing

For processing 200+ files at once, use `scripts/batch_processor.py`.
It handles: file discovery, type detection, sequential processing, progress tracking,
error recovery, and final summary report. See the script for CLI usage.

---

## Reference Files

| File | When to Read |
|------|-------------|
| `references/blueprints.md` | Always — has JSON schema for all 4 types |
| `references/search-strategies.md` | During Step 4 — search query templates per gap type |
| `references/supabase-schema.sql` | When generating SQL output or setting up the DB |

---

## Quality Bar

A processed content piece is considered complete when:
- `data_quality.completeness_pct >= 80` for college/exam profiles
- `data_quality.completeness_pct >= 70` for career/course profiles
- All HIGH-priority fields are non-null
- At least 3 sources are documented
- FAQs section has at least 5 entries
