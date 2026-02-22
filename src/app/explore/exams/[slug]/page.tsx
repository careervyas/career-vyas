import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabaseAdmin } from "@/lib/supabase/admin";
import ShareButtons from "@/components/explore/ShareButtons";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

async function getExamAndRelations(slug: string) {
    const { data: exam, error } = await supabaseAdmin
        .from("exams")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error || !exam) return null;

    // Fetch Relationships
    const { data: relations } = await supabaseAdmin
        .from("content_relationships")
        .select("*")
        .eq("source_type", "exam")
        .eq("source_id", exam.id);

    return { exam, relations: relations || [] };
}

export default async function ExamProfilePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const data = await getExamAndRelations(slug);

    if (!data) notFound();

    const { exam } = data;

    return (
        <main className="min-h-screen bg-[var(--color-bg)] text-black font-sans">
            <Navbar />

            <article className="pt-32 pb-24 min-h-[85vh] relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

                    <Link href="/explore/exams" className="inline-flex items-center gap-2 font-bold uppercase mb-8 hover:underline decoration-4 underline-offset-4 text-[#f43f5e]">
                        <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        ALL EXAMS
                    </Link>

                    <header className="mb-12 border-b-4 border-black pb-8">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <span className="brutal-badge border-black bg-white text-black">
                                {exam.level || 'National Level'}
                            </span>
                            <ShareButtons title={exam.name} path={`/explore/exams/${slug}`} />
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-[1.1] mb-2 text-[#f43f5e] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                            {exam.name}
                        </h1>
                        <p className="text-2xl font-bold text-black/60 mb-8">{exam.full_form}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                            <div className="bg-[var(--color-primary-yellow)] border-4 border-black p-4 brutal-shadow-sm flex flex-col justify-center items-center text-center">
                                <p className="font-black text-xs uppercase opacity-70 mb-1">Date</p>
                                <p className="text-xl font-bold uppercase">{exam.exam_date ? format(new Date(exam.exam_date), 'MMM dd, yyyy') : 'TBA'}</p>
                            </div>
                            <div className="bg-[var(--color-primary-blue)] text-white border-4 border-black p-4 brutal-shadow-sm flex flex-col justify-center items-center text-center">
                                <p className="font-black text-xs uppercase opacity-70 mb-1">Mode</p>
                                <p className="text-xl font-bold uppercase">{exam.mode || 'Online CBT'}</p>
                            </div>
                            <div className="bg-white border-4 border-black p-4 brutal-shadow-sm flex flex-col justify-center items-center text-center">
                                <p className="font-black text-xs uppercase opacity-70 mb-1">Official Site</p>
                                {exam.website ? (
                                    <a href={exam.website} target="_blank" rel="noopener noreferrer" className="text-lg font-bold underline hover:text-[#f43f5e]">Link ↗</a>
                                ) : (
                                    <p className="text-lg font-bold">N/A</p>
                                )}
                            </div>
                        </div>

                        <p className="text-xl font-bold bg-white border-4 border-black p-6 brutal-shadow-sm leading-relaxed">
                            {exam.description || 'Centralized entrance examination for admission into premier institutes.'}
                        </p>
                    </header>

                    <section className="bg-white border-4 border-black p-8 brutal-shadow-sm mb-12">
                        <h2 className="text-3xl font-black uppercase mb-6 border-b-4 border-black pb-2 inline-block">
                            Syllabus & Pattern
                        </h2>
                        <div className="prose prose-lg max-w-none prose-p:font-bold prose-p:text-black/80 prose-p:leading-relaxed whitespace-pre-wrap">
                            {exam.syllabus || "Syllabus details are currently being updated for the latest examination cycle."}
                        </div>
                    </section>

                    {/* Relational Content */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-[var(--color-bg)] border-4 border-black p-6 flex flex-col justify-between hover:bg-[var(--color-primary-blue)] hover:text-white transition-colors group">
                            <div>
                                <h3 className="text-2xl font-black uppercase mb-2 border-b-2 border-black group-hover:border-white pb-1">Target Courses</h3>
                                <p className="font-bold text-sm tracking-wide">The degree programs this exam unlocks.</p>
                            </div>
                            <button className="mt-6 border-2 border-black group-hover:bg-white group-hover:text-black w-full py-3 font-black uppercase text-sm">Explore Courses</button>
                        </div>

                        <div className="bg-[var(--color-bg)] border-4 border-black p-6 flex flex-col justify-between hover:bg-[var(--color-primary-orange)] hover:text-black transition-colors group">
                            <div>
                                <h3 className="text-2xl font-black uppercase mb-2 border-b-2 border-black pb-1">Accepting Colleges</h3>
                                <p className="font-bold text-sm tracking-wide">Institutes that accept this exam&apos;s scores.</p>
                            </div>
                            <button className="mt-6 border-2 border-black group-hover:bg-black group-hover:text-white w-full py-3 font-black uppercase text-sm">View Colleges</button>
                        </div>
                    </section>

                    <div className="mt-16 bg-black border-4 border-[#f43f5e] p-8 brutal-shadow flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div className="text-white">
                            <p className="font-black uppercase text-3xl">LACKING PREP STRATEGY?</p>
                            <p className="font-bold mt-2 text-white/80">Connect with toppers who have already cracked this exam.</p>
                        </div>
                        <Link
                            href="/mentors"
                            className="brutal-btn bg-[#f43f5e] text-white border-white px-8 py-4 text-center text-xl w-full sm:w-auto font-black uppercase whitespace-nowrap"
                        >
                            FIND MENTOR
                        </Link>
                    </div>

                </div>
            </article>

            <Footer />
        </main>
    );
}
