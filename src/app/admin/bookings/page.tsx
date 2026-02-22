import { supabaseAdmin } from "@/lib/supabase/admin";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
    const { data: bookingsRaw } = await supabaseAdmin
        .from("bookings")
        .select(`
      *,
      user:users(name, email),
      mentor:mentors(name)
    `)
        .order("created_at", { ascending: false });

    const bookings: any[] = bookingsRaw || [];

    return (
        <div>
            <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
                <h1 className="text-4xl font-black uppercase">
                    Bookings <span className="text-[var(--color-primary-blue)]">({bookings?.length || 0})</span>
                </h1>
                <button className="brutal-btn bg-[#f43f5e] text-white px-6 py-3 font-black uppercase">
                    Sync Cal.com
                </button>
            </div>

            <div className="bg-white border-4 border-black brutal-shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-black text-white uppercase text-sm font-black border-b-4 border-black">
                            <th className="p-4 border-r-4 border-black">User / Student</th>
                            <th className="p-4 border-r-4 border-black">Mentor</th>
                            <th className="p-4 border-r-4 border-black">Status</th>
                            <th className="p-4 border-r-4 border-black">Time</th>
                            <th className="p-4">Meeting Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!bookings || bookings.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center font-bold text-xl uppercase">
                                    No bookings synced yet. Set up Cal.com webhooks.
                                </td>
                            </tr>
                        ) : (
                            bookings.map((booking) => (
                                <tr key={booking.id} className="border-b-4 border-black hover:bg-[var(--color-bg)] transition-colors">
                                    <td className="p-4 border-r-4 border-black font-bold uppercase">
                                        {booking.user?.name || 'Unknown'}<br />
                                        <span className="text-xs text-black/60 normal-case">{booking.user?.email}</span>
                                    </td>
                                    <td className="p-4 border-r-4 border-black font-bold">
                                        {booking.mentor?.name || 'Unknown Mentor'}
                                    </td>
                                    <td className="p-4 border-r-4 border-black">
                                        <span className={`brutal-badge border-black ${booking.status === 'confirmed' ? 'bg-[#4ade80]' :
                                            booking.status === 'cancelled' ? 'bg-[#f43f5e] text-white' : 'bg-[var(--color-primary-yellow)]'
                                            }`}>
                                            {booking.status || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="p-4 border-r-4 border-black text-sm font-bold opacity-70">
                                        {booking.start_time ? new Date(booking.start_time).toLocaleString() : 'N/A'}
                                    </td>
                                    <td className="p-4">
                                        {booking.meeting_link ? (
                                            <a href={booking.meeting_link} target="_blank" rel="noopener noreferrer" className="px-3 py-1 border-2 border-black bg-[var(--color-primary-blue)] text-white font-bold text-sm brutal-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                                                JOIN MEET
                                            </a>
                                        ) : (
                                            <span className="text-black/50 text-sm font-bold italic">No Link</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
