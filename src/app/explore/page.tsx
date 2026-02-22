import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ExploreLandingPage() {
    const categories = [
        { title: "CAREERS", desc: "100+ Professional Paths", href: "/explore/careers", icon: "💼", color: "bg-[var(--color-primary-yellow)]" },
        { title: "COURSES", desc: "Degrees & Certifications", href: "/explore/courses", icon: "📚", color: "bg-[var(--color-primary-blue)]" },
        { title: "EXAMS", desc: "Entrance & Scholarships", href: "/explore/exams", icon: "📝", color: "bg-[#f43f5e]" },
        { title: "COLLEGES", desc: "Top Universities in India", href: "/explore/colleges", icon: "🏢", color: "bg-[#4ade80]" },
    ];

    return (
        <main className="min-h-screen bg-[var(--color-bg)] text-black font-sans">
            <Navbar />

            <section className="pt-32 pb-24 border-b-4 border-black border-dashed min-h-[85vh] relative overflow-hidden flex items-center justify-center">

                {/* Background Decorative Blocks */}
                <div className="absolute top-20 right-10 w-24 h-24 bg-[var(--color-primary-orange)] border-4 border-black brutal-shadow rotate-12 hidden md:block" />
                <div className="absolute bottom-20 left-10 w-32 h-32 bg-[var(--color-primary-purple)] border-4 border-black brutal-shadow rounded-full hidden md:block" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">

                    <h1 className="text-6xl md:text-8xl font-black uppercase mb-6 tracking-tight drop-shadow-[4px_4px_0px_rgba(0,0,0,0.1)] leading-[1.1]">
                        <span className="bg-white border-4 border-black px-4 leading-[1.2] inline-block brutal-shadow-sm -rotate-2 mb-4">
                            FIND YOUR
                        </span><br />
                        ULTIMATE PATH
                    </h1>

                    <p className="text-2xl md:text-3xl font-bold max-w-3xl mx-auto text-black/80 leading-relaxed mb-12">
                        The largest brutalist ecosystem of Careers, Courses, Exams, and Colleges to help you decode your future.
                    </p>

                    <div className="max-w-xl mx-auto mb-16 relative">
                        <div className="absolute -top-4 -right-4 bg-[var(--color-primary-yellow)] border-2 border-black font-black uppercase text-xs px-2 py-1 rotate-12 brutal-shadow-sm z-20">
                            SEARCH ANYTHING
                        </div>
                        <form className="flex w-full relative z-10" action="/api/search">
                            <input
                                type="text"
                                name="q"
                                className="flex-grow bg-white border-[4px] border-black border-r-0 p-5 md:p-6 font-bold text-xl md:text-2xl focus:outline-none focus:bg-[var(--color-primary-yellow)] transition-colors placeholder:text-black/30"
                                placeholder="e.g. Software Engineer..."
                            />
                            <button type="submit" className="bg-black text-white px-8 font-black uppercase text-xl border-[4px] border-black hover:bg-[var(--color-primary-blue)] transition-colors">
                                GO
                            </button>
                        </form>
                        {/* Offset shadow for search bar */}
                        <div className="absolute inset-0 bg-black translate-x-3 translate-y-3 z-0" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                        {categories.map((cat, idx) => (
                            <Link
                                key={idx}
                                href={cat.href}
                                className={`border-[4px] border-black p-8 brutal-shadow hover:translate-x-[4px] hover:-translate-y-[4px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all ${cat.color} group relative overflow-hidden`}
                            >
                                <div className="absolute -right-6 -bottom-6 text-8xl opacity-20 group-hover:scale-125 transition-transform rotate-12">
                                    {cat.icon}
                                </div>
                                <h2 className="text-3xl font-black uppercase mb-2 relative z-10 group-hover:underline decoration-4 underline-offset-4 ${cat.color === 'bg-[#f43f5e]' || cat.color === 'bg-[var(--color-primary-blue)]' ? 'text-white' : 'text-black'}">{cat.title}</h2>
                                <p className={`font-bold text-lg relative z-10 ${cat.color === 'bg-[#f43f5e]' || cat.color === 'bg-[var(--color-primary-blue)]' ? 'text-white/90' : 'text-black/80'}`}>{cat.desc}</p>
                            </Link>
                        ))}
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    );
}
