import Link from "next/link";
import { createMentor } from "../actions";

export default function NewMentorPage() {
    return (
        <div>
            <div className="flex items-center gap-4 mb-8 border-b-4 border-black pb-4">
                <Link href="/admin/mentors" className="border-4 border-black px-4 py-2 font-black hover:bg-black hover:text-white transition-colors">
                    ← BACK
                </Link>
                <h1 className="text-4xl font-black uppercase">Add New Mentor</h1>
            </div>

            <form action={createMentor} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                    <div className="bg-white border-4 border-black p-6 brutal-shadow-sm">
                        <h2 className="text-xl font-black uppercase border-b-4 border-black pb-3 mb-5">Basic Info</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block font-black uppercase text-sm mb-2">Full Name *</label>
                                <input name="name" required placeholder="e.g. Priya Sharma" className="w-full border-4 border-black p-3 font-bold bg-[var(--color-bg)] focus:outline-none focus:bg-[var(--color-primary-yellow)] transition-colors" />
                            </div>
                            <div>
                                <label className="block font-black uppercase text-sm mb-2">Tagline *</label>
                                <input name="tagline" required placeholder="e.g. IIT Bombay Grad | Google SWE" className="w-full border-4 border-black p-3 font-bold bg-[var(--color-bg)] focus:outline-none focus:bg-[var(--color-primary-yellow)] transition-colors" />
                            </div>
                            <div>
                                <label className="block font-black uppercase text-sm mb-2">Bio</label>
                                <textarea name="bio" rows={4} placeholder="A brief description of the mentor's background and approach..." className="w-full border-4 border-black p-3 font-bold bg-[var(--color-bg)] focus:outline-none focus:bg-[var(--color-primary-yellow)] transition-colors resize-none" />
                            </div>
                            <div>
                                <label className="block font-black uppercase text-sm mb-2">Expertise (comma-separated)</label>
                                <input name="expertise" placeholder="e.g. JEE Prep, IIT, Software Engineering" className="w-full border-4 border-black p-3 font-bold bg-[var(--color-bg)] focus:outline-none focus:bg-[var(--color-primary-yellow)] transition-colors" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border-4 border-black p-6 brutal-shadow-sm">
                        <h2 className="text-xl font-black uppercase border-b-4 border-black pb-3 mb-5">Profile Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block font-black uppercase text-sm mb-2">Photo URL</label>
                                <input name="photo_url" placeholder="https://..." className="w-full border-4 border-black p-3 font-bold bg-[var(--color-bg)] focus:outline-none focus:bg-[var(--color-primary-yellow)] transition-colors" />
                                <p className="text-xs font-bold text-black/50 mt-1">Use a LinkedIn photo URL or any public image link</p>
                            </div>
                            <div>
                                <label className="block font-black uppercase text-sm mb-2">LinkedIn URL</label>
                                <input name="linkedin_url" placeholder="https://linkedin.com/in/..." className="w-full border-4 border-black p-3 font-bold bg-[var(--color-bg)] focus:outline-none focus:bg-[var(--color-primary-yellow)] transition-colors" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <div className="bg-white border-4 border-black p-6 brutal-shadow-sm">
                        <h2 className="text-xl font-black uppercase border-b-4 border-black pb-3 mb-5">Booking Settings</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block font-black uppercase text-sm mb-2">Cal.com Username</label>
                                <div className="flex">
                                    <span className="border-4 border-r-0 border-black px-3 py-3 font-bold bg-black text-white text-sm">cal.com/</span>
                                    <input name="cal_username" placeholder="priya-sharma" className="flex-1 border-4 border-black p-3 font-bold bg-[var(--color-bg)] focus:outline-none focus:bg-[var(--color-primary-yellow)] transition-colors" />
                                </div>
                                <p className="text-xs font-bold text-black/50 mt-1">This enables the embedded booking widget on the mentor's page</p>
                            </div>
                            <div>
                                <label className="block font-black uppercase text-sm mb-2">Session Price (₹)</label>
                                <input name="session_price" type="number" min="0" placeholder="e.g. 500 (leave blank for free)" className="w-full border-4 border-black p-3 font-bold bg-[var(--color-bg)] focus:outline-none focus:bg-[var(--color-primary-yellow)] transition-colors" />
                            </div>
                            <div>
                                <label className="block font-black uppercase text-sm mb-2">Years of Experience</label>
                                <input name="years_experience" type="number" min="0" max="50" placeholder="e.g. 5" className="w-full border-4 border-black p-3 font-bold bg-[var(--color-bg)] focus:outline-none focus:bg-[var(--color-primary-yellow)] transition-colors" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--color-primary-yellow)] border-4 border-black p-6 brutal-shadow-sm">
                        <h2 className="text-xl font-black uppercase border-b-4 border-black pb-3 mb-5">Visibility</h2>
                        <label className="flex items-center gap-4 cursor-pointer group">
                            <input name="is_featured" type="checkbox" className="w-6 h-6 border-4 border-black accent-black cursor-pointer" />
                            <div>
                                <p className="font-black uppercase">Feature this Mentor</p>
                                <p className="font-bold text-sm text-black/70">Featured mentors appear prominently on the Mentors page</p>
                            </div>
                        </label>
                    </div>

                    <div className="flex gap-4">
                        <Link href="/admin/mentors" className="flex-1 text-center py-4 border-4 border-black font-black uppercase hover:bg-black hover:text-white transition-colors">
                            CANCEL
                        </Link>
                        <button type="submit" className="flex-1 py-4 bg-black text-white border-4 border-black font-black uppercase brutal-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                            CREATE MENTOR
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
