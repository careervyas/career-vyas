export interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    author: string;
    category: string;
    readTime: string;
}

export const blogs: BlogPost[] = [
    {
        slug: "how-to-choose-between-jee-and-neet",
        title: "How to Choose Between JEE and NEET: A Complete Guide",
        excerpt: "Stuck between Engineering and Medicine? Here is a no-nonsense guide to figuring out which path aligns with your true strengths.",
        content: "Choosing between JEE and NEET is one of the toughest decisions for Indian students in Class 10. \n\n### Understand Your Interests\nDo you love solving complex math problems, or are you fascinated by human biology? Engineering involves a lot of physics and math, while medicine leans heavily on biology and chemistry memorization.\n\n### Career Lifestyle\nEngineering often leads to corporate jobs, startups, or tech roles with a fast-paced lifestyle. Medicine is a long-term commitment requiring years of study, residency, and immense patience, but offers unmatched job security and social respect.\n\n### The Competition\nBoth paths are highly competitive. JEE Advanced tests deep analytical skills, while NEET requires speed and accuracy across a vast syllabus. \n\nDon't just follow the crowd—talk to professionals in both fields before deciding.",
        date: "Oct 12, 2024",
        author: "Rahul Verma",
        category: "CAREER ADVICE",
        readTime: "5 min read",
    },
    {
        slug: "top-5-mistakes-in-class-11",
        title: "Top 5 Mistakes Students Make in Class 11",
        excerpt: "Class 11 is the foundational year for all competitive exams. Avoid these common pitfalls that ruin students' preparation.",
        content: "Transitioning from Class 10 to Class 11 is a massive jump. Here are the top mistakes to avoid: \n\n1. **Ignoring NCERT:** Many students immediately jump to advanced reference books. NCERT is the bible for both JEE Main and NEET. Master it first.\n2. **Procrastination:** The syllabus is massive. Leaving things for tomorrow creates a backlog that is impossible to clear later.\n3. **Not Giving Mock Tests:** Studying without testing is useless. You need to know your weak areas.\n4. **Sacrificing Sleep:** Studying 16 hours a day on 4 hours of sleep destroys retention. Get 7-8 hours of sleep.\n5. **Changing Resources Constantly:** Stick to one good coaching material or set of books. Do not buy every book the topper recommends.",
        date: "Oct 18, 2024",
        author: "Dr. Priya Sharma",
        category: "EXAM PREP",
        readTime: "4 min read",
    },
    {
        slug: "careers-beyond-engineering-and-medicine",
        title: "Careers Beyond Engineering and Medicine in India",
        excerpt: "Think PCM/PCB only leads to B.Tech or MBBS? Discover highly lucrative and respected alternative career paths.",
        content: "There's a massive world beyond engineering and medicine. \n\n### Design and Architecture\nIf you have a creative flair mixed with analytical skills, Architecture (B.Arch) or Product/Fashion Design (NIFT/NID) are incredible paths. \n\n### Law\nCorporate law is booming. A 5-year integrated law degree from a top NLU (via CLAT) can land you jobs paying on par with top engineering placements.\n\n### Data Science & Economics\nFascinated by numbers but don't want to do traditional engineering? Economics (Hons) from DU or a B.Sc in Statistics/Data Science opens doors to high-paying analyst roles in top consulting firms.\n\nExplore your options. The world is changing fast.",
        date: "Oct 25, 2024",
        author: "Sneha Patel",
        category: "EXPLORATION",
        readTime: "6 min read",
    }
];
