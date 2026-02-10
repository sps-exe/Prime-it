import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { auth } from '../../lib/auth';
import { useUserStore } from '../../store/useUserStore';
import { Loader2, User, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export default function SetupProfilePage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [username, setUsername] = useState('');

    const { user, setUser, completeOnboarding } = useUserStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        const trimmed = username.trim();
        if (trimmed.length < 2) {
            setError('Username must be at least 2 characters');
            return;
        }
        if (trimmed.length > 20) {
            setError('Username must be 20 characters or less');
            return;
        }

        setLoading(true);

        try {
            const { data, error } = await auth.updateUserMetadata({
                first_name: trimmed
            });

            if (error) throw error;

            // Update local user state with new metadata
            if (data.user) {
                setUser(data.user);
            }

            completeOnboarding();
            navigate('/dashboard');
        } catch (err: any) {
            console.error('Profile Setup Error:', err);
            setError(err.message || 'Failed to save username');
        } finally {
            setLoading(false);
        }
    };

    // If no user, redirect to auth
    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    return (
        <div className="h-screen w-full flex items-center justify-center bg-[#0a0a0f] text-white overflow-hidden relative">
            {/* Background Blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] bg-pink-600/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="w-full max-w-md z-10 p-8">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 mb-4">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-purple-300 font-medium">Almost there!</span>
                    </div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent mb-2">
                        What should we call you?
                    </h1>
                    <p className="text-gray-400">
                        Pick a display name for your dashboard
                    </p>
                </div>

                <div className="bg-[#13141b] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                                Your Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600 text-lg"
                                    placeholder="Enter your name"
                                    autoFocus
                                    maxLength={20}
                                />
                            </div>
                            <p className="text-xs text-gray-500 ml-1">
                                {username.length}/20 characters
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || username.trim().length < 2}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Let's Go!
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
