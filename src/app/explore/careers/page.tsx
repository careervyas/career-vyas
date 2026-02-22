import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// We'll fetch from our own internal API route to demonstrate full-stack data flow
async function getCareers() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/content/careers`, {
        cache: 'no-store' // Always fetch fresh for now
    });
    if (!res.ok) return [];
    return res.json();
}

export default async function ExploreCareersPage() {
    const careers = await getCareers();

    return (
        <main className="min-h-screen bg-[var(--color-bg)] text-black">
            <Navbar />

            <section className="pt-32 pb-24 border-b-4 border-black border-dashed min-h-[85vh] relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

                    <div className="mb-16">
                        <h1 className="text-5xl md:text-7xl font-black uppercase mb-6 tracking-tight drop-shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
                            EXPLORE <br />
                            <span className="bg-[var(--color-primary-yellow)] px-4 leading-[1.1] inline-block border-[5px] border-black brutal-shadow-sm rotate-2 mt-2 mb-4">
                                CAREERS
                            </span>
                        </h1>
                        <p className="text-xl font-bold max-w-2xl text-black/80 leading-relaxed border-l-4 border-black pl-6 bg-white p-4 brutal-shadow-sm text-left">
                            Discover over 100+ highly vetted career paths. Find out exactly what it takes, what it pays, and how to get there.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {careers.map((career: any, idx: number) => {
                            const bgColors = [
                                'bg-[var(--color-primary-blue)]',
                                'bg-[#4ade80]',
                                'bg-[var(--color-primary-orange)]',
                                'bg-[#f43f5e]',
                                'bg-[var(--color-primary-purple)]'
                            ];
                            const headerColor = bgColors[idx % bgColors.length];

                            return (
                                <Link
                                    key={career.id}
                                    href={`/explore/careers/${career.slug}`}
                                    className="bg-white border-4 border-black flex flex-col brutal-shadow hover:translate-x-[4px] hover:-translate-y-[4px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all h-full group"
                                >
                                    <div className={`${headerColor} border-b-4 border-black p-6 flex justify-between items-center`}>
                                        <span className="text-5xl drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] group-hover:scale-110 transition-transform">{career.icon || '💼'}</span>
                                        <span className="brutal-badge bg-white text-black drop-shadow-none">₹{career.salary_range}</span>
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow">
                                        <h2 className="text-2xl font-black leading-tight mb-3 uppercase group-hover:underline decoration-4 underline-offset-4">
                                            {career.title}
                                        </h2>

                                        <p className="text-black/80 font-bold mb-6 flex-grow leading-snug">
                                            {career.summary}
                                        </p>

                                        <div className="grid grid-cols-2 gap-4 pt-4 border-t-4 border-black border-dashed mt-auto">
                                            <div>
                                                <p className="font-black uppercase text-[10px] text-black/50 tracking-wider">Demand</p>
                                                <p className="font-bold uppercase text-sm">{career.demand || 'High'}</p>
                                            </div>
                                            <div>
                                                <p className="font-black uppercase text-[10px] text-black/50 tracking-wider">Duration</p>
                                                <p className="font-bold uppercase text-sm">{career.study_duration || '3-4 Yrs'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}

                        {careers.length === 0 && (
                            <div className="col-span-full border-4 border-black p-12 text-center bg-white brutal-shadow-sm">
                                <h3 className="text-2xl font-black uppercase mb-2">No Careers Found</h3>
                                <p className="font-bold">Add some profiles via the Admin Dashboard to see them here.</p>
                            </div>
                        )}
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    );
}
