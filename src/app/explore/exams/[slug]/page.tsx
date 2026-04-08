import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabaseAdmin } from "@/lib/supabase/admin";
import ShareButtons from "@/components/explore/ShareButtons";
import { BookOpen, Target, Calendar, Network, FileText, Edit3, Navigation } from "lucide-react";
import PageTracker from "@/components/PageTracker";

export const dynamic = "force-dynamic";

async function getExamAndRelations(slug: string) {
    const { data: exam, error } = await supabaseAdmin
        .from("exam_profiles")
        .select("*")
        .eq("slug", slug)
        .single();
    if (error || !exam) return null;
    return { exam };
}

export default async function ExamProfilePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const data = await getExamAndRelations(slug);
    if (!data) notFound();

    const { exam } = data;
    const layout = exam.new_layout_data || {};

    const name = layout.name || exam.name || "Exam Details";
    const about = layout.about || "Detailed information not available currently.";
    const highlights = layout.overview_highlights || "N/A";
    const eligibility = layout.eligibility_criteria || "N/A";
    const pattern = layout.paper_pattern_marking || "N/A";
    const seats = layout.seats_and_participating_colls || "N/A";
    const importantDates = layout.important_events_dates || "N/A";
    const applicationParams = layout.application_process || "N/A";
    const selection = layout.selection_procedure || "N/A";

    return (
        <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans">
            <Navbar />
            <PageTracker activityType="PAGE_VIEW" contentType="EXAM PROFILE" contentId={name} />

            <article className="pt-32 pb-24 min-h-[85vh] relative overflow-hidden">
                <div className="absolute top-20 right-10 w-64 h-64 bg-rose-200 rounded-full blur-[100px] opacity-30 hidden md:block" />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <Link href="/explore/exams" className="inline-flex items-center gap-2 font-semibold text-sm text-rose-500 mb-8 hover:underline transition-colors">
                        All Exams
                    </Link>

                    <header className="mb-12 border-b border-[var(--color-border)] pb-8">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <ShareButtons title={name} path={`/explore/exams/${slug}`} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-6 text-rose-500">{name}</h1>
                        <p className="text-[16px] leading-relaxed text-[var(--color-text-muted)] mt-2 whitespace-pre-wrap">{about}</p>
                    </header>

                    <div className="space-y-8">
                        <section className="bg-rose-50 border border-rose-100 p-6 rounded-xl text-rose-900 shadow-sm">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Target size={20} className="text-rose-600"/> Overview / Highlights
                            </h3>
                            <p className="text-sm whitespace-pre-wrap">{highlights}</p>
                        </section>

                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="modern-card p-6">
                                <h3 className="text-lg font-bold mb-4 text-emerald-700 flex items-center gap-2">
                                    <ListChecks size={18}/> Eligibility Criteria
                                </h3>
                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{eligibility}</p>
                            </div>
                            <div className="modern-card p-6">
                                <h3 className="text-lg font-bold mb-4 text-amber-700 flex items-center gap-2">
                                    <FileText size={18}/> Paper Pattern & Marking
                                </h3>
                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{pattern}</p>
                            </div>
                        </section>

                        <section className="bg-white border border-[var(--color-border)] p-6 rounded-xl shadow-sm">
                            <h3 className="text-lg font-bold mb-4 text-[var(--color-text)] flex items-center gap-2">
                                <Calendar size={20} className="text-indigo-500"/> Important Events & Dates
                            </h3>
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{importantDates}</p>
                        </section>

                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="modern-card p-6">
                                <h3 className="text-[16px] font-bold mb-3 text-[var(--color-text)] flex items-center gap-2">
                                    <Edit3 size={16} className="text-blue-500"/> Application Process
                                </h3>
                                <p className="text-[13px] text-gray-700 whitespace-pre-wrap">{applicationParams}</p>
                            </div>
                            <div className="modern-card p-6">
                                <h3 className="text-[16px] font-bold mb-3 text-[var(--color-text)] flex items-center gap-2">
                                    <Navigation size={16} className="text-purple-500"/> Selection Procedure
                                </h3>
                                <p className="text-[13px] text-gray-700 whitespace-pre-wrap">{selection}</p>
                            </div>
                        </section>
                        
                        <section className="modern-card p-6">
                            <h3 className="text-[16px] font-bold mb-3 text-[var(--color-text)] flex items-center gap-2">
                                <Network size={16} className="text-amber-500"/> Available Seats & Participating Institutes
                            </h3>
                            <p className="text-[13px] text-gray-700 whitespace-pre-wrap">{seats}</p>
                        </section>

                    </div>

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

// Ensure ListChecks is correctly imported below icons
import { ListChecks } from "lucide-react";
