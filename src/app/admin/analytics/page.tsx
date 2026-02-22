import { supabaseAdmin } from "@/lib/supabase/admin";
import { formatDistanceToNow } from "date-fns";
import AnalyticsCharts from "@/components/admin/AnalyticsCharts";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
    const { data: activityLogs } = await supabaseAdmin
        .from("user_activity")
        .select(`
      *,
      user:users(name)
    `)
        .order("timestamp", { ascending: false })
        .limit(100);

    const logs = activityLogs || [];

    // Calculate Search Volume
    const searchLogs = logs.filter(l => l.activity_type === 'SEARCH' || l.content_type === 'GLOBAL_SEARCH');
    const searchVolume = searchLogs.length;

    // Calculate Top Query
    const queryCounts = searchLogs.reduce((acc, log) => {
        const query = log.content_id || 'Unknown';
        acc[query] = (acc[query] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    let topQuery = "N/A";
    let max = 0;
    for (const [q, count] of Object.entries(queryCounts)) {
        if ((count as number) > max) {
            max = count as number;
            topQuery = q;
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
                <h1 className="text-4xl font-black uppercase">
                    Platform Analytics
                </h1>
                <button className="brutal-btn bg-[var(--color-primary-orange)] px-6 py-3 font-black uppercase">
                    Download PDF Report
                </button>
            </div>

            <div className="mb-12">
                <AnalyticsCharts activityData={logs} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="col-span-1 flex flex-col gap-6">
                    <div className="bg-[#4ade80] border-4 border-black p-6 brutal-shadow-sm flex-grow flex flex-col justify-center items-center">
                        <p className="font-black uppercase text-sm mb-2 text-center">Top Search Query</p>
                        <h4 className="text-3xl font-black text-center bg-white px-2 border-2 border-black line-clamp-1">{topQuery}</h4>
                    </div>
                    <div className="bg-[#f43f5e] border-4 border-black p-6 brutal-shadow-sm flex-grow flex flex-col justify-center items-center text-white">
                        <p className="font-black uppercase text-sm mb-2 text-center text-white/80">Search Volume (Recents)</p>
                        <h4 className="text-5xl font-black text-center drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] text-white">{searchVolume}</h4>
                    </div>
                </div>

                <div className="col-span-1 lg:col-span-2 bg-white border-4 border-black brutal-shadow-sm flex flex-col">
                    <h2 className="text-2xl font-black uppercase border-b-4 border-black p-6 bg-[var(--color-primary-yellow)] m-0">Real-Time Activity Feed</h2>
                    <div className="overflow-x-auto flex-grow">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-black text-white uppercase text-sm font-black border-b-4 border-black">
                                    <th className="p-4 border-r-4 border-black w-32">Event</th>
                                    <th className="p-4 border-r-4 border-black">User</th>
                                    <th className="p-4 border-r-4 border-black">Content Target</th>
                                    <th className="p-4">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center font-bold text-xl uppercase">
                                            No activity tracked yet. Set up /api/activity endpoints.
                                        </td>
                                    </tr>
                                ) : (
                                    logs.slice(0, 50).map((log) => (
                                        <tr key={log.id} className="border-b-4 border-black hover:bg-[var(--color-bg)] transition-colors">
                                            <td className="p-4 border-r-4 border-black">
                                                <span className="brutal-badge border-black bg-[var(--color-primary-blue)] text-white font-mono text-[10px]">
                                                    {log.activity_type || 'PAGE_VIEW'}
                                                </span>
                                            </td>
                                            <td className="p-4 border-r-4 border-black font-bold uppercase text-sm">
                                                {log.user?.name || 'Anonymous User'}
                                            </td>
                                            <td className="p-4 border-r-4 border-black font-mono text-xs">
                                                {log.content_type || 'PAGE'}
                                                {log.content_id ? ` : ${log.content_id}` : ''}
                                            </td>
                                            <td className="p-4 text-xs font-bold opacity-70">
                                                {log.timestamp ? formatDistanceToNow(new Date(log.timestamp), { addSuffix: true }) : 'N/A'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
