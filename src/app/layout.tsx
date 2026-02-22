import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Career Vyas – Career Guidance for Indian Students | Class 8-12",
  description:
    "Get personalized career guidance from IIT, NIT & Medical College mentors. Free career counseling for Class 8-12 Indian students. Find your perfect career path today.",
  keywords: [
    "career guidance India",
    "career counseling students",
    "IIT mentors",
    "NIT mentors",
    "class 12 career options",
    "career after 10th",
    "career after 12th",
    "career vyas",
  ],
  openGraph: {
    title: "Career Vyas – Your Career Guide",
    description:
      "Free career guidance from IIT, NIT & Medical College mentors for Class 8-12 students.",
    url: "https://www.careervyas.com",
    siteName: "Career Vyas",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-bg-dark text-text-primary font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
