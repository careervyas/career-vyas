import { supabaseAdmin } from "@/lib/supabase/admin";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

async function deleteExam(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await supabaseAdmin.from("exams").delete().eq("id", id);
    revalidatePath("/admin/content/exams");
    revalidatePath("/explore/exams");
}

export default async function AdminExamsPage() {
    let exams: any[] = [];
    try {
        const { data } = await supabaseAdmin.from("exams").select("*").order("created_at", { ascending: false });
        exams = data || [];
    } catch { }

    return (
        <div>
            <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
                <h1 className="text-4xl font-black uppercase">
                    Exams <span className="text-[var(--color-primary-blue)]">({exams.length})</span>
                </h1>
                <Link
                    href="/admin/content/exams/new"
                    className="brutal-btn bg-[#f43f5e] px-6 py-3 font-black uppercase text-white"
                >
                    + Add Exam
                </Link>
            </div>

            <div className="bg-white border-4 border-black brutal-shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-black text-white uppercase text-sm font-black border-b-4 border-black">
                            <th className="p-4 border-r-4 border-black">Exam Name</th>
                            <th className="p-4 border-r-4 border-black">Level</th>
                            <th className="p-4 border-r-4 border-black">Date</th>
                            <th className="p-4 border-r-4 border-black">Created</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exams.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center font-bold text-xl uppercase">
                                    No exams mapped yet.
                                </td>
                            </tr>
                        ) : (
                            exams.map((exam) => (
                                <tr key={exam.id} className="border-b-4 border-black hover:bg-[var(--color-bg)] transition-colors">
                                    <td className="p-4 border-r-4 border-black font-bold uppercase">
                                        {exam.name}<br />
                                        <span className="text-sm normal-case text-black/60 font-bold">{exam.full_form}</span>
                                    </td>
                                    <td className="p-4 border-r-4 border-black font-black uppercase">
                                        <span className="brutal-badge border-black bg-[var(--color-bg)]">{exam.level || 'National'}</span>
                                    </td>
                                    <td className="p-4 border-r-4 border-black font-bold text-sm">
                                        {exam.exam_date || 'TBA'}
                                    </td>
                                    <td className="p-4 border-r-4 border-black text-sm font-bold opacity-70">
                                        {exam.created_at ? formatDistanceToNow(new Date(exam.created_at), { addSuffix: true }) : 'N/A'}
                                    </td>
                                    <td className="p-4 flex gap-2">
                                        <Link href={`/explore/exams/${exam.slug}`} className="px-3 py-1 border-2 border-black bg-white font-bold text-sm brutal-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all" target="_blank">
                                            VIEW
                                        </Link>
                                        <form action={deleteExam}>
                                            <input type="hidden" name="id" value={exam.id} />
                                            <button type="submit" className="px-3 py-1 border-2 border-black bg-[#f43f5e] text-white font-bold text-sm brutal-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all" onClick={(e) => { if (!confirm(`Delete "${exam.name}"?`)) e.preventDefault(); }}>DEL</button>
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
