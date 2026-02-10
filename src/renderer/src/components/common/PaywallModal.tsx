
import { X, Check, Star, Zap, Infinity, Shield, Loader2 } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useState } from 'react';
import { openCheckout, isPaymentConfigured } from '../../services/payment/lemonsqueezy';
import { useUserStore } from '../../store/useUserStore';

interface PaywallModalProps {
    isOpen: boolean;
    onClose: () => void;
    trigger?: string; // What triggered the paywall (e.g., "AI Coach", "Unlimited History")
}

export function PaywallModal({ isOpen, onClose, trigger }: PaywallModalProps) {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
    const [isLoading, setIsLoading] = useState(false);
    const user = useUserStore((state) => state.user);

    if (!isOpen) return null;

    const handleUpgrade = async () => {
        // Check if payment is configured
        if (!isPaymentConfigured()) {
            alert("Payment integration coming soon! 🚀\n\nWe're finalizing our payment system. Check back soon!");
            return;
        }

        setIsLoading(true);
        try {
            await openCheckout({
                checkoutUrl: import.meta.env.VITE_LEMONSQUEEZY_CHECKOUT_URL || '',
                userEmail: user?.email,
                userId: user?.id
            });
            // Close modal after opening checkout
            onClose();
        } catch (error) {
            console.error('Checkout error:', error);
            alert("Couldn't open checkout. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1a1a20] w-full max-w-4xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row relative animate-in zoom-in-95 duration-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/20 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Left Side - Visual/Value Prop */}
                <div className="w-full md:w-2/5 bg-gradient-to-br from-indigo-600 to-purple-700 p-8 flex flex-col text-white relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative z-10 h-full flex flex-col">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md self-start mb-6 border border-white/10">
                            <Star className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
                            <span className="text-xs font-bold tracking-wide">PREMIUM UPGRADE</span>
                        </div>

                        <h2 className="text-3xl font-bold mb-4 leading-tight">
                            Unlock your full<br />productivity potential.
                        </h2>

                        <p className="text-indigo-100 text-sm leading-relaxed mb-auto opacity-90">
                            {trigger ? `The ${trigger} feature is available exclusively on the Pro plan.` : "Get access to AI insights, unlimited history, and advanced productivity tools."}
                        </p>

                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                                    <Zap className="w-5 h-5 text-yellow-300" />
                                </div>
                                <div>
                                    <div className="font-bold text-sm">AI Coach</div>
                                    <div className="text-xs text-indigo-200">Personalized daily insights</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                                    <Infinity className="w-5 h-5 text-blue-300" />
                                </div>
                                <div>
                                    <div className="font-bold text-sm">Unlimited History</div>
                                    <div className="text-xs text-indigo-200">Access all past sessions</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                                    <Shield className="w-5 h-5 text-emerald-300" />
                                </div>
                                <div>
                                    <div className="font-bold text-sm">Data Backup</div>
                                    <div className="text-xs text-indigo-200">Cloud sync & export</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Pricing & Plans */}
                <div className="w-full md:w-3/5 p-8 bg-[#1a1a20] flex flex-col">
                    <div className="flex items-center justify-center mb-8">
                        <div className="bg-[#25252e] p-1 rounded-xl inline-flex relative">
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${billingCycle === 'monthly' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setBillingCycle('yearly')}
                                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                Yearly <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">-50%</span>
                            </button>
                        </div>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {/* Free Plan */}
                        <div className="border border-white/5 rounded-2xl p-5 bg-white/5 opacity-60 hover:opacity-100 transition-opacity cursor-default">
                            <div className="text-sm font-medium text-gray-400 mb-1">Starter</div>
                            <div className="text-2xl font-bold text-white mb-4">$0 <span className="text-xs font-normal text-gray-500">/ forever</span></div>
                            <ul className="space-y-2 text-xs text-gray-400">
                                <li className="flex items-center gap-2"><Check className="w-3 h-3 text-gray-500" /> Core Task Management</li>
                                <li className="flex items-center gap-2"><Check className="w-3 h-3 text-gray-500" /> Basic Pomodoro Timer</li>
                                <li className="flex items-center gap-2"><Check className="w-3 h-3 text-gray-500" /> 7-Day History</li>
                            </ul>
                        </div>

                        {/* Pro Plan */}
                        <div className="border-2 border-indigo-500/50 rounded-2xl p-5 bg-indigo-500/5 relative overflow-hidden group hover:border-indigo-500 transition-colors">
                            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">RECOMMENDED</div>
                            <div className="text-sm font-medium text-indigo-300 mb-1">Professional</div>
                            <div className="text-2xl font-bold text-white mb-1">
                                {billingCycle === 'yearly' ? '$2.49' : '$4.99'}
                                <span className="text-xs font-normal text-gray-500">/ mo</span>
                            </div>
                            <div className="text-[10px] text-gray-500 mb-4">
                                {billingCycle === 'yearly' ? 'Billed $29.99 yearly' : 'Billed monthly'}
                            </div>
                            <ul className="space-y-2 text-xs text-gray-300">
                                <li className="flex items-center gap-2"><Check className="w-3 h-3 text-emerald-400" /> Everything in Starter</li>
                                <li className="flex items-center gap-2"><Check className="w-3 h-3 text-emerald-400" /> AI Productivity Coach</li>
                                <li className="flex items-center gap-2"><Check className="w-3 h-3 text-emerald-400" /> Unlimited History</li>
                                <li className="flex items-center gap-2"><Check className="w-3 h-3 text-emerald-400" /> Advanced Analytics</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <button
                            onClick={handleUpgrade}
                            disabled={isLoading}
                            className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base shadow-lg shadow-indigo-500/25 transition-all transform active:scale-95 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Opening checkout...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-4 h-4 fill-white" />
                                    {billingCycle === 'yearly' ? 'Start Annual Plan' : 'Start Monthly Plan'}
                                </>
                            )}
                        </button>
                        <p className="text-center text-[10px] text-gray-500 mt-3">
                            Secure payment via LemonSqueezy. Cancel anytime.
                            <button className="text-gray-400 hover:text-white underline ml-1">Restore Purchases</button>
                        </p>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
