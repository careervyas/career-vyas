/**
 * parse-courses.mjs
 * 
 * Header-aware parser for course .docx files.
 * Extracts structured sections: overview, duration, eligibility, syllabus, etc.
 * 
 * Usage: node scripts/parse-courses.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
    slugify, findDocxFiles, extractHtml, extractText, titleFromFilename,
    splitByHeadings, extractLists, stripHtml, findSection, cleanSectionContent,
    extractFieldFromText
} from './parse-utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');
const OUTPUT_DIR = path.join(CONTENT_DIR, 'parsed');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function detectCourseCategory(relativePath) {
    const lower = relativePath.toLowerCase();
    if (/medical/i.test(lower)) return 'Medical';
    if (/arts/i.test(lower)) return 'Arts';
    if (/commerce/i.test(lower)) return 'Commerce';
    if (/non.?medical/i.test(lower)) return 'Non-Medical';
    return 'General';
}

function detectCourseType(title) {
    const lower = title.toLowerCase();
    if (/^b\.?tech|^be\b|^bsc|^ba\b|^b\.?com|^b\.?arch|^bds|^mbbs|^b\.?pharm|^bpt|^bums|^bams|^llb|^bca|^bba|^bfm/i.test(lower)) return 'Undergraduate Degree';
    if (/^m\.?tech|^m\.?sc|^mba|^ma\b|^m\.?com|^m\.?des|^md\b|^ms\b|^mca/i.test(lower)) return 'Postgraduate Degree';
    if (/^phd|^doctorate/i.test(lower)) return 'Doctorate';
    if (/diploma|certificate/i.test(lower)) return 'Diploma / Certificate';
    if (/^ca\b|^cs\b|^cma\b|chartered/i.test(lower)) return 'Professional Certification';
    return 'Undergraduate Degree';
}

async function parseCourses() {
    const dir = path.join(CONTENT_DIR, 'App Content 2', 'Courses');
    console.log(`\n📚 Parsing courses (header-aware)...`);
    
    const courses = [];
    const seen = new Set();
    const files = findDocxFiles(dir);
    
    for (const file of files) {
        const relativePath = path.relative(dir, file);
        const title = titleFromFilename(path.basename(file));
        const slug = slugify(title);
        
        if (seen.has(slug) || !title || title.length < 3) continue;
        if (title.match(/^(General|docx)/i)) continue;
        seen.add(slug);
        
        const html = await extractHtml(file);
        const text = await extractText(file);
        if (!html && !text) continue;
        
        console.log(`  📄 ${title}`);
        
        const sections = splitByHeadings(html);
        const category = detectCourseCategory(relativePath);
        
        // Overview
        const overviewSection = findSection(sections, 'overview', 'what is', 'introduction', 'about');
        const introSection = sections.find(s => s.heading === '__intro__');
        let overview = cleanSectionContent(overviewSection) || '';
        if (!overview && introSection) {
            overview = stripHtml(introSection.content).substring(0, 1000);
        }
        
        // Description (first meaningful paragraph)
        const descLines = (overview || text).split('\n').filter(l => l.trim().length > 20);
        const description = descLines.length > 0 ? descLines[0].substring(0, 500) : '';
        
        // Duration
        const durationSection = findSection(sections, 'duration');
        let duration = cleanSectionContent(durationSection);
        if (!duration) duration = extractFieldFromText(text, 'duration', 'years', 'course duration', 'course length');
        
        // Eligibility
        const eligSection = findSection(sections, 'eligibility', 'qualification', 'requirement', 'admission criteria');
        let eligibility = cleanSectionContent(eligSection);
        if (!eligibility) eligibility = extractFieldFromText(text, 'eligibility', 'qualification', 'requirement', 'admission');
        
        // Syllabus
        const syllSection = findSection(sections, 'syllabus', 'curriculum', 'subjects', 'course structure');
        const syllabus = cleanSectionContent(syllSection);
        
        // Career Prospects
        const careerSection = findSection(sections, 'career', 'job', 'scope', 'placement', 'employment', 'future');
        const careerProspects = cleanSectionContent(careerSection);
        
        // Top Colleges
        const collegeSection = findSection(sections, 'college', 'institute', 'university', 'top college', 'best college');
        let topColleges = cleanSectionContent(collegeSection);
        if (collegeSection) {
            const collegeList = extractLists(collegeSection.content);
            if (collegeList.length > 0) {
                topColleges = collegeList.join(', ');
            }
        }
        
        // Entrance Exams
        const examSection = findSection(sections, 'entrance', 'exam', 'admission test');
        let entranceExams = cleanSectionContent(examSection);
        if (!entranceExams) entranceExams = extractFieldFromText(text, 'entrance exam', 'admission test', 'JEE', 'NEET');
        
        // Fee range
        const feeSection = findSection(sections, 'fee', 'tuition', 'cost');
        let feeRange = cleanSectionContent(feeSection);
        if (!feeRange) feeRange = extractFieldFromText(text, 'fee', 'tuition', 'cost');
        
        // Specializations
        const specSection = findSection(sections, 'specializ', 'branch', 'stream');
        let specializations = [];
        if (specSection) {
            specializations = extractLists(specSection.content).slice(0, 20);
        }
        
        courses.push({
            title,
            slug,
            type: detectCourseType(title),
            category,
            description: description.substring(0, 500),
            overview: overview?.substring(0, 3000) || null,
            duration: duration?.substring(0, 200) || null,
            eligibility: eligibility?.substring(0, 1000) || null,
            syllabus: syllabus?.substring(0, 3000) || null,
            career_prospects: careerProspects?.substring(0, 3000) || null,
            top_colleges: topColleges?.substring(0, 2000) || null,
            entrance_exams: entranceExams?.substring(0, 1000) || null,
            fee_range: feeRange?.substring(0, 300) || null,
            specializations,
            details: text.substring(0, 5000),
            full_content: text,
        });
    }
    
    console.log(`\n  ✅ Parsed ${courses.length} unique courses`);
    fs.writeFileSync(path.join(OUTPUT_DIR, 'courses.json'), JSON.stringify(courses, null, 2));
    return courses;
}

parseCourses().catch(console.error);
