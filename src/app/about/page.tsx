import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-bg-dark text-text-primary">
            <section className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-8 text-center">
                    About Career Vyas
                </h1>
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1">
                        <p className="text-lg md:text-xl text-text-secondary mb-4">
                            Career Vyas is a free, student‑focused platform that connects Class 8‑12 learners with mentors from India’s top engineering and medical colleges. Our mission is to demystify career choices and give every student a clear, actionable roadmap.
                        </p>
                        <p className="text-lg md:text-xl text-text-secondary mb-4">
                            We provide:
                        </p>
                        <ul className="list-disc list-inside text-text-secondary space-y-2">
                            <li>One‑on‑one mentorship sessions</li>
                            <li>Career roadmaps for engineering, medicine, design and more</li>
                            <li>Free webinars and community support</li>
                        </ul>
                        <Link
                            href="/community"
                            className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white font-semibold rounded-full cta-glow hover:scale-105 transition-all"
                        >
                            Join Our Community
                        </Link>
                    </div>
                    <div className="flex-1 w-full h-64 md:h-auto relative">
                        <Image
                            src="/images/about us.png"
                            alt="About Career Vyas"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg shadow-lg"
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}
