import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function UpdateNotification() {
    const [updateReady, setUpdateReady] = useState(false);
    const [show, setShow] = useState(false);

    useEffect(() => {
        const handleUpdateAvailable = () => {
            console.log('Update available!');
            setShow(true);
        };

        const handleUpdateDownloaded = () => {
            console.log('Update downloaded and ready to install!');
            setUpdateReady(true);
            setShow(true);
        };

        window.ipcRenderer?.on('update-available', handleUpdateAvailable);
        window.ipcRenderer?.on('update-downloaded', handleUpdateDownloaded);

        return () => {
            window.ipcRenderer?.off('update-available', handleUpdateAvailable);
            window.ipcRenderer?.off('update-downloaded', handleUpdateDownloaded);
        };
    }, []);

    const installUpdate = () => {
        window.ipcRenderer?.invoke('install-update');
    };

    const close = () => {
        setShow(false);
    }

    if (!show) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-6 right-6 z-50 max-w-sm w-full"
            >
                <div className="bg-[#1a1a20] border border-white/10 rounded-xl shadow-2xl p-4 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                        <Download className="w-5 h-5 text-indigo-400" />
                    </div>

                    <div className="flex-1">
                        <h4 className="font-bold text-white mb-1">
                            {updateReady ? 'Update Ready' : 'Update Available'}
                        </h4>
                        <p className="text-xs text-gray-400 mb-3">
                            {updateReady
                                ? 'A new version of Prime-it has been downloaded. Restart now to apply.'
                                : 'A new version is being downloaded in the background.'}
                        </p>

                        {updateReady && (
                            <div className="flex gap-2">
                                <button
                                    onClick={installUpdate}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors"
                                >
                                    Restart & Update
                                </button>
                                <button
                                    onClick={close}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold rounded-lg transition-colors"
                                >
                                    Later
                                </button>
                            </div>
                        )}

                        {!updateReady && (
                            <button
                                onClick={close}
                                className="text-xs text-gray-500 hover:text-white underline"
                            >
                                Dismiss
                            </button>
                        )}
                    </div>

                    <button onClick={close} className="text-gray-500 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
