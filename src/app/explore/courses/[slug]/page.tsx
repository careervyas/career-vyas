import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabaseAdmin } from "@/lib/supabase/admin";
import ShareButtons from "@/components/explore/ShareButtons";
import { GraduationCap, Clock, BookOpen, Briefcase, Building2, FileText, ExternalLink } from "lucide-react";
import PageTracker from "@/components/PageTracker";

export const dynamic = "force-dynamic";

async function getCourseAndRelations(slug: string) {
    const { data: course, error } = await supabaseAdmin
        .from("courses")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error || !course) return null;

    // Get direct + reverse relationships
    const { data: rels } = await supabaseAdmin
        .from("content_relationships")
        .select("*")
        .eq("source_type", "course")
        .eq("source_id", course.id);
    const { data: revRels } = await supabaseAdmin
        .from("content_relationships")
        .select("*")
        .eq("target_type", "course")
        .eq("target_id", course.id);

    const allRels = [...(rels || []), ...(revRels || [])];
    const linkedColleges: { slug: string; name: string }[] = [];
    const linkedExams: { slug: string; name: string }[] = [];
    const linkedCareers: { slug: string; title: string }[] = [];

    for (const rel of allRels) {
        if (rel.target_type === "college" || rel.source_type === "college") {
            const s = rel.target_type === "college" ? rel.target_slug : rel.source_slug;
            if (s && !linkedColleges.find(c => c.slug === s)) {
                const { data } = await supabaseAdmin.from("colleges").select("slug, name").eq("slug", s).single();
                if (data) linkedColleges.push(data);
            }
        }
        if (rel.target_type === "exam" || rel.source_type === "exam") {
            const s = rel.target_type === "exam" ? rel.target_slug : rel.source_slug;
            if (s && !linkedExams.find(e => e.slug === s)) {
                const { data } = await supabaseAdmin.from("exams").select("slug, name").eq("slug", s).single();
                if (data) linkedExams.push(data);
            }
        }
        if (rel.target_type === "career" || rel.source_type === "career") {
            const s = rel.target_type === "career" ? rel.target_slug : rel.source_slug;
            if (s && !linkedCareers.find(c => c.slug === s)) {
                const { data } = await supabaseAdmin.from("career_profiles").select("slug, title").eq("slug", s).single();
                if (data) linkedCareers.push(data);
            }
        }
    }

    return { course, linkedColleges, linkedExams, linkedCareers };
}

export default async function CourseProfilePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const data = await getCourseAndRelations(slug);
    if (!data) notFound();

    const { course, linkedColleges, linkedExams, linkedCareers } = data;

    return (
        <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans">
            <Navbar />
            <PageTracker activityType="PAGE_VIEW" contentType="COURSE PROFILE" contentId={course.title} />

            <article className="pt-32 pb-24 min-h-[85vh] relative overflow-hidden">
                <div className="absolute top-20 left-10 w-64 h-64 bg-purple-200 rounded-full blur-[100px] opacity-30 hidden md:block" />
                <div className="absolute bottom-40 right-10 w-72 h-72 bg-violet-200 rounded-full blur-[100px] opacity-30 hidden md:block" />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

                    <Link href="/explore/courses" className="inline-flex items-center gap-2 font-semibold text-sm text-[var(--color-purple)] mb-8 hover:underline underline-offset-4 transition-colors">
                        <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        All Courses
                    </Link>

                    <header className="mb-12 border-b border-[var(--color-border)] pb-8">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <span className="modern-badge bg-purple-50 text-purple-700">
                                {course.type || 'Degree path'}
                            </span>
                            <ShareButtons title={course.title} path={`/explore/courses/${slug}`} />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 leading-[1.1] text-[var(--color-text)]">
                            {course.title}
                        </h1>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="modern-card p-5 text-center">
                                <Clock size={24} className="mx-auto mb-2 text-purple-400" />
                                <p className="text-xs font-semibold uppercase text-[var(--color-text-muted)] tracking-widest mb-1">Duration</p>
                                <p className="text-lg font-bold text-[var(--color-text)]">{course.duration || '3-4 Years'}</p>
                            </div>
                            <div className="modern-card p-5 text-center">
                                <GraduationCap size={24} className="mx-auto mb-2 text-indigo-400" />
                                <p className="text-xs font-semibold uppercase text-[var(--color-text-muted)] tracking-widest mb-1">Eligibility</p>
                                <p className="text-sm font-bold text-[var(--color-text)] leading-tight">{course.eligibility || '10+2 / Equivalent'}</p>
                            </div>
                            {course.fee_range && (
                                <div className="modern-card p-5 text-center">
                                    <FileText size={24} className="mx-auto mb-2 text-amber-400" />
                                    <p className="text-xs font-semibold uppercase text-[var(--color-text-muted)] tracking-widest mb-1">Fee Range</p>
                                    <p className="text-sm font-bold text-[var(--color-text)]">{course.fee_range}</p>
                                </div>
                            )}
                        </div>

                        <div className="modern-card p-6 bg-emerald-50 border-emerald-100">
                            <p className="text-lg font-medium leading-relaxed text-emerald-800">
                                {course.description || 'A comprehensive academic program.'}
                            </p>
                        </div>
                    </header>

                    {/* Overview */}
                    {course.overview && (
                        <section className="modern-card p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-[var(--color-text)] flex items-center gap-3">
                                <BookOpen size={24} className="text-purple-500" /> Course Overview
                            </h2>
                            <div className="prose prose-lg max-w-none text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">
                                {course.overview}
                            </div>
                        </section>
                    )}

                    {/* Syllabus */}
                    {course.syllabus && (
                        <section className="modern-card p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-[var(--color-text)] flex items-center gap-3">
                                <FileText size={24} className="text-indigo-500" /> Syllabus & Curriculum
                            </h2>
                            <div className="prose prose-lg max-w-none text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">
                                {course.syllabus}
                            </div>
                        </section>
                    )}

                    {/* Career Prospects */}
                    {course.career_prospects && (
                        <section className="modern-card p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-[var(--color-text)] flex items-center gap-3">
                                <Briefcase size={24} className="text-emerald-500" /> Career Prospects
                            </h2>
                            <div className="prose prose-lg max-w-none text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">
                                {course.career_prospects}
                            </div>
                        </section>
                    )}

                    {/* Entrance Exams */}
                    {course.entrance_exams && (
                        <section className="modern-card p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-[var(--color-text)]">🎯 Entrance Exams</h2>
                            <div className="prose max-w-none text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">
                                {course.entrance_exams}
                            </div>
                        </section>
                    )}

                    {/* Program Details fallback */}
                    {!course.overview && !course.syllabus && course.details && (
                        <section className="modern-card p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-6 text-[var(--color-text)]">Program Details</h2>
                            <div className="prose prose-lg max-w-none text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">
                                {course.details}
                            </div>
                        </section>
                    )}

                    {/* Linked Content */}
                    {(linkedColleges.length > 0 || linkedExams.length > 0 || linkedCareers.length > 0) && (
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold mb-6 text-[var(--color-text)]">Related Content</h2>
                            {linkedColleges.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-3 text-[var(--color-text-muted)]">🏫 Colleges Offering This Course</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {linkedColleges.map(c => (
                                            <Link key={c.slug} href={`/explore/colleges/${c.slug}`} className="modern-badge bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors flex items-center gap-1">
                                                {c.name} <ExternalLink size={12} />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {linkedExams.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-3 text-[var(--color-text-muted)]">📝 Entrance Exams for Admission</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {linkedExams.map(e => (
                                            <Link key={e.slug} href={`/explore/exams/${e.slug}`} className="modern-badge bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors flex items-center gap-1">
                                                {e.name} <ExternalLink size={12} />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {linkedCareers.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 text-[var(--color-text-muted)]">💼 Career Paths After This Course</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {linkedCareers.map(c => (
                                            <Link key={c.slug} href={`/explore/careers/${c.slug}`} className="modern-badge bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors flex items-center gap-1">
                                                {c.title} <ExternalLink size={12} />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {/* Mentor CTA */}
                    <div className="mt-16 modern-card p-8 bg-gradient-to-r from-purple-600 to-violet-600 text-white flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div>
                            <p className="text-2xl font-bold">Need Help Choosing?</p>
                            <p className="font-medium mt-2 text-purple-100">Speak with alumni to understand if this course matches your ambitions.</p>
                        </div>
                        <Link href="/mentors" className="bg-white text-purple-700 px-8 py-3 rounded-full text-center font-semibold w-full sm:w-auto whitespace-nowrap hover:bg-purple-50 transition-colors shadow-lg">
                            Find Mentor →
                        </Link>
                    </div>

                </div>
            </article>

            <Footer />
        </main>
    );
}
