import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { blogs } from '@/data/blogs';

export default function BlogListingPage() {
    return (
        <main className="min-h-screen bg-[var(--color-bg)] text-black">
            <Navbar />

            <section className="pt-32 pb-24 border-b-4 border-black border-dashed min-h-[85vh] relative overflow-hidden">

                {/* Decorative background shapes */}
                <div className="absolute top-40 right-10 lg:right-32 w-24 h-24 bg-[#4ade80] border-4 border-black brutal-shadow rotate-12 hidden md:block" />
                <div className="absolute bottom-20 left-10 lg:left-32 w-32 h-32 bg-[var(--color-primary-yellow)] border-4 border-black brutal-shadow rounded-full hidden md:block" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

                    <div className="mb-16">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase mb-6 tracking-tight drop-shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
                            THE <br />
                            <span className="bg-[var(--color-primary-blue)] text-white px-4 leading-[1.1] inline-block border-[5px] border-black brutal-shadow-sm rotate-2 mt-2 mb-4">
                                BLOG
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl font-bold max-w-2xl text-black/80 leading-relaxed border-l-4 border-black pl-6 italic bg-white p-4 brutal-shadow-sm text-left">
                            No-nonsense advice, exam strategies, and career insights from those who have actually done it.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((post, idx) => {
                            const colors = [
                                'bg-[var(--color-primary-yellow)]',
                                'bg-[var(--color-primary-orange)]',
                                'bg-[var(--color-primary-purple)]',
                                'bg-[#4ade80]',
                                'bg-[#f43f5e]'
                            ];
                            const badgeColor = colors[idx % colors.length];

                            return (
                                <div key={post.slug} className="bg-white border-4 border-black flex flex-col brutal-shadow hover:translate-x-[2px] hover:-translate-y-[2px] transition-transform h-full">
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex justify-between items-start mb-4 gap-2">
                                            <span className={`brutal-badge ${badgeColor} text-black border-black`}>
                                                {post.category}
                                            </span>
                                            <span className="text-sm font-bold uppercase whitespace-nowrap">{post.date}</span>
                                        </div>

                                        <h2 className="text-2xl md:text-3xl font-black leading-tight mb-4 uppercase hover:underline decoration-4 underline-offset-4 line-clamp-3">
                                            <Link href={`/blog/${post.slug}`}>
                                                {post.title}
                                            </Link>
                                        </h2>

                                        <p className="text-black/80 font-bold mb-6 flex-grow leading-relaxed">
                                            {post.excerpt}
                                        </p>

                                        <div className="flex justify-between items-center mb-6 pt-4 border-t-4 border-black">
                                            <span className="font-bold uppercase text-sm">BY {post.author}</span>
                                            <span className="font-bold text-sm bg-[var(--color-bg)] border-2 border-black px-2 py-1 brutal-shadow-sm">{post.readTime}</span>
                                        </div>

                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="border-[3px] border-black bg-black text-white font-black uppercase text-sm text-center py-3 shadow-[4px_4px_0px_0px_rgba(255,222,89,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all w-full flex items-center justify-center gap-2"
                                        >
                                            READ FULL POST
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                        </Link>
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
