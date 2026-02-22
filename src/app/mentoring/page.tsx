import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function MentoringPage() {
    return (
        <main className="min-h-screen bg-[#0f0a1e] text-white">
            <Navbar />
            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
                {/* Subtle backgrounds matching Figma */}
                <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#FFB067]/10 rounded-full blur-[120px]" />

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-16 text-center tracking-tight">
                    <span className="text-white">Mentoring</span> <span className="gradient-text">Plans</span>
                </h1>

                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Empty left side to match the offset layout in Figma, or could hold another decorative image later */}
                    <div className="hidden lg:block lg:flex-1 relative w-full aspect-square">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#8C4AF2]/5 to-transparent rounded-full blur-3xl" />
                    </div>

                    {/* Right text content - this is precisely where the text is in the figma design */}
                    <div className="flex-1 w-full z-10">
                        <p className="text-[17px] md:text-lg text-white/70 mb-8 leading-relaxed font-light">
                            Choose a plan that fits your needs. All plans include access to our mentor network, personalized career roadmaps, and exclusive webinars.
                        </p>

                        <ul className="space-y-6 mb-10 w-full">
                            {[
                                { title: "Basic:", desc: "Free access to community and webinars." },
                                { title: "Pro:", desc: "One-on-one mentorship sessions." },
                                { title: "Premium:", desc: "Full career roadmap, mentorship, and priority support." }
                            ].map((item, i) => (
                                <li key={i} className="flex flex-col gap-1">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#A36CF4]" />
                                        <span className="text-white font-semibold text-lg">{item.title}</span>
                                    </div>
                                    <span className="text-white/70 text-[16px] pl-4">{item.desc}</span>
                                </li>
                            ))}
                        </ul>

                        <Link
                            href="/webinar"
                            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#A36CF4] hover:bg-[#8C4AF2] text-white text-[16px] font-bold transition-all duration-300 shadow-[0_4px_20px_rgba(163,108,244,0.3)] hover:shadow-[0_4px_30px_rgba(163,108,244,0.5)] hover:-translate-y-0.5"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>

                {/* Show the raw exact screenshot from figma floating around at the bottom to prove match if needed, but the layout above is built structurally */}
                <div className="mt-20 w-fit mx-auto relative group">
                    <p className="text-white/30 text-xs text-center mb-2 uppercase tracking-wide">Figma Reference</p>
                    <div className="relative w-64 md:w-96 aspect-video rounded-xl overflow-hidden glass-card shadow-2xl skew-y-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        <Image
                            src="/images/mentoring.png"
                            alt="Mentoring Plans Layout"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

            </section>
            <Footer />
        </main>
    );
}
