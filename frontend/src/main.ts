import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

// Tailwind CSS
import './index.css'

// Environment değişkenlerinin varlığını kontrol et ve konsola çıktı ver
console.log('Environment Variables:', {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? 'defined' : 'undefined',
  SUPABASE_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'defined' : 'undefined',
  API_URL: import.meta.env.VITE_API_URL ? 'defined' : 'undefined'
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')
