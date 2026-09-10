import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7289', // Puerto HTTPS activo en Visual Studio
        changeOrigin: true,
        secure: false,
      },
    },
  },
})