import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabaseAdmin } from "@/lib/supabase/admin";
import ShareButtons from "@/components/explore/ShareButtons";
import { GraduationCap, Clock, BookOpen, Briefcase, Building2, FileText, ExternalLink, Banknote, ListChecks, TrendingUp } from "lucide-react";
import PageTracker from "@/components/PageTracker";

export const dynamic = "force-dynamic";

async function getCourseAndRelations(slug: string) {
    const { data: course, error } = await supabaseAdmin
        .from("course_profiles")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error || !course) return null;

    // Get reverse relationships mapped in processing (arrays)
    const linkedColleges = (course.top_colleges || []);
    const linkedExams = (course.top_entrance_exams || []);
    const linkedCareers = (course.career_opportunities || []);

    return { course, linkedColleges, linkedExams, linkedCareers };
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export default async function CourseProfilePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const data = await getCourseAndRelations(slug);
    if (!data) notFound();

    const { course, linkedColleges, linkedExams, linkedCareers } = data;
    
    const heroStats = course.hero_stats || {};
    const overview = course.overview || {};
    const eligibility = course.eligibility || {};
    const specializations = course.specializations || [];
    const semesterSyllabus = course.semester_syllabus || [];
    const salaryInsights = course.salary_insights || {};
    const skillsDeveloped = course.skills_developed || {};

    return (
        <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans">
            <Navbar />
            <PageTracker activityType="PAGE_VIEW" contentType="COURSE PROFILE" contentId={course.name} />

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
                                {course.degree_type || 'Degree path'}
                            </span>
                            <ShareButtons title={course.name} path={`/explore/courses/${slug}`} />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 leading-[1.1] text-[var(--color-text)]">
                            {course.name}
                            {course.full_name && (
                                <span className="block text-2xl text-[var(--color-text-muted)] font-normal mt-2">{course.full_name}</span>
                            )}
                        </h1>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="modern-card p-5 text-center">
                                <Clock size={24} className="mx-auto mb-2 text-purple-400" />
                                <p className="text-xs font-semibold uppercase text-[var(--color-text-muted)] tracking-widest mb-1">Duration</p>
                                <p className="text-lg font-bold text-[var(--color-text)]">{course.duration_years ? `${course.duration_years} Years` : '—'}</p>
                            </div>
                            <div className="modern-card p-5 text-center">
                                <GraduationCap size={24} className="mx-auto mb-2 text-indigo-400" />
                                <p className="text-xs font-semibold uppercase text-[var(--color-text-muted)] tracking-widest mb-1">Eligibility</p>
                                <p className="text-sm font-bold text-[var(--color-text)] leading-tight mt-1">{eligibility.min_qualification || '10+2 / Equivalent'}</p>
                            </div>
                            <div className="modern-card p-5 text-center">
                                <FileText size={24} className="mx-auto mb-2 text-amber-500" />
                                <p className="text-[10px] font-semibold uppercase text-[var(--color-text-muted)] tracking-widest mb-1">Avg Fee/Yr</p>
                                <p className="text-sm font-bold text-[var(--color-text)] mt-1.5">
                                    {(heroStats.avg_fees_min_lpa || heroStats.avg_fees_max_lpa) 
                                        ? `₹${heroStats.avg_fees_min_lpa||0}L - ₹${heroStats.avg_fees_max_lpa||0}L` 
                                        : 'Varies'}
                                </p>
                            </div>
                            <div className="modern-card p-5 text-center">
                                <Banknote size={24} className="mx-auto mb-2 text-emerald-500" />
                                <p className="text-[10px] font-semibold uppercase text-[var(--color-text-muted)] tracking-widest mb-1">Avg Package</p>
                                <p className="text-lg font-bold text-[var(--color-text)]">
                                    {(heroStats.avg_salary_entry_lpa || heroStats.avg_salary_max_lpa) 
                                        ? `₹${heroStats.avg_salary_entry_lpa||0}L - ₹${heroStats.avg_salary_max_lpa||0}L` 
                                        : 'Varies'}
                                </p>
                            </div>
                        </div>

                        {overview.summary && (
                            <div className="modern-card p-6 bg-purple-50 border-purple-100">
                                <p className="text-lg font-medium leading-relaxed text-purple-900">
                                    {overview.summary}
                                </p>
                            </div>
                        )}
                    </header>

                    {/* Eligibility & Admission */}
                    {Object.keys(eligibility).length > 0 && (
                        <section className="modern-card p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-6 text-[var(--color-text)] flex items-center gap-3">
                                <ListChecks size={24} className="text-amber-500" /> Eligibility & Admission
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {eligibility.min_qualification && (
                                    <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl">
                                        <p className="text-[11px] font-bold uppercase text-gray-500 tracking-wider mb-1">Required Degree</p>
                                        <p className="font-semibold">{eligibility.min_qualification}</p>
                                    </div>
                                )}
                                {eligibility.min_percentage && (
                                    <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl">
                                        <p className="text-[11px] font-bold uppercase text-gray-500 tracking-wider mb-1">Minimum Marks</p>
                                        <p className="font-semibold">{eligibility.min_percentage}%</p>
                                    </div>
                                )}
                                {eligibility.required_subjects && eligibility.required_subjects.length > 0 && (
                                    <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl md:col-span-2">
                                        <p className="text-[11px] font-bold uppercase text-gray-500 tracking-wider mb-2">Mandatory Subjects</p>
                                        <div className="flex flex-wrap gap-2">
                                            {eligibility.required_subjects.map((sub: string, i: number) => (
                                                <span key={i} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-bold">{sub}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Semester Syllabus */}
                    {semesterSyllabus.length > 0 && (
                        <section className="modern-card p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-6 text-[var(--color-text)] flex items-center gap-3">
                                <BookOpen size={24} className="text-indigo-500" /> Semester-wise Syllabus
                            </h2>
                            <div className="space-y-4">
                                {semesterSyllabus.map((sem: any, i: number) => (
                                    <div key={i} className="border border-[var(--color-border)] rounded-xl overflow-hidden text-sm">
                                        <div className="bg-indigo-50 px-5 py-3 border-b border-indigo-100 font-bold text-indigo-900 tracking-wide">
                                            Semester {sem.semester}
                                        </div>
                                        <div className="p-5 flex flex-wrap gap-6 text-[var(--color-text-muted)] bg-white">
                                            {(sem.core_subjects || []).length > 0 && (
                                                <div className="flex-1 min-w-[200px]">
                                                    <p className="text-[11px] font-black tracking-widest uppercase text-gray-500 mb-2">Core Subjects</p>
                                                    <ul className="list-disc pl-4 space-y-1">
                                                        {sem.core_subjects.map((s: string, j: number) => <li key={j}>{s}</li>)}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Specializations */}
                    {specializations.length > 0 && (
                        <section className="modern-card p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-[var(--color-text)] flex items-center gap-3">
                                <TrendingUp size={24} className="text-emerald-500" /> Top Specializations
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {specializations.map((spec: any, i: number) => (
                                    <div key={i} className="p-5 border border-emerald-100 bg-emerald-50/30 rounded-xl">
                                        <h3 className="font-bold text-lg mb-1">{spec.name}</h3>
                                        <div className="flex gap-2 items-center mb-3 text-[11px] uppercase font-bold tracking-wider text-emerald-600">
                                            <span>Demand: {spec.demand_level || 'High'}</span>
                                        </div>
                                        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{spec.career_scope}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Linked Content: Exams & Colleges */}
                    {(linkedExams.length > 0 || linkedColleges.length > 0) && (
                        <section className="mb-8 border-t border-[var(--color-border)] pt-8 mt-8">
                            <h2 className="text-2xl font-bold mb-6 text-[var(--color-text)]">Admission & Colleges</h2>
                            
                            {linkedExams.length > 0 && (
                                <div className="modern-card p-6 mb-6">
                                    <h3 className="text-sm font-semibold mb-3 text-[var(--color-text-muted)] flex items-center gap-2">
                                        <FileText size={16} /> Top Entrance Exams
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {linkedExams.map((e: any, i: number) => (
                                            <div key={i} className="p-4 border border-rose-100 bg-rose-50/50 rounded-xl flex flex-col justify-center">
                                                <p className="font-bold text-rose-900">{e.name}</p>
                                                {e.level && <p className="text-xs text-rose-600 font-semibold">{e.level}</p>}
                                                {e.slug && (
                                                    <Link href={`/explore/exams/${e.slug}`} className="text-xs text-rose-600 mt-2 font-medium hover:underline inline-flex items-center">
                                                        View Exam Details →
                                                    </Link>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {linkedColleges.length > 0 && (
                                <div className="modern-card p-6">
                                    <h3 className="text-sm font-semibold mb-3 text-[var(--color-text-muted)] flex items-center gap-2">
                                        <Building2 size={16} /> Top Colleges Offering This
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {linkedColleges.map((c: any, i: number) => (
                                            <div key={i} className="p-4 border border-[var(--color-border)] hover:border-purple-300 transition-colors bg-white rounded-xl">
                                                <p className="font-bold text-[var(--color-text)]">{c.name}</p>
                                                <p className="text-xs text-[var(--color-text-muted)] mt-1">{c.location}</p>
                                                {c.slug && (
                                                    <Link href={`/explore/colleges/${c.slug}`} className="text-xs text-purple-600 mt-3 font-semibold hover:underline inline-flex items-center">
                                                        View College Profile →
                                                    </Link>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {/* Careers */}
                    {linkedCareers.length > 0 && (
                        <section className="mb-8">
                            <div className="modern-card p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                                <h3 className="text-xl font-bold mb-4 text-indigo-900 flex items-center gap-2">
                                    <Briefcase size={22} className="text-blue-500" /> Career Opportunities
                                </h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {linkedCareers.map((c: any, i: number) => (
                                        <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-white">
                                            <div className="flex justify-between items-start mb-2">
                                                <p className="font-bold text-lg text-indigo-950">{c.job_title}</p>
                                                {c.avg_salary_lpa && <span className="text-sm bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded">₹{c.avg_salary_lpa}L</span>}
                                            </div>
                                            <p className="text-sm text-gray-600">{c.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
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
