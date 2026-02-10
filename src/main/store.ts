import Store from 'electron-store';
import { ipcMain } from 'electron';

interface DataSchema {
    userName?: string;
    tasks: any[]; // refine later
}

const store = new Store<DataSchema>({
    defaults: {
        tasks: []
    }
});

export function setupStoreHandlers() {
    ipcMain.handle('get-store-value', (_, key: string) => {
        return store.get(key);
    });

    ipcMain.handle('set-store-value', (_, key: string, value: any) => {
        if (value === undefined || value === null) {
            store.delete(key as keyof DataSchema);
        } else {
            store.set(key, value);
        }
    });

    ipcMain.handle('delete-store-value', (_, key: string) => {
        store.delete(key as keyof DataSchema);
    });

    ipcMain.handle('clear-store', () => {
        store.clear();
    });
}
