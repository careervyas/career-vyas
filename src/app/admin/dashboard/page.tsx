import { supabaseAdmin } from "@/lib/supabase/admin";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    // 1. Get counts
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

    // 2. Active users today (activity in last 24h)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const { count: activeUsersToday } = await supabaseAdmin
        .from("user_activity")
        .select("user_id", { count: "exact", head: true })
        .gte("timestamp", yesterday.toISOString());

    // 3. Content views (total activity logs)
    const { count: totalContentViews } = await supabaseAdmin
        .from("user_activity")
        .select("*", { count: "exact", head: true });

    // 3.5 Top Popular Content (last 100 views)
    const { data: recentViews } = await supabaseAdmin
        .from("user_activity")
        .select("content_type, content_id")
        .eq("activity_type", "PAGE_VIEW")
        .order("timestamp", { ascending: false })
        .limit(100);

    const viewCounts = (recentViews || []).reduce((acc: any, log: any) => {
        const id = log.content_id;
        if (id) acc[id] = (acc[id] || 0) + 1;
        return acc;
    }, {});

    const popularContent = Object.entries(viewCounts)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 3)
        .map(([id]) => id);

    // 4. Recent Signups
    const { data: recentUsers } = await supabaseAdmin
        .from("users")
        .select("id, name, email, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

    // 5. Recent Activity
    const { data: recentActivity } = await supabaseAdmin
        .from("user_activity")
        .select(`
            id, activity_type, content_type, timestamp,
            user:users(name)
        `)
        .order("timestamp", { ascending: false })
        .limit(5);

    const statCards = [
        { title: "Total Users", count: usersCount || 0, color: "bg-[#4ade80]", link: "/admin/users" },
        { title: "Active Today", count: activeUsersToday || 0, color: "bg-[var(--color-primary-yellow)]", link: "/admin/analytics" },
        { title: "Content Views", count: totalContentViews || 0, color: "bg-white", link: "/admin/analytics" },
        { title: "Bookings", count: bookingsCount || 0, color: "bg-[var(--color-primary-purple)]", link: "/admin/bookings" },
    ];

    const contentCards = [
        { title: "Careers", count: careersCount || 0, link: "/admin/content/careers" },
        { title: "Courses", count: coursesCount || 0, link: "/admin/content/courses" },
        { title: "Exams", count: examsCount || 0, link: "/admin/content/exams" },
        { title: "Colleges", count: collegesCount || 0, link: "/admin/content/colleges" },
    ];

    return (
        <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase mb-8 border-b-4 border-black pb-4">
                Platform Overview
            </h1>

            {/* Top Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {statCards.map((stat, idx) => (
                    <Link
                        key={idx}
                        href={stat.link}
                        className={`border-4 border-black p-6 brutal-shadow hover:translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all ${stat.color} ${stat.color === 'bg-[var(--color-primary-purple)]' ? 'text-white' : 'text-black'}`}
                    >
                        <h3 className="font-bold uppercase text-sm mb-2">{stat.title}</h3>
                        <p className={`text-5xl font-black uppercase tracking-tighter ${stat.color === 'bg-[var(--color-primary-purple)]' ? 'drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] text-white' : 'drop-shadow-[2px_2px_0px_rgba(255,255,255,1)] text-black'}`}>
                            {stat.count}
                        </p>
                    </Link>
                ))}
            </div>

            {/* Content Inventory & Popular Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-1 bg-[var(--color-primary-blue)] text-white border-4 border-black p-6 brutal-shadow-sm">
                    <h2 className="text-2xl font-black uppercase mb-6 border-b-4 border-black pb-2">Content Inventory</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {contentCards.map((card, idx) => (
                            <Link key={idx} href={card.link} className="bg-white text-black border-4 border-black p-4 text-center hover:bg-[var(--color-primary-yellow)] transition-colors">
                                <p className="font-black text-3xl">{card.count}</p>
                                <p className="font-bold uppercase text-xs">{card.title}</p>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white border-4 border-black p-6 brutal-shadow-sm flex flex-col items-center justify-center">
                    <h2 className="text-2xl font-black uppercase mb-4 w-full text-left border-b-4 border-black pb-2">Top Popular Content</h2>
                    <div className="w-full text-center py-4">
                        {popularContent.length === 0 ? (
                            <>
                                <h3 className="text-3xl font-black uppercase opacity-20 rotate-[-2deg] mb-2">AWAITING MORE DATA</h3>
                                <p className="font-bold border-2 border-black inline-block px-4 py-2 bg-[#4ade80] brutal-shadow-sm">Tracking view metrics across modules.</p>
                            </>
                        ) : (
                            <div className="flex justify-center items-center h-full gap-4 flex-col">
                                <p className="font-bold text-sm uppercase text-black/60 bg-[var(--color-bg)] px-2 border-2 border-black border-dashed">Trending Now</p>
                                {popularContent.map((id, idx) => {
                                    const colors = ['bg-[#ffde59]', 'bg-[#4ade80]', 'bg-white'];
                                    return (
                                        <div key={idx} className={`border-4 border-black p-4 w-full brutal-shadow-sm flex items-center justify-between ${colors[idx % colors.length]}`}>
                                            <div className="flex items-center gap-4">
                                                <span className="font-black text-2xl">#{idx + 1}</span>
                                                <span className="font-black uppercase text-xl truncate text-left">{id}</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Feeds Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Recent Signups */}
                <div className="bg-white border-4 border-black brutal-shadow-sm overflow-hidden flex flex-col">
                    <div className="bg-black text-white p-4 border-b-4 border-black flex justify-between items-center">
                        <h2 className="text-xl font-black uppercase">Recent Signups</h2>
                        <Link href="/admin/users" className="text-xs font-bold underline hover:text-[var(--color-primary-yellow)]">VIEW ALL</Link>
                    </div>
                    <div className="p-0">
                        {recentUsers?.length === 0 ? (
                            <div className="p-6 text-center font-bold">No recent signups.</div>
                        ) : (
                            recentUsers?.map((user: any) => (
                                <div key={user.id} className="border-b-2 border-black p-4 flex justify-between items-center hover:bg-[var(--color-bg)]">
                                    <div>
                                        <p className="font-black uppercase">{user.name || 'Anonymous'}</p>
                                        <p className="text-xs font-bold text-black/60">{user.email || 'No email'}</p>
                                    </div>
                                    <p className="text-xs font-bold bg-[var(--color-primary-yellow)] px-2 py-1 border-2 border-black">
                                        {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white border-4 border-black brutal-shadow-sm overflow-hidden flex flex-col">
                    <div className="bg-black text-white p-4 border-b-4 border-black flex justify-between items-center">
                        <h2 className="text-xl font-black uppercase">Recent Activity</h2>
                        <Link href="/admin/analytics" className="text-xs font-bold underline hover:text-[#4ade80]">VIEW ALL</Link>
                    </div>
                    <div className="p-0">
                        {recentActivity?.length === 0 ? (
                            <div className="p-6 text-center font-bold">No recent activity.</div>
                        ) : (
                            recentActivity?.map((act: any) => (
                                <div key={act.id} className="border-b-2 border-black p-4 flex flex-col justify-center hover:bg-[var(--color-bg)]">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="font-black uppercase text-sm">
                                            {act.user?.name || 'Someone'} <span className="text-black/50 font-normal lowercase">did:</span> {act.activity_type}
                                        </p>
                                        <p className="text-xs font-bold whitespace-nowrap opacity-70">
                                            {formatDistanceToNow(new Date(act.timestamp), { addSuffix: true })}
                                        </p>
                                    </div>
                                    <p className="text-xs font-bold uppercase text-black/60">
                                        Target: {act.content_type || 'Unknown'}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}
