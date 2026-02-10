import { app, BrowserWindow, shell } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import { setupStoreHandlers } from './store'
import { windowManager } from './windowManager'
import { ipcMain } from 'electron'

// Handler to open external URLs (for payment checkout)
ipcMain.handle('open-external', async (_, url: string) => {
  console.log('[MAIN] Opening external URL:', url);
  await shell.openExternal(url);
});

ipcMain.handle('set-overlay-mode', (_, enabled: boolean) => {
  console.log('[MAIN] set-overlay-mode IPC received, enabled:', enabled);
  windowManager.toggleOverlayMode(enabled);
  console.log('[MAIN] toggleOverlayMode called successfully');
});

ipcMain.handle('set-mini-mode', (_, enabled: boolean) => {
  console.log('[MAIN] set-mini-mode IPC received, enabled:', enabled);
  windowManager.toggleMiniMode(enabled);
  console.log('[MAIN] toggleMiniMode called successfully');
});

ipcMain.handle('set-mini-mode-height', (_, height: number) => {
  console.log('[MAIN] set-mini-mode-height IPC received, height:', height);
  windowManager.setMiniModeHeight(height);
});

ipcMain.handle('minimize-window', () => {
  if (win) win.minimize();
});



const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

setupStoreHandlers();


let win: BrowserWindow | null

function createWindow() {
  console.log('[MAIN] Creating BrowserWindow...');
  console.log('[MAIN] Preload path:', path.join(__dirname, 'index.mjs'));

  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    width: 1200,
    height: 800,
    titleBarStyle: 'hidden',  // Hide title bar completely
    trafficLightPosition: { x: -100, y: -100 }, // Move traffic lights off-screen
    transparent: true,             // Enable transparency for shaped windows
    backgroundColor: '#00000000',  // Ensure background starts transparent
    webPreferences: {
      preload: path.join(__dirname, 'index.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false, // Required for preload scripts to work
    },
  })

  console.log('[MAIN] BrowserWindow created, setting windowManager...');
  windowManager.setWindow(win);

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

import { autoUpdater } from 'electron-updater'

// Configure logging
autoUpdater.logger = console;
// autoUpdater.logger.transports.file.level = "info";
autoUpdater.autoDownload = false; // We want to ask the user first, or just notify them. Or keeping it true/false and handling events. 
// Let's keep it simple: autoDownload=true (default) but notify when downloaded.
// Actually, let's set it to true so it downloads in background, then we notify "Ready to install".
autoUpdater.autoDownload = true;

app.whenReady().then(() => {
  createWindow()

  // Check for updates immediately on startup
  try {
    autoUpdater.checkForUpdatesAndNotify();
  } catch (err) {
    console.error('Failed to check for updates:', err);
  }
})

// Auto-Updater Events
autoUpdater.on('checking-for-update', () => {
  console.log('[Updater] Checking for update...');
});

autoUpdater.on('update-available', (info) => {
  console.log('[Updater] Update available:', info);
  win?.webContents.send('update-available', info);
});

autoUpdater.on('update-not-available', () => {
  console.log('[Updater] Update not available.');
});

autoUpdater.on('error', (err) => {
  console.error('[Updater] Error in auto-updater:', err);
  win?.webContents.send('update-error', err.toString());
});

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  console.log('[Updater] ' + log_message);
  win?.webContents.send('update-download-progress', progressObj);
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('[Updater] Update downloaded:', info);
  win?.webContents.send('update-downloaded', info);
});

// IPC Handler to install update
ipcMain.handle('install-update', () => {
  console.log('[Updater] User requested install. Quitting and installing...');
  autoUpdater.quitAndInstall();
});

