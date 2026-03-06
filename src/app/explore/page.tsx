import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ExploreLandingPage() {
    const categories = [
        { title: "CAREERS", desc: "100+ Professional Paths", href: "/explore/careers", icon: "💼", color: "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-100" },
        { title: "COURSES", desc: "Degrees & Certifications", href: "/explore/courses", icon: "📚", color: "bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-100" },
        { title: "EXAMS", desc: "Entrance & Scholarships", href: "/explore/exams", icon: "📝", color: "bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-100" },
        { title: "COLLEGES", desc: "Top Universities in India", href: "/explore/colleges", icon: "🏢", color: "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-100" },
    ];

    return (
        <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans">
            <Navbar />

            <section className="pt-32 pb-24 border-b border-[var(--color-border)] min-h-[85vh] relative overflow-hidden flex items-center justify-center">

                {/* Background Decorative Gradient Orbs */}
                <div className="absolute top-20 right-10 w-64 h-64 bg-indigo-200 rounded-full blur-[100px] opacity-40 hidden md:block" />
                <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-200 rounded-full blur-[100px] opacity-40 hidden md:block" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-[1.1] text-[var(--color-text)]">
                        <span className="text-[var(--color-primary-indigo)] mb-2 block">Find Your</span>
                        Ultimate Path
                    </h1>

                    <p className="text-lg md:text-xl font-medium max-w-2xl mx-auto text-[var(--color-text-muted)] leading-relaxed mb-12">
                        The most comprehensive ecosystem of careers, courses, exams, and colleges to help you decode your future with confidence.
                    </p>

                    <div className="max-w-2xl mx-auto mb-16 relative">
                        <form className="flex w-full relative z-10 shadow-lg rounded-full overflow-hidden border border-[var(--color-border)] bg-white p-1" action="/api/search">
                            <div className="pl-6 flex items-center justify-center text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                name="q"
                                className="flex-grow bg-transparent p-4 md:p-5 font-semibold text-lg focus:outline-none transition-colors placeholder:text-gray-400 text-[var(--color-text)]"
                                placeholder="Search for careers, courses, or colleges..."
                            />
                            <button type="submit" className="modern-btn m-1 hidden sm:block">
                                Explore
                            </button>
                        </form>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                        {categories.map((cat, idx) => (
                            <Link
                                key={idx}
                                href={cat.href}
                                className={`modern-card p-8 group relative overflow-hidden flex flex-col items-center text-center transition-all ${cat.color} border`}
                            >
                                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                                    {cat.icon}
                                </div>
                                <h2 className="text-xl font-bold mb-2 relative z-10">{cat.title}</h2>
                                <p className="font-medium text-sm relative z-10 opacity-80">{cat.desc}</p>
                            </Link>
                        ))}
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    );
}
