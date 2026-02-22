import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { updateMentor } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditMentorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    let mentor: any = null;
    try {
        const { data } = await supabaseAdmin.from("mentors").select("*").eq("id", id).single();
        mentor = data;
    } catch { }

    if (!mentor) notFound();

    const updateWithId = updateMentor.bind(null, id);

    return (
        <div>
            <div className="flex items-center gap-4 mb-8 border-b-4 border-black pb-4">
                <Link href="/admin/mentors" className="border-4 border-black px-4 py-2 font-black hover:bg-black hover:text-white transition-colors">
                    ← BACK
                </Link>
                <h1 className="text-4xl font-black uppercase">Edit Mentor</h1>
                <span className="bg-[var(--color-primary-orange)] border-2 border-black px-3 py-1 font-black text-sm uppercase brutal-shadow-sm">{mentor.name}</span>
            </div>

            <form action={updateWithId} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                    <div className="bg-white border-4 border-black p-6 brutal-shadow-sm">
                        <h2 className="text-xl font-black uppercase border-b-4 border-black pb-3 mb-5">Basic Info</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block font-black uppercase text-sm mb-2">Full Name *</label>
                                <input name="name" required defaultValue={mentor.name} className="w-full border-4 border-black p-3 font-bold bg-[var(--color-bg)] focus:outline-none focus:bg-[var(--color-primary-yellow)] transition-colors" />
                            </div>
                            <div>
                                <label className="block font-black uppercase text-sm mb-2">Tagline *</label>
                                <input name="tagline" required defaultValue={mentor.tagline} className="w-full border-4 border-black p-3 font-bold bg-[var(--color-bg)] focus:outline-none focus:bg-[var(--color-primary-yellow)] transition-colors" />
                            </div>
                            <div>
                                <label className="block font-black uppercase text-sm mb-2">Bio</label>
                                <textarea name="bio" rows={4} defaultValue={mentor.bio || ""} className="w-full border-4 border-black p-3 font-bold bg-[var(--color-bg)] focus:outline-none focus:bg-[var(--color-primary-yellow)] transition-colors resize-none" />
                            </div>
                            <div>
                                <label className="block font-black uppercase text-sm mb-2">Expertise (comma-separated)</label>
                                <input name="expertise" defaultValue={(mentor.expertise || []).join(", ")} className="w-full border-4 border-black p-3 font-bold bg-[var(--color-bg)] focus:outline-none focus:bg-[var(--color-primary-yellow)] transition-colors" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border-4 border-black p-6 brutal-shadow-sm">
                        <h2 className="text-xl font-black uppercase border-b-4 border-black pb-3 mb-5">Profile Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block font-black uppercase text-sm mb-2">Photo URL</label>
                                {mentor.photo_url && (
                                    <img src={mentor.photo_url} alt={mentor.name} className="w-20 h-20 rounded-full border-4 border-black object-cover mb-3" />
                                )}
                                <input name="photo_url" defaultValue={mentor.photo_url || ""} placeholder="https://..." className="w-full border-4 border-black p-3 font-bold bg-[var(--color-bg)] focus:outline-none focus:bg-[var(--color-primary-yellow)] transition-colors" />
                            </div>
                            <div>
                                <label className="block font-black uppercase text-sm mb-2">LinkedIn URL</label>
                                <input name="linkedin_url" defaultValue={mentor.linkedin_url || ""} placeholder="https://linkedin.com/in/..." className="w-full border-4 border-black p-3 font-bold bg-[var(--color-bg)] focus:outline-none focus:bg-[var(--color-primary-yellow)] transition-colors" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <div className="bg-white border-4 border-black p-6 brutal-shadow-sm">
                        <h2 className="text-xl font-black uppercase border-b-4 border-black pb-3 mb-5">Booking Settings</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block font-black uppercase text-sm mb-2">Cal.com Username</label>
                                <div className="flex">
                                    <span className="border-4 border-r-0 border-black px-3 py-3 font-bold bg-black text-white text-sm">cal.com/</span>
                                    <input name="cal_username" defaultValue={mentor.cal_username || ""} className="flex-1 border-4 border-black p-3 font-bold bg-[var(--color-bg)] focus:outline-none focus:bg-[var(--color-primary-yellow)] transition-colors" />
                                </div>
                            </div>
                            <div>
                                <label className="block font-black uppercase text-sm mb-2">Session Price (₹)</label>
                                <input name="session_price" type="number" min="0" defaultValue={mentor.session_price || ""} className="w-full border-4 border-black p-3 font-bold bg-[var(--color-bg)] focus:outline-none focus:bg-[var(--color-primary-yellow)] transition-colors" />
                            </div>
                            <div>
                                <label className="block font-black uppercase text-sm mb-2">Years of Experience</label>
                                <input name="years_experience" type="number" min="0" max="50" defaultValue={mentor.years_experience || ""} className="w-full border-4 border-black p-3 font-bold bg-[var(--color-bg)] focus:outline-none focus:bg-[var(--color-primary-yellow)] transition-colors" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--color-primary-yellow)] border-4 border-black p-6 brutal-shadow-sm">
                        <h2 className="text-xl font-black uppercase border-b-4 border-black pb-3 mb-5">Visibility</h2>
                        <label className="flex items-center gap-4 cursor-pointer">
                            <input name="is_featured" type="checkbox" defaultChecked={mentor.is_featured} className="w-6 h-6 border-4 border-black accent-black cursor-pointer" />
                            <div>
                                <p className="font-black uppercase">Feature this Mentor</p>
                                <p className="font-bold text-sm text-black/70">Featured mentors appear prominently on the Mentors page</p>
                            </div>
                        </label>
                    </div>

                    <div className="flex gap-4">
                        <Link href="/admin/mentors" className="flex-1 text-center py-4 border-4 border-black font-black uppercase hover:bg-black hover:text-white transition-colors">
                            CANCEL
                        </Link>
                        <button type="submit" className="flex-1 py-4 bg-[var(--color-primary-blue)] text-white border-4 border-black font-black uppercase brutal-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                            SAVE CHANGES
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
