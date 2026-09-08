import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7123', // Reemplaza con el puerto real de tu API en C#
        changeOrigin: true,
        secure: false, // Permite certificados SSL autofirmados en entorno local
      },
    },
  },
})
