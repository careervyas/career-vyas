import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabaseAdmin } from "@/lib/supabase/admin";
import ShareButtons from "@/components/explore/ShareButtons";
import { MapPin, Globe, Banknote, Users } from "lucide-react";
import PageTracker from "@/components/PageTracker";

export const dynamic = "force-dynamic";

async function getCollegeAndRelations(slug: string) {
    const { data: college, error } = await supabaseAdmin
        .from("colleges")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error || !college) return null;

    const { data: relations } = await supabaseAdmin
        .from("content_relationships")
        .select("*")
        .eq("source_type", "college")
        .eq("source_id", college.id);

    return { college, relations: relations || [] };
}

export default async function CollegeProfilePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const data = await getCollegeAndRelations(slug);

    if (!data) notFound();

    const { college } = data;

    return (
        <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans">
            <Navbar />
            <PageTracker activityType="PAGE_VIEW" contentType="COLLEGE PROFILE" contentId={college.name} />

            <article className="pt-32 pb-24 min-h-[85vh] relative overflow-hidden">
                <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-200 rounded-full blur-[100px] opacity-30 hidden md:block" />
                <div className="absolute bottom-40 right-10 w-72 h-72 bg-teal-200 rounded-full blur-[100px] opacity-30 hidden md:block" />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

                    <Link href="/explore/colleges" className="inline-flex items-center gap-2 font-semibold text-sm text-emerald-600 mb-8 hover:underline underline-offset-4 transition-colors">
                        <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        All Colleges
                    </Link>

                    <header className="mb-12 border-b border-[var(--color-border)] pb-8">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <span className="modern-badge bg-emerald-50 text-emerald-700">
                                {college.type || 'University'}
                            </span>
                            <ShareButtons title={college.name} path={`/explore/colleges/${slug}`} />
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6 text-[var(--color-text)]">
                            {college.name}
                        </h1>

                        <div className="flex flex-wrap gap-3 mb-8">
                            <span className="modern-badge bg-rose-50 text-rose-700 flex items-center gap-2">
                                <MapPin size={16} /> {college.location || 'Location Not Specified'}
                            </span>
                            {college.website && (
                                <a href={college.website} target="_blank" rel="noopener noreferrer" className="modern-badge bg-indigo-50 text-indigo-700 flex items-center gap-2 hover:bg-indigo-100 transition-colors">
                                    <Globe size={16} /> Official Site ↗
                                </a>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="modern-card p-6 bg-emerald-50 border-emerald-100 text-center">
                                <Users size={28} className="mx-auto mb-2 text-emerald-400" />
                                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-500 mb-1">Top Recruiters</p>
                                <p className="text-base font-bold text-emerald-800">{college.top_recruiters || 'Top Tier Companies'}</p>
                            </div>
                            <div className="modern-card p-6 bg-amber-50 border-amber-100 text-center">
                                <Banknote size={28} className="mx-auto mb-2 text-amber-400" />
                                <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-1">Avg Package</p>
                                <p className="text-2xl font-bold text-amber-800">{college.avg_package || 'TBD'}</p>
                            </div>
                        </div>
                    </header>

                    <section className="modern-card p-8 mb-12">
                        <h2 className="text-2xl font-bold mb-6 text-[var(--color-text)]">
                            Campus Overview
                        </h2>
                        <div className="prose prose-lg max-w-none text-[var(--color-text-muted)] leading-relaxed whitespace-pre-wrap">
                            {college.description || "Detailed campus and infrastructure information is currently being updated by our teams."}
                        </div>
                    </section>

                    {/* Related Content */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <div className="modern-card p-6 group hover:shadow-lg transition-all">
                            <h3 className="text-xl font-bold mb-2 text-[var(--color-text)]">Available Courses</h3>
                            <p className="text-[var(--color-text-muted)] text-sm font-medium mb-4">Degrees and paths offered here.</p>
                            <Link href="/explore/courses" className="modern-btn-secondary px-5 py-2 text-sm inline-flex items-center gap-1">
                                Explore Courses <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>

                        <div className="modern-card p-6 group hover:shadow-lg transition-all">
                            <h3 className="text-xl font-bold mb-2 text-[var(--color-text)]">Accepted Exams</h3>
                            <p className="text-[var(--color-text-muted)] text-sm font-medium mb-4">Entrance exams required for admission.</p>
                            <Link href="/explore/exams" className="modern-btn-secondary px-5 py-2 text-sm inline-flex items-center gap-1">
                                View Exams <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>
                    </section>

                    <div className="mt-16 modern-card p-8 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div>
                            <p className="text-2xl font-bold">Speak to Alumni</p>
                            <p className="font-medium mt-2 text-emerald-100">Find a mentor who actually studied at this college to get the real insight.</p>
                        </div>
                        <Link
                            href="/mentors"
                            className="bg-white text-emerald-700 px-8 py-3 rounded-full text-center font-semibold w-full sm:w-auto whitespace-nowrap hover:bg-emerald-50 transition-colors shadow-lg"
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
