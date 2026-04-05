/**
 * seed-from-parsed.mjs
 * 
 * Reads parsed JSON from content/parsed/ and seeds everything to Supabase.
 * Handles structured fields and content relationships.
 * 
 * Usage: node scripts/seed-from-parsed.mjs
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PARSED_DIR = path.join(ROOT, 'content', 'parsed');

// Supabase config from .env.local
import dotenv from 'dotenv';
dotenv.config({ path: path.join(ROOT, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing SUPABASE env vars. Check .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function loadParsed(filename) {
    const filePath = path.join(PARSED_DIR, filename);
    if (!fs.existsSync(filePath)) {
        console.error(`  ❌ Missing ${filename}. Run the corresponding parser first.`);
        return [];
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// Batch upsert helper
async function batchUpsert(table, data, conflictField, batchSize = 50) {
    let success = 0;
    let errors = 0;
    
    for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        const { error } = await supabase.from(table).upsert(batch, { onConflict: conflictField });
        if (error) {
            console.error(`  ❌ Batch ${Math.floor(i/batchSize) + 1} error: ${error.message}`);
            errors += batch.length;
        } else {
            success += batch.length;
        }
    }
    
    return { success, errors };
}

async function seedCareers() {
    console.log('\n🌱 Seeding Career Profiles...');
    const raw = loadParsed('careers.json');
    
    const careers = raw.map(c => ({
        title: c.title,
        slug: c.slug,
        icon: c.icon || '🎯',
        summary: c.summary?.substring(0, 500) || '',
        description: c.description || '',
        salary_range: c.salary_range?.substring(0, 200) || null,
        demand: c.growth_outlook?.substring(0, 200) || c.stream || null,
        study_duration: c.study_duration?.substring(0, 200) || null,
        // New structured fields
        overview: c.overview?.substring(0, 3000) || null,
        roles_responsibilities: c.roles_responsibilities?.substring(0, 3000) || null,
        benefits: c.benefits?.substring(0, 3000) || null,
        how_to_become: c.how_to_become?.substring(0, 3000) || null,
        eligibility: c.eligibility?.substring(0, 3000) || null,
        skills_needed: c.skills_needed || [],
        top_companies: c.top_companies || [],
    }));
    
    const result = await batchUpsert('career_profiles', careers, 'slug');
    console.log(`  ✅ Seeded: ${result.success} | Errors: ${result.errors}`);
}

async function seedColleges() {
    console.log('\n🌱 Seeding Colleges...');
    const raw = loadParsed('colleges.json');
    
    const colleges = raw.map(c => ({
        name: c.name?.substring(0, 300),
        slug: c.slug,
        description: c.description?.substring(0, 5000) || '',
        type: c.type || 'University',
        city: c.city?.substring(0, 100) || null,
        state: c.state?.substring(0, 100) || null,
        // New structured fields
        address: c.address?.substring(0, 300) || null,
        campus_size: c.campus_size?.substring(0, 100) || null,
        map_link: c.map_link || null,
        ranking: (() => {
            if (!c.ranking) return null;
            const m = c.ranking.match(/(\d{1,4})/);
            return m ? parseInt(m[1]) : null;
        })(),
        courses_offered: c.courses_offered || [],
        fee_structure: c.fee_structure || null,
        hostel_info: c.hostel_info?.substring(0, 3000) || null,
        campus_facilities: c.campus_facilities?.substring(0, 3000) || null,
        placement_stats: c.placement_stats || null,
    }));
    
    const result = await batchUpsert('colleges', colleges, 'slug');
    console.log(`  ✅ Seeded: ${result.success} | Errors: ${result.errors}`);
}

async function seedCourses() {
    console.log('\n🌱 Seeding Courses...');
    const raw = loadParsed('courses.json');
    
    const courses = raw.map(c => ({
        title: c.title?.substring(0, 300),
        slug: c.slug,
        description: c.description?.substring(0, 1000) || '',
        duration: c.duration?.substring(0, 200) || null,
        eligibility: c.eligibility?.substring(0, 1000) || null,
        type: c.type || 'Undergraduate Degree',
        // New structured fields
        overview: c.overview?.substring(0, 3000) || null,
        syllabus: c.syllabus?.substring(0, 3000) || null,
        career_prospects: c.career_prospects?.substring(0, 3000) || null,
        top_colleges: c.top_colleges?.substring(0, 2000) || null,
        entrance_exams: c.entrance_exams?.substring(0, 1000) || null,
        fee_range: c.fee_range?.substring(0, 300) || null,
        specializations: c.specializations || [],
        details: c.details?.substring(0, 5000) || '',
    }));
    
    const result = await batchUpsert('courses', courses, 'slug');
    console.log(`  ✅ Seeded: ${result.success} | Errors: ${result.errors}`);
}

async function seedExams() {
    console.log('\n🌱 Seeding Exams...');
    const raw = loadParsed('exams.json');
    
    const exams = raw.map(e => ({
        name: e.name?.substring(0, 300),
        slug: e.slug,
        full_form: e.full_form?.substring(0, 300) || null,
        description: e.description?.substring(0, 1000) || '',
        level: e.level || 'National',
        // New structured fields
        mode: e.mode?.substring(0, 100) || 'Online CBT',
        category: e.category || 'Competitive',
        overview: e.overview?.substring(0, 3000) || null,
        eligibility: e.eligibility?.substring(0, 2000) || null,
        exam_pattern: e.exam_pattern?.substring(0, 3000) || null,
        syllabus: e.syllabus?.substring(0, 3000) || null,
        important_dates: e.important_dates?.substring(0, 1000) || null,
        preparation_tips: e.preparation_tips?.substring(0, 3000) || null,
        accepting_colleges: e.accepting_colleges?.substring(0, 2000) || null,
    }));
    
    const result = await batchUpsert('exams', exams, 'slug');
    console.log(`  ✅ Seeded: ${result.success} | Errors: ${result.errors}`);
}

async function seedRelationships() {
    console.log('\n🌱 Seeding Content Relationships...');
    const raw = loadParsed('relationships.json');
    if (raw.length === 0) {
        console.log('  ⚠️ No relationships to seed. Run build-relationships.mjs first.');
        return;
    }
    
    // First, build slug→id lookup maps for each content type
    const idMaps = {};
    
    // Get all career IDs
    const { data: careers } = await supabase.from('career_profiles').select('id, slug');
    idMaps.career = {};
    (careers || []).forEach(c => { idMaps.career[c.slug] = c.id; });
    
    // Get all college IDs
    const { data: colleges } = await supabase.from('colleges').select('id, slug');
    idMaps.college = {};
    (colleges || []).forEach(c => { idMaps.college[c.slug] = c.id; });
    
    // Get all course IDs
    const { data: courses } = await supabase.from('courses').select('id, slug');
    idMaps.course = {};
    (courses || []).forEach(c => { idMaps.course[c.slug] = c.id; });
    
    // Get all exam IDs
    const { data: exams } = await supabase.from('exams').select('id, slug');
    idMaps.exam = {};
    (exams || []).forEach(c => { idMaps.exam[c.slug] = c.id; });
    
    // Map relationships to use IDs
    const relationships = raw.map(r => {
        const sourceId = idMaps[r.source_type]?.[r.source_slug];
        const targetId = idMaps[r.target_type]?.[r.target_slug];
        if (!sourceId || !targetId) return null;
        return {
            source_type: r.source_type,
            source_id: sourceId,
            target_type: r.target_type,
            target_id: targetId,
            relationship_type: r.relationship,
            target_slug: r.target_slug,
        };
    }).filter(Boolean);
    
    console.log(`  📊 Resolved ${relationships.length} of ${raw.length} relationships to DB IDs`);
    
    // Clear old relationships first
    await supabase.from('content_relationships').delete().neq('id', 0);
    
    // Insert new
    const result = await batchUpsert('content_relationships', relationships, 'id');
    console.log(`  ✅ Seeded: ${result.success} | Errors: ${result.errors}`);
}

async function main() {
    console.log('🚀 Career Vyas Database Seeder (v2 Structured)');
    console.log('================================================\n');
    console.log(`📡 Supabase URL: ${supabaseUrl}`);
    
    // Test connection
    const { data, error } = await supabase.from('career_profiles').select('id').limit(1);
    if (error) {
        console.error(`❌ Connection failed: ${error.message}`);
        process.exit(1);
    }
    console.log('✅ Connected to Supabase\n');
    
    await seedCareers();
    await seedColleges();
    await seedCourses();
    await seedExams();
    await seedRelationships();
    
    console.log('\n================================================');
    console.log('✅ All content seeded successfully!');
}

main().catch(console.error);
