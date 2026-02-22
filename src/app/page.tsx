import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import Link from "next/link";

const features = [
  {
    provider: "CAREER VYAS",
    title: "1-on-1 Mentorship",
    highlight: "FREE SESSIONS",
    highlightBg: "bg-[#3b82f6]", // blue
    desc: "Get personalized guidance from students studying in IITs, NITs, and top Medical Colleges. They've been where you are.",
    badge: "EXPERT GUIDANCE",
    link: "/mentors"
  },
  {
    provider: "CAREER VYAS",
    title: "Career Roadmaps",
    highlight: "CUSTOM PLANS",
    highlightBg: "bg-[#a855f7]", // purple
    desc: "Not sure what to do after 10th or 12th? We provide step-by-step career blueprints for engineering, medicine, and more.",
    badge: "ROADMAPS",
    link: "/mentoring"
  },
  {
    provider: "CAREER VYAS",
    title: "Live Webinars",
    highlight: "WEEKLY EVENTS",
    highlightBg: "bg-[#f97316]", // orange
    desc: "Join our free weekly webinars covering exam strategies, college selection, and modern career paths you might not know about.",
    badge: "LIVE SESSIONS",
    link: "/webinar"
  },
  {
    provider: "CAREER VYAS",
    title: "Student Community",
    highlight: "500+ STUDENTS",
    highlightBg: "bg-[#ffde59]", // yellow
    desc: "Connect with like-minded peers, share resources, ask questions, and grow together in our active WhatsApp communities.",
    badge: "COMMUNITY",
    link: "/community",
    textClass: "text-black"
  }
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />

      {/* Features Grid styling to match Neo-Brutalism screenshot */}
      <section className="py-24 bg-[var(--color-bg)] border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-black uppercase mb-4 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)] text-black">
                Why Career Vyas?
              </h2>
              <p className="text-xl font-bold text-black border-l-4 border-black pl-4">
                Everything you need to confidently choose your path.
              </p>
            </div>
            {/* Decorative arrow or shape could go here */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="bg-[#fffbf0] border-[3px] border-black p-6 flex flex-col brutal-shadow hover:translate-x-[2px] hover:-translate-y-[2px] transition-transform"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-black uppercase tracking-wider text-black/60">{feat.provider}</span>
                  <svg className="w-5 h-5 text-[#ffde59] drop-shadow-[1px_1px_0_rgba(0,0,0,1)]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>

                <h3 className="text-2xl font-black leading-tight mb-4 text-black">{feat.title}</h3>

                <div className={`mt-2 mb-6 border-[3px] border-black py-3 px-4 text-center font-black text-lg ${feat.highlightBg} ${feat.textClass || 'text-white'}`}>
                  {feat.highlight}
                </div>

                <p className="text-black/80 font-medium mb-6 flex-grow leading-relaxed">
                  {feat.desc}
                </p>

                <div className="mb-6">
                  <span className="brutal-badge">
                    {feat.badge}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <Link
                    href={feat.link}
                    className="border-2 border-black bg-white text-black font-black uppercase text-xs text-center py-2.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-1"
                  >
                    Details <span className="text-lg leading-none">→</span>
                  </Link>
                  <Link
                    href={feat.link}
                    className="border-2 border-black bg-[var(--color-primary-yellow)] text-black font-black uppercase text-xs text-center py-2.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-1"
                  >
                    Apply
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
