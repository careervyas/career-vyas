/**
 * parse-content.mjs
 * 
 * Parses all .docx files in the content/ directory into clean JSON.
 * Outputs to content/parsed/ directory with separate files per category.
 * 
 * Usage: node scripts/parse-content.mjs
 */

import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');
const OUTPUT_DIR = path.join(CONTENT_DIR, 'parsed');

// Ensure output directory
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Helper: slugify a string
function slugify(str) {
    return str
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 100);
}

// Helper: recursively find all .docx files in a directory
function findDocxFiles(dir) {
    const results = [];
    if (!fs.existsSync(dir)) return results;
    const items = fs.readdirSync(dir);
    for (const item of items) {
        if (item.startsWith('.')) continue;
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            results.push(...findDocxFiles(fullPath));
        } else if (item.endsWith('.docx') && !item.startsWith('~$')) {
            results.push(fullPath);
        }
    }
    return results;
}

// Extract text from a .docx file (strip images)
async function extractText(filePath) {
    try {
        const result = await mammoth.extractRawText({ path: filePath });
        return result.value.trim();
    } catch (err) {
        console.error(`  ⚠️ Failed to parse: ${path.basename(filePath)} — ${err.message}`);
        return '';
    }
}

// Derive a clean title from filename
function titleFromFilename(filename) {
    return filename
        .replace(/\.docx$/i, '')
        .replace(/^[\d]+[\.\,\s]*/, '')  // Remove leading numbers like "1. ", "10. "
        .replace(/\s*\(\d+\)\s*/g, '')   // Remove "(1)"
        .replace(/-CAREER PROFILE/i, '')
        .replace(/Career Profile[-_ ]*/i, '')
        .replace(/[-_]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

// ─── CAREER PROFILES ────────────────────────────────────
async function parseCareers() {
    const dir = path.join(CONTENT_DIR, 'App Content', 'career profile');
    const files = findDocxFiles(dir);
    console.log(`\n📋 Parsing ${files.length} career profiles...`);
    
    const careers = [];
    const seen = new Set();
    
    for (const file of files) {
        const title = titleFromFilename(path.basename(file));
        const slug = slugify(title);
        
        // Deduplicate (some files have "(1)" copies)
        if (seen.has(slug)) continue;
        seen.add(slug);
        
        const text = await extractText(file);
        if (!text) continue;
        
        // Extract first meaningful paragraph as summary
        const lines = text.split('\n').filter(l => {
            const trimmed = l.trim();
            // Ignore repetitive title headers in the actual text
            if (trimmed.toLowerCase().startsWith('name of the career profile')) return false;
            if (trimmed.toLowerCase().startsWith('career profile:')) return false;
            if (trimmed.toLowerCase() === 'overview') return false;
            if (trimmed.toLowerCase() === 'overview:') return false;
            if (trimmed.toLowerCase() === 'what is ' + title.toLowerCase() + '?') return false;
            return trimmed.length > 30;
        });
        const summary = lines.length > 0 ? lines[0].substring(0, 300) : '';
        
        // Try to detect stream/field from title or content
        const stream = detectStream(title, text);
        
        careers.push({
            title,
            slug,
            icon: detectIcon(title),
            stream,
            summary,
            description: text.substring(0, 5000), // Store first 5000 chars
            full_content: text,
            avg_salary: extractField(text, 'salary', 'average salary', 'pay', 'compensation', 'income'),
            study_duration: extractField(text, 'duration', 'years', 'course duration', 'course length'),
            growth_outlook: extractField(text, 'growth', 'outlook', 'demand', 'job prospects'),
            skills_needed: extractListField(text, 'skills', 'qualifications', 'requirements'),
            top_companies: extractListField(text, 'companies', 'employers', 'recruiters', 'organizations'),
            view_count: 0,
        });
    }
    
    console.log(`  ✅ Parsed ${careers.length} unique career profiles`);
    fs.writeFileSync(path.join(OUTPUT_DIR, 'careers.json'), JSON.stringify(careers, null, 2));
    return careers;
}

// ─── COLLEGES ────────────────────────────────────────────
async function parseColleges() {
    console.log(`\n🏫 Parsing colleges...`);
    
    const colleges = [];
    const seen = new Set();
    
    // Source 1: App Content/Colleges
    const dir1 = path.join(CONTENT_DIR, 'App Content', 'Colleges');
    // Source 2: App Content 2/Colleges
    const dir2 = path.join(CONTENT_DIR, 'App Content 2', 'Colleges');
    
    // Process both directories
    for (const baseDir of [dir1, dir2]) {
        if (!fs.existsSync(baseDir)) continue;
        const files = findDocxFiles(baseDir);
        
        for (const file of files) {
            const relativePath = path.relative(baseDir, file);
            const title = titleFromFilename(path.basename(file));
            const slug = slugify(title);
            
            if (seen.has(slug) || !title || title.length < 3) continue;
            // Skip overview files
            if (title.match(/^(IITs|NITs|Top|Overview)/i)) continue;
            seen.add(slug);
            
            const text = await extractText(file);
            if (!text) continue;
            
            // Determine category from folder path
            const category = detectCollegeCategory(relativePath);
            
            // Determine type from path or text
            const type = detectCollegeType(relativePath, title, text);
            
            // Extract location
            const location = extractField(text, 'location', 'city', 'campus', 'address', 'state') || '';
            
            colleges.push({
                name: title,
                slug,
                location: location.substring(0, 200),
                type,
                category,
                avg_package: extractField(text, 'package', 'average salary', 'placement', 'ctc', 'lpa'),
                top_recruiters: extractField(text, 'recruiters', 'top companies', 'companies', 'placements'),
                description: text.substring(0, 5000),
                full_content: text,
            });
        }
    }
    
    console.log(`  ✅ Parsed ${colleges.length} unique colleges`);
    fs.writeFileSync(path.join(OUTPUT_DIR, 'colleges.json'), JSON.stringify(colleges, null, 2));
    return colleges;
}

// ─── COURSES ─────────────────────────────────────────────
async function parseCourses() {
    const dir = path.join(CONTENT_DIR, 'App Content 2', 'Courses');
    console.log(`\n📚 Parsing courses...`);
    
    const courses = [];
    const seen = new Set();
    const files = findDocxFiles(dir);
    
    for (const file of files) {
        const relativePath = path.relative(dir, file);
        const title = titleFromFilename(path.basename(file));
        const slug = slugify(title);
        
        if (seen.has(slug) || !title || title.length < 3) continue;
        // Skip general overview files 
        if (title.match(/^(General|docx)/i)) continue;
        seen.add(slug);
        
        const text = await extractText(file);
        if (!text) continue;
        
        // Determine category from folder path
        const category = detectCourseCategory(relativePath);
        
        // First meaningful paragraph as description
        const lines = text.split('\n').filter(l => l.trim().length > 20);
        const description = lines.length > 0 ? lines[0].substring(0, 500) : '';
        
        courses.push({
            title,
            slug,
            description,
            duration: extractField(text, 'duration', 'years', 'course duration', 'course length'),
            eligibility: extractField(text, 'eligibility', 'qualification', 'requirement', 'admission'),
            type: detectCourseType(title, category),
            category,
            details: text.substring(0, 5000),
            full_content: text,
        });
    }
    
    console.log(`  ✅ Parsed ${courses.length} unique courses`);
    fs.writeFileSync(path.join(OUTPUT_DIR, 'courses.json'), JSON.stringify(courses, null, 2));
    return courses;
}

// ─── EXAMS ───────────────────────────────────────────────
async function parseExams() {
    const dir = path.join(CONTENT_DIR, 'App Content 2', 'Exams');
    console.log(`\n📝 Parsing exams...`);
    
    const exams = [];
    const seen = new Set();
    
    // 1. Parse all .docx files directly in the Exams directory
    const topItems = fs.readdirSync(dir);
    for (const item of topItems) {
        if (item.startsWith('.')) continue;
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (!stat.isDirectory() && item.endsWith('.docx') && !item.startsWith('~$')) {
            // Direct .docx exam file
            const title = titleFromFilename(item);
            const slug = slugify(title);
            if (seen.has(slug) || !title || title.length < 2) continue;
            seen.add(slug);
            
            const text = await extractText(fullPath);
            if (!text) continue;
            
            const lines = text.split('\n').filter(l => l.trim().length > 20);
            const description = lines.length > 0 ? lines[0].substring(0, 500) : '';
            
            exams.push({
                name: title,
                slug,
                full_form: extractFullForm(text, title),
                level: detectExamLevel(title, text),
                mode: extractField(text, 'mode', 'examination mode', 'exam mode') || 'Online CBT',
                description,
                syllabus: extractField(text, 'syllabus', 'exam pattern', 'pattern', 'subjects'),
                category: detectExamCategory(title, item),
                full_content: text,
            });
        } else if (stat.isDirectory()) {
            // Directory-based exam — folder name is the exam name
            const title = titleFromFilename(item.replace(/\s*$/, '')); // trim trailing spaces
            const slug = slugify(title);
            if (seen.has(slug) || !title || title.length < 2) continue;
            seen.add(slug);
            
            // Try to find a .docx inside 
            const docxFiles = findDocxFiles(fullPath).filter(f => {
                const rel = path.relative(fullPath, f);
                // Only take files at the first level, not PYQ/Syllabus subdirs
                return !rel.toLowerCase().includes('pyq') && !rel.toLowerCase().includes('syllabus');
            });
            
            let text = '';
            if (docxFiles.length > 0) {
                text = await extractText(docxFiles[0]);
            }
            
            const lines = text.split('\n').filter(l => l.trim().length > 20);
            const description = lines.length > 0 ? lines[0].substring(0, 500) : `Information about the ${title} exam.`;
            
            exams.push({
                name: title,
                slug,
                full_form: text ? extractFullForm(text, title) : title,
                level: detectExamLevel(title, text),
                mode: text ? (extractField(text, 'mode', 'examination mode', 'exam mode') || 'Online CBT') : 'Online CBT',
                description,
                syllabus: text ? extractField(text, 'syllabus', 'exam pattern', 'pattern', 'subjects') : null,
                category: detectExamCategory(title, item),
                full_content: text || description,
            });
        }
    }
    
    console.log(`  ✅ Parsed ${exams.length} unique exams`);
    fs.writeFileSync(path.join(OUTPUT_DIR, 'exams.json'), JSON.stringify(exams, null, 2));
    return exams;
}


// ─── FIELD EXTRACTION HELPERS ────────────────────────────

function extractField(text, ...keywords) {
    const lines = text.split('\n');
    for (const line of lines) {
        const lower = line.toLowerCase();
        for (const kw of keywords) {
            if (lower.includes(kw.toLowerCase())) {
                // Try to extract the value part after a colon or dash
                const colonIdx = line.indexOf(':');
                if (colonIdx > -1) {
                    const value = line.substring(colonIdx + 1).trim();
                    if (value.length > 2 && value.length < 120) return value;
                }
                // Or return the whole line if it's informative
                if (line.trim().length > 10 && line.trim().length < 120) {
                    return line.trim();
                }
            }
        }
    }
    return null;
}

function extractListField(text, ...keywords) {
    const field = extractField(text, ...keywords);
    if (!field) return [];
    // Split by commas or semicolons
    return field.split(/[,;]/).map(s => s.trim()).filter(s => s.length > 1).slice(0, 10);
}

function extractFullForm(text, title) {
    // Try to find the full form in parentheses in the text
    const match = text.match(/\(([A-Z][^)]{5,80})\)/);
    if (match) return match[1];
    // Or look for "stands for" pattern
    const standsFor = text.match(new RegExp(`${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*[-–:]\\s*(.{10,100})`, 'i'));
    if (standsFor) return standsFor[1].trim();
    return title;
}

function detectStream(title, text) {
    const lower = (title + ' ' + text.substring(0, 500)).toLowerCase();
    if (/\b(engineer|software|data|tech|computer|it|cyber|ai|machine learning)\b/.test(lower)) return 'Technology';
    if (/\b(doctor|mbbs|medical|surgeon|physician|nurse|pharma|dental|health)\b/.test(lower)) return 'Medicine';
    if (/\b(law|lawyer|advocate|legal|judge)\b/.test(lower)) return 'Law';
    if (/\b(finance|account|ca|chartered|banking|stock|invest|audit)\b/.test(lower)) return 'Finance';
    if (/\b(design|architect|graphic|creative|art|visual|fashion)\b/.test(lower)) return 'Creative Arts';
    if (/\b(ias|ips|upsc|civil service|government|admin|police)\b/.test(lower)) return 'Government';
    if (/\b(science|physics|chemistry|biology|math|research|lab)\b/.test(lower)) return 'Science & Research';
    if (/\b(teach|professor|education|pedagogy)\b/.test(lower)) return 'Education';
    if (/\b(journal|media|communication|report)\b/.test(lower)) return 'Media & Journalism';
    if (/\b(manage|business|entrepreneur|mba|commerce|market)\b/.test(lower)) return 'Business & Management';
    if (/\b(military|army|navy|air force|defence|defense)\b/.test(lower)) return 'Defence';
    return 'General';
}

function detectIcon(title) {
    const lower = title.toLowerCase();
    if (/software|developer|program/.test(lower)) return '💻';
    if (/data|analyst|stats/.test(lower)) return '📊';
    if (/doctor|mbbs|surgeon|physician|medical/.test(lower)) return '🩺';
    if (/nurse|nursing/.test(lower)) return '👨‍⚕️';
    if (/pharma/.test(lower)) return '💊';
    if (/dentist|dental|bds/.test(lower)) return '🦷';
    if (/law|lawyer|advocate/.test(lower)) return '⚖️';
    if (/account|ca|chartered/.test(lower)) return '📈';
    if (/civil service|ias|ips|upsc/.test(lower)) return '🏛️';
    if (/engineer/.test(lower)) return '⚙️';
    if (/architect/.test(lower)) return '🏗️';
    if (/design|graphic/.test(lower)) return '🎨';
    if (/teach|professor|education/.test(lower)) return '📚';
    if (/research|scientist/.test(lower)) return '🔬';
    if (/army|military|defence|navy/.test(lower)) return '🎖️';
    if (/pilot|aviation/.test(lower)) return '✈️';
    if (/journal|media|report/.test(lower)) return '📰';
    if (/psych/.test(lower)) return '🧠';
    if (/beauty|beautician/.test(lower)) return '💅';
    if (/detective|forensic/.test(lower)) return '🔍';
    if (/chef|cook|food/.test(lower)) return '👨‍🍳';
    if (/business|manage|mba/.test(lower)) return '💼';
    return '🎯';
}

function detectCollegeCategory(relativePath) {
    const lower = relativePath.toLowerCase();
    if (/engineering|eng |iit|nit|tech/i.test(lower)) return 'Engineering';
    if (/medical|aiims|mbbs|health/i.test(lower)) return 'Medical';
    if (/arts|humanities|ba /i.test(lower)) return 'Arts';
    if (/commerce|bcom|business/i.test(lower)) return 'Commerce';
    if (/architecture|arch/i.test(lower)) return 'Architecture';
    return 'General';
}

function detectCollegeType(relativePath, title, text) {
    const lower = (relativePath + ' ' + title).toLowerCase();
    if (/\biit\b/.test(lower)) return 'IIT';
    if (/\bnit\b/.test(lower)) return 'NIT';
    if (/\baiims\b/.test(lower)) return 'AIIMS';
    if (/\biim\b/.test(lower)) return 'IIM';
    if (/\bbits\b/.test(lower)) return 'BITS';
    if (/central university/i.test(lower) || /central/i.test(text.substring(0, 200))) return 'Central University';
    if (/deemed/i.test(lower)) return 'Deemed University';
    if (/private/i.test(lower)) return 'Private';
    if (/state/i.test(lower) || /government/i.test(lower)) return 'State University';
    return 'University';
}

function detectCourseCategory(relativePath) {
    const lower = relativePath.toLowerCase();
    if (/medical/i.test(lower)) return 'Medical';
    if (/arts/i.test(lower)) return 'Arts';
    if (/commerce/i.test(lower)) return 'Commerce';
    if (/non.?medical/i.test(lower)) return 'Non-Medical';
    return 'General';
}

function detectCourseType(title, category) {
    const lower = title.toLowerCase();
    if (/^b\.?tech|^be\b|^bsc|^ba\b|^b\.?com|^b\.?arch|^bds|^mbbs|^b\.?pharm|^bpt|^bums|^bams|^llb/i.test(lower)) return 'Undergraduate Degree';
    if (/^m\.?tech|^m\.?sc|^mba|^ma\b|^m\.?com|^m\.?des|^md\b|^ms\b/i.test(lower)) return 'Postgraduate Degree';
    if (/^phd|^doctorate/i.test(lower)) return 'Doctorate';
    if (/diploma|certificate/i.test(lower)) return 'Diploma / Certificate';
    if (/^ca\b|^cs\b|^cma\b|chartered/i.test(lower)) return 'Professional Certification';
    return 'Undergraduate Degree';
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


// ─── MAIN ────────────────────────────────────────────────
async function main() {
    console.log('🚀 Career Vyas Content Parser');
    console.log('============================\n');
    
    const careers = await parseCareers();
    const colleges = await parseColleges();
    const courses = await parseCourses();
    const exams = await parseExams();
    
    // Summary
    console.log('\n============================');
    console.log('📊 Parsing Summary:');
    console.log(`   Career Profiles: ${careers.length}`);
    console.log(`   Colleges:        ${colleges.length}`);
    console.log(`   Courses:         ${courses.length}`);
    console.log(`   Exams:           ${exams.length}`);
    console.log(`\n📁 Output: content/parsed/`);
    console.log('   ├── careers.json');
    console.log('   ├── colleges.json');
    console.log('   ├── courses.json');
    console.log('   └── exams.json');
    console.log('\n✅ Done!');
}

main().catch(console.error);
