import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useTaskStore } from '../../store/useTaskStore';
import { useMemo, useState } from 'react';

export function HeatMap() {
    const dailyFocusHistory = useTaskStore((state) => state.dailyFocusHistory);
    const [viewMode, setViewMode] = useState<'year' | 'month'>('year');
    const [currentDate, setCurrentDate] = useState(new Date());

    // Calculate start date
    const userStartDate = useMemo(() => {
        const dates = Object.keys(dailyFocusHistory).sort();
        if (dates.length > 0) {
            // Parse YYYY-MM-DD manually to avoid UTC conversion
            const [y, m, d] = dates[0].split('-').map(Number);
            return new Date(y, m - 1, d);
        }
        return new Date(new Date().getFullYear(), 0, 1);
    }, [dailyFocusHistory]);

    // Generate data
    const {
        weeks,
        months,
        viewLabel
    } = useMemo(() => {
        let startDate: Date;
        let endDate: Date;
        let label = '';

        if (viewMode === 'year') {
            const currentYear = currentDate.getFullYear();
            // Always show full year Jan 1 - Dec 31
            startDate = new Date(currentYear, 0, 1);
            endDate = new Date(currentYear, 11, 31);
            label = `${currentYear}`;
        } else {
            // Month view: 1st to last day of month
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            startDate = new Date(year, month, 1);
            endDate = new Date(year, month + 1, 0);

            label = startDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        }

        const data: { date: string; value: number; intensity: number; month: number }[] = [];
        let totalMinutes = 0;
        let activeDays = 0;

        const formatDate = (date: Date) => {
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const d = String(date.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
        };

        const iterDate = new Date(startDate);
        let safetyCount = 0;
        while (iterDate <= endDate && safetyCount < 366) {
            const dateStr = formatDate(iterDate);
            // Use dateStr directly to query history
            const minutes = Math.round((dailyFocusHistory[dateStr] || 0) / 60);

            if (minutes > 0) {
                totalMinutes += minutes;
                activeDays++;
            }

            let intensity = 0;
            if (minutes > 0) intensity = 1;
            if (minutes >= 30) intensity = 2;
            if (minutes >= 60) intensity = 3;
            if (minutes >= 120) intensity = 4;

            data.push({
                date: dateStr,
                value: minutes,
                intensity,
                month: iterDate.getMonth()
            });

            iterDate.setDate(iterDate.getDate() + 1);
            safetyCount++;
        }

        // Group into weeks
        const weeks: { date: string; value: number; intensity: number; month: number }[][] = [];
        let currentWeek: { date: string; value: number; intensity: number; month: number }[] = [];

        // Pad first week
        const firstDayOfWeek = new Date(data[0].date).getDay(); // 0 = Sunday
        for (let i = 0; i < firstDayOfWeek; i++) {
            currentWeek.push({ date: '', value: 0, intensity: -1, month: -1 });
        }

        data.forEach((day) => {
            currentWeek.push(day);
            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
        });

        if (currentWeek.length > 0) {
            while (currentWeek.length < 7) {
                currentWeek.push({ date: '', value: 0, intensity: -1, month: -1 });
            }
            weeks.push(currentWeek);
        }

        // Generate Labels for year view
        const monthLabels: { name: string; index: number }[] = [];
        if (viewMode === 'year') {
            let lastMonth = -1;
            weeks.forEach((week, index) => {
                const validDays = week.filter(d => d.month !== -1);
                if (validDays.length === 0) return;
                const m = validDays[0].month;
                if (m !== lastMonth) {
                    const d = new Date(validDays[0].date);
                    monthLabels.push({
                        name: d.toLocaleString('default', { month: 'short' }),
                        index
                    });
                    lastMonth = m;
                }
            });
        }

        return { weeks, months: monthLabels, totalMinutes, activeDays, viewLabel: label };
    }, [dailyFocusHistory, viewMode, currentDate, userStartDate]);

    // Navigation handlers
    const handlePrev = () => {
        const newDate = new Date(currentDate);
        if (viewMode === 'year') {
            newDate.setFullYear(newDate.getFullYear() - 1);
        } else {
            newDate.setMonth(newDate.getMonth() - 1);
        }
        setCurrentDate(newDate);
    };

    const handleNext = () => {
        const newDate = new Date(currentDate);
        if (viewMode === 'year') {
            newDate.setFullYear(newDate.getFullYear() + 1);
        } else {
            newDate.setMonth(newDate.getMonth() + 1);
        }
        setCurrentDate(newDate);
    };

    const getColor = (intensity: number) => {
        switch (intensity) {
            case -1: return 'opacity-0';
            case 0: return 'bg-[#1a1a20] border border-white/5';
            case 1: return 'bg-green-900/40 border border-green-500/30';
            case 2: return 'bg-green-700/60 border border-green-500/50';
            case 3: return 'bg-green-500/80 border border-green-400/50 shadow-[0_0_8px_rgba(34,197,94,0.3)]';
            case 4: return 'bg-green-400 border border-green-300 shadow-[0_0_12px_rgba(74,222,128,0.5)]';
            default: return 'bg-[#1a1a20] border border-white/5';
        }
    };

    const getWeekGap = (index: number) => {
        if (viewMode === 'month') return false;
        if (index === 0) return false;
        const prev = weeks[index - 1].find(d => d.month !== -1)?.month;
        const curr = weeks[index].find(d => d.month !== -1)?.month;
        return prev !== undefined && curr !== undefined && prev !== curr;
    };



    return (
        <div className="bg-[#0f0f13] border border-purple-500/20 rounded-3xl p-6 relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 rounded-3xl border border-purple-500/20 pointer-events-none"></div>

            {/* Header */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                    <h3 className="text-white font-medium text-lg flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-purple-400" />
                        Activity
                    </h3>

                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    {/* View Toggle */}
                    <div className="flex bg-[#1a1a20] rounded-lg p-1 border border-white/10">
                        <button
                            onClick={() => setViewMode('year')}
                            className={`px-3 py-1 text-xs rounded-md transition-all ${viewMode === 'year' ? 'bg-purple-500/20 text-purple-300' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Year
                        </button>
                        <button
                            onClick={() => setViewMode('month')}
                            className={`px-3 py-1 text-xs rounded-md transition-all ${viewMode === 'month' ? 'bg-purple-500/20 text-purple-300' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Month
                        </button>
                    </div>

                    {/* Date Navigation */}
                    <div className="flex items-center gap-1 bg-[#1a1a20] rounded-lg border border-white/10 px-1 py-1">
                        <button onClick={handlePrev} className="p-1 hover:bg-white/5 rounded text-gray-400 hover:text-white">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-medium text-white min-w-[80px] text-center">
                            {viewLabel}
                        </span>
                        <button onClick={handleNext} className="p-1 hover:bg-white/5 rounded text-gray-400 hover:text-white">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Grid Container */}
            <div className="relative z-10 w-full overflow-x-auto pb-2 scrollbar-hide">
                <div className={`${viewMode === 'year' ? 'min-w-max' : 'w-full'}`}>
                    {/* Header Labels */}
                    {viewMode === 'year' && (
                        <div className="flex mb-2 text-[10px] text-gray-500 h-4 relative">
                            {months.map((month, i) => (
                                <div key={i} className="absolute transform -translate-x-1" style={{ left: `${month.index * 14 + (i * 12)}px` }}>
                                    {month.name}
                                </div>
                            ))}
                        </div>
                    )}

                    {viewMode === 'month' && (
                        <div className="grid grid-cols-7 gap-1 mb-2 w-full">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                <div key={d} className="text-center text-[10px] text-gray-500 font-medium py-1">{d}</div>
                            ))}
                        </div>
                    )}

                    {/* Grid */}
                    {viewMode === 'year' ? (
                        <div className="flex" style={{ height: '100px' }}>
                            {weeks.map((week, wIndex) => {
                                const isNewMonth = getWeekGap(wIndex);
                                return (
                                    <div key={wIndex} className={`flex flex-col gap-1 ${isNewMonth ? 'ml-3' : 'ml-1'}`}>
                                        {week.map((day, dIndex) => (
                                            <div
                                                key={`${wIndex}-${dIndex}`}
                                                className={`w-2.5 h-2.5 rounded-sm transition-all duration-300 group relative ${getColor(day.intensity)}`}
                                            >
                                                {day.date && (
                                                    <div className="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-50 pointer-events-none border border-white/10 shadow-xl">
                                                        <div className="font-bold">{day.value} mins</div>
                                                        <div className="text-[10px] text-gray-400">{day.date}</div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        // Month View: Compact Grid
                        <div className="flex flex-col gap-1 w-full">
                            {weeks.map((week, wIndex) => (
                                <div key={wIndex} className="grid grid-cols-7 gap-1 w-full">
                                    {week.map((day, dIndex) => (
                                        <div
                                            key={`${wIndex}-${dIndex}`}
                                            className={`h-8 w-full rounded-md flex items-center justify-center text-xs transition-all duration-300 group relative border ${day.intensity === -1 ? 'border-transparent text-transparent' :
                                                day.intensity === 0 ? 'bg-[#1a1a20] border-white/5 text-gray-600' :
                                                    day.intensity === 1 ? 'bg-green-900/40 border-green-500/30 text-green-100' :
                                                        day.intensity === 2 ? 'bg-green-800/60 border-green-500/50 text-white font-medium' :
                                                            day.intensity === 3 ? 'bg-green-600/80 border-green-400/50 text-white font-bold' :
                                                                'bg-green-500 border-green-300 text-black font-bold'
                                                }`}
                                        >
                                            <span className="relative z-10">{day.date ? day.date.split('-')[2].replace(/^0/, '') : ''}</span>

                                            {/* Glow effect for high intensity */}
                                            {day.intensity >= 3 && (
                                                <div className="absolute inset-0 bg-green-400/10 blur-sm rounded-md"></div>
                                            )}

                                            {day.date && day.value > 0 && (
                                                <div className="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap z-50 pointer-events-none border border-white/10 shadow-xl">
                                                    <span className="font-bold">{day.value} mins</span>
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
