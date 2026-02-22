import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Check env vars are present
    if (!url || !key) {
        return NextResponse.json({
            status: "error",
            message: "Missing env vars",
            url: url ? "SET" : "MISSING",
            key: key ? "SET" : "MISSING",
            anon: anon ? "SET" : "MISSING",
        });
    }

    // Try a real Supabase REST call
    try {
        const res = await fetch(`${url}/rest/v1/courses?select=count`, {
            headers: {
                "apikey": key,
                "Authorization": `Bearer ${key}`,
                "Content-Type": "application/json",
            },
        });

        const text = await res.text();
        return NextResponse.json({
            status: "ok",
            supabaseStatus: res.status,
            supabaseResponse: text.slice(0, 200),
            url: url,
            envVarsPresent: { url: true, key: true, anon: !!anon },
        });
    } catch (err: any) {
        return NextResponse.json({
            status: "error",
            message: err.message,
            cause: err.cause?.message || err.cause,
            url: url,
            envVarsPresent: { url: true, key: true, anon: !!anon },
        });
    }
}
