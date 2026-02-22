import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    const { data, error } = await supabase
        .from("career_profiles")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            return NextResponse.json({ error: "Career not found" }, { status: 404 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Increment view count in background (don't await)
    supabase.rpc('increment_career_view', { career_slug: slug }).then();

    return NextResponse.json(data);
}
