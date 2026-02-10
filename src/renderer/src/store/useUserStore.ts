
import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { User, Session } from '@supabase/supabase-js';

interface UserState {
    isOnboarded: boolean;
    _hasHydrated: boolean;

    // Supabase Auth
    user: User | null;
    session: Session | null;
    profile: {
        tier: 'free' | 'pro' | 'lifetime';
        email: string;
    } | null;

    setUser: (user: User | null) => void;
    setSession: (session: Session | null) => void;
    setProfile: (profile: { tier: 'free' | 'pro' | 'lifetime', email: string } | null) => void;
    completeOnboarding: () => void;
    logout: () => void;
    setHasHydrated: (state: boolean) => void;
}

// Custom storage utilizing Electron's IPC
const storage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
        try {
            const value = await (window as any).ipcRenderer.getStoreValue(name);
            return value ? JSON.stringify(value) : null;
        } catch (e) {
            console.error('Storage Get Error', e);
            return null;
        }
    },
    setItem: async (name: string, value: string): Promise<void> => {
        try {
            const parsed = JSON.parse(value);
            await (window as any).ipcRenderer.setStoreValue(name, parsed);
        } catch (e) {
            console.error('Storage Set Error', e);
        }
    },
    removeItem: async (name: string): Promise<void> => {
        await (window as any).ipcRenderer.setStoreValue(name, undefined);
    },
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            isOnboarded: false,
            _hasHydrated: false,
            user: null,
            session: null,
            profile: null,

            setUser: (user) => set({ user }),
            setSession: (session) => set({ session }),
            setProfile: (profile) => set({ profile }),
            completeOnboarding: () => set({ isOnboarded: true }),
            logout: () => set({
                isOnboarded: false,
                user: null,
                session: null,
                profile: null
            }),
            setHasHydrated: (state) => set({ _hasHydrated: state }),
        }),
        {
            name: 'prime-it-user-storage',
            storage: createJSONStorage(() => storage),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);
