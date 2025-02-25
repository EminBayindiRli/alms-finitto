import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './',
  server: {
    port: 5173,
    proxy: {
      '/analyze': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/employee': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/generate': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
