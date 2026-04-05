/**
 * parse-utils.mjs
 * 
 * Shared utilities for the per-content-type parsers.
 * Uses mammoth.convertToHtml() for structure-preserving extraction.
 */

import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';

// ─── SLUGIFY ─────────────────────────────────────────────
export function slugify(str) {
    return str
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 100);
}

// ─── FIND DOCX FILES ────────────────────────────────────
export function findDocxFiles(dir) {
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

// ─── EXTRACT HTML (structure-preserving) ────────────────
export async function extractHtml(filePath) {
    try {
        const result = await mammoth.convertToHtml({ path: filePath });
        return result.value.trim();
    } catch (err) {
        console.error(`  ⚠️ Failed to parse HTML: ${path.basename(filePath)} — ${err.message}`);
        return '';
    }
}

// ─── EXTRACT RAW TEXT (fallback) ────────────────────────
export async function extractText(filePath) {
    try {
        const result = await mammoth.extractRawText({ path: filePath });
        return result.value.trim();
    } catch (err) {
        console.error(`  ⚠️ Failed to parse text: ${path.basename(filePath)} — ${err.message}`);
        return '';
    }
}

// ─── TITLE FROM FILENAME ────────────────────────────────
export function titleFromFilename(filename) {
    return filename
        .replace(/\.docx$/i, '')
        .replace(/^[\d]+[\.\\,\s]*/, '')
        .replace(/\s*\(\d+\)\s*/g, '')
        .replace(/-CAREER PROFILE/i, '')
        .replace(/Career Profile[-_ ]*/i, '')
        .replace(/[-_]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

// ─── STRIP HTML TAGS ────────────────────────────────────
export function stripHtml(html) {
    return html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<\/div>/gi, '\n')
        .replace(/<\/li>/gi, '\n')
        .replace(/<\/tr>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

// ─── SPLIT HTML BY HEADINGS ─────────────────────────────
// Splits HTML into named sections based on heading tags.
// Returns an array of { heading: string, content: string, level: number }
export function splitByHeadings(html) {
    const sections = [];
    // Match all heading tags
    const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h\1>/gi;
    let lastIndex = 0;
    let lastHeading = null;
    let lastLevel = 0;
    let match;

    while ((match = headingRegex.exec(html)) !== null) {
        const contentBefore = html.substring(lastIndex, match.index).trim();
        if (lastHeading !== null) {
            sections.push({
                heading: stripHtml(lastHeading).trim(),
                content: contentBefore,
                level: lastLevel,
            });
        } else if (contentBefore) {
            // Content before the first heading
            sections.push({
                heading: '__intro__',
                content: contentBefore,
                level: 0,
            });
        }
        lastHeading = match[2];
        lastLevel = parseInt(match[1]);
        lastIndex = match.index + match[0].length;
    }

    // Remaining content after last heading
    const remaining = html.substring(lastIndex).trim();
    if (lastHeading !== null) {
        sections.push({
            heading: stripHtml(lastHeading).trim(),
            content: remaining,
            level: lastLevel,
        });
    } else if (remaining) {
        // No headings at all - treat as one section
        sections.push({
            heading: '__intro__',
            content: remaining,
            level: 0,
        });
    }

    return sections;
}

// ─── SPLIT HTML BY BOLD TAGS ────────────────────────────
// For docs that use <strong> or <b> as pseudo-headings instead of h1-h6
export function splitByBoldTags(html) {
    const sections = [];
    // Match standalone bold text that looks like section headers
    // (bold text on its own paragraph, typically short)
    const boldRegex = /<p[^>]*>\s*<strong>(.*?)<\/strong>\s*<\/p>/gi;
    let lastIndex = 0;
    let lastHeading = null;
    let match;

    while ((match = boldRegex.exec(html)) !== null) {
        const headingText = stripHtml(match[1]).trim();
        // Only treat as heading if it looks like a section title (short, ends with - or : or is ALL CAPS)
        if (headingText.length < 3 || headingText.length > 100) continue;
        const isSectionHeader = headingText.endsWith('-') || headingText.endsWith(':') ||
            headingText === headingText.toUpperCase() ||
            /^(courses|fee|hostel|campus|library|sports|placement|admission|overview|about|department|infrastructure|faculty|research|ranking|notable|alumni)/i.test(headingText);
        if (!isSectionHeader) continue;

        const contentBefore = html.substring(lastIndex, match.index).trim();
        if (lastHeading !== null) {
            sections.push({ heading: lastHeading, content: contentBefore, level: 2 });
        } else if (contentBefore) {
            sections.push({ heading: '__intro__', content: contentBefore, level: 0 });
        }
        lastHeading = headingText.replace(/[-:]+$/, '').trim();
        lastIndex = match.index + match[0].length;
    }

    // Remaining content
    const remaining = html.substring(lastIndex).trim();
    if (lastHeading !== null) {
        sections.push({ heading: lastHeading, content: remaining, level: 2 });
    } else if (remaining) {
        sections.push({ heading: '__intro__', content: remaining, level: 0 });
    }

    return sections;
}

// ─── SPLIT TEXT BY SECTION HEADERS ──────────────────────
// Fallback: splits raw text by lines that look like section titles
export function splitByTextHeaders(text) {
    const sections = [];
    const lines = text.split('\n');
    let currentHeading = '__intro__';
    let currentContent = [];

    for (const line of lines) {
        const trimmed = line.trim();
        // Detect section headers: lines ending with :, -, or short ALL-CAPS lines
        const isHeader = (
            (trimmed.length > 3 && trimmed.length < 80) && (
                trimmed.endsWith('-') || trimmed.endsWith(':') ||
                /^(courses offered|fee structure|hostel|campus facilit|library|sports|placement|admission|overview|about|department|infrastructure|faculty|research|ranking|notable|alumni|important information)/i.test(trimmed)
            )
        );

        if (isHeader) {
            // Save previous section
            if (currentContent.length > 0 || currentHeading !== '__intro__') {
                sections.push({
                    heading: currentHeading,
                    content: currentContent.join('\n'),
                    level: 2,
                });
            }
            currentHeading = trimmed.replace(/[-:]+$/, '').trim();
            currentContent = [];
        } else {
            currentContent.push(line);
        }
    }

    // Final section
    if (currentContent.length > 0) {
        sections.push({
            heading: currentHeading,
            content: currentContent.join('\n'),
            level: 2,
        });
    }

    return sections;
}

// ─── SMART SPLIT (try headings, then bold tags, then text) ─
export function smartSplit(html, text) {
    // Try HTML headings first
    let sections = splitByHeadings(html);
    // If we only got 1 section (all intro), try bold tags
    if (sections.length <= 1) {
        sections = splitByBoldTags(html);
    }
    // If still only 1 section, try text-based splitting
    if (sections.length <= 1) {
        sections = splitByTextHeaders(text);
    }
    return sections;
}

// Extracts tables from HTML into arrays of arrays (rows x cells)
export function parseTables(html) {
    const tables = [];
    const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
    let match;
    while ((match = tableRegex.exec(html)) !== null) {
        const tableHtml = match[1];
        const rows = [];
        const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
        let rowMatch;
        while ((rowMatch = rowRegex.exec(tableHtml)) !== null) {
            const cells = [];
            const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
            let cellMatch;
            while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
                cells.push(stripHtml(cellMatch[1]).trim());
            }
            if (cells.length > 0) rows.push(cells);
        }
        if (rows.length > 0) tables.push(rows);
    }
    return tables;
}

// ─── EXTRACT LISTS ──────────────────────────────────────
export function extractLists(html) {
    const items = [];
    const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    let match;
    while ((match = liRegex.exec(html)) !== null) {
        const text = stripHtml(match[1]).trim();
        if (text.length > 1) items.push(text);
    }
    return items;
}

// ─── FIND SECTION BY KEYWORD ────────────────────────────
// Find a section whose heading matches one of the keywords (case-insensitive)
export function findSection(sections, ...keywords) {
    return sections.find(s =>
        keywords.some(kw => s.heading.toLowerCase().includes(kw.toLowerCase()))
    );
}

// ─── CLEAN SECTION CONTENT ──────────────────────────────
// Returns the text content of a section, cleaned up
export function cleanSectionContent(section) {
    if (!section) return null;
    const text = stripHtml(section.content);
    return text.length > 2 ? text : null;
}

// ─── EXTRACT FIELD FROM TEXT ────────────────────────────
// Looks for a line containing a keyword and extracts value after colon
export function extractFieldFromText(text, ...keywords) {
    const lines = text.split('\n');
    for (const line of lines) {
        const lower = line.toLowerCase();
        for (const kw of keywords) {
            if (lower.includes(kw.toLowerCase())) {
                const colonIdx = line.indexOf(':');
                if (colonIdx > -1) {
                    const value = line.substring(colonIdx + 1).trim();
                    if (value.length > 2 && value.length < 200) return value;
                }
                if (line.trim().length > 10 && line.trim().length < 200) {
                    return line.trim();
                }
            }
        }
    }
    return null;
}
