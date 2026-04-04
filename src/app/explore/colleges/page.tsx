import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CollegeGrid from "@/components/explore/CollegeGrid";
import { createClient } from "@supabase/supabase-js";

async function getColleges() {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { data } = await supabase.from("colleges").select("*").order("name");
        return data || [];
    } catch {
        return [];
    }
}

export const dynamic = "force-dynamic";

export default async function ExploreCollegesPage() {
    const colleges = await getColleges();

    return (
        <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans">
            <Navbar />

            <section className="pt-32 pb-24 border-b border-[var(--color-border)] min-h-[85vh] relative overflow-hidden">
                <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-200 rounded-full blur-[100px] opacity-40 hidden md:block" />
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-teal-200 rounded-full blur-[100px] opacity-40 hidden md:block" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

                    <div className="mb-16">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-[1.1] text-[var(--color-text)]">
                            <span className="text-emerald-600 mb-2 block">Premier</span>
                            Colleges
                        </h1>
                        <p className="text-lg md:text-xl font-medium max-w-2xl text-[var(--color-text-muted)] leading-relaxed">
                            Discover the top institutions across India. Compare placements, courses, and find your perfect campus.
                        </p>
                    </div>

                    <CollegeGrid initialColleges={colleges} />

                </div>
            </section>

            <Footer />
        </main>
    );
}
