export interface Mentor {
    name: string;
    college: string;
    expertise: string;
    bio: string;
    image: string;
    isActive: boolean;
    order: number;
}

export const mentors: Mentor[] = [
    {
        name: "Dr. Priya Sharma",
        college: "AIIMS Delhi",
        expertise: "Medical",
        bio: "MBBS from AIIMS, helping students crack NEET",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        isActive: true,
        order: 1,
    },
    {
        name: "Rahul Verma",
        college: "IIT Bombay",
        expertise: "Engineering",
        bio: "IIT Bombay CS graduate, guide for JEE aspirants",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        isActive: true,
        order: 2,
    },
    {
        name: "Sneha Patel",
        college: "NIFT Mumbai",
        expertise: "Design",
        bio: "Fashion design expert, portfolio guidance specialist",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        isActive: true,
        order: 3,
    },
    {
        name: "Arjun Singh",
        college: "NLSIU Bangalore",
        expertise: "Law",
        bio: "National Law School alumnus, CLAT preparation mentor",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        isActive: true,
        order: 4,
    },
    {
        name: "Neha Gupta",
        college: "IIM Ahmedabad",
        expertise: "Business",
        bio: "IIM A graduate, guiding commerce students",
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        isActive: true,
        order: 5,
    }
];
