"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About Us" },
        { href: "/mentoring", label: "Mentoring" },
        { href: "/mentors", label: "Mentors" },
        { href: "/community", label: "Community" },
        { href: "/blog", label: "Blog" },
        { href: "/webinar", label: "Free Webinar", highlight: true },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 glass-card">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-white text-sm">
                            CV
                        </div>
                        <span className="text-xl font-bold gradient-text">
                            Career Vyas
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={
                                    link.highlight
                                        ? "ml-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary to-primary-light text-white text-sm font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
                                        : "px-3 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
                                }
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors"
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
                    <div className="md:hidden pb-4 border-t border-border mt-2 pt-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={
                                    link.highlight
                                        ? "block mt-2 px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-center font-medium"
                                        : "block px-4 py-3 text-text-secondary hover:text-text-primary hover:bg-bg-card rounded-lg transition-colors"
                                }
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
}
