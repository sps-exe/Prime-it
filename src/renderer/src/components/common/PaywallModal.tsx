
import { X, Check, Star, Shield, Loader2 } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useState } from 'react';
import { useUserStore } from '../../store/useUserStore';
import QRCode from 'react-qr-code';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface PaywallModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [licenseKey, setLicenseKey] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const user = useUserStore((state) => state.user);

    if (!isOpen) return null;

    const handleVerifyKey = async () => {
        if (!licenseKey.trim()) {
            setError('Please enter a license key');
            return;
        }

        setIsLoading(true);
        setError('');
        console.log('[License] Starting verification for key:', licenseKey.trim());

        const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
        const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

        // Get the current session token (if available)
        let accessToken = SUPABASE_KEY; // fallback to anon key
        try {
            const { data: sessionData } = await Promise.race([
                supabase.auth.getSession(),
                new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
            ]);
            if (sessionData?.session?.access_token) {
                accessToken = sessionData.session.access_token;
                console.log('[License] Using user session token');
            } else {
                console.log('[License] No session, using anon key');
            }
        } catch {
            console.log('[License] Session fetch timed out, using anon key');
        }

        const headers: Record<string, string> = {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        };

        try {
            // 1. Check if key exists and is active
            console.log('[License] Step 1: Checking key via REST...');
            const queryUrl = `${SUPABASE_URL}/rest/v1/license_keys?select=key,status&key=eq.${encodeURIComponent(licenseKey.trim())}`;
            console.log('[License] Query URL:', queryUrl);
            const checkRes = await fetch(queryUrl, { headers });
            const rawText = await checkRes.text();
            console.log('[License] Step 1 raw response:', checkRes.status, rawText);

            let keys: any[] = [];
            try { keys = JSON.parse(rawText); } catch { keys = []; }
            console.log('[License] Step 1 parsed:', keys);

            if (!keys || keys.length === 0) {
                setError('Invalid license key');
                setIsLoading(false);
                return;
            }

            if (keys[0].status !== 'active') {
                setError('This license key has already been used');
                setIsLoading(false);
                return;
            }

            // 2+3. Claim key AND grant subscription via RPC (bypasses RLS)
            console.log('[License] Step 2: Claiming key via RPC...');
            const rpcRes = await fetch(
                `${SUPABASE_URL}/rest/v1/rpc/claim_license_key`,
                {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        p_key: licenseKey.trim(),
                        p_user_id: user?.id
                    })
                }
            );
            const rpcResult = await rpcRes.text();
            console.log('[License] Step 2 RPC result:', rpcRes.status, rpcResult);

            if (!rpcRes.ok) {
                console.error('[License] RPC error:', rpcResult);
                setError('Error claiming key. Please try again.');
                setIsLoading(false);
                return;
            }

            if (rpcResult === 'false') {
                setError('Key could not be claimed. It may have already been used.');
                setIsLoading(false);
                return;
            }

            console.log('[License] SUCCESS!');
            setSuccess(true);
            setTimeout(() => {
                onClose();
                window.location.reload();
            }, 2000);

        } catch (e) {
            console.error('[License] Unexpected error:', e);
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const upiId = import.meta.env.VITE_UPI_ID || 'your-upi@okaxis';
    const payeeName = import.meta.env.VITE_PAYEE_NAME || 'Prime-it';
    const amount = '399'; // Example fixed amount in INR
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`;

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

                {/* Left Side - Visual */}
                <div className="w-full md:w-2/5 bg-gradient-to-br from-indigo-600 to-purple-700 p-8 flex flex-col text-white relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative z-10 h-full flex flex-col">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md self-start mb-6 border border-white/10">
                            <Star className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
                            <span className="text-xs font-bold tracking-wide">LIFETIME ACCESS</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-4 leading-tight">
                            One payment.<br />Forever access.
                        </h2>
                        <p className="text-indigo-100 text-sm leading-relaxed mb-8 opacity-90">
                            Unlock AI coaching, unlimited history, and cloud sync with a single purchase.
                        </p>

                        <div className="mt-auto bg-white/10 rounded-xl p-4 backdrop-blur-md border border-white/10">
                            <div className="flex items-center gap-2 mb-2 text-sm font-bold">
                                <Shield className="w-4 h-4 text-emerald-300" />
                                100% Secure
                            </div>
                            <p className="text-xs text-indigo-100 opacity-80">
                                Direct payment via your trusted UPI app. No subscription fees.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Manual Payment */}
                <div className="w-full md:w-3/5 p-8 bg-[#1a1a20] flex flex-col">

                    {success ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                                <Check className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Upgrade Successful!</h3>
                            <p className="text-gray-400">Welcome to Prime-it Pro. Refreshing...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full">
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold text-white">Scan to Upgrade</h3>
                                <p className="text-gray-400 text-sm mt-1">Pay ₹{amount} via any UPI App</p>
                            </div>

                            <div className="flex flex-col md:flex-row gap-8 items-center justify-center flex-1">
                                {/* QR Code */}
                                <div className="bg-white p-3 rounded-xl shadow-lg shrink-0">
                                    <QRCode
                                        value={upiUrl}
                                        size={160}
                                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                        viewBox={`0 0 256 256`}
                                    />
                                    <div className="text-center mt-2 text-black font-bold text-xs">
                                        ₹{amount}
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="hidden md:flex h-32 w-px bg-white/10"></div>

                                {/* Manual Activation */}
                                <div className="bg-white/5 p-3 rounded-lg border border-white/10 text-xs text-gray-400 space-y-2 mb-4">
                                    <p className="font-bold text-white mb-1">📝 Next Steps:</p>
                                    <ol className="list-decimal list-inside space-y-1">
                                        <li>Scan & Pay ₹{amount} via UPI</li>
                                        <li>Take a screenshot of payment</li>
                                        <li>Email it to <span className="text-indigo-400 font-medium select-all">sps2962007@gmail.com</span></li>
                                        <li>You'll receive a License Key shortly!</li>
                                    </ol>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-gray-400 mb-1.5 block">
                                        Enter License Key
                                    </label>
                                    <Input
                                        placeholder="PRO-XXXX-XXXX"
                                        value={licenseKey}
                                        onChange={(e) => setLicenseKey(e.target.value)}
                                        className="bg-black/30 border-white/10 focus:border-indigo-500 font-mono text-center uppercase tracking-widest"
                                    />
                                </div>

                                {error && (
                                    <div className="text-red-400 text-xs text-center bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                                        {error}
                                    </div>
                                )}

                                <Button
                                    onClick={handleVerifyKey}
                                    disabled={isLoading || !licenseKey}
                                    className="w-full bg-indigo-600 hover:bg-indigo-500"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Activate License'}
                                </Button>


                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
