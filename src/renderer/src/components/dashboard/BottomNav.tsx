import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BarChart3, Sparkles, Lock } from 'lucide-react';
import { useState } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { PaywallModal } from '../common/PaywallModal';

export function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();
    const isPremium = useTaskStore((state) => state.isPremium());
    const [isPaywallOpen, setIsPaywallOpen] = useState(false);

    const isHome = location.pathname === '/dashboard';
    const isReports = location.pathname === '/reports';

    const handleAIClick = () => {
        if (!isPremium) {
            setIsPaywallOpen(true);
        } else {
            navigate('/ai');
        }
    };

    return (
        <>
            <div className="bg-[#0f0f13]/80 backdrop-blur-md border border-purple-500/30 rounded-full px-8 py-3 flex items-center gap-8 shadow-2xl z-50">
                <button
                    onClick={() => navigate('/dashboard')}
                    className={`flex items-center gap-2 font-medium transition-all duration-300 ${isHome
                        ? 'text-white scale-105'
                        : 'text-gray-400 hover:text-white hover:scale-110 hover:text-purple-300'
                        }`}
                >
                    <Home className={`w-4 h-4 transition-all duration-300 ${!isHome ? 'group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]' : ''}`} />
                    Home
                </button>
                <button
                    onClick={() => navigate('/reports')}
                    className={`flex items-center gap-2 font-medium transition-all duration-300 ${isReports
                        ? 'text-white scale-105'
                        : 'text-gray-400 hover:text-white hover:scale-110 hover:text-purple-300'
                        }`}
                >
                    <BarChart3 className="w-4 h-4 transition-all duration-300" />
                    Reports
                </button>
                <div className="w-px h-6 bg-gray-700 mx-2"></div>

                <button
                    onClick={handleAIClick}
                    className="relative bg-[#2a2a35] text-white px-4 py-1.5 rounded-lg border border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/20 hover:scale-105 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all duration-300 font-medium flex items-center gap-2 group"
                >
                    {!isPremium && (
                        <div className="absolute -top-2 -right-2 bg-amber-500 text-black rounded-full p-0.5 shadow-sm z-10">
                            <Lock className="w-2.5 h-2.5" />
                        </div>
                    )}
                    <Sparkles className="w-4 h-4" />
                    AI
                </button>
            </div>

            <PaywallModal
                isOpen={isPaywallOpen}
                onClose={() => setIsPaywallOpen(false)}
            />
        </>
    );
}
