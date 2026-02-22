import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center pt-20 bg-[var(--color-bg)] overflow-hidden border-b-4 border-black border-dashed">

            {/* Decorative neo-brutalist shapes in background */}
            <div className="absolute top-32 left-10 w-24 h-24 bg-[var(--color-primary-yellow)] border-4 border-black brutal-shadow rounded-full animate-[spin_10s_linear_infinite] hidden lg:block" />
            <div className="absolute bottom-20 right-20 w-32 h-32 bg-[var(--color-primary-purple)] border-4 border-black brutal-shadow rotate-12 hidden lg:block" />
            <div className="absolute top-40 right-40 w-16 h-16 bg-[var(--color-primary-blue)] border-4 border-black brutal-shadow -rotate-12 hidden lg:block" />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">

                {/* Badge */}
                <div className="mb-8 brutal-badge bg-[var(--color-primary-orange)] text-black border-black border-2 rotate-[-2deg] px-4 py-2 text-sm font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    Free Career Guidance for Class 8-12
                </div>

                {/* Huge Headline */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-black leading-[1.05] tracking-tight uppercase mb-8 text-black drop-shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
                    CHOOSE YOUR <br />
                    <span className="bg-[var(--color-primary-yellow)] px-4 leading-[1.2] inline-block border-[3px] border-black brutal-shadow-sm rotate-2 mt-2">
                        CAREER PATH
                    </span> <br />
                    NOW!
                </h1>

                <p className="text-xl md:text-2xl font-bold max-w-3xl mb-10 text-black/80 leading-relaxed border-l-4 border-black pl-6 italic bg-white p-4 brutal-shadow-sm text-left">
                    Take the first step towards your dreams with Career Vyas. Join our free webinars, get personalized guides, and connect with mentors from India's top colleges.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 mt-4">
                    <Link
                        href="/webinar"
                        className="inline-flex items-center justify-center px-10 py-5 brutal-btn text-lg bg-[var(--color-primary-blue)] text-white w-full sm:w-auto"
                    >
                        BOOK FREE WEBINAR
                        <svg className="w-6 h-6 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </Link>
                    <Link
                        href="/mentors"
                        className="inline-flex items-center justify-center px-10 py-5 brutal-btn text-lg bg-white w-full sm:w-auto"
                    >
                        MEET MENTORS
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 w-full max-w-4xl">
                    {[
                        { num: "20+", label: "Top Mentors", color: "bg-[var(--color-primary-yellow)]" },
                        { num: "500+", label: "Students", color: "bg-[#4ade80]" },
                        { num: "Free", label: "Webinars", color: "bg-[var(--color-primary-purple)] text-white" },
                        { num: "10+", label: "Career Paths", color: "bg-[var(--color-primary-orange)]" }
                    ].map((stat, i) => (
                        <div key={i} className={`border-4 border-black brutal-card p-4 text-center ${stat.color} hover:-translate-y-2 hover:translate-x-2 transition-transform`}>
                            <div className="text-3xl font-black mb-1">{stat.num}</div>
                            <div className="text-sm font-bold uppercase">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
