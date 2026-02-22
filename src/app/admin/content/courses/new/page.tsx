"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createCourse } from "./actions";

export default function NewCoursePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const result = await createCourse(formData);

        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            router.push("/admin/content/courses");
        }
    };

    return (
        <div className="max-w-4xl">
            <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
                <h1 className="text-4xl font-black uppercase">Add New Course</h1>
                <Link
                    href="/admin/content/courses"
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
                        <label className="block font-black uppercase text-sm mb-2" htmlFor="title">Course Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            required
                            className="w-full bg-[var(--color-bg)] border-[3px] border-black p-3 font-bold focus:outline-none focus:bg-[var(--color-primary-yellow)] transition-colors"
                            placeholder="e.g. B.Tech Computer Science"
                        />
                    </div>
                    <div>
                        <label className="block font-black uppercase text-sm mb-2" htmlFor="type">Course Type</label>
                        <input
                            type="text"
                            id="type"
                            name="type"
                            className="w-full bg-[var(--color-bg)] border-[3px] border-black p-3 font-bold focus:outline-none focus:bg-[var(--color-primary-yellow)] transition-colors"
                            placeholder="e.g. Undergrad Degree"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block font-black uppercase text-sm mb-2" htmlFor="duration">Duration</label>
                        <input
                            type="text"
                            id="duration"
                            name="duration"
                            className="w-full bg-[var(--color-bg)] border-[3px] border-black p-3 font-bold focus:outline-none focus:bg-[var(--color-primary-yellow)] transition-colors"
                            placeholder="e.g. 4 Years"
                        />
                    </div>
                    <div>
                        <label className="block font-black uppercase text-sm mb-2" htmlFor="eligibility">Eligibility</label>
                        <input
                            type="text"
                            id="eligibility"
                            name="eligibility"
                            className="w-full bg-[var(--color-bg)] border-[3px] border-black p-3 font-bold focus:outline-none focus:bg-[var(--color-primary-yellow)] transition-colors"
                            placeholder="e.g. 10+2 with PCM 60%"
                        />
                    </div>
                </div>

                <div>
                    <label className="block font-black uppercase text-sm mb-2" htmlFor="description">Course Overview</label>
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
                    {loading ? "SAVING..." : "CREATE COURSE"}
                </button>
            </form>
        </div>
    );
}
