/**
 * Gemini AI Service
 * Uses Google's Gemini 2.0 Flash (free tier: 15 RPM, 1500 RPD)
 * Each user provides their own API key from aistudio.google.com
 */

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

export type ChatMessage = {
    role: 'system' | 'user' | 'assistant';
    content: string;
};

function getApiKey(): string | null {
    return localStorage.getItem('gemini_api_key');
}

export function hasApiKey(): boolean {
    return Boolean(getApiKey());
}

export function saveApiKey(key: string): void {
    localStorage.setItem('gemini_api_key', key.trim());
}

export function clearApiKey(): void {
    localStorage.removeItem('gemini_api_key');
}

export async function chatWithAI(messages: ChatMessage[]): Promise<string> {
    const apiKey = getApiKey();

    if (!apiKey) {
        throw new Error('MISSING_API_KEY');
    }

    // Separate system instruction from conversation messages
    const systemMessages = messages.filter(m => m.role === 'system');
    const chatMessages = messages.filter(m => m.role !== 'system');

    // Build Gemini request body
    const body: any = {
        contents: chatMessages.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        })),
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
        }
    };

    // Add system instruction if present
    if (systemMessages.length > 0) {
        body.systemInstruction = {
            parts: [{ text: systemMessages.map(m => m.content).join('\n') }]
        };
    }

    const url = `${GEMINI_API_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Gemini API full error:', JSON.stringify(errorData, null, 2));
            const error: any = new Error(errorData?.error?.message || `API error ${response.status}`);
            error.status = response.status;
            error.code = errorData?.error?.code;
            error.details = errorData?.error?.details;
            throw error;
        }

        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            throw new Error('No response generated');
        }

        return text;
    } catch (error: any) {
        console.error('Gemini API Error:', error);
        throw error;
    }
}
