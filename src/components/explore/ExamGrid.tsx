"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";

interface ExamGridProps {
    initialExams: any[];
}

export default function ExamGrid({ initialExams }: ExamGridProps) {
    const [search, setSearch] = useState("");
    const [filterLevel, setFilterLevel] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // Derive unique levels
    const levels = ["All", ...Array.from(new Set(initialExams.map(e => e.level).filter(Boolean)))];

    // Filter logic
    const filtered = initialExams.filter(e => {
        const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
            (e.full_form && e.full_form.toLowerCase().includes(search.toLowerCase()));
        const examLevel = e.level;
        const matchesLevel = filterLevel === "All" || examLevel === filterLevel;
        return matchesSearch && matchesLevel;
    });

    // Pagination logic
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="w-full">
            {/* Controls */}
            <div className="bg-[#f43f5e] border-4 border-black p-6 brutal-shadow-sm mb-12 flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-1/2">
                    <label className="block text-white font-black uppercase text-sm mb-2" htmlFor="search">Search Exams</label>
                    <input
                        id="search"
                        type="text"
                        placeholder="e.g. JEE Main, NEET..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                        className="w-full border-4 border-black p-4 font-bold focus:outline-none focus:bg-[#ffde59] transition-colors"
                    />
                </div>
                <div className="w-full md:w-1/2">
                    <label className="block text-white font-black uppercase text-sm mb-2" htmlFor="level">Filter by Level</label>
                    <select
                        id="level"
                        value={filterLevel}
                        onChange={(e) => { setFilterLevel(e.target.value); setCurrentPage(1); }}
                        className="w-full border-4 border-black p-4 font-bold appearance-none bg-white focus:outline-none focus:bg-[#ffde59] transition-colors cursor-pointer"
                    >
                        {levels.map((level: any, idx) => (
                            <option key={idx} value={level}>{level}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {paginated.map((exam: any) => {
                    return (
                        <Link
                            key={exam.id}
                            href={`/explore/exams/${exam.slug}`}
                            className="bg-white border-4 border-black flex flex-col brutal-shadow hover:translate-x-[4px] hover:-translate-y-[4px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all h-full group p-6"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="brutal-badge border-black bg-[var(--color-bg)]">
                                    {exam.level || 'National'}
                                </span>
                                <span className="text-xl font-bold border-2 border-black px-2 bg-[var(--color-primary-yellow)] leading-none pt-1">
                                    🔔
                                </span>
                            </div>

                            <h2 className="text-4xl font-black leading-tight mb-1 uppercase group-hover:text-[#f43f5e] group-hover:underline decoration-4 underline-offset-4 transition-colors">
                                {exam.name}
                            </h2>

                            <p className="font-bold text-sm text-black/60 mb-6 flex-grow">
                                {exam.full_form}
                            </p>

                            <div className="bg-[var(--color-bg)] border-2 border-black p-4 flex flex-col gap-2 mb-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-black uppercase text-black/50 tracking-wider">Exam Date</span>
                                    <span className="font-bold">{exam.exam_date ? format(new Date(exam.exam_date), 'MMM dd, yyyy') : 'TBA'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-black uppercase text-black/50 tracking-wider">Mode</span>
                                    <span className="font-bold bg-white border-black border-2 px-1">{exam.mode || 'Online CBT'}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t-4 border-black mt-auto">
                                <span className="font-black uppercase text-sm group-hover:text-[#f43f5e]">VIEW SYLLABUS & DETAILS ➝</span>
                            </div>
                        </Link>
                    );
                })}

                {paginated.length === 0 && (
                    <div className="col-span-full border-4 border-black p-12 text-center bg-white brutal-shadow-sm text-black">
                        <h3 className="text-2xl font-black uppercase mb-2">No Exams Found</h3>
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
