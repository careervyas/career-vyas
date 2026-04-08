import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabaseAdmin } from "@/lib/supabase/admin";
import ShareButtons from "@/components/explore/ShareButtons";
import { GraduationCap, Clock, BookOpen, Briefcase, Building2, FileText, Banknote, ListChecks, Search } from "lucide-react";
import PageTracker from "@/components/PageTracker";

export const dynamic = "force-dynamic";

async function getCourseAndRelations(slug: string) {
    const { data: course, error } = await supabaseAdmin
        .from("course_profiles")
        .select("*")
        .eq("slug", slug)
        .single();
    if (error || !course) return null;
    return { course };
}

export default async function CourseProfilePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const data = await getCourseAndRelations(slug);
    if (!data) notFound();

    const { course } = data;
    const layout = course.new_layout_data || {};

    const name = layout.name || course.name || "Course Overview";
    const overview = layout.overview || "Information coming soon.";
    const diffSimilar = layout.difference_similar_courses || "N/A";
    const streams = layout.streams_fields || "N/A";
    const whyStudy = layout.why_study || "N/A";
    const careerOpp = layout.career_opportunities || "N/A";
    const furtherStudies = layout.further_studies || "N/A";
    const salary = layout.salary_packages || "N/A";
    const exams = layout.popular_entrance_exams || "N/A";
    const topColleges = layout.top_colleges || "N/A";

    return (
        <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans">
            <Navbar />
            <PageTracker activityType="PAGE_VIEW" contentType="COURSE PROFILE" contentId={name} />

            <article className="pt-32 pb-24 min-h-[85vh] relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

                    <Link href="/explore/courses" className="inline-flex items-center gap-2 font-semibold text-sm text-[var(--color-purple)] mb-8 hover:underline transition-colors">
                        All Courses
                    </Link>

                    <header className="mb-12 border-b border-[var(--color-border)] pb-8">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <ShareButtons title={name} path={`/explore/courses/${slug}`} />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 leading-[1.1] text-[var(--color-text)]">
                            {name}
                        </h1>

                        <div className="modern-card p-6 bg-purple-50 border-purple-100">
                            <p className="text-lg font-medium leading-relaxed text-purple-900 whitespace-pre-wrap">
                                {overview}
                            </p>
                        </div>
                    </header>

                    <div className="space-y-8">

                        <section className="bg-white rounded-xl border border-[var(--color-border)] p-8 shadow-sm">
                            <h2 className="text-2xl font-bold mb-6 text-[var(--color-text)] flex items-center gap-3">
                                <Search size={22} className="text-blue-500" /> Why Opt For This & Streams
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-2 border-b pb-2">Why Study?</h4>
                                    <p className="text-[14px] text-gray-600 whitespace-pre-wrap">{whyStudy}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                    <div>
                                        <h4 className="font-bold text-gray-800 mb-2 border-b pb-2">Streams / Fields</h4>
                                        <p className="text-[14px] text-gray-600 whitespace-pre-wrap">{streams}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 mb-2 border-b pb-2">Difference (vs Similar)</h4>
                                        <p className="text-[14px] text-gray-600 whitespace-pre-wrap">{diffSimilar}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-[#fcf8ff] rounded-xl border border-purple-200 p-8 shadow-sm">
                            <h2 className="text-xl font-bold mb-6 text-purple-900 flex items-center gap-3">
                                <Briefcase size={22} className="text-purple-600" /> Career & Higher Studies
                            </h2>
                            <div className="space-y-6 text-[14px]">
                                <div><span className="font-bold text-purple-800 block mb-1">Career Opportunities:</span> <span className="text-gray-700 whitespace-pre-wrap">{careerOpp}</span></div>
                                <div><span className="font-bold text-purple-800 block mb-1">Further / Higher Studies:</span> <span className="text-gray-700 whitespace-pre-wrap">{furtherStudies}</span></div>
                                <div><span className="font-bold text-emerald-700 block mb-1"><Banknote size={16} className="inline mr-1 text-emerald-500"/> Salary Packages:</span> <span className="text-gray-700 whitespace-pre-wrap">{salary}</span></div>
                            </div>
                        </section>

                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="modern-card p-6">
                                <h3 className="text-sm font-semibold mb-3 text-gray-800 flex items-center gap-2">
                                    <FileText size={16} className="text-rose-500"/> Popular Entrance Exams
                                </h3>
                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{exams}</p>
                            </div>
                            <div className="modern-card p-6">
                                <h3 className="text-sm font-semibold mb-3 text-gray-800 flex items-center gap-2">
                                    <Building2 size={16} className="text-indigo-500"/> List of Top Colleges
                                </h3>
                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{topColleges}</p>
                            </div>
                        </section>

                    </div>



                </div>
            </article>

            <Footer />
        </main>
    );
}
