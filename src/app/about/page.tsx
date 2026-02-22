import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#0f0a1e] text-white">
            <Navbar />
            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
                {/* Subtle backgrounds matching Figma */}
                <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-[#8C4AF2]/10 rounded-full blur-[120px]" />

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-16 text-center tracking-tight">
                    <span className="text-white">About</span> <span className="gradient-text">Career Vyas</span>
                </h1>

                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    {/* Left text content */}
                    <div className="flex-1 w-full order-2 lg:order-1 z-10">
                        <p className="text-[17px] md:text-lg text-white/70 mb-8 leading-relaxed font-light">
                            Career Vyas is a free, student‑focused platform that connects Class 8‑12 learners with mentors from India’s top engineering and medical colleges. Our mission is to demystify career choices and give every student a clear, actionable roadmap.
                        </p>
                        <p className="text-[17px] md:text-lg text-white/70 mb-6 leading-relaxed font-light">
                            We provide:
                        </p>

                        <ul className="space-y-4 mb-10 w-full">
                            {[
                                "One‑on‑one mentorship sessions",
                                "Career roadmaps for engineering, medicine, design and more",
                                "Free webinars and community support"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-[#8C4AF2]/20 flex items-center justify-center shrink-0">
                                        <div className="w-2 h-2 rounded-full bg-[#8C4AF2]" />
                                    </div>
                                    <span className="text-white/80 text-[17px] lg:text-lg">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <Link
                            href="/community"
                            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#A36CF4] hover:bg-[#8C4AF2] text-white text-[16px] font-bold transition-all duration-300 shadow-[0_4px_20px_rgba(163,108,244,0.3)] hover:shadow-[0_4px_30px_rgba(163,108,244,0.5)] hover:-translate-y-0.5"
                        >
                            Join Our Community
                        </Link>
                    </div>

                    {/* Right Image */}
                    <div className="flex-1 w-full order-1 lg:order-2">
                        <div className="relative w-full aspect-video md:aspect-[4/3] rounded-3xl overflow-hidden glass-card shadow-2xl">
                            {/* Displaying extracted figma image cleanly */}
                            <Image
                                src="/images/about us.png"
                                alt="Students discussing career"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}
