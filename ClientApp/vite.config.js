import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [
        react({
            jsxRuntime: 'automatic',
            jsxImportSource: undefined,
            babel: {
                plugins: []
            }
        })
    ],
    root: '.',
    publicDir: 'public',
    build: {
        outDir: '../wwwroot/dist',
        emptyOutDir: true,
    },
    server: {
        port: 3000,
        cors: true,
        strictPort: true,
        origin: 'http://localhost:3000',
        proxy: {
            '/Home': {
                target: 'https://localhost:7161',
                changeOrigin: true,
                secure: false
            }
        }
    }
})