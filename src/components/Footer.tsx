import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-bg-card border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-white text-sm">
                                CV
                            </div>
                            <span className="text-xl font-bold gradient-text">Career Vyas</span>
                        </div>
                        <p className="text-text-secondary text-sm max-w-md leading-relaxed">
                            Career guidance from IIT, NIT & Medical College mentors who&apos;ve been in your shoes.
                            Like having an elder sibling guide you through the toughest decisions.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-text-primary mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {[
                                { href: "/mentors", label: "Our Mentors" },
                                { href: "/community", label: "Join Community" },
                                { href: "/blog", label: "Career Blog" },
                                { href: "/webinar", label: "Free Webinar" },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-text-secondary hover:text-primary-light transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-text-primary mb-4">Get in Touch</h3>
                        <ul className="space-y-2 text-sm text-text-secondary">
                            <li>📧 hello@careervyas.com</li>
                            <li>📍 India</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border mt-8 pt-8 text-center text-sm text-text-muted">
                    © {new Date().getFullYear()} Career Vyas. Made with ❤️ for Indian students.
                </div>
            </div>
        </footer>
    );
}
