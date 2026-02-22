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

    // Fetch Relationships
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
        <main className="min-h-screen bg-[var(--color-bg)] text-black font-sans">
            <Navbar />
            <PageTracker activityType="PAGE_VIEW" contentType="COLLEGE PROFILE" contentId={college.name} />

            <article className="pt-32 pb-24 min-h-[85vh] relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

                    <Link href="/explore/colleges" className="inline-flex items-center gap-2 font-bold uppercase mb-8 hover:underline decoration-4 underline-offset-4 text-[#4ade80]">
                        <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        ALL COLLEGES
                    </Link>

                    <header className="mb-12 border-b-4 border-black pb-8">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <span className="brutal-badge border-black bg-black text-white">
                                {college.type || 'University'}
                            </span>
                            <ShareButtons title={college.name} path={`/explore/colleges/${slug}`} />
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-[1.1] mb-6 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                            {college.name}
                        </h1>

                        <div className="flex flex-wrap gap-4 mb-8">
                            <p className="font-bold text-lg bg-white border-2 border-black px-4 py-2 flex items-center gap-2 brutal-shadow-sm uppercase">
                                <MapPin size={20} className="text-[#f43f5e]" /> {college.location || 'Location Not Specified'}
                            </p>
                            {college.website && (
                                <a href={college.website} target="_blank" rel="noopener noreferrer" className="font-bold text-lg bg-[var(--color-primary-blue)] text-white border-2 border-black px-4 py-2 flex items-center gap-2 brutal-shadow-sm uppercase hover:bg-white hover:text-black transition-colors">
                                    <Globe size={20} /> View Official Site ↗
                                </a>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-8 border-b-4 border-black border-dashed">
                            <div className="bg-[#4ade80] border-4 border-black p-6 brutal-shadow-sm flex flex-col justify-center text-center">
                                <Users size={32} className="mx-auto mb-2 opacity-50" />
                                <p className="font-black text-xs uppercase opacity-70 mb-1">Top Recruiters</p>
                                <p className="text-xl font-bold uppercase">{college.top_recruiters || 'Top Tier Companies'}</p>
                            </div>
                            <div className="bg-[var(--color-primary-yellow)] border-4 border-black p-6 brutal-shadow-sm flex flex-col justify-center text-center">
                                <Banknote size={32} className="mx-auto mb-2 opacity-50" />
                                <p className="font-black text-xs uppercase opacity-70 mb-1">Avg Package</p>
                                <p className="text-3xl font-black uppercase">{college.avg_package || 'TBD'}</p>
                            </div>
                        </div>
                    </header>

                    <section className="bg-white border-4 border-black p-8 brutal-shadow-sm mb-12">
                        <h2 className="text-3xl font-black uppercase mb-6 border-b-4 border-black pb-2 inline-block">
                            Campus Overview
                        </h2>
                        <div className="prose prose-lg max-w-none prose-p:font-bold prose-p:text-black/80 prose-p:leading-relaxed whitespace-pre-wrap">
                            {college.description || "Detailed campus and infrastructure information is currently being updated by our teams."}
                        </div>
                    </section>

                    {/* Relational Content */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-[var(--color-bg)] border-4 border-black p-6 flex flex-col justify-between hover:bg-[#4ade80] transition-colors group">
                            <div>
                                <h3 className="text-2xl font-black uppercase mb-2 border-b-2 border-black pb-1">Available Courses</h3>
                                <p className="font-bold text-sm tracking-wide">Degrees and paths offered here.</p>
                            </div>
                            <button className="mt-6 border-2 border-black bg-white w-full py-3 font-black uppercase text-sm hover:translate-x-[2px] transition-transform">Explore Courses</button>
                        </div>

                        <div className="bg-[var(--color-bg)] border-4 border-black p-6 flex flex-col justify-between hover:bg-[#f43f5e] hover:text-white transition-colors group">
                            <div>
                                <h3 className="text-2xl font-black uppercase mb-2 border-b-2 border-black group-hover:border-white pb-1">Accepted Exams</h3>
                                <p className="font-bold text-sm tracking-wide">Entrance exams required for admission.</p>
                            </div>
                            <button className="mt-6 border-2 border-black group-hover:bg-black group-hover:border-black group-hover:text-white bg-white text-black w-full py-3 font-black uppercase text-sm">View Exams</button>
                        </div>
                    </section>

                    <div className="mt-16 bg-[var(--color-primary-blue)] border-4 border-black p-8 brutal-shadow flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div className="text-white">
                            <p className="font-black uppercase text-3xl drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">SPEAK TO ALUMNI</p>
                            <p className="font-bold mt-2 text-white/90">Find a mentor who actually studied at this college to get the real insight.</p>
                        </div>
                        <Link
                            href="/mentors"
                            className="brutal-btn bg-[#ffde59] text-black border-black px-8 py-4 text-center text-xl w-full sm:w-auto font-black uppercase whitespace-nowrap"
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
