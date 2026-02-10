import { defineConfig } from 'vite'
import path from 'node:path'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  root: 'src/renderer',
  // Point to project root for .env files since root is set to src/renderer
  envDir: process.cwd(),
  plugins: [
    react(),
    electron({
      main: {
        // Shortcut of `build.lib.entry`.
        entry: path.join(process.cwd(), 'src/main/index.ts'),
        vite: {
          build: {
            outDir: '../../dist-electron',
            lib: {
              entry: path.join(process.cwd(), 'src/main/index.ts'),
              formats: ['es'],
              fileName: () => 'main.js'
            }
          }
        }
      },
      preload: {
        // Shortcut of `build.rollupOptions.input`.
        input: path.join(process.cwd(), 'src/preload/index.ts'),
        vite: {
          build: {
            outDir: '../../dist-electron',
            lib: {
              entry: path.join(process.cwd(), 'src/preload/index.ts'),
              formats: ['es'],
              fileName: () => 'preload.mjs'
            }
          }
        }
      },
      // Ployfill the Electron and Node.js API for Renderer process.
      // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
      // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
      renderer: process.env.NODE_ENV === 'test'
        // https://github.com/electron-vite/vite-plugin-electron-renderer/issues/78#issuecomment-2053600808
        ? undefined
        : {},
    }),
  ],
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
  }
})
