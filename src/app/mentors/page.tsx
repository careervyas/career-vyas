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
        <main className="min-h-screen bg-[var(--color-bg)] text-black">
            <Navbar />

            <section className="pt-32 pb-24 border-b-4 border-black border-dashed">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="mb-16">
                        <h1 className="text-5xl md:text-7xl font-black uppercase mb-6 tracking-tight drop-shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
                            OUR <br />
                            <span className="bg-[var(--color-primary-purple)] text-white px-4 leading-[1.1] inline-block border-[5px] border-black brutal-shadow-sm -rotate-2 mt-2 mb-4">
                                MENTORS
                            </span>
                        </h1>
                        <p className="text-xl font-bold max-w-2xl text-black/80 leading-relaxed border-l-4 border-black pl-6 bg-white p-4 brutal-shadow-sm text-left">
                            Book a 1-on-1 session with industry leaders who have already walked the path you want to take.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {displayMentors.map((mentor, idx) => {
                            const bgs = ['bg-[var(--color-primary-blue)]', 'bg-[var(--color-primary-yellow)]', 'bg-[#4ade80]', 'bg-[var(--color-primary-orange)]'];
                            const bg = bgs[idx % bgs.length];

                            return (
                                <div key={mentor.id} className="bg-white border-4 border-black flex flex-col brutal-shadow hover:translate-x-[4px] hover:-translate-y-[4px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all h-full group">
                                    <div className={`${bg} border-b-4 border-black p-6 flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden`}>
                                        {mentor.image_url ? (
                                            <img src={mentor.image_url} alt={mentor.name} className="w-24 h-24 rounded-none border-4 border-black brutal-shadow-sm object-cover relative z-10 bg-white" />
                                        ) : (
                                            <div className="w-24 h-24 rounded-none border-4 border-black brutal-shadow-sm bg-black text-white flex items-center justify-center text-4xl font-black uppercase relative z-10">
                                                {mentor.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow text-center">
                                        <h2 className="text-2xl font-black uppercase mb-1">{mentor.name}</h2>
                                        <p className="font-bold text-sm text-black/60 uppercase mb-4">{mentor.college || 'Industry Expert'}</p>

                                        <div className="flex flex-wrap gap-2 justify-center mb-6">
                                            {mentor.expertise?.map((exp: string, i: number) => (
                                                <span key={i} className="brutal-badge border-black bg-white">{exp}</span>
                                            ))}
                                        </div>

                                        <p className="font-bold mb-8 flex-grow line-clamp-3 leading-relaxed">
                                            {mentor.bio || 'Book a 60-minute session to discuss career goals, resume reviews, or interview preparation.'}
                                        </p>

                                        <Link
                                            href={`/mentors/${mentor.id}`}
                                            className="mt-auto border-4 border-black bg-black text-white font-black uppercase py-4 group-hover:bg-[var(--color-primary-purple)] group-hover:text-white group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:!translate-y-[2px] transition-all"
                                        >
                                            BOOK SESSION
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}

                        {displayMentors.length === 0 && (
                            <div className="col-span-full border-4 border-black p-12 text-center bg-white brutal-shadow-sm">
                                <h3 className="text-2xl font-black uppercase mb-2">No Mentors Currently Available</h3>
                                <p className="font-bold border-t-2 border-black inline-block mt-4 pt-2">Check back soon for our new expert roster.</p>
                            </div>
                        )}
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    );
}
