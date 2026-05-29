import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Evita CORS en desarrollo: el navegador llama a localhost y Vite reenvía a Render
      '/api': {
        target: 'https://ms-pedidos-q7pm.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
