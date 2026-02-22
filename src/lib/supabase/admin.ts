import { createClient } from '@supabase/supabase-js';

// These env vars are available at runtime on Vercel once configured in project settings.
// Using empty string fallback prevents build-time crashes during static analysis;
// actual DB calls will fail gracefully if the var is truly missing.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

// This admin client bypasses RLS and should ONLY be used in server/api routes.
export const supabaseAdmin = createClient(supabaseUrl, supabaseRoleKey);
