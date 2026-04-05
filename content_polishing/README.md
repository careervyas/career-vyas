# Career Vyas Content Skill — README

This skill package processes your existing 200+ content pieces (Career Profiles,
Exam Profiles, Course Profiles, College Profiles) against the Career Vyas blueprint,
backfills missing data from the web, and outputs Supabase-ready JSON.

---

## Package Structure

```
career-vyas-content/
├── SKILL.md                          ← Claude reads this first (the skill brain)
├── references/
│   ├── blueprints.md                 ← JSON schemas for all 4 content types
│   ├── search-strategies.md          ← Web search query templates per gap type
│   └── supabase-schema.sql           ← Run this in Supabase SQL Editor first
└── scripts/
    └── batch_processor.py            ← Runs the pipeline at scale
```

---

## Setup (One-time)

### 1. Install dependencies
```bash
pip install anthropic supabase python-dotenv tqdm
# On Mac: brew install pandoc
# On Ubuntu: apt install pandoc
```

### 2. Create .env
```
ANTHROPIC_API_KEY=sk-ant-...
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
```

### 3. Run Supabase migration
Copy `references/supabase-schema.sql` and run in your Supabase SQL Editor.
This creates 4 tables + processing_log + completeness views.

---

## Usage

### Process 5 files as a dry-run test
```bash
python scripts/batch_processor.py \
  --input-dir ./your_docx_folder \
  --type auto \
  --limit 5 \
  --dry-run
```
Check `./output/` for the JSON files. Review quality before running at scale.

### Process all college profiles
```bash
python scripts/batch_processor.py \
  --input-dir ./docx/colleges \
  --type college_profile \
  --output-dir ./output \
  --delay 4.0
```

### Process everything (mixed types, auto-detect)
```bash
python scripts/batch_processor.py \
  --input-dir ./docx \
  --type auto \
  --output-dir ./output \
  --delay 3.0
```

---

## What Claude Does Per File

1. Converts docx → markdown via pandoc
2. Detects content type from filename + content signals
3. Reads the matching blueprint from `references/blueprints.md`
4. Maps existing content to blueprint fields
5. Identifies gaps (missing HIGH-priority fields)
6. Runs web searches using templates from `references/search-strategies.md`
7. Assembles complete JSON payload
8. Computes completeness % and documents sources
9. Upserts to Supabase + writes JSON file

---

## Monitoring Progress

After a run, check:
```bash
# JSON output per content type
ls ./output/college_profile/
ls ./output/exam_profile/

# Run summary
cat ./output/run_log.json | python -m json.tool | head -30

# In Supabase: run this query
SELECT * FROM content_completeness_overview;
```

---

## Processing Priority Recommendation

Start with smallest batches first to calibrate quality:

| Phase | Content Type | Est. Files | Suggested Order |
|-------|-------------|------------|----------------|
| 1 | College Profiles | 200+ | First — highest value, most searchable |
| 2 | Exam Profiles | 200+ | Second — dates + cutoffs drive traffic |
| 3 | Course Profiles | 200+ | Third — syllabus fill is high-value |
| 4 | Career Profiles | 200+ | Fourth — most complex, most nuanced |

---

## Quality Targets

| Content Type | Target Completeness |
|-------------|---------------------|
| College Profiles | ≥ 85% |
| Exam Profiles | ≥ 80% |
| Course Profiles | ≥ 75% |
| Career Profiles | ≥ 70% |

---

## Using the Skill Manually (Single File)

When Claude has this skill available, you can also process files conversationally:

> "Process this NIT Warangal docx file using the career-vyas-content skill and
>  give me the Supabase JSON payload"

Claude will follow SKILL.md, read blueprints.md for the schema, use search-strategies.md
for gap filling, and return the complete JSON.
