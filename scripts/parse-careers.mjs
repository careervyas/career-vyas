/**
 * parse-careers.mjs
 * 
 * Header-aware parser for career profile .docx files.
 * Extracts structured sections: overview, roles, benefits, how-to, eligibility, salary.
 * 
 * Usage: node scripts/parse-careers.mjs
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

async function parseCareers() {
    const dir = path.join(CONTENT_DIR, 'App Content', 'career profile');
    const files = findDocxFiles(dir);
    console.log(`\n📋 Parsing ${files.length} career profiles (header-aware)...`);
    
    const careers = [];
    const seen = new Set();
    
    for (const file of files) {
        const title = titleFromFilename(path.basename(file));
        const slug = slugify(title);
        
        if (seen.has(slug)) continue;
        seen.add(slug);
        
        const html = await extractHtml(file);
        const text = await extractText(file);
        if (!html && !text) continue;
        
        console.log(`  📄 ${title}`);
        
        const sections = splitByHeadings(html);
        
        // Overview
        const overviewSection = findSection(sections, 'overview', 'what is', 'introduction', 'about');
        const introSection = sections.find(s => s.heading === '__intro__');
        let overview = cleanSectionContent(overviewSection) || '';
        if (!overview && introSection) {
            overview = stripHtml(introSection.content).substring(0, 1000);
        }
        
        // Clean the summary — skip repetitive titles
        const lines = (overview || text).split('\n').filter(l => {
            const t = l.trim();
            if (t.toLowerCase().startsWith('name of the career profile')) return false;
            if (t.toLowerCase().startsWith('career profile:')) return false;
            if (t.toLowerCase() === 'overview') return false;
            if (t.toLowerCase() === 'overview:') return false;
            return t.length > 30;
        });
        const summary = lines.length > 0 ? lines[0].substring(0, 300) : '';
        
        // Roles & Responsibilities
        const rolesSection = findSection(sections, 'roles', 'responsibilities', 'duties', 'job description', 'what kind of job');
        const rolesContent = cleanSectionContent(rolesSection);
        
        // Benefits
        const benefitsSection = findSection(sections, 'benefits', 'advantages', 'pros', 'why choose');
        const benefitsContent = cleanSectionContent(benefitsSection);
        
        // How to become
        const howtoSection = findSection(sections, 'how to become', 'how to', 'career path', 'steps', 'roadmap');
        let howtoContent = cleanSectionContent(howtoSection);
        // Also try extracting step-by-step from lists
        if (howtoSection) {
            const steps = extractLists(howtoSection.content);
            if (steps.length > 0 && !howtoContent) {
                howtoContent = steps.map((s, i) => `Step ${i + 1}: ${s}`).join('\n');
            }
        }
        
        // Eligibility
        const eligibilitySection = findSection(sections, 'eligibility', 'qualification', 'requirement', 'education');
        const eligibilityContent = cleanSectionContent(eligibilitySection);
        
        // Salary
        const salaryField = extractFieldFromText(text, 'salary', 'average salary', 'pay', 'compensation', 'income', 'package');
        
        // Skills
        const skillsSection = findSection(sections, 'skill');
        let skillsList = [];
        if (skillsSection) {
            skillsList = extractLists(skillsSection.content);
        }
        if (skillsList.length === 0) {
            const skillField = extractFieldFromText(text, 'skills', 'qualifications');
            if (skillField) {
                skillsList = skillField.split(/[,;]/).map(s => s.trim()).filter(s => s.length > 1).slice(0, 10);
            }
        }
        
        // Top companies
        const companiesSection = findSection(sections, 'compan', 'employer', 'recruiter', 'organization', 'where to work');
        let companiesList = [];
        if (companiesSection) {
            companiesList = extractLists(companiesSection.content);
        }
        if (companiesList.length === 0) {
            const compField = extractFieldFromText(text, 'companies', 'employers', 'recruiters');
            if (compField) {
                companiesList = compField.split(/[,;]/).map(s => s.trim()).filter(s => s.length > 1).slice(0, 10);
            }
        }
        
        // Duration, Demand
        const studyDuration = extractFieldFromText(text, 'duration', 'years', 'course duration');
        const growthOutlook = extractFieldFromText(text, 'growth', 'outlook', 'demand', 'job prospects');
        
        careers.push({
            title,
            slug,
            icon: detectIcon(title),
            stream: detectStream(title, text),
            summary,
            overview: overview?.substring(0, 3000) || null,
            roles_responsibilities: rolesContent?.substring(0, 3000) || null,
            benefits: benefitsContent?.substring(0, 3000) || null,
            how_to_become: howtoContent?.substring(0, 3000) || null,
            eligibility: eligibilityContent?.substring(0, 3000) || null,
            salary_range: salaryField?.substring(0, 200) || null,
            skills_needed: skillsList.slice(0, 15),
            top_companies: companiesList.slice(0, 15),
            study_duration: studyDuration?.substring(0, 200) || null,
            growth_outlook: growthOutlook?.substring(0, 200) || null,
            description: text.substring(0, 5000),
            full_content: text,
        });
    }
    
    console.log(`\n  ✅ Parsed ${careers.length} unique career profiles`);
    fs.writeFileSync(path.join(OUTPUT_DIR, 'careers.json'), JSON.stringify(careers, null, 2));
    return careers;
}

parseCareers().catch(console.error);
