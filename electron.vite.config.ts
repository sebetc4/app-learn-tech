import react from '@vitejs/plugin-react'
import { defineConfig } from 'electron-vite'
import { resolve } from 'path'

export default defineConfig({
    main: {
        resolve: {
            alias: {
                '@': resolve('src'),
                '@main': resolve('src/main'),
                '@preload': resolve('src/preload')
            }
        },
        build: {
            rollupOptions: {
                output: {
                    manualChunks: undefined
                }
            }
        }
    },
    preload: {
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
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                        'ui-vendor': ['lucide-react', 'sonner'],
                        'form-vendor': ['react-hook-form', '@hookform/resolvers', 'yup']
                    }
                }
            },
            chunkSizeWarningLimit: 1000
        },
        plugins: [react()]
    }
})
