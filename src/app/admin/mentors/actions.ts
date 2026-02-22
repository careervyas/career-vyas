"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function generateSlug(text: string) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function createMentor(formData: FormData): Promise<void> {
    const name = formData.get("name") as string;
    const tagline = formData.get("tagline") as string;
    const bio = formData.get("bio") as string;
    const expertise = formData.get("expertise") as string;
    const cal_username = formData.get("cal_username") as string;
    const linkedin_url = formData.get("linkedin_url") as string;
    const photo_url = formData.get("photo_url") as string;
    const session_price = formData.get("session_price") as string;
    const years_experience = formData.get("years_experience") as string;
    const is_featured = formData.get("is_featured") === "on";

    if (!name || !tagline) return;

    const slug = generateSlug(name);
    const expertiseArr = expertise ? expertise.split(",").map((e) => e.trim()).filter(Boolean) : [];

    const { error } = await supabaseAdmin.from("mentors").insert([{
        name, slug, tagline, bio, expertise: expertiseArr,
        cal_username, linkedin_url, photo_url,
        session_price: session_price ? parseFloat(session_price) : null,
        years_experience: years_experience ? parseInt(years_experience) : null,
        is_featured,
    }]);

    if (error) {
        console.error("Error creating mentor:", error);
        return;
    }

    revalidatePath("/admin/mentors");
    revalidatePath("/mentors");
    redirect("/admin/mentors");
}

export async function updateMentor(id: string, formData: FormData) {
    const name = formData.get("name") as string;
    const tagline = formData.get("tagline") as string;
    const bio = formData.get("bio") as string;
    const expertise = formData.get("expertise") as string;
    const cal_username = formData.get("cal_username") as string;
    const linkedin_url = formData.get("linkedin_url") as string;
    const photo_url = formData.get("photo_url") as string;
    const session_price = formData.get("session_price") as string;
    const years_experience = formData.get("years_experience") as string;
    const is_featured = formData.get("is_featured") === "on";

    const expertiseArr = expertise ? expertise.split(",").map((e) => e.trim()).filter(Boolean) : [];

    const { error } = await supabaseAdmin.from("mentors").update({
        name,
        tagline,
        bio,
        expertise: expertiseArr,
        cal_username,
        linkedin_url,
        photo_url,
        session_price: session_price ? parseFloat(session_price) : null,
        years_experience: years_experience ? parseInt(years_experience) : null,
        is_featured,
    }).eq("id", id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/admin/mentors");
    revalidatePath("/mentors");
    redirect("/admin/mentors");
}

export async function deleteMentor(id: string) {
    const { error } = await supabaseAdmin.from("mentors").delete().eq("id", id);
    if (error) {
        return { error: error.message };
    }
    revalidatePath("/admin/mentors");
    revalidatePath("/mentors");
}
