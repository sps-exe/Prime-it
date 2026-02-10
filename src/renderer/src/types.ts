
export type ColumnId = 'backlog' | 'this-week' | 'today' | 'done';

export interface Task {
    id: string;
    title: string;
    duration: number; // in minutes
    columnId: ColumnId;
    listId?: string; // Optional linkage to a user-created list
    notes?: string;   // Optional rich text notes
    scheduledDate?: number; // Unix timestamp for scheduled date
    difficulty?: 'easy' | 'medium' | 'deep'; // Task difficulty level
    createdAt: number;
    completedAt?: number; // Unix timestamp for completion date
}

export interface List {
    id: string;
    name: string;
    color: string; // Hex code
    icon?: string;
    archived?: boolean;
}

// For dnd-kit
export interface DragItem {
    id: string;
    type: 'TASK';
}

// For Reports - Focus Session Logging
export interface FocusSession {
    id: string;
    taskId: string;
    taskTitle: string;
    listId: string;
    startedAt: number;  // Unix timestamp
    endedAt: number;    // Unix timestamp
    focusTime: number;  // Seconds of actual focus (excludes breaks)
}

export interface TaskState {
    tasks: Task[];
    lists: List[];

    // Actions
    addTask: (title: string, duration: number, columnId: ColumnId, listId?: string, difficulty?: 'easy' | 'medium' | 'deep') => void;
    moveTask: (taskId: string, targetColumnId: ColumnId) => void;
    deleteTask: (taskId: string) => void;
    updateTaskNotes: (taskId: string, notes: string) => void;
    updateTaskDate: (taskId: string, date: number | undefined) => void;
    moveTaskToList: (taskId: string, targetListId: string) => void;
    reorderTasks: (orderedIds: string[]) => void;

    addList: (name: string, color: string, icon?: string) => void; // Updated signature
    updateList: (listId: string, updates: Partial<List>) => void;
    deleteList: (listId: string) => void;
    duplicateList: (listId: string) => void;
    toggleArchiveList: (listId: string) => void;

    // Focus Mode
    activeTaskId: string | null;
    timerState: {
        mode: 'focus' | 'break';
        isRunning: boolean;
        remaining: number; // countdown in seconds
        duration: number; // total duration for progress calculation
        lastFocusRemaining?: number; // Store focus time during break
    };
    todayFocusTime: number; // Total productive time in seconds for today
    lastActiveDate: string; // Date string YYYY-MM-DD to track day changes

    // Reports Data
    sessions: FocusSession[];
    currentSessionStart: number | null;
    streak: number;
    longestStreak: number;
    lastStreakDate: string; // Track when streak was last incremented (YYYY-MM-DD)
    dailyFocusHistory: Record<string, number>; // { 'YYYY-MM-DD': seconds }

    // Gamification
    totalTasksCompleted: number; // Lifetime tasks completed
    lastMilestone: number; // Last milestone reached (10, 50, 100, etc.)
    xp: number; // Total experience points
    level: number; // Current level (1-50)

    setActiveTask: (taskId: string | null) => void;
    toggleTimer: () => void;
    tickTimer: () => void;
    stopTimer: () => void;
    setTaskDone: (taskId: string) => void;
    startBreak: (duration?: number) => void;
    endBreak: () => void;
    logSession: (taskId: string, focusTime: number) => void;
    rolloverTasks: () => void; // Auto-move stale tasks

    // Premium Features
    userTier: 'free' | 'pro' | 'lifetime';
    setTier: (tier: 'free' | 'pro' | 'lifetime') => void;
    isPremium: () => boolean;
}
