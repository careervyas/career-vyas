import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabaseAdmin } from "@/lib/supabase/admin";
import ShareButtons from "@/components/explore/ShareButtons";
import { MapPin, Globe, Banknote, Users, GraduationCap, Building2, Bed, Landmark, BarChart3, ExternalLink, BookOpen, Trophy, Navigation } from "lucide-react";
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
    const { data: reverseRelations } = await supabaseAdmin
        .from("content_relationships")
        .select("*")
        .eq("target_type", "college")
        .eq("target_id", college.id);

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

    // Build section anchors for sticky nav
    const sections: { id: string; label: string; icon: string }[] = [];
    sections.push({ id: "overview", label: "Overview", icon: "🏫" });
    if (coursesOffered.length > 0) sections.push({ id: "courses", label: "Courses", icon: "📚" });
    if (feeStructure?.length > 0) sections.push({ id: "fees", label: "Fees", icon: "💰" });
    if (placementStats) sections.push({ id: "placements", label: "Placements", icon: "📊" });
    if (college.hostel_info) sections.push({ id: "hostel", label: "Hostel & Campus", icon: "🏠" });
    if (linkedCourses.length > 0 || linkedExams.length > 0) sections.push({ id: "related", label: "Related", icon: "🔗" });

    return (
        <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans">
            <Navbar />
            <PageTracker activityType="PAGE_VIEW" contentType="COLLEGE PROFILE" contentId={college.name} />

            <article className="pt-28 pb-24 min-h-[85vh]">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-6">
                        <Link href="/" className="hover:text-[var(--color-primary-indigo)] transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/explore" className="hover:text-[var(--color-primary-indigo)] transition-colors">Explore</Link>
                        <span>/</span>
                        <Link href="/explore/colleges" className="hover:text-[var(--color-primary-indigo)] transition-colors">Colleges</Link>
                        <span>/</span>
                        <span className="text-[var(--color-text)] font-medium truncate">{college.name}</span>
                    </nav>

                    {/* ─── HERO HEADER ─── */}
                    <header className="mb-0 pb-6">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                {college.type || 'University'}
                            </span>
                            {college.ranking && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                                    <Trophy size={12} /> NIRF Rank #{college.ranking}
                                </span>
                            )}
                            {college.category && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
                                    {college.category}
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-3 text-[var(--color-text)]">
                            {college.name}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-muted)] mb-6">
                            {(college.city || college.state) && (
                                <span className="flex items-center gap-1.5">
                                    <MapPin size={14} className="text-rose-500" />
                                    {[college.city, college.state].filter(Boolean).join(', ')}
                                </span>
                            )}
                            {college.campus_size && (
                                <span className="flex items-center gap-1.5">
                                    <Building2 size={14} className="text-blue-500" />
                                    {college.campus_size}
                                </span>
                            )}
                            {college.map_link && (
                                <a href={college.map_link} target="_blank" rel="noopener noreferrer"
                                   className="flex items-center gap-1.5 text-[var(--color-primary-indigo)] hover:underline">
                                    <Navigation size={14} />
                                    View on Map ↗
                                </a>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <ShareButtons title={college.name} path={`/explore/colleges/${slug}`} />
                        </div>
                    </header>

                    {/* ─── STICKY SECTION TABS ─── */}
                    <div className="sticky top-[72px] z-30 bg-[var(--color-bg)] border-b border-[var(--color-border)] mb-8 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                        <nav className="flex gap-0 overflow-x-auto no-scrollbar">
                            {sections.map((s) => (
                                <a key={s.id} href={`#${s.id}`}
                                   className="flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary-indigo)] border-b-2 border-transparent hover:border-[var(--color-primary-indigo)] transition-all whitespace-nowrap">
                                    <span>{s.icon}</span>
                                    {s.label}
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* ─── QUICK HIGHLIGHTS ─── */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-xl border border-[var(--color-border)] p-4 text-center shadow-sm">
                            <GraduationCap size={22} className="mx-auto mb-2 text-purple-500" />
                            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Courses</p>
                            <p className="text-xl font-bold text-[var(--color-text)]">{coursesOffered.length || '—'}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-[var(--color-border)] p-4 text-center shadow-sm">
                            <Banknote size={22} className="mx-auto mb-2 text-emerald-500" />
                            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Avg Package</p>
                            <p className="text-lg font-bold text-[var(--color-text)]">{placementStats?.avg_package || '—'}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-[var(--color-border)] p-4 text-center shadow-sm">
                            <Users size={22} className="mx-auto mb-2 text-amber-500" />
                            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Recruiters</p>
                            <p className="text-sm font-bold text-[var(--color-text)]">{college.top_recruiters || 'Top Companies'}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-[var(--color-border)] p-4 text-center shadow-sm">
                            <BarChart3 size={22} className="mx-auto mb-2 text-blue-500" />
                            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Placed</p>
                            <p className="text-xl font-bold text-[var(--color-text)]">{placementStats?.placement_percentage || '—'}</p>
                        </div>
                    </div>

                    {/* ─── OVERVIEW ─── */}
                    <section id="overview" className="mb-10 scroll-mt-32">
                        <div className="flex items-center gap-2 mb-4">
                            <Landmark size={22} className="text-emerald-600" />
                            <h2 className="text-xl font-bold text-[var(--color-text)]">About {college.name}</h2>
                        </div>
                        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6 shadow-sm">
                            <p className="text-[15px] leading-7 text-[var(--color-text-muted)]">
                                {college.overview || college.description || "Information is being updated."}
                            </p>
                            {college.address && (
                                <div className="mt-5 pt-5 border-t border-[var(--color-border)] flex flex-wrap gap-6 text-sm">
                                    <div>
                                        <span className="font-semibold text-[var(--color-text)]">Address: </span>
                                        <span className="text-[var(--color-text-muted)]">{college.address}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* ─── COURSES OFFERED (Shiksha-style table) ─── */}
                    {coursesOffered.length > 0 && (
                        <section id="courses" className="mb-10 scroll-mt-32">
                            <div className="flex items-center justify-between gap-2 mb-4">
                                <div className="flex items-center gap-2">
                                    <GraduationCap size={22} className="text-purple-600" />
                                    <h2 className="text-xl font-bold text-[var(--color-text)]">
                                        Courses Offered
                                        <span className="text-sm font-normal text-[var(--color-text-muted)] ml-2">({coursesOffered.length} programs)</span>
                                    </h2>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-[var(--color-border)]">
                                                <th className="text-left py-3.5 px-5 font-semibold text-[var(--color-text)] text-xs uppercase tracking-wider">Course</th>
                                                <th className="text-left py-3.5 px-5 font-semibold text-[var(--color-text)] text-xs uppercase tracking-wider">Eligibility</th>
                                                <th className="text-left py-3.5 px-5 font-semibold text-[var(--color-text)] text-xs uppercase tracking-wider">Entrance Exam</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[var(--color-border)]">
                                            {coursesOffered.map((course: any, i: number) => (
                                                <tr key={i} className="hover:bg-indigo-50/30 transition-colors">
                                                    <td className="py-3.5 px-5">
                                                        <span className="font-semibold text-[var(--color-primary-indigo)]">{course.name}</span>
                                                    </td>
                                                    <td className="py-3.5 px-5 text-[var(--color-text-muted)] text-[13px] leading-relaxed max-w-xs">
                                                        {course.eligibility || '—'}
                                                    </td>
                                                    <td className="py-3.5 px-5">
                                                        {course.entrance_exam ? (
                                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700">
                                                                {course.entrance_exam}
                                                            </span>
                                                        ) : (
                                                            <span className="text-[var(--color-text-muted)] text-xs">—</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* ─── FEE STRUCTURE ─── */}
                    {feeStructure && feeStructure.length > 0 && (
                        <section id="fees" className="mb-10 scroll-mt-32">
                            <div className="flex items-center gap-2 mb-4">
                                <Banknote size={22} className="text-amber-600" />
                                <h2 className="text-xl font-bold text-[var(--color-text)]">Fee Structure</h2>
                            </div>
                            <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-[var(--color-border)]">
                                                <th className="text-left py-3.5 px-5 font-semibold text-[var(--color-text)] text-xs uppercase tracking-wider">Component</th>
                                                <th className="text-right py-3.5 px-5 font-semibold text-[var(--color-text)] text-xs uppercase tracking-wider">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[var(--color-border)]">
                                            {feeStructure.slice(0, 20).map((row: any, i: number) => (
                                                <tr key={i} className="hover:bg-amber-50/30 transition-colors">
                                                    <td className="py-3 px-5 font-medium text-[var(--color-text)]">{row.item}</td>
                                                    <td className="py-3 px-5 text-right">
                                                        {(row.values || []).map((v: string, j: number) => (
                                                            <span key={j} className="inline-block ml-4 font-semibold text-emerald-700">{v}</span>
                                                        ))}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* ─── PLACEMENTS ─── */}
                    {placementStats && (
                        <section id="placements" className="mb-10 scroll-mt-32">
                            <div className="flex items-center gap-2 mb-4">
                                <BarChart3 size={22} className="text-blue-600" />
                                <h2 className="text-xl font-bold text-[var(--color-text)]">Placement Statistics</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                                {placementStats.avg_package && (
                                    <div className="bg-white rounded-xl border border-emerald-200 p-5 text-center shadow-sm">
                                        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-1">Avg Package</p>
                                        <p className="text-2xl font-bold text-emerald-700">{placementStats.avg_package}</p>
                                    </div>
                                )}
                                {placementStats.highest_package && (
                                    <div className="bg-white rounded-xl border border-amber-200 p-5 text-center shadow-sm">
                                        <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-1">Highest Package</p>
                                        <p className="text-2xl font-bold text-amber-700">{placementStats.highest_package}</p>
                                    </div>
                                )}
                                {placementStats.placement_percentage && (
                                    <div className="bg-white rounded-xl border border-blue-200 p-5 text-center shadow-sm">
                                        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-1">Students Placed</p>
                                        <p className="text-2xl font-bold text-blue-700">{placementStats.placement_percentage}</p>
                                    </div>
                                )}
                            </div>
                            {placementStats.tables?.map((table: string[][], tIdx: number) => (
                                <div key={tIdx} className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden mb-4">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-[var(--color-border)]">
                                                    {table[0]?.map((cell: string, i: number) => (
                                                        <th key={i} className="text-left py-3 px-4 font-semibold text-[var(--color-text)] text-xs uppercase tracking-wider">{cell}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[var(--color-border)]">
                                                {table.slice(1).map((row: string[], rIdx: number) => (
                                                    <tr key={rIdx} className="hover:bg-blue-50/30 transition-colors">
                                                        {row.map((cell: string, cIdx: number) => (
                                                            <td key={cIdx} className="py-2.5 px-4 text-[var(--color-text-muted)] text-[13px]">{cell}</td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </section>
                    )}

                    {/* ─── HOSTEL & CAMPUS ─── */}
                    {(college.hostel_info || college.campus_facilities) && (
                        <section id="hostel" className="mb-10 scroll-mt-32">
                            <div className="flex items-center gap-2 mb-4">
                                <Bed size={22} className="text-rose-600" />
                                <h2 className="text-xl font-bold text-[var(--color-text)]">Hostel & Campus</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {college.hostel_info && (
                                    <div className="bg-white rounded-xl border border-[var(--color-border)] p-6 shadow-sm">
                                        <h3 className="text-base font-bold mb-3 text-[var(--color-text)] flex items-center gap-2">
                                            <Bed size={18} className="text-rose-500" /> Hostel Facilities
                                        </h3>
                                        <div className="text-[13px] text-[var(--color-text-muted)] leading-6 space-y-2">
                                            {college.hostel_info.split('\n').filter((line: string) => line.trim()).map((line: string, i: number) => (
                                                <p key={i}>{line.trim()}</p>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {college.campus_facilities && (
                                    <div className="bg-white rounded-xl border border-[var(--color-border)] p-6 shadow-sm">
                                        <h3 className="text-base font-bold mb-3 text-[var(--color-text)] flex items-center gap-2">
                                            <Building2 size={18} className="text-indigo-500" /> Campus Facilities
                                        </h3>
                                        <div className="text-[13px] text-[var(--color-text-muted)] leading-6 space-y-2">
                                            {college.campus_facilities.split('\n').filter((line: string) => line.trim()).map((line: string, i: number) => {
                                                // Check if it's a sub-header (e.g., "Library:", "Sports:")
                                                if (/^(Library|Sports|Hostel|Mess|Gym|Lab|Research|Cultural)[:\s]/i.test(line.trim())) {
                                                    return <p key={i} className="font-semibold text-[var(--color-text)] mt-3 first:mt-0">{line.trim()}</p>;
                                                }
                                                return <p key={i}>{line.trim()}</p>;
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* ─── RELATED CONTENT ─── */}
                    {(linkedCourses.length > 0 || linkedExams.length > 0) && (
                        <section id="related" className="mb-10 scroll-mt-32">
                            <div className="flex items-center gap-2 mb-4">
                                <BookOpen size={22} className="text-indigo-600" />
                                <h2 className="text-xl font-bold text-[var(--color-text)]">Related Content</h2>
                            </div>
                            <div className="bg-white rounded-xl border border-[var(--color-border)] p-6 shadow-sm space-y-6">
                                {linkedCourses.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">📚 Courses Available at {college.name}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {linkedCourses.map(c => (
                                                <Link key={c.slug} href={`/explore/courses/${c.slug}`}
                                                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-colors">
                                                    {c.title} <ExternalLink size={10} />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {linkedExams.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">📝 Accepted Entrance Exams</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {linkedExams.map(e => (
                                                <Link key={e.slug} href={`/explore/exams/${e.slug}`}
                                                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors">
                                                    {e.name} <ExternalLink size={10} />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* ─── MENTOR CTA ─── */}
                    <div className="mt-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white flex flex-col sm:flex-row justify-between items-center gap-6 shadow-lg">
                        <div>
                            <p className="text-2xl font-bold">Speak to Alumni</p>
                            <p className="font-medium mt-2 text-emerald-100">Find a mentor who actually studied at this college to get the real insight.</p>
                        </div>
                        <Link href="/mentors"
                              className="bg-white text-emerald-700 px-8 py-3 rounded-full text-center font-semibold w-full sm:w-auto whitespace-nowrap hover:bg-emerald-50 transition-colors shadow-lg">
                            Find Mentor →
                        </Link>
                    </div>

                </div>
            </article>

            <Footer />
        </main>
    );
}
