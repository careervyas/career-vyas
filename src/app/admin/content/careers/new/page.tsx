"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createCareer } from "./actions"; // We will create this server action next

export default function NewCareerPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const result = await createCareer(formData);

        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            router.push("/admin/content/careers");
        }
    };

    return (
        <div className="max-w-4xl">
            <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
                <h1 className="text-4xl font-black uppercase">Add New Career</h1>
                <Link
                    href="/admin/content/careers"
                    className="brutal-btn bg-white px-6 py-3 font-black uppercase text-sm"
                >
                    Cancel
                </Link>
            </div>

            {error && (
                <div className="mb-6 p-4 border-[3px] border-black bg-[#f43f5e] text-white font-black uppercase brutal-shadow-sm">
                    ERROR: {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white border-4 border-black p-8 brutal-shadow space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block font-black uppercase text-sm mb-2" htmlFor="title">Job Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            required
                            className="w-full bg-[var(--color-bg)] border-[3px] border-black p-3 font-bold focus:outline-none focus:bg-[var(--color-primary-yellow)] transition-colors"
                            placeholder="e.g. Software Engineer"
                        />
                    </div>
                    <div>
                        <label className="block font-black uppercase text-sm mb-2" htmlFor="icon">Emoji Icon</label>
                        <input
                            type="text"
                            id="icon"
                            name="icon"
                            className="w-full bg-[var(--color-bg)] border-[3px] border-black p-3 font-bold focus:outline-none focus:bg-[var(--color-primary-yellow)] transition-colors"
                            placeholder="e.g. 💻"
                        />
                    </div>
                </div>

                <div>
                    <label className="block font-black uppercase text-sm mb-2" htmlFor="summary">Short Summary</label>
                    <input
                        type="text"
                        id="summary"
                        name="summary"
                        required
                        className="w-full bg-[var(--color-bg)] border-[3px] border-black p-3 font-bold focus:outline-none focus:bg-[var(--color-primary-yellow)] transition-colors"
                        placeholder="One sentence description..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block font-black uppercase text-sm mb-2" htmlFor="salary_range">Salary Range</label>
                        <input
                            type="text"
                            id="salary_range"
                            name="salary_range"
                            className="w-full bg-[var(--color-bg)] border-[3px] border-black p-3 font-bold focus:outline-none focus:bg-[var(--color-primary-yellow)] transition-colors"
                            placeholder="e.g. ₹5L - ₹20L"
                        />
                    </div>
                    <div>
                        <label className="block font-black uppercase text-sm mb-2" htmlFor="demand">Market Demand</label>
                        <input
                            type="text"
                            id="demand"
                            name="demand"
                            className="w-full bg-[var(--color-bg)] border-[3px] border-black p-3 font-bold focus:outline-none focus:bg-[var(--color-primary-yellow)] transition-colors"
                            placeholder="e.g. High"
                        />
                    </div>
                    <div>
                        <label className="block font-black uppercase text-sm mb-2" htmlFor="study_duration">Study Duration</label>
                        <input
                            type="text"
                            id="study_duration"
                            name="study_duration"
                            className="w-full bg-[var(--color-bg)] border-[3px] border-black p-3 font-bold focus:outline-none focus:bg-[var(--color-primary-yellow)] transition-colors"
                            placeholder="e.g. 4 Years"
                        />
                    </div>
                </div>

                <div>
                    <label className="block font-black uppercase text-sm mb-2" htmlFor="description">Full Description</label>
                    <textarea
                        id="description"
                        name="description"
                        rows={5}
                        className="w-full bg-[var(--color-bg)] border-[3px] border-black p-3 font-bold focus:outline-none focus:bg-[var(--color-primary-yellow)] transition-colors"
                        placeholder="Detailed overview..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white border-[4px] border-black font-black uppercase text-xl py-4 shadow-[6px_6px_0px_0px_var(--color-primary-blue)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all disabled:opacity-50"
                >
                    {loading ? "SAVING..." : "CREATE CAREER PROFILE"}
                </button>
            </form>
        </div>
    );
}
