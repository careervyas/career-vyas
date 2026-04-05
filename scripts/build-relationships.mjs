/**
 * build-relationships.mjs
 * 
 * Cross-references all 4 parsed JSON files to detect relationships between content types.
 * Outputs content/parsed/relationships.json
 * 
 * Usage: node scripts/build-relationships.mjs
 * (Run AFTER all 4 parsers have been executed)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PARSED_DIR = path.join(ROOT, 'content', 'parsed');

function loadParsed(filename) {
    const filePath = path.join(PARSED_DIR, filename);
    if (!fs.existsSync(filePath)) {
        console.error(`  ❌ Missing ${filename}. Run the corresponding parser first.`);
        return [];
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// Check if text mentions a name (fuzzy matching with word boundaries)
function mentions(text, name) {
    if (!text || !name || name.length < 3) return false;
    const lower = text.toLowerCase();
    const nameLower = name.toLowerCase();
    
    // Exact or substring match
    if (lower.includes(nameLower)) return true;
    
    // For short abbreviations like "JEE", "NEET", "IIT", use word boundary
    if (name.length <= 6) {
        const regex = new RegExp(`\\b${nameLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        return regex.test(text);
    }
    
    return false;
}

function buildRelationships() {
    console.log('\n🔗 Building content relationships...\n');
    
    const careers = loadParsed('careers.json');
    const colleges = loadParsed('colleges.json');
    const courses = loadParsed('courses.json');
    const exams = loadParsed('exams.json');
    
    const relationships = [];
    
    // ─── COLLEGE → COURSE relationships ────────────────────
    console.log('  📌 College → Course...');
    for (const college of colleges) {
        const collegeText = (college.full_content || college.description || '').toLowerCase();
        // Also check courses_offered
        const coursesText = JSON.stringify(college.courses_offered || []).toLowerCase();
        const searchText = collegeText + ' ' + coursesText;
        
        for (const course of courses) {
            if (mentions(searchText, course.title)) {
                relationships.push({
                    source_type: 'college',
                    source_slug: college.slug,
                    target_type: 'course',
                    target_slug: course.slug,
                    relationship: 'offers',
                });
            }
        }
    }
    
    // ─── COLLEGE → EXAM relationships ──────────────────────
    console.log('  📌 College → Exam...');
    for (const college of colleges) {
        const collegeText = (college.full_content || college.description || '');
        const coursesText = JSON.stringify(college.courses_offered || []);
        const searchText = collegeText + ' ' + coursesText;
        
        for (const exam of exams) {
            if (mentions(searchText, exam.name)) {
                relationships.push({
                    source_type: 'college',
                    source_slug: college.slug,
                    target_type: 'exam',
                    target_slug: exam.slug,
                    relationship: 'accepts',
                });
            }
        }
    }
    
    // ─── COURSE → CAREER relationships ─────────────────────
    console.log('  📌 Course → Career...');
    for (const course of courses) {
        const courseText = (course.full_content || course.details || course.description || '');
        
        for (const career of careers) {
            if (mentions(courseText, career.title)) {
                relationships.push({
                    source_type: 'course',
                    source_slug: course.slug,
                    target_type: 'career',
                    target_slug: career.slug,
                    relationship: 'leads_to',
                });
            }
        }
    }
    
    // ─── COURSE → EXAM relationships ───────────────────────
    console.log('  📌 Course → Exam...');
    for (const course of courses) {
        const courseText = (course.full_content || course.details || course.description || '') + ' ' + (course.entrance_exams || '');
        
        for (const exam of exams) {
            if (mentions(courseText, exam.name)) {
                relationships.push({
                    source_type: 'course',
                    source_slug: course.slug,
                    target_type: 'exam',
                    target_slug: exam.slug,
                    relationship: 'requires',
                });
            }
        }
    }
    
    // ─── COURSE → COLLEGE relationships ────────────────────
    console.log('  📌 Course → College...');
    for (const course of courses) {
        const courseText = (course.full_content || course.details || course.description || '') + ' ' + (course.top_colleges || '');
        
        for (const college of colleges) {
            if (mentions(courseText, college.name)) {
                relationships.push({
                    source_type: 'course',
                    source_slug: course.slug,
                    target_type: 'college',
                    target_slug: college.slug,
                    relationship: 'offered_at',
                });
            }
        }
    }
    
    // ─── EXAM → COURSE relationships ───────────────────────
    console.log('  📌 Exam → Course...');
    for (const exam of exams) {
        const examText = (exam.full_content || exam.description || '');
        
        for (const course of courses) {
            if (mentions(examText, course.title)) {
                relationships.push({
                    source_type: 'exam',
                    source_slug: exam.slug,
                    target_type: 'course',
                    target_slug: course.slug,
                    relationship: 'for_admission',
                });
            }
        }
    }
    
    // ─── EXAM → COLLEGE relationships ──────────────────────
    console.log('  📌 Exam → College...');
    for (const exam of exams) {
        const examText = (exam.full_content || exam.description || '') + ' ' + (exam.accepting_colleges || '');
        
        for (const college of colleges) {
            if (mentions(examText, college.name)) {
                relationships.push({
                    source_type: 'exam',
                    source_slug: exam.slug,
                    target_type: 'college',
                    target_slug: college.slug,
                    relationship: 'accepted_by',
                });
            }
        }
    }
    
    // ─── CAREER → COURSE relationships ─────────────────────
    console.log('  📌 Career → Course...');
    for (const career of careers) {
        const careerText = (career.full_content || career.description || '');
        
        for (const course of courses) {
            if (mentions(careerText, course.title)) {
                relationships.push({
                    source_type: 'career',
                    source_slug: career.slug,
                    target_type: 'course',
                    target_slug: course.slug,
                    relationship: 'requires_degree',
                });
            }
        }
    }
    
    // ─── CAREER → EXAM relationships ───────────────────────
    console.log('  📌 Career → Exam...');
    for (const career of careers) {
        const careerText = (career.full_content || career.description || '');
        
        for (const exam of exams) {
            if (mentions(careerText, exam.name)) {
                relationships.push({
                    source_type: 'career',
                    source_slug: career.slug,
                    target_type: 'exam',
                    target_slug: exam.slug,
                    relationship: 'requires_exam',
                });
            }
        }
    }
    
    // Deduplicate
    const unique = [];
    const seen = new Set();
    for (const r of relationships) {
        const key = `${r.source_type}:${r.source_slug}:${r.target_type}:${r.target_slug}`;
        if (!seen.has(key)) {
            seen.add(key);
            unique.push(r);
        }
    }
    
    // Summary
    const summary = {};
    for (const r of unique) {
        const key = `${r.source_type} → ${r.target_type}`;
        summary[key] = (summary[key] || 0) + 1;
    }
    
    console.log(`\n  📊 Relationship Summary:`);
    for (const [key, count] of Object.entries(summary)) {
        console.log(`     ${key}: ${count}`);
    }
    console.log(`\n  ✅ Total unique relationships: ${unique.length}`);
    
    fs.writeFileSync(path.join(PARSED_DIR, 'relationships.json'), JSON.stringify(unique, null, 2));
    return unique;
}

buildRelationships();
