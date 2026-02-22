import { supabaseAdmin } from "@/lib/supabase/admin";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

export default async function AdminCareersPage() {
    const { data: careers } = await supabaseAdmin
        .from("career_profiles")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div>
            <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
                <h1 className="text-4xl font-black uppercase">
                    Careers <span className="text-[var(--color-primary-blue)]">({careers?.length || 0})</span>
                </h1>
                <Link
                    href="/admin/content/careers/new"
                    className="brutal-btn bg-[var(--color-primary-yellow)] px-6 py-3 font-black uppercase"
                >
                    + Add Career
                </Link>
            </div>

            <div className="bg-white border-4 border-black brutal-shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-black text-white uppercase text-sm font-black border-b-4 border-black">
                            <th className="p-4 border-r-4 border-black">Title</th>
                            <th className="p-4 border-r-4 border-black">Slug</th>
                            <th className="p-4 border-r-4 border-black">Views</th>
                            <th className="p-4 border-r-4 border-black">Created</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!careers || careers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center font-bold text-xl uppercase">
                                    No careers found. Start adding some!
                                </td>
                            </tr>
                        ) : (
                            careers.map((career) => (
                                <tr key={career.id} className="border-b-4 border-black hover:bg-[var(--color-bg)] transition-colors">
                                    <td className="p-4 border-r-4 border-black font-bold uppercase">
                                        {career.icon} {career.title}
                                    </td>
                                    <td className="p-4 border-r-4 border-black font-mono text-sm">
                                        /{career.slug}
                                    </td>
                                    <td className="p-4 border-r-4 border-black font-black">
                                        {career.view_count || 0}
                                    </td>
                                    <td className="p-4 border-r-4 border-black text-sm font-bold opacity-70">
                                        {career.created_at ? formatDistanceToNow(new Date(career.created_at), { addSuffix: true }) : 'N/A'}
                                    </td>
                                    <td className="p-4 flex gap-2">
                                        <Link href={`/explore/careers/${career.slug}`} className="px-3 py-1 border-2 border-black bg-white font-bold text-sm brutal-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all" target="_blank">
                                            VIEW
                                        </Link>
                                        <button className="px-3 py-1 border-2 border-black bg-[#f43f5e] text-white font-bold text-sm brutal-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                                            DEL
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
