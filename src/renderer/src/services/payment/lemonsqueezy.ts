/**
 * Payment Service for LemonSqueezy Integration
 * 
 * LemonSqueezy is recommended for Electron apps because it:
 * - Handles EU VAT automatically
 * - Works well with desktop apps
 * - Provides license key management
 * 
 * Setup Instructions:
 * 1. Create account at https://lemonsqueezy.com
 * 2. Create a product with your pricing
 * 3. Get your checkout URL from the product page
 * 4. Add VITE_LEMONSQUEEZY_CHECKOUT_URL to your .env file
 */

// Configuration - Replace with your LemonSqueezy checkout URL
const MONTHLY_URL = import.meta.env.VITE_LEMONSQUEEZY_MONTHLY_URL || '';
const YEARLY_URL = import.meta.env.VITE_LEMONSQUEEZY_YEARLY_URL || '';
const CHECKOUT_URL = MONTHLY_URL || YEARLY_URL; // Fallback for legacy checks

export interface PaymentConfig {
    checkoutUrl: string;
    userEmail?: string;
    userId?: string;
}

/**
 * Opens LemonSqueezy checkout in external browser
 * Prefills email if user is logged in
 */
export async function openCheckout(config: PaymentConfig): Promise<void> {
    const { checkoutUrl, userEmail, userId } = config;

    if (!checkoutUrl) {
        console.error('LemonSqueezy checkout URL not configured');
        throw new Error('CHECKOUT_NOT_CONFIGURED');
    }

    // Build checkout URL with prefilled data
    const url = new URL(checkoutUrl);

    // Prefill email if available
    if (userEmail) {
        url.searchParams.set('checkout[email]', userEmail);
    }

    // Pass user ID for webhook identification
    if (userId) {
        url.searchParams.set('checkout[custom][user_id]', userId);
    }

    // Open in external browser (Electron shell)
    if (typeof window !== 'undefined' && (window as any).ipcRenderer) {
        // Electron: use shell.openExternal
        await (window as any).ipcRenderer.invoke('open-external', url.toString());
    } else {
        // Fallback: open in new tab
        window.open(url.toString(), '_blank');
    }
}

/**
 * Check if payment is configured
 */
export function isPaymentConfigured(): boolean {
    return Boolean(CHECKOUT_URL);
}

/**
 * Get the checkout URL for display
 */
export function getCheckoutUrl(): string {
    return CHECKOUT_URL;
}

import { supabase } from '../../lib/supabase';

/**
 * Verify subscription status from Supabase
 * Uses direct REST API to avoid Supabase JS client session timeout issues
 */
export async function verifySubscription(userId: string): Promise<'free' | 'pro' | 'lifetime'> {
    console.log('[Payment] Checking subscription for user:', userId);

    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

    // Try to get user's access token, with timeout
    let accessToken = SUPABASE_KEY;
    try {
        const { data: sessionData } = await Promise.race([
            supabase.auth.getSession(),
            new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
        ]);
        if (sessionData?.session?.access_token) {
            accessToken = sessionData.session.access_token;
        }
    } catch {
        console.log('[Payment] Session timeout, using anon key');
    }

    try {
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/rpc/check_subscription`,
            {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ p_user_id: userId })
            }
        );

        if (!res.ok) {
            console.log('[Payment] Subscription check returned:', res.status);
            return 'free';
        }

        const data = await res.json();
        console.log('[Payment] Subscription data:', data);

        if (data && data.status === 'active') {
            if (data.variant_id === 'lifetime_license') {
                return 'lifetime';
            }
            return 'pro';
        }

        return 'free';

    } catch (e) {
        console.error('[Payment] Unexpected error checking subscription:', e);
        return 'free';
    }
}
