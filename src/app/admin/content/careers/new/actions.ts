"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateSlug } from "@/lib/utils/slugify";
import { revalidatePath } from "next/cache";

export async function createCareer(formData: FormData) {
    const title = formData.get("title") as string;
    const summary = formData.get("summary") as string;
    const description = formData.get("description") as string;
    const icon = formData.get("icon") as string;
    const salary_range = formData.get("salary_range") as string;
    const demand = formData.get("demand") as string;
    const study_duration = formData.get("study_duration") as string;

    if (!title || !summary) {
        return { error: "Title and Summary are required." };
    }

    const slug = generateSlug(title);

    const { error } = await supabaseAdmin.from("career_profiles").insert([
        {
            title,
            slug,
            summary,
            description,
            icon,
            salary_range,
            demand,
            study_duration,
        },
    ]);

    if (error) {
        console.error("Error creating career:", error);
        if (error.code === '23505') {
            return { error: "A career with this title/slug already exists." };
        }
        return { error: error.message };
    }

    // Purge the cache for the careers table
    revalidatePath("/admin/content/careers");
    revalidatePath("/explore/careers");

    return { success: true };
}
