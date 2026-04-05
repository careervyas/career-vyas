import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CommunityPage() {
    return (
        <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans">
            <Navbar />

            <section className="pt-32 pb-24 border-b border-[var(--color-border)] min-h-[85vh] flex flex-col items-center justify-center relative overflow-hidden">

                <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-200 rounded-full blur-[100px] opacity-40 hidden md:block" />
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full blur-[100px] opacity-40 hidden md:block" />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 w-full">

                    <div className="mb-8 modern-badge bg-indigo-50/80 text-[var(--color-primary-indigo)] border border-indigo-200 px-6 py-2 text-sm md:text-base font-semibold shadow-sm inline-block tracking-wider">
                        500+ STUDENTS ALREADY JOINED
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight leading-[1.1] text-[var(--color-text)]">
                        JOIN THE <br />
                        <span className="text-[var(--color-primary-indigo)] block mb-4 mt-2">
                            COMMUNITY
                        </span>
                    </h1>

                    <div className="modern-card p-6 md:p-10 max-w-2xl mx-auto mb-12 text-left relative overflow-hidden backdrop-blur-sm z-10 bg-white/80">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-2xl -mr-10 -mt-10 opacity-60"></div>
                        <h2 className="text-3xl font-bold mb-6 border-b border-[var(--color-border)] pb-4 text-[var(--color-text)] relative z-10">Why Join Us?</h2>
                        <ul className="space-y-6 text-lg font-medium text-[var(--color-text-muted)] relative z-10">
                            <li className="flex items-start gap-4">
                                <span className="bg-indigo-50 text-[var(--color-primary-indigo)] border border-indigo-100 rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold shadow-sm mt-0.5">1</span>
                                <span>Ask direct questions to mentors from IITs, NITs, and top medical colleges.</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="bg-indigo-50 text-[var(--color-primary-indigo)] border border-indigo-100 rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold shadow-sm mt-0.5">2</span>
                                <span>Get exclusive invites to our free weekly career guidance webinars.</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="bg-indigo-50 text-[var(--color-primary-indigo)] border border-indigo-100 rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold shadow-sm mt-0.5">3</span>
                                <span>Connect with hundreds of other students figuring out their career paths.</span>
                            </li>
                        </ul>
                    </div>

                    <a
                        href="https://t.me/career_vyas"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="modern-btn text-lg md:text-xl px-10 py-5 w-full md:w-auto mx-auto group gap-3 shadow-md hover:shadow-lg transition-all flex items-center justify-center bg-[#229ED9] hover:bg-[#1E8BBF] text-white"
                    >
                        <svg className="w-8 h-8 mr-2 group-hover:-rotate-12 transition-transform" fill="currentColor" viewBox="0 0 24 24">
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
