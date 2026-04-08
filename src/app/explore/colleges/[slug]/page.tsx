import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabaseAdmin } from "@/lib/supabase/admin";
import ShareButtons from "@/components/explore/ShareButtons";
import { MapPin, Globe, Banknote, Users, GraduationCap, Building2, Bed, Landmark, BarChart3, ExternalLink, Trophy, Navigation, Star } from "lucide-react";
import PageTracker from "@/components/PageTracker";

export const dynamic = "force-dynamic";

async function getCollegeAndRelations(slug: string) {
    const { data: college, error } = await supabaseAdmin
        .from("college_profiles")
        .select("*")
        .eq("slug", slug)
        .single();
    if (error || !college) return null;
    return { college };
}

export default async function CollegeProfilePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const data = await getCollegeAndRelations(slug);
    if (!data) notFound();

    const { college } = data;
    const layout = college.new_layout_data || {};

    const name = layout.name || college.name;
    const description = layout.description || college.about?.description || "Information being updated.";
    const importantStats = layout.important_information || "No details available";
    const coursesOffered = layout.courses_offered || "Courses data currently unavailable.";
    const feeStructure = layout.fee_structure || "Fee data currently unavailable.";
    const hostelInfo = layout.student_hostel_details || "Hostel information is not available.";
    const campusFac = layout.campus_facilities || "No campus facilities listed.";
    const extraCurric = layout.extracurricular_activities || "No extracurricular information available.";
    const placementStats = layout.placement_statistics || "Placement statistics currently unavailable.";

    return (
        <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans">
            <Navbar />
            <PageTracker activityType="PAGE_VIEW" contentType="COLLEGE PROFILE" contentId={name} />

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
                        <span className="text-[var(--color-text)] font-medium truncate">{name}</span>
                    </nav>

                    <header className="mb-0 pb-6 border-b border-[var(--color-border)]">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-3 text-[var(--color-text)]">
                            {name}
                        </h1>

                        <div className="flex items-center gap-3 mt-4">
                            <ShareButtons title={name} path={`/explore/colleges/${slug}`} />
                        </div>
                    </header>

                    <div className="mt-8 space-y-10">
                        {/* Summary & Important Information */}
                        <section className="bg-white rounded-xl border border-[var(--color-border)] p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
                                <Landmark size={20} className="text-emerald-600" /> College Overview
                            </h2>
                            <p className="text-[15px] leading-relaxed text-[var(--color-text-muted)] whitespace-pre-wrap">{description}</p>
                            
                            <div className="mt-6 pt-4 border-t border-[var(--color-border)]">
                                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                    <MapPin size={16} className="text-rose-500"/> Important Information
                                </h3>
                                <p className="text-sm text-gray-600 whitespace-pre-wrap">{importantStats}</p>
                            </div>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            {/* Courses Offered */}
                            <section className="bg-white rounded-xl border border-[var(--color-border)] p-6 shadow-sm">
                                <h2 className="text-xl font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
                                    <GraduationCap size={20} className="text-purple-600" /> Courses Offered
                                </h2>
                                <p className="text-[14px] leading-relaxed text-gray-700 whitespace-pre-wrap">{coursesOffered}</p>
                            </section>

                            {/* Fee Structure */}
                            <section className="bg-white rounded-xl border border-[var(--color-border)] p-6 shadow-sm">
                                <h2 className="text-xl font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
                                    <Banknote size={20} className="text-amber-600" /> Fee Structure
                                </h2>
                                <p className="text-[14px] leading-relaxed text-gray-700 whitespace-pre-wrap">{feeStructure}</p>
                            </section>
                        </div>

                        {/* Placements */}
                        <section className="bg-[#f0fbff] border-blue-200 border rounded-xl p-8 shadow-sm">
                            <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                                <BarChart3 size={24} className="text-blue-600" /> Placement Statistics
                            </h2>
                            <p className="text-[15px] text-blue-800 leading-relaxed whitespace-pre-wrap">{placementStats}</p>
                        </section>

                        {/* Hostel & Campus */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl border border-[var(--color-border)] p-6 shadow-sm">
                                <h3 className="text-lg font-bold mb-4 text-[var(--color-text)] flex items-center gap-2">
                                    <Bed size={18} className="text-rose-500" /> Student Hostel Details
                                </h3>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{hostelInfo}</p>
                            </div>

                            <div className="bg-white rounded-xl border border-[var(--color-border)] p-6 shadow-sm">
                                <h3 className="text-lg font-bold mb-4 text-[var(--color-text)] flex items-center gap-2">
                                    <Building2 size={18} className="text-indigo-500" /> Campus Facilities
                                </h3>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{campusFac}</p>
                            </div>
                        </section>

                        {/* Extra-Curriculars */}
                        <section className="bg-white rounded-xl border border-[var(--color-border)] p-6 shadow-sm">
                                <h3 className="text-lg font-bold mb-4 text-[var(--color-text)] flex items-center gap-2">
                                    <Trophy size={18} className="text-yellow-500" /> Extracurricular Activities
                                </h3>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{extraCurric}</p>
                        </section>

                    </div>

                    {/* MENTOR CTA */}
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
