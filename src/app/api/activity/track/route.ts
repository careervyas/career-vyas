import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
    try {
        const payload = await request.json();
        const { activity_type, content_type, content_id, metadata } = payload;

        if (!activity_type) {
            return NextResponse.json({ error: "Missing activity_type" }, { status: 400 });
        }

        // Default to a generic user_id if not logged in
        const defaultUserId = "00000000-0000-0000-0000-000000000000";

        const { error } = await supabaseAdmin
            .from("user_activity")
            .insert({
                user_id: defaultUserId,
                activity_type,
                content_type,
                content_id,
                metadata,
            });

        if (error) {
            // Suppress error in response to not crash the client, but log it internally
            console.error("DB Activity Tracking Error:", error.message);
            return NextResponse.json({ success: false, error: "Tracking failed internally" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Bad Request" }, { status: 400 });
    }
}
