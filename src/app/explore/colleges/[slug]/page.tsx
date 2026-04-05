import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabaseAdmin } from "@/lib/supabase/admin";
import ShareButtons from "@/components/explore/ShareButtons";
import { MapPin, Globe, Banknote, Users, GraduationCap, Building2, Bed, Landmark, BarChart3, ExternalLink } from "lucide-react";
import PageTracker from "@/components/PageTracker";

export const dynamic = "force-dynamic";

async function getCollegeAndRelations(slug: string) {
    const { data: college, error } = await supabaseAdmin
        .from("colleges")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error || !college) return null;

    // Get relationships
    const { data: relations } = await supabaseAdmin
        .from("content_relationships")
        .select("*")
        .eq("source_type", "college")
        .eq("source_id", college.id);

    // Also get reverse relationships (e.g., exams that accept this college)
    const { data: reverseRelations } = await supabaseAdmin
        .from("content_relationships")
        .select("*")
        .eq("target_type", "college")
        .eq("target_id", college.id);

    // Fetch linked content details
    const allRels = [...(relations || []), ...(reverseRelations || [])];
    const linkedCourses: { slug: string; title: string }[] = [];
    const linkedExams: { slug: string; name: string }[] = [];

    for (const rel of allRels) {
        if (rel.target_type === "course" || rel.source_type === "course") {
            const courseSlug = rel.target_type === "course" ? rel.target_slug : rel.source_slug;
            if (courseSlug && !linkedCourses.find(c => c.slug === courseSlug)) {
                const { data: course } = await supabaseAdmin.from("courses").select("slug, title").eq("slug", courseSlug).single();
                if (course) linkedCourses.push(course);
            }
        }
        if (rel.target_type === "exam" || rel.source_type === "exam") {
            const examSlug = rel.target_type === "exam" ? rel.target_slug : rel.source_slug;
            if (examSlug && !linkedExams.find(e => e.slug === examSlug)) {
                const { data: exam } = await supabaseAdmin.from("exams").select("slug, name").eq("slug", examSlug).single();
                if (exam) linkedExams.push(exam);
            }
        }
    }

    return { college, linkedCourses, linkedExams };
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export default async function CollegeProfilePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const data = await getCollegeAndRelations(slug);

    if (!data) notFound();

    const { college, linkedCourses, linkedExams } = data;
    const coursesOffered = (college.courses_offered || []) as any[];
    const feeStructure = (college.fee_structure || []) as any[];
    const placementStats = college.placement_stats as any;

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

                    {/* Hero Header */}
                    <header className="mb-12 border-b border-[var(--color-border)] pb-8">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <div className="flex flex-wrap gap-2">
                                <span className="modern-badge bg-emerald-50 text-emerald-700">
                                    {college.type || 'University'}
                                </span>
                                {college.ranking && (
                                    <span className="modern-badge bg-amber-50 text-amber-700">
                                        🏆 {college.ranking}
                                    </span>
                                )}
                            </div>
                            <ShareButtons title={college.name} path={`/explore/colleges/${slug}`} />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-6 text-[var(--color-text)]">
                            {college.name}
                        </h1>

                        <div className="flex flex-wrap gap-3 mb-8">
                            {(college.city || college.state) && (
                                <span className="modern-badge bg-rose-50 text-rose-700 flex items-center gap-2">
                                    <MapPin size={16} /> {[college.city, college.state].filter(Boolean).join(', ')}
                                </span>
                            )}
                            {college.campus_size && (
                                <span className="modern-badge bg-blue-50 text-blue-700 flex items-center gap-2">
                                    <Building2 size={16} /> {college.campus_size}
                                </span>
                            )}
                            {college.map_link && (
                                <a href={college.map_link} target="_blank" rel="noopener noreferrer" className="modern-badge bg-indigo-50 text-indigo-700 flex items-center gap-2 hover:bg-indigo-100 transition-colors">
                                    <Globe size={16} /> View on Map ↗
                                </a>
                            )}
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="modern-card p-6 bg-emerald-50 border-emerald-100 text-center">
                                <Users size={28} className="mx-auto mb-2 text-emerald-400" />
                                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-500 mb-1">Top Recruiters</p>
                                <p className="text-base font-bold text-emerald-800">{college.top_recruiters || 'Top Tier Companies'}</p>
                            </div>
                            <div className="modern-card p-6 bg-amber-50 border-amber-100 text-center">
                                <Banknote size={28} className="mx-auto mb-2 text-amber-400" />
                                <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-1">Avg Package</p>
                                <p className="text-2xl font-bold text-amber-800">{college.avg_package || placementStats?.avg_package || 'TBD'}</p>
                            </div>
                        </div>
                    </header>

                    {/* Overview */}
                    <section className="modern-card p-8 mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-[var(--color-text)] flex items-center gap-3">
                            <Landmark size={24} className="text-emerald-500" /> About {college.name}
                        </h2>
                        <div className="prose prose-lg max-w-none text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">
                            {college.description || "Information is being updated."}
                        </div>
                    </section>

                    {/* Courses Offered */}
                    {coursesOffered.length > 0 && (
                        <section className="modern-card p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-6 text-[var(--color-text)] flex items-center gap-3">
                                <GraduationCap size={24} className="text-purple-500" /> Courses Offered
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b-2 border-[var(--color-border)]">
                                            <th className="text-left py-3 px-4 font-semibold text-[var(--color-text)]">Course</th>
                                            <th className="text-left py-3 px-4 font-semibold text-[var(--color-text)]">Eligibility & Entrance Exam</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {coursesOffered.slice(0, 30).map((course: any, i: number) => (
                                            <tr key={i} className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-soft)] transition-colors">
                                                <td className="py-3 px-4 font-semibold text-[var(--color-text)]">{course.name}</td>
                                                <td className="py-3 px-4 text-[var(--color-text-muted)] whitespace-pre-line text-xs leading-relaxed">{course.eligibility || 'Contact college'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {/* Fee Structure */}
                    {feeStructure && feeStructure.length > 0 && (
                        <section className="modern-card p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-6 text-[var(--color-text)] flex items-center gap-3">
                                <Banknote size={24} className="text-amber-500" /> Fee Structure
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <tbody>
                                        {feeStructure.slice(0, 20).map((row: any, i: number) => (
                                            <tr key={i} className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-soft)] transition-colors">
                                                <td className="py-3 px-4 font-semibold text-[var(--color-text)]">{row.item}</td>
                                                {(row.values || []).map((v: string, j: number) => (
                                                    <td key={j} className="py-3 px-4 text-[var(--color-text-muted)]">{v}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {/* Placement Statistics */}
                    {placementStats && (
                        <section className="modern-card p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-6 text-[var(--color-text)] flex items-center gap-3">
                                <BarChart3 size={24} className="text-blue-500" /> Placement Statistics
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                {placementStats.avg_package && (
                                    <div className="modern-card p-4 bg-emerald-50 border-emerald-100 text-center">
                                        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-500 mb-1">Avg Package</p>
                                        <p className="text-xl font-bold text-emerald-800">{placementStats.avg_package}</p>
                                    </div>
                                )}
                                {placementStats.highest_package && (
                                    <div className="modern-card p-4 bg-amber-50 border-amber-100 text-center">
                                        <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-1">Highest Package</p>
                                        <p className="text-xl font-bold text-amber-800">{placementStats.highest_package}</p>
                                    </div>
                                )}
                                {placementStats.placement_percentage && (
                                    <div className="modern-card p-4 bg-blue-50 border-blue-100 text-center">
                                        <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-1">Placed</p>
                                        <p className="text-xl font-bold text-blue-800">{placementStats.placement_percentage}</p>
                                    </div>
                                )}
                            </div>
                            {placementStats.tables?.map((table: string[][], tIdx: number) => (
                                <div key={tIdx} className="overflow-x-auto mb-4">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b-2 border-[var(--color-border)]">
                                                {table[0]?.map((cell: string, i: number) => (
                                                    <th key={i} className="text-left py-2 px-3 font-semibold text-[var(--color-text)] text-xs">{cell}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {table.slice(1).map((row: string[], rIdx: number) => (
                                                <tr key={rIdx} className="border-b border-[var(--color-border)]">
                                                    {row.map((cell: string, cIdx: number) => (
                                                        <td key={cIdx} className="py-2 px-3 text-[var(--color-text-muted)] text-xs">{cell}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </section>
                    )}

                    {/* Hostel & Campus */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {college.hostel_info && (
                            <section className="modern-card p-6">
                                <h3 className="text-xl font-bold mb-4 text-[var(--color-text)] flex items-center gap-2">
                                    <Bed size={20} className="text-rose-500" /> Hostel Facilities
                                </h3>
                                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">
                                    {college.hostel_info}
                                </p>
                            </section>
                        )}
                        {college.campus_facilities && (
                            <section className="modern-card p-6">
                                <h3 className="text-xl font-bold mb-4 text-[var(--color-text)] flex items-center gap-2">
                                    <Building2 size={20} className="text-indigo-500" /> Campus Facilities
                                </h3>
                                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">
                                    {college.campus_facilities}
                                </p>
                            </section>
                        )}
                    </div>

                    {/* Linked Content */}
                    {(linkedCourses.length > 0 || linkedExams.length > 0) && (
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold mb-6 text-[var(--color-text)]">Related Content</h2>
                            {linkedCourses.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-3 text-[var(--color-text-muted)]">📚 Courses Available Here</h3>
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
                                    <h3 className="text-lg font-semibold mb-3 text-[var(--color-text-muted)]">📝 Accepted Entrance Exams</h3>
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
