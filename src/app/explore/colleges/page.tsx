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
        <main className="min-h-screen bg-[var(--color-bg)] text-black font-sans">
            <Navbar />

            <section className="pt-32 pb-24 border-b-4 border-black border-dashed min-h-[85vh]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="mb-16">
                        <h1 className="text-5xl md:text-7xl font-black uppercase mb-6 tracking-tight drop-shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
                            PREMIER <br />
                            <span className="bg-[#4ade80] text-black px-4 leading-[1.1] inline-block border-[5px] border-black brutal-shadow-sm rotate-2 mt-2 mb-4">
                                COLLEGES
                            </span>
                        </h1>
                        <p className="text-xl font-bold max-w-2xl text-black/80 leading-relaxed border-l-4 border-black pl-6 bg-white p-4 brutal-shadow-sm text-left">
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
