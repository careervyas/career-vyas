# Career Vyas

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) functioning as a career guidance platform for Indian school students.

## Website Layout Features

The site has four primary navigation pillars:
1. **Home**: Hero section, value propositions, waitlists, CTAs.
2. **Mentoring**: Showcase of our elite mentors from top institutions.
3. **Explore**:
    - Careers
    - Courses
    - Exams
    - Colleges
4. **Community & Blogs**: WhatsApp groups and blog posts.

## Automation & AI Backfilling (Data Pipeline)

We employ an AI-powered pipeline to clean our raw Word documents and match them against the latest frontend component schema.
The `scripts/backfill_content.py` automatically picks up `.docx` files from the `content/App Content` directory and leverages Google's Gemini 2.5 Pro to:
- Convert to Markdown
- Parse structure and fill in any missing data or gaps according to the templates defined in `new_layout.docx`.
- Output clean, structured `JSON` payloads.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
