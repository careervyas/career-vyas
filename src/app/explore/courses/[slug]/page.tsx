import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabaseAdmin } from "@/lib/supabase/admin";
import ShareButtons from "@/components/explore/ShareButtons";
import PageTracker from "@/components/PageTracker";

export const dynamic = "force-dynamic";

async function getCourseAndRelations(slug: string) {
    const { data: course, error } = await supabaseAdmin
        .from("courses")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error || !course) return null;

    const { data: relations } = await supabaseAdmin
        .from("content_relationships")
        .select("*")
        .eq("source_type", "course")
        .eq("source_id", course.id);

    return { course, relations };
}

export default async function CourseProfilePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const data = await getCourseAndRelations(slug);

    if (!data) {
        notFound();
    }

    const { course } = data;

    return (
        <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans">
            <Navbar />
            <PageTracker activityType="PAGE_VIEW" contentType="COURSE PROFILE" contentId={course.title} />

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
                                {course.type || 'Degree path'}
                            </span>
                            <ShareButtons title={course.title} path={`/explore/courses/${slug}`} />
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-[1.1] text-[var(--color-text)]">
                            {course.title}
                        </h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="modern-card p-6">
                                <p className="text-xs font-semibold uppercase text-[var(--color-text-muted)] tracking-widest mb-1">Duration</p>
                                <p className="text-2xl font-bold text-[var(--color-text)]">{course.duration || '3-4 Years'}</p>
                            </div>
                            <div className="modern-card p-6">
                                <p className="text-xs font-semibold uppercase text-[var(--color-text-muted)] tracking-widest mb-1">Eligibility</p>
                                <p className="text-lg font-bold text-[var(--color-text)] leading-tight">{course.eligibility || '10+2 / High School Equivalent'}</p>
                            </div>
                        </div>

                        <div className="modern-card p-6 bg-emerald-50 border-emerald-100">
                            <p className="text-lg font-medium leading-relaxed text-emerald-800">
                                {course.description || 'A comprehensive academic program tailored to help you secure a job in today\'s demanding industry.'}
                            </p>
                        </div>
                    </header>

                    <section className="modern-card p-8 mb-12">
                        <h2 className="text-2xl font-bold mb-6 text-[var(--color-text)]">
                            Program Syllabus & Details
                        </h2>
                        <div className="prose prose-lg max-w-none text-[var(--color-text-muted)] leading-relaxed">
                            {course.details || (
                                <div className="p-4 border border-dashed border-[var(--color-border)] rounded-2xl bg-[var(--color-bg-soft)] text-[var(--color-text-muted)]">
                                    Full curriculum map pending faculty update.
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Related Content */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="modern-card p-6 group hover:shadow-lg transition-all">
                            <h3 className="text-lg font-bold mb-2 text-[var(--color-text)]">Careers</h3>
                            <p className="text-[var(--color-text-muted)] text-sm font-medium mb-4">The roles you can secure after this degree.</p>
                            <Link href="/explore/careers" className="modern-btn-secondary px-4 py-2 text-xs inline-flex items-center gap-1">
                                View Paths <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>

                        <div className="modern-card p-6 group hover:shadow-lg transition-all">
                            <h3 className="text-lg font-bold mb-2 text-[var(--color-text)]">Exams</h3>
                            <p className="text-[var(--color-text-muted)] text-sm font-medium mb-4">Entrance exams required for admission.</p>
                            <Link href="/explore/exams" className="modern-btn-secondary px-4 py-2 text-xs inline-flex items-center gap-1">
                                View Exams <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>

                        <div className="modern-card p-6 group hover:shadow-lg transition-all">
                            <h3 className="text-lg font-bold mb-2 text-[var(--color-text)]">Colleges</h3>
                            <p className="text-[var(--color-text-muted)] text-sm font-medium mb-4">Top institutions offering this curriculum.</p>
                            <Link href="/explore/colleges" className="modern-btn-secondary px-4 py-2 text-xs inline-flex items-center gap-1">
                                View Colleges <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>
                    </section>

                    {/* Mentor CTA */}
                    <div className="mt-16 modern-card p-8 bg-gradient-to-r from-purple-600 to-violet-600 text-white flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div>
                            <p className="text-2xl font-bold">Need Help Choosing?</p>
                            <p className="font-medium mt-2 text-purple-100">Speak with alumni to understand if this course matches your ambitions.</p>
                        </div>
                        <Link
                            href="/mentors"
                            className="bg-white text-purple-700 px-8 py-3 rounded-full text-center font-semibold w-full sm:w-auto whitespace-nowrap hover:bg-purple-50 transition-colors shadow-lg"
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
