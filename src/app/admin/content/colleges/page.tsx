import { supabaseAdmin } from "@/lib/supabase/admin";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

async function deleteCollege(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await supabaseAdmin.from("colleges").delete().eq("id", id);
    revalidatePath("/admin/content/colleges");
    revalidatePath("/explore/colleges");
}

export default async function AdminCollegesPage() {
    let colleges: any[] = [];
    try {
        const { data } = await supabaseAdmin.from("colleges").select("*").order("created_at", { ascending: false });
        colleges = data || [];
    } catch { }

    return (
        <div>
            <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
                <h1 className="text-4xl font-black uppercase">
                    Colleges <span className="text-[var(--color-primary-blue)]">({colleges.length})</span>
                </h1>
                <Link
                    href="/admin/content/colleges/new"
                    className="brutal-btn bg-[#4ade80] px-6 py-3 font-black uppercase text-black"
                >
                    + Add College
                </Link>
            </div>

            <div className="bg-white border-4 border-black brutal-shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-black text-white uppercase text-sm font-black border-b-4 border-black">
                            <th className="p-4 border-r-4 border-black">Institution</th>
                            <th className="p-4 border-r-4 border-black">Location</th>
                            <th className="p-4 border-r-4 border-black">Ranking</th>
                            <th className="p-4 border-r-4 border-black">Created</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {colleges.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center font-bold text-xl uppercase">
                                    No colleges added yet.
                                </td>
                            </tr>
                        ) : (
                            colleges.map((college) => (
                                <tr key={college.id} className="border-b-4 border-black hover:bg-[var(--color-bg)] transition-colors">
                                    <td className="p-4 border-r-4 border-black font-bold uppercase">
                                        {college.name}<br />
                                        <span className="brutal-badge border-black bg-[var(--color-primary-yellow)] mt-1">{college.type || 'University'}</span>
                                    </td>
                                    <td className="p-4 border-r-4 border-black font-bold uppercase text-sm">
                                        {college.city}, {college.state}
                                    </td>
                                    <td className="p-4 border-r-4 border-black font-black uppercase">
                                        {college.ranking ? `#${college.ranking}` : 'N/A'}
                                    </td>
                                    <td className="p-4 border-r-4 border-black text-sm font-bold opacity-70">
                                        {college.created_at ? formatDistanceToNow(new Date(college.created_at), { addSuffix: true }) : 'N/A'}
                                    </td>
                                    <td className="p-4 flex gap-2">
                                        <Link href={`/explore/colleges/${college.slug}`} className="px-3 py-1 border-2 border-black bg-white font-bold text-sm brutal-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all" target="_blank">
                                            VIEW
                                        </Link>
                                        <form action={deleteCollege}>
                                            <input type="hidden" name="id" value={college.id} />
                                            <button type="submit" className="px-3 py-1 border-2 border-black bg-[#f43f5e] text-white font-bold text-sm brutal-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all" onClick={(e) => { if (!confirm(`Delete "${college.name}"?`)) e.preventDefault(); }}>DEL</button>
                                        </form>
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
