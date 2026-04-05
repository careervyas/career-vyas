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

async function callOpenAICompatibleAPI(apiUrl: string, apiKey: string, model: string, systemPrompt: string, history: any[], message: string, extraHeaders: Record<string, string> = {}): Promise<string> {
    const formattedHistory = (history || [])
        .filter((msg: any) => msg.content && msg.content.trim())
        .map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
        }));

    const messages = [
        { role: 'system', content: systemPrompt },
        ...formattedHistory,
        { role: 'user', content: message }
    ];

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            ...extraHeaders
        },
        body: JSON.stringify({
            model: model,
            messages: messages,
        })
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
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

        // --- FALLBACK SEQUENCE ---
        let lastError: unknown = null;

        // 1. Try OPENAI API
        if (process.env.OPENAI_API_KEY) {
            try {
                const response = await callOpenAICompatibleAPI(
                    'https://api.openai.com/v1/chat/completions',
                    process.env.OPENAI_API_KEY,
                    'gpt-4o-mini',
                    systemPrompt,
                    history,
                    message
                );
                return NextResponse.json({ response });
            } catch (err) {
                lastError = err;
                console.warn('OpenAI failed, falling back to Deepseek...', err instanceof Error ? err.message : '');
            }
        }

        // 2. Try Deepseek API
        if (process.env.DEEPSEEK_API_KEY) {
            try {
                const response = await callOpenAICompatibleAPI(
                    'https://api.deepseek.com/chat/completions',
                    process.env.DEEPSEEK_API_KEY,
                    'deepseek-chat',
                    systemPrompt,
                    history,
                    message
                );
                return NextResponse.json({ response });
            } catch (err) {
                lastError = err;
                console.warn('Deepseek failed, falling back to Groq...', err instanceof Error ? err.message : '');
            }
        }

        // 2. Try GROQ API
        if (process.env.GROQ_API_KEY) {
            try {
                const response = await callOpenAICompatibleAPI(
                    'https://api.groq.com/openai/v1/chat/completions',
                    process.env.GROQ_API_KEY,
                    'llama3-8b-8192', // Replace with any specific fine-tuned ID if needed
                    systemPrompt,
                    history,
                    message
                );
                return NextResponse.json({ response });
            } catch (err) {
                lastError = err;
                console.warn('Groq failed, falling back to Mistral...', err instanceof Error ? err.message : '');
            }
        }

        // 3. Try MISTRAL API
        if (process.env.MISTRAL_API_KEY) {
            try {
                const response = await callOpenAICompatibleAPI(
                    'https://api.mistral.ai/v1/chat/completions',
                    process.env.MISTRAL_API_KEY,
                    'mistral-large-latest',
                    systemPrompt,
                    history,
                    message
                );
                return NextResponse.json({ response });
            } catch (err) {
                lastError = err;
                console.warn('Mistral failed, falling back to OpenRouter...', err instanceof Error ? err.message : '');
            }
        }

        // 4. Try OPENROUTER API
        if (process.env.OPENROUTER_API_KEY) {
            try {
                const response = await callOpenAICompatibleAPI(
                    'https://openrouter.ai/api/v1/chat/completions',
                    process.env.OPENROUTER_API_KEY,
                    'google/gemini-2.0-flash-lite-preview-02-05:free', // Auto routing or fallback
                    systemPrompt,
                    history,
                    message,
                    {
                        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://careervyas.com',
                        'X-Title': 'Career Vyas Assistant'
                    }
                );
                return NextResponse.json({ response });
            } catch (err) {
                lastError = err;
                console.warn('OpenRouter failed, falling back to Gemini SDK...', err instanceof Error ? err.message : '');
            }
        }

        // 5. Try GEMINI API (SDK fallback)
        if (process.env.GEMINI_API_KEY) {
            const models = ['gemini-2.0-flash', 'gemini-1.5-flash'];
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
                    console.warn(`Gemini Model ${modelName} failed, trying next...`, err instanceof Error ? err.message : '');
                    continue;
                }
            }
        }

        // All models failed
        throw lastError || new Error('All models failed. Missing API keys?');
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
