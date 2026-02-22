"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/mentoring", label: "Mentoring" },
        { href: "/mentors", label: "Mentors" },
        { href: "/community", label: "Community" },
        { href: "/blog", label: "Blog" },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 bg-[var(--color-bg)] border-b-[3px] border-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-[var(--color-primary-yellow)] border-[3px] border-black flex items-center justify-center font-black text-black text-lg brutal-shadow-sm group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none transition-all">
                            CV
                        </div>
                        <span className="text-2xl font-black text-black tracking-tight uppercase">
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
                                    className={`text-[15px] font-black uppercase tracking-wide transition-all duration-200 border-b-2 ${
                                        isActive ? "border-black text-black" : "border-transparent text-black/70 hover:text-black hover:border-black"
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
                            className="inline-flex items-center justify-center px-6 py-2.5 brutal-btn"
                        >
                            Free Webinar
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden p-2 border-[3px] border-black bg-white focus:outline-none"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            {isOpen ? (
                                <path strokeLinecap="square" strokeLinejoin="miter" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="square" strokeLinejoin="miter" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Nav */}
                {isOpen && (
                    <div className="lg:hidden pb-6 pt-2 bg-[var(--color-bg)] border-t-[3px] border-black absolute left-0 w-full px-4 brutal-shadow">
                        {navLinks.map((link) => {
                             const isActive = pathname === link.href;
                             return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`block px-4 py-3 font-black uppercase text-center border-[3px] mb-2 ${
                                        isActive ? "border-black bg-[var(--color-primary-yellow)] text-black" : "border-transparent text-black hover:border-black"
                                    }`}
                                >
                                    {link.label}
                                </Link>
                             )
                        })}
                        <Link
                            href="/webinar"
                            onClick={() => setIsOpen(false)}
                            className="block mt-4 px-4 py-3 text-center brutal-btn w-full"
                        >
                            Free Webinar
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
