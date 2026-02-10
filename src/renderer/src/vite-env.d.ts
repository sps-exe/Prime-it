/// <reference types="vite/client" />

export { };

declare global {
    interface Window {
        ipcRenderer: {
            on(channel: string, listener: (event: any, ...args: any[]) => void): void;
            off(channel: string, listener: (...args: any[]) => void): void;
            send(channel: string, ...args: any[]): void;
            invoke(channel: string, ...args: any[]): Promise<any>;
            getStoreValue(key: string): Promise<any>;
            setStoreValue(key: string, value: any): Promise<void>;
        };
    }
}
