import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Fetch relevant context from our database based on the user's query
async function getRelevantContext(query: string): Promise<string> {
    const lowerQuery = query.toLowerCase();
    const contextParts: string[] = [];

    // Search careers
    const { data: careers } = await supabase
        .from('career_profiles')
        .select('title, slug, summary, description, salary_range, demand, study_duration')
        .or(`title.ilike.%${lowerQuery}%,summary.ilike.%${lowerQuery}%,description.ilike.%${lowerQuery}%`)
        .limit(5);

    if (careers && careers.length > 0) {
        contextParts.push('### Relevant Career Profiles:\n' + careers.map(c =>
            `**${c.title}**: ${c.summary || ''}\n- Salary Range: ${c.salary_range || 'N/A'}\n- Demand: ${c.demand || 'N/A'}\n- Study Duration: ${c.study_duration || 'N/A'}\n- More: /explore/careers/${c.slug}`
        ).join('\n\n'));
    }

    // Search colleges
    const { data: colleges } = await supabase
        .from('colleges')
        .select('name, slug, description, type, city, state')
        .or(`name.ilike.%${lowerQuery}%,description.ilike.%${lowerQuery}%`)
        .limit(5);

    if (colleges && colleges.length > 0) {
        contextParts.push('### Relevant Colleges:\n' + colleges.map(c =>
            `**${c.name}** (${c.type}): ${c.description?.substring(0, 200) || ''}\n- Location: ${c.city || ''}, ${c.state || ''}\n- More: /explore/colleges/${c.slug}`
        ).join('\n\n'));
    }

    // Search courses
    const { data: courses } = await supabase
        .from('courses')
        .select('title, slug, description, type, duration, eligibility')
        .or(`title.ilike.%${lowerQuery}%,description.ilike.%${lowerQuery}%`)
        .limit(5);

    if (courses && courses.length > 0) {
        contextParts.push('### Relevant Courses:\n' + courses.map(c =>
            `**${c.title}** (${c.type}): ${c.description?.substring(0, 200) || ''}\n- Duration: ${c.duration || 'N/A'}\n- Eligibility: ${c.eligibility || 'N/A'}\n- More: /explore/courses/${c.slug}`
        ).join('\n\n'));
    }

    // Search exams
    const { data: exams } = await supabase
        .from('exams')
        .select('name, slug, full_form, description, level')
        .or(`name.ilike.%${lowerQuery}%,full_form.ilike.%${lowerQuery}%,description.ilike.%${lowerQuery}%`)
        .limit(5);

    if (exams && exams.length > 0) {
        contextParts.push('### Relevant Exams:\n' + exams.map(e =>
            `**${e.name}** (${e.full_form || ''}): ${e.description?.substring(0, 200) || ''}\n- Level: ${e.level || 'N/A'}\n- More: /explore/exams/${e.slug}`
        ).join('\n\n'));
    }

    // If no keyword matches, provide a general overview
    if (contextParts.length === 0) {
        // Try broader search with individual keywords
        const keywords = lowerQuery.split(/\s+/).filter(w => w.length > 2);
        for (const kw of keywords.slice(0, 3)) {
            const { data: kwCareers } = await supabase
                .from('career_profiles')
                .select('title, slug, summary')
                .ilike('description', `%${kw}%`)
                .limit(3);
            if (kwCareers && kwCareers.length > 0) {
                contextParts.push('### Related Careers:\n' + kwCareers.map(c =>
                    `- **${c.title}**: ${c.summary?.substring(0, 100) || ''} → /explore/careers/${c.slug}`
                ).join('\n'));
            }

            const { data: kwCourses } = await supabase
                .from('courses')
                .select('title, slug, description')
                .ilike('description', `%${kw}%`)
                .limit(3);
            if (kwCourses && kwCourses.length > 0) {
                contextParts.push('### Related Courses:\n' + kwCourses.map(c =>
                    `- **${c.title}**: ${c.description?.substring(0, 100) || ''} → /explore/courses/${c.slug}`
                ).join('\n'));
            }
        }
    }

    return contextParts.join('\n\n');
}

export async function POST(req: NextRequest) {
    try {
        const { message, history } = await req.json();

        if (!message || typeof message !== 'string') {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // Get relevant context from database
        const context = await getRelevantContext(message);

        // Build the prompt with system instructions and context
        const systemPrompt = `You are Career Vyas AI — a friendly, knowledgeable career guidance assistant for Indian students (Class 8-12 and beyond). You help students discover career paths, choose the right courses, find top colleges, and prepare for entrance exams.

## Your Personality:
- Warm, encouraging, and genuinely helpful — like a wise older sibling
- Use simple language, avoid jargon unless explaining it
- Be concise but thorough — aim for 2-4 paragraph responses
- Include specific, actionable advice
- When relevant, suggest exploring pages on Career Vyas (link format: /explore/careers/slug, /explore/colleges/slug, etc.)

## Your Knowledge Base:
You have access to our database of 126 career profiles, 282 colleges, 80 courses, and 77 exams across India.

${context ? `## Context from Career Vyas Database:\n${context}` : '## No specific matches found in our database for this query. Use your general knowledge to help.'}

## Guidelines:
1. Always be honest — if you don't know something, say so
2. Focus on the Indian education system (CBSE, ICSE, State boards, IITs, NITs, AIIMS, etc.)
3. When discussing career paths, mention relevant courses, colleges, and exams
4. Encourage students to explore Career Vyas pages for more details
5. Never provide medical, legal, or financial advice — redirect to professionals
6. Keep responses focused and structured — use bullet points and bold text for readability`;

        // Build conversation for Gemini — try multiple models for resilience
        const models = ['gemini-2.0-flash', 'gemini-1.5-flash'];
        let lastError: unknown = null;

        for (const modelName of models) {
            try {
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    systemInstruction: systemPrompt,
                });

                // Filter history: Gemini requires alternating user/model, must start with user
                const validHistory = (history || [])
                    .filter((msg: { role: string; content: string }) => msg.content && msg.content.trim())
                    .map((msg: { role: string; content: string }) => ({
                        role: msg.role === 'user' ? 'user' : 'model',
                        parts: [{ text: msg.content }],
                    }));

                // Ensure history starts with 'user' if non-empty
                while (validHistory.length > 0 && validHistory[0].role !== 'user') {
                    validHistory.shift();
                }

                const chat = model.startChat({
                    history: validHistory,
                });

                const result = await chat.sendMessage(message);
                const response = result.response.text();

                return NextResponse.json({ response });
            } catch (err) {
                lastError = err;
                console.warn(`Model ${modelName} failed, trying next...`, err instanceof Error ? err.message : '');
                continue;
            }
        }

        // All models failed
        throw lastError || new Error('All models failed');
    } catch (error: unknown) {
        console.error('Chat API error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        // If rate limited, return a friendlier message
        if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('Too Many Requests')) {
            return NextResponse.json({
                response: "I'm getting a lot of questions right now! 😊 Please wait a moment and try again. In the meantime, you can explore our **[Career Paths](/explore/careers)**, **[Colleges](/explore/colleges)**, **[Courses](/explore/courses)**, and **[Exams](/explore/exams)** pages directly!",
            });
        }

        return NextResponse.json(
            { error: 'Failed to generate response', details: errorMessage },
            { status: 500 }
        );
    }
}
