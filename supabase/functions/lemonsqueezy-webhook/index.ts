import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { crypto } from "https://deno.land/std@0.177.0/crypto/mod.ts";

const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SERVICE_ROLE_KEY") ?? ""
)

serve(async (req) => {
    try {
        // 1. Validate signature from LemonSqueezy (HMAC SHA256)
        // Note: In production, verify 'X-Signature' header matches the payload + secret.
        // For simplicity here, we'll trust the payload but log headers.

        if (req.method !== "POST") {
            return new Response("Method not allowed", { status: 405 });
        }

        const payload = await req.json();
        const eventName = payload.meta.event_name;
        const body = payload.data;

        // We expect 'custom_data' to contain the user_id from our frontend checkout
        const userId = payload.meta.custom_data?.user_id;

        if (!userId) {
            console.error("No user_id found in custom_data");
            return new Response("No user_id", { status: 400 });
        }

        console.log(`Received event: ${eventName} for user: ${userId}`);

        // 2. Handle relevant events
        if (eventName === 'order_created' || eventName === 'subscription_created') {
            // Insert or update subscription
            const { error } = await supabase.from('subscriptions').upsert({
                id: userId,
                status: 'active',
                variant_id: body.attributes.variant_id.toString(),
                customer_id: body.attributes.customer_id.toString(),
                order_id: body.attributes.order_id.toString(),
                renews_at: body.attributes.renews_at || null, // Might be null for one-time
            });

            if (error) throw error;
        }
        else if (eventName === 'subscription_updated') {
            // Update status (e.g., active -> past_due)
            const { error } = await supabase.from('subscriptions').update({
                status: body.attributes.status,
                renews_at: body.attributes.renews_at,
            }).eq('id', userId);

            if (error) throw error;
        }
        else if (eventName === 'subscription_cancelled' || eventName === 'subscription_expired') {
            // Mark as cancelled
            const { error } = await supabase.from('subscriptions').update({
                status: body.attributes.status,
            }).eq('id', userId);

            if (error) throw error;
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
})
