// Önce çekirdek Vue bağımlılıklarını import et
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Sonra CSS dosyalarını import et
import './style.css'
import './index.css' // Tailwind CSS

// SONRA diğer bileşenleri import et
import App from './App.vue'
import router from './router'

// Environment değişkenlerinin varlığını kontrol et
console.log('Environment Variables Check:')
try {
  // Window ENV kontrol et (runtime injection)
  // @ts-ignore
  if (window.ENV) {
    // @ts-ignore
    console.log('Window ENV:', {
      // @ts-ignore
      SUPABASE_URL: window.ENV.VITE_SUPABASE_URL ? 'defined' : 'undefined',
      // @ts-ignore
      SUPABASE_KEY: window.ENV.VITE_SUPABASE_ANON_KEY ? 'defined' : 'undefined',
      // @ts-ignore
      API_URL: window.ENV.VITE_API_URL ? 'defined' : 'undefined'
    })
  } else {
    console.log('Window ENV not defined')
  }
  
  // Import meta env kontrol et (compile time injection)
  console.log('Import meta ENV:', {
    SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? 'defined' : 'undefined',
    SUPABASE_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'defined' : 'undefined',
    API_URL: import.meta.env.VITE_API_URL ? 'defined' : 'undefined'
  })
} catch (error) {
  console.error('Error checking environment variables:', error)
}

// Store'u önce oluştur 
const pinia = createPinia()

// App'i en son oluştur
const app = createApp(App)

// Pinia'yı ekliyoruz
app.use(pinia)

// Router'ı ekliyoruz
app.use(router)

// En son olarak uygulamayı monte ediyoruz
app.mount('#app')
