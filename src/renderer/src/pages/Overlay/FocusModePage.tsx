
import { useEffect, useState } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, CheckCircle2, Minimize2, Maximize2, Plus, SkipForward, Zap, Coffee, FileText, Check, GripVertical, Minus, Moon, X } from 'lucide-react';


export default function FocusModePage() {
    const navigate = useNavigate();
    const [miniMode, setMiniMode] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Store
    const tasks = useTaskStore(state => state.tasks);
    const activeTaskId = useTaskStore(state => state.activeTaskId);
    const timerState = useTaskStore(state => state.timerState);
    const setActiveTask = useTaskStore(state => state.setActiveTask);
    const toggleTimer = useTaskStore(state => state.toggleTimer);
    const tickTimer = useTaskStore(state => state.tickTimer);
    const setTaskDone = useTaskStore(state => state.setTaskDone);
    const lists = useTaskStore(state => state.lists);
    const streak = useTaskStore(state => state.streak);

    // Derived
    const todayTasks = tasks.filter(t => t.columnId === 'today');
    const activeTask = tasks.find(t => t.id === activeTaskId);

    // Filter Done tasks to show ONLY those completed TODAY
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    const doneTasks = tasks.filter(t =>
        t.columnId === 'done' &&
        t.completedAt &&
        t.completedAt >= startOfDay
    );

    const totalToday = todayTasks.length + doneTasks.length;
    const doneTodayCount = doneTasks.length;

    // Milestone tracking
    const totalTasksCompleted = useTaskStore(state => state.totalTasksCompleted);
    const lastMilestone = useTaskStore(state => state.lastMilestone);

    // Get list info for active task
    const activeTaskList = activeTask ? lists.find(l => l.id === activeTask.listId) : null;

    // *** CRITICAL: Enable overlay mode when this page mounts ***
    useEffect(() => {
        const enableOverlay = async () => {
            console.log('[FocusModePage] Enabling overlay mode on mount');
            try {
                if ((window as any).ipcRenderer?.invoke) {
                    await (window as any).ipcRenderer.invoke('set-overlay-mode', true);
                }
            } catch (err) {
                console.error('[FocusModePage] IPC error:', err);
            }
        };
        enableOverlay();
    }, []);

    const [showNotes, setShowNotes] = useState(false);

    // Switch to mini mode when entering focus mode
    useEffect(() => {
        const setMiniModeState = async () => {
            try {
                if ((window as any).ipcRenderer?.invoke) {
                    await (window as any).ipcRenderer.invoke('set-mini-mode', miniMode);
                }
            } catch (err) {
                console.error('[FocusModePage] Mini mode IPC error:', err);
            }
        };
        setMiniModeState();
    }, [miniMode]);

    // Handle Notes Expansion
    useEffect(() => {
        const updateHeight = async () => {
            if (!miniMode) return;
            // Base height 50, notes adds ~120
            const height = showNotes ? 170 : 50;
            try {
                if ((window as any).ipcRenderer?.invoke) {
                    await (window as any).ipcRenderer.invoke('set-mini-mode-height', height);
                }
            } catch (err) {
                console.error('[FocusModePage] Resize IPC error:', err);
            }
        };
        updateHeight();
    }, [showNotes, miniMode]);

    // Auto-select first task if none selected
    useEffect(() => {
        if (!activeTaskId && todayTasks.length > 0) {
            setActiveTask(todayTasks[0].id);
        }
    }, [activeTaskId, todayTasks, setActiveTask]);



    // Timer Effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timerState.isRunning) {
            interval = setInterval(() => {
                tickTimer();
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timerState.isRunning, tickTimer]);

    // Timer Formatter (HH:MM:SS) with safeguards
    const formatTime = (seconds: number) => {
        if (!seconds || isNaN(seconds) || seconds < 0) {
            return '00:00:00';
        }
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // --- CELEBRATION GIFS --- (Using direct GIPHY CDN URLs)
    const CELEBRATION_GIFS = [
        "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG1qNTBhY2k5OHR2bWNlMXE5YjIyZ2g3dGl0OGluYjR0azRzdWNlbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/artj9zsVs8MFy/giphy.gif", // Leo cheers
        "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbTRlMjN3cWx1dnA0Z2E5YnJsZmMzZG96dGVlYjdwaTBpYnY4a3Q5biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oz8xAFtqoOUUrsh7W/giphy.gif", // Celebrate dance
        "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWRtNWZ1cjVwb2tjNm04eGsyZWE3OXBpbGNzNGxyNW5vbnpjdTM0eiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT9DPNb9JdOdO4GfKg/giphy.gif", // Champion
        "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNTZ2aTE1aW54OXA3NnNxeHJobzJqaXpvcjVheHY5am1qazliazRlMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7abGQa0aRJUurpII/giphy.gif", // Yes!
        "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjd5MnV1ZmFqODM0NHdkcm54aXIzZnA3MmZhdnpkb2cxZnc3NWplYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0MYt5jPR6QX5pnqM/giphy.gif", // Happy
        "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXV6OXNudXQ3dWt4b2VqdGd3anBzMXR5OWNlc2FkMGV3aGw4OHF2YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26u4cqiYI30juCOGY/giphy.gif", // Excited
        "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmV2N251b3g0enRlYnhxamNkZHFpMjFhMG5udHFsb3VjYTJ3dnNneCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlHFRbmaZtBRhXG/giphy.gif", // Friends Joey
        "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnc5OThsdm40aWNnbHR6NDV3ajRqcWNyNGpuamNwNzQ0MjZyN2JpMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT0xeJpnrWC4XWblEk/giphy.gif", // Good job
        "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzZremhhM2dhbXk5ZnQ3cjIxbDB0bnJqbWpkN2F5NWI3OGxydGJnZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3ohzdIuqJoo8QdKlnW/giphy.gif", // Clapping
        "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWh5OGF5NXF3cjE4cWZtYWhyMjB1ZGpvbWNiNzF6cTdkZHYwNTI4YyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/g9582DNuQppxC/giphy.gif", // Gatsby toast
        "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExc3pqcm82azJqZWV0MnBuNnNtZW5hYWRrOXdhemZmeXZmbGRjbmw0dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/XreQmk7ETCak0/giphy.gif", // Thumbs up
        "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3dhNGt0NzV3eDlsY2ZxZ2h4cG14djB5bjl1aWhrcnpjbGppMWpieSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/11sBLVxNs7v6WA/giphy.gif" // Minions
    ];

    const [showCelebration, setShowCelebration] = useState(false);
    const [celebrationGif, setCelebrationGif] = useState("");
    const [completedTaskData, setCompletedTaskData] = useState<{ title: string, duration: number, taken: number, difficulty?: 'easy' | 'medium' | 'deep' } | null>(null);

    // Inline Add Task State
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const addTask = useTaskStore(state => state.addTask);

    const handleAddTask = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!newTaskTitle.trim()) return;

        // Add to 'today' column, default 25 min
        addTask(newTaskTitle, 25, 'today', 'default-1');
        setNewTaskTitle("");
        setIsAddingTask(false);
    };

    const handleCloseSession = async () => {
        if (timerState.isRunning) toggleTimer();
        try {
            if ((window as any).ipcRenderer?.invoke) {
                await (window as any).ipcRenderer.invoke('set-overlay-mode', false);
            }
        } catch (err) {
            console.error('[FocusModePage] IPC error:', err);
        }
        navigate('/dashboard');
    };

    const handleCompleteTask = async (id: string) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        // Calculate time taken
        const durationSeconds = (task.duration || 25) * 60;
        const takenSeconds = Math.max(0, durationSeconds - timerState.remaining);

        // Prepare data for celebration
        setCompletedTaskData({
            title: task.title,
            duration: task.duration || 0,
            taken: takenSeconds,
            difficulty: task.difficulty
        });
        setCelebrationGif(CELEBRATION_GIFS[Math.floor(Math.random() * CELEBRATION_GIFS.length)]);
        setShowCelebration(true);

        // If in mini mode, expand to allow showing the card
        if (miniMode) {
            handleExitMiniMode();
        }

        // Stop timer for now
        if (timerState.isRunning) {
            toggleTimer();
        }
    };

    const handleConfirmNextTask = () => {
        if (completedTaskData && activeTaskId) {
            // Actually mark as done in store
            setTaskDone(activeTaskId);

            // Move to next task
            const remaining = todayTasks.filter(t => t.id !== activeTaskId);
            if (remaining.length > 0) {
                setActiveTask(remaining[0].id);
            }
        }
        setShowCelebration(false);
        setCompletedTaskData(null);
    };

    const handleSkipTask = () => {
        if (!activeTask) return;
        const currentIndex = todayTasks.findIndex(t => t.id === activeTask.id);
        const nextIndex = (currentIndex + 1) % todayTasks.length;
        if (todayTasks[nextIndex]) {
            setActiveTask(todayTasks[nextIndex].id);
        }
    };

    const handleEnterMiniMode = () => {
        setMiniMode(true);
    };

    const handleExitMiniMode = () => {
        setMiniMode(false);
    };

    // Toggle break logic
    const handleBreak = () => {
        if (timerState.mode === 'focus') {
            // Start 5 minute break
            useTaskStore.getState().startBreak(5 * 60);
        } else {
            // End break
            useTaskStore.getState().endBreak();
        }
    };

    const handleNotes = () => {
        setShowNotes(!showNotes);
    };

    const handleMinimize = async () => {
        try {
            if ((window as any).ipcRenderer?.invoke) {
                await (window as any).ipcRenderer.invoke('minimize-window');
            }
        } catch (err) {
            console.error('[FocusModePage] Minimize IPC error:', err);
        }
    };

    // Estimate total time
    const totalEstimate = todayTasks.reduce((sum, t) => sum + (t.duration || 0), 0);
    const estHours = Math.floor(totalEstimate / 60);
    const estMins = totalEstimate % 60;
    const estString = estHours > 0 ? `${estHours}hr` : `${estMins}min`;

    const activeTaskDuration = activeTask?.duration || 0;
    const progress = activeTaskDuration > 0
        ? ((activeTaskDuration * 60 - timerState.remaining) / (activeTaskDuration * 60)) * 100
        : 0;

    // --- MINI MODE RENDER ---
    if (miniMode && !showCelebration) { // Only show mini mode if NOT celebrating
        return (
            <div className="w-full h-full flex flex-col items-center overflow-hidden" style={{ background: 'transparent' }}>
                {/* Main Pill */}
                <div
                    className={`relative flex items-center justify-between transition-all duration-300 ease-in-out ${isHovered ? 'w-auto min-w-[300px] gap-2 px-3 py-2' : 'w-auto min-w-[140px] px-3 py-1.5'
                        } rounded-full border border-white/10 shadow-2xl backdrop-blur-md`}
                    style={{
                        background: 'rgba(20, 20, 20, 0.9)',
                        WebkitAppRegion: 'no-drag' // Always no-drag to allow hover, use grip to drag
                    } as any}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Hovered State: Controls */}
                    {isHovered ? (
                        <>
                            {/* Break Button (Pill with Text) */}
                            <button
                                onClick={handleBreak}
                                className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${timerState.mode === 'break'
                                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                    : 'bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 hover:text-indigo-200'
                                    }`}
                                title={timerState.mode === 'break' ? "End Break" : "Take a Break"}
                            >
                                <Coffee className="w-3.5 h-3.5" />
                                <span className="text-xs font-medium">Break</span>
                            </button>

                            {/* Separator */}
                            <div className="w-px h-4 bg-white/10 mx-1" />

                            {/* Notes Button */}
                            <button
                                onClick={handleNotes}
                                className={`group flex items-center justify-center w-8 h-8 rounded-full transition-all ${showNotes ? 'bg-yellow-500/20 text-yellow-400' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}
                                title="Notes"
                            >
                                <FileText className="w-4 h-4" />
                            </button>

                            {/* Pause/Play */}
                            <button
                                onClick={toggleTimer}
                                className="group flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 text-white transition-all"
                            >
                                {timerState.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </button>

                            {/* Skip */}
                            <button
                                onClick={handleSkipTask}
                                className="group flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                                title="Skip Task"
                            >
                                <SkipForward className="w-4 h-4" />
                            </button>

                            {/* Done Button - Green Checkmark */}
                            {activeTask && (
                                <button
                                    onClick={() => handleCompleteTask(activeTask.id)}
                                    className="group flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500 text-white hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/30"
                                    title="Mark as Done"
                                >
                                    <Check className="w-4 h-4" />
                                </button>
                            )}

                            {/* Expand Button */}
                            <button
                                onClick={handleExitMiniMode}
                                className="group flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white transition-all ml-1"
                                title="Expand"
                            >
                                <Maximize2 className="w-4 h-4" />
                            </button>
                        </>
                    ) : (
                        // Compact State
                        <>
                            <div
                                className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-white cursor-grab active:cursor-grabbing mr-2"
                                style={{ WebkitAppRegion: 'drag' } as any}
                            >
                                <GripVertical className="w-3 h-3" />
                            </div>

                            <div className="flex flex-col justify-center overflow-hidden mr-3">
                                <span className={`text-xs font-medium truncate max-w-[100px] transition-colors ${timerState.mode === 'break' ? 'text-indigo-400' : 'text-gray-200'}`}>
                                    {timerState.mode === 'break' ? '☕ Break' : (activeTask?.title || 'No task')}
                                </span>
                                {timerState.mode === 'focus' && (
                                    <div className="w-full h-0.5 bg-gray-700/50 rounded-full mt-0.5 overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                )}
                            </div>
                            <span className={`font-mono text-sm font-semibold tracking-wide ${timerState.mode === 'break' ? 'text-indigo-400' : 'text-white'}`}>
                                {formatTime(timerState.remaining)}
                            </span>
                        </>
                    )}
                </div>

                {/* Notes Dropdown Area */}
                <div
                    className={`w-[300px] mt-2 bg-[#1E2028] rounded-xl border border-white/10 shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${showNotes ? 'opacity-100 max-h-[200px]' : 'opacity-0 max-h-0'}`}
                >
                    <div className="p-3">
                        <textarea
                            className="w-full h-[100px] bg-transparent text-xs text-gray-300 placeholder-gray-600 resize-none focus:outline-none"
                            placeholder="Add notes for this task..."
                            value={activeTask?.notes || ''}
                            onChange={(e) => activeTask && useTaskStore.getState().updateTaskNotes(activeTask.id, e.target.value)}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // --- CELEBRATION OVERLAY ---
    if (showCelebration && completedTaskData) {
        // Calculate early finish time
        const estimatedSeconds = (completedTaskData.duration || 0) * 60;
        const earlySeconds = estimatedSeconds - completedTaskData.taken;
        const earlyMins = Math.max(0, Math.round(earlySeconds / 60));
        const earlyMessage = earlyMins > 0
            ? `You finished ${earlyMins}mins early!`
            : 'You finished the task!';

        const handleTakeBreak = () => {
            handleConfirmNextTask();
            // Start a 10-minute break timer
            useTaskStore.getState().startBreak(10 * 60);
        };

        return (
            <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 overflow-hidden relative" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                {/* Drag handle for the whole window in this mode */}
                <div className="absolute top-0 left-0 right-0 h-6 bg-transparent" style={{ WebkitAppRegion: 'drag' } as any} />

                <div className="bg-[#1E2028] rounded-3xl border border-white/5 shadow-2xl p-6 w-full max-w-[320px] text-center relative z-10 flex flex-col items-center">

                    {/* Task Name Header */}
                    <div className="text-left w-full mb-3">
                        <span className="text-white font-bold text-base">{completedTaskData.title}</span>
                    </div>

                    {/* Well Done Header */}
                    <div className="text-left w-full mb-4">
                        <span className="text-white text-lg font-bold">Well done! 💥</span>
                    </div>

                    {/* GIF */}
                    <div className="w-full aspect-square bg-black rounded-xl overflow-hidden mb-4 border border-white/10 relative group">
                        <img
                            src={celebrationGif}
                            alt="Celebration"
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                    </div>

                    {/* Early Finish Message */}
                    <p className="text-emerald-400 text-sm font-medium mb-2">{earlyMessage}</p>

                    {/* Milestone Badge - shows when crossing a new milestone */}
                    {lastMilestone > 0 && totalTasksCompleted === lastMilestone && (
                        <div className="mb-4 animate-pulse">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full px-4 py-2 inline-flex items-center gap-2">
                                <span className="text-2xl">🏆</span>
                                <div className="text-left">
                                    <p className="text-white text-xs font-bold">{lastMilestone} TASKS MILESTONE!</p>
                                    <p className="text-white/70 text-[10px]">You're on fire! Keep it up!</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* XP Earned Badge with Streak Bonus */}
                    {(() => {
                        const baseXp = completedTaskData.difficulty === 'deep' ? 50 : completedTaskData.difficulty === 'easy' ? 10 : 25;
                        const multiplier = streak >= 14 ? 2.0 : streak >= 7 ? 1.5 : streak >= 3 ? 1.25 : 1.0;
                        const earnedXp = Math.round(baseXp * multiplier);
                        return (
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg px-3 py-1.5 flex items-center gap-2">
                                    <span className="text-yellow-400 text-sm">⭐</span>
                                    <span className="text-white text-xs font-bold">+{earnedXp} XP</span>
                                    {multiplier > 1 && (
                                        <span className="text-orange-400 text-[10px] font-bold">({multiplier}x 🔥)</span>
                                    )}
                                </div>
                                {streak > 0 && (
                                    <div className="flex items-center gap-1 text-orange-400 text-xs font-bold">
                                        <span>🔥</span>
                                        <span>{streak} day{streak !== 1 ? 's' : ''}</span>
                                    </div>
                                )}
                            </div>
                        );
                    })()}

                    {/* Action Button */}
                    <button
                        onClick={handleConfirmNextTask}
                        className="w-full py-3 rounded-full bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 text-gray-900 font-bold text-sm shadow-lg shadow-emerald-500/20 transform active:scale-95 transition-all flex items-center justify-center gap-2 mb-3"
                    >
                        <SkipForward className="w-4 h-4" />
                        Next Task
                    </button>

                    {/* Break Action */}
                    <button
                        onClick={handleTakeBreak}
                        className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 transition-colors text-xs font-medium"
                    >
                        <Coffee className="w-3.5 h-3.5" />
                        Take a Break
                    </button>

                    {/* Footer Stats */}
                    <div className="w-full mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500">
                        <span>Est: {completedTaskData.duration ? `${completedTaskData.duration}min` : 'None'}</span>
                        <span className="text-emerald-400">Taken: {Math.round(completedTaskData.taken / 60)}min</span>
                    </div>
                </div>
            </div>
        );
    }

    // ============ FULL SIDEBAR VIEW (DARK THEME) ============
    return (
        <div className="h-screen w-full bg-[#131313] text-gray-200 flex flex-col font-sans border-l border-white/5 relative selection:bg-pink-500/30">
            {/* Drag Handle Top - Increased height to cover where traffic lights were */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-transparent z-50 flex items-center justify-between px-3" style={{ WebkitAppRegion: 'drag' } as any}>
                {/* Custom Window Controls (Left) */}
                <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' } as any}>
                    <button
                        onClick={handleMinimize}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                        title="Minimize"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    {/* Add more custom controls here if needed (e.g., Close, Expand) */}
                </div>
            </div>

            {/* Header Area */}
            <div className="pt-10 px-5 pb-4 flex items-center justify-between bg-gradient-to-b from-[#1a1a1a] to-transparent">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <span className="text-white font-bold text-lg leading-none">V</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white">Focus</span>
                    </div>
                </div>


            </div>

            {/* Stats Bar */}
            <div className="px-5 mb-6">
                <div className="flex items-center justify-between text-xs font-medium text-gray-500 bg-[#1A1A1A] p-3 rounded-lg border border-white/5">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>{doneTodayCount}/{totalToday} Completed</span>
                    </div>
                    <span>Est: {estString}</span>
                </div>
            </div>

            {/* Current Active Task Card */}
            <div className="px-5 mb-6">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 pl-1">Current Task</div>
                {timerState.mode === 'break' ? (
                    /* BREAK MODE CARD - CENTERED LAYOUT */
                    <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-2xl p-6 border border-indigo-500/20 relative overflow-hidden group flex flex-col items-center text-center">
                        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500" />

                        <div className="flex items-center gap-2 mb-2 mt-1">
                            <Coffee className="w-5 h-5 text-indigo-400" />
                            <h2 className="text-lg font-bold text-white">Break Time</h2>
                        </div>

                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium border border-indigo-500/20 mb-4">
                            Recharging
                        </span>

                        <div className="text-4xl font-mono font-bold text-white tracking-widest tabular-nums mb-6">
                            {formatTime(timerState.remaining)}
                        </div>

                        {/* Controls */}
                        <div className="w-full">
                            <button
                                onClick={handleBreak} // Ends break
                                className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all bg-indigo-500 text-white hover:bg-indigo-400 shadow-lg shadow-indigo-500/20 group-hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <SkipForward className="w-4 h-4 fill-current" /> End Break
                            </button>
                        </div>
                    </div>
                ) : activeTask ? (
                    <div className="bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-2xl p-5 border border-blue-500/20 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />

                        <div className="flex justify-between items-start mb-4 gap-3">
                            <div className="flex-1 min-w-0">
                                <h2 className="text-sm font-bold text-white mb-1 group-hover:text-blue-200 transition-colors truncate">{activeTask.title}</h2>
                                {activeTaskList && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-medium border border-blue-500/20">
                                        {activeTaskList.name}
                                    </span>
                                )}
                            </div>
                            <div className="text-right flex-shrink-0">
                                <div className="text-2xl font-mono font-bold text-white tracking-widest tabular-nums">
                                    {formatTime(timerState.remaining)}
                                </div>
                                <div className="text-xs text-blue-400 font-medium mt-1">
                                    {timerState.isRunning ? 'Running...' : 'Paused'}
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2 mt-2">
                            <button
                                onClick={toggleTimer}
                                className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${timerState.isRunning
                                    ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/20'
                                    : 'bg-white text-black hover:bg-gray-200 shadow-lg shadow-white/5'
                                    }`}
                            >
                                {timerState.isRunning ? (
                                    <>
                                        <Pause className="w-4 h-4" /> Pause
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-4 h-4 fill-current" /> Start Focus
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => handleCompleteTask(activeTask.id)}
                                className="w-12 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center transition-all"
                                title="Complete"
                            >
                                <Check className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ) : todayTasks.length === 0 && doneTasks.length > 0 ? (
                    /* ALL TASKS DONE CELEBRATION - matches original Prime it */
                    <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-white/5 flex flex-col items-center justify-center text-center">
                        <h2 className="text-2xl font-bold text-white mb-2">Woohooo!! 🎉</h2>
                        <p className="text-gray-400 font-medium mb-6">All tasks done for the day</p>

                        <button
                            onClick={handleCloseSession}
                            className="w-full py-3 rounded-full bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 text-gray-900 font-bold text-sm shadow-lg shadow-emerald-500/20 transform active:scale-95 transition-all mb-4"
                        >
                            Go Relax
                        </button>

                        <button
                            onClick={handleCloseSession}
                            className="text-gray-500 hover:text-white transition-colors text-sm font-medium"
                        >
                            Create Task
                        </button>
                    </div>
                ) : (
                    <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-white/5 border-dashed flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-3 text-gray-600">
                            <Zap className="w-6 h-6" />
                        </div>
                        <p className="text-gray-400 font-medium">No active task</p>
                        <p className="text-gray-600 text-xs mt-1">Select a task from below to start focusing</p>
                    </div>
                )}
            </div>

            {/* Task List */}
            <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-4 custom-scrollbar">
                {/* Up Next */}
                <div>
                    <div className="flex items-center justify-between mb-3 pl-1">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Up Next</div>
                        {!isAddingTask && (
                            <button
                                onClick={() => setIsAddingTask(true)}
                                className="text-[10px] text-gray-600 hover:text-white transition-colors flex items-center gap-1"
                            >
                                <Plus className="w-3 h-3" /> ADD TASK
                            </button>
                        )}
                    </div>

                    {/* Inline Add Task Form */}
                    {isAddingTask && (
                        <form onSubmit={handleAddTask} className="mb-4 bg-[#1A1A1A] p-3 rounded-xl border border-blue-500/30 shadow-lg shadow-blue-500/10">
                            <input
                                autoFocus
                                type="text"
                                placeholder="What are you working on?"
                                className="w-full bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none mb-3"
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape') {
                                        setIsAddingTask(false);
                                        setNewTaskTitle("");
                                    }
                                }}
                            />
                            <div className="flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAddingTask(false);
                                        setNewTaskTitle("");
                                    }}
                                    className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newTaskTitle.trim()}
                                    className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Add Task
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="space-y-2">
                        {todayTasks.filter(t => t.id !== activeTaskId).map(task => {
                            const list = lists.find(l => l.id === task.listId);
                            return (
                                <div
                                    key={task.id}
                                    onClick={() => setActiveTask(task.id)}
                                    className="group flex items-center p-3 rounded-xl bg-[#1A1A1A] hover:bg-[#252525] border border-white/5 hover:border-white/10 transition-all cursor-pointer"
                                >
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-600 group-hover:border-blue-500 mr-3 flex items-center justify-center transition-colors">
                                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-gray-300 group-hover:text-white truncate transition-colors">{task.title}</div>
                                        {list && <div className="text-[10px] text-gray-600">{list.name}</div>}
                                    </div>
                                    <div className="text-xs font-mono text-gray-600 group-hover:text-gray-400">
                                        {task.duration || 15}m
                                    </div>
                                </div>
                            );
                        })}
                        {todayTasks.length === 0 && doneTasks.length === 0 && (
                            <div className="text-center py-8 text-gray-600 text-sm">
                                All clear! No tasks for today.
                            </div>
                        )}
                    </div>
                </div>

                {/* Completed */}
                {doneTasks.length > 0 && (
                    <div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 pl-1 mt-6">
                            {doneTasks.length} Done
                        </div>
                        <div className="space-y-2 opacity-60 hover:opacity-100 transition-opacity">
                            {doneTasks.map(task => (
                                <div key={task.id} className="flex items-center p-3 rounded-xl bg-[#1A1A1A] border border-transparent">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/50 mr-3 flex items-center justify-center text-emerald-500">
                                        <Check className="w-3 h-3" />
                                    </div>
                                    <span className="text-sm text-gray-500 line-through decoration-gray-700">{task.title}</span>
                                    <span className="ml-auto text-xs text-gray-700">{task.duration || 0}m</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {/* Bottom Control Bar - ALWAYS VISIBLE (matching original Prime it design) */}
            <div className="absolute bottom-0 left-0 right-0 pb-4 pt-6 px-4 flex items-center justify-center gap-3 z-50 bg-gradient-to-t from-[#131313] via-[#131313]/95 to-transparent">
                {/* Focus Mode Button - Only show if there are tasks to focus on */}
                {todayTasks.length > 0 && (
                    <button
                        onClick={handleEnterMiniMode}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1E1E1E] hover:bg-[#2A2A2A] border border-white/10 text-gray-300 hover:text-white transition-all shadow-lg"
                    >
                        <Minimize2 className="w-4 h-4" />
                        <span className="text-xs font-medium">Focus mode</span>
                    </button>
                )}

                {/* Close Session Button */}
                <button
                    onClick={handleCloseSession}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1E1E1E] hover:bg-[#2A2A2A] border border-white/10 text-gray-300 hover:text-white transition-all shadow-lg"
                >
                    <Moon className="w-4 h-4" />
                    <span className="text-xs font-medium">Close Session</span>
                </button>
            </div>
        </div>
    );
}
