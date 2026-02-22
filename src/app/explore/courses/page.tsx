import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseGrid from "@/components/explore/CourseGrid";

async function getCourses() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/content/courses`, {
        cache: 'no-store'
    });
    if (!res.ok) return [];
    return res.json();
}

export default async function ExploreCoursesPage() {
    const courses = await getCourses();

    return (
        <main className="min-h-screen bg-[var(--color-bg)] text-black font-sans">
            <Navbar />

            <section className="pt-32 pb-24 border-b-4 border-black border-dashed min-h-[85vh]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="mb-16">
                        <h1 className="text-5xl md:text-7xl font-black uppercase mb-6 tracking-tight drop-shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
                            EDUCATION <br />
                            <span className="bg-[var(--color-primary-blue)] text-white px-4 leading-[1.1] inline-block border-[5px] border-black brutal-shadow-sm -rotate-2 mt-2 mb-4">
                                COURSES
                            </span>
                        </h1>
                        <p className="text-xl font-bold max-w-2xl text-black/80 leading-relaxed border-l-4 border-black pl-6 bg-white p-4 brutal-shadow-sm text-left">
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
