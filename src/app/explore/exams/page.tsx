import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

async function getExams() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/content/exams`, {
        cache: 'no-store'
    });
    if (!res.ok) return [];
    return res.json();
}

export default async function ExploreExamsPage() {
    const exams = await getExams();

    return (
        <main className="min-h-screen bg-[var(--color-bg)] text-black">
            <Navbar />

            <section className="pt-32 pb-24 border-b-4 border-black border-dashed min-h-[85vh]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="mb-16">
                        <h1 className="text-5xl md:text-7xl font-black uppercase mb-6 tracking-tight drop-shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
                            ALL <br />
                            <span className="bg-[#f43f5e] text-white px-4 leading-[1.1] inline-block border-[5px] border-black brutal-shadow-sm rotate-2 mt-2 mb-4">
                                EXAMS
                            </span>
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {exams.map((exam: any, idx: number) => {
                            const bgColors = ['bg-white', 'bg-[#f43f5e]'];
                            const cardColor = bgColors[idx % bgColors.length];

                            return (
                                <Link
                                    key={exam.id}
                                    href={`/explore/exams/${exam.slug}`}
                                    className={`${cardColor} border-4 border-black flex flex-col brutal-shadow hover:translate-x-[4px] hover:-translate-y-[4px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all h-full group p-6 ${cardColor === 'bg-[#f43f5e]' ? 'text-white' : 'text-black'}`}
                                >
                                    <div className="flex justify-between items-start mb-4 gap-2">
                                        <div>
                                            <h2 className="text-3xl font-black leading-tight uppercase group-hover:underline decoration-4 underline-offset-4">
                                                {exam.name}
                                            </h2>
                                            <p className={`font-bold text-sm ${cardColor === 'bg-[#f43f5e]' ? 'text-white/80' : 'text-black/60'}`}>{exam.full_form}</p>
                                        </div>
                                        <span className="brutal-badge border-black bg-white text-black shrink-0">
                                            {exam.level || 'National'}
                                        </span>
                                    </div>

                                    <p className={`font-bold mb-6 flex-grow line-clamp-3 ${cardColor === 'bg-[#f43f5e]' ? 'text-white/90' : 'text-black/80'}`}>
                                        {exam.description || 'Comprehensive details about the exam pattern, important dates, and eligibility.'}
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t-4 border-black border-dashed mb-4">
                                        <div>
                                            <p className={`font-black uppercase text-[10px] tracking-wider ${cardColor === 'bg-[#f43f5e]' ? 'text-white/70' : 'text-black/50'}`}>Next Date</p>
                                            <p className="font-bold uppercase text-sm">{exam.exam_date || 'TBA 2026'}</p>
                                        </div>
                                    </div>

                                    <div className={`pt-4 border-t-4 border-black ${cardColor === 'bg-[#f43f5e]' ? 'text-white border-white' : 'text-black'}`}>
                                        <span className="font-black uppercase text-sm">PREPARATION GUIDE ➝</span>
                                    </div>
                                </Link>
                            );
                        })}

                        {exams.length === 0 && (
                            <div className="col-span-full border-4 border-black p-12 text-center bg-white brutal-shadow-sm">
                                <h3 className="text-2xl font-black uppercase mb-2">No Exams Found</h3>
                                <p className="font-bold">Check back later for updated exam schedules.</p>
                            </div>
                        )}
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    );
}
