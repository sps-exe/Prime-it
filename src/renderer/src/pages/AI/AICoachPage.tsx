
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Sparkles, Bot, User, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { chatWithAI, ChatMessage } from '../../services/ai/openai';
import { gatherUserContext } from '../../services/ai/context';

export default function AICoachPage() {
    const navigate = useNavigate();
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initial greeting
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                {
                    role: 'assistant',
                    content: "Hi! I'm your AI productivity coach. I can help you plan your day, break down tasks, or just give you a motivation boost. What's on your mind?"
                }
            ]);
        }
    }, [messages.length]);

    const [showKeyInput, setShowKeyInput] = useState(false);
    const [apiKeyInput, setApiKeyInput] = useState('');

    const handleSaveKey = () => {
        if (apiKeyInput.trim().startsWith('sk-')) {
            localStorage.setItem('openai_api_key', apiKeyInput.trim());
            setShowKeyInput(false);
            setApiKeyInput('');
            // Retry the connection message
            setMessages(prev => [...prev, { role: 'assistant', content: "✅ Key saved! I'm ready to help. What's the plan?" }]);
        } else {
            alert("That doesn't look like a valid OpenAI key (starts with sk-...)");
        }
    };

    const handleSend = async (text: string = input) => {
        if (!text.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', content: text };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Context injection
            const context = gatherUserContext();
            const systemMessage: ChatMessage = {
                role: 'system',
                content: `You are an expert productivity coach named 'Prime'.
                ${context}
                Keep responses under 3 sentences unless asked for a detailed plan. Use emojis.`
            };

            const history = messages.map(m => ({ role: m.role, content: m.content }));
            const response = await chatWithAI([systemMessage, ...history, userMessage]);

            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        } catch (error: any) {
            console.error('Chat Error:', error);
            if (error.message === 'MISSING_API_KEY' || error.status === 401) {
                setMessages(prev => [...prev, { role: 'assistant', content: "🔒 I need an OpenAI API key to function." }]);
                setShowKeyInput(true);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ Something went wrong. Please try again." }]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const QuickPrompts = [
        { label: "📅 Plan my day", prompt: "Based on my pending tasks, suggest a schedule for today." },
        { label: "🔨 Break down current task", prompt: "Help me break down my top priority task into smaller steps." },
        { label: "🚀 Motivation boost", prompt: "I'm feeling stuck. Give me a quick motivation boost based on my streak." },
    ];

    return (
        <div className="h-full w-full bg-[#0a0a0f] text-white flex flex-col rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0a0a0f]/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-white uppercase tracking-wider transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-sm font-bold">AI Coach</h1>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] text-emerald-400 font-medium">Online</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {msg.role === 'assistant' && (
                            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 border border-purple-500/30">
                                <Bot className="w-4 h-4 text-purple-400" />
                            </div>
                        )}
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user'
                                ? 'bg-blue-600 text-white rounded-tr-none'
                                : 'bg-[#1E2028] text-gray-200 border border-white/5 rounded-tl-none'
                                }`}
                        >
                            {msg.content}
                        </div>
                        {msg.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 border border-blue-500/30">
                                <User className="w-4 h-4 text-blue-400" />
                            </div>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 border border-purple-500/30">
                            <Bot className="w-4 h-4 text-purple-400" />
                        </div>
                        <div className="bg-[#1E2028] rounded-2xl rounded-tl-none px-4 py-3 border border-white/5 flex items-center gap-2">
                            <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                            <span className="text-xs text-gray-500">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#0a0a0f] border-t border-white/5">
                {/* Quick Prompts */}
                {messages.length < 3 && (
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                        {QuickPrompts.map((qp, i) => (
                            <button
                                key={i}
                                onClick={() => handleSend(qp.prompt)}
                                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-[#1E2028] border border-white/10 text-xs text-gray-400 hover:text-white hover:border-purple-500/50 hover:bg-purple-500/10 transition-all flex items-center gap-1.5"
                            >
                                <Sparkles className="w-3 h-3 text-purple-400" />
                                {qp.label}
                            </button>
                        ))}
                    </div>
                )}

                <div className="relative flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask your coach anything..."
                        className="w-full bg-[#1E2028] border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <div className="text-center mt-2">
                    <p className="text-[10px] text-gray-600">
                        AI can make mistakes. Review generated plans.
                    </p>
                </div>
            </div>

            {/* API Key Modal */}
            {showKeyInput && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                    <div className="bg-[#1E2028] border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Connect AI Coach</h3>
                                <p className="text-xs text-gray-400">One-time setup to enable AI features</p>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="bg-black/20 rounded-xl p-4 mb-4 text-xs text-gray-300 space-y-2">
                            <p className="font-medium text-white">How to get your API key:</p>
                            <ol className="list-decimal list-inside space-y-1 text-gray-400">
                                <li>Go to <button onClick={() => (window as any).ipcRenderer?.invoke('open-external', 'https://platform.openai.com/api-keys')} className="text-emerald-400 hover:underline">platform.openai.com/api-keys</button></li>
                                <li>Create an account or sign in</li>
                                <li>Click "Create new secret key"</li>
                                <li>Copy and paste it below</li>
                            </ol>
                        </div>

                        <input
                            type="password"
                            placeholder="sk-..."
                            value={apiKeyInput}
                            onChange={(e) => setApiKeyInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveKey()}
                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white mb-4 focus:border-emerald-500/50 focus:outline-none"
                        />

                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowKeyInput(false)}
                                className="flex-1 py-2.5 rounded-xl text-xs font-medium text-gray-400 hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveKey}
                                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
                            >
                                Connect Coach
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-600 text-center mt-4">
                            🔒 Your key is stored locally on your device and never sent to our servers.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
