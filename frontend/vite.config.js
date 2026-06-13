import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 3005,
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
});
