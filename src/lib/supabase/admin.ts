import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// This admin client bypasses RLS and should ONLY be used in server/api routes
export const supabaseAdmin = createClient(supabaseUrl, supabaseRoleKey);
