"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateSlug } from "@/lib/utils/slugify";
import { revalidatePath } from "next/cache";

export async function createCollege(formData: FormData) {
    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const ranking = formData.get("ranking") as string;
    const description = formData.get("description") as string;

    if (!name) return { error: "College Name is required." };

    const slug = generateSlug(name);
    const parsedRanking = ranking ? parseInt(ranking) : null;

    const { error } = await supabaseAdmin.from("colleges").insert([{
        name, slug, type, city, state, ranking: parsedRanking, description
    }]);

    if (error) {
        if (error.code === '23505') return { error: "A college with this name already exists." };
        return { error: error.message };
    }

    revalidatePath("/admin/content/colleges");
    revalidatePath("/explore/colleges");
    return { success: true };
}
