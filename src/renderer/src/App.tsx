import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { OnboardingLayout } from './layouts/OnboardingLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import WelcomePage from './pages/Onboarding/WelcomePage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import ReportsPage from './pages/Reports/ReportsPage';
import AICoachPage from './pages/AI/AICoachPage';
import AuthPage from './pages/Onboarding/AuthPage';
import SetupProfilePage from './pages/Onboarding/SetupProfilePage';
import SettingsPage from './pages/Settings/SettingsPage';
import { OverlayLayout } from './layouts/OverlayLayout';
import FocusModePage from './pages/Overlay/FocusModePage';
import { useUserStore } from './store/useUserStore';
import { supabase } from './lib/supabase';

import { UpdateNotification } from './components/UpdateNotification';

function App() {
  const { isOnboarded, setUser, setSession, completeOnboarding } = useUserStore();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Helper to sync subscription status
  const syncSubscription = async (user: any) => {
    try {
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('id', user.id)
        .single();

      const isPro = subscription?.status === 'active';
      console.log(`[App] Syncing subscription for ${user.email}: ${isPro ? 'PRO' : 'FREE'}`);

      const { setProfile } = useUserStore.getState(); // Access store directly to avoid stale closures if needed
      setProfile({
        email: user.email,
        tier: isPro ? 'pro' : 'free'
      });

      // Sync to TaskStore (which controls UI features)
      // We import dynamically to avoid circular dependencies if any, though here it's fine
      const { setTier } = await import('./store/useTaskStore').then(m => m.useTaskStore.getState());
      setTier(isPro ? 'pro' : 'free');

    } catch (e) {
      console.error('[App] Error syncing subscription:', e);
    }
  };

  // Check for existing Supabase session on app load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          console.log('[App] Found existing session, auto-logging in...');
          setUser(session.user);
          setSession(session);
          await syncSubscription(session.user); // Sync sub
          completeOnboarding();
        }
      } catch (error) {
        console.error('[App] Error checking session:', error);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();

    // Listen for auth state changes (e.g., sign in, sign out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[App] Auth state changed:', event);
      if (session?.user) {
        setUser(session.user);
        setSession(session);
        await syncSubscription(session.user); // Sync sub
        completeOnboarding();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show loading while checking session
  if (isCheckingSession) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0a0a0f]">
        <div className="text-white text-lg animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <HashRouter>
      <UpdateNotification />
      <Routes>
        {/* Onboarding Flow */}
        <Route element={<OnboardingLayout />}>
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/setup-profile" element={<SetupProfilePage />} />
        </Route>

        {/* Main App */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/ai" element={<AICoachPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Overlay / Focus Mode */}
        <Route element={<OverlayLayout />}>
          <Route path="/focus" element={<FocusModePage />} />
        </Route>

        {/* Redirects - Skip Welcome, go directly to Auth */}
        <Route path="/" element={
          isOnboarded ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />
        } />
      </Routes>
    </HashRouter>
  );
}

export default App;

