import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabaseAdmin } from "@/lib/supabase/admin";
import ShareButtons from "@/components/explore/ShareButtons";
import { format } from "date-fns";
import { BookOpen, Target, GraduationCap, Calendar, ExternalLink } from "lucide-react";
import PageTracker from "@/components/PageTracker";

export const dynamic = "force-dynamic";

async function getExamAndRelations(slug: string) {
    const { data: exam, error } = await supabaseAdmin
        .from("exams")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error || !exam) return null;

    const { data: rels } = await supabaseAdmin
        .from("content_relationships")
        .select("*")
        .eq("source_type", "exam")
        .eq("source_id", exam.id);
    const { data: revRels } = await supabaseAdmin
        .from("content_relationships")
        .select("*")
        .eq("target_type", "exam")
        .eq("target_id", exam.id);

    const allRels = [...(rels || []), ...(revRels || [])];
    const linkedCourses: { slug: string; title: string }[] = [];
    const linkedColleges: { slug: string; name: string }[] = [];

    for (const rel of allRels) {
        if (rel.target_type === "course" || rel.source_type === "course") {
            const s = rel.target_type === "course" ? rel.target_slug : rel.source_slug;
            if (s && !linkedCourses.find(c => c.slug === s)) {
                const { data } = await supabaseAdmin.from("courses").select("slug, title").eq("slug", s).single();
                if (data) linkedCourses.push(data);
            }
        }
        if (rel.target_type === "college" || rel.source_type === "college") {
            const s = rel.target_type === "college" ? rel.target_slug : rel.source_slug;
            if (s && !linkedColleges.find(c => c.slug === s)) {
                const { data } = await supabaseAdmin.from("colleges").select("slug, name").eq("slug", s).single();
                if (data) linkedColleges.push(data);
            }
        }
    }

    return { exam, linkedCourses, linkedColleges };
}

export default async function ExamProfilePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const data = await getExamAndRelations(slug);
    if (!data) notFound();

    const { exam, linkedCourses, linkedColleges } = data;

    return (
        <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans">
            <Navbar />
            <PageTracker activityType="PAGE_VIEW" contentType="EXAM PROFILE" contentId={exam.name} />

            <article className="pt-32 pb-24 min-h-[85vh] relative overflow-hidden">
                <div className="absolute top-20 right-10 w-64 h-64 bg-rose-200 rounded-full blur-[100px] opacity-30 hidden md:block" />
                <div className="absolute bottom-40 left-10 w-72 h-72 bg-pink-200 rounded-full blur-[100px] opacity-30 hidden md:block" />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

                    <Link href="/explore/exams" className="inline-flex items-center gap-2 font-semibold text-sm text-rose-500 mb-8 hover:underline underline-offset-4 transition-colors">
                        <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        All Exams
                    </Link>

                    <header className="mb-12 border-b border-[var(--color-border)] pb-8">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <div className="flex flex-wrap gap-2">
                                <span className="modern-badge bg-rose-50 text-rose-700">{exam.level || 'National Level'}</span>
                                {exam.category && <span className="modern-badge bg-indigo-50 text-indigo-700">{exam.category}</span>}
                            </div>
                            <ShareButtons title={exam.name} path={`/explore/exams/${slug}`} />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-2 text-rose-500">{exam.name}</h1>
                        <p className="text-xl font-medium text-[var(--color-text-muted)] mb-8">{exam.full_form}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                            <div className="modern-card p-5 bg-amber-50 border-amber-100 text-center">
                                <Calendar size={24} className="mx-auto mb-2 text-amber-500" />
                                <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-1">Date</p>
                                <p className="text-lg font-bold text-amber-800">{exam.exam_date ? format(new Date(exam.exam_date), 'MMM dd, yyyy') : 'TBA'}</p>
                            </div>
                            <div className="modern-card p-5 bg-indigo-50 border-indigo-100 text-center">
                                <Target size={24} className="mx-auto mb-2 text-indigo-500" />
                                <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-1">Mode</p>
                                <p className="text-lg font-bold text-indigo-800">{exam.mode || 'Online CBT'}</p>
                            </div>
                            <div className="modern-card p-5 text-center">
                                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-1">Official Site</p>
                                {exam.website ? (
                                    <a href={exam.website} target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-[var(--color-primary-indigo)] underline hover:text-rose-500 transition-colors">Link ↗</a>
                                ) : (
                                    <p className="text-lg font-bold text-[var(--color-text-muted)]">N/A</p>
                                )}
                            </div>
                        </div>

                        <div className="modern-card p-6">
                            <p className="text-lg font-medium leading-relaxed text-[var(--color-text-muted)]">
                                {exam.description || 'Centralized entrance examination.'}
                            </p>
                        </div>
                    </header>

                    {/* Overview */}
                    {exam.overview && (
                        <section className="modern-card p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-[var(--color-text)] flex items-center gap-3">
                                <BookOpen size={24} className="text-rose-500" /> About This Exam
                            </h2>
                            <div className="prose prose-lg max-w-none text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">
                                {exam.overview}
                            </div>
                        </section>
                    )}

                    {/* Eligibility */}
                    {exam.eligibility && (
                        <section className="modern-card p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-[var(--color-text)] flex items-center gap-3">
                                <GraduationCap size={24} className="text-indigo-500" /> Eligibility Criteria
                            </h2>
                            <div className="prose max-w-none text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">
                                {exam.eligibility}
                            </div>
                        </section>
                    )}

                    {/* Exam Pattern */}
                    {exam.exam_pattern && (
                        <section className="modern-card p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-[var(--color-text)]">📋 Exam Pattern</h2>
                            <div className="prose max-w-none text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">
                                {exam.exam_pattern}
                            </div>
                        </section>
                    )}

                    {/* Syllabus */}
                    {exam.syllabus && (
                        <section className="modern-card p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-[var(--color-text)]">📖 Syllabus</h2>
                            <div className="prose max-w-none text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">
                                {exam.syllabus}
                            </div>
                        </section>
                    )}

                    {/* Important Dates */}
                    {exam.important_dates && (
                        <section className="modern-card p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-[var(--color-text)]">📅 Important Dates</h2>
                            <div className="prose max-w-none text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">
                                {exam.important_dates}
                            </div>
                        </section>
                    )}

                    {/* Preparation Tips */}
                    {exam.preparation_tips && (
                        <section className="modern-card p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-[var(--color-text)]">💡 Preparation Tips</h2>
                            <div className="prose max-w-none text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">
                                {exam.preparation_tips}
                            </div>
                        </section>
                    )}

                    {/* Linked Content */}
                    {(linkedCourses.length > 0 || linkedColleges.length > 0) && (
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold mb-6 text-[var(--color-text)]">Related Content</h2>
                            {linkedCourses.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-3 text-[var(--color-text-muted)]">📚 Courses This Exam Unlocks</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {linkedCourses.map(c => (
                                            <Link key={c.slug} href={`/explore/courses/${c.slug}`} className="modern-badge bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors flex items-center gap-1">
                                                {c.title} <ExternalLink size={12} />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {linkedColleges.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 text-[var(--color-text-muted)]">🏫 Colleges Accepting This Exam</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {linkedColleges.map(c => (
                                            <Link key={c.slug} href={`/explore/colleges/${c.slug}`} className="modern-badge bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors flex items-center gap-1">
                                                {c.name} <ExternalLink size={12} />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {/* Mentor CTA */}
                    <div className="mt-16 modern-card p-8 bg-gradient-to-r from-rose-500 to-pink-600 text-white flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div>
                            <p className="text-2xl font-bold">Lacking Prep Strategy?</p>
                            <p className="font-medium mt-2 text-rose-100">Connect with toppers who have already cracked this exam.</p>
                        </div>
                        <Link href="/mentors" className="bg-white text-rose-600 px-8 py-3 rounded-full text-center font-semibold w-full sm:w-auto whitespace-nowrap hover:bg-rose-50 transition-colors shadow-lg">
                            Find Mentor →
                        </Link>
                    </div>

                </div>
            </article>

            <Footer />
        </main>
    );
}
