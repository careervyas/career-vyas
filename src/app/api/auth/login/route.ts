import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    // Handle both JSON and form data
    let password = "";
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
        const body = await request.json();
        password = body.password;
    } else {
        const formData = await request.formData();
        password = formData.get("password") as string;
    }

    if (password !== "career2026") {
        // Redirect back to login with error
        return NextResponse.redirect(new URL("/admin/login?error=1", request.url));
    }

    // Set cookie directly ON the redirect response — browser processes Set-Cookie before following the redirect
    const response = NextResponse.redirect(new URL("/admin/dashboard", request.url));
    response.cookies.set("adminAuth", "true", {
        httpOnly: false, // Allow middleware to read it in Edge runtime
        secure: false,   // Work on both HTTP and HTTPS
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
    });

    return response;
}
