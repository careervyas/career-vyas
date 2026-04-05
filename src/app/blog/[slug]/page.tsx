import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { blogs } from '@/data/blogs';

interface BlogPostProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function BlogPostPage({ params }: BlogPostProps) {
    const { slug } = await params;
    const post = blogs.find((b) => b.slug === slug);

    if (!post) {
        notFound();
    }

    // Split content by paragraphs/headings for simple rendering
    const contentBlocks = post.content.split('\n\n');

    return (
        <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans">
            <Navbar />

            <article className="pt-32 pb-24 min-h-[85vh] relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

                    <Link href="/blog" className="inline-flex items-center gap-2 font-medium text-[var(--color-text-muted)] mb-8 hover:text-[var(--color-primary-indigo)] transition-colors">
                        <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        BACK TO ALL POSTS
                    </Link>

                    <header className="mb-12 border-b border-[var(--color-border)] pb-8">
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <span className="modern-badge bg-indigo-50/50 text-indigo-700 border border-indigo-100">
                                {post.category}
                            </span>
                            <span className="font-semibold text-xs text-[var(--color-text-muted)] uppercase tracking-wider bg-white border border-[var(--color-border)] px-3 py-1 rounded-full shadow-sm">{post.date}</span>
                            <span className="font-semibold text-xs text-indigo-600 uppercase tracking-wider bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">{post.readTime}</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 leading-[1.1] text-[var(--color-text)]">
                            {post.title}
                        </h1>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full border border-[var(--color-border)] bg-[var(--color-primary-indigo)] shadow-sm flex items-center justify-center font-bold text-xl text-white">
                                {post.author.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-lg leading-tight text-[var(--color-text)]">{post.author}</p>
                                <p className="font-medium text-sm text-[var(--color-text-muted)] uppercase tracking-widest mt-1">Career Vyas Expert</p>
                            </div>
                        </div>
                    </header>

                    <div className="prose prose-lg max-w-none text-[var(--color-text-muted)] leading-relaxed prose-headings:font-bold prose-headings:text-[var(--color-text)] prose-strong:font-bold prose-strong:text-[var(--color-text)]">
                        {contentBlocks.map((block, i) => {
                            if (block.startsWith('###')) {
                                return <h3 key={i} className="text-2xl mt-12 mb-6 font-bold text-[var(--color-text)]">{block.replace('###', '').trim()}</h3>;
                            }

                            // Basic bold parsing
                            const formattedBlock = block.split('**').map((part, index) =>
                                index % 2 === 1 ? <strong key={index} className="text-[var(--color-text)] font-semibold">{part}</strong> : part
                            );

                            return <p key={i} className="mb-6 leading-relaxed text-lg">{formattedBlock}</p>;
                        })}
                    </div>

                    <div className="mt-16 pt-8 border-t border-[var(--color-border)] flex flex-col sm:flex-row justify-between items-center gap-6">
                        <p className="font-bold text-2xl text-[var(--color-text)]">Want more guidance?</p>
                        <Link
                            href="/webinar"
                            className="modern-btn w-full sm:w-auto text-lg px-8 py-3"
                        >
                            BOOK FREE WEBINAR
                        </Link>
                    </div>

                </div>
            </article>

            <Footer />
        </main>
    );
}
