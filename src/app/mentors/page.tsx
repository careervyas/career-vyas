import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { mentors } from '@/data/mentors';

export default function MentorsPage() {
    return (
        <main className="min-h-screen bg-[var(--color-bg)] text-black">
            <Navbar />

            <section className="pt-32 pb-24 border-b-4 border-black border-dashed">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h1 className="text-5xl md:text-7xl font-black uppercase mb-6 tracking-tight drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">
                            MEET OUR <br />
                            <span className="bg-[var(--color-primary-yellow)] px-4 leading-[1.2] inline-block border-[3px] border-black brutal-shadow-sm -rotate-2 mt-2">MENTORS</span>
                        </h1>
                        <p className="text-xl md:text-2xl font-bold bg-white border-4 border-black p-4 brutal-shadow-sm italic text-left">
                            Real students from top Indian colleges sharing their journey, strategies, and unvarnished truth about cracking exams and picking careers.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mentors.sort((a, b) => a.order - b.order).map((mentor, idx) => {
                            // Assign a rotating brutalist color to the mentor card badges
                            const colors = [
                                'bg-[var(--color-primary-blue)]',
                                'bg-[var(--color-primary-orange)]',
                                'bg-[var(--color-primary-purple)]',
                                'bg-[#4ade80]',
                                'bg-[#f43f5e]'
                            ];
                            const badgeColor = colors[idx % colors.length];

                            return (
                                <div
                                    key={idx}
                                    className="bg-white border-4 border-black flex flex-col brutal-shadow hover:translate-x-[2px] hover:-translate-y-[2px] transition-transform overflow-hidden relative"
                                >
                                    <div className="w-full aspect-square border-b-4 border-black relative bg-[#fffbf0]">
                                        <Image
                                            src={mentor.image}
                                            alt={mentor.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className={`brutal-badge ${badgeColor} text-white`}>
                                                {mentor.expertise}
                                            </span>
                                        </div>

                                        <h3 className="text-2xl font-black leading-tight mb-1 uppercase">{mentor.name}</h3>
                                        <p className="text-black/60 font-black uppercase text-sm mb-4 tracking-wider">{mentor.college}</p>

                                        <p className="text-black/80 font-bold mb-6 flex-grow border-l-4 border-black pl-3 bg-[var(--color-bg)] py-2 pr-2">
                                            {mentor.bio}
                                        </p>

                                        <Link
                                            href="/webinar"
                                            className="border-[3px] border-black bg-[var(--color-primary-yellow)] text-black font-black uppercase text-sm text-center py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all w-full flex items-center justify-center gap-2"
                                        >
                                            BOOK SESSION
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    );
}
