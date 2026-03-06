"use client";

import { useState } from "react";
import Link from "next/link";

interface CareerGridProps {
    initialCareers: any[];
}

export default function CareerGrid({ initialCareers }: CareerGridProps) {
    const [search, setSearch] = useState("");
    const [filterStream, setFilterStream] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // Derive unique streams
    const streams = ["All", ...Array.from(new Set(initialCareers.map(c => c.field_of_study || c.stream).filter(Boolean)))];

    // Filter logic
    const filtered = initialCareers.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
            (c.summary && c.summary.toLowerCase().includes(search.toLowerCase()));
        const streamField = c.field_of_study || c.stream;
        const matchesStream = filterStream === "All" || streamField === filterStream;
        return matchesSearch && matchesStream;
    });

    // Pagination logic
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="w-full">
            {/* Controls */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--color-border)] mb-12 flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-1/2">
                    <label className="block font-semibold text-[var(--color-text)] text-sm mb-2" htmlFor="search">Search Careers</label>
                    <input
                        id="search"
                        type="text"
                        placeholder="e.g. Software Engineer..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                        className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-soft)] px-4 py-3 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-indigo)] focus:border-transparent transition-all"
                    />
                </div>
                <div className="w-full md:w-1/2">
                    <label className="block font-semibold text-[var(--color-text)] text-sm mb-2" htmlFor="stream">Filter by Stream</label>
                    <select
                        id="stream"
                        value={filterStream}
                        onChange={(e) => { setFilterStream(e.target.value); setCurrentPage(1); }}
                        className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-soft)] px-4 py-3 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-indigo)] focus:border-transparent transition-all cursor-pointer appearance-none"
                    >
                        {streams.map((s: any, idx) => (
                            <option key={idx} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {paginated.map((career: any, idx: number) => {
                    return (
                        <Link
                            key={career.id}
                            href={`/explore/careers/${career.slug}`}
                            className="modern-card flex flex-col h-full group overflow-hidden"
                        >
                            <div className="bg-indigo-50 p-6 flex justify-between items-center text-[var(--color-text)] relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full blur-2xl -mr-10 -mt-10 opacity-60"></div>
                                <span className="text-4xl drop-shadow-sm group-hover:scale-110 transition-transform relative z-10">
                                    {career.icon || '💼'}
                                </span>
                                <span className="bg-white text-indigo-700 font-semibold px-3 py-1 rounded-full text-xs shadow-sm shadow-indigo-100 z-10 border border-indigo-50">₹{career.salary_range || 'Varies'}</span>
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <h2 className="text-xl font-bold leading-tight mb-3 text-[var(--color-text)] group-hover:text-[var(--color-primary-indigo)] transition-colors">
                                    {career.title}
                                </h2>

                                <p className="text-[var(--color-text-muted)] text-sm mb-6 flex-grow leading-relaxed line-clamp-3">
                                    {career.summary}
                                </p>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--color-border)] mt-auto">
                                    <div>
                                        <p className="font-semibold text-xs text-[var(--color-text-muted)] tracking-wide mb-1">Demand</p>
                                        <p className="font-bold text-sm text-[var(--color-text)]">{career.demand || 'High'}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-xs text-[var(--color-text-muted)] tracking-wide mb-1">Duration</p>
                                        <p className="font-bold text-sm text-[var(--color-text)]">{career.study_duration || '3-4 Yrs'}</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}

                {paginated.length === 0 && (
                    <div className="col-span-full rounded-2xl border border-[var(--color-border)] p-12 text-center bg-white shadow-sm">
                        <div className="text-4xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold mb-2 text-[var(--color-text)]">No Careers Found</h3>
                        <p className="text-[var(--color-text-muted)]">Try adjusting your search or stream filters.</p>
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
