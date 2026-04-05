import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const plans = [
    {
        name: "COMMUNITY PASS",
        title: "Basic Mentoring",
        price: "FREE",
        priceBg: "bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border-amber-200", 
        desc: "Perfect for students starting their career exploration journey. Access to basic resources and group guidance.",
        badge: "OPEN TO ALL",
        features: [
            "Access to WhatsApp Community",
            "Weekly General Webinars",
            "Basic Career Roadmaps PDF",
            "Monthly Q&A Sessions"
        ]
    },
    {
        name: "1-ON-1 GUIDANCE",
        title: "Pro Mentoring",
        price: "EARLY ACCESS",
        priceBg: "bg-gradient-to-r from-[var(--color-primary-indigo)] to-indigo-600 text-white border-indigo-400",
        desc: "For students who need dedicated, personalized advice from someone who has successfully navigated the path.",
        badge: "MOST POPULAR",
        features: [
            "Everything in Basic",
            "One 45-min 1-on-1 Session",
            "Personalized Career Blueprint",
            "Direct Mentor Chat Access"
        ],
        textClass: "text-white"
    },
    {
        name: "FULL SUPPORT",
        title: "Premium Mentoring",
        price: "INQUIRE",
        priceBg: "bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-400",
        desc: "Comprehensive hand-holding through the entire college selection, exam preparation, and career decision process.",
        badge: "VIP ACCESS",
        features: [
            "Everything in Pro",
            "Monthly 1-on-1 Sessions",
            "College Application Support",
            "Parent Counseling Session"
        ],
        textClass: "text-white"
    }
];

export default function MentoringPage() {
    return (
        <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans">
            <Navbar />

            <section className="pt-32 pb-24 border-b border-[var(--color-border)] min-h-[85vh] relative overflow-hidden">
                <div className="absolute top-20 right-10 w-64 h-64 bg-indigo-200 rounded-full blur-[100px] opacity-40 hidden md:block" />
                <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-200 rounded-full blur-[100px] opacity-40 hidden md:block" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

                    <div className="text-center mb-16 flex flex-col items-center">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-[1.1] text-[var(--color-text)]">
                            Mentoring <span className="text-[var(--color-primary-indigo)] block mt-2 text-4xl md:text-6xl">Plans</span>
                        </h1>
                        <p className="text-lg md:text-xl font-medium max-w-2xl text-[var(--color-text-muted)] leading-relaxed text-center">
                            Choose the level of guidance that fits your needs. Our mentors from IITs, NITs, and Medical Colleges are ready to help.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {plans.map((plan, idx) => (
                            <div
                                key={idx}
                                className="modern-card p-8 flex flex-col group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-bg-soft)] rounded-full blur-2xl -mr-10 -mt-10 opacity-60"></div>
                                <div className="flex justify-between items-center mb-6 relative z-10">
                                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary-indigo)]">{plan.name}</span>
                                    <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </div>

                                <h3 className="text-3xl font-bold leading-tight mb-4 text-[var(--color-text)] relative z-10">{plan.title}</h3>

                                <div className={`mt-2 mb-6 py-4 px-4 text-center font-bold text-2xl uppercase rounded-xl border relative z-10 shadow-sm ${plan.priceBg}`}>
                                    {plan.price}
                                </div>

                                <p className="text-[var(--color-text-muted)] font-medium leading-relaxed mb-8 relative z-10">
                                    {plan.desc}
                                </p>

                                <ul className="space-y-4 mb-10 flex-grow relative z-10">
                                    {plan.features.map((feat, i) => (
                                        <li key={i} className="flex items-start gap-3 font-medium text-[var(--color-text-muted)]">
                                            <svg className="w-5 h-5 shrink-0 mt-0.5 text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                            {feat}
                                        </li>
                                    ))}
                                </ul>

                                <div className="mb-8 relative z-10">
                                    <span className={`modern-badge ${plan.name === '1-ON-1 GUIDANCE' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-slate-100 text-slate-700 border-[var(--color-border)]'}`}>
                                        {plan.badge}
                                    </span>
                                </div>

                                <Link
                                    href="/webinar"
                                    className={`modern-btn w-full justify-center gap-2 py-3.5 text-base relative z-10 ${plan.name === '1-ON-1 GUIDANCE' ? 'shadow-md shadow-indigo-200 hover:shadow-lg hover:-translate-y-0.5' : ''}`}
                                >
                                    APPLY NOW
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
