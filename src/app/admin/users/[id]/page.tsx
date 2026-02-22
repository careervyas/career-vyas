import { supabaseAdmin } from "@/lib/supabase/admin";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch User
    const { data: user, error } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !user) {
        return notFound();
    }

    // Fetch Activity
    const { data: activity } = await supabaseAdmin
        .from("user_activity")
        .select("*")
        .eq("user_id", id)
        .order("timestamp", { ascending: false })
        .limit(50);

    // Fetch Bookings
    const { data: bookings } = await supabaseAdmin
        .from("bookings")
        .select(`*, mentor:mentors(name)`)
        .eq("user_id", id)
        .order("created_at", { ascending: false });

    return (
        <div>
            <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
                <div>
                    <Link href="/admin/users" className="text-sm font-bold underline hover:text-[var(--color-primary-yellow)] uppercase mb-2 block">
                        &larr; Back to Users
                    </Link>
                    <h1 className="text-4xl font-black uppercase">
                        {user.name || 'Anonymous User'}
                    </h1>
                </div>
                <div className="flex gap-4">
                    <button className="brutal-btn bg-white px-6 py-3 font-black uppercase">
                        Reset Password
                    </button>
                    <button className="brutal-btn bg-[#f43f5e] text-white px-6 py-3 font-black uppercase">
                        Ban User
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* User Profile Card */}
                <div className="bg-[var(--color-primary-yellow)] border-4 border-black p-6 brutal-shadow-sm flex flex-col h-full">
                    <h2 className="text-2xl font-black uppercase border-b-4 border-black pb-4 mb-6">Profile Record</h2>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-black uppercase text-black/60">ID</p>
                            <p className="font-mono bg-white border-2 border-black px-2 py-1 mt-1 text-sm">{user.id}</p>
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase text-black/60">Email</p>
                            <p className="font-bold text-lg">{user.email || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase text-black/60">Phone</p>
                            <p className="font-bold text-lg">{user.phone || 'N/A'}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-black uppercase text-black/60">Class</p>
                                <p className="font-black text-xl">{user.class || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase text-black/60">Source</p>
                                <p className="brutal-badge bg-white border-black mt-1 inline-block">{user.source || 'Direct'}</p>
                            </div>
                        </div>
                        <div className="mt-auto pt-4 border-t-4 border-black">
                            <p className="text-xs font-black uppercase text-black/60">Joined</p>
                            <p className="font-bold">{user.created_at ? new Date(user.created_at).toLocaleString() : 'N/A'}</p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 flex flex-col gap-8">
                    {/* Bookings Card */}
                    <div className="bg-white border-4 border-black p-6 brutal-shadow-sm">
                        <h2 className="text-2xl font-black uppercase border-b-4 border-black pb-4 mb-4">Mentorship Bookings</h2>
                        {(!bookings || bookings.length === 0) ? (
                            <div className="p-8 text-center bg-[var(--color-bg)] border-2 border-black border-dashed font-bold">
                                No sessions booked yet.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {bookings.map((b) => (
                                    <div key={b.id} className="border-4 border-black p-4 flex justify-between items-center bg-[var(--color-bg)]">
                                        <div>
                                            <p className="font-black uppercase text-lg">{b.mentor?.name || 'Unknown Mentor'}</p>
                                            <p className="text-sm font-bold text-black/70">{new Date(b.start_time).toLocaleString()}</p>
                                        </div>
                                        <span className={`brutal-badge border-black ${b.status === 'confirmed' ? 'bg-[#4ade80]' :
                                                b.status === 'cancelled' ? 'bg-[#f43f5e] text-white' : 'bg-[var(--color-primary-yellow)]'
                                            }`}>
                                            {b.status || 'Pending'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Activity Timeline Card */}
                    <div className="bg-white border-4 border-black p-6 brutal-shadow-sm flex-grow">
                        <h2 className="text-2xl font-black uppercase border-b-4 border-black pb-4 mb-4">Activity Timeline (Last 50)</h2>
                        {(!activity || activity.length === 0) ? (
                            <div className="p-8 text-center bg-[var(--color-bg)] border-2 border-black border-dashed font-bold">
                                No activity recorded.
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 border-2 border-black p-2 bg-[var(--color-bg)]">
                                {activity.map((act) => (
                                    <div key={act.id} className="border-b-2 border-black pb-2 mb-2 last:border-0 last:mb-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="brutal-badge bg-[var(--color-primary-blue)] text-white border-black text-xs font-mono">
                                                {act.activity_type}
                                            </span>
                                            <span className="text-xs font-bold opacity-60">
                                                {formatDistanceToNow(new Date(act.timestamp), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className="text-sm font-bold uppercase mt-1">
                                            TARGET: {act.content_type || 'GLOBAL'} {act.content_id ? `-> ${act.content_id}` : ''}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
