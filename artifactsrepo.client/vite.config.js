import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [plugin()],
    server: {
        port: 5260,
        proxy: {
            '/api': {
                target: 'http://localhost:5259',
                changeOrigin: true,
                secure: false,
            }
        }
    }
})