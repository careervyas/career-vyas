import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-[var(--color-border)] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                    {/* Brand Info */}
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-6 group inline-flex">
                            <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary-indigo-light)] to-[var(--color-primary-indigo-dark)] rounded-xl flex items-center justify-center font-black text-white text-lg shadow-sm group-hover:scale-105 transition-all">
                                CV
                            </div>
                            <span className="text-2xl font-black text-[var(--color-text)] tracking-tight">
                                Career Vyas
                            </span>
                        </Link>
                        <p className="text-[var(--color-text-muted)] font-medium max-w-sm mb-6 leading-relaxed">
                            Guidance from India's top college students for Class 8-12. No BS, just real talk to help you find your path.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-[var(--color-text)] mb-6 text-sm tracking-widest uppercase text-indigo-500">Quick Links</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/mentoring" className="text-[var(--color-text-muted)] font-medium hover:text-[var(--color-primary-indigo)] transition-colors">
                                    Mentoring
                                </Link>
                            </li>
                            <li>
                                <Link href="/mentors" className="text-[var(--color-text-muted)] font-medium hover:text-[var(--color-primary-indigo)] transition-colors">
                                    Mentors
                                </Link>
                            </li>
                            <li>
                                <Link href="/community" className="text-[var(--color-text-muted)] font-medium hover:text-[var(--color-primary-indigo)] transition-colors">
                                    Community
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-[var(--color-text-muted)] font-medium hover:text-[var(--color-primary-indigo)] transition-colors">
                                    Blog
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-bold text-[var(--color-text)] mb-6 text-sm tracking-widest uppercase text-indigo-500">Contact</h4>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3">
                                <span className="bg-[var(--color-primary-indigo-soft)] w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                                    <svg className="w-4 h-4 text-[var(--color-primary-indigo)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </span>
                                <a href="mailto:hello@careervyas.com" className="text-[var(--color-text-muted)] font-medium hover:text-[var(--color-primary-indigo)] transition-colors">
                                    hello@careervyas.com
                                </a>
                            </li>
                            <li className="flex items-start gap-3 mt-4">
                                <span className="bg-[var(--color-primary-indigo-soft)] w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                                    <svg className="w-4 h-4 text-[var(--color-primary-indigo)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </span>
                                <span className="text-[var(--color-text-muted)] font-medium">
                                    New Delhi, India
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-[var(--color-border)] flex flex-col md:flex-row justify-between items-center text-[var(--color-text-muted)] text-sm">
                    <p>© {new Date().getFullYear()} Career Vyas. All rights reserved.</p>
                    <div className="mt-4 md:mt-0 flex space-x-6">
                        <Link href="/privacy" className="hover:text-[var(--color-primary-indigo)] transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-[var(--color-primary-indigo)] transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
