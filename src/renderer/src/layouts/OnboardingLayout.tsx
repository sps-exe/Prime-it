import { Outlet } from 'react-router-dom';

export function OnboardingLayout() {
    return (
        <div className="h-screen w-screen overflow-hidden bg-gray-100 relative flex items-center justify-center">
            {/* Background Wallpaper */}
            <div className="absolute inset-0 bg-cover bg-center z-0 opacity-100" style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2940&auto=format&fit=crop")',
                // Using a similar vibrant red/abstract wallpaper as placeholder or we can use a generic nice one. 
                // Logic: The user has a custom wallpaper in screenshot, we'll try to simulate a 'desktop' feel
                // or just use a nice blurred abstract background.
                // For now, let's use a blurred abstract gradient or image.
            }}>
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
            </div>

            {/* Content Container (The Modal) */}
            <div className="relative z-10 w-full max-w-[480px] p-4 animate-in fade-in zoom-in-95 duration-300">
                <Outlet />
            </div>
        </div>
    );
}
