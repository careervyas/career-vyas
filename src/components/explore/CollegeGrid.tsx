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
        const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
            (c.location && c.location.toLowerCase().includes(search.toLowerCase()));
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
            <div className="bg-[var(--color-primary-blue)] border-4 border-black p-6 brutal-shadow-sm mb-12 flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-1/2">
                    <label className="block text-white font-black uppercase text-sm mb-2" htmlFor="search">Search Colleges</label>
                    <input
                        id="search"
                        type="text"
                        placeholder="e.g. IIT, NIT, Delhi..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                        className="w-full border-4 border-black p-4 font-bold focus:outline-none focus:bg-[#4ade80] transition-colors"
                    />
                </div>
                <div className="w-full md:w-1/2">
                    <label className="block text-white font-black uppercase text-sm mb-2" htmlFor="type">Filter by Type</label>
                    <select
                        id="type"
                        value={filterType}
                        onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
                        className="w-full border-4 border-black p-4 font-bold appearance-none bg-white focus:outline-none focus:bg-[#4ade80] transition-colors cursor-pointer"
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
                            className="bg-white border-4 border-black flex flex-col brutal-shadow hover:translate-x-[4px] hover:-translate-y-[4px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all h-full group"
                        >
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="brutal-badge border-black bg-black text-white">
                                        {college.type || 'University'}
                                    </span>
                                </div>

                                <h2 className="text-2xl font-black leading-tight mb-2 uppercase group-hover:underline decoration-4 underline-offset-4 line-clamp-2">
                                    {college.name}
                                </h2>

                                <p className="font-bold text-black/60 mb-6 flex items-center gap-1 uppercase text-sm">
                                    <MapPin size={16} /> {college.location || 'India'}
                                </p>

                                <div className="mt-auto grid grid-cols-2 gap-4 pt-4 border-t-4 border-black border-dashed">
                                    <div>
                                        <p className="font-black uppercase text-[10px] tracking-wider opacity-60">Avg Package</p>
                                        <p className="font-bold text-lg text-[#4ade80]">{college.avg_package || 'TBD'}</p>
                                    </div>
                                    <div>
                                        <p className="font-black uppercase text-[10px] tracking-wider opacity-60">Top Recruiter</p>
                                        <p className="font-bold text-sm block truncate pr-2">{college.top_recruiters ? college.top_recruiters.split(',')[0] : 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-t-4 border-black bg-[var(--color-primary-yellow)] group-hover:bg-[var(--color-primary-blue)] group-hover:text-white transition-colors">
                                <span className="font-black uppercase text-sm">VIEW CAMPUS DETAILS ➝</span>
                            </div>
                        </Link>
                    );
                })}

                {paginated.length === 0 && (
                    <div className="col-span-full border-4 border-black p-12 text-center bg-white brutal-shadow-sm text-black">
                        <h3 className="text-2xl font-black uppercase mb-2">No Colleges Found</h3>
                        <p className="font-bold text-black/60">Try adjusting your search filters.</p>
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
