import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabaseAdmin } from "@/lib/supabase/admin";
import ShareButtons from "@/components/explore/ShareButtons";

export const dynamic = "force-dynamic";

async function getCourseAndRelations(slug: string) {
    const { data: course, error } = await supabaseAdmin
        .from("courses")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error || !course) return null;

    // Fetch hypothetical Relationships (if course targets careers/exams/colleges)
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
        <main className="min-h-screen bg-[var(--color-bg)] text-black font-sans">
            <Navbar />

            <article className="pt-32 pb-24 min-h-[85vh] relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

                    <Link href="/explore/courses" className="inline-flex items-center gap-2 font-bold uppercase mb-8 hover:underline decoration-4 underline-offset-4">
                        <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        ALL COURSES
                    </Link>

                    <header className="mb-12 border-b-4 border-black pb-8">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <span className="brutal-badge bg-[var(--color-primary-yellow)] text-black">
                                {course.type || 'Degree path'}
                            </span>
                            <ShareButtons title={course.title} path={`/explore/courses/${slug}`} />
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-8 leading-[1.1]">
                            {course.title}
                        </h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="bg-white border-4 border-black p-6 brutal-shadow-sm">
                                <p className="font-black text-xs uppercase text-black/50 tracking-wider mb-1">Duration</p>
                                <p className="text-2xl font-black uppercase">{course.duration || '3-4 Years'}</p>
                            </div>
                            <div className="bg-white border-4 border-black p-6 brutal-shadow-sm">
                                <p className="font-black text-xs uppercase text-black/50 tracking-wider mb-1">Eligibility</p>
                                <p className="text-xl font-bold uppercase leading-tight">{course.eligibility || '10+2 / High School Equivalent'}</p>
                            </div>
                        </div>

                        <p className="text-2xl font-bold bg-[#4ade80] border-4 border-black p-6 brutal-shadow-sm leading-relaxed">
                            {course.description || 'A comprehensive academic program tailored to help you secure a job in today’s demanding industry.'}
                        </p>
                    </header>

                    {/* Extracted Data Sections */}
                    <section className="bg-white border-4 border-black p-8 brutal-shadow-sm mb-12">
                        <h2 className="text-3xl font-black uppercase mb-6 border-b-4 border-black pb-2 inline-block">
                            Program Syllabus & Details
                        </h2>
                        <div className="prose prose-lg max-w-none prose-p:font-bold prose-p:text-black/80 prose-p:leading-relaxed">
                            {course.details || (
                                <div className="p-4 border-2 border-dashed border-black bg-[var(--color-bg)]">
                                    Full curriculum map pending faculty update.
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Relational Content */}
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        <div className="bg-[var(--color-primary-blue)] text-white border-4 border-black p-6 brutal-shadow-sm flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-black uppercase mb-2 border-b-2 border-white pb-1">Careers</h3>
                                <p className="font-bold text-sm text-white/80 line-clamp-2">The roles you can secure after completing this degree.</p>
                            </div>
                            <button className="mt-4 border-2 border-white bg-black w-full py-2 font-black uppercase text-xs hover:bg-white hover:text-black transition-colors">View Paths</button>
                        </div>

                        <div className="bg-[#f43f5e] text-white border-4 border-black p-6 brutal-shadow-sm flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-black uppercase mb-2 border-b-2 border-white pb-1">Exams</h3>
                                <p className="font-bold text-sm text-white/80 line-clamp-2">Entrance exams required for admission to top institutes.</p>
                            </div>
                            <button className="mt-4 border-2 border-white bg-black w-full py-2 font-black uppercase text-xs hover:bg-white hover:text-black transition-colors">View Exams</button>
                        </div>

                        <div className="bg-[var(--color-primary-orange)] border-4 border-black p-6 brutal-shadow-sm flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-black uppercase mb-2 border-b-2 border-black pb-1">Colleges</h3>
                                <p className="font-bold text-sm text-black/80 line-clamp-2">Explore the top institutions offering this curriculum.</p>
                            </div>
                            <button className="mt-4 border-2 border-black bg-white w-full py-2 font-black uppercase text-xs hover:translate-x-[2px] transition-transform">View Colleges</button>
                        </div>
                    </section>

                    {/* Mentor CTA */}
                    <div className="mt-16 bg-black border-4 border-black p-8 brutal-shadow flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div className="text-white">
                            <p className="font-black uppercase text-3xl">NEED HELP CHOOSING?</p>
                            <p className="font-bold mt-2 text-white/80">Speak with alumni to understand if this course matches your ambitions.</p>
                        </div>
                        <Link
                            href="/mentors"
                            className="brutal-btn bg-[#ffde59] text-black border-white px-8 py-4 text-center text-xl w-full sm:w-auto font-black uppercase whitespace-nowrap"
                        >
                            FIND MENTOR
                        </Link>
                    </div>

                </div>
            </article>

            <Footer />
        </main>
    );
}
