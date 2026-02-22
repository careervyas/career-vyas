import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-white border-t-4 border-black relative overflow-hidden">

            {/* Neo-brutalist decorative background elements */}
            <div className="absolute top-10 right-10 w-20 h-20 bg-[var(--color-primary-yellow)] border-4 border-black brutal-shadow hidden md:block" />
            <div className="absolute bottom-10 left-10 w-16 h-16 bg-[var(--color-primary-purple)] border-4 border-black rounded-full hidden md:block" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                    {/* Brand Info */}
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-6 group inline-flex">
                            <div className="w-12 h-12 bg-[var(--color-primary-yellow)] border-4 border-black flex items-center justify-center font-black text-black text-xl brutal-shadow shadow-sm group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-transform">
                                CV
                            </div>
                            <span className="text-3xl font-black text-black tracking-tight uppercase">
                                Career Vyas
                            </span>
                        </Link>
                        <p className="text-black/80 font-bold max-w-sm mb-6 border-l-4 border-black pl-4 py-2 bg-[var(--color-bg)] text-lg brutal-shadow-sm">
                            Guidance from India's top college students for Class 8-12. No BS, just real talk.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-black text-black uppercase mb-6 tracking-wider text-xl">Quick Links</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/mentoring" className="text-black font-bold uppercase hover:bg-black hover:text-white px-2 py-1 -ml-2 transition-colors">
                                    Mentoring
                                </Link>
                            </li>
                            <li>
                                <Link href="/mentors" className="text-black font-bold uppercase hover:bg-black hover:text-white px-2 py-1 -ml-2 transition-colors">
                                    Mentors
                                </Link>
                            </li>
                            <li>
                                <Link href="/community" className="text-black font-bold uppercase hover:bg-black hover:text-white px-2 py-1 -ml-2 transition-colors">
                                    Community
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-black font-bold uppercase hover:bg-black hover:text-white px-2 py-1 -ml-2 transition-colors">
                                    Blog
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-black text-black uppercase mb-6 tracking-wider text-xl">Contact</h4>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3">
                                <span className="bg-[var(--color-primary-blue)] w-8 h-8 border-[3px] border-black flex items-center justify-center shrink-0">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="square" strokeLinejoin="miter" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </span>
                                <a href="mailto:hello@careervyas.com" className="text-black font-bold uppercase hover:underline decoration-4 underline-offset-4">
                                    hello@careervyas.com
                                </a>
                            </li>
                            <li className="flex items-start gap-3 mt-4">
                                <span className="bg-[var(--color-primary-purple)] w-8 h-8 border-[3px] border-black flex items-center justify-center shrink-0">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="square" strokeLinejoin="miter" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="square" strokeLinejoin="miter" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </span>
                                <span className="text-black font-bold uppercase">
                                    New Delhi, India
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t-4 border-black flex justify-between items-center text-black font-black uppercase text-sm">
                    <p>© {new Date().getFullYear()} Career Vyas.</p>
                    <p>ALL RIGHTS RESERVED.</p>
                </div>
            </div>
        </footer>
    );
}
