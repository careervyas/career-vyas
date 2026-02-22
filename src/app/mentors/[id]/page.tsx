"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cal, { getCalApi } from "@calcom/embed-react";

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
                <h1 className="text-4xl font-black uppercase border-4 border-black p-8 bg-white brutal-shadow animate-pulse">
                    LOADING MENTOR...
                </h1>
            </div>
        );
    }

    if (!mentor) {
        return (
            <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
                <h1 className="text-4xl font-black uppercase border-4 border-black p-8 bg-[#f43f5e] text-white brutal-shadow">
                    MENTOR NOT FOUND
                </h1>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[var(--color-bg)] text-black font-sans">
            <Navbar />

            <section className="pt-32 pb-24 border-b-4 border-black border-dashed min-h-[85vh]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex flex-col lg:flex-row gap-12">

                        {/* Left Column: Mentor Info */}
                        <div className="lg:w-1/3">
                            <div className="bg-[var(--color-primary-yellow)] border-4 border-black flex flex-col brutal-shadow items-center p-8 sticky top-24">
                                {mentor.image_url ? (
                                    <img src={mentor.image_url} alt={mentor.name} className="w-48 h-48 rounded-none border-4 border-black brutal-shadow object-cover mb-6 bg-white" />
                                ) : (
                                    <div className="w-48 h-48 rounded-none border-4 border-black brutal-shadow bg-black text-white flex items-center justify-center text-7xl font-black uppercase mb-6">
                                        {mentor.name.charAt(0)}
                                    </div>
                                )}

                                <h1 className="text-3xl font-black uppercase mb-2 text-center">{mentor.name}</h1>
                                <p className="font-bold text-lg text-black/80 uppercase mb-6 text-center border-b-4 border-black pb-4 w-full">
                                    {mentor.college || 'Industry Expert'}
                                </p>

                                <div className="flex flex-wrap gap-2 justify-center mb-8">
                                    {mentor.expertise?.map((exp: string, i: number) => (
                                        <span key={i} className="brutal-badge border-black bg-white">{exp}</span>
                                    ))}
                                </div>

                                <div className="bg-white border-4 border-black p-6 w-full brutal-shadow-sm text-left line-clamp-6 font-bold leading-relaxed">
                                    {mentor.bio || 'Experienced professional offering 1-on-1 guidance to help you navigate your career path.'}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Booking Widget */}
                        <div className="lg:w-2/3">
                            <div className="bg-white border-4 border-black p-2 md:p-8 brutal-shadow min-h-[600px] flex flex-col relative overflow-hidden">

                                <div className="absolute top-0 right-0 bg-black text-white font-black uppercase px-4 py-2 border-b-4 border-l-4 border-black z-20">
                                    60-MIN SESSION
                                </div>

                                <h2 className="text-3xl font-black uppercase mb-8 border-b-4 border-black pb-4">
                                    Schedule Your Meeting
                                </h2>

                                <div className="flex-grow w-full relative z-10 border-4 border-black bg-[var(--color-bg)]">
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

                                <p className="mt-8 font-bold text-sm text-black/60 uppercase text-center">
                                    Powered by Cal.com • Sessions are typically conducted via Google Meet
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
