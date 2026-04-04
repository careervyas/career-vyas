/**
 * seed-from-parsed.mjs
 * 
 * Reads parsed JSON from content/parsed/ and seeds everything to Supabase.
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
    const raw = JSON.parse(fs.readFileSync(path.join(PARSED_DIR, 'careers.json'), 'utf-8'));
    
    // Map to actual DB schema: career_profiles(title, slug, summary, description, icon, salary_range, demand, study_duration)
    const careers = raw.map(c => ({
        title: c.title,
        slug: c.slug,
        icon: c.icon || '🎯',
        summary: c.summary?.substring(0, 500) || '',
        description: c.description || '',
        salary_range: c.avg_salary?.substring(0, 200) || null,
        demand: c.growth_outlook?.substring(0, 200) || c.stream || null,
        study_duration: c.study_duration?.substring(0, 200) || null,
    }));
    
    const result = await batchUpsert('career_profiles', careers, 'slug');
    console.log(`  ✅ Seeded: ${result.success} | Errors: ${result.errors}`);
}

async function seedColleges() {
    console.log('\n🌱 Seeding Colleges...');
    const raw = JSON.parse(fs.readFileSync(path.join(PARSED_DIR, 'colleges.json'), 'utf-8'));
    
    // Map to actual DB schema: colleges(name, slug, description, type, city, state, ranking)
    const colleges = raw.map(c => {
        // Try to split location into city, state
        const loc = c.location || '';
        const parts = loc.split(',').map(s => s.trim());
        const city = parts[0]?.substring(0, 100) || null;
        const state = parts[1]?.substring(0, 100) || null;
        
        return {
            name: c.name?.substring(0, 300),
            slug: c.slug,
            description: c.description?.substring(0, 5000) || '',
            type: c.type || 'University',
            city,
            state,
        };
    });
    
    const result = await batchUpsert('colleges', colleges, 'slug');
    console.log(`  ✅ Seeded: ${result.success} | Errors: ${result.errors}`);
}

async function seedCourses() {
    console.log('\n🌱 Seeding Courses...');
    const raw = JSON.parse(fs.readFileSync(path.join(PARSED_DIR, 'courses.json'), 'utf-8'));
    
    // Map to actual DB schema: courses(title, slug, description, type, duration, eligibility)
    const courses = raw.map(c => ({
        title: c.title?.substring(0, 300),
        slug: c.slug,
        description: c.description?.substring(0, 1000) || '',
        duration: c.duration?.substring(0, 200) || null,
        eligibility: c.eligibility?.substring(0, 500) || null,
        type: c.type || 'Undergraduate Degree',
    }));
    
    const result = await batchUpsert('courses', courses, 'slug');
    console.log(`  ✅ Seeded: ${result.success} | Errors: ${result.errors}`);
}

async function seedExams() {
    console.log('\n🌱 Seeding Exams...');
    const raw = JSON.parse(fs.readFileSync(path.join(PARSED_DIR, 'exams.json'), 'utf-8'));
    
    // Map to actual DB schema: exams(name, slug, full_form, description, level)
    const exams = raw.map(e => ({
        name: e.name?.substring(0, 300),
        slug: e.slug,
        full_form: e.full_form?.substring(0, 300) || null,
        description: e.description?.substring(0, 1000) || '',
        level: e.level || 'National',
    }));
    
    const result = await batchUpsert('exams', exams, 'slug');
    console.log(`  ✅ Seeded: ${result.success} | Errors: ${result.errors}`);
}

async function main() {
    console.log('🚀 Career Vyas Database Seeder');
    console.log('==============================\n');
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
    
    console.log('\n==============================');
    console.log('✅ All content seeded successfully!');
}

main().catch(console.error);
