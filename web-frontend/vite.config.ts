import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react() as any],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5002',
        changeOrigin: true,
      },
    },
  },
  // Increase the warning limit because the app bundles a few heavy libs (e.g., Cloudinary, Razorpay).
  // Default is 250KB; raising to 500KB removes the warning while still keeping a reasonable size.
  build: {
    chunkSizeWarningLimit: 500, // size in KB
  },
});
