import { Button } from '../ui/Button';

export function LeftPromoPanel() {
    return (
        <div className="w-[300px] flex-shrink-0 space-y-6">
            {/* Trial Status Card */}
            <div className="bg-gray-50 border border-gray-100 p-6 rounded-3xl">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-teal-400 to-blue-500"></div>
                    <span className="font-bold text-gray-900">Prime it <span className="text-[10px] bg-green-100 text-green-700 px-1 py-0.5 rounded uppercase">Beta</span></span>
                    <span className="text-xs text-gray-400 ml-auto">(v2.5.57)</span>
                </div>
                <p className="font-bold text-sm text-gray-900 mb-2">Plan: Free Trial</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                    You have 6 more days left before your trial finishes. After that all features will be locked until you upgrade.
                </p>
            </div>

            {/* Sale Card */}
            <div className="bg-gradient-to-b from-white to-gray-50 border border-gray-100 p-6 rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300"></div>

                <h3 className="text-lg font-bold text-gray-900">New Year Sale!</h3>
                <p className="text-indigo-500 text-sm font-medium mb-4">Limited offer ends soon!</p>

                <div className="flex gap-2 mb-4">
                    {['01', '23', '58'].map((num, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <div className="bg-gray-100 rounded-lg px-2 py-1 text-xl font-mono text-gray-800 font-bold shadow-inner">
                                {num}
                            </div>
                            <span className="text-[10px] text-gray-400 mt-1">{['Days', 'Hours', 'Minutes'][i]}</span>
                        </div>
                    ))}
                </div>

                <div className="bg-gray-100/50 p-2 rounded-lg text-xs text-gray-600 mb-4 flex items-center justify-center gap-1">
                    Use <span className="bg-green-200 text-green-800 px-1 rounded font-bold">NY26</span> get 20% off
                </div>

                <Button fullWidth variant="primary" className="py-2 text-sm bg-white border border-gray-200 !text-gray-900 !bg-none shadow-sm hover:bg-gray-50">
                    ⚡ Upgrade Now
                </Button>
            </div>
        </div>
    );
}
