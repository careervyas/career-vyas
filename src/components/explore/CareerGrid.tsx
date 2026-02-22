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
            <div className="bg-[var(--color-primary-yellow)] border-4 border-black p-6 brutal-shadow-sm mb-12 flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-1/2">
                    <label className="block font-black uppercase text-sm mb-2" htmlFor="search">Search Careers</label>
                    <input
                        id="search"
                        type="text"
                        placeholder="e.g. Software Engineer..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                        className="w-full border-4 border-black p-4 font-bold focus:outline-none focus:bg-[#4ade80] transition-colors"
                    />
                </div>
                <div className="w-full md:w-1/2">
                    <label className="block font-black uppercase text-sm mb-2" htmlFor="stream">Filter by Stream</label>
                    <select
                        id="stream"
                        value={filterStream}
                        onChange={(e) => { setFilterStream(e.target.value); setCurrentPage(1); }}
                        className="w-full border-4 border-black p-4 font-bold appearance-none bg-white focus:outline-none focus:bg-[#4ade80] transition-colors cursor-pointer"
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
                    const bgColors = ['bg-[var(--color-primary-blue)]', 'bg-[#4ade80]', 'bg-[var(--color-primary-orange)]', 'bg-[#f43f5e]', 'bg-[var(--color-primary-purple)]'];
                    const headerColor = bgColors[idx % bgColors.length];

                    return (
                        <Link
                            key={career.id}
                            href={`/explore/careers/${career.slug}`}
                            className="bg-white border-4 border-black flex flex-col brutal-shadow hover:translate-x-[4px] hover:-translate-y-[4px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all h-full group"
                        >
                            <div className={`${headerColor} border-b-4 border-black p-6 flex justify-between items-center text-white`}>
                                <span className="text-5xl drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] group-hover:scale-110 transition-transform">
                                    {career.icon || '💼'}
                                </span>
                                <span className="brutal-badge bg-white text-black drop-shadow-none">₹{career.salary_range || 'Varies'}</span>
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <h2 className="text-2xl font-black leading-tight mb-3 uppercase group-hover:underline decoration-4 underline-offset-4">
                                    {career.title}
                                </h2>

                                <p className="text-black/80 font-bold mb-6 flex-grow leading-snug">
                                    {career.summary}
                                </p>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t-4 border-black border-dashed mt-auto">
                                    <div>
                                        <p className="font-black uppercase text-[10px] text-black/50 tracking-wider">Demand</p>
                                        <p className="font-bold uppercase text-sm">{career.demand || 'High'}</p>
                                    </div>
                                    <div>
                                        <p className="font-black uppercase text-[10px] text-black/50 tracking-wider">Duration</p>
                                        <p className="font-bold uppercase text-sm">{career.study_duration || '3-4 Yrs'}</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}

                {paginated.length === 0 && (
                    <div className="col-span-full border-4 border-black p-12 text-center bg-white brutal-shadow-sm">
                        <h3 className="text-2xl font-black uppercase mb-2">No Careers Found</h3>
                        <p className="font-bold text-black/60">Try adjusting your search or stream filters.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-4">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                        className="brutal-btn bg-white px-6 py-3 font-black uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Prev
                    </button>
                    <div className="font-black text-xl border-4 border-black bg-[var(--color-primary-yellow)] px-6 py-3 brutal-shadow-sm flex items-center">
                        {currentPage} / {totalPages}
                    </div>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                        className="brutal-btn bg-black text-white px-6 py-3 font-black uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
