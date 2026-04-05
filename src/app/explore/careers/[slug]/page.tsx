import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabaseAdmin } from "@/lib/supabase/admin";
import ShareButtons from "@/components/explore/ShareButtons";
import { Briefcase, GraduationCap, Star, TrendingUp, BookOpen, ExternalLink } from "lucide-react";
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

    // Get relationships
    const { data: rels } = await supabaseAdmin
        .from("content_relationships")
        .select("*")
        .eq("source_type", "career")
        .eq("source_id", career.id);
    const { data: revRels } = await supabaseAdmin
        .from("content_relationships")
        .select("*")
        .eq("target_type", "career")
        .eq("target_id", career.id);

    const allRels = [...(rels || []), ...(revRels || [])];
    const linkedCourses: { slug: string; title: string }[] = [];
    const linkedExams: { slug: string; name: string }[] = [];

    for (const rel of allRels) {
        if (rel.target_type === "course" || rel.source_type === "course") {
            const s = rel.target_type === "course" ? rel.target_slug : rel.source_slug;
            if (s && !linkedCourses.find(c => c.slug === s)) {
                const { data } = await supabaseAdmin.from("courses").select("slug, title").eq("slug", s).single();
                if (data) linkedCourses.push(data);
            }
        }
        if (rel.target_type === "exam" || rel.source_type === "exam") {
            const s = rel.target_type === "exam" ? rel.target_slug : rel.source_slug;
            if (s && !linkedExams.find(e => e.slug === s)) {
                const { data } = await supabaseAdmin.from("exams").select("slug, name").eq("slug", s).single();
                if (data) linkedExams.push(data);
            }
        }
    }

    return { career, linkedCourses, linkedExams };
}

export default async function CareerProfilePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const data = await getCareerAndRelations(slug);
    if (!data) notFound();

    const { career, linkedCourses, linkedExams } = data;
    const skillsNeeded = (career.skills_needed || []) as string[];
    const topCompanies = (career.top_companies || []) as string[];

    const truncateBadge = (text: string | null | undefined, max: number = 30) => {
        if (!text) return null;
        if (text.length <= max) return text;
        return text.substring(0, max) + '...';
    };

    return (
        <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans">
            <Navbar />
            <PageTracker activityType="PAGE_VIEW" contentType="CAREER PROFILE" contentId={career.title} />

            <article className="pt-32 pb-24 min-h-[85vh] relative overflow-hidden">
                <div className="absolute top-20 right-10 w-64 h-64 bg-indigo-200 rounded-full blur-[100px] opacity-30 hidden md:block" />
                <div className="absolute bottom-40 left-10 w-72 h-72 bg-purple-200 rounded-full blur-[100px] opacity-30 hidden md:block" />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

                    <Link href="/explore/careers" className="inline-flex items-center gap-2 font-semibold text-sm text-[var(--color-primary-indigo)] mb-8 hover:underline underline-offset-4 transition-colors">
                        <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        All Careers
                    </Link>

                    <header className="mb-12 border-b border-[var(--color-border)] pb-8">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <div className="flex gap-3 flex-wrap">
                                <span className="modern-badge">{truncateBadge(career.demand) || 'High Demand'}</span>
                                <span className="modern-badge bg-emerald-50 text-emerald-700">⏳ {truncateBadge(career.study_duration) || 'Not specified'}</span>
                                <span className="modern-badge bg-green-50 text-green-700">💰 {truncateBadge(career.salary_range) || 'Varies'}</span>
                            </div>
                            <ShareButtons title={career.title} path={`/explore/careers/${slug}`} />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-[1.1] flex items-center gap-4 text-[var(--color-text)]">
                            <span className="text-5xl md:text-6xl">{career.icon || '💼'}</span>
                            {career.title}
                        </h1>

                        <div className="modern-card p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                            <p className="text-lg font-medium leading-relaxed text-[var(--color-text-muted)] flex-grow">
                                {career.summary || career.overview?.substring(0, 300) || "Explore this career path."}
                            </p>
                            <div className="bg-[var(--color-primary-indigo)] text-white p-4 rounded-2xl text-center min-w-[140px]">
                                <p className="text-xs font-semibold uppercase tracking-widest text-indigo-200 mb-1">Total Views</p>
                                <p className="text-3xl font-bold">{career.view_count || 1}</p>
                            </div>
                        </div>
                    </header>

                    {/* Overview */}
                    {career.overview && (
                        <section className="modern-card p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-[var(--color-text)] flex items-center gap-3">
                                <BookOpen size={24} className="text-indigo-500" /> Overview
                            </h2>
                            <div className="prose prose-lg max-w-none text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">
                                {career.overview}
                            </div>
                        </section>
                    )}

                    {/* Roles & Responsibilities */}
                    {career.roles_responsibilities && (
                        <section className="modern-card p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-[var(--color-text)] flex items-center gap-3">
                                <Briefcase size={24} className="text-purple-500" /> Roles & Responsibilities
                            </h2>
                            <div className="prose max-w-none text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">
                                {career.roles_responsibilities}
                            </div>
                        </section>
                    )}

                    {/* How to Become */}
                    {career.how_to_become && (
                        <section className="modern-card p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-[var(--color-text)] flex items-center gap-3">
                                <TrendingUp size={24} className="text-emerald-500" /> How to Become
                            </h2>
                            <div className="prose max-w-none text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">
                                {career.how_to_become}
                            </div>
                        </section>
                    )}

                    {/* Eligibility */}
                    {career.eligibility && (
                        <section className="modern-card p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-[var(--color-text)] flex items-center gap-3">
                                <GraduationCap size={24} className="text-blue-500" /> Eligibility & Requirements
                            </h2>
                            <div className="prose max-w-none text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">
                                {career.eligibility}
                            </div>
                        </section>
                    )}

                    {/* Benefits */}
                    {career.benefits && (
                        <section className="modern-card p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-[var(--color-text)] flex items-center gap-3">
                                <Star size={24} className="text-amber-500" /> Benefits & Advantages
                            </h2>
                            <div className="prose max-w-none text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">
                                {career.benefits}
                            </div>
                        </section>
                    )}

                    {/* Skills & Companies */}
                    {(skillsNeeded.length > 0 || topCompanies.length > 0) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {skillsNeeded.length > 0 && (
                                <section className="modern-card p-6">
                                    <h3 className="text-xl font-bold mb-4 text-[var(--color-text)]">🛠️ Skills Needed</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {skillsNeeded.map((skill, i) => (
                                            <span key={i} className="modern-badge bg-blue-50 text-blue-700">{skill}</span>
                                        ))}
                                    </div>
                                </section>
                            )}
                            {topCompanies.length > 0 && (
                                <section className="modern-card p-6">
                                    <h3 className="text-xl font-bold mb-4 text-[var(--color-text)]">🏢 Top Employers</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {topCompanies.map((company, i) => (
                                            <span key={i} className="modern-badge bg-emerald-50 text-emerald-700">{company}</span>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    )}

                    {/* Fallback: Description if no structured sections */}
                    {!career.overview && !career.roles_responsibilities && career.description && (
                        <section className="modern-card p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-6 text-[var(--color-text)]">About This Path</h2>
                            <div className="prose prose-lg max-w-none text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">
                                {career.description}
                            </div>
                        </section>
                    )}

                    {/* Linked Content */}
                    {(linkedCourses.length > 0 || linkedExams.length > 0) && (
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold mb-6 text-[var(--color-text)]">Related Content</h2>
                            {linkedCourses.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-3 text-[var(--color-text-muted)]">📚 Required Courses / Degrees</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {linkedCourses.map(c => (
                                            <Link key={c.slug} href={`/explore/courses/${c.slug}`} className="modern-badge bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors flex items-center gap-1">
                                                {c.title} <ExternalLink size={12} />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {linkedExams.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 text-[var(--color-text-muted)]">📝 Related Entrance Exams</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {linkedExams.map(e => (
                                            <Link key={e.slug} href={`/explore/exams/${e.slug}`} className="modern-badge bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors flex items-center gap-1">
                                                {e.name} <ExternalLink size={12} />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {/* Mentor CTA */}
                    <div className="mt-16 modern-card p-8 bg-gradient-to-r from-[var(--color-primary-indigo)] to-[var(--color-primary-indigo-dark)] text-white flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div>
                            <p className="text-2xl font-bold">Connect With a Mentor</p>
                            <p className="font-medium mt-2 text-indigo-100">Get 1-on-1 guidance from experts in this specific field.</p>
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
