import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabaseAdmin } from "@/lib/supabase/admin";
import ShareButtons from "@/components/explore/ShareButtons";
import { Briefcase, GraduationCap, Star, TrendingUp, BookOpen, ExternalLink, Banknote, Users } from "lucide-react";
import PageTracker from "@/components/PageTracker";

export const dynamic = "force-dynamic";

async function getCareerAndRelations(slug: string) {
    const { data: career, error } = await supabaseAdmin
        .from("career_profiles")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error || !career) return null;

    // Increment view count in background
    supabaseAdmin.rpc('increment_career_view', { career_slug: slug }).then();

    const linkedCourses = (career.recommended_courses || []);
    const linkedExams = (career.entrance_exams || []);
    const relatedCareers = (career.related_careers || []);

    return { career, linkedCourses, linkedExams, relatedCareers };
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export default async function CareerProfilePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const data = await getCareerAndRelations(slug);
    if (!data) notFound();

    const { career, linkedCourses, linkedExams, relatedCareers } = data;
    
    const heroStats = career.hero_stats || {};
    const overview = career.overview || {};
    const skillsRequired = career.skills_required || {};
    const faqs = career.faqs || [];
    const howToBecome = (career.how_to_become || []) as any[];

    // Extract Arrays cleanly
    const rolesList = (career.roles_responsibilities || []) as string[];
    const hardSkills = (skillsRequired.hard_skills || []) as any[];
    const softSkills = (skillsRequired.soft_skills || []) as any[];

    return (
        <main className="min-h-screen bg-[var(--color-bg)] flex flex-col font-sans">
            <Navbar />
            <PageTracker activityType="PAGE_VIEW" contentType="CAREER PROFILE" contentId={career.name} />

            <article className="pt-28 pb-24 min-h-[85vh] relative overflow-hidden flex-grow">
                <div className="absolute top-20 right-10 w-64 h-64 bg-indigo-200 rounded-full blur-[100px] opacity-20 hidden md:block" />
                <div className="absolute bottom-40 left-10 w-72 h-72 bg-purple-200 rounded-full blur-[100px] opacity-20 hidden md:block" />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

                    <Link href="/explore/careers" className="inline-flex items-center gap-2 font-semibold text-sm text-[var(--color-primary-indigo)] mb-8 hover:underline underline-offset-4 transition-colors">
                        <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        All Careers
                    </Link>

                    <header className="mb-12 border-b border-[var(--color-border)] pb-8">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <div className="flex gap-3 flex-wrap">
                                {career.category && (
                                    <span className="modern-badge bg-blue-50 text-blue-700">{career.category}</span>
                                )}
                                {career.work_type && (
                                    <span className="modern-badge bg-indigo-50 text-indigo-700">🏢 {career.work_type}</span>
                                )}
                                {heroStats.demand_level && (
                                    <span className="modern-badge bg-emerald-50 text-emerald-700">📈 {heroStats.demand_level} Demand</span>
                                )}
                            </div>
                            <ShareButtons title={career.name} path={`/explore/careers/${slug}`} />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-[1.1] flex items-center gap-4 text-[var(--color-text)]">
                            {career.name}
                        </h1>

                        <div className="modern-card p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="text-lg font-medium leading-relaxed text-[var(--color-text-muted)] flex-grow">
                                <p className="mb-2 text-[var(--color-text)] font-semibold">{overview.what_they_do || "Discover this career path."}</p>
                                <p className="text-base font-normal">{overview.summary}</p>
                            </div>
                        </div>

                        {/* HERO STATS BAR */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            {(heroStats.avg_salary_entry_lpa || heroStats.avg_salary_mid_lpa) && (
                                <div className="bg-white rounded-xl border border-[var(--color-border)] p-4 text-center shadow-sm">
                                    <Banknote size={22} className="mx-auto mb-2 text-emerald-500" />
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Entry Salary</p>
                                    <p className="text-lg font-bold text-[var(--color-text)]">₹{heroStats.avg_salary_entry_lpa || heroStats.avg_salary_mid_lpa}L</p>
                                </div>
                            )}
                            {heroStats.difficulty_level && (
                                <div className="bg-white rounded-xl border border-[var(--color-border)] p-4 text-center shadow-sm">
                                    <TrendingUp size={22} className="mx-auto mb-2 text-amber-500" />
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Difficulty</p>
                                    <p className="text-sm font-bold text-[var(--color-text)] mt-1.5">{heroStats.difficulty_level}</p>
                                </div>
                            )}
                            {career.sector && (
                                <div className="bg-white rounded-xl border border-[var(--color-border)] p-4 text-center shadow-sm">
                                    <Briefcase size={22} className="mx-auto mb-2 text-blue-500" />
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Top Sector</p>
                                    <p className="text-sm font-bold text-[var(--color-text)] mt-1.5">{career.sector}</p>
                                </div>
                            )}
                            {heroStats.avg_years_to_entry && (
                                <div className="bg-white rounded-xl border border-[var(--color-border)] p-4 text-center shadow-sm">
                                    <GraduationCap size={22} className="mx-auto mb-2 text-purple-500" />
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Years to Entry</p>
                                    <p className="text-lg font-bold text-[var(--color-text)]">{heroStats.avg_years_to_entry} Yrs</p>
                                </div>
                            )}
                        </div>
                    </header>

                    {/* Roles & Responsibilities */}
                    {rolesList.length > 0 && (
                        <section className="modern-card p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-[var(--color-text)] flex items-center gap-3">
                                <Briefcase size={24} className="text-purple-500" /> Roles & Responsibilities
                            </h2>
                            <ul className="text-[var(--color-text-muted)] space-y-2 list-disc pl-5">
                                {rolesList.map((item: string, i: number) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* How to Become */}
                    {howToBecome.length > 0 && (
                        <section className="modern-card p-8 mb-8 border-l-4 border-l-emerald-500">
                            <h2 className="text-2xl font-bold mb-6 text-[var(--color-text)] flex items-center gap-3">
                                <GraduationCap size={24} className="text-emerald-500" /> How to Become
                            </h2>
                            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                                {howToBecome.map((step: any, i: number) => (
                                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-emerald-100 text-emerald-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 -ml-5 md:ml-0 font-bold">
                                            {step.step || i+1}
                                        </div>
                                        <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-xl border border-[var(--color-border)] shadow-sm ml-12 md:ml-0">
                                            <h3 className="font-bold text-[var(--color-text)] mb-1 text-lg">{step.title}</h3>
                                            <p className="text-sm text-[var(--color-text-muted)]">{step.description}</p>
                                            {step.typical_duration && (
                                                <span className="inline-block mt-3 px-2 py-1 bg-gray-50 text-gray-500 text-xs font-semibold rounded">{step.typical_duration}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Eligibility */}
                    {career.eligibility && Object.keys(career.eligibility).length > 0 && (
                        <section className="modern-card p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-[var(--color-text)] flex items-center gap-3">
                                <Star size={24} className="text-amber-500" /> Eligibility Criteria
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[var(--color-text-muted)]">
                                {career.eligibility.min_qualification && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <span className="font-semibold block mb-1 text-[var(--color-text)]">Min. Qualification</span>
                                        {career.eligibility.min_qualification}
                                    </div>
                                )}
                                {(career.eligibility.age_min || career.eligibility.age_max) && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <span className="font-semibold block mb-1 text-[var(--color-text)]">Age Bracket</span>
                                        {career.eligibility.age_min || 'Any'} - {career.eligibility.age_max || 'No limit'} yrs
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Skills */}
                    {(hardSkills.length > 0 || softSkills.length > 0) && (
                        <section className="modern-card p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-[var(--color-text)] flex items-center gap-3">
                                <TrendingUp size={24} className="text-blue-500" /> Key Skills Required
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                {hardSkills.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-500 mb-3">Hard Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {hardSkills.map((s, i) => (
                                                <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-semibold">{s.skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {softSkills.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-500 mb-3">Soft Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {softSkills.map((s, i) => (
                                                <span key={i} className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-full text-xs font-semibold">{s.skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Salary Insights */}
                    {career.salary_insights && Object.keys(career.salary_insights).length > 0 && (
                        <section className="modern-card p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-6 text-[var(--color-text)] flex items-center gap-3">
                                <Banknote size={24} className="text-emerald-600" /> Salary Insights
                            </h2>
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                <div className="text-center p-3 rounded-xl bg-gray-50 border border-gray-100">
                                    <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Entry</p>
                                    <p className="text-lg font-bold text-[var(--color-text)]">₹{career.salary_insights.entry_lpa || heroStats.avg_salary_entry_lpa || '—'}L</p>
                                </div>
                                <div className="text-center p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                                    <p className="text-xs uppercase text-emerald-600 font-semibold mb-1">Mid-Level</p>
                                    <p className="text-lg font-bold text-emerald-800">₹{career.salary_insights.mid_lpa || heroStats.avg_salary_mid_lpa || '—'}L</p>
                                </div>
                                <div className="text-center p-3 rounded-xl bg-gray-50 border border-gray-100">
                                    <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Senior</p>
                                    <p className="text-lg font-bold text-[var(--color-text)]">₹{career.salary_insights.senior_lpa || heroStats.avg_salary_senior_lpa || '—'}L</p>
                                </div>
                            </div>
                            {career.salary_insights.allowances_perks && career.salary_insights.allowances_perks.length > 0 && (
                                <p className="text-sm mt-3 text-[var(--color-text-muted)]"><span className="font-semibold text-[var(--color-text)]">Top Perks:</span> {career.salary_insights.allowances_perks.join(', ')}</p>
                            )}
                        </section>
                    )}

                    {/* Linked Content */}
                    {(linkedCourses.length > 0 || linkedExams.length > 0) && (
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold mb-6 text-[var(--color-text)]">Related Pathways</h2>
                            <div className="space-y-4">
                                {linkedCourses.length > 0 && (
                                    <div className="modern-card p-6">
                                        <h3 className="text-sm font-bold uppercase mb-3 text-[var(--color-text-muted)]">🎓 Recommended Degrees</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {linkedCourses.map((c: any) => (
                                                <Link key={c.slug} href={`/explore/courses/${c.slug}`} className="px-4 py-2 bg-purple-50 border border-purple-200 text-purple-700 rounded-lg text-sm font-semibold hover:bg-purple-100 transition-colors flex items-center gap-2">
                                                    {c.course_name} <ExternalLink size={14} />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {linkedExams.length > 0 && (
                                    <div className="modern-card p-6">
                                        <h3 className="text-sm font-bold uppercase mb-3 text-[var(--color-text-muted)]">📝 Entrance Exams</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {linkedExams.map((e: any) => (
                                                <Link key={e.slug} href={`/explore/exams/${e.slug}`} className="px-4 py-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm font-semibold hover:bg-rose-100 transition-colors flex items-center gap-2">
                                                    {e.exam_name} <ExternalLink size={14} />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Mentor CTA */}
                    <div className="mt-16 modern-card p-8 bg-gradient-to-r from-[var(--color-primary-indigo)] to-[var(--color-primary-indigo-dark)] text-white flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div>
                            <p className="text-2xl font-bold">Connect With a Mentor</p>
                            <p className="font-medium mt-2 text-indigo-100">Get 1-on-1 guidance from experts in {career.name}.</p>
                        </div>
                        <Link href="/mentors" className="bg-white text-[var(--color-primary-indigo)] px-8 py-3 rounded-full text-center font-semibold w-full sm:w-auto whitespace-nowrap hover:bg-indigo-50 transition-colors shadow-lg">
                            Find Mentor →
                        </Link>
                    </div>

                </div>
            </article>

            <Footer />
        </main>
    );
}
