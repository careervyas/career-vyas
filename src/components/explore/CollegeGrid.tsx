"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";

interface CollegeGridProps {
    initialColleges: any[];
}

export default function CollegeGrid({ initialColleges }: CollegeGridProps) {
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // Derive unique Types
    const types = ["All", ...Array.from(new Set(initialColleges.map(c => c.type).filter(Boolean)))];

    // Filter logic
    const filtered = initialColleges.filter(c => {
        const matchesSearch = c.name?.toLowerCase().includes(search.toLowerCase()) ||
            (c.city && c.city.toLowerCase().includes(search.toLowerCase()));
        const courseType = c.type;
        const matchesType = filterType === "All" || courseType === filterType;
        return matchesSearch && matchesType;
    });

    // Pagination logic
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="w-full">
            {/* Controls */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--color-border)] mb-12 flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-1/2">
                    <label className="block font-semibold text-[var(--color-text)] text-sm mb-2" htmlFor="search">Search Colleges</label>
                    <input
                        id="search"
                        type="text"
                        placeholder="e.g. IIT, NIT, Delhi..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                        className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-soft)] px-4 py-3 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-indigo)] focus:border-transparent transition-all"
                    />
                </div>
                <div className="w-full md:w-1/2">
                    <label className="block font-semibold text-[var(--color-text)] text-sm mb-2" htmlFor="type">Filter by Type</label>
                    <select
                        id="type"
                        value={filterType}
                        onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
                        className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-soft)] px-4 py-3 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-indigo)] focus:border-transparent transition-all cursor-pointer appearance-none"
                    >
                        {types.map((type: any, idx) => (
                            <option key={idx} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {paginated.map((college: any) => {
                    return (
                        <Link
                            key={college.id}
                            href={`/explore/colleges/${college.slug}`}
                            className="modern-card flex flex-col h-full group overflow-hidden"
                        >
                            <div className="p-6 flex flex-col flex-grow relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                                        {college.type || 'University'}
                                    </span>
                                </div>

                                <h2 className="text-xl font-bold leading-tight mb-2 text-[var(--color-text)] group-hover:text-[var(--color-primary-indigo)] transition-colors line-clamp-2">
                                    {college.name}
                                </h2>

                                <p className="font-medium text-[var(--color-text-muted)] mb-6 flex items-center gap-1 text-sm">
                                    <MapPin size={16} className="text-gray-400" /> {college.city ? `${college.city}, ${college.state}` : 'India'}
                                </p>

                                <div className="mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-[var(--color-border)]">
                                    <div>
                                        <p className="font-semibold text-xs text-[var(--color-text-muted)] tracking-wide mb-1">Avg Package</p>
                                        <p className="font-bold text-sm text-[var(--color-success)]">{college.placement_stats?.average_package_lpa ? college.placement_stats.average_package_lpa + " LPA" : 'TBD'}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-xs text-[var(--color-text-muted)] tracking-wide mb-1">Top Recruiter</p>
                                        <p className="font-bold text-sm text-[var(--color-text)] block truncate pr-2">{college.placement_stats?.top_recruiters ? college.placement_stats.top_recruiters[0] : 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-[var(--color-bg-soft)] border-t border-[var(--color-border)] group-hover:bg-indigo-50 transition-colors flex justify-between items-center text-sm font-semibold text-[var(--color-primary-indigo)]">
                                <span>View Campus Details</span>
                                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </Link>
                    );
                })}

                {paginated.length === 0 && (
                    <div className="col-span-full rounded-2xl border border-[var(--color-border)] p-12 text-center bg-white shadow-sm">
                        <div className="text-4xl mb-4">🏢</div>
                        <h3 className="text-xl font-bold mb-2 text-[var(--color-text)]">No Colleges Found</h3>
                        <p className="text-[var(--color-text-muted)]">Try adjusting your search filters.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                        className="modern-btn-secondary px-6 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <div className="flex items-center justify-center font-semibold text-sm bg-white border border-[var(--color-border)] rounded-full px-6 min-w-[5rem] shadow-sm text-[var(--color-text)]">
                        {currentPage} / {totalPages}
                    </div>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                        className="modern-btn-secondary px-6 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
