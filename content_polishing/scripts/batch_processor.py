#!/usr/bin/env python3
"""
Career Vyas — Batch Content Processor
Processes 200+ docx files through the Career Vyas content skill,
backfills missing data via Anthropic API + web search,
and upserts the result into Supabase.

Usage:
  python batch_processor.py --input-dir ./docx_files --type auto --limit 10
  python batch_processor.py --input-dir ./colleges --type college_profile --dry-run
  python batch_processor.py --resume --from-log ./output/run_log.json

Requirements:
  pip install anthropic supabase python-dotenv pandoc-python tqdm
  pandoc must be installed system-wide (pandoc.org)

Environment variables (.env.local):
  OPENAI_API_KEY=sk-proj-...
  NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
  SUPABASE_SERVICE_ROLE_KEY=eyJ...
"""

import os
import re
import json
import time
import argparse
import subprocess
import logging
from datetime import datetime
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv

load_dotenv(dotenv_path=".env.local")
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("processor.log"),
        logging.StreamHandler()
    ]
)
log = logging.getLogger(__name__)


# ─── Configuration ────────────────────────────────────────────────────────────

CONTENT_TYPES = ["career_profile", "exam_profile", "course_profile", "college_profile"]

# Keywords that signal each content type from filename / first 200 chars of content
TYPE_SIGNALS = {
    "career_profile":  ["career profile", "ias", "ips", "doctor", "engineer", "ca ", "lawyer",
                        "roles and responsibilities", "how to become"],
    "exam_profile":    ["jee", "neet", "upsc", "wbjee", "mht-cet", "gate", "cat ", "entrance exam",
                        "exam conducting", "paper pattern", "marking scheme"],
    "course_profile":  ["b.tech", "b.pharmacy", "b.com", "mba", "m.tech", "bca", "bsc",
                        "undergraduate programme", "course duration", "semester"],
    "college_profile": ["national institute", "iit ", "nit ", "bits ", "college", "university",
                        "founded in", "campus size", "nirf", "placement", "hostel"]
}

# Completeness weights — fields are weighted by importance
HIGH_PRIORITY_FIELDS = {
    "career_profile":  ["hero_stats", "overview", "eligibility", "roles_responsibilities",
                        "salary_insights", "entrance_exams", "how_to_become"],
    "exam_profile":    ["hero_stats", "important_dates", "eligibility", "exam_pattern",
                        "cutoffs", "participating_colleges"],
    "course_profile":  ["hero_stats", "overview", "eligibility", "semester_syllabus",
                        "career_opportunities", "salary_insights", "top_colleges"],
    "college_profile": ["hero_stats", "rankings", "placements", "cutoffs",
                        "courses_programs", "fee_structure"]
}


# ─── Utilities ────────────────────────────────────────────────────────────────

def docx_to_markdown(path: Path) -> str:
    """Convert a docx to markdown using pandoc."""
    try:
        result = subprocess.run(
            ["pandoc", str(path), "-t", "markdown", "--wrap=none"],
            capture_output=True, text=True, timeout=30
        )
        return result.stdout
    except Exception as e:
        log.error(f"pandoc failed for {path}: {e}")
        return ""


def detect_content_type(filename: str, content_preview: str) -> Optional[str]:
    """Detect content type from filename + first 300 chars of content."""
    combined = (filename + " " + content_preview[:300]).lower()
    scores = {}
    for ct, signals in TYPE_SIGNALS.items():
        scores[ct] = sum(1 for s in signals if s.lower() in combined)
    best = max(scores, key=scores.get)
    return best if scores[best] > 0 else None


def slug_from_filename(filename: str) -> str:
    """Create a URL-safe slug from filename."""
    name = Path(filename).stem
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    # Remove common noise prefixes like "4__", "B-_"
    slug = re.sub(r"^\d+[-_]+", "", slug)
    return slug


def compute_completeness(payload: dict, content_type: str) -> int:
    """Estimate completeness percentage based on non-null HIGH priority fields."""
    high = HIGH_PRIORITY_FIELDS.get(content_type, [])
    all_fields = list(payload.keys())
    # Exclude meta fields
    data_fields = [f for f in all_fields if f not in
                   ("id", "slug", "name", "created_at", "updated_at", "is_published", "data_quality")]

    high_score = sum(1 for f in high if payload.get(f) not in (None, {}, [], ""))
    other_fields = [f for f in data_fields if f not in high]
    other_score = sum(1 for f in other_fields if payload.get(f) not in (None, {}, [], ""))

    if not data_fields:
        return 0

    # High priority fields worth 2x
    weighted = (high_score * 2 + other_score) / (len(high) * 2 + len(other_fields)) * 100
    return min(100, round(weighted))


# ─── Claude API Call ─────────────────────────────────────────────────────────

def process_with_claude(
    content_type: str,
    slug: str,
    entity_name: str,
    raw_content: str,
    skill_instructions: str
) -> dict:
    """
    Send the raw content to Claude with skill instructions.
    Returns a parsed JSON payload ready for Supabase.
    """
    import openai
    
    # Load keys from the correct variables in .env.local
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        log.error("GEMINI_API_KEY not found in environment")
        return {}

    client = openai.OpenAI(base_url="https://generativelanguage.googleapis.com/v1beta/openai/", api_key=api_key)

    system_prompt = f"""You are a Career Vyas content editor following the career-vyas-content skill.

{skill_instructions}

Your task: process the provided raw content for a {content_type.replace("_", " ")}.
Return ONLY a valid JSON object matching the schema — no markdown, no commentary, no code fences.
The JSON must be complete enough to upsert into Supabase.

Rules:
- entity slug: "{slug}"
- entity name: "{entity_name}"
- Use web_search tool to fill any HIGH-priority gaps before responding
- Set null for fields you cannot find after searching
- Include data_quality.completeness_pct, data_quality.gaps_remaining, data_quality.sources
- data_quality.last_processed: "{datetime.now().isoformat()}"
"""

    user_prompt = f"""Process this {content_type.replace("_", " ")} content:

--- RAW CONTENT START ---
{raw_content[:12000]}
--- RAW CONTENT END ---

Return the complete structured JSON payload for this {content_type}.
"""

    try:
        response = client.chat.completions.create(
            model="gemini-2.5-flash",
            temperature=0.2,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        )

        text = response.choices[0].message.content
        if not text:
            return {}

        # Strip any accidental markdown code fences just in case
        text = re.sub(r"```(?:json)?\s*", "", text).strip("` \n")

        return json.loads(text)

    except json.JSONDecodeError as e:
        log.error(f"JSON parse failed for {slug}: {e}")
        return {}
    except Exception as e:
        log.error(f"Claude API error for {slug}: {e}")
        return {}


# ─── Supabase Upsert ─────────────────────────────────────────────────────────

def upsert_to_supabase(content_type: str, payload: dict) -> bool:
    """Upsert a processed payload into the correct Supabase table."""
    from supabase import create_client

    table_map = {
        "career_profile":  "career_profiles",
        "exam_profile":    "exam_profiles",
        "course_profile":  "course_profiles",
        "college_profile": "college_profiles"
    }

    url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    if not url or not key:
        log.warning("Supabase credentials not set — skipping upsert")
        return False

    try:
        sb = create_client(url, key)
        table = table_map[content_type]
        result = sb.table(table).upsert(payload, on_conflict="slug").execute()
        log.info(f"Upserted {payload.get('slug')} into {table}")
        return True
    except Exception as e:
        log.error(f"Supabase upsert failed for {payload.get('slug')}: {e}")
        return False


def log_to_supabase(entry: dict, dry_run: bool = False):
    """Write to processing_log table."""
    if dry_run:
        return
    try:
        from supabase import create_client
        sb = create_client(os.environ["NEXT_PUBLIC_SUPABASE_URL"], os.environ["SUPABASE_SERVICE_ROLE_KEY"])
        sb.table("processing_log").insert(entry).execute()
    except Exception:
        pass  # Non-critical


# ─── Load Skill Instructions ─────────────────────────────────────────────────

def load_skill_instructions() -> str:
    """Load SKILL.md and blueprint reference into a single prompt string."""
    skill_dir = Path(__file__).parent.parent
    parts = []

    skill_md = skill_dir / "SKILL.md"
    if skill_md.exists():
        parts.append("=== SKILL INSTRUCTIONS ===\n" + skill_md.read_text())

    blueprints = skill_dir / "references" / "blueprints.md"
    if blueprints.exists():
        parts.append("=== BLUEPRINTS & JSON SCHEMA ===\n" + blueprints.read_text())

    searches = skill_dir / "references" / "search-strategies.md"
    if searches.exists():
        parts.append("=== SEARCH STRATEGIES ===\n" + searches.read_text())

    return "\n\n".join(parts)


# ─── Main Processor ───────────────────────────────────────────────────────────

def process_file(
    filepath: Path,
    content_type: str,
    skill_instructions: str,
    dry_run: bool = False,
    output_dir: Optional[Path] = None
) -> dict:
    """Process a single docx file. Returns a log entry."""
    start_ts = datetime.now().isoformat()
    slug = slug_from_filename(filepath.name)

    log.info(f"Processing: {filepath.name} → {content_type} ({slug})")

    # Parse docx
    raw = docx_to_markdown(filepath)
    if not raw:
        return {"status": "failed", "slug": slug, "error": "pandoc returned empty"}

    # Detect entity name from first heading or filename
    name_match = re.search(r"^#+ (.+)", raw, re.MULTILINE)
    entity_name = name_match.group(1).strip() if name_match else slug.replace("-", " ").title()

    # Measure before-state (approximate — count non-empty sections)
    completeness_before = 20  # rough baseline for existing content

    # Call Claude with skill
    payload = process_with_claude(
        content_type, slug, entity_name, raw, skill_instructions
    )

    if not payload:
        log_entry = {
            "content_type": content_type,
            "entity_slug": slug,
            "source_file": filepath.name,
            "status": "failed",
            "completeness_before": completeness_before,
            "completeness_after": 0,
            "gaps_filled": [],
            "gaps_remaining": ["all"],
            "sources_used": [],
            "processed_at": start_ts
        }
        log_to_supabase(log_entry, dry_run)
        return log_entry

    # Ensure required fields
    payload.setdefault("slug", slug)
    payload.setdefault("name", entity_name)

    completeness_after = compute_completeness(payload, content_type)
    dq = payload.get("data_quality", {})
    dq["completeness_pct"] = completeness_after

    # Save JSON output
    if output_dir:
        output_dir.mkdir(parents=True, exist_ok=True)
        out_file = output_dir / f"{slug}.json"
        out_file.write_text(json.dumps(payload, indent=2, ensure_ascii=False))
        log.info(f"Saved: {out_file}")

    # Upsert to Supabase
    if not dry_run:
        upsert_to_supabase(content_type, payload)

    log_entry = {
        "content_type": content_type,
        "entity_slug": slug,
        "source_file": filepath.name,
        "status": "success",
        "completeness_before": completeness_before,
        "completeness_after": completeness_after,
        "gaps_filled": [],  # could diff before/after keys
        "gaps_remaining": dq.get("gaps_remaining", []),
        "sources_used": dq.get("sources", []),
        "processed_at": start_ts
    }
    log_to_supabase(log_entry, dry_run)
    return log_entry


def run_batch(
    input_dir: Path,
    content_type: Optional[str],
    limit: Optional[int],
    dry_run: bool,
    output_dir: Path,
    delay_seconds: float = 3.0
):
    """Process all docx files in input_dir."""
    from tqdm import tqdm

    files = sorted(input_dir.glob("**/*.docx"))
    if limit:
        files = files[:limit]

    log.info(f"Found {len(files)} files to process")
    skill_instructions = load_skill_instructions()

    results = []
    success = failed = partial = 0

    for f in tqdm(files, desc="Processing"):
        # Auto-detect type if not specified
        raw_preview = docx_to_markdown(f)[:300]
        ct = content_type or detect_content_type(f.name, raw_preview)

        if not ct:
            log.warning(f"Could not detect content type for {f.name} — skipping")
            failed += 1
            continue

        result = process_file(
            filepath=f,
            content_type=ct,
            skill_instructions=skill_instructions,
            dry_run=dry_run,
            output_dir=output_dir / ct
        )

        results.append(result)

        if result["status"] == "success":
            if result["completeness_after"] >= 70:
                success += 1
            else:
                partial += 1
        else:
            failed += 1
            log.error(f"Failed to process {f.name}: {result.get('error', 'unknown error')}")

        # Rate limit
        time.sleep(delay_seconds)

    # Write run log
    run_log_path = output_dir / "run_log.json"
    run_log_path.parent.mkdir(parents=True, exist_ok=True)
    run_log_path.write_text(json.dumps({
        "run_at": datetime.now().isoformat(),
        "total": len(files),
        "success": success,
        "partial": partial,
        "failed": failed,
        "avg_completeness": round(
            sum(r.get("completeness_after", 0) for r in results if r["status"] == "success")
            / max(success, 1), 1
        ),
        "results": results
    }, indent=2))

    log.info(f"\n{'='*50}")
    log.info(f"BATCH COMPLETE: {success} success | {partial} partial | {failed} failed")
    log.info(f"Run log: {run_log_path}")


# ─── CLI ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Career Vyas Batch Content Processor"
    )
    parser.add_argument(
        "--input-dir", type=Path, required=True,
        help="Directory containing .docx files"
    )
    parser.add_argument(
        "--type", choices=CONTENT_TYPES + ["auto"], default="auto",
        help="Content type (auto-detect if not specified)"
    )
    parser.add_argument(
        "--output-dir", type=Path, default=Path("./output"),
        help="Directory to save processed JSON files"
    )
    parser.add_argument(
        "--limit", type=int, default=None,
        help="Limit number of files to process (for testing)"
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Process files but do not upsert to Supabase"
    )
    parser.add_argument(
        "--delay", type=float, default=3.0,
        help="Seconds between API calls (rate limit buffer)"
    )

    args = parser.parse_args()

    content_type = None if args.type == "auto" else args.type

    run_batch(
        input_dir=args.input_dir,
        content_type=content_type,
        limit=args.limit,
        dry_run=args.dry_run,
        output_dir=args.output_dir,
        delay_seconds=args.delay
    )
