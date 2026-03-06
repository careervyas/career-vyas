import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center pt-20 bg-[var(--color-bg)] overflow-hidden">

            {/* Modern decorative background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-primary-indigo-soft)] blur-3xl opacity-70 animate-pulse hidden lg:block" style={{ mixBlendMode: 'multiply' }} />
            <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-purple-100 blur-3xl opacity-60 hidden lg:block" style={{ mixBlendMode: 'multiply' }} />
            <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] rounded-full bg-blue-50 blur-3xl opacity-50 hidden lg:block" />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">

                {/* Badge */}
                <div className="mb-8 modern-badge inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm border border-indigo-100 shadow-sm rounded-full text-sm font-semibold text-indigo-700">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    Free Career Guidance for Class 8-12
                </div>

                {/* Huge Headline */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-extrabold leading-[1.1] tracking-tight text-[var(--color-text)] mb-8">
                    Stop guessing. <br />
                    Choose your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Career Path</span>
                </h1>

                <p className="text-lg md:text-xl max-w-2xl mb-12 text-[var(--color-text-muted)] leading-relaxed">
                    Take the first step towards your dreams with Career Vyas. Join our free webinars, get personalized guides, and connect with mentors from India's top colleges.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
                    <Link
                        href="/webinar"
                        className="inline-flex items-center justify-center modern-btn text-lg w-full sm:w-auto"
                    >
                        Book Free Webinar
                        <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </Link>
                    <Link
                        href="/mentors"
                        className="inline-flex items-center justify-center modern-btn-secondary px-8 py-3 text-lg w-full sm:w-auto"
                    >
                        Meet Mentors
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-24 w-full max-w-5xl">
                    {[
                        { num: "20+", label: "Top Mentors", icon: "👨‍🏫" },
                        { num: "500+", label: "Students", icon: "🎓" },
                        { num: "Free", label: "Webinars", icon: "🗓️" },
                        { num: "10+", label: "Career Paths", icon: "🚀" }
                    ].map((stat, i) => (
                        <div key={i} className="modern-card p-6 text-center flex flex-col items-center justify-center group">
                            <div className="text-2xl mb-3 bg-[var(--color-bg-soft)] w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                {stat.icon}
                            </div>
                            <div className="text-3xl font-extrabold text-[var(--color-text)] mb-1">{stat.num}</div>
                            <div className="text-sm font-semibold text-[var(--color-text-muted)]">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
