import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabaseAdmin } from "@/lib/supabase/admin";
import ShareButtons from "@/components/explore/ShareButtons";
import { BookOpen, Target, GraduationCap, Calendar, ExternalLink, Network, FileText, Pickaxe } from "lucide-react";
import PageTracker from "@/components/PageTracker";

export const dynamic = "force-dynamic";

async function getExamAndRelations(slug: string) {
    const { data: exam, error } = await supabaseAdmin
        .from("exam_profiles")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error || !exam) return null;

    const linkedCourses = (exam.courses_covered || []);
    const linkedColleges = (exam.participating_colleges || []);

    return { exam, linkedCourses, linkedColleges };
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export default async function ExamProfilePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const data = await getExamAndRelations(slug);
    if (!data) notFound();

    const { exam, linkedCourses, linkedColleges } = data;
    
    // Parse JSONB dicts
    const heroStats = exam.hero_stats || {};
    const importantDates = exam.important_dates || {};
    const eligibility = exam.eligibility || {};
    const examPattern = exam.exam_pattern || {};
    const subjectWeightage = exam.subject_weightage || [];
    const syllabusHighlights = exam.syllabus_highlights || [];
    const _cutoffs = exam.cutoffs || {};

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
                                {exam.conducting_body && <span className="modern-badge bg-indigo-50 text-indigo-700">Conducted by: {exam.conducting_body}</span>}
                            </div>
                            <ShareButtons title={exam.name} path={`/explore/exams/${slug}`} />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-2 text-rose-500">{exam.name}</h1>
                        <p className="text-xl font-medium text-[var(--color-text-muted)] mb-8">{exam.full_name}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="modern-card p-5 bg-amber-50 border-amber-100 text-center">
                                <Calendar size={24} className="mx-auto mb-2 text-amber-500" />
                                <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-600 mb-1">Exam Date</p>
                                <p className="text-sm font-bold text-amber-900">{importantDates.exam_date || 'TBA'}</p>
                            </div>
                            <div className="modern-card p-5 bg-indigo-50 border-indigo-100 text-center">
                                <Target size={24} className="mx-auto mb-2 text-indigo-500" />
                                <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-600 mb-1">Mode</p>
                                <p className="text-sm font-bold text-indigo-900">{exam.mode || 'Online CBT'}</p>
                            </div>
                            {(heroStats.total_applicants_approx || heroStats.difficulty_level) && (
                                <div className="modern-card p-5 bg-purple-50 border-purple-100 text-center">
                                    <Network size={24} className="mx-auto mb-2 text-purple-500" />
                                    <p className="text-[10px] font-semibold uppercase tracking-widest text-purple-600 mb-1">Competition</p>
                                    <p className="text-sm font-bold text-purple-900">{heroStats.difficulty_level || 'High'}</p>
                                </div>
                            )}
                            <div className="modern-card p-5 text-center bg-gray-50 border-gray-200">
                                <p className="text-[10px] mb-2 font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Official Site</p>
                                {exam.official_website ? (
                                    <a href={exam.official_website} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[var(--color-primary-indigo)] hover:text-rose-500 transition-colors inline-block mt-2">Visit Website ↗</a>
                                ) : (
                                    <p className="text-sm font-bold text-gray-500 mt-2">N/A</p>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* Important Dates Tracker */}
                    {Object.keys(importantDates).length > 0 && (
                        <section className="modern-card p-8 mb-8 border-t-4 border-t-amber-400">
                            <h2 className="text-2xl font-bold mb-6 text-[var(--color-text)] flex items-center gap-3">
                                <Calendar size={24} className="text-amber-500" /> Timeline & Important Dates
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {importantDates.registration_start && (
                                    <div className="p-4 border border-amber-100 rounded-xl bg-amber-50/30">
                                        <p className="text-xs uppercase font-bold text-amber-600/70 tracking-widest mb-1">Registration Starts</p>
                                        <p className="text-lg font-bold text-gray-800">{importantDates.registration_start}</p>
                                    </div>
                                )}
                                {importantDates.registration_end && (
                                    <div className="p-4 border border-rose-100 rounded-xl bg-rose-50/50">
                                        <p className="text-xs uppercase font-bold text-rose-600/70 tracking-widest mb-1">Registration Ends</p>
                                        <p className="text-lg font-bold text-rose-900">{importantDates.registration_end}</p>
                                    </div>
                                )}
                                {importantDates.admit_card_release && (
                                    <div className="p-4 border border-indigo-100 rounded-xl bg-indigo-50/50">
                                        <p className="text-xs uppercase font-bold text-indigo-600/70 tracking-widest mb-1">Admit Card Date</p>
                                        <p className="text-lg font-bold text-indigo-900">{importantDates.admit_card_release}</p>
                                    </div>
                                )}
                                {importantDates.result_date && (
                                    <div className="p-4 border border-emerald-100 rounded-xl bg-emerald-50/50">
                                        <p className="text-xs uppercase font-bold text-emerald-600/70 tracking-widest mb-1">Result Declaration</p>
                                        <p className="text-lg font-bold text-emerald-900">{importantDates.result_date}</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Eligibility */}
                    {Object.keys(eligibility).length > 0 && (
                        <section className="modern-card p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-6 text-[var(--color-text)] flex items-center gap-3">
                                <GraduationCap size={24} className="text-indigo-500" /> Eligibility Criteria
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {eligibility.qualification && (
                                    <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl">
                                        <p className="text-[11px] font-bold uppercase text-gray-500 tracking-wider mb-1">Qualification</p>
                                        <p className="font-semibold">{eligibility.qualification}</p>
                                    </div>
                                )}
                                {eligibility.min_percentage && (
                                    <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl">
                                        <p className="text-[11px] font-bold uppercase text-gray-500 tracking-wider mb-1">Minimum Marks</p>
                                        <p className="font-semibold">{eligibility.min_percentage}%</p>
                                    </div>
                                )}
                                {eligibility.subjects_required && eligibility.subjects_required.length > 0 && (
                                    <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl md:col-span-2">
                                        <p className="text-[11px] font-bold uppercase text-gray-500 tracking-wider mb-2">Subject Requirements</p>
                                        <div className="flex flex-wrap gap-2">
                                            {eligibility.subjects_required.map((sub: string, i: number) => (
                                                <span key={i} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-lg text-xs font-bold">{sub}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Exam Pattern */}
                    {Object.keys(examPattern).length > 0 && (
                        <section className="modern-card p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-6 text-[var(--color-text)] flex items-center gap-3">
                                <Target size={24} className="text-rose-500" /> Exam Pattern
                            </h2>
                            <div className="flex flex-wrap gap-4 mb-6">
                                {examPattern.total_duration_minutes && (
                                    <div className="flex-1 min-w-[120px] bg-rose-50 px-4 py-3 rounded-lg border border-rose-100 text-center">
                                        <p className="text-xs text-rose-600 font-bold uppercase tracking-widest mb-1">Time</p>
                                        <p className="text-xl font-black text-rose-800">{examPattern.total_duration_minutes} Mins</p>
                                    </div>
                                )}
                                {examPattern.total_questions && (
                                    <div className="flex-1 min-w-[120px] bg-rose-50 px-4 py-3 rounded-lg border border-rose-100 text-center">
                                        <p className="text-xs text-rose-600 font-bold uppercase tracking-widest mb-1">Questions</p>
                                        <p className="text-xl font-black text-rose-800">{examPattern.total_questions}</p>
                                    </div>
                                )}
                                {examPattern.total_marks && (
                                    <div className="flex-1 min-w-[120px] bg-rose-50 px-4 py-3 rounded-lg border border-rose-100 text-center">
                                        <p className="text-xs text-rose-600 font-bold uppercase tracking-widest mb-1">Marks</p>
                                        <p className="text-xl font-black text-rose-800">{examPattern.total_marks}</p>
                                    </div>
                                )}
                            </div>
                            {examPattern.papers && examPattern.papers.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="font-bold mb-3">Papers Breakdown</h3>
                                    <div className="space-y-3">
                                        {examPattern.papers.map((p: any, i: number) => (
                                            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
                                                <div>
                                                    <p className="font-bold text-[var(--color-text)]">{p.paper_name}</p>
                                                    <p className="text-xs text-[var(--color-text-muted)] mt-1">{(p.subjects || []).join(' • ')}</p>
                                                </div>
                                                <div className="mt-3 sm:mt-0 text-left sm:text-right">
                                                    <p className="text-sm font-semibold">{p.marks} Marks</p>
                                                    <p className="text-xs text-gray-500">{p.questions} Qs | {p.duration_minutes} Mins</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {/* Syllabus Highlights */}
                    {syllabusHighlights.length > 0 && (
                        <section className="modern-card p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-6 text-[var(--color-text)] flex items-center gap-3">
                                <BookOpen size={24} className="text-purple-500" /> Syllabus Highlights
                            </h2>
                            <div className="space-y-4">
                                {syllabusHighlights.map((sub: any, i: number) => (
                                    <div key={i} className="border border-[var(--color-border)] rounded-xl overflow-hidden">
                                        <div className="bg-purple-50 px-5 py-3 border-b border-purple-100 font-bold text-purple-900 tracking-wide flex justify-between items-center">
                                            {sub.subject}
                                        </div>
                                        <div className="p-5 text-sm">
                                            <div className="flex flex-wrap gap-2">
                                                {sub.key_topics && sub.key_topics.map((t: string, j: number) => (
                                                    <span key={j} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full border border-gray-200">{t}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Linked Content */}
                    {(linkedCourses.length > 0 || linkedColleges.length > 0) && (
                        <section className="mb-8 border-t border-[var(--color-border)] pt-8 mt-8">
                            <h2 className="text-2xl font-bold mb-6 text-[var(--color-text)]">Where It Leads</h2>
                            
                            {linkedCourses.length > 0 && (
                                <div className="modern-card p-6 mb-6">
                                    <h3 className="text-sm font-semibold mb-3 text-[var(--color-text-muted)] flex items-center gap-2">
                                        <GraduationCap size={16} /> Key Degrees Unlocked
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {linkedCourses.map((c: string, i: number) => (
                                            <span key={i} className="modern-badge bg-purple-50 text-purple-700 border border-purple-200">
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {linkedColleges.length > 0 && (
                                <div className="modern-card p-6">
                                    <h3 className="text-sm font-semibold mb-3 text-[var(--color-text-muted)] flex items-center gap-2">
                                        <Pickaxe size={16} /> Participating Institutes
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {linkedColleges.map((c: any, i: number) => (
                                            <div key={i} className="bg-white px-4 py-2 border border-gray-200 rounded-lg shadow-sm text-sm font-semibold">
                                                {c.name} {c.location && <span className="font-normal text-gray-400">({c.location})</span>}
                                            </div>
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
