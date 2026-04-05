/**
 * parse-exams.mjs
 * 
 * Header-aware parser for exam .docx files.
 * Extracts structured sections: pattern, syllabus, eligibility, dates, etc.
 * 
 * Usage: node scripts/parse-exams.mjs
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

function extractFullForm(text, title) {
    const match = text.match(/\(([A-Z][^)]{5,80})\)/);
    if (match) return match[1];
    const standsFor = text.match(new RegExp(`${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*[-–:]\\s*(.{10,100})`, 'i'));
    if (standsFor) return standsFor[1].trim();
    return title;
}

function detectExamCategory(title, relativePath) {
    const lower = (title + ' ' + relativePath).toLowerCase();
    if (/board|cbse|icse/i.test(lower)) return 'Board';
    if (/olympiad|ntse|nsej/i.test(lower)) return 'Olympiad';
    if (/bank|ibps|sbi|rbi|niacl/i.test(lower)) return 'Banking';
    if (/ssc|upsc|civil|rpf|rrb|railway/i.test(lower)) return 'Government';
    if (/bsf|crpf|itbp|ssb|army|navy|coast guard|defence|assam rifle|border/i.test(lower)) return 'Defence';
    if (/nursing|nurse|anm|gnm/i.test(lower)) return 'Nursing';
    if (/jee|neet|gate|cat|nata|ceed|upsee|wbjee|cucet/i.test(lower)) return 'Competitive';
    if (/psc|jssc|osssc|upsssc/i.test(lower)) return 'State Government';
    return 'Competitive';
}

function detectExamLevel(title, text) {
    const lower = (title + ' ' + text.substring(0, 300)).toLowerCase();
    if (/state|psc|jssc|osssc|upsssc|kerala|jharkhand|chattisgarh|uttrakhand|rajasthan/i.test(lower)) return 'State';
    if (/international|iso|ieo|iio|ioel|ieso/i.test(lower)) return 'International';
    return 'National';
}

async function parseExams() {
    const dir = path.join(CONTENT_DIR, 'App Content 2', 'Exams');
    console.log(`\n📝 Parsing exams (header-aware)...`);
    
    const exams = [];
    const seen = new Set();
    
    const topItems = fs.readdirSync(dir);
    for (const item of topItems) {
        if (item.startsWith('.')) continue;
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        let file = null;
        let title = '';
        
        if (!stat.isDirectory() && item.endsWith('.docx') && !item.startsWith('~$')) {
            file = fullPath;
            title = titleFromFilename(item);
        } else if (stat.isDirectory()) {
            title = titleFromFilename(item.replace(/\s*$/, ''));
            // Find the main .docx inside (skip PYQ/Syllabus subdirs)
            const docxFiles = findDocxFiles(fullPath).filter(f => {
                const rel = path.relative(fullPath, f);
                return !rel.toLowerCase().includes('pyq') && !rel.toLowerCase().includes('syllabus');
            });
            if (docxFiles.length > 0) file = docxFiles[0];
        }
        
        if (!title || title.length < 2) continue;
        const slug = slugify(title);
        if (seen.has(slug)) continue;
        seen.add(slug);
        
        let html = '';
        let text = '';
        if (file) {
            html = await extractHtml(file);
            text = await extractText(file);
        }
        
        if (!html && !text) {
            // Create a minimal entry
            exams.push({
                name: title,
                slug,
                full_form: title,
                level: detectExamLevel(title, ''),
                mode: 'Online CBT',
                category: detectExamCategory(title, item),
                overview: `Information about the ${title} exam.`,
                description: `Information about the ${title} exam.`,
                eligibility: null,
                exam_pattern: null,
                syllabus: null,
                important_dates: null,
                preparation_tips: null,
                accepting_colleges: null,
                full_content: '',
            });
            continue;
        }
        
        console.log(`  📄 ${title}`);
        
        const sections = splitByHeadings(html);
        
        // Overview
        const overviewSection = findSection(sections, 'overview', 'what is', 'introduction', 'about');
        const introSection = sections.find(s => s.heading === '__intro__');
        let overview = cleanSectionContent(overviewSection) || '';
        if (!overview && introSection) {
            overview = stripHtml(introSection.content).substring(0, 1000);
        }
        
        // Description (first meaningful paragraph)
        const descLines = (overview || text).split('\n').filter(l => l.trim().length > 20);
        const description = descLines.length > 0 ? descLines[0].substring(0, 500) : `Information about the ${title} exam.`;
        
        // Eligibility
        const eligSection = findSection(sections, 'eligibility', 'qualification', 'who can apply', 'age limit');
        let eligibility = cleanSectionContent(eligSection);
        if (!eligibility) eligibility = extractFieldFromText(text, 'eligibility', 'qualification', 'who can apply');
        
        // Exam Pattern
        const patternSection = findSection(sections, 'exam pattern', 'pattern', 'structure', 'marking scheme', 'paper pattern');
        const examPattern = cleanSectionContent(patternSection);
        
        // Syllabus
        const syllSection = findSection(sections, 'syllabus', 'subjects', 'topics', 'curriculum');
        const syllabus = cleanSectionContent(syllSection);
        
        // Important Dates
        const datesSection = findSection(sections, 'important date', 'date', 'schedule', 'timeline', 'when');
        const importantDates = cleanSectionContent(datesSection);
        
        // Preparation Tips
        const prepSection = findSection(sections, 'preparation', 'tips', 'how to prepare', 'strategy', 'books');
        const preparationTips = cleanSectionContent(prepSection);
        
        // Accepting Colleges
        const collegeSection = findSection(sections, 'college', 'institute', 'participating', 'accept');
        let acceptingColleges = cleanSectionContent(collegeSection);
        if (collegeSection) {
            const collegeList = extractLists(collegeSection.content);
            if (collegeList.length > 0) {
                acceptingColleges = collegeList.join(', ');
            }
        }
        
        // Mode
        let mode = extractFieldFromText(text, 'mode', 'examination mode', 'exam mode') || 'Online CBT';
        
        exams.push({
            name: title,
            slug,
            full_form: extractFullForm(text, title),
            level: detectExamLevel(title, text),
            mode: mode.substring(0, 100),
            category: detectExamCategory(title, item),
            overview: overview?.substring(0, 3000) || null,
            description: description.substring(0, 500),
            eligibility: eligibility?.substring(0, 2000) || null,
            exam_pattern: examPattern?.substring(0, 3000) || null,
            syllabus: syllabus?.substring(0, 3000) || null,
            important_dates: importantDates?.substring(0, 1000) || null,
            preparation_tips: preparationTips?.substring(0, 3000) || null,
            accepting_colleges: acceptingColleges?.substring(0, 2000) || null,
            full_content: text,
        });
    }
    
    console.log(`\n  ✅ Parsed ${exams.length} unique exams`);
    fs.writeFileSync(path.join(OUTPUT_DIR, 'exams.json'), JSON.stringify(exams, null, 2));
    return exams;
}

parseExams().catch(console.error);
