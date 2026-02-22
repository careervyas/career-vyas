import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";

const features = [
  {
    icon: "🎓",
    title: "IIT & NIT Mentors",
    description:
      "Get guidance from students and alumni of India's top colleges who've walked the path you're on.",
  },
  {
    icon: "🤝",
    title: "1-on-1 Sessions",
    description:
      "Personal mentoring sessions tailored to your interests, strengths, and career goals.",
  },
  {
    icon: "📚",
    title: "Career Roadmaps",
    description:
      "Clear, step-by-step guides for every career path — from Engineering to Medicine to Design.",
  },
  {
    icon: "💬",
    title: "Active Community",
    description:
      "Join 100+ students in our WhatsApp community. Ask questions, share doubts, grow together.",
  },
];

const mentorColleges = [
  "IIT Delhi",
  "IIT Bombay",
  "NIT Trichy",
  "AIIMS Delhi",
  "IIT Kanpur",
  "NIT Warangal",
];

const stats = [
  { value: "20+", label: "Expert Mentors" },
  { value: "500+", label: "Students Guided" },
  { value: "15+", label: "Career Paths" },
  { value: "Free", label: "Webinars" },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <Hero />

      {/* Trusted By Section */}
      <section className="py-12 border-y border-border bg-bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-text-muted text-sm mb-6 uppercase tracking-wider">
            Mentors from India&apos;s Top Colleges
          </p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {mentorColleges.map((college) => (
              <span
                key={college}
                className="text-text-secondary font-medium text-lg opacity-70 hover:opacity-100 hover:text-primary-light transition-all duration-300"
              >
                {college}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-28 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Students{" "}
              <span className="gradient-text">Love Career Vyas</span>
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              We&apos;re not a boring career website. We&apos;re like that helpful senior
              who actually tells you the truth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={`glass-card rounded-2xl p-8 hover:bg-bg-card-hover hover:scale-[1.02] transition-all duration-300 group ${i === 0 ? "md:col-span-2" : ""
                  }`}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-text-primary">
                  {feature.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 sm:py-28 bg-bg-card/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Start in{" "}
              <span className="gradient-text">3 Simple Steps</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Join the Community",
                desc: "Join our free WhatsApp group and say hi! 👋",
              },
              {
                step: "02",
                title: "Explore Careers",
                desc: "Browse career paths and read guides written by real mentors.",
              },
              {
                step: "03",
                title: "Talk to a Mentor",
                desc: "Get personalized advice from mentors who've been where you are.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-text-secondary text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Confused About Your Career?
            <br />
            <span className="gradient-text">Let&apos;s Fix That. For Free.</span>
          </h2>
          <p className="text-text-secondary text-lg mb-10 max-w-2xl mx-auto">
            Join 100+ students who are already getting career clarity from
            India&apos;s best college mentors. No fees. No BS. Just honest guidance.
          </p>
          <Link
            href="/community"
            className="inline-flex px-10 py-5 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg hover:scale-105 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 cta-glow"
          >
            Join Career Vyas — It&apos;s Free 🚀
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
