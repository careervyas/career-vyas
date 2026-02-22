import { NextResponse } from "next/server";

export async function GET() {
    const response = NextResponse.redirect(
        new URL("/admin/login", process.env.NEXT_PUBLIC_SITE_URL || "https://www.careervyas.com")
    );
    // Clear the admin auth cookie
    response.cookies.set("adminAuth", "", {
        maxAge: 0,
        path: "/",
    });
    return response;
}
