
import { Sparkles } from 'lucide-react';

export function PremiumBadge() {
    return (
        <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900 shadow-sm">
            <Sparkles className="w-2.5 h-2.5" />
            <span>PRO</span>
        </div>
    );
}
