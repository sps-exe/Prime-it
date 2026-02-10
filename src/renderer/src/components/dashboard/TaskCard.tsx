import { Task, ColumnId } from '../../types';
import { CheckCircle2, List, FileText, ArrowLeft, ArrowRight, MoreVertical, Copy, Calendar, ArrowRightLeft, Trash2, Mic, Pause, X, Check, Bold, Italic, Strikethrough, Undo, Redo, AlertTriangle, Zap, Brain, Flame } from 'lucide-react';
import { useTaskStore } from '../../store/useTaskStore';
import { clsx } from 'clsx';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TaskCardProps {
    task: Task;
}

const COLUMN_ORDER: ColumnId[] = ['backlog', 'this-week', 'today', 'done'];

// Difficulty configuration
const DIFFICULTY_CONFIG = {
    easy: { label: 'Easy', duration: 15, color: 'text-green-400', bgColor: 'bg-green-500/20', icon: Zap },
    medium: { label: 'Medium', duration: 25, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', icon: Flame },
    deep: { label: 'Deep', duration: 45, color: 'text-red-400', bgColor: 'bg-red-500/20', icon: Brain }
};

// Check if task is overdue
const isTaskOverdue = (task: Task): boolean => {
    if (task.columnId === 'done') return false; // Completed tasks can't be overdue
    if (!task.scheduledDate) return false; // No due date set

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const dueDate = new Date(task.scheduledDate);
    const dueDateStart = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate()).getTime();

    return dueDateStart < today; // Due date is before today
};

export function TaskCard({ task }: TaskCardProps) {
    const moveTask = useTaskStore((state) => state.moveTask);
    const deleteTask = useTaskStore((state) => state.deleteTask);
    const addTask = useTaskStore((state) => state.addTask);
    const updateTaskNotes = useTaskStore((state) => state.updateTaskNotes);

    // Computed: is this task overdue?
    const isOverdue = isTaskOverdue(task);
    const difficulty = task.difficulty ? DIFFICULTY_CONFIG[task.difficulty] : null;

    // UI State
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [noteContent, setNoteContent] = useState(task.notes || '');

    // Voice / Recording State
    const [isListening, setIsListening] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [tempTranscript, setTempTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState(''); // Added interim support

    // Refs
    const buttonRef = useRef<HTMLButtonElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<HTMLDivElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const recognitionRef = useRef<any>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [subMenu, setSubMenu] = useState<'schedule' | 'lists' | null>(null); // NEW: Submenu state

    // Store Selectors
    const lists = useTaskStore((state) => state.lists);
    const updateTaskDate = useTaskStore((state) => state.updateTaskDate);
    const moveTaskToList = useTaskStore((state) => state.moveTaskToList);

    const handleSchedule = (value: string) => {
        let dateTimestamp: number | undefined;
        const now = new Date();

        if (value === 'today') {
            dateTimestamp = now.getTime();
        } else if (value === 'tomorrow') {
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            dateTimestamp = tomorrow.getTime();
        } else {
            // value is YYYY-MM-DD
            const d = new Date(value);
            if (!isNaN(d.getTime())) dateTimestamp = d.getTime();
        }

        if (dateTimestamp) {
            updateTaskDate(task.id, dateTimestamp);
        }
        setIsMenuOpen(false);
        setSubMenu(null);
    };

    const handleChangeList = (listId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        moveTaskToList(task.id, listId);
        setIsMenuOpen(false);
        setSubMenu(null);
    };

    // --- Task Format Helpers ---
    const applyFormat = (type: 'bold' | 'italic' | 'strike' | 'list') => {
        if (!textAreaRef.current) return;

        const start = textAreaRef.current.selectionStart;
        const end = textAreaRef.current.selectionEnd;
        // Combine all text including pending transcript for logic
        const text = noteContent + (tempTranscript ? ' ' + tempTranscript : '') + (interimTranscript ? ' ' + interimTranscript : '');

        const before = text.substring(0, start);
        const selected = text.substring(start, end);
        const after = text.substring(end);

        let newText = text;
        let newCursorPos = end;

        switch (type) {
            case 'bold':
                newText = `${before}**${selected}**${after}`;
                newCursorPos = end + 4;
                if (!selected) newCursorPos = start + 2;
                break;
            case 'italic':
                newText = `${before}_${selected}_${after}`;
                newCursorPos = end + 2;
                if (!selected) newCursorPos = start + 1;
                break;
            case 'strike':
                newText = `${before}~~${selected}~~${after}`;
                newCursorPos = end + 4;
                if (!selected) newCursorPos = start + 2;
                break;
            case 'list': {
                const needsNewline = start > 0 && text[start - 1] !== '\n';
                const prefix = needsNewline ? '\n- ' : '- ';
                newText = `${before}${prefix}${selected}${after}`;
                newCursorPos = end + prefix.length;
                break;
            }
        }

        // Commit pending text when formatting
        setNoteContent(newText);
        setTempTranscript('');
        setInterimTranscript('');

        setTimeout(() => {
            if (textAreaRef.current) {
                textAreaRef.current.focus();
                textAreaRef.current.setSelectionRange(newCursorPos, newCursorPos);
            }
        }, 0);
    };


    // --- Task Actions ---
    const handleMove = (direction: 'left' | 'right', e: React.MouseEvent) => {
        e.stopPropagation();
        const currentIndex = COLUMN_ORDER.indexOf(task.columnId);
        if (currentIndex === -1) return;
        let newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0) newIndex = 0;
        if (newIndex >= COLUMN_ORDER.length) newIndex = COLUMN_ORDER.length - 1;
        if (newIndex !== currentIndex) moveTask(task.id, COLUMN_ORDER[newIndex]);
    };

    const handleComplete = (e: React.MouseEvent) => {
        e.stopPropagation();
        moveTask(task.id, 'done');
    };

    const handleDuplicate = (e: React.MouseEvent) => {
        e.stopPropagation();
        addTask(task.title + " (Copy)", task.duration, task.columnId, task.listId);
        setIsMenuOpen(false);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        deleteTask(task.id);
        setIsMenuOpen(false);
    };

    const toggleMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isMenuOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setMenuPosition({ top: rect.bottom + 8, left: rect.right - 192 });
            setIsMenuOpen(true);
        } else {
            setIsMenuOpen(false);
        }
    };

    const toggleNotes = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isEditingNotes && cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            setMenuPosition({ top: rect.top, left: rect.left });
            document.documentElement.style.setProperty('--card-width', `${rect.width}px`);
        }
        setIsEditingNotes(!isEditingNotes);
    }

    const saveNotes = () => {
        if (isListening) stopRecording();
        const fullText = (noteContent + (tempTranscript ? ' ' + tempTranscript : '') + (interimTranscript ? ' ' + interimTranscript : '')).trim();
        updateTaskNotes(task.id, fullText);
        setIsEditingNotes(false);
    };


    // --- Voice Logic (Refined) ---
    const startRecording = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Voice to text is not supported.");
            return;
        }

        try {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                setIsListening(true);
                setRecordingTime(0);
                setTempTranscript('');
                setInterimTranscript('');
                timerRef.current = setInterval(() => setRecordingTime(p => p + 1), 1000);
            };

            recognition.onresult = (event: any) => {
                let currentInterim = '';
                let currentFinal = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        currentFinal += transcript + ' ';
                    } else {
                        currentInterim += transcript;
                    }
                }

                if (currentFinal) {
                    setTempTranscript(prev => prev + currentFinal);
                }
                setInterimTranscript(currentInterim);
            };

            recognition.onerror = (event: any) => {
                console.error("Speech error", event.error);
                // Only alert on fatal errors that stop usage
                if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                    setIsListening(false);
                    alert("Microphone access denied. Please allow permission.");
                }
            };

            recognition.onend = () => {
                // Restart if still listening (continuous mode fallback)
                // But strictly, we stop on manual stop.
                // If silence stops it, we let it stop to avoid loops.
                if (isListening) {
                    // check if we have results?
                }
            };

            recognition.start();
            recognitionRef.current = recognition;
        } catch (err) {
            console.error(err);
            setIsListening(false);
            alert("Failed to start voice recognition.");
        }
    };

    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setIsListening(false);

        // Finalize interim
        if (interimTranscript) {
            setTempTranscript(prev => prev + interimTranscript + ' ');
            setInterimTranscript('');
        }
    };

    const confirmRecording = () => {
        const fullText = tempTranscript + (interimTranscript ? ' ' + interimTranscript : '');
        if (fullText) {
            setNoteContent(prev => prev + (prev ? ' ' : '') + fullText);
        }
        stopRecording();
        setTempTranscript('');
        setInterimTranscript('');
    };

    const cancelRecording = () => {
        stopRecording();
        setTempTranscript('');
        setInterimTranscript('');
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };


    // --- Click Outside & Scroll Handling ---
    useEffect(() => {
        if (!isMenuOpen && !isEditingNotes) return;

        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;

            if (isMenuOpen && buttonRef.current && !buttonRef.current.contains(target)) {
                const dropdown = document.getElementById('dropdown-portal');
                if (dropdown && dropdown.contains(target)) return;
                setIsMenuOpen(false);
            }

            if (isEditingNotes) {
                if (editorRef.current && editorRef.current.contains(target)) return;
            }
        }

        window.addEventListener("mousedown", handleClickOutside);
        return () => window.removeEventListener("mousedown", handleClickOutside);
    }, [isMenuOpen, isEditingNotes]);


    return (
        <>
            <div
                ref={cardRef}
                className={clsx(
                    "bg-[#1a1a20] p-4 rounded-xl border shadow-sm mb-3 transition-all cursor-pointer group relative",
                    isOverdue
                        ? "border-red-500/50 hover:border-red-500/70 bg-red-500/5"
                        : "border-white/5 hover:border-purple-500/30"
                )}
            >
                {/* Overdue Badge - top right corner */}
                {isOverdue && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg animate-pulse">
                        <AlertTriangle className="w-3 h-3" />
                        OVERDUE
                    </div>
                )}

                {/* Normal Card Content */}
                <div className="flex items-center gap-3 mb-2">
                    <button onClick={handleComplete} className="flex-shrink-0 text-gray-600 hover:text-green-500 transition-colors">
                        <CheckCircle2 className="w-5 h-5" />
                    </button>
                    <div className="flex-1 min-w-0">
                        <span className={clsx("text-sm font-medium leading-snug transition-colors block truncate", task.columnId === 'done' ? "text-gray-500 line-through" : "text-gray-200 group-hover:text-white")}>
                            {task.title}
                        </span>
                    </div>

                    {/* Difficulty Badge */}
                    {difficulty && (
                        <div className={clsx("flex-shrink-0 px-2 py-0.5 rounded-full flex items-center gap-1 text-[10px] font-bold", difficulty.bgColor, difficulty.color)}>
                            <difficulty.icon className="w-3 h-3" />
                            {difficulty.label}
                        </div>
                    )}

                    {task.notes && (
                        <div className="flex-shrink-0 bg-[#EB46F1] w-5 h-5 rounded flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <span className="text-[10px] font-bold text-white">S</span>
                        </div>
                    )}
                </div>

                {task.notes && (
                    <div className="flex items-center gap-2 mb-3 pl-8">
                        <FileText className="w-3 h-3 text-gray-500 flex-shrink-0" />
                        <p className="text-xs text-gray-500 truncate max-w-[150px]">{task.notes}</p>
                    </div>
                )}

                <div className="flex items-center justify-between pl-8">
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-gray-500 hover:text-white transition-colors" title="Subtasks"><List className="w-4 h-4" /></button>
                        <button onClick={toggleNotes} className={clsx("transition-colors", task.notes ? "text-purple-400" : "text-gray-500 hover:text-white")} title="Notes"><FileText className="w-4 h-4" /></button>
                        <div className="w-px h-3 bg-gray-700 mx-1"></div>
                        <button onClick={(e) => handleMove('left', e)} disabled={task.columnId === 'backlog'} className={clsx("text-gray-500 hover:text-white transition-colors", task.columnId === 'backlog' && "opacity-30 cursor-not-allowed")} title="Move Left"><ArrowLeft className="w-4 h-4" /></button>
                        <button onClick={(e) => handleMove('right', e)} disabled={task.columnId === 'done'} className={clsx("text-gray-500 hover:text-white transition-colors", task.columnId === 'done' && "opacity-30 cursor-not-allowed")} title="Move Right"><ArrowRight className="w-4 h-4" /></button>
                    </div>
                    <div className="flex item-center gap-3 relative">
                        <button ref={buttonRef} onClick={toggleMenu} className={clsx("text-gray-600 hover:text-white transition-opacity", isMenuOpen ? "opacity-100 text-white" : "opacity-0 group-hover:opacity-100")}><MoreVertical className="w-4 h-4" /></button>
                        <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">{task.duration > 0 ? `${task.duration}m` : '0min'}</span>
                    </div>
                </div>
            </div>

            {/* Portal Dropdown Menu */}
            {isMenuOpen && createPortal(
                <div
                    id="dropdown-portal"
                    className="fixed z-[9999] w-48 bg-[#1a1a20] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100"
                    style={{ top: menuPosition.top, left: menuPosition.left }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    <div className="p-1">
                        {/* Main Menu */}
                        {!subMenu && (
                            <>
                                <button onClick={(e) => { e.stopPropagation(); setSubMenu('schedule'); }} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-300 hover:bg-white/5 rounded-lg transition-colors text-left"><Calendar className="w-4 h-4 text-gray-400" />Schedule</button>
                                <button onClick={(e) => { e.stopPropagation(); setSubMenu('lists'); }} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-300 hover:bg-white/5 rounded-lg transition-colors text-left"><ArrowRightLeft className="w-4 h-4 text-gray-400" />Change list</button>
                                <button onClick={handleDuplicate} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-300 hover:bg-white/5 rounded-lg transition-colors text-left"><Copy className="w-4 h-4 text-gray-400" />Duplicate</button>
                                <div className="h-px bg-white/5 my-1 mx-2"></div>
                                <button onClick={handleDelete} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-left font-medium"><Trash2 className="w-4 h-4" />Delete</button>
                            </>
                        )}

                        {/* Schedule Submenu */}
                        {subMenu === 'schedule' && (
                            <div className="flex flex-col animate-in slide-in-from-right-5 duration-200">
                                <button onClick={(e) => { e.stopPropagation(); setSubMenu(null); }} className="flex items-center gap-2 px-2 py-1 mb-1 text-xs text-gray-500 hover:text-white"><ArrowLeft className="w-3 h-3" /> Back</button>
                                <label className="px-3 py-1 text-xs text-gray-500 font-medium">Pick Date</label>
                                <input
                                    type="date"
                                    className="mx-2 mb-2 bg-[#25252e] border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-purple-500/50"
                                    onChange={(e) => handleSchedule(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <button onClick={() => handleSchedule('today')} className="px-3 py-2 text-sm text-gray-300 hover:bg-white/5 text-left">Today</button>
                                <button onClick={() => handleSchedule('tomorrow')} className="px-3 py-2 text-sm text-gray-300 hover:bg-white/5 text-left">Tomorrow</button>
                            </div>
                        )}

                        {/* List Submenu */}
                        {subMenu === 'lists' && (
                            <div className="flex flex-col animate-in slide-in-from-right-5 duration-200">
                                <button onClick={(e) => { e.stopPropagation(); setSubMenu(null); }} className="flex items-center gap-2 px-2 py-1 mb-1 text-xs text-gray-500 hover:text-white"><ArrowLeft className="w-3 h-3" /> Back</button>
                                <span className="px-3 py-1 text-xs text-gray-500 font-medium">Select List</span>
                                {lists.map(list => (
                                    <button
                                        key={list.id}
                                        onClick={(e) => handleChangeList(list.id, e)}
                                        className={clsx("flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-white/5", task.listId === list.id ? "text-purple-400" : "text-gray-300")}
                                    >
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: list.color }}></div>
                                        {list.name}
                                        {task.listId === list.id && <Check className="w-3 h-3 ml-auto" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}

            {/* Portal Notes Editor */}
            {isEditingNotes && createPortal(
                <div
                    ref={editorRef}
                    className="fixed z-[9999] bg-[#1a1a20] rounded-xl flex flex-col p-4 animate-in fade-in zoom-in-95 duration-200 border border-[#A855F7]/50 shadow-2xl shadow-purple-500/20"
                    style={{
                        top: menuPosition.top + 50, // Shifted down 50px to start below header/toolbar
                        left: menuPosition.left,
                        width: 'var(--card-width)',
                        minHeight: '180px'
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    {/* Editor Toolbar */}
                    <div className="relative border-b border-white/10 pb-2 mb-2 min-h-[32px] flex items-center">
                        {/* Standard Toolbar */}
                        <div className={clsx("flex items-center gap-2 w-full transition-opacity duration-200", isListening ? "opacity-0 pointer-events-none" : "opacity-100")}>
                            <div className="flex items-center gap-3 text-gray-500">
                                <button onClick={() => applyFormat('bold')} className="hover:text-white cursor-pointer transition-colors" title="Bold"><Bold className="w-3.5 h-3.5" /></button>
                                <button onClick={() => applyFormat('italic')} className="hover:text-white cursor-pointer transition-colors" title="Italic"><Italic className="w-3.5 h-3.5" /></button>
                                <button onClick={() => applyFormat('strike')} className="hover:text-white cursor-pointer transition-colors" title="Strikethrough"><Strikethrough className="w-3.5 h-3.5" /></button>
                                <button onClick={() => applyFormat('list')} className="hover:text-white cursor-pointer transition-colors" title="List"><List className="w-3.5 h-3.5" /></button>
                                <div className="w-px h-3 bg-gray-700 mx-1"></div>
                                <button className="hover:text-white cursor-pointer transition-colors"><Undo className="w-3.5 h-3.5" /></button>
                                <button className="hover:text-white cursor-pointer transition-colors"><Redo className="w-3.5 h-3.5" /></button>
                            </div>
                            <div className="ml-auto">
                                <button onClick={startRecording} className="text-gray-500 hover:text-white transition-colors" title="Voice to Text"><Mic className="w-3.5 h-3.5" /></button>
                            </div>
                        </div>

                        {/* Recording UI Overlay */}
                        {isListening && (
                            <div className="absolute inset-0 bg-[#25252e] rounded-lg flex items-center justify-between px-2 animate-in fade-in duration-200 z-10 border border-purple-500/30">
                                <button onClick={() => { }} className="w-6 h-6 rounded-full bg-[#3a3a45] flex items-center justify-center text-white hover:bg-[#4a4a55] transition-colors"><Pause className="w-2.5 h-2.5" /></button>

                                <div className="flex items-center gap-0.5 h-3 mx-2 flex-1 justify-center overflow-hidden">
                                    {[...Array(10)].map((_, i) => (
                                        <div key={i} className="w-0.5 bg-[#A855F7] rounded-full animate-pulse" style={{ height: Math.random() * 12 + 4 + 'px', animationDuration: '0.4s', animationDelay: `${i * 0.05}s` }}></div>
                                    ))}
                                </div>

                                <span className="text-[10px] font-mono text-purple-300 mr-2 min-w-[32px]">{formatTime(recordingTime)}</span>

                                <div className="flex items-center gap-1.5">
                                    <button onClick={confirmRecording} className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center hover:bg-green-500/30 transition-colors"><Check className="w-3 h-3" /></button>
                                    <button onClick={cancelRecording} className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/30 transition-colors"><X className="w-3 h-3" /></button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Text Area */}
                    <textarea
                        ref={textAreaRef}
                        autoFocus
                        className="flex-1 bg-transparent resize-none outline-none text-sm text-gray-300 placeholder:text-gray-700 custom-scrollbar leading-relaxed h-full font-mono min-h-[120px]"
                        placeholder={isListening ? "Listening..." : "Type a note..."}
                        value={noteContent + (tempTranscript ? ' ' + tempTranscript : '') + (interimTranscript ? ' ' + interimTranscript : '')} // FIXED: Added interimTranscript
                        onChange={(e) => setNoteContent(e.target.value)}
                    />

                    {/* Close Button */}
                    <button onClick={saveNotes} className="absolute bottom-2 right-2 bg-[#2a2a35] hover:bg-[#3a3a45] w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors border border-white/5 shadow-md" title="Save & Close"><span className="text-sm font-bold">×</span></button>
                </div>,
                document.body
            )}
        </>
    );
}
