import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

// Auth sistem import
import { initAuth, isAuthenticated, user } from './services/auth';

import '@/assets/styles.scss';

const app = createApp(App);

// Router navigation guard setup
router.beforeEach((to, from, next) => {
    // Auth gerektiren sayfaları kontrol et
    if (to.meta.requiresAuth && !isAuthenticated()) {
        // Kullanıcı giriş yapmamış, login sayfasına yönlendir
        return next({ path: '/login' });
    }
    
    // Admin gerektiren sayfaları kontrol et
    if (to.meta.requiresAdmin && user.value?.user_metadata?.role !== 'admin') {
        // Kullanıcı admin değil, dashboard'a yönlendir
        return next({ path: '/dashboard' });
    }
    
    // Diğer durumlar için devam et
    next();
});

app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});
app.use(ToastService);
app.use(ConfirmationService);

// Auth sistemini başlat ve uygulamayı mount et
initAuth().then(() => {
    app.mount('#app');
});
