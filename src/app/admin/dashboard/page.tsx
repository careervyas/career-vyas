import { supabaseAdmin } from "@/lib/supabase/admin";
import Link from "next/link";

// Using App Router caching bypass to always get fresh metrics
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    // Fetch counts in parallel
    const [
        { count: usersCount },
        { count: mentorsCount },
        { count: careersCount },
        { count: coursesCount },
        { count: examsCount },
        { count: collegesCount },
        { count: bookingsCount },
    ] = await Promise.all([
        supabaseAdmin.from("users").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("mentors").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("career_profiles").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("courses").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("exams").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("colleges").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("bookings").select("*", { count: "exact", head: true }),
    ]);

    const statCards = [
        { title: "Total Users", count: usersCount || 0, color: "bg-[#4ade80]", link: "/admin/users" },
        { title: "Active Mentors", count: mentorsCount || 0, color: "bg-[var(--color-primary-purple)]", link: "/mentors" },
        { title: "Careers", count: careersCount || 0, color: "bg-[var(--color-primary-yellow)]", link: "/admin/content/careers" },
        { title: "Courses", count: coursesCount || 0, color: "bg-[var(--color-primary-orange)]", link: "/admin/content/courses" },
        { title: "Exams", count: examsCount || 0, color: "bg-[#f43f5e]", link: "/admin/content/exams" },
        { title: "Colleges", count: collegesCount || 0, color: "bg-[var(--color-primary-blue)]", link: "/admin/content/colleges" },
        { title: "Total Bookings", count: bookingsCount || 0, color: "bg-white", link: "/admin/bookings" },
    ];

    return (
        <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase mb-8 border-b-4 border-black pb-4">
                Platform Overview
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <Link
                        key={idx}
                        href={stat.link}
                        className={`border-4 border-black p-6 brutal-shadow hover:translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all ${stat.color} ${stat.color === 'bg-[var(--color-primary-purple)]' || stat.color === 'bg-[#f43f5e]' || stat.color === 'bg-[var(--color-primary-blue)]' ? 'text-white' : 'text-black'}`}
                    >
                        <h3 className="font-bold uppercase text-sm mb-2">{stat.title}</h3>
                        <p className="text-5xl font-black uppercase tracking-tighter drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] text-white">
                            {stat.count}
                        </p>
                    </Link>
                ))}
            </div>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white border-4 border-black p-6 brutal-shadow-sm">
                    <h2 className="text-2xl font-black uppercase mb-4 border-b-2 border-black pb-2">Recent Activity</h2>
                    <div className="py-4 font-bold text-center text-black/50 italic border-4 border-black border-dashed">
                        (Activity feed coming soon)
                    </div>
                </div>

                <div className="bg-white border-4 border-black p-6 brutal-shadow-sm">
                    <h2 className="text-2xl font-black uppercase mb-4 border-b-2 border-black pb-2">Quick Actions</h2>
                    <div className="flex flex-col gap-4">
                        <Link href="/admin/content/careers/new" className="brutal-btn py-3 text-center bg-[var(--color-primary-yellow)]">
                            + Add New Career
                        </Link>
                        <Link href="/admin/content/colleges/new" className="brutal-btn py-3 text-center bg-[var(--color-primary-blue)] text-white">
                            + Add New College
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
