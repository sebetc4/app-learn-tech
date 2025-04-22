import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'path'

export default defineConfig({
    main: {
        plugins: [externalizeDepsPlugin()],
        resolve: {
            alias: {
                '@': resolve('src'),
                '@main': resolve('src/main'),
                '@preload': resolve('src/preload')
            }
        }
    },
    preload: {
        plugins: [externalizeDepsPlugin()],
        resolve: {
            alias: {
                '@': resolve('src'),
                '@main': resolve('src/main'),
                '@preload': resolve('src/preload')
            }
        }
    },
    renderer: {
        resolve: {
            alias: {
                '@': resolve('src'),
                '@renderer': resolve('src/renderer/src')
            }
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `
                        @use '@renderer/styles/lib' as *;
                        @use '@renderer/styles/utils' as *;
                    `
                }
            }
        },
        plugins: [react()]
    }
})
