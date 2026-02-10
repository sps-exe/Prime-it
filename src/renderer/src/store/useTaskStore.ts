import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { Task, List, ColumnId, FocusSession, TaskState } from '../types';
import { v4 as uuidv4 } from 'uuid';

// TaskState definition moved to ../types


// IPC Storage Adapter (Reused)
const storage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
        try {
            if (!(window as any).ipcRenderer) return null;
            const value = await (window as any).ipcRenderer.getStoreValue(name);
            return value ? JSON.stringify(value) : null;
        } catch (e) {
            console.error('Storage Get Error', e);
            return null;
        }
    },
    setItem: async (name: string, value: string): Promise<void> => {
        try {
            if (!(window as any).ipcRenderer) return;
            const parsed = JSON.parse(value);
            await (window as any).ipcRenderer.setStoreValue(name, parsed);
        } catch (e) {
            console.error('Storage Set Error', e);
        }
    },
    removeItem: async (name: string): Promise<void> => {
        try {
            if (!(window as any).ipcRenderer) return;
            await (window as any).ipcRenderer.setStoreValue(name, undefined);
        } catch (e) {
            console.error('Storage Remove Error', e);
        }
    },
}

const getLocalToday = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const useTaskStore = create<TaskState>()(
    persist(
        (set) => ({
            tasks: [] as Task[],
            lists: [
                { id: 'default-1', name: 'Work', color: '#3b82f6' }, // Blue
                { id: 'default-2', name: 'Personal', color: '#10b981' } // Emerald
            ],
            activeTaskId: null,
            timerState: {
                mode: 'focus',
                isRunning: false,
                remaining: 25 * 60,
                duration: 25 * 60
            },
            todayFocusTime: 0,
            lastActiveDate: getLocalToday(),

            // Reports Data
            sessions: [],
            currentSessionStart: null,
            streak: 0,
            longestStreak: 0,
            lastStreakDate: '', // Track when streak was last incremented (YYYY-MM-DD)
            dailyFocusHistory: {},

            // Gamification
            totalTasksCompleted: 0,
            lastMilestone: 0,
            xp: 0,
            level: 1,

            addTask: (title, duration, columnId, listId, difficulty) => set((state) => ({
                tasks: [
                    ...state.tasks,
                    {
                        id: uuidv4(),
                        title,
                        duration,
                        columnId,
                        listId,
                        difficulty,
                        createdAt: Date.now(),
                        notes: ''
                    }
                ]
            })),

            moveTask: (taskId, targetColumnId) => set((state) => ({
                tasks: state.tasks.map(task => {
                    if (task.id !== taskId) return task;

                    const updates: Partial<Task> = { columnId: targetColumnId };

                    // Set completedAt if moving to done
                    if (targetColumnId === 'done' && task.columnId !== 'done') {
                        updates.completedAt = Date.now();
                    }
                    // Clear completedAt if moving out of done
                    else if (targetColumnId !== 'done' && task.columnId === 'done') {
                        updates.completedAt = undefined;
                    }

                    return { ...task, ...updates };
                })
            })),

            deleteTask: (taskId) => set((state) => ({
                tasks: state.tasks.filter(t => t.id !== taskId)
            })),

            updateTaskNotes: (taskId, notes) => set((state) => ({
                tasks: state.tasks.map(t =>
                    t.id === taskId ? { ...t, notes } : t
                )
            })),

            updateTaskDate: (taskId, date) => set((state) => ({
                tasks: state.tasks.map(t =>
                    t.id === taskId ? { ...t, scheduledDate: date } : t
                )
            })),

            moveTaskToList: (taskId, targetListId) => set((state) => ({
                tasks: state.tasks.map(t =>
                    t.id === taskId ? { ...t, listId: targetListId } : t
                )
            })),

            reorderTasks: (orderedIds: string[]) => set((state) => {
                const currentTasks = [...state.tasks];
                // 1. Identify indices of the tasks being reordered in the global list
                // We assume orderedIds represents a subset of tasks that we want to re-arrange
                // amongst themselves, preserving their "slots" in the global array.
                const indices = orderedIds
                    .map((id: string) => currentTasks.findIndex(t => t.id === id))
                    .filter((idx: number) => idx !== -1)
                    .sort((a: number, b: number) => a - b);

                if (indices.length !== orderedIds.length) {
                    console.warn("reorderTasks: Some IDs not found in global state, skipping reorder.");
                    return state;
                }

                // 2. Place the tasks verify carefully
                const newTasks = [...currentTasks];
                indices.forEach((globalIndex: number, i: number) => {
                    const taskId = orderedIds[i];
                    const task = currentTasks.find(t => t.id === taskId);
                    if (task) {
                        newTasks[globalIndex] = task;
                    }
                });

                return { tasks: newTasks };
            }),

            addList: (name, color, icon) => set((state) => ({
                lists: [...state.lists, { id: uuidv4(), name, color, icon }]
            })),

            updateList: (listId: string, updates: Partial<List>) => set((state) => ({
                lists: state.lists.map(l =>
                    l.id === listId ? { ...l, ...updates } : l
                )
            })),

            deleteList: (listId) => set((state) => ({
                lists: state.lists.filter(l => l.id !== listId)
            })),

            duplicateList: (listId) => set((state) => {
                const listToDuplicate = state.lists.find(l => l.id === listId);
                if (!listToDuplicate) return state;

                const newList = {
                    ...listToDuplicate,
                    id: uuidv4(),
                    name: `${listToDuplicate.name} Copy`
                };
                return { lists: [...state.lists, newList] };
            }),

            toggleArchiveList: (listId) => set((state) => ({
                lists: state.lists.map(l =>
                    l.id === listId ? { ...l, archived: !l.archived } : l
                )
            })),

            setActiveTask: (taskId) => set((state) => {
                const task = state.tasks.find(t => t.id === taskId);
                const duration = task ? (task.duration || 25) * 60 : 25 * 60;
                return {
                    activeTaskId: taskId,
                    timerState: {
                        mode: 'focus',
                        isRunning: true,
                        remaining: duration,
                        duration: duration
                    }
                };
            }),

            toggleTimer: () => set((state) => ({
                timerState: {
                    ...state.timerState,
                    isRunning: !state.timerState.isRunning
                }
            })),

            tickTimer: () => set((state) => {
                const { remaining, mode, isRunning } = state.timerState;
                const today = getLocalToday();
                let { todayFocusTime, lastActiveDate } = state;

                // Check for day change
                if (today !== lastActiveDate) {
                    todayFocusTime = 0;
                    lastActiveDate = today;
                }

                // Increment productive time if in focus mode and running
                if (mode === 'focus' && isRunning && state.activeTaskId) {
                    todayFocusTime += 1;
                }

                if (remaining <= 0) {
                    if (mode === 'break') {
                        // Break finished -> Switch back to Focus
                        // Restore previous focus remaining time if available
                        const restoredRemaining = state.timerState.lastFocusRemaining ?? (25 * 60);

                        // Find the active task to get the correct total duration
                        const task = state.tasks.find(t => t.id === state.activeTaskId);
                        const defaultDuration = task ? (task.duration || 25) * 60 : 25 * 60;

                        return {
                            todayFocusTime,
                            lastActiveDate,
                            timerState: {
                                mode: 'focus',
                                isRunning: false,
                                remaining: restoredRemaining,
                                duration: defaultDuration,
                                lastFocusRemaining: undefined
                            }
                        };
                    }
                    return {
                        todayFocusTime,
                        lastActiveDate,
                        timerState: { ...state.timerState, isRunning: false, remaining: 0 }
                    };
                }
                return {
                    todayFocusTime,
                    lastActiveDate,
                    timerState: { ...state.timerState, remaining: remaining - 1 }
                };
            }),

            stopTimer: () => set((state) => ({
                timerState: { ...state.timerState, isRunning: false }
            })),

            setTaskDone: (taskId) => set((state) => {
                const task = state.tasks.find(t => t.id === taskId);
                const now = Date.now();
                const today = getLocalToday();

                // Calculate focus time for this session
                const focusTime = task ? (task.duration || 25) * 60 - state.timerState.remaining : 0;

                // Create session log
                const newSession: FocusSession = {
                    id: uuidv4(),
                    taskId,
                    taskTitle: task?.title || 'Unknown',
                    listId: task?.listId || '',
                    startedAt: state.currentSessionStart || now - focusTime * 1000,
                    endedAt: now,
                    focusTime: Math.max(0, focusTime)
                };

                // Update daily focus history
                const dailyFocusHistory = { ...state.dailyFocusHistory };
                dailyFocusHistory[today] = (dailyFocusHistory[today] || 0) + focusTime;

                // Update streak (LeetCode-style: +1 per day, only once per day)
                let streak = state.streak;
                let longestStreak = state.longestStreak;
                let lastStreakDate = state.lastStreakDate || '';
                const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

                // Only update streak if we haven't already counted today
                if (lastStreakDate !== today) {
                    if (lastStreakDate === yesterday) {
                        // Consecutive day - increment streak!
                        streak = streak + 1;
                    } else if (lastStreakDate === '') {
                        // First ever task
                        streak = 1;
                    } else {
                        // Streak broken (missed a day), start fresh
                        streak = 1;
                    }
                    lastStreakDate = today;
                    longestStreak = Math.max(longestStreak, streak);
                }
                // If lastStreakDate === today, don't change streak (already counted today)

                // Milestone tracking
                const newTotalTasks = state.totalTasksCompleted + 1;
                const MILESTONES = [10, 25, 50, 100, 250, 500, 1000];
                let lastMilestone = state.lastMilestone;

                // Check if we crossed a new milestone
                for (const m of MILESTONES) {
                    if (newTotalTasks >= m && state.totalTasksCompleted < m) {
                        lastMilestone = m;
                        break;
                    }
                }

                // XP System - earn XP based on task difficulty
                const XP_VALUES = { easy: 10, medium: 25, deep: 50 };
                const taskDifficulty = task?.difficulty || 'medium';
                let earnedXp = XP_VALUES[taskDifficulty];

                // Streak bonus multiplier - rewards consistency
                // 3+ days = 1.25x, 7+ days = 1.5x, 14+ days = 2x
                const streakMultiplier = streak >= 14 ? 2.0 : streak >= 7 ? 1.5 : streak >= 3 ? 1.25 : 1.0;
                earnedXp = Math.round(earnedXp * streakMultiplier);

                const newXp = state.xp + earnedXp;

                // Level calculation - exponential scaling
                // Level 1: 0 XP, Level 2: 100 XP, Level 3: 250 XP, etc.
                const calculateLevel = (totalXp: number): number => {
                    const LEVEL_THRESHOLDS = [
                        0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200,  // 1-10
                        4000, 5000, 6200, 7600, 9200, 11000, 13000, 15200, 17600, 20250  // 11-20
                    ];
                    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
                        if (totalXp >= LEVEL_THRESHOLDS[i]) return i + 1;
                    }
                    return 1;
                };
                const newLevel = calculateLevel(newXp);

                return {
                    tasks: state.tasks.map(t =>
                        t.id === taskId ? { ...t, columnId: 'done' as ColumnId, completedAt: now } : t
                    ),
                    timerState: { ...state.timerState, isRunning: false },
                    activeTaskId: null,
                    sessions: [...state.sessions, newSession],
                    currentSessionStart: null,
                    dailyFocusHistory,
                    streak,
                    longestStreak,
                    lastStreakDate,
                    lastActiveDate: today,
                    totalTasksCompleted: newTotalTasks,
                    lastMilestone,
                    xp: newXp,
                    level: newLevel
                };
            }),

            logSession: (taskId, focusTime) => set((state) => {
                const task = state.tasks.find(t => t.id === taskId);
                const now = Date.now();
                const today = getLocalToday();

                const newSession: FocusSession = {
                    id: uuidv4(),
                    taskId,
                    taskTitle: task?.title || 'Unknown',
                    listId: task?.listId || '',
                    startedAt: state.currentSessionStart || now - focusTime * 1000,
                    endedAt: now,
                    focusTime
                };

                const dailyFocusHistory = { ...state.dailyFocusHistory };
                dailyFocusHistory[today] = (dailyFocusHistory[today] || 0) + focusTime;

                return {
                    sessions: [...state.sessions, newSession],
                    currentSessionStart: null,
                    dailyFocusHistory
                };
            }),

            startBreak: (duration = 5 * 60) => set((state) => ({
                timerState: {
                    mode: 'break',
                    isRunning: true,
                    remaining: duration,
                    duration: duration,
                    lastFocusRemaining: state.timerState.remaining // Save current focus remaining time
                }
            })),

            endBreak: () => set((state) => {
                const task = state.tasks.find(t => t.id === state.activeTaskId);
                const defaultDuration = task ? (task.duration || 25) * 60 : 25 * 60;

                // Restore from lastFocusRemaining if available, otherwise default
                const restoredRemaining = state.timerState.lastFocusRemaining ?? defaultDuration;

                return {
                    timerState: {
                        mode: 'focus',
                        isRunning: false,
                        remaining: restoredRemaining,
                        duration: defaultDuration,
                        lastFocusRemaining: undefined
                    }
                };
            }),

            // Auto-rollover: Move stale tasks to appropriate columns
            // Today → This Week (if created before today)
            // This Week → Backlog (if older than 7 days)
            rolloverTasks: () => set((state) => {
                const startOfToday = new Date().setHours(0, 0, 0, 0);
                const oneWeekAgo = startOfToday - (7 * 24 * 60 * 60 * 1000);

                const updatedTasks = state.tasks.map(task => {
                    // Skip done tasks
                    if (task.columnId === 'done') return task;

                    // Get task date (scheduled date or created date)
                    const taskDate = task.scheduledDate || task.createdAt;

                    // Today column: move to This Week if task is from before today
                    if (task.columnId === 'today' && taskDate < startOfToday) {
                        return { ...task, columnId: 'this-week' as const };
                    }

                    // This Week column: move to Backlog if older than 7 days
                    if (task.columnId === 'this-week' && taskDate < oneWeekAgo) {
                        return { ...task, columnId: 'backlog' as const };
                    }

                    return task;
                });

                return { tasks: updatedTasks };
            }),

            // Premium Features
            userTier: 'free',
            setTier: (tier) => set({ userTier: tier }),
            isPremium: (): boolean => {
                const tier = (useTaskStore.getState?.() as any)?.userTier || 'free';
                return tier === 'pro' || tier === 'lifetime';
            },

            markDailyLogin: () => set((state) => {
                const today = getLocalToday();
                const dailyFocusHistory = { ...state.dailyFocusHistory };

                // If today has less than 1 minute of activity, set it to 1 minute (60s)
                // This ensures the heatmap shows green for the day just by logging in.
                if ((dailyFocusHistory[today] || 0) < 60) {
                    dailyFocusHistory[today] = 60;
                }

                return { dailyFocusHistory };
            })
        }),
        {
            name: 'prime-it-task-storage',
            storage: createJSONStorage(() => storage),
            version: 1, // Increment to force migration
            migrate: (persistedState: any, version: number) => {
                // Migration: Reset userTier to 'free' for users who got mock-upgraded
                if (version === 0) {
                    return {
                        ...persistedState,
                        userTier: 'free'
                    };
                }
                return persistedState;
            }
        }
    )
);
