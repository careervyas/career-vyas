import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const plans = [
    {
        name: "COMMUNITY PASS",
        title: "Basic Mentoring",
        price: "FREE",
        priceBg: "bg-[#ffde59]", // yellow
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
        priceBg: "bg-[#3b82f6]", // blue
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
        priceBg: "bg-[#a855f7]", // purple
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
        <main className="min-h-screen bg-[var(--color-bg)] text-black">
            <Navbar />

            <section className="pt-32 pb-24 border-b-4 border-black border-dashed">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h1 className="text-5xl md:text-7xl font-black uppercase mb-6 tracking-tight drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">
                            MENTORING <span className="bg-[var(--color-primary-orange)] px-4 leading-[1.2] inline-block border-[3px] border-black brutal-shadow-sm -rotate-2 mt-2">PLANS</span>
                        </h1>
                        <p className="text-xl md:text-2xl font-bold bg-white border-4 border-black p-4 brutal-shadow-sm italic">
                            Choose the level of guidance that fits your needs. Our mentors from IITs, NITs, and Medical Colleges are ready to help.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {plans.map((plan, idx) => (
                            <div
                                key={idx}
                                className="bg-[#fffbf0] border-[3px] border-black p-6 flex flex-col brutal-shadow hover:translate-x-[2px] hover:-translate-y-[2px] transition-transform"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-xs font-black uppercase tracking-wider text-black/60">{plan.name}</span>
                                    <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </div>

                                <h3 className="text-3xl font-black leading-tight mb-4">{plan.title}</h3>

                                <div className={`mt-2 mb-6 border-[3px] border-black py-4 px-4 text-center font-black text-2xl uppercase ${plan.priceBg} ${plan.textClass || 'text-black'}`}>
                                    {plan.price}
                                </div>

                                <p className="text-black/80 font-bold mb-6">
                                    {plan.desc}
                                </p>

                                <ul className="space-y-3 mb-8 flex-grow">
                                    {plan.features.map((feat, i) => (
                                        <li key={i} className="flex items-start gap-2 font-medium">
                                            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                            {feat}
                                        </li>
                                    ))}
                                </ul>

                                <div className="mb-6">
                                    <span className="brutal-badge">
                                        {plan.badge}
                                    </span>
                                </div>

                                <Link
                                    href="/webinar"
                                    className="border-[3px] border-black bg-[var(--color-primary-yellow)] text-black font-black uppercase text-lg text-center py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all w-full flex items-center justify-center gap-2"
                                >
                                    APPLY NOW
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
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
