import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path';
export default defineConfig({
  plugins: [react(),tailwindcss(),],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@api': path.resolve(__dirname, './src/api'),
      '@home': path.resolve(__dirname, './src/homePage')
    },
  },
   server: {
    host: 'localhost', // ✅ Thêm dòng này
    port: 5173,
    cors: true,
  },
  
})
