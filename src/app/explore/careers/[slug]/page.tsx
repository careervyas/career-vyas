import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

async function getCareer(slug: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/content/careers/${slug}`, {
        cache: 'no-store'
    });
    if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error('Failed to fetch career');
    }
    return res.json();
}

export default async function CareerProfilePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const career = await getCareer(slug);

    if (!career) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[var(--color-bg)] text-black font-sans">
            <Navbar />

            <article className="pt-32 pb-24 min-h-[85vh] relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

                    <Link href="/explore/careers" className="inline-flex items-center gap-2 font-bold uppercase mb-8 hover:underline decoration-4 underline-offset-4">
                        <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        ALL CAREERS
                    </Link>

                    <header className="mb-12 border-b-4 border-black pb-8">
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <span className="brutal-badge bg-[var(--color-primary-orange)] text-black">
                                {career.demand || 'High Demand'}
                            </span>
                            <span className="font-bold uppercase text-sm border-2 border-black px-2 py-1 bg-white brutal-shadow-sm">
                                ⏳ {career.study_duration || 'Not specified'}
                            </span>
                            <span className="font-bold uppercase text-sm border-2 border-black px-2 py-1 bg-[#4ade80] brutal-shadow-sm">
                                💰 {career.salary_range || 'Varies'}
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-8 leading-[1.1] flex items-center gap-4">
                            <span className="text-6xl md:text-8xl drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">{career.icon}</span>
                            {career.title}
                        </h1>

                        <p className="text-2xl font-bold bg-white border-4 border-black p-6 brutal-shadow-sm leading-relaxed">
                            {career.summary}
                        </p>
                    </header>

                    <section className="bg-white border-4 border-black p-8 brutal-shadow mb-12">
                        <h2 className="text-3xl font-black uppercase mb-6 border-b-4 border-black pb-2 inline-block">
                            ABOUT THIS PATH
                        </h2>
                        <div className="prose prose-lg max-w-none prose-p:font-bold prose-p:text-black/80 prose-p:leading-relaxed whitespace-pre-wrap">
                            {career.description || "No detailed description provided yet."}
                        </div>
                    </section>

                    <div className="mt-16 pt-8 border-t-4 border-black flex flex-col sm:flex-row justify-between items-center gap-6">
                        <p className="font-black uppercase text-2xl">TALK TO AN EXPERT</p>
                        <Link
                            href="/webinar"
                            className="brutal-btn bg-[var(--color-primary-blue)] text-white px-8 py-4 text-center text-lg w-full sm:w-auto font-black uppercase"
                        >
                            BOOK FREE WEBINAR
                        </Link>
                    </div>

                </div>
            </article>

            <Footer />
        </main>
    );
}
