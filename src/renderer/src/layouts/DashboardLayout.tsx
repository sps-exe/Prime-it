import { Outlet, Navigate } from 'react-router-dom';
import { BottomNav } from '../components/dashboard/BottomNav';
import { useUserStore } from '../store/useUserStore';

export function DashboardLayout() {
    const { user, isOnboarded } = useUserStore();

    // Redirect to auth if not logged in
    if (!user || !isOnboarded) {
        return <Navigate to="/auth" replace />;
    }

    return (
        <div className="h-screen w-screen bg-[#0a0a0f] text-white flex flex-col overflow-hidden">
            {/* Main Scrollable Area */}
            <div className="flex-1 overflow-auto p-6 flex justify-center">
                <div className="w-full max-w-7xl">
                    <Outlet />
                </div>
            </div>

            {/* Fixed Bottom Nav - now static footer */}
            <div className="flex justify-center pb-6 pt-2 z-50">
                <BottomNav />
            </div>
        </div>
    );
}
