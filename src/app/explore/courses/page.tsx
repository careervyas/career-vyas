import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseGrid from "@/components/explore/CourseGrid";
import { createClient } from "@supabase/supabase-js";

async function getCourses() {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { data, error } = await supabase.from("course_profiles").select("*").order("name");
        if (error) console.error(error);
        return data || [];
    } catch {
        return [];
    }
}

export const dynamic = "force-dynamic";

export default async function ExploreCoursesPage() {
    const courses = await getCourses();

    return (
        <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans">
            <Navbar />

            <section className="pt-32 pb-24 border-b border-[var(--color-border)] min-h-[85vh] relative overflow-hidden">
                <div className="absolute top-20 left-10 w-64 h-64 bg-purple-200 rounded-full blur-[100px] opacity-40 hidden md:block" />
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-violet-200 rounded-full blur-[100px] opacity-40 hidden md:block" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

                    <div className="mb-16">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-[1.1] text-[var(--color-text)]">
                            <span className="text-[var(--color-purple)] mb-2 block">Education</span>
                            Courses
                        </h1>
                        <p className="text-lg md:text-xl font-medium max-w-2xl text-[var(--color-text-muted)] leading-relaxed">
                            Find the right degree or certification to launch your career. Filter by type and duration to match your goals.
                        </p>
                    </div>

                    <CourseGrid initialCourses={courses} />

                </div>
            </section>

            <Footer />
        </main>
    );
}
