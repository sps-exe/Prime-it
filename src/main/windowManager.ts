import { BrowserWindow, screen } from 'electron';

export class WindowManager {
    private mainWindow: BrowserWindow | null = null;
    private originalBounds: Electron.Rectangle | null = null;
    private isOverlayMode: boolean = false;  // Track if already in overlay mode

    setWindow(window: BrowserWindow) {
        this.mainWindow = window;
    }

    toggleOverlayMode(enabled: boolean) {
        console.log('[WindowManager] toggleOverlayMode called, enabled:', enabled);
        console.log('[WindowManager] mainWindow exists:', !!this.mainWindow);
        console.log('[WindowManager] isOverlayMode:', this.isOverlayMode);

        if (!this.mainWindow) {
            console.error('[WindowManager] ERROR: mainWindow is null!');
            return;
        }

        if (enabled) {
            // IMPORTANT: Only save bounds if NOT already in overlay mode
            if (!this.isOverlayMode) {
                this.originalBounds = this.mainWindow.getBounds();
                console.log('[WindowManager] Saved original bounds:', this.originalBounds);
            } else {
                console.log('[WindowManager] Already in overlay mode, NOT overwriting originalBounds');
            }

            // Get primary display size
            const primaryDisplay = screen.getPrimaryDisplay();
            const { workArea } = primaryDisplay;
            console.log('[WindowManager] workArea:', workArea);

            // Target size for overlay - narrow panel on LEFT side
            const width = 300;  // Wide enough for hover button expansion
            const height = workArea.height - 50; // Almost full height

            // Position: LEFT side, near top
            const x = workArea.x + 10;  // 10px from left edge
            const y = workArea.y + 25;  // Below menu bar

            console.log('[WindowManager] Setting bounds to:', { x, y, width, height });
            this.mainWindow.setMinimumSize(280, 400);
            this.mainWindow.setBounds({ x, y, width, height }, true);
            this.mainWindow.setAlwaysOnTop(true, 'floating');
            this.mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
            this.isOverlayMode = true;  // Mark as in overlay mode
            console.log('[WindowManager] Overlay mode ENABLED');
        } else {
            // Restore
            console.log('[WindowManager] Restoring window from overlay mode');
            console.log('[WindowManager] originalBounds:', this.originalBounds);

            // Reset always on top first
            this.mainWindow.setAlwaysOnTop(false);
            this.mainWindow.setVisibleOnAllWorkspaces(false);

            // Reset minimum size to allow larger window
            this.mainWindow.setMinimumSize(800, 600);

            if (this.originalBounds) {
                console.log('[WindowManager] Restoring to original bounds');
                this.mainWindow.setBounds(this.originalBounds, true);
            } else {
                console.log('[WindowManager] No original bounds, setting default size');
                this.mainWindow.setSize(1200, 800);
                this.mainWindow.center();
            }
            this.isOverlayMode = false;  // Mark as no longer in overlay mode
            console.log('[WindowManager] Overlay mode DISABLED, window restored');
        }
    }

    toggleMiniMode(enabled: boolean) {
        console.log('[WindowManager] toggleMiniMode called, enabled:', enabled);
        if (!this.mainWindow) {
            console.error('[WindowManager] ERROR: mainWindow is null!');
            return;
        }

        if (enabled) {
            const primaryDisplay = screen.getPrimaryDisplay();
            const { workArea } = primaryDisplay;

            // Mini mode: small floating bar at top center of screen
            const width = 320; // Compact width for smaller UI elements
            const height = 50;  // Default start height
            const x = Math.round(workArea.x + (workArea.width - width) / 2);  // Center horizontally
            const y = workArea.y + 10;  // Near top

            // Hide traffic lights (window buttons) for clean frameless look
            this.mainWindow.setWindowButtonVisibility(false);

            this.mainWindow.setMinimumSize(200, 40);
            this.mainWindow.setBounds({ x, y, width, height }, true);
            this.mainWindow.setAlwaysOnTop(true, 'floating');
            this.mainWindow.setVisibleOnAllWorkspaces(true);

            // Ensure transparency preservation
            this.mainWindow.setBackgroundColor('#00000000');

            console.log(`[WindowManager] Setting mini mode bounds to:`, { x, y, width, height });
            console.log('[WindowManager] Mini mode ENABLED');
        } else {
            // Restore functionality is handled by toggleOverlayMode(false) usually
            // but if we need specific restoration logic here:
            this.mainWindow.setAlwaysOnTop(false);
            this.mainWindow.setVisibleOnAllWorkspaces(false);
            // Show traffic lights again
            this.mainWindow.setWindowButtonVisibility(true);

            // Return to overlay mode (sidebar)
            this.toggleOverlayMode(true);
            console.log('[WindowManager] Mini mode DISABLED, returned to overlay');
        }
    }

    setMiniModeHeight(height: number) {
        if (this.mainWindow) {
            const bounds = this.mainWindow.getBounds();
            this.mainWindow.setBounds({
                x: bounds.x,
                y: bounds.y,
                width: 320,
                height: height
            }, true);
            console.log(`[WindowManager] Resized mini mode height to ${height}`);
        }
    }
}

export const windowManager = new WindowManager();
