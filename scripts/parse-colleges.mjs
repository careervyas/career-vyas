/**
 * parse-colleges.mjs
 * 
 * Header-aware parser for college .docx files.
 * Extracts structured sections: courses, fees, hostel, placements, etc.
 * 
 * Usage: node scripts/parse-colleges.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
    slugify, findDocxFiles, extractHtml, extractText, titleFromFilename,
    splitByHeadings, parseTables, stripHtml, findSection, cleanSectionContent,
    extractFieldFromText, smartSplit, splitByTextHeaders
} from './parse-utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');
const OUTPUT_DIR = path.join(CONTENT_DIR, 'parsed');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function detectCollegeType(relativePath, title) {
    const lower = (relativePath + ' ' + title).toLowerCase();
    if (/\biit\b/.test(lower)) return 'IIT';
    if (/\bnit\b/.test(lower)) return 'NIT';
    if (/\baiims\b/.test(lower)) return 'AIIMS';
    if (/\biim\b/.test(lower)) return 'IIM';
    if (/\bbits\b/.test(lower)) return 'BITS';
    if (/central university/i.test(lower)) return 'Central University';
    if (/deemed/i.test(lower)) return 'Deemed University';
    if (/private/i.test(lower)) return 'Private';
    if (/state|government/i.test(lower)) return 'State University';
    return 'University';
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

function extractLocation(text) {
    const city = extractFieldFromText(text, 'location', 'city', 'address') || '';
    const state = extractFieldFromText(text, 'state') || '';
    
    // Try to get city from "Address" line
    const addressMatch = text.match(/address[:\-–]\s*(.+)/i);
    if (addressMatch) {
        const parts = addressMatch[1].split(',').map(s => s.trim());
        // Last 2 parts are usually city/state
        if (parts.length >= 2) {
            return {
                address: addressMatch[1].substring(0, 300),
                city: parts[parts.length - 2]?.replace(/\d+/g, '').trim() || city,
                state: parts[parts.length - 1]?.replace(/\d+/g, '').trim() || state,
            };
        }
    }
    return { address: '', city, state };
}

// Known entrance exams for common degree programs
const KNOWN_EXAMS = {
    'btech': 'JEE Advanced', 'b.tech': 'JEE Advanced', 'b. tech': 'JEE Advanced', 'b tech': 'JEE Advanced',
    'b.e': 'JEE Main / State CET', 'be': 'JEE Main / State CET',
    'mba': 'CAT', 'pgdm': 'CAT / XAT / GMAT',
    'mca': 'NIMCET / University Entrance', 'bba': 'University Entrance / IPMAT',
    'b.arch': 'JEE Main Paper 2 / NATA', 'barch': 'JEE Main Paper 2 / NATA',
    'b.des': 'UCEED', 'bdes': 'UCEED', 'm.des': 'CEED', 'mdes': 'CEED',
    'mtech': 'GATE', 'm.tech': 'GATE', 'm. tech': 'GATE', 'm tech': 'GATE',
    'msc': 'JAM / University Entrance', 'm.sc': 'JAM / University Entrance',
    'phd': 'UGC NET / CSIR NET / GATE + Interview', 'ph.d': 'UGC NET / CSIR NET / GATE + Interview',
    'dual degree': 'JEE Advanced',
    'b.sc': 'University Entrance', 'bsc': 'University Entrance',
    'b.com': 'University Entrance', 'bcom': 'University Entrance',
    'llb': 'CLAT', 'b.pharma': 'University Entrance',
    'mbbs': 'NEET', 'bds': 'NEET', 'm.phil': 'University Entrance',
};

function lookupExam(name) {
    const n = name.toLowerCase().replace(/[.\s]+/g, '').trim();
    for (const [key, val] of Object.entries(KNOWN_EXAMS)) {
        if (n === key.replace(/[.\s]+/g, '')) return val;
    }
    for (const [key, val] of Object.entries(KNOWN_EXAMS)) {
        const k = key.replace(/[.\s]+/g, '');
        if (n.includes(k) || k.includes(n)) return val;
    }
    return '';
}

/**
 * Finds the first table whose header row contains course-like keywords.
 */
function findCourseTable(html) {
    const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
    let match;
    while ((match = tableRegex.exec(html)) !== null) {
        const firstRowMatch = match[1].match(/<tr[^>]*>([\s\S]*?)<\/tr>/i);
        if (!firstRowMatch) continue;
        const headerText = firstRowMatch[1].replace(/<[^>]+>/g, '').toLowerCase();
        if (headerText.includes('course') && (headerText.includes('eligib') || headerText.includes('entrance') || headerText.includes('exam'))) {
            return match[0];
        }
    }
    return null;
}

/**
 * Parses the dedicated course table, extracting parent degrees and inline branches.
 * BTech cell: "BTech Branches offered- Aerospace Engineering Chemical Engineering ..."
 * → produces { name: "BTech", branches: ["Aerospace Engineering", "Chemical Engineering", ...] }
 */
function parseCourseTableWithBranches(tableHtml) {
    const courses = [];
    const seen = new Set();
    
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let rowMatch;
    let isFirstRow = true;
    
    while ((rowMatch = rowRegex.exec(tableHtml)) !== null) {
        const rowHtml = rowMatch[1];
        const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
        const cellsHtml = [];
        let cellMatch;
        while ((cellMatch = cellRegex.exec(rowHtml)) !== null) {
            cellsHtml.push(cellMatch[1]);
        }
        if (cellsHtml.length < 1) continue;
        
        const firstCellText = cellsHtml[0].replace(/<[^>]+>/g, '').trim();
        if (isFirstRow && /^courses?\s*$/i.test(firstCellText)) {
            isFirstRow = false;
            continue;
        }
        isFirstRow = false;
        
        const courseCell = cellsHtml[0];
        const eligCell = cellsHtml.length > 1 ? cellsHtml[1] : '';
        
        // Get degree name from <strong>
        const strongMatch = courseCell.match(/<strong>([\s\S]*?)<\/strong>/i);
        const degreeName = strongMatch 
            ? strongMatch[1].replace(/<[^>]+>/g, '').trim()
            : firstCellText.split(/\n/)[0].trim();
        
        if (!degreeName || degreeName.length < 2) continue;
        
        // Extract branches
        const branches = [];
        const paragraphs = courseCell.split(/<p[^>]*>/i).map(p => p.replace(/<[^>]+>/g, '').trim()).filter(Boolean);
        let collectBranches = false;
        for (const p of paragraphs) {
            if (/branches?\s*offered/i.test(p)) {
                collectBranches = true;
                const after = p.replace(/.*branches?\s*offered[-:\s]*/i, '').trim();
                if (after && after.length > 2) branches.push(after);
                continue;
            }
            if (collectBranches && p.length > 2) {
                if (/^(BTech|MTech|MBA|MSc|PhD|Dual|B\.Des|M\.Des)/i.test(p)) break;
                branches.push(p.trim());
            }
        }
        
        // Parse entrance exam and eligibility from eligibility cell
        const eligText = eligCell.replace(/<[^>]+>/g, '\n').replace(/\n{2,}/g, '\n').trim();
        let entranceExam = '';
        let eligibility = '';
        
        const examMatch = eligText.match(/entrance\s*exam[:\-–]?\s*(.+?)(?:\n|$)/i);
        if (examMatch) entranceExam = examMatch[1].trim();
        const eligMatch = eligText.match(/eligibility[:\-–]?\s*(.+?)(?:\n|entrance|$)/is);
        if (eligMatch) eligibility = eligMatch[1].replace(/\n+/g, ' ').trim();
        if (!eligibility) eligibility = eligText.replace(/entrance\s*exam[:\-–]?\s*.+?(?:\n|$)/gi, '').replace(/\n+/g, ' ').trim();
        if (!entranceExam) entranceExam = lookupExam(degreeName);
        
        const cleanDegree = degreeName.replace(/\n/g, ' / ').replace(/\s+/g, ' ').trim();
        const key = cleanDegree.toLowerCase().replace(/[\s.]+/g, '');
        if (seen.has(key)) continue;
        seen.add(key);
        
        courses.push({
            name: cleanDegree.substring(0, 100),
            eligibility: eligibility.substring(0, 500) || '',
            entrance_exam: entranceExam.substring(0, 200) || '',
            branches: branches.map(b => b.replace(/\s+/g, ' ').trim()).filter(b => b.length > 2),
        });
    }
    return courses;
}

/**
 * Fallback: parse flat course tables, skipping fee/placement/stats tables.
 */
function parseFlatCourseTables(tables) {
    const FEE_HEADER = /semester|tuition|fee|amount|component/i;
    const STATS_HEADER = /program|registered|participated|placed|percentage|department|description|average|salary|ctc/i;
    const GARBAGE_ROW = /^(courses?|s\.no|sr|serial|#|program|department|description|average|placement|registered|participated)/i;
    
    const courses = [];
    const seen = new Set();
    
    for (const table of tables) {
        if (table.length < 2) continue;
        const headerRow = table[0].join(' ').toLowerCase();
        if (FEE_HEADER.test(headerRow)) continue;
        if (STATS_HEADER.test(headerRow)) continue;
        let numericRows = 0;
        for (let i = 1; i < table.length; i++) {
            const vals = table[i].slice(1);
            if (vals.every(v => /^\s*[\d,.\-–₹%\s]*$/.test(v))) numericRows++;
        }
        if (numericRows / (table.length - 1) > 0.5) continue;
        
        for (const row of table) {
            if (row.length < 1) continue;
            const name = row[0].trim();
            if (GARBAGE_ROW.test(name)) continue;
            if (name.length < 2 || name.length > 150) continue;
            if (/^[\d,₹\s.\-–]+$/.test(name)) continue;
            const key = name.toLowerCase().replace(/[\s.]+/g, '');
            if (seen.has(key)) continue;
            seen.add(key);
            
            const rawElig = row.length > 1 ? row[1] || '' : '';
            let eligibility = rawElig;
            let entranceExam = row.length > 2 ? row[2] || '' : '';
            const examMatch = rawElig.match(/entrance\s*exam[:\-–]?\s*(.+?)(?:\n|$)/i);
            if (examMatch) {
                entranceExam = entranceExam || examMatch[1].trim();
                eligibility = rawElig.replace(/entrance\s*exam[:\-–]?\s*.+?(?:\n|$)/i, '').trim();
            }
            eligibility = eligibility.replace(/^eligibility[:\-–]?\s*/i, '').trim();
            if (!entranceExam || /^\d+$/.test(entranceExam)) entranceExam = lookupExam(name);
            if (/^\d+$/.test(eligibility)) continue;
            
            courses.push({
                name: name.replace(/\n/g, ' / ').substring(0, 100),
                eligibility: eligibility.substring(0, 500) || '',
                entrance_exam: entranceExam.substring(0, 200) || '',
                branches: [],
            });
        }
    }
    return courses;
}

function extractCoursesOffered(html) {
    // Strategy 1: Find the real course table by header detection
    const courseTableHtml = findCourseTable(html);
    if (courseTableHtml) {
        return parseCourseTableWithBranches(courseTableHtml);
    }
    // Strategy 2: Fallback for docs without a Courses/Eligibility header table
    const tables = parseTables(html);
    return tables.length > 0 ? parseFlatCourseTables(tables) : [];
}


function extractFeeStructure(sectionContent) {
    const tables = parseTables(sectionContent);
    if (tables.length === 0) return null;
    
    // Convert table rows into a structured format
    const fees = [];
    for (const table of tables) {
        if (table.length < 2) continue; // Need at least header + 1 row
        const header = table[0];
        for (let i = 1; i < table.length; i++) {
            const row = table[i];
            if (row.length >= 2) {
                fees.push({
                    item: row[0] || header[0] || '',
                    values: row.slice(1),
                });
            }
        }
    }
    return fees.length > 0 ? fees : null;
}

function extractPlacementStats(sectionContent) {
    const text = stripHtml(sectionContent);
    const tables = parseTables(sectionContent);
    
    const stats = {};
    
    // Try to extract from text first
    const avgMatch = text.match(/average.*?(?:package|ctc|salary)[:\s]*(?:₹|rs\.?|inr)?\s*([\d.,]+\s*(?:lpa|lakhs?|lakh))/i);
    if (avgMatch) stats.avg_package = avgMatch[1];
    
    const highMatch = text.match(/highest.*?(?:package|ctc|salary|offer)[:\s]*(?:₹|rs\.?|inr)?\s*([\d.,]+\s*(?:lpa|crore|cr|lakhs?|lakh))/i);
    if (highMatch) stats.highest_package = highMatch[1];
    
    const pctMatch = text.match(/([\d.]+)\s*%\s*(?:placed|placement)/i);
    if (pctMatch) stats.placement_percentage = pctMatch[1] + '%';
    
    // Include table data if exists
    if (tables.length > 0) {
        stats.tables = tables;
    }
    
    return Object.keys(stats).length > 0 ? stats : null;
}

async function parseColleges() {
    console.log('\n🏫 Parsing colleges (header-aware)...');
    
    const colleges = [];
    const seen = new Set();
    
    const dir1 = path.join(CONTENT_DIR, 'App Content', 'Colleges');
    const dir2 = path.join(CONTENT_DIR, 'App Content 2', 'Colleges');
    
    for (const baseDir of [dir1, dir2]) {
        if (!fs.existsSync(baseDir)) continue;
        const files = findDocxFiles(baseDir);
        
        for (const file of files) {
            const relativePath = path.relative(baseDir, file);
            const title = titleFromFilename(path.basename(file));
            const slug = slugify(title);
            
            if (seen.has(slug) || !title || title.length < 3) continue;
            if (title.match(/^(IITs|NITs|Top|Overview)/i)) continue;
            seen.add(slug);
            
            const html = await extractHtml(file);
            const text = await extractText(file);
            if (!html && !text) continue;
            
            console.log(`  📄 ${title}`);
            
            // Split by headings (smart: tries h1-h6, then bold tags, then text-based)
            const sections = smartSplit(html, text);
            
            // Also get text-based sections for fields that don't appear in HTML headings
            const textSections = splitByTextHeaders(text);
            
            // Extract location
            const loc = extractLocation(text);
            
            // Find campus size
            const campusSizeMatch = text.match(/campus\s*size[:\-–]\s*(.+)/i);
            const campusSize = campusSizeMatch ? campusSizeMatch[1].trim().substring(0, 100) : null;
            
            // Find map link
            const mapMatch = text.match(/(https?:\/\/maps\.app\.goo\.gl\/[^\s]+|https?:\/\/goo\.gl\/maps\/[^\s]+|https?:\/\/www\.google\.com\/maps[^\s]+)/i);
            const mapLink = mapMatch ? mapMatch[1] : null;
            
            // Find ranking
            const rankMatch = text.match(/NIRF\s*(?:ranking)?[:\s]*(?:is\s*)?\d{1,4}|rank[:\s]*\d{1,4}/i);
            const ranking = rankMatch ? rankMatch[0].trim() : null;
            
            // Courses section (try HTML sections, then text sections)
            let coursesSection = findSection(sections, 'courses offered', 'courses', 'programmes', 'programs');
            if (!coursesSection) coursesSection = findSection(textSections, 'courses offered', 'courses', 'programmes');
            let coursesOffered = coursesSection ? extractCoursesOffered(coursesSection.content) : [];
            // If HTML table extraction failed, try extracting from the full HTML
            if (coursesOffered.length === 0) {
                coursesOffered = extractCoursesOffered(html);
            }
            
            // Fee structure section
            let feeSection = findSection(sections, 'fee structure', 'fee', 'fees', 'tuition');
            if (!feeSection) feeSection = findSection(textSections, 'fee structure', 'fee', 'fees');
            const feeStructure = feeSection ? extractFeeStructure(feeSection.content || html) : extractFeeStructure(html);
            
            // Hostel info
            let hostelSection = findSection(sections, 'hostel', 'accommodation', 'residence');
            if (!hostelSection) hostelSection = findSection(textSections, 'hostel', 'accommodation');
            const hostelInfo = hostelSection ? (cleanSectionContent(hostelSection) || hostelSection.content?.substring(0, 3000)) : null;
            
            // Campus facilities
            let campusSection = findSection(sections, 'campus facilit', 'infrastructure', 'facilities');
            if (!campusSection) campusSection = findSection(textSections, 'campus facilit', 'infrastructure', 'facilities');
            let librarySection = findSection(sections, 'library');
            if (!librarySection) librarySection = findSection(textSections, 'library');
            let sportsSection = findSection(sections, 'sports', 'athletic');
            if (!sportsSection) sportsSection = findSection(textSections, 'sports', 'athletic');
            
            let campusFacilities = '';
            if (campusSection) campusFacilities += cleanSectionContent(campusSection) || '';
            if (librarySection) campusFacilities += '\n\nLibrary:\n' + (cleanSectionContent(librarySection) || '');
            if (sportsSection) campusFacilities += '\n\nSports:\n' + (cleanSectionContent(sportsSection) || '');
            campusFacilities = campusFacilities.trim() || null;
            
            // Placement stats
            const placementSection = findSection(sections, 'placement', 'placements', 'recruit');
            const placementStats = placementSection ? extractPlacementStats(placementSection.content) : null;
            
            // Overview - clean, first paragraph only
            const introSection = sections.find(s => s.heading === '__intro__');
            const overviewSection = findSection(sections, 'overview', 'about', 'introduction');
            
            // Get the clean overview (first meaningful paragraph)
            let overview = '';
            const rawOverview = cleanSectionContent(overviewSection) || (introSection ? stripHtml(introSection.content) : text);
            if (rawOverview) {
                // Take only the first paragraph-like block (before any "Important info" or "Location" line)
                const cutoffs = ['important information', 'location', 'address', 'courses offered', 'campus size', 'map link', 'campus map', 'reaching', 'how to reach'];
                const lines = rawOverview.split('\n');
                const cleanLines = [];
                for (const line of lines) {
                    const lower = line.trim().toLowerCase();
                    if (cutoffs.some(c => lower.startsWith(c))) break;
                    if (/^https?:\/\//i.test(line.trim())) continue; // Skip URLs
                    if (line.trim()) cleanLines.push(line.trim());
                }
                overview = cleanLines.join('\n').trim();
            }
            if (!overview || overview.length < 20) overview = `${title} is a premier higher education institution in India.`;
            
            // Extract branches/specializations from the text
            const branchesSection = findSection(sections, 'branch', 'specializ');
            if (!branchesSection) {
                // Try text-based
                const tbSection = findSection(textSections, 'branch', 'specializ');
            }
            
            colleges.push({
                name: title,
                slug,
                type: detectCollegeType(relativePath, title),
                category: detectCollegeCategory(relativePath),
                city: loc.city?.substring(0, 100) || null,
                state: loc.state?.substring(0, 100) || null,
                address: loc.address?.substring(0, 300) || null,
                campus_size: campusSize,
                map_link: mapLink,
                ranking,
                courses_offered: coursesOffered,
                fee_structure: feeStructure,
                hostel_info: hostelInfo?.substring(0, 3000) || null,
                campus_facilities: campusFacilities?.substring(0, 3000) || null,
                placement_stats: placementStats,
                overview: overview.substring(0, 2000),
                description: overview.substring(0, 2000),
                full_content: text,
            });
        }
    }
    
    console.log(`\n  ✅ Parsed ${colleges.length} unique colleges`);
    fs.writeFileSync(path.join(OUTPUT_DIR, 'colleges.json'), JSON.stringify(colleges, null, 2));
    return colleges;
}

// Run
parseColleges().catch(console.error);
