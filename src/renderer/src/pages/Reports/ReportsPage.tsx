import { useState, useMemo } from 'react';
import { ArrowLeft, Calendar, Download, BarChart3, List, Flame, Clock, CheckCircle2, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTaskStore } from '../../store/useTaskStore';
import { TaskState, FocusSession, Task } from '../../types';

type TabType = 'overview' | 'sessions';

export default function ReportsPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [dateRange] = useState<{ start: Date; end: Date }>({
        start: new Date(Date.now() - 7 * 86400000), // Last 7 days
        end: new Date()
    });

    // Store data
    // Store data
    const sessions = useTaskStore((state: TaskState) => state.sessions);
    const tasks = useTaskStore((state: TaskState) => state.tasks);
    const lists = useTaskStore((state: TaskState) => state.lists);
    const dailyFocusHistory = useTaskStore((state: TaskState) => state.dailyFocusHistory);
    const streak = useTaskStore((state: TaskState) => state.streak);
    const longestStreak = useTaskStore((state: TaskState) => state.longestStreak);

    // Filter sessions by date range
    const filteredSessions = useMemo(() => {
        return sessions.filter((s: FocusSession) => {
            const sessionDate = new Date(s.startedAt);
            return sessionDate >= dateRange.start && sessionDate <= dateRange.end;
        });
    }, [sessions, dateRange]);

    // Calculate stats
    const stats = useMemo(() => {
        const totalFocusTime = filteredSessions.reduce((acc: number, s: FocusSession) => acc + s.focusTime, 0);
        const totalTasks = new Set(filteredSessions.map((s: FocusSession) => s.taskId)).size;
        const completedTasks = tasks.filter((t: Task) => {
            if (!t.completedAt) return false;
            const completedDate = new Date(t.completedAt);
            return completedDate >= dateRange.start && completedDate <= dateRange.end;
        }).length;

        // Work days = unique days with sessions
        const workDays = new Set(filteredSessions.map((s: FocusSession) =>
            new Date(s.startedAt).toISOString().split('T')[0]
        )).size;

        const avgTimePerTask = totalTasks > 0 ? Math.round(totalFocusTime / totalTasks) : 0;

        return {
            totalFocusTime,
            totalTasks: completedTasks,
            workDays,
            avgTimePerTask,
            totalSessions: filteredSessions.length
        };
    }, [filteredSessions, tasks, dateRange]);

    // Format time helper
    const formatTime = (seconds: number) => {
        if (seconds < 60) return `${seconds}s`;
        if (seconds < 3600) return `${Math.round(seconds / 60)}min`;
        const hours = Math.floor(seconds / 3600);
        const mins = Math.round((seconds % 3600) / 60);
        return `${hours}hr ${mins}min`;
    };

    // Daily chart data (last 7 days)
    const chartData = useMemo(() => {
        const days: { label: string; value: number; date: string }[] = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(Date.now() - i * 86400000);
            const dateStr = date.toISOString().split('T')[0];
            const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
            days.push({
                label: dayLabel,
                value: dailyFocusHistory[dateStr] || 0,
                date: dateStr
            });
        }
        return days;
    }, [dailyFocusHistory]);

    const maxChartValue = Math.max(...chartData.map(d => d.value), 1);

    // Export to PDF function
    const exportToPDF = () => {
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Prime it - Focus Report</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; background: #fff; color: #1a1a1a; }
                    h1 { font-size: 28px; margin-bottom: 8px; }
                    .subtitle { color: #666; margin-bottom: 24px; }
                    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
                    .stat-card { background: #f5f5f5; padding: 20px; border-radius: 12px; }
                    .stat-label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
                    .stat-value { font-size: 28px; font-weight: 700; }
                    .streak-banner { background: linear-gradient(135deg, #fff3e0, #ffecb3); padding: 20px; border-radius: 12px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
                    .streak-value { font-size: 32px; font-weight: 700; }
                    .streak-label { font-size: 12px; color: #e65100; text-transform: uppercase; letter-spacing: 1px; }
                    .sessions-table { width: 100%; border-collapse: collapse; margin-top: 24px; }
                    .sessions-table th, .sessions-table td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
                    .sessions-table th { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px; }
                    .chart-container { margin-top: 32px; padding: 20px; background: #f9f9f9; border-radius: 12px; }
                    .chart-title { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
                    .chart-bars { display: flex; align-items: flex-end; justify-content: space-between; height: 120px; gap: 8px; }
                    .chart-bar { flex: 1; background: linear-gradient(to top, #7c3aed, #3b82f6); border-radius: 4px 4px 0 0; }
                    .chart-label { text-align: center; font-size: 10px; color: #888; margin-top: 8px; }
                </style>
            </head>
            <body>
                <h1>🔥 Prime it - Focus Report</h1>
                <p class="subtitle">${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}</p>
                
                <div class="streak-banner">
                    <div>
                        <div class="streak-label">Current Streak</div>
                        <div class="streak-value">🔥 ${streak} ${streak === 1 ? 'day' : 'days'}</div>
                    </div>
                    <div style="text-align: right;">
                        <div class="streak-label">Longest</div>
                        <div style="font-size: 20px; font-weight: 600;">${longestStreak} days</div>
                    </div>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-label">Work Days</div>
                        <div class="stat-value">${stats.workDays}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Tasks Done</div>
                        <div class="stat-value">${stats.totalTasks}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Total Focus</div>
                        <div class="stat-value">${formatTime(stats.totalFocusTime)}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Avg per Task</div>
                        <div class="stat-value">${formatTime(stats.avgTimePerTask)}</div>
                    </div>
                </div>

                <div class="chart-container">
                    <div class="chart-title">Daily Focus Time</div>
                    <div class="chart-bars">
                        ${chartData.map(day => `
                            <div style="flex: 1; display: flex; flex-direction: column; align-items: center;">
                                <div class="chart-bar" style="height: ${Math.max((day.value / maxChartValue) * 100, 5)}%;"></div>
                                <div class="chart-label">${day.label}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                ${filteredSessions.length > 0 ? `
                    <h2 style="margin-top: 32px; font-size: 18px;">Sessions</h2>
                    <table class="sessions-table">
                        <thead>
                            <tr>
                                <th>Task</th>
                                <th>List</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredSessions.map(session => {
            const list = lists.find(l => l.id === session.listId);
            const startDate = new Date(session.startedAt);
            const endDate = new Date(session.endedAt);
            return `
                                    <tr>
                                        <td><strong>${session.taskTitle}</strong></td>
                                        <td>${list?.name || '-'}</td>
                                        <td>${startDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}</td>
                                        <td>${startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} → ${endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</td>
                                        <td><strong>${formatTime(session.focusTime)}</strong></td>
                                    </tr>
                                `;
        }).join('')}
                        </tbody>
                    </table>
                ` : ''}
                
                <p style="margin-top: 40px; font-size: 12px; color: #aaa; text-align: center;">Generated by Prime it • ${new Date().toLocaleDateString()}</p>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
            }, 250);
        }
    };

    return (
        <div className="h-screen w-full bg-[#0a0a0f] text-white flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-white uppercase tracking-wider transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <h1 className="text-xl font-bold">Reports</h1>
                </div>

                <div className="flex items-center gap-3">
                    {/* Date Range Picker (simplified) */}
                    <div className="flex items-center gap-2 bg-[#1a1a20] border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{dateRange.start.toLocaleDateString()} - {dateRange.end.toLocaleDateString()}</span>
                    </div>

                    {/* Export PDF */}
                    <button
                        onClick={exportToPDF}
                        className="flex items-center gap-2 bg-[#1a1a20] border border-white/10 rounded-lg px-4 py-2 text-xs font-bold text-gray-400 hover:text-white hover:border-white/20 transition-colors"
                    >
                        <Download className="w-4 h-4" /> Export PDF
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-6 py-3 border-b border-white/5">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'overview'
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'text-gray-500 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <BarChart3 className="w-4 h-4" /> Overview
                </button>
                <button
                    onClick={() => setActiveTab('sessions')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'sessions'
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'text-gray-500 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <List className="w-4 h-4" /> Sessions
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'overview' ? (
                    <div className="space-y-6">
                        {/* Streak Banner */}
                        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                                <Flame className="w-6 h-6 text-orange-500" />
                            </div>
                            <div>
                                <div className="text-orange-400 text-sm font-bold uppercase tracking-wider">Current Streak</div>
                                <div className="text-2xl font-bold text-white">{streak} {streak === 1 ? 'day' : 'days'}</div>
                            </div>
                            <div className="ml-auto text-right">
                                <div className="text-gray-500 text-xs font-bold uppercase">Longest</div>
                                <div className="text-lg font-bold text-gray-400">{longestStreak} days</div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-4 gap-4">
                            <StatCard
                                icon={<Calendar className="w-5 h-5" />}
                                label="Work Days"
                                value={stats.workDays.toString()}
                                color="blue"
                            />
                            <StatCard
                                icon={<CheckCircle2 className="w-5 h-5" />}
                                label="Tasks Done"
                                value={stats.totalTasks.toString()}
                                color="emerald"
                            />
                            <StatCard
                                icon={<Clock className="w-5 h-5" />}
                                label="Total Focus"
                                value={formatTime(stats.totalFocusTime)}
                                color="purple"
                            />
                            <StatCard
                                icon={<Target className="w-5 h-5" />}
                                label="Avg per Task"
                                value={formatTime(stats.avgTimePerTask)}
                                color="amber"
                            />
                        </div>

                        {/* Bar Chart */}
                        <div className="bg-[#0f0f13] border border-white/5 rounded-2xl p-6">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Daily Focus Time</h3>
                            <div className="flex items-end justify-between h-40 gap-2">
                                {chartData.map((day, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                        <div
                                            className="w-full bg-gradient-to-t from-purple-600 to-blue-500 rounded-t-lg transition-all duration-500"
                                            style={{
                                                height: `${Math.max((day.value / maxChartValue) * 100, 4)}%`,
                                                minHeight: day.value > 0 ? '8px' : '4px',
                                                opacity: day.value > 0 ? 1 : 0.2
                                            }}
                                        />
                                        <span className="text-[10px] text-gray-600 font-bold">{day.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Sessions List */}
                        {filteredSessions.length === 0 ? (
                            <div className="text-center py-16 text-gray-600">
                                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p className="font-bold">No sessions yet</p>
                                <p className="text-sm">Complete focus sessions to see them here</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredSessions.slice().reverse().map(session => {
                                    const list = lists.find(l => l.id === session.listId);
                                    const startDate = new Date(session.startedAt);
                                    const endDate = new Date(session.endedAt);

                                    return (
                                        <div
                                            key={session.id}
                                            className="bg-[#0f0f13] border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:border-white/10 transition-colors"
                                        >
                                            {/* Task Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-white truncate">{session.taskTitle}</div>
                                                {list && (
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <div
                                                            className="w-2 h-2 rounded-full"
                                                            style={{ backgroundColor: list.color }}
                                                        />
                                                        <span className="text-xs text-gray-500">{list.name}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Date */}
                                            <div className="text-xs text-gray-500">
                                                {startDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                                            </div>

                                            {/* Time Range */}
                                            <div className="text-xs text-gray-500">
                                                {startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                <span className="mx-1">→</span>
                                                {endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                            </div>

                                            {/* Duration */}
                                            <div className="text-sm font-bold text-purple-400 min-w-[60px] text-right">
                                                {formatTime(session.focusTime)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// Stat Card Component
function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
    const colorClasses: Record<string, string> = {
        blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    };

    return (
        <div className={`rounded-2xl border p-5 ${colorClasses[color]}`}>
            <div className="flex items-center gap-2 mb-3">
                {icon}
                <span className="text-xs font-bold uppercase tracking-wider opacity-70">{label}</span>
            </div>
            <div className="text-3xl font-bold text-white">{value}</div>
        </div>
    );
}
