import Image from 'next/image';
import Link from 'next/link';

export default function MentoringPage() {
    return (
        <main className="min-h-screen bg-bg-dark text-text-primary">
            <section className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-8 text-center">
                    Mentoring Plans
                </h1>
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 w-full h-64 md:h-auto relative">
                        <Image
                            src="/images/mentoring.png"
                            alt="Mentoring Plans"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg shadow-lg"
                        />
                    </div>
                    <div className="flex-1">
                        <p className="text-lg md:text-xl text-text-secondary mb-4">
                            Choose a plan that fits your needs. All plans include access to our mentor network, personalized career roadmaps, and exclusive webinars.
                        </p>
                        <ul className="list-disc list-inside text-text-secondary space-y-2 mb-6">
                            <li><strong>Basic:</strong> Free access to community and webinars.</li>
                            <li><strong>Pro:</strong> One‑on‑one mentorship sessions.</li>
                            <li><strong>Premium:</strong> Full career roadmap, mentorship, and priority support.</li>
                        </ul>
                        <Link
                            href="/community"
                            className="inline-block px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white font-semibold rounded-full cta-glow hover:scale-105 transition-all"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
