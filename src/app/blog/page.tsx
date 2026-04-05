import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { blogs } from '@/data/blogs';

export default function BlogListingPage() {
    return (
        <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans">
            <Navbar />

            <section className="pt-32 pb-24 border-b border-[var(--color-border)] min-h-[85vh] relative overflow-hidden">
                <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-200 rounded-full blur-[100px] opacity-40 hidden md:block" />
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full blur-[100px] opacity-40 hidden md:block" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

                    <div className="mb-16">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-[1.1] text-[var(--color-text)]">
                            <span className="text-[var(--color-primary-indigo)] block mb-2">The</span>
                            Blog
                        </h1>
                        <p className="text-lg md:text-xl font-medium max-w-2xl text-[var(--color-text-muted)] leading-relaxed">
                            No-nonsense advice, exam strategies, and career insights from those who have actually done it.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((post, idx) => {
                            return (
                                <div key={post.slug} className="modern-card flex flex-col h-full group overflow-hidden">
                                    <div className="p-6 flex flex-col flex-grow relative overflow-hidden text-left">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-bg-soft)] rounded-full blur-2xl -mr-10 -mt-10 opacity-60"></div>
                                        
                                        <div className="flex justify-between items-start mb-6 gap-2 relative z-10">
                                            <span className="modern-badge bg-indigo-50/50 text-indigo-700 border border-indigo-100">
                                                {post.category}
                                            </span>
                                            <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider whitespace-nowrap">{post.date}</span>
                                        </div>

                                        <h2 className="text-2xl font-bold leading-tight mb-4 text-[var(--color-text)] group-hover:text-[var(--color-primary-indigo)] transition-colors line-clamp-3 relative z-10">
                                            <Link href={`/blog/${post.slug}`} className="before:absolute before:inset-0">
                                                {post.title}
                                            </Link>
                                        </h2>

                                        <p className="text-[var(--color-text-muted)] font-medium mb-8 flex-grow leading-relaxed relative z-10 line-clamp-3">
                                            {post.excerpt}
                                        </p>

                                        <div className="flex justify-between items-center pt-4 border-t border-[var(--color-border)] relative z-10">
                                            <span className="font-semibold uppercase text-xs tracking-wide text-[var(--color-text-muted)]">By {post.author}</span>
                                            <span className="font-medium text-xs text-[var(--color-text-muted)] flex items-center gap-1 bg-[var(--color-bg-soft)] px-2 py-1 rounded-full border border-[var(--color-border)]">
                                                <svg className="w-3 h-3 relative -top-[1px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                {post.readTime}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    );
}
