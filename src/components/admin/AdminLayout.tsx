"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // If on login page, don't show sidebar
    if (pathname === "/admin/login") {
        return <div className="min-h-screen bg-[var(--color-bg)]">{children}</div>;
    }

    const navLinks = [
        { name: "Dashboard", href: "/admin/dashboard", icon: "📊" },
        { name: "Careers", href: "/admin/content/careers", icon: "💼" },
        { name: "Courses", href: "/admin/content/courses", icon: "📚" },
        { name: "Exams", href: "/admin/content/exams", icon: "📝" },
        { name: "Colleges", href: "/admin/content/colleges", icon: "🏢" },
        { name: "Mentors", href: "/admin/mentors", icon: "🎓" },
        { name: "Users", href: "/admin/users", icon: "👥" },
        { name: "Bookings", href: "/admin/bookings", icon: "📅" },
        { name: "Analytics", href: "/admin/analytics", icon: "📈" },
    ];

    return (
        <div className="min-h-screen bg-[var(--color-bg)] text-black flex flex-col md:flex-row font-sans">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-[var(--color-primary-yellow)] border-b-4 md:border-b-0 md:border-r-4 border-black flex-shrink-0 z-20 brutal-shadow-sm sticky top-0 md:h-screen overflow-y-auto">
                <div className="p-6 border-b-4 border-black bg-white">
                    <Link href="/admin/dashboard" className="text-2xl font-black uppercase tracking-tighter">
                        ADMIN <br /> VYAS
                    </Link>
                </div>

                <nav className="p-4 space-y-2">
                    {navLinks.map((link) => {
                        const isActive = pathname.startsWith(link.href);
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3 font-bold uppercase transition-all border-2 border-transparent ${isActive
                                    ? "bg-black text-white brutal-shadow-sm border-black ml-2"
                                    : "hover:bg-white hover:border-black hover:translate-x-1"
                                    }`}
                            >
                                <span className="text-xl">{link.icon}</span>
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t-4 border-black bg-white">
                    <Link href="/api/auth/logout" className="flex items-center justify-center w-full py-2 bg-[#f43f5e] text-white font-black border-2 border-black uppercase text-sm hover:translate-y-[2px] hover:translate-x-[2px] transition-all brutal-shadow-sm hover:shadow-none">
                        LOGOUT
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden min-h-screen relative p-4 md:p-8 bg-white border-l-0 md:border-l-4 border-black">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
