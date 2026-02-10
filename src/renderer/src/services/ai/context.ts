
import { useTaskStore } from '../../store/useTaskStore';
import { Task } from '../../types';

export function gatherUserContext(): string {
    const state = useTaskStore.getState();
    const tasks: Task[] = state.tasks;
    const streak = state.streak;
    const focusTimeToday = state.todayFocusTime;

    // Filter for today's tasks
    const todayTasks = tasks.filter((t: Task) => t.columnId === 'today');
    const doneToday = todayTasks.filter((t: Task) => t.completedAt).length;
    const pendingTasks = todayTasks.filter((t: Task) => !t.completedAt);

    // Sort pending by priority/difficulty if available, else just title
    const pendingList = pendingTasks.map((t: Task) =>
        `- ${t.title} (${t.duration || 25}m)${t.difficulty ? ` [${t.difficulty}]` : ''}`
    ).join('\n');

    const doneList = todayTasks.filter((t: Task) => t.completedAt).map((t: Task) =>
        `- ${t.title} (Done)`
    ).join('\n');

    return `
User Context:
- Current Streak: ${streak} days
- Focus Time Today: ${Math.round(focusTimeToday / 60)} minutes
- Tasks Completed Today: ${doneToday}
- Tasks Remaining Today: ${pendingTasks.length}

Pending Tasks:
${pendingList || '(None)'}

Completed Tasks:
${doneList || '(None)'}

The user is strictly focusing on productivity. Be concise, encouraging, and action-oriented.
`;
}
