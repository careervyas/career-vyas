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
        <main className="min-h-screen bg-[var(--color-bg)] text-black">
            <Navbar />

            <article className="pt-32 pb-24 min-h-[85vh] relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

                    <Link href="/blog" className="inline-flex items-center gap-2 font-bold uppercase mb-8 hover:underline decoration-4 underline-offset-4">
                        <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        BACK TO ALL POSTS
                    </Link>

                    <header className="mb-12 border-b-4 border-black pb-8">
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <span className="brutal-badge bg-[var(--color-primary-orange)] text-black">
                                {post.category}
                            </span>
                            <span className="font-bold uppercase text-sm border-2 border-black px-2 py-1 bg-white brutal-shadow-sm">{post.date}</span>
                            <span className="font-bold uppercase text-sm border-2 border-black px-2 py-1 bg-[var(--color-primary-yellow)] brutal-shadow-sm">{post.readTime}</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-8 leading-[1.1]">
                            {post.title}
                        </h1>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full border-[3px] border-black bg-[var(--color-primary-blue)] brutal-shadow-sm flex items-center justify-center font-black text-xl text-white">
                                {post.author.charAt(0)}
                            </div>
                            <div>
                                <p className="font-black uppercase text-lg leading-tight">{post.author}</p>
                                <p className="font-bold text-sm text-black/60 uppercase">Career Vyas Expert</p>
                            </div>
                        </div>
                    </header>

                    <div className="prose prose-lg max-w-none prose-headings:font-black prose-headings:uppercase prose-p:font-medium prose-p:text-black/80 prose-strong:font-black prose-li:font-medium">
                        {contentBlocks.map((block, i) => {
                            if (block.startsWith('###')) {
                                return <h3 key={i} className="text-2xl mt-8 mb-4 border-l-4 border-black pl-4 bg-white py-2 brutal-shadow-sm">{block.replace('###', '').trim()}</h3>;
                            }

                            // Basic bold parsing
                            const formattedBlock = block.split('**').map((part, index) =>
                                index % 2 === 1 ? <strong key={index} className="bg-[var(--color-primary-yellow)] px-1 border-2 border-black mx-1">{part}</strong> : part
                            );

                            return <p key={i} className="mb-6 leading-relaxed text-xl">{formattedBlock}</p>;
                        })}
                    </div>

                    <div className="mt-16 pt-8 border-t-4 border-black flex flex-col sm:flex-row justify-between items-center gap-6">
                        <p className="font-black uppercase text-2xl">Want more guidance?</p>
                        <Link
                            href="/webinar"
                            className="brutal-btn px-8 py-4 text-center text-lg w-full sm:w-auto"
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
