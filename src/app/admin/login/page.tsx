"use client";

import { useState } from "react";
import { loginAction } from "./actions";

export default function AdminLogin() {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(false);
        const result = await loginAction(formData);
        // If we get here, the action returned an error (success redirects away)
        if (result?.error) {
            setError(true);
            setLoading(false);
        }
    }

    return (
        <div className="min-h-[90vh] flex items-center justify-center p-4">
            <div className="bg-white border-[4px] border-black p-8 md:p-12 brutal-shadow max-w-md w-full relative">
                <div className="absolute -top-5 -right-5 bg-[var(--color-primary-yellow)] border-[3px] border-black text-black font-black uppercase text-sm px-4 py-1 rotate-6 brutal-shadow-sm">
                    ADMIN SECURE
                </div>

                <h1 className="text-4xl font-black uppercase mb-2">Admin Login</h1>
                <p className="font-bold text-black/70 mb-8 border-b-4 border-black pb-4">
                    Authorized personnel only.
                </p>

                {error && (
                    <div className="mb-6 p-4 border-[3px] border-black text-white font-black uppercase text-center brutal-shadow-sm bg-[#f43f5e]">
                        INCORRECT PASSWORD
                    </div>
                )}

                <form action={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block font-black uppercase text-sm mb-2" htmlFor="password">
                            Master Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            required
                            onChange={() => setError(false)}
                            className="w-full bg-[var(--color-bg)] border-[3px] border-black p-4 font-bold focus:outline-none focus:bg-[var(--color-primary-yellow)] transition-colors placeholder:text-black/30"
                            placeholder="Enter password..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white border-[4px] border-black font-black uppercase text-xl py-4 shadow-[6px_6px_0px_0px_var(--color-primary-blue)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "LOGGING IN..." : "LOGIN"}
                    </button>
                </form>
            </div>
        </div>
    );
}
