import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SERVICE_ROLE_KEY") ?? ""
)

Deno.serve(async (req) => {
    try {
        if (req.method !== "POST") {
            return new Response("Method not allowed", { status: 405 });
        }

        const secret = Deno.env.get("LEMONSQUEEZY_WEBHOOK_SECRET");
        if (!secret) {
            console.error("LEMONSQUEEZY_WEBHOOK_SECRET not set");
            return new Response("Server misconfiguration", { status: 500 });
        }

        const signature = req.headers.get("x-signature");
        if (!signature) {
            return new Response("No signature", { status: 401 });
        }

        // Clone the request to read body text for verification AND json for processing
        const clonedReq = req.clone();
        const bodyText = await clonedReq.text();

        // Verify Signature
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            "raw",
            encoder.encode(secret),
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["verify"]
        );

        const verified = await crypto.subtle.verify(
            "HMAC",
            key,
            hexToUint8Array(signature),
            encoder.encode(bodyText)
        );

        if (!verified) {
            console.error("Invalid signature");
            return new Response("Invalid signature", { status: 401 });
        }

        console.log("Signature verified successfully");

        // Parse JSON from the original request (or the verified text)
        const payload = JSON.parse(bodyText);
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

// Helper to convert hex string to Uint8Array for crypto.verify
function hexToUint8Array(hexString: string) {
    return new Uint8Array(hexString.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
}
