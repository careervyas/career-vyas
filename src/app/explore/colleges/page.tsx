import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

async function getColleges() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/content/colleges`, {
        cache: 'no-store'
    });
    if (!res.ok) return [];
    return res.json();
}

export default async function ExploreCollegesPage() {
    const colleges = await getColleges();

    return (
        <main className="min-h-screen bg-[var(--color-bg)] text-black">
            <Navbar />

            <section className="pt-32 pb-24 border-b-4 border-black border-dashed min-h-[85vh]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="mb-16">
                        <h1 className="text-5xl md:text-7xl font-black uppercase mb-6 tracking-tight drop-shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
                            TOP <br />
                            <span className="bg-[#4ade80] text-black px-4 leading-[1.1] inline-block border-[5px] border-black brutal-shadow-sm -rotate-2 mt-2 mb-4">
                                COLLEGES
                            </span>
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {colleges.map((college: any, idx: number) => {
                            const bgColors = ['bg-white', 'bg-[#4ade80]', 'bg-[var(--color-primary-yellow)]'];
                            const cardColor = bgColors[idx % bgColors.length];

                            return (
                                <Link
                                    key={college.id}
                                    href={`/explore/colleges/${college.slug}`}
                                    className={`${cardColor} border-4 border-black flex flex-col brutal-shadow hover:translate-x-[4px] hover:-translate-y-[4px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all h-full group p-6`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`brutal-badge border-black ${cardColor === 'bg-white' ? 'bg-[#4ade80]' : 'bg-white'}`}>
                                            {college.type || 'University'}
                                        </span>
                                        <span className="font-black border-2 border-black bg-white px-2 py-1 brutal-shadow-sm">⭐ Ranking: {college.ranking || 'N/A'}</span>
                                    </div>

                                    <h2 className="text-2xl font-black leading-tight mb-2 uppercase group-hover:underline decoration-4 underline-offset-4">
                                        {college.name}
                                    </h2>
                                    <p className="font-bold text-sm mb-4 text-black/60 uppercase">
                                        📍 {college.city || 'India'}, {college.state}
                                    </p>

                                    <p className="text-black/80 font-bold mb-6 flex-grow line-clamp-3">
                                        {college.description || 'Top tier institution with comprehensive infrastructure and placement records.'}
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t-4 border-black border-dashed mb-4">
                                        <div>
                                            <p className={`font-black uppercase text-[10px] tracking-wider text-black/50`}>Est.</p>
                                            <p className="font-bold uppercase text-sm">{college.established || '1990'}</p>
                                        </div>
                                    </div>

                                    <div className={`pt-4 border-t-4 border-black`}>
                                        <span className="font-black uppercase text-sm">CAMPUS OVERVIEW ➝</span>
                                    </div>
                                </Link>
                            );
                        })}

                        {colleges.length === 0 && (
                            <div className="col-span-full border-4 border-black p-12 text-center bg-white brutal-shadow-sm">
                                <h3 className="text-2xl font-black uppercase mb-2">No Colleges Found</h3>
                                <p className="font-bold">Add institutions to the database via Admin panel.</p>
                            </div>
                        )}
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    );
}
