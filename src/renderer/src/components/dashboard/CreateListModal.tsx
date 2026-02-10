import { useState, useEffect } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { clsx } from "clsx"; // Using clsx for conditional classes
import { List } from '../../types';

interface CreateListModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (name: string, color: string, icon?: string) => void;
    listToEdit?: List | null;
}

const COLORS = [
    { id: 'gradient', value: 'bg-gradient-to-tr from-pink-400 to-blue-500' },
    { id: 'blue', value: 'bg-blue-500' },
    { id: 'lime', value: 'bg-lime-400' },
    { id: 'purple', value: 'bg-purple-500' },
    { id: 'teal', value: 'bg-teal-400' },
    { id: 'yellow', value: 'bg-yellow-400' },
    { id: 'black', value: 'bg-gray-900' },
    { id: 'red', value: 'bg-red-500' },
    { id: 'orange', value: 'bg-orange-500' },
];

export function CreateListModal({ isOpen, onClose, onConfirm, listToEdit }: CreateListModalProps) {
    const [title, setTitle] = useState('');
    const [selectedColor, setSelectedColor] = useState(COLORS[3]); // Default Purple

    useEffect(() => {
        if (isOpen) {
            if (listToEdit) {
                setTitle(listToEdit.name);
                const colorObj = COLORS.find(c => c.value === listToEdit.color) || COLORS[3];
                setSelectedColor(colorObj);
            } else {
                setTitle('');
                setSelectedColor(COLORS[3]);
            }
        }
    }, [isOpen, listToEdit]);

    if (!isOpen) return null;

    const handleConfirm = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        onConfirm(title, selectedColor.value);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-[#1a1a20] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-end p-4">
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-10 pb-10 text-center">
                    <h2 className="text-xl font-bold text-white mb-8">
                        {listToEdit ? 'Edit list' : 'Create a new list'}
                    </h2>

                    {/* Icon Upload Placeholder */}
                    <div className="flex flex-col items-center mb-8 group cursor-pointer">
                        <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-3 group-hover:bg-purple-500/30 transition-colors">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white">
                                <ImageIcon className="w-4 h-4" />
                            </div>
                        </div>
                        <span className="text-xs font-bold text-gray-300">UPLOAD AN ICON</span>
                        <span className="text-[10px] text-gray-500">Optional (jpg, png, svg)</span>
                    </div>

                    {/* Color Picker */}
                    <div className="mb-6">
                        <p className="text-sm text-gray-400 mb-3 text-left">Pick a list color</p>
                        <div className="flex gap-3 justify-center sm:justify-start flex-wrap">
                            {COLORS.map((color) => (
                                <button
                                    key={color.id}
                                    type="button"
                                    onClick={() => setSelectedColor(color)}
                                    className={clsx(
                                        "w-6 h-6 rounded-full transition-transform hover:scale-110",
                                        color.value,
                                        selectedColor.id === color.id ? "ring-2 ring-offset-2 ring-offset-[#1a1a20] ring-purple-400 scale-110" : ""
                                    )}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleConfirm} className="space-y-8">
                        <Input
                            placeholder="Enter your list title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="text-center bg-[#0f0f13] border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500"
                            autoFocus
                        />

                        <div className="flex gap-4">
                            <Button
                                type="button"
                                variant="secondary"
                                fullWidth
                                onClick={onClose}
                                className="bg-[#0f0f13] border border-white/10 !text-gray-300 hover:bg-white/5 hover:border-white/20"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                fullWidth
                                disabled={!title.trim()}
                                className="bg-gradient-to-r from-purple-500 to-pink-500 border-none text-white hover:opacity-90 disabled:opacity-50"
                            >
                                {listToEdit ? 'Save Changes' : 'Create'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
