// DashboardHeader component
import { useUserStore } from '../../store/useUserStore';
import { useTaskStore } from '../../store/useTaskStore';
import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { PaywallModal } from '../common/PaywallModal';
import { PremiumBadge } from '../common/PremiumBadge';

// Level thresholds (must match store)
const LEVEL_THRESHOLDS = [
    0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200,  // 1-10
    4000, 5000, 6200, 7600, 9200, 11000, 13000, 15200, 17600, 20250  // 11-20
];

export function DashboardHeader() {
    const user = useUserStore((state) => state.user);
    const firstName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Friend';
    const xp = useTaskStore((state) => state.xp);
    const level = useTaskStore((state) => state.level);
    const isPremium = useTaskStore((state) => state.isPremium());
    const [greeting, setGreeting] = useState('');
    const [isPaywallOpen, setIsPaywallOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, []);

    // Calculate XP progress to next level
    const currentLevelXp = LEVEL_THRESHOLDS[level - 1] || 0;
    const nextLevelXp = LEVEL_THRESHOLDS[level] || currentLevelXp + 1000;
    const xpProgress = Math.min(100, ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100);
    const xpToNext = nextLevelXp - xp;

    // Fallback if name is missing
    const displayName = firstName ? firstName : 'User';

    return (
        <>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        {greeting}, {displayName}
                    </h1>
                    <p className="text-gray-500 font-medium flex items-center gap-2 text-sm mt-1">
                        Ready for a productive day? <span className="text-purple-400">🚀</span>
                        {isPremium && <PremiumBadge />}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* XP / Level Badge */}
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl px-5 py-2.5 flex items-center gap-3 h-11">
                        <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/30">
                            {level}
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                                <Star className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" />
                                <span className="text-white text-sm font-bold">{xp.toLocaleString()} XP</span>
                            </div>
                            <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden mt-0.5">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-500"
                                    style={{ width: `${xpProgress}%` }}
                                />
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium">{xpToNext} XP to Lvl {level + 1}</span>
                        </div>
                    </div>

                    {/* Upgrade Button - Only show if NOT premium */}
                    {!isPremium && (
                        <button
                            onClick={() => setIsPaywallOpen(true)}
                            className="h-11 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-sm font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95"
                        >
                            <span>👑</span>
                            <span>Upgrade</span>
                        </button>
                    )}

                    {/* Settings Button */}
                    <button
                        onClick={() => window.location.hash = '#/settings'}
                        className="w-11 h-11 rounded-xl bg-[#2a2a35] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-purple-500/30 transition-all"
                        title="Settings"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>

                    {/* Profile Avatar & Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-base font-bold shadow-lg shadow-purple-500/30 hover:scale-105 transition-all ring-2 ring-purple-500/30 ring-offset-2 ring-offset-[#0f0f13]"
                            title="Profile"
                        >
                            {displayName.charAt(0).toUpperCase()}
                        </button>

                        {/* Dropdown Menu */}
                        {isProfileOpen && (
                            <div className="absolute top-14 right-0 w-48 bg-[#1e1e24] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl">
                                <div className="p-3 border-b border-white/5">
                                    <p className="text-sm font-bold text-white truncate">{displayName}</p>
                                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                                </div>
                                <div className="p-1">
                                    <button
                                        type="button"
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            console.log('Logout button clicked!');

                                            try {
                                                const { auth } = await import('../../lib/auth');
                                                await auth.fullSignOut();
                                                setTimeout(() => {
                                                    window.location.reload();
                                                }, 200);
                                            } catch (err) {
                                                console.error('Failed to sign out:', err);
                                            }
                                        }}
                                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                                    >
                                        <span>Log Out</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <PaywallModal
                isOpen={isPaywallOpen}
                onClose={() => setIsPaywallOpen(false)}
            />
        </>
    );
}
