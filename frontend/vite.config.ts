import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// Terser'in yüklü olup olmadığını kontrol et
let terserInstalled = false;
try {
  require.resolve('terser');
  terserInstalled = true;
} catch (e) {
  console.warn('Terser not found, falling back to esbuild minifier');
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Çevresel değişkenleri yükle
  const env = loadEnv(mode, process.cwd())
  
  return {
    plugins: [vue()],
    base: './',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
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
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router', 'axios'],
            ui: ['@vue/runtime-core']
          }
        }
      },
      // Terser yoksa esbuild kullan (default)
      minify: terserInstalled ? 'terser' : 'esbuild',
      ...(terserInstalled ? {
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true
          }
        }
      } : {})
    },
    define: {
      // Çevresel değişkenleri global olarak tanımla (gerekirse)
      __APP_ENV__: JSON.stringify(env.MODE)
    }
  }
})
