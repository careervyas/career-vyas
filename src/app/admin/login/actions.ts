"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
    const password = formData.get("password") as string;

    if (password !== "career2026") {
        return { error: "Invalid password" };
    }

    const cookieStore = await cookies();
    cookieStore.set("adminAuth", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
    });

    redirect("/admin/dashboard");
}
