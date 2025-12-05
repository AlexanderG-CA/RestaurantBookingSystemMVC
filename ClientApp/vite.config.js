import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    root: '.',
    publicDir: 'public',
    build: {
        outDir: '../wwwroot/dist',
        emptyOutDir: true,
    },
    server: {
        port: 3000,
        host: '0.0.0.0',  // Allow external connections
        strictPort: true,
        cors: {
            origin: ['https://localhost:7161', 'http://localhost:7161'],  // Allow your ASP.NET origins
            credentials: true
        },
        proxy: {
            '/Home': {
                target: 'https://localhost:7161',
                changeOrigin: true,
                secure: false
            }
        }
    }
})