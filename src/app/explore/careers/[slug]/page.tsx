import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabaseAdmin } from "@/lib/supabase/admin";
import ShareButtons from "@/components/explore/ShareButtons";
import PageTracker from "@/components/PageTracker";

export const dynamic = "force-dynamic";

async function getCareerAndRelations(slug: string) {
    const { data: career, error } = await supabaseAdmin
        .from("career_profiles")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error || !career) return { career: null, related: {} };

    // Increment view count in background
    supabaseAdmin.rpc('increment_career_view', { career_slug: slug }).then();

    const { data: relations } = await supabaseAdmin
        .from("content_relationships")
        .select("*")
        .eq("source_type", "career")
        .eq("source_id", career.id);

    const related = { courses: [], exams: [], colleges: [] };

    return { career, related };
}

export default async function CareerProfilePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const { career, related } = await getCareerAndRelations(slug);

    if (!career) {
        notFound();
    }

    const truncateBadge = (text: string | null | undefined, max: number = 30) => {
        if (!text) return null;
        if (text.length <= max) return text;
        return text.substring(0, max) + '...';
    };

    const cleanSummary = (text: string | null | undefined) => {
        if (!text) return "No description available.";
        return text.replace(/^(name of the )?career profile:\s*[-:]?\s*([a-z ]+)?\s*/i, '').trim();
    };

    const cleanDescription = (text: string | null | undefined) => {
        if (!text) return "No detailed description provided yet.";
        // Replace 3+ consecutive newlines with exactly 2 newlines (paragraph break)
        return text.replace(/\n{3,}/g, '\n\n').replace(/^(name of the )?career profile:\s*[-:]?\s*([a-z ]+)?\s*/i, '').trim();
    };

    return (
        <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans">
            <Navbar />
            <PageTracker activityType="PAGE_VIEW" contentType="CAREER PROFILE" contentId={career.title} />

            <article className="pt-32 pb-24 min-h-[85vh] relative overflow-hidden">
                {/* Background orbs */}
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
                                <span className="modern-badge">
                                    {truncateBadge(career.demand) || 'High Demand'}
                                </span>
                                <span className="modern-badge bg-emerald-50 text-emerald-700">
                                    ⏳ {truncateBadge(career.study_duration) || 'Not specified'}
                                </span>
                                <span className="modern-badge bg-green-50 text-green-700">
                                    💰 {truncateBadge(career.salary_range || career.avg_salary) || 'Varies'}
                                </span>
                            </div>
                            <ShareButtons title={career.title} path={`/explore/careers/${slug}`} />
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.1] flex items-center gap-4 text-[var(--color-text)]">
                            <span className="text-5xl md:text-7xl">{career.icon || '💼'}</span>
                            {career.title}
                        </h1>

                        <div className="modern-card p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                            <p className="text-lg font-medium leading-relaxed text-[var(--color-text-muted)] flex-grow">
                                {cleanSummary(career.summary)}
                            </p>
                            <div className="bg-[var(--color-primary-indigo)] text-white p-4 rounded-2xl text-center min-w-[140px]">
                                <p className="text-xs font-semibold uppercase tracking-widest text-indigo-200 mb-1">Total Views</p>
                                <p className="text-3xl font-bold">{career.view_count || 1}</p>
                            </div>
                        </div>
                    </header>

                    <section className="modern-card p-8 mb-12">
                        <h2 className="text-2xl font-bold mb-6 text-[var(--color-text)]">
                            About This Path
                        </h2>
                        <div className="prose prose-lg max-w-none text-[var(--color-text-muted)] leading-relaxed whitespace-pre-wrap rounded-2xl bg-white/50 border border-[var(--color-border)] p-6">
                            {cleanDescription(career.description)}
                        </div>
                    </section>

                    {/* Related Content */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <div className="modern-card p-6 bg-indigo-50 border-indigo-100">
                            <h3 className="text-xl font-bold mb-3 text-indigo-900">Related Courses</h3>
                            <p className="text-indigo-600 text-sm font-medium">Cross-referencing ecosystem mappings...</p>
                        </div>
                        <div className="modern-card p-6 bg-rose-50 border-rose-100">
                            <h3 className="text-xl font-bold mb-3 text-rose-900">Entrance Exams</h3>
                            <p className="text-rose-600 text-sm font-medium">Cross-referencing ecosystem mappings...</p>
                        </div>
                    </section>

                    <div className="mt-16 modern-card p-8 bg-gradient-to-r from-[var(--color-primary-indigo)] to-[var(--color-primary-indigo-dark)] text-white flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div>
                            <p className="text-2xl font-bold">Connect With a Mentor</p>
                            <p className="font-medium mt-2 text-indigo-100">Get 1-on-1 guidance from experts in this specific field.</p>
                        </div>
                        <Link
                            href="/mentors"
                            className="bg-white text-[var(--color-primary-indigo)] px-8 py-3 rounded-full text-center font-semibold w-full sm:w-auto whitespace-nowrap hover:bg-indigo-50 transition-colors shadow-lg"
                        >
                            Find Mentor →
                        </Link>
                    </div>

                </div>
            </article>

            <Footer />
        </main>
    );
}
