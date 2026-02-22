import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabaseAdmin } from "@/lib/supabase/admin";
import ShareButtons from "@/components/explore/ShareButtons";

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

    // Fetch Relationships (assuming target_type matches table name or identifier)
    const { data: relations } = await supabaseAdmin
        .from("content_relationships")
        .select("*")
        .eq("source_type", "career")
        .eq("source_id", career.id);

    const related = { courses: [], exams: [], colleges: [] };

    if (relations && relations.length > 0) {
        // Here we ideally fetch the actual records based on target_id.
        // For MVP simplicity, we simulate the join parsing if target_type is available.
        // In a strict prod environment, we would do a joined query.
    }

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

    return (
        <main className="min-h-screen bg-[var(--color-bg)] text-black font-sans">
            <Navbar />

            <article className="pt-32 pb-24 min-h-[85vh] relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

                    <Link href="/explore/careers" className="inline-flex items-center gap-2 font-bold uppercase mb-8 hover:underline decoration-4 underline-offset-4">
                        <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        ALL CAREERS
                    </Link>

                    <header className="mb-12 border-b-4 border-black pb-8">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <div className="flex gap-4">
                                <span className="brutal-badge bg-[var(--color-primary-orange)] text-black">
                                    {career.demand || 'High Demand'}
                                </span>
                                <span className="font-bold uppercase text-sm border-2 border-black px-2 py-1 bg-white brutal-shadow-sm">
                                    ⏳ {career.study_duration || 'Not specified'}
                                </span>
                                <span className="font-bold uppercase text-sm border-2 border-black px-2 py-1 bg-[#4ade80] brutal-shadow-sm">
                                    💰 {career.salary_range || 'Varies'}
                                </span>
                            </div>
                            <ShareButtons title={career.title} path={`/explore/careers/${slug}`} />
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-8 leading-[1.1] flex items-center gap-4">
                            <span className="text-6xl md:text-8xl drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">{career.icon || '💼'}</span>
                            {career.title}
                        </h1>

                        <div className="bg-white border-4 border-black p-6 brutal-shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                            <p className="text-xl font-bold leading-relaxed flex-grow">
                                {career.summary}
                            </p>
                            <div className="bg-black text-white p-4 border-4 border-black text-center min-w-[150px]">
                                <p className="text-xs font-black uppercase tracking-widest text-[#4ade80] mb-1">Total Views</p>
                                <p className="text-4xl font-black">{career.view_count || 1}</p>
                            </div>
                        </div>
                    </header>

                    <section className="bg-white border-4 border-black p-8 brutal-shadow-sm mb-12">
                        <h2 className="text-3xl font-black uppercase mb-6 border-b-4 border-black pb-2 inline-block">
                            ABOUT THIS PATH
                        </h2>
                        <div className="prose prose-lg max-w-none prose-p:font-bold prose-p:text-black/80 prose-p:leading-relaxed whitespace-pre-wrap">
                            {career.description || "No detailed description provided yet."}
                        </div>
                    </section>

                    {/* Relational Content Block placeholder */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-[var(--color-primary-yellow)] border-4 border-black p-6 brutal-shadow-sm">
                            <h3 className="text-2xl font-black uppercase mb-4 border-b-2 border-black pb-2">Related Courses</h3>
                            <p className="font-bold italic text-black/60">Cross-referencing ecosystem mappings...</p>
                        </div>
                        <div className="bg-[#f43f5e] text-white border-4 border-black p-6 brutal-shadow-sm">
                            <h3 className="text-2xl font-black uppercase mb-4 border-b-2 border-white pb-2">Entrance Exams</h3>
                            <p className="font-bold italic text-white/60">Cross-referencing ecosystem mappings...</p>
                        </div>
                    </section>

                    <div className="mt-16 bg-[var(--color-primary-blue)] border-4 border-black p-8 brutal-shadow flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div className="text-white">
                            <p className="font-black uppercase text-3xl drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">CONNECT WITH A MENTOR</p>
                            <p className="font-bold mt-2">Get 1-on-1 guidance from experts in this specific field.</p>
                        </div>
                        <Link
                            href="/mentors"
                            className="brutal-btn bg-[#ffde59] text-black px-8 py-4 text-center text-xl w-full sm:w-auto font-black uppercase whitespace-nowrap"
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
