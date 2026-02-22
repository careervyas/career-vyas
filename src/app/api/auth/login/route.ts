import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { password } = await request.json();

    if (password !== "career2026") {
        return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });

    // Set a proper HTTP-only cookie that works on HTTPS/Vercel
    response.cookies.set("adminAuth", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
    });

    return response;
}
