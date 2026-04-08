import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabaseAdmin } from "@/lib/supabase/admin";
import ShareButtons from "@/components/explore/ShareButtons";
import { Briefcase, GraduationCap, Star, TrendingUp, BookOpen, ExternalLink, Banknote, Users } from "lucide-react";
import PageTracker from "@/components/PageTracker";

export const dynamic = "force-dynamic";

async function getCareerAndRelations(slug: string) {
    const { data: career, error } = await supabaseAdmin
        .from("career_profiles")
        .select("*")
        .eq("slug", slug)
        .single();
    if (error || !career) return null;
    supabaseAdmin.rpc('increment_career_view', { career_slug: slug }).then();
    return { career };
}

export default async function CareerProfilePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const data = await getCareerAndRelations(slug);
    if (!data) notFound();

    const { career } = data;
    const layout = career.new_layout_data || {};

    const name = layout.name || career.name;
    const overview = layout.overview || career.overview?.summary || "Discover this career path.";
    const benefits = layout.benefits || "No benefits available.";
    const approach = layout.procedure_to_approach || layout.how_to_become || "No specific procedure documented.";
    const eligibilities = layout.eligibilities_and_skills || "No specific requirements documented.";
    const exams = layout.entrance_exams || "N/A";
    const courses = layout.course_descriptions || "N/A";
    const institutions = layout.top_institutions || "N/A";
    const specialisations = layout.specialisations || "N/A";
    const salary = layout.pay_scales || "No details available.";
    const promos = layout.promotions_upgradings || "N/A";
    const recruiters = layout.top_recruiting_agencies || "N/A";
    const demands = layout.demands_future_scope || "N/A";
    const inspiring = layout.inspiring_personalities || "N/A";

    return (
        <main className="min-h-screen bg-[var(--color-bg)] flex flex-col font-sans">
            <Navbar />
            <PageTracker activityType="PAGE_VIEW" contentType="CAREER PROFILE" contentId={name} />

            <article className="pt-28 pb-24 min-h-[85vh] relative overflow-hidden flex-grow">
                <div className="absolute top-20 right-10 w-64 h-64 bg-indigo-200 rounded-full blur-[100px] opacity-20 hidden md:block" />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

                    <Link href="/explore/careers" className="inline-flex items-center gap-2 font-semibold text-sm text-[var(--color-primary-indigo)] mb-8 hover:underline transition-colors">
                        All Careers
                    </Link>

                    <header className="mb-12 border-b border-[var(--color-border)] pb-8">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <ShareButtons title={name} path={`/explore/careers/${slug}`} />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-[1.1] text-[var(--color-text)]">
                            {name}
                        </h1>

                        <div className="modern-card p-6 bg-indigo-50 border-indigo-100">
                            <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">Overview & Responsibilities</h3>
                            <p className="text-[15px] font-medium leading-relaxed text-indigo-800 whitespace-pre-wrap">{overview}</p>
                        </div>
                    </header>

                    <div className="space-y-8">
                        {/* Benefits & Scope */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="modern-card p-6">
                                <h3 className="font-bold text-lg mb-4 text-emerald-700 flex items-center gap-2"><Star size={20}/> Benefits</h3>
                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{benefits}</p>
                            </div>
                            <div className="modern-card p-6 bg-[#f8f5ff] border-purple-200">
                                <h3 className="font-bold text-lg mb-4 text-purple-700 flex items-center gap-2"><TrendingUp size={20}/> Demand & Future Scope</h3>
                                <p className="text-sm text-purple-900 leading-relaxed whitespace-pre-wrap">{demands}</p>
                            </div>
                        </section>

                        {/* How To Approach & Eligibilities */}
                        <section className="modern-card p-8 border-l-4 border-l-blue-500 shadow-sm">
                            <h2 className="text-2xl font-bold mb-4 text-[var(--color-text)] flex items-center gap-3">
                                <GraduationCap size={24} className="text-blue-500" /> Basic Procedure & Eligibility
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-4">
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-2 border-b pb-2">Procedure to Approach</h4>
                                    <p className="text-[14px] text-gray-600 whitespace-pre-wrap">{approach}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-2 border-b pb-2">Working Env & Skills</h4>
                                    <p className="text-[14px] text-gray-600 whitespace-pre-wrap">{eligibilities}</p>
                                </div>
                            </div>
                        </section>

                        {/* Education Path */}
                        <section className="bg-white rounded-xl border border-[var(--color-border)] p-8 shadow-sm">
                            <h2 className="text-xl font-bold mb-6 text-[var(--color-text)] flex items-center gap-3">
                                <BookOpen size={24} className="text-indigo-500" /> Education & Specialisations
                            </h2>
                            <div className="space-y-6 text-[14px]">
                                <div><span className="font-bold text-indigo-700 block mb-1">Examinations:</span> <span className="text-gray-700 whitespace-pre-wrap">{exams}</span></div>
                                <div><span className="font-bold text-indigo-700 block mb-1">Degrees & Courses:</span> <span className="text-gray-700 whitespace-pre-wrap">{courses}</span></div>
                                <div><span className="font-bold text-indigo-700 block mb-1">Top Institutions:</span> <span className="text-gray-700 whitespace-pre-wrap">{institutions}</span></div>
                                <div><span className="font-bold text-indigo-700 block mb-1">Specialisations:</span> <span className="text-gray-700 whitespace-pre-wrap">{specialisations}</span></div>
                            </div>
                        </section>

                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="modern-card p-6">
                                <h3 className="font-bold text-lg mb-4 text-emerald-700 flex items-center gap-2"><Banknote size={20}/> Pay Scales & Experience</h3>
                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{salary}</p>
                            </div>
                            <div className="modern-card p-6">
                                <h3 className="font-bold text-lg mb-4 text-amber-700 flex items-center gap-2"><Briefcase size={20}/> Promotions & Upgradings</h3>
                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{promos}</p>
                            </div>
                        </section>

                        <section className="mt-8 bg-gray-50 border border-gray-200 p-6 rounded-xl text-[14px] space-y-6">
                            <div><span className="font-bold text-gray-800 block mb-2"><Users size={16} className="inline mr-1 text-gray-500"/> Top Recruiting Agencies:</span> <span className="text-gray-700 whitespace-pre-wrap">{recruiters}</span></div>
                            <div><span className="font-bold text-gray-800 block mb-2"><Star size={16} className="inline mr-1 text-gray-500"/> Inspiring Personalities:</span> <span className="text-gray-700 whitespace-pre-wrap">{inspiring}</span></div>
                        </section>

                    </div>

                    {/* Mentor CTA */}
                    <div className="mt-16 modern-card p-8 bg-gradient-to-r from-[var(--color-primary-indigo)] to-[var(--color-primary-indigo-dark)] text-white flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div>
                            <p className="text-2xl font-bold">Connect With a Mentor</p>
                            <p className="font-medium mt-2 text-indigo-100">Get 1-on-1 guidance from experts in {name}.</p>
                        </div>
                        <Link href="/mentors" className="bg-white text-[var(--color-primary-indigo)] px-8 py-3 rounded-full text-center font-semibold w-full sm:w-auto whitespace-nowrap hover:bg-indigo-50 transition-colors shadow-lg">
                            Find Mentor →
                        </Link>
                    </div>

                </div>
            </article>

            <Footer />
        </main>
    );
}
