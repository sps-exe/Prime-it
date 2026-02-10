
import { Outlet } from 'react-router-dom';

export function OverlayLayout() {
    return (
        <div className="min-h-screen w-full bg-[#0f0f13] text-white overflow-hidden flex flex-col font-sans select-none">
            {/* Draggable region is handled by header in page usually, but we can make whole background draggable or add a specific bar */}
            {/* For now, just rendering outlet, specific pages handle their structure */}
            <Outlet />
        </div>
    );
}
