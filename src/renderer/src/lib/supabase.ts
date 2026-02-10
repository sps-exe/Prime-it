
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logging - remove in production
console.log('[Supabase] URL:', supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'MISSING');
console.log('[Supabase] Key:', supabaseAnonKey ? 'Present (' + supabaseAnonKey.length + ' chars)' : 'MISSING');

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[Supabase] ERROR: Missing Supabase credentials. Auth will not work.');
    console.error('[Supabase] Make sure .env file exists with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

// Create client - throw a more helpful error if credentials are missing
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : (() => {
        console.error('[Supabase] Using placeholder client - auth WILL fail');
        return createClient('https://placeholder.supabase.co', 'placeholder');
    })();
