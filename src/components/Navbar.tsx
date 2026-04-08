"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const exploreLinks = [
    { href: "/explore/careers", label: "💼 Careers", desc: "100+ career paths" },
    { href: "/explore/courses", label: "📚 Courses", desc: "Degrees & certifications" },
    { href: "/explore/exams", label: "📝 Exams", desc: "JEE, NEET, CAT & more" },
    { href: "/explore/colleges", label: "🏢 Colleges", desc: "Top universities in India" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [exploreOpen, setExploreOpen] = useState(false);
    const pathname = usePathname();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setExploreOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/mentoring", label: "Mentoring" },
        { href: "/community", label: "Community & Blogs" },
    ];

    const isExploreActive = pathname.startsWith("/explore");

    return (
        <nav className="fixed top-0 w-full z-50 glass-effect">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary-indigo-light)] to-[var(--color-primary-indigo-dark)] rounded-xl flex items-center justify-center font-black text-white text-lg shadow-sm group-hover:scale-105 transition-all">
                            CV
                        </div>
                        <span className="text-2xl font-black text-[var(--color-text)] tracking-tight">
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
                                    className={`text-[15px] font-semibold tracking-wide transition-all duration-200 border-b-2 py-1 ${isActive ? "border-[var(--color-primary-indigo)] text-[var(--color-primary-indigo)]" : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-border)]"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}

                        {/* Explore Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setExploreOpen(!exploreOpen)}
                                className={`flex items-center gap-1 text-[15px] font-semibold tracking-wide transition-all duration-200 border-b-2 py-1 ${isExploreActive ? "border-[var(--color-primary-indigo)] text-[var(--color-primary-indigo)]" : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-border)]"
                                    }`}
                            >
                                Explore
                                <svg
                                    className={`w-4 h-4 transition-transform ${exploreOpen ? "rotate-180" : ""}`}
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {exploreOpen && (
                                <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-64 bg-white rounded-2xl shadow-xl border border-[var(--color-border)] overflow-hidden z-50 transform origin-top transition-all">
                                    {/* Header */}
                                    <div className="bg-[var(--color-bg-soft)] px-5 py-3 border-b border-[var(--color-border)]">
                                        <p className="font-bold text-[var(--color-primary-indigo)] text-sm">Explore All Paths</p>
                                    </div>
                                    <div className="py-2">
                                        {exploreLinks.map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={() => setExploreOpen(false)}
                                                className="flex flex-col px-5 py-2 hover:bg-[var(--color-bg-soft)] transition-colors group"
                                            >
                                                <span className="font-semibold text-sm text-[var(--color-text)] group-hover:text-[var(--color-primary-indigo)] transition-colors">{link.label}</span>
                                                <span className="text-xs text-[var(--color-text-muted)]">{link.desc}</span>
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="p-3 border-t border-[var(--color-border)] bg-[var(--color-bg-soft)]">
                                        <Link
                                            href="/explore"
                                            onClick={() => setExploreOpen(false)}
                                            className="block text-center w-full py-2 bg-[var(--color-text)] text-white rounded-xl font-semibold text-sm hover:bg-[var(--color-primary-indigo)] transition-colors"
                                        >
                                            View All Explorer →
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Free Webinar CTA - Desktop */}
                    <div className="hidden lg:block flex-shrink-0">
                        <Link
                            href="/webinar"
                            className="inline-flex items-center justify-center px-6 py-2.5 modern-btn text-sm"
                        >
                            Free Webinar
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden p-2 rounded-lg text-[var(--color-text)] hover:bg-[var(--color-bg-soft)] transition-colors focus:outline-none"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Nav */}
                {isOpen && (
                    <div className="lg:hidden pb-6 pt-4 px-4 bg-white/95 backdrop-blur-xl border-t border-[var(--color-border)] absolute left-0 w-full shadow-lg rounded-b-3xl">
                        <div className="space-y-1 mb-6">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`block px-4 py-3 rounded-xl font-semibold text-base transition-colors ${isActive ? "bg-[var(--color-primary-indigo-soft)] text-[var(--color-primary-indigo-dark)]" : "text-[var(--color-text)] hover:bg-[var(--color-bg-soft)]"
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Explore section on mobile */}
                        <div className="mb-6 bg-[var(--color-bg-soft)] rounded-2xl overflow-hidden border border-[var(--color-border)]">
                            <div className="px-4 py-3 border-b border-[var(--color-border)] bg-white">
                                <p className="font-bold text-[var(--color-primary-indigo)] text-sm">🔍 Explore Paths</p>
                            </div>
                            <div className="grid grid-cols-2 divide-x divide-y divide-[var(--color-border)]">
                                {exploreLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="block px-3 py-4 font-semibold text-sm text-center text-[var(--color-text)] hover:bg-white hover:text-[var(--color-primary-indigo)] transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <Link
                            href="/webinar"
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-3.5 text-center modern-btn w-full"
                        >
                            Free Webinar
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
