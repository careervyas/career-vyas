"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateSlug } from "@/lib/utils/slugify";
import { revalidatePath } from "next/cache";

export async function createCourse(formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const type = formData.get("type") as string;
    const duration = formData.get("duration") as string;
    const eligibility = formData.get("eligibility") as string;

    if (!title) return { error: "Title is required." };

    const slug = generateSlug(title);

    const { error } = await supabaseAdmin.from("courses").insert([{
        title, slug, description, type, duration, eligibility
    }]);

    if (error) {
        if (error.code === '23505') return { error: "A course with this title already exists." };
        return { error: error.message };
    }

    revalidatePath("/admin/content/courses");
    revalidatePath("/explore/courses");
    return { success: true };
}
