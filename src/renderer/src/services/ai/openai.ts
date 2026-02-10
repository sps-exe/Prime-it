
import OpenAI from 'openai';

// Initialize OpenAI client dynamically to support runtime key updates
export const getOpenAIClient = () => {
    // Check both environment variable and local storage
    const apiKey = localStorage.getItem('openai_api_key') || import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) return null;

    return new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
    });
};

export type ChatMessage = {
    role: 'system' | 'user' | 'assistant';
    content: string;
};

export async function chatWithAI(messages: ChatMessage[], model = 'gpt-4o-mini') {
    const client = getOpenAIClient();

    if (!client) {
        throw new Error('MISSING_API_KEY');
    }

    try {
        const response = await client.chat.completions.create({
            model: model,
            messages: messages,
            temperature: 0.7,
            max_tokens: 1000,
        });

        return response.choices[0]?.message?.content || "I couldn't generate a response.";
    } catch (error) {
        console.error('OpenAI API Error:', error);
        throw error;
    }
}
