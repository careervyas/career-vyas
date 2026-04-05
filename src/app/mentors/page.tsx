import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Always fetch fresh mentors data
export const dynamic = "force-dynamic";

export default async function MentorsPage() {
    const { data: mentors } = await supabase
        .from("mentors")
        .select("*")
        .eq('is_active', true)
        .order("order", { ascending: true });

    const displayMentors = mentors || [];

    return (
        <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans">
            <Navbar />

            <section className="pt-32 pb-24 border-b border-[var(--color-border)] min-h-[85vh] relative overflow-hidden">
                <div className="absolute top-20 right-10 w-64 h-64 bg-indigo-200 rounded-full blur-[100px] opacity-40 hidden md:block" />
                <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-200 rounded-full blur-[100px] opacity-40 hidden md:block" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

                    <div className="mb-16">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-[1.1] text-[var(--color-text)]">
                            <span className="text-[var(--color-primary-indigo)] mb-2 block">Our</span>
                            Mentors
                        </h1>
                        <p className="text-lg md:text-xl font-medium max-w-2xl text-[var(--color-text-muted)] leading-relaxed">
                            Book a 1-on-1 session with industry leaders who have already walked the path you want to take.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {displayMentors.map((mentor, idx) => {
                            return (
                                <div key={mentor.id} className="modern-card flex flex-col h-full group overflow-hidden">
                                    <div className="bg-indigo-50/50 border-b border-[var(--color-border)] p-6 flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100/50 rounded-full blur-2xl -mr-10 -mt-10 opacity-60"></div>
                                        {mentor.image_url ? (
                                            <img src={mentor.image_url} alt={mentor.name} className="w-24 h-24 rounded-2xl shadow-sm object-cover relative z-10 bg-white" />
                                        ) : (
                                            <div className="w-24 h-24 rounded-2xl shadow-sm bg-[var(--color-primary-indigo)] text-white flex items-center justify-center text-4xl font-bold uppercase relative z-10">
                                                {mentor.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow text-center">
                                        <h2 className="text-2xl font-bold mb-1 text-[var(--color-text)] group-hover:text-[var(--color-primary-indigo)] transition-colors">{mentor.name}</h2>
                                        <p className="font-medium text-sm text-[var(--color-text-muted)] uppercase tracking-wide mb-4">{mentor.college || 'Industry Expert'}</p>

                                        <div className="flex flex-wrap gap-2 justify-center mb-6">
                                            {mentor.expertise?.map((exp: string, i: number) => (
                                                <span key={i} className="modern-badge bg-white shadow-sm border border-[var(--color-border)] text-[var(--color-text-muted)]">{exp}</span>
                                            ))}
                                        </div>

                                        <p className="font-medium mb-8 flex-grow line-clamp-3 leading-relaxed text-[var(--color-text-muted)]">
                                            {mentor.bio || 'Book a 60-minute session to discuss career goals, resume reviews, or interview preparation.'}
                                        </p>

                                        <Link
                                            href={`/mentors/${mentor.id}`}
                                            className="modern-btn mt-auto justify-center w-full shadow-sm text-sm"
                                        >
                                            BOOK SESSION
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}

                        {displayMentors.length === 0 && (
                            <div className="col-span-full modern-card p-12 text-center bg-white">
                                <h3 className="text-2xl font-bold mb-2 text-[var(--color-text)]">No Mentors Currently Available</h3>
                                <p className="font-medium text-[var(--color-text-muted)] mt-2">Check back soon for our new expert roster.</p>
                            </div>
                        )}
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    );
}
