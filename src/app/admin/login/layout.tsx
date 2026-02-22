// Standalone layout for the login page — NO auth check needed here
export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[var(--color-bg)]">
            {children}
        </div>
    );
}
