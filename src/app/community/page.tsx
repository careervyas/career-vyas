import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CommunityPage() {
    return (
        <main className="min-h-screen bg-[var(--color-bg)] text-black">
            <Navbar />

            <section className="pt-32 pb-24 border-b-4 border-black border-dashed min-h-[85vh] flex flex-col items-center justify-center relative overflow-hidden">

                {/* Decorative background shapes */}
                <div className="absolute top-20 left-10 lg:left-32 w-24 h-24 bg-[var(--color-primary-yellow)] border-4 border-black brutal-shadow -rotate-6 hidden md:block" />
                <div className="absolute bottom-20 right-10 lg:right-32 w-32 h-32 bg-[var(--color-primary-orange)] border-4 border-black brutal-shadow rounded-full hidden md:block" />
                <div className="absolute top-1/2 right-20 w-16 h-16 bg-[#4ade80] border-4 border-black brutal-shadow rotate-12 hidden md:block" />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 w-full">

                    <div className="mb-8 brutal-badge bg-[var(--color-primary-blue)] text-white border-black border-2 -rotate-2 px-6 py-2 text-sm md:text-base font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block">
                        500+ STUDENTS ALREADY JOINED
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase mb-8 tracking-tight drop-shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
                        JOIN THE <br />
                        <span className="bg-[var(--color-primary-purple)] text-white px-4 leading-[1.1] inline-block border-[5px] border-black brutal-shadow-sm rotate-1 mt-2 mb-4">
                            COMMUNITY
                        </span>
                    </h1>

                    <div className="bg-white border-4 border-black p-6 md:p-10 brutal-shadow max-w-2xl mx-auto mb-10 text-left">
                        <h2 className="text-3xl font-black uppercase mb-4 border-b-4 border-black pb-4">Why Join Us?</h2>
                        <ul className="space-y-4 text-lg md:text-xl font-bold text-black/80">
                            <li className="flex items-start gap-3">
                                <span className="bg-[var(--color-primary-yellow)] text-black border-2 border-black w-8 h-8 flex items-center justify-center shrink-0 mt-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">1</span>
                                Ask direct questions to mentors from IITs, NITs, and top medical colleges.
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="bg-[#4ade80] text-black border-2 border-black w-8 h-8 flex items-center justify-center shrink-0 mt-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">2</span>
                                Get exclusive invites to our free weekly career guidance webinars.
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="bg-[var(--color-primary-orange)] text-black border-2 border-black w-8 h-8 flex items-center justify-center shrink-0 mt-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">3</span>
                                Connect with hundreds of other students figuring out their career paths.
                            </li>
                        </ul>
                    </div>

                    <a
                        href="https://t.me/career_vyas"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-10 py-6 border-4 border-black bg-[#229ED9] text-white font-black uppercase text-2xl md:text-3xl text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all w-full md:w-auto mx-auto group"
                    >
                        <svg className="w-8 h-8 md:w-10 md:h-10 mr-4 group-hover:-rotate-12 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                        </svg>
                        JOIN TELEGRAM NOW
                    </a>

                </div>
            </section>

            <Footer />
        </main>
    );
}
