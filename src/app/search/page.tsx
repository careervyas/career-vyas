import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

async function performSearch(query: string) {
    if (!query) return null;
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/search?q=${encodeURIComponent(query)}`, {
        cache: 'no-store'
    });
    if (!res.ok) return null;
    return res.json();
}

export default async function SearchResultsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const { q } = await searchParams;
    const results = await performSearch(q || "");

    const hasResults = results && (
        results.careers?.length > 0 ||
        results.courses?.length > 0 ||
        results.exams?.length > 0 ||
        results.colleges?.length > 0
    );

    return (
        <main className="min-h-screen bg-[var(--color-bg)] text-black font-sans">
            <Navbar />

            <section className="pt-32 pb-24 border-b-4 border-black border-dashed min-h-[85vh]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="mb-12 border-b-4 border-black pb-8">
                        <h1 className="text-4xl md:text-6xl font-black uppercase mb-4 tracking-tight">
                            Search Results
                        </h1>
                        <p className="text-2xl font-bold bg-white border-[3px] border-black p-4 brutal-shadow-sm inline-block">
                            Query: <span className="bg-[var(--color-primary-yellow)] px-2">"{q || ''}"</span>
                        </p>
                    </div>

                    {!q ? (
                        <div className="bg-[#f43f5e] text-white p-8 border-4 border-black brutal-shadow-sm font-black text-2xl uppercase">
                            Please enter a search term to begin.
                        </div>
                    ) : !hasResults ? (
                        <div className="bg-white p-8 border-4 border-black brutal-shadow-sm font-black text-2xl uppercase text-center">
                            No results found across the platform.
                        </div>
                    ) : (
                        <div className="space-y-12">

                            {results.careers?.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-black uppercase mb-4 bg-black text-white p-2 inline-block border-2 border-black">CAREERS</h2>
                                    <div className="space-y-4">
                                        {results.careers.map((item: any) => (
                                            <Link key={item.id} href={`/explore/careers/${item.slug}`} className="block border-4 border-black bg-white p-6 brutal-shadow-sm hover:translate-x-[2px] hover:-translate-y-[2px] transition-all">
                                                <h3 className="text-xl font-black uppercase hover:underline">{item.title}</h3>
                                                <p className="font-bold text-black/70 mt-2">{item.summary || 'Career profile overview'}</p>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {results.courses?.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-black uppercase mb-4 bg-[var(--color-primary-blue)] text-white p-2 inline-block border-2 border-black">COURSES</h2>
                                    <div className="space-y-4">
                                        {results.courses.map((item: any) => (
                                            <Link key={item.id} href={`/explore/courses/${item.slug}`} className="block border-4 border-black bg-white p-6 brutal-shadow-sm hover:translate-x-[2px] hover:-translate-y-[2px] transition-all">
                                                <h3 className="text-xl font-black uppercase hover:underline">{item.title}</h3>
                                                <p className="font-bold text-black/70 mt-2">{item.type || 'Degree path'}</p>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {results.exams?.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-black uppercase mb-4 bg-[#f43f5e] text-white p-2 inline-block border-2 border-black">EXAMS</h2>
                                    <div className="space-y-4">
                                        {results.exams.map((item: any) => (
                                            <Link key={item.id} href={`/explore/exams/${item.slug}`} className="block border-4 border-black bg-white p-6 brutal-shadow-sm hover:translate-x-[2px] hover:-translate-y-[2px] transition-all">
                                                <h3 className="text-xl font-black uppercase hover:underline">{item.name}</h3>
                                                <p className="font-bold text-black/70 mt-2">{item.full_form || 'Entrance examination'}</p>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {results.colleges?.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-black uppercase mb-4 bg-[#4ade80] text-black p-2 inline-block border-2 border-black">COLLEGES</h2>
                                    <div className="space-y-4">
                                        {results.colleges.map((item: any) => (
                                            <Link key={item.id} href={`/explore/colleges/${item.slug}`} className="block border-4 border-black bg-white p-6 brutal-shadow-sm hover:translate-x-[2px] hover:-translate-y-[2px] transition-all">
                                                <h3 className="text-xl font-black uppercase hover:underline">{item.name}</h3>
                                                <p className="font-bold text-black/70 mt-2">📍 {item.city || 'India'}</p>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    )}

                </div>
            </section>

            <Footer />
        </main>
    );
}
