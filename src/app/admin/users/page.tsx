import { supabaseAdmin } from "@/lib/supabase/admin";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
    const { data: users } = await supabaseAdmin
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div>
            <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
                <h1 className="text-4xl font-black uppercase">
                    Registered Users <span className="text-[var(--color-primary-blue)]">({users?.length || 0})</span>
                </h1>
                <button className="brutal-btn bg-[#4ade80] px-6 py-3 font-black uppercase">
                    Export CSV
                </button>
            </div>

            <div className="bg-white border-4 border-black brutal-shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-black text-white uppercase text-sm font-black border-b-4 border-black">
                            <th className="p-4 border-r-4 border-black">Name</th>
                            <th className="p-4 border-r-4 border-black">Email / Phone</th>
                            <th className="p-4 border-r-4 border-black">Class Info</th>
                            <th className="p-4 border-r-4 border-black">Joined</th>
                            <th className="p-4 border-r-4 border-black">Source</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!users || users.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center font-bold text-xl uppercase">
                                    No registered users yet.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="border-b-4 border-black hover:bg-[var(--color-bg)] transition-colors">
                                    <td className="p-4 border-r-4 border-black font-bold">
                                        {user.name || 'Anonymous User'}
                                    </td>
                                    <td className="p-4 border-r-4 border-black text-sm">
                                        {user.email || 'N/A'}<br />
                                        <span className="text-black/60">{user.phone}</span>
                                    </td>
                                    <td className="p-4 border-r-4 border-black font-bold">
                                        {user.class ? `Class ${user.class}` : 'N/A'}
                                    </td>
                                    <td className="p-4 border-r-4 border-black text-sm font-bold opacity-70">
                                        {user.created_at ? formatDistanceToNow(new Date(user.created_at), { addSuffix: true }) : 'N/A'}
                                    </td>
                                    <td className="p-4 border-r-4 border-black">
                                        <span className="brutal-badge border-black bg-white">{user.source || 'Direct'}</span>
                                    </td>
                                    <td className="p-4 flex gap-2">
                                        <button className="px-3 py-1 border-2 border-black bg-white font-bold text-sm brutal-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                                            VIEW LOGS
                                        </button>
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
