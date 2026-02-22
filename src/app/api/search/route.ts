import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
        return NextResponse.json({ error: "Search query 'q' is required" }, { status: 400 });
    }

    // To search across multiple tables without a postgres function, 
    // we do parallel text searches on the key fields of each table.
    const [careersRes, coursesRes, examsRes, collegesRes] = await Promise.all([
        supabase.from("career_profiles").select("id, title, slug, summary").ilike("title", `%${query}%`).limit(10),
        supabase.from("courses").select("id, title, slug, type").ilike("title", `%${query}%`).limit(10),
        supabase.from("exams").select("id, name, slug, full_form").ilike("name", `%${query}%`).limit(10),
        supabase.from("colleges").select("id, name, slug, city").ilike("name", `%${query}%`).limit(10),
    ]);

    return NextResponse.json({
        careers: careersRes.data || [],
        courses: coursesRes.data || [],
        exams: examsRes.data || [],
        colleges: collegesRes.data || [],
    });
}
