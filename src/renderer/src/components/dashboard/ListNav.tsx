import { Plus } from 'lucide-react';

interface ListNavProps {
    onCreateList: () => void;
    currentView: 'active' | 'archived';
    onViewChange: (view: 'active' | 'archived') => void;
}

export function ListNav({ onCreateList, currentView, onViewChange }: ListNavProps) {

    return (
        <div className="space-y-3">
            <button
                onClick={onCreateList}
                className="w-full bg-[#0f0f13] border border-purple-500/20 hover:bg-[#1a1a20] rounded-xl p-4 flex items-center justify-between group transition-all"
            >
                <span className="text-white font-medium">Create List (+)</span>
                <div className="w-6 h-6 rounded-full border border-gray-600 flex items-center justify-center group-hover:border-white transition-colors">
                    <Plus className="w-4 h-4 text-gray-400 group-hover:text-white" />
                </div>
            </button>

            <button
                onClick={() => onViewChange('active')}
                className={`w-full bg-[#0f0f13] border ${currentView === 'active' ? 'border-purple-500/50 bg-[#1a1a20]' : 'border-purple-500/20'} hover:bg-[#1a1a20] rounded-xl p-4 flex items-center justify-between group transition-all text-left`}
            >
                <span className={`${currentView === 'active' ? 'text-white' : 'text-gray-400'} group-hover:text-white font-medium`}>List</span>
            </button>

            <button
                onClick={() => onViewChange('archived')}
                className={`w-full bg-[#0f0f13] border ${currentView === 'archived' ? 'border-purple-500/50 bg-[#1a1a20]' : 'border-purple-500/20'} hover:bg-[#1a1a20] rounded-xl p-4 flex items-center justify-between group transition-all text-left`}
            >
                <span className={`${currentView === 'archived' ? 'text-white' : 'text-gray-400'} group-hover:text-white font-medium`}>Archived</span>
            </button>
        </div>
    );
}
