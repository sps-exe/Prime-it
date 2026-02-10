import { useState, useEffect } from 'react';
import { MoreVertical, Edit2, Copy, Archive, Trash2 } from 'lucide-react';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { CreateListModal } from '../../components/dashboard/CreateListModal';
import { BoardView } from '../../components/dashboard/BoardView';
import { ProductivityTimer } from '../../components/dashboard/ProductivityTimer';
import { HeatMap } from '../../components/dashboard/HeatMap';
import { ListNav } from '../../components/dashboard/ListNav';
import { useTaskStore } from '../../store/useTaskStore';
import { List } from '../../types';

export default function DashboardPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [activeListId, setActiveListId] = useState<string | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'active' | 'archived'>('active');
    const [editingList, setEditingList] = useState<List | null>(null);

    // Select lists and addList
    const lists = useTaskStore((state) => state.lists);
    const addList = useTaskStore((state) => state.addList);
    const updateList = useTaskStore((state) => state.updateList);
    const deleteList = useTaskStore((state) => state.deleteList);
    const duplicateList = useTaskStore((state) => state.duplicateList);
    const toggleArchiveList = useTaskStore((state) => state.toggleArchiveList);
    const tasks = useTaskStore((state) => state.tasks);
    const rolloverTasks = useTaskStore((state) => state.rolloverTasks);

    // Auto-rollover stale tasks on app startup
    useEffect(() => {
        rolloverTasks();
    }, [rolloverTasks]);

    // Helper to get pending task count
    const getPendingCount = (listId?: string) => {
        if (!listId) return 0;
        return tasks.filter(t => t.listId === listId && t.columnId !== 'done').length;
    };

    const handleCreateOrUpdateList = (name: string, color: string, icon?: string) => {
        if (editingList) {
            updateList(editingList.id, { name, color, icon });
            setEditingList(null);
        } else {
            if (lists.length >= 8) {
                alert("You can only add a max of 8 lists!");
                setIsCreateModalOpen(false);
                return;
            }
            addList(name, color, icon);
            // Find the newly created list (simplistic approach: last added)
            // Note: This might be slightly off if state update is async/batched, but usually fine for this interaction
            setTimeout(() => {
                const updatedLists = useTaskStore.getState().lists;
                const newList = updatedLists[updatedLists.length - 1];
                if (newList) {
                    setActiveListId(newList.id);
                }
            }, 50);
        }
        setIsCreateModalOpen(false);
    };

    // Calculate dynamic grid size based on number of lists (Timer is now in sidebar)
    // If 1 item: full width. 2 items: half width. 3 items: third width. 4+ items: quarter width.
    const totalItems = lists.filter(l => viewMode === 'active' ? !l.archived : l.archived).length;
    let gridColClass = "col-span-12 md:col-span-4 lg:col-span-3"; // Default 4 per row

    if (totalItems === 1) gridColClass = "col-span-12";
    else if (totalItems === 2) gridColClass = "col-span-12 md:col-span-6";
    else if (totalItems === 3) gridColClass = "col-span-12 md:col-span-6 lg:col-span-4";
    else gridColClass = "col-span-12 md:col-span-4 lg:col-span-3";

    // If a list is active, show the Board View
    if (activeListId) {
        return (
            <BoardView
                listId={activeListId}
                onBack={() => setActiveListId(null)}
            />
        );
    }

    // Filter/Mock specific lists for the view if needed, or just show first two
    // For now, we'll just show placeholders for Work and Personal to match design
    // In a real app, these would probably mapped to specific lists


    return (
        <div className="h-full" onClick={() => setOpenMenuId(null)}>
            <DashboardHeader />

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-12 gap-8 h-full">
                    {/* Left Sidebar: List Controls (Fixed) */}
                    <div className="col-span-12 md:col-span-3 lg:col-span-3 border-r border-white/5 pr-6 hidden md:block">
                        <div className="sticky top-6">
                            <div className="mb-6">
                                <ProductivityTimer />
                            </div>
                            <ListNav
                                onCreateList={() => { setEditingList(null); setIsCreateModalOpen(true); }}
                                currentView={viewMode}
                                onViewChange={setViewMode}
                            />
                        </div>
                    </div>

                    {/* Mobile Nav (visible only on small screens) */}
                    <div className="col-span-12 md:hidden mb-4 space-y-4">
                        <ProductivityTimer />
                        <ListNav
                            onCreateList={() => { setEditingList(null); setIsCreateModalOpen(true); }}
                            currentView={viewMode}
                            onViewChange={setViewMode}
                        />
                    </div>

                    {/* Right Content: Timer + Lists + Heatmap */}
                    <div className="col-span-12 md:col-span-9 lg:col-span-9 flex flex-col gap-8">
                        {/* Lists Grid */}
                        <div className="grid grid-cols-12 gap-6">

                            {lists.filter(l => viewMode === 'active' ? !l.archived : l.archived).map(list => (
                                <div key={list.id} className={gridColClass}>
                                    <div
                                        onClick={() => setActiveListId(list.id)}
                                        className="bg-[#0f0f13] border border-purple-500/20 rounded-3xl p-5 h-[220px] relative transition-all group cursor-pointer hover:border-purple-500/50 hover:bg-[#15151a]"
                                    >
                                        <div className="absolute inset-0 rounded-3xl border border-purple-500/20 pointer-events-none"></div>
                                        <div className="flex items-center justify-between mb-4 relative z-10">
                                            <h3 className="text-white font-medium text-lg truncate pr-2">{list.name}</h3>

                                            {/* Context Menu */}
                                            <div className="relative">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenMenuId(openMenuId === list.id ? null : list.id);
                                                    }}
                                                    className="p-1 -mr-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
                                                >
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>

                                                {openMenuId === list.id && (
                                                    <div className="absolute right-0 top-8 w-48 bg-[#1A1A1A] border border-gray-800 rounded-xl shadow-xl z-50 overflow-hidden transform origin-top-right">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setOpenMenuId(null);
                                                                setEditingList(list);
                                                                setIsCreateModalOpen(true);
                                                            }}
                                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
                                                        >
                                                            <Edit2 className="w-4 h-4" /> Edit List
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (lists.length >= 8) {
                                                                    alert("You can only add a max of 8 lists!");
                                                                    setOpenMenuId(null);
                                                                    return;
                                                                }
                                                                duplicateList(list.id);
                                                                setOpenMenuId(null);
                                                            }}
                                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
                                                        >
                                                            <Copy className="w-4 h-4" /> Duplicate
                                                        </button>
                                                        <div className="h-px bg-gray-800 my-1"></div>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); toggleArchiveList(list.id); setOpenMenuId(null); }}
                                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
                                                        >
                                                            <Archive className="w-4 h-4" /> Archive List
                                                        </button>
                                                        {/* Prevent deletion of default lists */}
                                                        {!['default-1', 'default-2'].includes(list.id) && (
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); deleteList(list.id); setOpenMenuId(null); }}
                                                                className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-2"
                                                            >
                                                                <Trash2 className="w-4 h-4" /> Delete List
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="h-[120px] flex flex-col items-center justify-center">
                                            <div className="text-4xl font-bold text-white mb-2">
                                                {getPendingCount(list.id)}
                                            </div>
                                            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Pending Tasks</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <HeatMap />
                    </div>
                </div>

                <CreateListModal
                    isOpen={isCreateModalOpen}
                    onClose={() => { setIsCreateModalOpen(false); setEditingList(null); }}
                    onConfirm={handleCreateOrUpdateList}
                    listToEdit={editingList}
                />
            </div>
        </div>
    );
}
