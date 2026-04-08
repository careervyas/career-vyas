import os
import re
import json
import logging
import argparse
import subprocess
from pathlib import Path
from pydantic import BaseModel, Field

from google import genai
from google.genai import types

from dotenv import load_dotenv

load_dotenv(dotenv_path=".env.local")
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler()
    ]
)
log = logging.getLogger(__name__)

# --- Pydantic Schemas based on new_layout.docx ---

class CareerSchema(BaseModel):
    name: str = Field(description="Name of the career profile")
    overview: str = Field(description="An overview of career profile including roles and responsibilities")
    benefits: str = Field(description="Benefits of choosing this profile as a career")
    procedure_to_approach: str = Field(description="A basic procedure to approach this job")
    eligibilities_and_skills: str = Field(description="Eligibilities & skill requirements & their working environment")
    entrance_exams: str = Field(description="Entrance exams to follow the route")
    course_descriptions: str = Field(description="Course description with their expenses (12th and Graduation)")
    top_institutions: str = Field(description="Top institutions to pursue the course")
    specialisations: str = Field(description="Type of specialisation available under this job profile")
    pay_scales: str = Field(description="Pay-Scales as per the experience")
    promotions_upgradings: str = Field(description="Promotions & upgradings")
    top_recruiting_agencies: str = Field(description="Top recruiting agencies for this profile")
    demands_future_scope: str = Field(description="Demands & Future Scope")
    inspiring_personalities: str = Field(description="Top inspiring personalities who have also followed this profile")

class CourseSchema(BaseModel):
    name: str = Field(description="What is the course?")
    overview: str = Field(description="Overview/Highlights of this Course")
    difference_similar_courses: str = Field(description="Difference between the courses (if there are any similar courses)")
    streams_fields: str = Field(description="Streams/Fields of the course")
    why_study: str = Field(description="Why should you study?? / opt for this course??")
    career_opportunities: str = Field(description="Career opportunities after graduating this course")
    further_studies: str = Field(description="What we can do in further/Higher after studying this course")
    salary_packages: str = Field(description="Entry-level salary packages & average salary packages for newly graduates")
    popular_entrance_exams: str = Field(description="Popular entrance exams to get admission in this Course")
    top_colleges: str = Field(description="List of top colleges in India related to this course")

class ExamSchema(BaseModel):
    name: str = Field(description="Name of the Exam")
    about: str = Field(description="About the exam")
    overview_highlights: str = Field(description="Overview/Highlights of this exam (particulars, full name, conducting authority, etc.)")
    eligibility_criteria: str = Field(description="Eligibility criteria for this exam")
    paper_pattern_marking: str = Field(description="Paper pattern & marking scheme of the examination")
    seats_and_participating_colls: str = Field(description="Available seats & participating institutions in the exam")
    important_events_dates: str = Field(description="Important events & their dates related to exam")
    application_process: str = Field(description="Exam Application process")
    selection_procedure: str = Field(description="Selection procedure of the exam")

class CollegeSchema(BaseModel):
    name: str = Field(description="NAME OF THE COLLEGE")
    description: str = Field(description="College description")
    important_information: str = Field(description="Important information regarding the institute (Location, Map, Size, Reach)")
    courses_offered: str = Field(description="Courses offered by the institute with Eligibility and Streams")
    fee_structure: str = Field(description="Fee structure course wise and year wise")
    student_hostel_details: str = Field(description="Student Hostel details")
    campus_facilities: str = Field(description="Campus facilities (Library, Canteen, Sports, etc.)")
    extracurricular_activities: str = Field(description="Extracurricular activity (clubs, fests)")
    placement_statistics: str = Field(description="Placement statistics")


TYPE_SIGNALS = {
    "Career":  ["career profile", "ias", "ips", "doctor", "engineer", "ca ", "lawyer"],
    "Course":  ["b.tech", "b.pharmacy", "b.com", "mba", "m.tech", "bca", "bsc", "course duration"],
    "Exam":    ["jee", "neet", "upsc", "wbjee", "mht-cet", "gate", "cat ", "entrance exam", "exam conducting"],
    "College": ["national institute", "iit ", "nit ", "bits ", "college", "university", "campus size", "nirf", "placement"]
}

SCHEMA_MAP = {
    "Career": CareerSchema,
    "Course": CourseSchema,
    "Exam": ExamSchema,
    "College": CollegeSchema
}

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

def detect_content_type(filename: str, content_preview: str) -> str:
    combined = (filename + " " + content_preview[:300]).lower()
    scores = {}
    for ct, signals in TYPE_SIGNALS.items():
        scores[ct] = sum(1 for s in signals if s.lower() in combined)
    best = max(scores, key=scores.get)
    return best if scores[best] > 0 else "Career" # Default to career

def backfill_with_gemini(raw_content: str, content_type: str, filename: str) -> dict:
    project_id = os.environ.get("GOOGLE_PROJECT_ID", "auto-jobs-488719")
    credentials_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS", "google-credentials.json")
    api_key = os.environ.get("GEMINI_API_KEY")

    if os.path.exists(credentials_path):
        client = genai.Client(vertexai=True, project=project_id, location="us-central1")
    elif api_key:
        client = genai.Client(api_key=api_key)
    else:
        log.error("No Gemini credentials found.")
        return {}

    system_instruction = f"""You are a content editor for Career Vyas. 
You are processing a {content_type} document named '{filename}'.
Your job is to read the raw content and extract information to strictly match the requested JSON schema.
If any required information from the schema is missing in the raw content, DO PROACTIVE WEB RESEARCH / Backfill the unavailable information with your world knowledge to fulfill the specific fields exactly as requested by the schema. Do not leave any fields empty or null.
"""
    user_prompt = f"Raw Content:\n---\n{raw_content[:40000]}\n---\nExtract and backfill the content."

    try:
        response = client.models.generate_content(
            model="models/gemini-2.5-pro",
            contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.7,
                response_schema=SCHEMA_MAP[content_type],
                response_mime_type="application/json",
            )
        )
        if response.text:
            return json.loads(response.text)
    except Exception as e:
        log.error(f"Gemini API error for {filename}: {e}")
    return {}

def main():
    parser = argparse.ArgumentParser(description="Backfill missing content using Gemini and new layout template.")
    parser.add_argument("--input-dir", type=str, default="./content/App Content", help="Input directory")
    parser.add_argument("--output-dir", type=str, default="./content/new_parsed", help="Output directory")
    parser.add_argument("--limit", type=int, default=5, help="Number of files to process")
    
    args = parser.parse_args()
    
    input_dir = Path(args.input_dir)
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    files = list(input_dir.glob("**/*.docx"))[:args.limit]
    log.info(f"Going to process {len(files)} files")
    
    for docx_file in files:
        log.info(f"Processing {docx_file.name}")
        raw_md = docx_to_markdown(docx_file)
        if not raw_md:
            raw_md = "NO CONTENT"

        content_type = detect_content_type(docx_file.name, raw_md)
        
        # Save parsed data
        category_dir = output_dir / content_type
        category_dir.mkdir(parents=True, exist_ok=True)
        out_file = category_dir / f"{docx_file.stem}.json"
        
        if out_file.exists():
            log.info(f"Skipping {docx_file.name}, already exists")
            continue
            
        data = backfill_with_gemini(raw_md, content_type, docx_file.name)
        if data:
            with open(out_file, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=4, ensure_ascii=False)
            log.info(f"Successfully backfilled and saved: {out_file.name}")
            
            # Upsert into Supabase new_layout_data column
            try:
                from supabase import create_client
                url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
                key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
                if url and key:
                    sb = create_client(url, key)
                    slug = docx_file.stem.lower().replace(" ", "-")
                    slug = __import__("re").sub(r"[^a-z0-9]+", "-", slug).strip("-")
                    table_name = "career_profiles"
                    if content_type == "Course": table_name = "course_profiles"
                    elif content_type == "Exam": table_name = "exam_profiles"
                    elif content_type == "College": table_name = "college_profiles"
                    
                    sb.table(table_name).upsert({
                        "slug": slug,
                        "name": data.get("name", docx_file.stem),
                        "new_layout_data": data
                    }, on_conflict="slug").execute()
                    log.info(f"Upserted new_layout_data for {slug} into {table_name}")
                else:
                    log.warning("Supabase credentials missing, skipping DB upsert.")
            except Exception as e:
                log.error(f"Failed to upsert to Supabase: {e}")
        else:
            log.error(f"Failed to generate data for {docx_file.name}")

if __name__ == "__main__":
    main()
