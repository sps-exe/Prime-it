
import { useState, useEffect } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { useTaskStore } from '../../store/useTaskStore';
import { User, Monitor, LogOut, Key, Download, Zap, Database } from 'lucide-react';
import { PaywallModal } from '../../components/common/PaywallModal';

export default function SettingsPage() {
    const { user } = useUserStore();
    const { isPremium } = useTaskStore();
    const [apiKey, setApiKey] = useState('');
    const [isPaywallOpen, setIsPaywallOpen] = useState(false);

    // Load API key on mount
    useEffect(() => {
        const storedKey = localStorage.getItem('openai_api_key');
        if (storedKey) setApiKey(storedKey);
    }, []);

    const handleSaveKey = () => {
        if (apiKey.trim().startsWith('sk-')) {
            localStorage.setItem('openai_api_key', apiKey.trim());
            alert('API Key saved successfully!');
        } else {
            alert('Invalid API key format');
        }
    };

    const handleExportData = () => {
        if (!isPremium()) {
            setIsPaywallOpen(true);
            return;
        }

        const data = {
            tasks: useTaskStore.getState().tasks,
            sessions: useTaskStore.getState().sessions,
            dailyFocusHistory: useTaskStore.getState().dailyFocusHistory,
            xp: useTaskStore.getState().xp
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `prime-it-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleLogout = async () => {
        try {
            const { auth } = await import('../../lib/auth');
            await auth.fullSignOut();
            window.location.reload();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold mb-8">Settings</h1>

            {/* Profile Section */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-400" /> Account
                </h2>
                <div className="bg-[#1a1a20] rounded-2xl border border-white/5 p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl font-bold">
                            {user?.email?.[0].toUpperCase()}
                        </div>
                        <div>
                            <div className="font-bold text-lg">{user?.user_metadata?.first_name || 'User'}</div>
                            <div className="text-gray-400 text-sm">{user?.email}</div>
                            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium">
                                {isPremium() ? (
                                    <>
                                        <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                        <span className="text-yellow-100">Pro Plan</span>
                                    </>
                                ) : (
                                    <span className="text-gray-400">Free Plan</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {!isPremium() && (
                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex items-center justify-between">
                            <div>
                                <div className="font-medium text-indigo-300">Upgrade to Pro</div>
                                <div className="text-sm text-indigo-200/60">Unlock AI Coach, Unlimited History & Data Export</div>
                            </div>
                            <button
                                onClick={() => setIsPaywallOpen(true)}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-colors"
                            >
                                Upgrade
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* AI Settings */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-emerald-400" /> Intelligence
                </h2>
                <div className="bg-[#1a1a20] rounded-2xl border border-white/5 p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-300 mb-2">OpenAI API Key</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="password"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        placeholder="sk-..."
                                        className="w-full bg-black/30 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:border-emerald-500/50 focus:outline-none"
                                    />
                                </div>
                                <button
                                    onClick={handleSaveKey}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Save
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Required for AI Coach. stored locally.
                                <button onClick={() => window.open('https://platform.openai.com/api-keys', '_blank')} className="text-emerald-400 hover:underline ml-1">Get key</button>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Data Management */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Database className="w-5 h-5 text-blue-400" /> Data Management
                </h2>
                <div className="bg-[#1a1a20] rounded-2xl border border-white/5 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium text-white">Export Data</div>
                            <div className="text-sm text-gray-400">Download all your tasks and history as JSON</div>
                        </div>
                        <button
                            onClick={handleExportData}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>
            </section>

            <div className="flex justify-center mt-12 mb-8">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm font-medium px-4 py-2 hover:bg-red-500/10 rounded-lg"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>

            <div className="text-center text-xs text-gray-600">
                v1.0.0 • Made with ❤️ by Blitz it
            </div>

            <PaywallModal
                isOpen={isPaywallOpen}
                onClose={() => setIsPaywallOpen(false)}
                trigger="Export Data"
            />
        </div>
    );
}
