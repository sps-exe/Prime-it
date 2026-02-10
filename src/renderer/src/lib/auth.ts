
import { supabase } from './supabase';

export const auth = {
    // Sign up with email and password
    signUp: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        return { data, error };
    },

    // Sign in with email and password
    signIn: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    },

    // Sign out
    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        return { error };
    },

    // Get current session
    getSession: async () => {
        const { data, error } = await supabase.auth.getSession();
        return { session: data.session, error };
    },

    // Get current user
    getUser: async () => {
        const { data, error } = await supabase.auth.getUser();
        return { user: data.user, error };
    },

    // Update user metadata (e.g., first_name)
    updateUserMetadata: async (metadata: { first_name?: string }) => {
        const { data, error } = await supabase.auth.updateUser({
            data: metadata
        });
        return { data, error };
    },

    // Complete Sign Out (Supabase + Local State)
    fullSignOut: async () => {
        try {
            // 1. Supabase Sign Out
            await supabase.auth.signOut();

            // 2. Clear User Store Persistence
            await (window as any).ipcRenderer?.invoke('set-store-value', 'prime-it-user-storage', undefined);

            // 3. Reset Stores (Dynamically imported to avoid circular deps)
            const { useUserStore } = await import('../store/useUserStore');
            useUserStore.getState().logout();

            const { useTaskStore } = await import('../store/useTaskStore');
            useTaskStore.getState().setTier('free');

            return { error: null };
        } catch (error) {
            console.error('Full Sign Out Error:', error);
            return { error };
        }
    }
};
