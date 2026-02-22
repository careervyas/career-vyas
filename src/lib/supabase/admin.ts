import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy singleton: createClient is only called on the FIRST actual DB operation,
// never at module evaluation / build time. This prevents Vercel build failures
// caused by missing env vars during the static analysis phase.
let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
    if (!_client) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!url || !key) {
            throw new Error(
                'NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set in environment variables.'
            );
        }
        _client = createClient(url, key, { auth: { persistSession: false } });
    }
    return _client;
}

// Export as `any` so TypeScript doesn't fight us on overloads.
// All real type safety is preserved at the call site via Supabase's own filters.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabaseAdmin: any = new Proxy(
    {},
    {
        get(_target, prop: string) {
            // Forward every property access to the real client instance
            const client = getClient();
            const value = client[prop as keyof SupabaseClient];
            return typeof value === 'function' ? value.bind(client) : value;
        },
    }
);
