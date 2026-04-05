"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cal, { getCalApi } from "@calcom/embed-react";
import PageTracker from "@/components/PageTracker";

export default function MentorBookingPage() {
    const { id } = useParams();
    const [mentor, setMentor] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMentor() {
            if (!id) return;
            const { data, error } = await supabase
                .from("mentors")
                .select("*")
                .eq("id", id)
                .single();

            if (!error && data) {
                setMentor(data);
            }
            setLoading(false);
        }
        fetchMentor();
    }, [id]);

    useEffect(() => {
        (async function () {
            const cal = await getCalApi();
            cal("ui", { "styles": { "branding": { "brandColor": "#000000" } }, "hideEventTypeDetails": false, "layout": "month_view" });
        })();
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
                <div className="modern-card p-8 animate-pulse text-center">
                    <h1 className="text-3xl font-bold text-[var(--color-text)]">
                        Loading Mentor...
                    </h1>
                </div>
            </div>
        );
    }

    if (!mentor) {
        return (
            <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
                <div className="modern-card p-8 text-center bg-red-50 border-red-100">
                    <h1 className="text-3xl font-bold text-red-600">
                        Mentor Not Found
                    </h1>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans">
            <Navbar />
            <PageTracker activityType="BOOKING_INITIATED" contentType="MENTOR_SESSION" contentId={mentor.name} />

            <section className="pt-32 pb-24 border-b border-[var(--color-border)] min-h-[85vh] relative overflow-hidden">
                <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-200 rounded-full blur-[100px] opacity-40 hidden md:block" />
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full blur-[100px] opacity-40 hidden md:block" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                        {/* Left Column: Mentor Info */}
                        <div className="lg:w-1/3">
                            <div className="modern-card flex flex-col items-center p-8 sticky top-24 overflow-hidden">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-60"></div>
                                {mentor.image_url ? (
                                    <img src={mentor.image_url} alt={mentor.name} className="w-48 h-48 rounded-3xl shadow-sm border border-[var(--color-border)] object-cover mb-6 bg-white relative z-10" />
                                ) : (
                                    <div className="w-48 h-48 rounded-3xl shadow-sm border border-[var(--color-border)] bg-[var(--color-primary-indigo)] text-white flex items-center justify-center text-7xl font-bold uppercase mb-6 relative z-10">
                                        {mentor.name.charAt(0)}
                                    </div>
                                )}

                                <h1 className="text-3xl font-bold mb-2 text-center text-[var(--color-text)] relative z-10">{mentor.name}</h1>
                                <p className="font-medium text-sm text-[var(--color-text-muted)] uppercase tracking-widest mb-6 text-center border-b border-[var(--color-border)] pb-6 w-full relative z-10">
                                    {mentor.college || 'Industry Expert'}
                                </p>

                                <div className="flex flex-wrap gap-2 justify-center mb-8 relative z-10">
                                    {mentor.expertise?.map((exp: string, i: number) => (
                                        <span key={i} className="modern-badge bg-indigo-50/50 text-indigo-700 border border-indigo-100">{exp}</span>
                                    ))}
                                </div>

                                <div className="bg-[var(--color-bg-soft)] border border-[var(--color-border)] rounded-2xl p-6 w-full shadow-sm text-left font-medium leading-relaxed text-[var(--color-text-muted)] relative z-10">
                                    {mentor.bio || 'Experienced professional offering 1-on-1 guidance to help you navigate your career path.'}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Booking Widget */}
                        <div className="lg:w-2/3">
                            <div className="modern-card p-4 md:p-10 min-h-[600px] flex flex-col relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-[var(--color-primary-indigo)] text-white font-semibold uppercase tracking-widest text-xs px-6 py-3 rounded-bl-3xl z-20 shadow-sm border-b border-l border-indigo-400/30">
                                    60-Min Session
                                </div>

                                <h2 className="text-3xl font-bold mb-8 border-b border-[var(--color-border)] pb-6 text-[var(--color-text)]">
                                    Schedule Your Meeting
                                </h2>

                                <div className="flex-grow w-full relative z-10 bg-[var(--color-bg-soft)] rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-inner">
                                    {/* 
                                       Using a placeholder Cal.com link for the MVP since we don't have the user's Cal.com.
                                       Normally this would be `mentor.calcom_link` or similar. 
                                     */}
                                    <Cal
                                        calLink="rick/get-rick-rolled"
                                        style={{ width: "100%", height: "100%", overflow: "auto" }}
                                        config={{ "layout": "month_view" }}
                                    />
                                </div>

                                <p className="mt-8 font-medium text-sm text-[var(--color-text-muted)] text-center flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"></path></svg>
                                    Powered by Cal.com • Sessions via Google Meet
                                </p>
                            </div>
                        </div>

                    </div>

                </div>
            </section>

            <Footer />
        </main>
    );
}
