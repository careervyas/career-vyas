"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const hasError = searchParams.get("error") === "1";

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

                {hasError && (
                    <div className="mb-6 p-4 border-[3px] border-black text-white font-black uppercase text-center brutal-shadow-sm bg-[#f43f5e]">
                        INCORRECT PASSWORD
                    </div>
                )}

                {/* Native form POST — no JS required, cookie is set before redirect */}
                <form
                    method="POST"
                    action="/api/auth/login"
                    onSubmit={() => setLoading(true)}
                    className="space-y-6"
                >
                    <div>
                        <label className="block font-black uppercase text-sm mb-2" htmlFor="password">
                            Master Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            required
                            autoComplete="current-password"
                            className="w-full bg-[var(--color-bg)] border-[3px] border-black p-4 font-bold focus:outline-none focus:bg-[var(--color-primary-yellow)] transition-colors placeholder:text-black/30"
                            placeholder="Enter password..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white border-[4px] border-black font-black uppercase text-xl py-4 shadow-[6px_6px_0px_0px_var(--color-primary-blue)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all disabled:opacity-50"
                    >
                        {loading ? "LOGGING IN..." : "LOGIN"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function AdminLogin() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black text-2xl">LOADING...</div>}>
            <LoginForm />
        </Suspense>
    );
}
