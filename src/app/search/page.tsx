import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTracker from "@/components/PageTracker";

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
        <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans">
            <Navbar />

            {q && q.length > 1 && (
                <PageTracker activityType="SEARCH" contentType="GLOBAL_SEARCH" contentId={q} />
            )}

            <section className="pt-32 pb-24 border-b border-[var(--color-border)] min-h-[85vh] relative overflow-hidden">
                <div className="absolute top-20 right-10 w-64 h-64 bg-indigo-200 rounded-full blur-[100px] opacity-40 hidden md:block" />
                <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-200 rounded-full blur-[100px] opacity-40 hidden md:block" />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

                    <div className="mb-12 border-b border-[var(--color-border)] pb-8">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight text-[var(--color-text)]">
                            Search Results
                        </h1>
                        <p className="text-xl font-medium text-[var(--color-text-muted)] flex items-center gap-2">
                            Query: <span className="modern-badge bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1 text-lg">"{q || ''}"</span>
                        </p>
                    </div>

                    {!q ? (
                        <div className="modern-card p-8 bg-indigo-50/50 border border-indigo-100 font-semibold text-xl text-center text-[var(--color-primary-indigo)] text-[var(--color-text)]">
                            Please enter a search term to begin.
                        </div>
                    ) : !hasResults ? (
                        <div className="modern-card p-8 text-center text-xl font-medium text-[var(--color-text-muted)]">
                            No results found across the platform.
                        </div>
                    ) : (
                        <div className="space-y-12">

                            {results.careers?.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-bold uppercase mb-4 text-[var(--color-text)] tracking-widest border-b border-[var(--color-border)] pb-2 inline-block">CAREERS</h2>
                                    <div className="space-y-4">
                                        {results.careers.map((item: any) => (
                                            <Link key={item.id} href={`/explore/careers/${item.slug}`} className="block modern-card p-6 group hover:translate-x-1 transition-all">
                                                <h3 className="text-xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary-indigo)] transition-colors">{item.title}</h3>
                                                <p className="font-medium text-[var(--color-text-muted)] mt-2 line-clamp-2">{item.summary || 'Career profile overview'}</p>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {results.courses?.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-bold uppercase mb-4 text-[var(--color-text)] tracking-widest border-b border-[var(--color-border)] pb-2 inline-block">COURSES</h2>
                                    <div className="space-y-4">
                                        {results.courses.map((item: any) => (
                                            <Link key={item.id} href={`/explore/courses/${item.slug}`} className="block modern-card p-6 group hover:translate-x-1 transition-all">
                                                <h3 className="text-xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary-indigo)] transition-colors">{item.title}</h3>
                                                <p className="font-medium text-[var(--color-text-muted)] mt-2 line-clamp-2">{item.type || 'Degree path'}</p>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {results.exams?.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-bold uppercase mb-4 text-[var(--color-text)] tracking-widest border-b border-[var(--color-border)] pb-2 inline-block">EXAMS</h2>
                                    <div className="space-y-4">
                                        {results.exams.map((item: any) => (
                                            <Link key={item.id} href={`/explore/exams/${item.slug}`} className="block modern-card p-6 group hover:translate-x-1 transition-all">
                                                <h3 className="text-xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary-indigo)] transition-colors">{item.name}</h3>
                                                <p className="font-medium text-[var(--color-text-muted)] mt-2 line-clamp-2">{item.full_form || 'Entrance examination'}</p>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {results.colleges?.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-bold uppercase mb-4 text-[var(--color-text)] tracking-widest border-b border-[var(--color-border)] pb-2 inline-block">COLLEGES</h2>
                                    <div className="space-y-4">
                                        {results.colleges.map((item: any) => (
                                            <Link key={item.id} href={`/explore/colleges/${item.slug}`} className="block modern-card p-6 group hover:translate-x-1 transition-all">
                                                <h3 className="text-xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary-indigo)] transition-colors">{item.name}</h3>
                                                <p className="font-medium text-[var(--color-text-muted)] mt-2 flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                                    {item.city || 'India'}
                                                </p>
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
