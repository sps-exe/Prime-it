import { ArrowLeft, Search, LayoutGrid, Settings, Plus, CheckCircle2, Zap, Flame, Brain } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTaskStore } from '../../store/useTaskStore';
import { TaskCard } from './TaskCard';
import { SortableTask } from './SortableTask';
import { clsx } from 'clsx';
import { useState, useMemo } from 'react';
import { ColumnId, Task, TaskState } from '../../types';
import { useNavigate } from 'react-router-dom';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';

interface BoardViewProps {
    listId: string;
    onBack: () => void;
}

export function BoardView({ listId, onBack }: BoardViewProps) {
    const lists = useTaskStore((state: TaskState) => state.lists);
    const activeList = lists.find((l) => l.id === listId);
    const navigate = useNavigate();

    const tasks = useTaskStore((state: TaskState) => state.tasks);
    const moveTask = useTaskStore((state: TaskState) => state.moveTask);
    const reorderTasks = useTaskStore((state: TaskState) => state.reorderTasks);

    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Avoid accidental drags - allows clicks and text selection
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );


    const filteredTasks = useMemo(() => tasks.filter(t => t.listId === listId), [tasks, listId]);

    // Derived state for columns to pass to SortableContext
    const getTasksByColumn = (colId: ColumnId) => {
        return filteredTasks.filter(t => t.columnId === colId);
    };

    // Fallback if list not found
    if (!activeList) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <p className="text-red-500">Error: List not found.</p>
                <button onClick={onBack} className="ml-4 underline text-white">Go Back</button>
            </div>
        );
    }

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        // Find the tasks
        const activeTask = tasks.find(t => t.id === activeId);
        const overTask = tasks.find(t => t.id === overId);

        if (!activeTask) return;

        // If over is a container (column)
        if (['backlog', 'this-week', 'today', 'done'].includes(overId)) {
            const overColumnId = overId as ColumnId;
            if (activeTask.columnId !== overColumnId) {
                moveTask(activeId, overColumnId);
            }
            return;
        }

        // If over is another task
        if (overTask && activeTask.columnId !== overTask.columnId) {
            moveTask(activeId, overTask.columnId);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        if (activeId === overId) return;

        const activeTask = tasks.find(t => t.id === activeId);
        const overTask = tasks.find(t => t.id === overId);

        if (!activeTask) return;

        // Reordering within the same column (or after dragOver moved it)
        // If we are here, handleDragOver should have already ensured they are in the same column
        // But we need to check to be sure, or just proceed with arrayMove logic on the subset.

        // If over is a column, we already moved it in dragOver. Logic done.
        if (['backlog', 'this-week', 'today', 'done'].includes(overId)) return;

        if (overTask && activeTask.columnId === overTask.columnId) {
            // Get the tasks for this column
            const columnTasks = getTasksByColumn(activeTask.columnId);
            const oldIndex = columnTasks.findIndex(t => t.id === activeId);
            const newIndex = columnTasks.findIndex(t => t.id === overId);

            if (oldIndex !== -1 && newIndex !== -1) {
                const newOrderedHelpers = arrayMove(columnTasks, oldIndex, newIndex);
                // Extract IDs
                const newOrderedIds = newOrderedHelpers.map(t => t.id);
                // Call store to reorder
                reorderTasks(newOrderedIds);
            }
        }
    };

    // Done Filter State
    const [doneFilter, setDoneFilter] = useState<'today' | 'weekly'>('today');

    // Filter Done Tasks
    const getFilteredDoneTasks = () => {
        const doneTasks = getTasksByColumn('done');
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const startOfWeek = new Date(now.setDate(now.getDate() - 7)).getTime(); // Last 7 days rolling

        return doneTasks.filter(task => {
            if (!task.completedAt) return false; // Should have it, but safety check
            if (doneFilter === 'today') {
                return task.completedAt >= startOfDay;
            } else {
                return task.completedAt >= startOfWeek;
            }
        });
    };

    const filteredDoneTasks = getFilteredDoneTasks();

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="h-full w-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 pt-2 px-1">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-white uppercase tracking-wider transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>

                        <div className="flex items-center gap-2 bg-[#1a1a20] border border-white/10 px-3 py-1.5 rounded-lg shadow-sm">
                            <div className={clsx("w-5 h-5 rounded flex items-center justify-center text-white text-xs font-bold", activeList.color)}>
                                {activeList.name[0]}
                            </div>
                            <span className="font-bold text-white text-sm">{activeList.name}</span>
                        </div>

                        <span className="text-sm text-gray-600 font-medium">{filteredTasks.length === 0 ? "This list has no tasks" : `${filteredTasks.length} tasks`}</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-400">
                        <Button variant="secondary" className="text-xs bg-[#1a1a20] border border-white/10 !text-white flex items-center gap-1 py-1.5 h-auto shadow-sm hover:bg-[#25252e]">
                            ⚡ Upgrade Now
                        </Button>
                        <Search className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                        <LayoutGrid className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                        <Settings className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                        <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                            S
                        </div>
                    </div>
                </div>

                {/* Kanban Board */}
                <div className="flex-1 overflow-x-auto pb-4">
                    <div className="flex gap-4 h-full min-w-[1000px]">
                        {/* Backlog Column */}
                        <KanbanColumn
                            title="Backlog"
                            columnId="backlog"
                            listId={listId}
                            tasks={getTasksByColumn('backlog')}
                        />

                        {/* This Week Column (with progress) */}
                        <KanbanColumn
                            title="This Week"
                            columnId="this-week"
                            listId={listId}
                            hasProgress
                            tasks={getTasksByColumn('this-week')}
                        />

                        {/* Today Column (Special Styling) */}
                        <KanbanColumn
                            title="Today"
                            columnId="today"
                            listId={listId}
                            hasProgress
                            isToday
                            navigate={navigate}
                            tasks={getTasksByColumn('today')}
                            stats={{
                                done: getTasksByColumn('done').filter(t => {
                                    if (!t.completedAt) return false;
                                    const now = new Date();
                                    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                                    return t.completedAt >= startOfDay;
                                }).length,
                                total: getTasksByColumn('today').length + getTasksByColumn('done').filter(t => {
                                    if (!t.completedAt) return false;
                                    const now = new Date();
                                    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                                    return t.completedAt >= startOfDay;
                                }).length
                            }}
                        />

                        {/* Done Column */}
                        <KanbanColumn
                            title="Done"
                            columnId="done"
                            listId={listId}
                            hasHeaderBadge
                            tasks={filteredDoneTasks}
                            stats={{
                                done: filteredDoneTasks.length,
                                total: filteredDoneTasks.length
                            }}
                            headerAction={
                                <div className="relative">
                                    <select
                                        value={doneFilter}
                                        onChange={(e) => setDoneFilter(e.target.value as 'today' | 'weekly')}
                                        className="appearance-none bg-[#1a1a20] text-gray-400 text-[10px] font-bold uppercase tracking-wider border border-white/10 rounded px-2 py-1 pr-6 cursor-pointer hover:bg-white/5 outline-none focus:border-purple-500/50"
                                    >
                                        <option value="today">Today</option>
                                        <option value="weekly">Weekly</option>
                                    </select>
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-2 h-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            }
                        />
                    </div>
                </div>

                {/* Drag Overlay */}
                <DragOverlay>
                    {activeId ? (
                        <TaskCard task={tasks.find(t => t.id === activeId)!} />
                    ) : null}
                </DragOverlay>
            </div>
        </DndContext>
    );
}

function KanbanColumn({
    title,
    columnId,
    listId,
    hasProgress,
    isToday,
    hasHeaderBadge,
    navigate,
    tasks,
    stats,
    headerAction
}: {
    title: string,
    columnId: ColumnId,
    listId: string,
    hasProgress?: boolean,
    isToday?: boolean,
    hasHeaderBadge?: boolean,
    navigate?: any,
    tasks: Task[],
    stats?: {
        done: number,
        total: number
    },
    headerAction?: React.ReactNode
}) {
    const [isAdding, setIsAdding] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [estTime, setEstTime] = useState('00:25');
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'deep'>('medium');

    const addTask = useTaskStore((state: TaskState) => state.addTask);

    // Sort tasks: overdue first (for Today column), then by creation time
    const sortedTasks = useMemo(() => {
        if (columnId !== 'today') return tasks;

        const startOfToday = new Date().setHours(0, 0, 0, 0);

        return [...tasks].sort((a, b) => {
            // Check if overdue (has scheduled date before today)
            const aOverdue = a.scheduledDate && a.scheduledDate < startOfToday;
            const bOverdue = b.scheduledDate && b.scheduledDate < startOfToday;

            // Overdue tasks come first
            if (aOverdue && !bOverdue) return -1;
            if (!aOverdue && bOverdue) return 1;

            // Then sort by creation time (newest first)
            return b.createdAt - a.createdAt;
        });
    }, [tasks, columnId]);

    const { setNodeRef } = useDroppable({
        id: columnId,
    });

    const handleAddTask = () => {
        if (!newTaskTitle.trim()) return;

        // Auto-set time based on difficulty if using default
        const difficultyTimes = { easy: 15, medium: 25, deep: 45 };
        let minutes = difficultyTimes[difficulty];

        // If user manually set time, use that instead
        if (estTime !== '00:25' && estTime !== '00:00') {
            if (estTime.includes(':')) {
                const parts = estTime.split(':').map(Number);
                minutes = (parts[0] || 0) * 60 + (parts[1] || 0);
            } else {
                minutes = parseInt(estTime) || minutes;
            }
        }

        addTask(newTaskTitle, minutes, columnId, listId, difficulty);
        setNewTaskTitle('');
        setEstTime('00:25');
        setDifficulty('medium');
        setIsAdding(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (e.metaKey || e.ctrlKey) {
                // Cmd+Enter / Ctrl+Enter: Submit immediately
                handleAddTask();
            } else {
                // Regular Enter: Submit if valid
                handleAddTask();
            }
        }
        if (e.key === 'Escape') setIsAdding(false);
    };

    return (
        <div
            ref={setNodeRef}
            className={clsx(
                "flex-1 flex flex-col rounded-[20px] h-full relative overflow-hidden transition-all border border-white/5",
                isToday
                    ? "bg-[#0f0f13] ring-1 ring-purple-500/50 shadow-lg shadow-purple-500/10"
                    : "bg-[#0f0f13]"
            )}
        >
            {/* Today Gradient Border Effect (Optional) */}
            {isToday && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500"></div>}

            <div className="p-5 flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg text-white">{title}</h3>

                    {hasHeaderBadge && stats && (
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full font-bold border border-orange-500/20">
                                {stats.done} tasks 🎉
                            </span>
                            {headerAction}
                        </div>
                    )}

                    {!hasHeaderBadge && (
                        <button className="text-gray-500 hover:text-white transition-colors" onClick={() => setIsAdding(true)}>
                            <Plus className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Progress Bar */}
                {hasProgress && stats && (
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex-1 bg-gray-800 h-1.5 rounded-full overflow-hidden">
                            <div
                                className="bg-gray-600 h-full transition-all duration-500"
                                style={{ width: `${stats.total > 0 ? (stats.done / stats.total) * 100 : 0}%` }}
                            ></div>
                        </div>
                        <span className="text-[10px] text-gray-500 font-bold">{stats.done}/{stats.total} Done</span>
                    </div>
                )}

                {/* Add Task Button (Visible if not adding) */}
                {!hasHeaderBadge && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-full text-left text-xs font-bold text-gray-500 hover:text-white flex items-center gap-2 mb-4 transition-colors uppercase tracking-wide"
                    >
                        <Plus className="w-3 h-3" /> Add Task
                    </button>
                )}

                {/* Inline Add Task Input */}
                {isAdding && (
                    <div className="bg-[#1a1a20] p-4 rounded-xl shadow-lg border border-white/10 mb-4 animate-in zoom-in-95 duration-200">
                        {/* Cancel Header */}
                        <div className="flex items-center gap-2 mb-4 cursor-pointer hover:opacity-80" onClick={() => setIsAdding(false)}>
                            <span className="text-gray-500 text-xs font-bold">×</span>
                            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">CANCEL</span>
                        </div>

                        <div className="flex gap-3 mb-4">
                            {/* Title Input */}
                            <div className="flex-1">
                                <label className="text-[10px] text-gray-500 font-bold mb-1 block">Title</label>
                                <input
                                    autoFocus
                                    className="w-full text-sm font-medium text-white bg-[#0a0a0f] placeholder:text-gray-600 outline-none border border-green-500/50 rounded-lg px-2 py-1.5 focus:ring-1 focus:ring-green-500"
                                    placeholder="Enter task title*"
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>

                            {/* Est Time Input */}
                            <div className="w-20">
                                <label className="text-[10px] text-gray-500 font-bold mb-1 block">Est time</label>
                                <input
                                    className="w-full text-sm font-mono text-white bg-[#0a0a0f] text-center outline-none border border-white/10 rounded-lg py-1.5"
                                    value={estTime}
                                    onChange={(e) => setEstTime(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Difficulty Selector */}
                        <div className="mb-4">
                            <label className="text-[10px] text-gray-500 font-bold mb-2 block">Difficulty</label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => { setDifficulty('easy'); setEstTime('00:15'); }}
                                    className={clsx(
                                        "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all border",
                                        difficulty === 'easy'
                                            ? "bg-green-500/20 text-green-400 border-green-500/50"
                                            : "bg-[#0a0a0f] text-gray-400 border-white/10 hover:border-green-500/30"
                                    )}
                                >
                                    <Zap className="w-3.5 h-3.5" /> Easy
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setDifficulty('medium'); setEstTime('00:25'); }}
                                    className={clsx(
                                        "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all border",
                                        difficulty === 'medium'
                                            ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                                            : "bg-[#0a0a0f] text-gray-400 border-white/10 hover:border-yellow-500/30"
                                    )}
                                >
                                    <Flame className="w-3.5 h-3.5" /> Medium
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setDifficulty('deep'); setEstTime('00:45'); }}
                                    className={clsx(
                                        "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all border",
                                        difficulty === 'deep'
                                            ? "bg-red-500/20 text-red-400 border-red-500/50"
                                            : "bg-[#0a0a0f] text-gray-400 border-white/10 hover:border-red-500/30"
                                    )}
                                >
                                    <Brain className="w-3.5 h-3.5" /> Deep
                                </button>
                            </div>
                        </div>
                        {/* Footer Actions */}
                        <div className="flex items-center justify-between border-t border-white/5 pt-3">
                            <span className="text-[10px] text-gray-600 font-medium">Add a new task</span>
                            <button
                                onClick={handleAddTask}
                                className="bg-white hover:bg-gray-200 text-black text-xs font-bold px-4 py-1.5 rounded-full transition-colors"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                )}

                {/* Tasks List (Sortable Context) */}
                <SortableContext
                    items={sortedTasks.map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                        {sortedTasks.length > 0 ? (
                            <div className="space-y-3">
                                {sortedTasks.map(task => (
                                    <SortableTask key={task.id} task={task} />
                                ))}
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="h-full flex flex-col items-center justify-center text-gray-700 pb-10">
                                {/* Colorful Check Circle */}
                                <div className="w-8 h-8 rounded-full border-2 border-transparent bg-gradient-to-tr from-teal-900 to-purple-900 p-[1px] mb-2 opacity-30">
                                    <div className="w-full h-full bg-[#0f0f13] rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="w-4 h-4 text-teal-700" />
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-gray-800 uppercase tracking-widest">All Clear</span>
                            </div>
                        )}
                    </div>
                </SortableContext>

                {/* Today Column "Blitzit now" Button */}
                {isToday && (
                    <div className="mt-4">
                        <Button
                            onClick={async () => {
                                console.log('[Blitzit Now] Button clicked');
                                try {
                                    if ((window as any).ipcRenderer?.invoke) {
                                        await (window as any).ipcRenderer.invoke('set-overlay-mode', true);
                                    }
                                } catch (err) {
                                    console.error(err);
                                }
                                if (navigate) navigate('/focus');
                                else window.location.hash = '#/focus';
                            }}
                            className="w-full bg-[#1a1a20] border border-white/10 !text-gray-400 hover:!text-white hover:border-white/20 shadow-sm rounded-2xl py-3 text-sm font-bold flex items-center justify-center gap-2 transition-all">
                            Prime it now
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
