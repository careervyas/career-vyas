// Migration script to create Supabase tables
// Run with: node scripts/migrate.mjs

const SUPABASE_URL = 'https://xnhvjttfeuztvaeuqquc.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuaHZqdHRmZXV6dHZhZXVxcXVjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTc0MDM3NSwiZXhwIjoyMDg3MzE2Mzc1fQ.NPnRDMvksk_nmi_2igufstc5vaTvvLRxRoGrtNUNHOo';

const sql = `
CREATE TABLE IF NOT EXISTS signups (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  class INTEGER,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS webinar_regs (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  phone TEXT,
  attended BOOLEAN DEFAULT false,
  registered_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE webinar_regs ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anon role (for signup forms)
CREATE POLICY IF NOT EXISTS "Allow anonymous inserts on signups" ON signups FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow anonymous inserts on webinar_regs" ON webinar_regs FOR INSERT TO anon WITH CHECK (true);
`;

async function migrate() {
    console.log('🔄 Running migrations...');

    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
        method: 'GET',
        headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        }
    });

    if (!response.ok) {
        console.error('❌ Cannot connect to Supabase:', response.status, await response.text());
        process.exit(1);
    }

    console.log('✅ Connected to Supabase');
    console.log('📋 SQL to execute (please run in Supabase SQL Editor):');
    console.log('---');
    console.log(sql);
    console.log('---');
    console.log('\n🔗 Go to: https://supabase.com/dashboard/project/xnhvjttfeuztvaeuqquc/sql/new');
    console.log('   Paste the SQL above and click "Run"');
}

migrate().catch(console.error);
