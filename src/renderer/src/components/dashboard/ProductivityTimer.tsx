import { useTaskStore } from '../../store/useTaskStore';

export function ProductivityTimer() {
    const todayFocusTime = useTaskStore((state) => state.todayFocusTime);

    // Format seconds into HH:mm:ss
    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        // Pad with leading zeros if needed
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    };

    const timeDisplay = formatTime(todayFocusTime);

    // Calculate progress percentage (assuming 8 hour goal for full circle?)
    // Let's maximize it at 8 hours (28800 seconds) for visual feedback
    const goalSeconds = 8 * 3600;
    const progress = Math.min(todayFocusTime / goalSeconds, 1);
    const circumference = 2 * Math.PI * 88; // r=88
    const strokeDashoffset = circumference * (1 - progress);

    return (
        <div className="bg-[#0f0f13] border border-purple-500/20 rounded-3xl p-6 flex items-center justify-center relative overflow-hidden h-[300px]">
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 rounded-3xl border border-purple-500/20 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center justify-center">
                {/* Circular Progress Container */}
                <div className="w-56 h-56 flex items-center justify-center relative">
                    {/* SVG Progress Circle */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                        {/* Background Track */}
                        <circle
                            cx="112"
                            cy="112"
                            r="88"
                            fill="transparent"
                            stroke="#1f2937" // gray-800
                            strokeWidth="16"
                            className="opacity-50"
                        />
                        {/* Gradient Progress Arc */}
                        <circle
                            cx="112"
                            cy="112"
                            r="88"
                            fill="transparent"
                            stroke="url(#gradient)"
                            strokeWidth="16"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-in-out"
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#8b5cf6" />
                                <stop offset="100%" stopColor="#3b82f6" />
                            </linearGradient>
                        </defs>
                    </svg>

                    <div className="text-center z-10">
                        <p className="text-gray-400 text-xs font-medium mb-1 uppercase tracking-wider">Today's</p>
                        <p className="text-gray-500 text-[10px] font-bold mb-2 uppercase tracking-widest">Productive Time</p>
                        <h2 className="text-2xl font-mono font-bold text-white tracking-wider tabular-nums">{timeDisplay}</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}
