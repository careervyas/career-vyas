import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden bg-[#0f0a1e]">
            {/* Background Orbs/Glows to match Figma background gradient */}
            <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-[#8C4AF2]/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#FFB067]/10 rounded-full blur-[100px]" />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left Side: Text and CTA */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left z-20">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold leading-[1.1] mb-8 tracking-tight">
                        <span className="text-[#A36CF4]">अपना करियर पाथ</span><br />
                        <span className="text-[#FFB067]">चुनें, अभी!</span>
                    </h1>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded bg-[#8C4AF2]/20 border border-[#8C4AF2]/30 flex items-center justify-center">
                                <span className="text-white text-xs">🎓</span>
                            </div>
                            <div className="w-8 h-8 rounded bg-[#FFB067]/20 border border-[#FFB067]/30 flex items-center justify-center">
                                <span className="text-white text-xs">🚀</span>
                            </div>
                        </div>
                        <p className="text-xl md:text-2xl font-semibold text-white/90">Our Vision</p>
                    </div>

                    <p className="text-[#A5B4C8] text-lg md:text-xl font-medium max-w-lg mb-4 leading-relaxed">
                        Career Vyas के साथ अपने सपनों की दिशा में पहला कदम रखें – मुफ्त वेबिनार, पर्सनलाइज़्ड गाइड और टॉप कॉलेज मेंटरों से जुड़ें।
                    </p>

                    <p className="text-white/50 text-base max-w-lg mb-10 leading-relaxed font-light">
                        Digitalising study Communities across India. Our vision is to ensure every school student to have a mentor to guide them in their journey and provide growth and develop skillset
                    </p>

                    <Link
                        href="/webinar"
                        className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#A36CF4] hover:bg-[#8C4AF2] text-white text-[16px] font-bold transition-all duration-300 shadow-[0_4px_20px_rgba(163,108,244,0.3)] hover:shadow-[0_4px_30px_rgba(163,108,244,0.5)] hover:-translate-y-0.5"
                    >
                        अभी वेबिनार बुक करें
                    </Link>
                </div>

                {/* Right Side: Graphic/Image */}
                <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-auto lg:h-[600px] flex justify-center items-center">
                    <div className="relative w-[130%] h-[130%] ml-0 lg:-mr-32 group">
                        {/* Using the full home_page screenshot but heavily cropped via object-position to just highlight the right side */}
                        <Image
                            src="/images/home_page.png"
                            alt="Students pointing at phone"
                            fill
                            className="object-cover object-right drop-shadow-2xl transition-transform duration-700 ease-out group-hover:scale-105 opacity-90"
                            priority
                        />
                        {/* Overlay to fade out the left side of the raw screenshot */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0a1e] via-[#0f0a1e]/80 to-transparent" />
                    </div>
                </div>
            </div>
        </section>
    );
}
