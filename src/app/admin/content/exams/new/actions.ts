"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateSlug } from "@/lib/utils/slugify";
import { revalidatePath } from "next/cache";

export async function createExam(formData: FormData) {
    const name = formData.get("name") as string;
    const full_form = formData.get("full_form") as string;
    const level = formData.get("level") as string;
    const exam_date = formData.get("exam_date") as string;
    const description = formData.get("description") as string;

    if (!name) return { error: "Exam Name is required." };

    const slug = generateSlug(name);

    const { error } = await supabaseAdmin.from("exams").insert([{
        name, slug, full_form, level, exam_date, description
    }]);

    if (error) {
        if (error.code === '23505') return { error: "An exam with this name already exists." };
        return { error: error.message };
    }

    revalidatePath("/admin/content/exams");
    revalidatePath("/explore/exams");
    return { success: true };
}
