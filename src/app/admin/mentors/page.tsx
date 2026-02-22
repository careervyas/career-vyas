import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { deleteMentor } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminMentorsPage() {
    let mentors: any[] = [];
    try {
        const { data } = await supabaseAdmin
            .from("mentors")
            .select("*")
            .order("created_at", { ascending: false });
        mentors = data || [];
    } catch { }

    return (
        <div>
            <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
                <h1 className="text-4xl font-black uppercase">
                    Mentors <span className="text-[var(--color-primary-blue)]">({mentors.length})</span>
                </h1>
                <Link
                    href="/admin/mentors/new"
                    className="bg-black text-white border-4 border-black px-6 py-3 font-black uppercase brutal-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                    + ADD MENTOR
                </Link>
            </div>

            {mentors.length === 0 ? (
                <div className="border-4 border-black border-dashed p-16 text-center">
                    <p className="text-3xl font-black uppercase opacity-30 mb-4">NO MENTORS YET</p>
                    <Link href="/admin/mentors/new" className="brutal-btn bg-[var(--color-primary-yellow)] px-8 py-3 font-black uppercase">
                        Add Your First Mentor
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {mentors.map((mentor) => (
                        <div key={mentor.id} className="bg-white border-4 border-black brutal-shadow-sm flex flex-col">
                            {/* Card Header */}
                            <div className="flex items-center gap-4 p-5 border-b-4 border-black bg-[var(--color-bg)]">
                                {mentor.photo_url ? (
                                    <img src={mentor.photo_url} alt={mentor.name} className="w-16 h-16 rounded-full border-4 border-black object-cover flex-shrink-0" />
                                ) : (
                                    <div className="w-16 h-16 rounded-full border-4 border-black bg-[var(--color-primary-yellow)] flex items-center justify-center text-2xl font-black flex-shrink-0">
                                        {mentor.name?.[0] || "?"}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-black text-xl uppercase truncate">{mentor.name}</p>
                                    <p className="font-bold text-sm text-black/70 truncate">{mentor.tagline}</p>
                                    {mentor.is_featured && (
                                        <span className="brutal-badge bg-[var(--color-primary-yellow)] border-black text-xs">⭐ FEATURED</span>
                                    )}
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-5 flex-1 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="font-black uppercase text-xs text-black/50 mb-1">Cal.com Handle</p>
                                    <p className="font-bold font-mono">{mentor.cal_username || "—"}</p>
                                </div>
                                <div>
                                    <p className="font-black uppercase text-xs text-black/50 mb-1">Experience</p>
                                    <p className="font-bold">{mentor.years_experience ? `${mentor.years_experience} years` : "—"}</p>
                                </div>
                                <div>
                                    <p className="font-black uppercase text-xs text-black/50 mb-1">Session Price</p>
                                    <p className="font-bold">{mentor.session_price ? `₹${mentor.session_price}` : "Free"}</p>
                                </div>
                                <div>
                                    <p className="font-black uppercase text-xs text-black/50 mb-1">Expertise</p>
                                    <p className="font-bold truncate">{(mentor.expertise || []).slice(0, 2).join(", ") || "—"}</p>
                                </div>
                            </div>

                            {/* Card Actions */}
                            <div className="flex border-t-4 border-black">
                                <Link
                                    href={`/admin/mentors/${mentor.id}/edit`}
                                    className="flex-1 text-center py-3 font-black uppercase text-sm border-r-4 border-black hover:bg-[var(--color-primary-yellow)] transition-colors"
                                >
                                    ✏️ EDIT
                                </Link>
                                <Link
                                    href={`/mentors/${mentor.id}`}
                                    target="_blank"
                                    className="flex-1 text-center py-3 font-black uppercase text-sm border-r-4 border-black hover:bg-[var(--color-primary-blue)] hover:text-white transition-colors"
                                >
                                    👁️ VIEW
                                </Link>
                                <form
                                    action={async () => {
                                        "use server";
                                        await deleteMentor(mentor.id);
                                    }}
                                    className="flex-1"
                                >
                                    <button
                                        type="submit"
                                        className="w-full py-3 font-black uppercase text-sm hover:bg-[#f43f5e] hover:text-white transition-colors"
                                        onClick={(e) => {
                                            if (!confirm(`Delete ${mentor.name}?`)) e.preventDefault();
                                        }}
                                    >
                                        🗑️ DELETE
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
