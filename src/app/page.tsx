import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import Link from "next/link";

const features = [
  {
    provider: "CAREER VYAS",
    title: "1-on-1 Mentorship",
    highlight: "Free Sessions",
    highlightBg: "bg-blue-50 text-blue-700 ring-1 ring-blue-200/50",
    desc: "Get personalized guidance from students studying in IITs, NITs, and top Medical Colleges. They've been where you are.",
    badge: "Expert Guidance",
    link: "/mentors"
  },
  {
    provider: "CAREER VYAS",
    title: "Career Roadmaps",
    highlight: "Custom Plans",
    highlightBg: "bg-purple-50 text-purple-700 ring-1 ring-purple-200/50",
    desc: "Not sure what to do after 10th or 12th? We provide step-by-step career blueprints for engineering, medicine, and more.",
    badge: "Roadmaps",
    link: "/mentoring"
  },
  {
    provider: "CAREER VYAS",
    title: "Live Webinars",
    highlight: "Weekly Events",
    highlightBg: "bg-orange-50 text-orange-700 ring-1 ring-orange-200/50",
    desc: "Join our free weekly webinars covering exam strategies, college selection, and modern career paths you might not know about.",
    badge: "Live Sessions",
    link: "/webinar"
  },
  {
    provider: "CAREER VYAS",
    title: "Student Community",
    highlight: "500+ Students",
    highlightBg: "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200/50",
    desc: "Connect with like-minded peers, share resources, ask questions, and grow together in our active WhatsApp communities.",
    badge: "Community",
    link: "/community",
  }
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />

      {/* Features Grid styling updated to modern Guidexia aesthetic */}
      <section className="py-24 bg-[var(--color-bg-soft)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--color-text)] mb-6 tracking-tight">
                Why Choose Career Vyas?
              </h2>
              <p className="text-xl text-[var(--color-text-muted)] leading-relaxed">
                Everything you need to confidently choose your path, backed by real experience from top college mentors.
              </p>
            </div>
            {/* View All Button */}
            <Link href="/explore" className="modern-btn-secondary px-6 py-2">
              View All Features
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="modern-card p-8 flex flex-col group h-full"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">{feat.provider}</span>
                  <div className="p-2 bg-[var(--color-bg-soft)] rounded-xl group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>

                <h3 className="text-2xl font-bold leading-tight mb-4 text-[var(--color-text)]">{feat.title}</h3>

                <div className={`mt-2 mb-6 rounded-xl py-2 px-4 text-center font-semibold text-sm ${feat.highlightBg}`}>
                  {feat.highlight}
                </div>

                <p className="text-[var(--color-text-muted)] font-medium mb-8 flex-grow leading-relaxed">
                  {feat.desc}
                </p>

                <div className="mb-8">
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-md">
                    {feat.badge}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <Link
                    href={feat.link}
                    className="modern-btn-secondary px-0 py-2.5 text-center text-sm flex items-center justify-center gap-1 group/btn"
                  >
                    Details <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                  </Link>
                  <Link
                    href={feat.link}
                    className="modern-btn px-0 py-2.5 text-center text-sm flex items-center justify-center gap-1"
                  >
                    Apply
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
