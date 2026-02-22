"use client";

import { useState } from "react";
import Link from "next/link";

interface CourseGridProps {
    initialCourses: any[];
}

export default function CourseGrid({ initialCourses }: CourseGridProps) {
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // Derive unique course types
    const types = ["All", ...Array.from(new Set(initialCourses.map(c => c.type).filter(Boolean)))];

    // Filter logic
    const filtered = initialCourses.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
            (c.description && c.description.toLowerCase().includes(search.toLowerCase()));
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
            <div className="bg-[#4ade80] border-4 border-black p-6 brutal-shadow-sm mb-12 flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-1/2">
                    <label className="block font-black uppercase text-sm mb-2" htmlFor="search">Search Courses</label>
                    <input
                        id="search"
                        type="text"
                        placeholder="e.g. Computer Science..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                        className="w-full border-4 border-black p-4 font-bold focus:outline-none focus:bg-[var(--color-primary-yellow)] transition-colors"
                    />
                </div>
                <div className="w-full md:w-1/2">
                    <label className="block font-black uppercase text-sm mb-2" htmlFor="type">Filter by Type</label>
                    <select
                        id="type"
                        value={filterType}
                        onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
                        className="w-full border-4 border-black p-4 font-bold appearance-none bg-white focus:outline-none focus:bg-[var(--color-primary-yellow)] transition-colors cursor-pointer"
                    >
                        {types.map((type: any, idx) => (
                            <option key={idx} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {paginated.map((course: any, idx: number) => {
                    const bgColors = ['bg-white', 'bg-[var(--color-primary-yellow)]', 'bg-[var(--color-primary-blue)]'];
                    const cardColor = bgColors[idx % bgColors.length];
                    const textColor = cardColor === 'bg-[var(--color-primary-blue)]' ? 'text-white' : 'text-black';

                    return (
                        <Link
                            key={course.id}
                            href={`/explore/courses/${course.slug}`}
                            className={`${cardColor} border-4 border-black flex flex-col brutal-shadow hover:translate-x-[4px] hover:-translate-y-[4px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all h-full group p-6 ${textColor}`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className={`brutal-badge border-black ${cardColor === 'bg-[var(--color-primary-blue)]' ? 'bg-white text-black' : 'bg-black text-white'}`}>
                                    {course.type || 'Degree path'}
                                </span>
                            </div>

                            <h2 className={`text-2xl font-black leading-tight mb-2 uppercase group-hover:underline decoration-4 underline-offset-4`}>
                                {course.title}
                            </h2>

                            <p className={`font-bold mb-6 flex-grow line-clamp-3 opacity-90`}>
                                {course.description || 'Comprehensive degree program leading to top careers.'}
                            </p>

                            <div className={`grid grid-cols-2 gap-4 pt-4 border-t-4 ${cardColor === 'bg-[var(--color-primary-blue)]' ? 'border-white/50' : 'border-black'} border-dashed mb-4`}>
                                <div>
                                    <p className={`font-black uppercase text-[10px] tracking-wider opacity-60`}>Duration</p>
                                    <p className="font-bold uppercase text-sm">{course.duration || '3-4 Years'}</p>
                                </div>
                                <div>
                                    <p className={`font-black uppercase text-[10px] tracking-wider opacity-60`}>Eligibility</p>
                                    <p className="font-bold uppercase text-sm block truncate pr-2">{course.eligibility || '10+2 Check details'}</p>
                                </div>
                            </div>

                            <div className={`pt-4 border-t-4 ${cardColor === 'bg-[var(--color-primary-blue)]' ? 'border-white' : 'border-black'} mt-auto`}>
                                <span className="font-black uppercase text-sm">COURSE DETAILS ➝</span>
                            </div>
                        </Link>
                    );
                })}

                {paginated.length === 0 && (
                    <div className="col-span-full border-4 border-black p-12 text-center bg-white brutal-shadow-sm text-black">
                        <h3 className="text-2xl font-black uppercase mb-2">No Courses Found</h3>
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
