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

  // Environment variable listesi - bunlar frontend için enjekte edilecek
  const envList = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY', 'VITE_API_URL'];
  
  // HTML enjeksiyonu için değişken değiştirme (replace) yapılandırması - tip tanımı ekledik
  const htmlEnvReplacements: Record<string, string> = {};
  
  // Her environment variable için bir replace konfigürasyonu oluştur
  envList.forEach(key => {
    htmlEnvReplacements[`%${key}%`] = env[key] || '';
  });
  
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
          manualChunks(id) {
            // Modules dışında kalan tüm dosyaları tek bir chunk'a koy
            if (id.includes('node_modules')) {
              // node_modules içindeki paketleri ayır
              if (id.includes('vue') || id.includes('@vue')) {
                return 'vendor-vue';
              } else if (id.includes('pinia')) {
                return 'vendor-pinia';
              } else if (id.includes('supabase')) {
                return 'vendor-supabase';
              } else {
                return 'vendor-other';
              }
            }
          }
        }
      },
      // Minify işlemini devre dışı bırak (debugging için)
      minify: false,
      // Circular depdency uyarılarına dikkat et
      commonjsOptions: {
        strictRequires: true
      },
      // Otomatik code splitting yapma
      cssCodeSplit: false
    },
    define: {
      // Çevresel değişkenleri global olarak tanımla
      __APP_ENV__: JSON.stringify(env.MODE)
    },
    optimizeDeps: {
      // Force optimization for these packages
      include: ['vue', 'vue-router', 'pinia', '@supabase/supabase-js'],
      // Exclude these packages from optimization
      exclude: [],
      // Force bundle deps on browser
      entries: ['./src/main.ts']
    },
    // HTML dosyasına environment değişkenlerini enjekte et
    experimental: {
      renderBuiltUrl: (filename, { hostType }) => {
        return filename;
      }
    }
  }
})
