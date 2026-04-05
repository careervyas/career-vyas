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
        const matchesSearch = e.name?.toLowerCase().includes(search.toLowerCase()) ||
            (e.full_name && e.full_name.toLowerCase().includes(search.toLowerCase()));
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
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--color-border)] mb-12 flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-1/2">
                    <label className="block font-semibold text-[var(--color-text)] text-sm mb-2" htmlFor="search">Search Exams</label>
                    <input
                        id="search"
                        type="text"
                        placeholder="e.g. JEE Main, NEET..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                        className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-soft)] px-4 py-3 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-indigo)] focus:border-transparent transition-all"
                    />
                </div>
                <div className="w-full md:w-1/2">
                    <label className="block font-semibold text-[var(--color-text)] text-sm mb-2" htmlFor="level">Filter by Level</label>
                    <select
                        id="level"
                        value={filterLevel}
                        onChange={(e) => { setFilterLevel(e.target.value); setCurrentPage(1); }}
                        className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-soft)] px-4 py-3 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-indigo)] focus:border-transparent transition-all cursor-pointer appearance-none"
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
                            className="modern-card flex flex-col h-full group overflow-hidden"
                        >
                            <div className="p-6 flex flex-col flex-grow relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="bg-rose-50 text-rose-700 border border-rose-100 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                                        {exam.level || 'National'}
                                    </span>
                                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 shadow-sm shadow-yellow-100/50">
                                        🔔
                                    </div>
                                </div>

                                <h2 className="text-xl font-bold leading-tight mb-1 text-[var(--color-text)] group-hover:text-rose-600 transition-colors">
                                    {exam.name}
                                </h2>

                                <p className="font-medium text-sm text-[var(--color-text-muted)] mb-6 flex-grow">
                                    {exam.full_name}
                                </p>

                                <div className="bg-[var(--color-bg-soft)] rounded-xl p-4 flex flex-col gap-3 mb-2 border border-[var(--color-border)]">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-semibold text-[var(--color-text-muted)] tracking-wide">Exam Date</span>
                                        <span className="font-bold text-[var(--color-text)]">
                                            {exam.important_dates && exam.important_dates.length > 0 ? exam.important_dates[0].date || exam.important_dates[0].month : 'TBA'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm border-t border-[var(--color-border)] pt-2">
                                        <span className="font-semibold text-[var(--color-text-muted)] tracking-wide">Mode</span>
                                        <span className="font-bold text-[var(--color-text)]">{exam.mode || 'Online CBT'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-[var(--color-bg-soft)] border-t border-[var(--color-border)] group-hover:bg-rose-50 transition-colors flex justify-between items-center text-sm font-semibold text-rose-600">
                                <span>View Syllabus & Details</span>
                                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </Link>
                    );
                })}

                {paginated.length === 0 && (
                    <div className="col-span-full rounded-2xl border border-[var(--color-border)] p-12 text-center bg-white shadow-sm">
                        <div className="text-4xl mb-4">📝</div>
                        <h3 className="text-xl font-bold mb-2 text-[var(--color-text)]">No Exams Found</h3>
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
