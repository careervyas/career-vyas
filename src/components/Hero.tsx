import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-800 to-indigo-900 text-white py-20">
            {/* Background illustration placeholder */}
            <div className="absolute inset-0 opacity-20">
                <Image
                    src="/images/home_page.png"
                    alt="Hero background"
                    layout="fill"
                    objectFit="cover"
                    priority={true}
                />
            </div>
            <div className="relative z-10 max-w-4xl text-center px-4">
                <h1 className="gradient-text text-5xl md:text-6xl font-bold mb-6">
                    अपना करियर पाथ चुनें, अभी!
                </h1>
                <p className="text-lg md:text-xl text-gray-200 mb-8">
                    Career Vyas के साथ अपने सपनों की दिशा में पहला कदम रखें – मुफ्त वेबिनार, पर्सनलाइज़्ड गाइड और टॉप कॉलेज मेंटरों से जुड़ें।
                </p>
                <Link
                    href="/webinar"
                    className="inline-block bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 px-8 rounded-full cta-glow"
                >
                    अभी वेबिनार बुक करें
                </Link>
            </div>
        </section>
    );
}
