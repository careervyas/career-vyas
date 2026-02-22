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
        { href: "/mentors", label: "Mentors" },
        { href: "/community", label: "Community" },
        { href: "/blog", label: "Blog" },
    ];

    const isExploreActive = pathname.startsWith("/explore");

    return (
        <nav className="fixed top-0 w-full z-50 bg-[var(--color-bg)] border-b-[3px] border-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
                        <div className="w-10 h-10 bg-[var(--color-primary-yellow)] border-[3px] border-black flex items-center justify-center font-black text-black text-lg brutal-shadow-sm group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none transition-all">
                            CV
                        </div>
                        <span className="text-2xl font-black text-black tracking-tight uppercase">
                            Career Vyas
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-6">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-[15px] font-black uppercase tracking-wide transition-all duration-200 border-b-2 ${isActive ? "border-black text-black" : "border-transparent text-black/70 hover:text-black hover:border-black"
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
                                className={`flex items-center gap-1 text-[15px] font-black uppercase tracking-wide transition-all duration-200 border-b-2 ${isExploreActive ? "border-black text-black" : "border-transparent text-black/70 hover:text-black hover:border-black"
                                    }`}
                            >
                                Explore
                                <svg
                                    className={`w-4 h-4 transition-transform ${exploreOpen ? "rotate-180" : ""}`}
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
                                >
                                    <path strokeLinecap="square" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {exploreOpen && (
                                <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-60 bg-white border-4 border-black brutal-shadow z-50">
                                    {/* Yellow header */}
                                    <div className="bg-[var(--color-primary-yellow)] border-b-4 border-black px-4 py-2">
                                        <p className="font-black uppercase text-xs">Explore All Paths</p>
                                    </div>
                                    {exploreLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setExploreOpen(false)}
                                            className="flex flex-col px-4 py-3 border-b-2 border-black last:border-0 hover:bg-[var(--color-bg)] transition-colors group"
                                        >
                                            <span className="font-black uppercase text-sm group-hover:underline">{link.label}</span>
                                            <span className="text-xs font-bold text-black/50">{link.desc}</span>
                                        </Link>
                                    ))}
                                    <Link
                                        href="/explore"
                                        onClick={() => setExploreOpen(false)}
                                        className="block text-center px-4 py-3 bg-black text-white font-black uppercase text-xs hover:bg-[var(--color-primary-blue)] transition-colors"
                                    >
                                        View All →
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Free Webinar CTA - Desktop */}
                    <div className="hidden lg:block flex-shrink-0">
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
                                    className={`block px-4 py-3 font-black uppercase text-center border-[3px] mb-2 ${isActive ? "border-black bg-[var(--color-primary-yellow)] text-black" : "border-transparent text-black hover:border-black"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}

                        {/* Explore section on mobile */}
                        <div className="border-[3px] border-black mb-2 overflow-hidden">
                            <div className="bg-[var(--color-primary-yellow)] px-4 py-2 border-b-[3px] border-black">
                                <p className="font-black uppercase text-center text-sm">🔍 Explore</p>
                            </div>
                            <div className="grid grid-cols-2 gap-0">
                                {exploreLinks.map((link, idx) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`block px-3 py-3 font-black uppercase text-xs text-center hover:bg-[var(--color-primary-yellow)] transition-colors border-black ${idx % 2 === 0 ? "border-r-[3px]" : ""
                                            } ${idx < 2 ? "border-b-[3px]" : ""}`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

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
