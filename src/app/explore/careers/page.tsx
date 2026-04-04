import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CareerGrid from "@/components/explore/CareerGrid";
import { createClient } from "@supabase/supabase-js";

async function getCareers() {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { data } = await supabase.from("career_profiles").select("*").order("title");
        return data || [];
    } catch {
        return [];
    }
}

export const dynamic = "force-dynamic";

export default async function ExploreCareersPage() {
    const careers = await getCareers();

    return (
        <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans">
            <Navbar />

            <section className="pt-32 pb-24 border-b border-[var(--color-border)] min-h-[85vh] relative overflow-hidden">
                {/* Background Decorative Gradient Orbs */}
                <div className="absolute top-20 right-10 w-64 h-64 bg-indigo-200 rounded-full blur-[100px] opacity-40 hidden md:block" />
                <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-200 rounded-full blur-[100px] opacity-40 hidden md:block" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

                    <div className="mb-16">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-[1.1] text-[var(--color-text)]">
                            <span className="text-[var(--color-primary-indigo)] mb-2 block">Explore</span>
                            Career Paths
                        </h1>
                        <p className="text-lg md:text-xl font-medium max-w-2xl text-[var(--color-text-muted)] leading-relaxed">
                            Discover over 100+ highly vetted career paths. Find out exactly what it takes, what it pays, and how to get there.
                        </p>
                    </div>

                    <CareerGrid initialCareers={careers} />

                </div>
            </section>

            <Footer />
        </main>
    );
}
