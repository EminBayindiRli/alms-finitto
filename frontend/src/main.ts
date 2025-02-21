import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

// Tailwind CSS
import './index.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
