"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About Us" },
        { href: "/mentoring", label: "Mentoring" },
        { href: "/mentors", label: "Mentors" },
        { href: "/community", label: "Community" },
        { href: "/blog", label: "Blog" },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 bg-[#0f0a1e]/80 backdrop-blur-md border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8C4AF2] to-[#FFB067] flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-[#8C4AF2]/20">
                            CV
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight">
                            Career Vyas
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-[15px] font-medium transition-colors duration-200 ${isActive ? "text-white" : "text-white/60 hover:text-white"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            )
                        })}
                    </div>

                    {/* Free Webinar CTA - Desktop */}
                    <div className="hidden lg:block">
                        <Link
                            href="/webinar"
                            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#8C4AF2] hover:bg-[#A36CF4] text-white text-[15px] font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(140,74,242,0.4)]"
                        >
                            Free Webinar
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden p-2 rounded-lg text-white/60 hover:text-white transition-colors"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Nav */}
                {isOpen && (
                    <div className="lg:hidden pb-6 pt-2 bg-[#0f0a1e] border-t border-white/5 absolute left-0 w-full px-4 shadow-2xl">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`block px-4 py-3 rounded-xl transition-colors ${isActive ? "bg-white/5 text-white" : "text-white/60 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            )
                        })}
                        <Link
                            href="/webinar"
                            onClick={() => setIsOpen(false)}
                            className="block mt-4 px-4 py-3 rounded-xl bg-[#8C4AF2] text-white text-center font-medium shadow-lg shadow-[#8C4AF2]/20"
                        >
                            Free Webinar
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
