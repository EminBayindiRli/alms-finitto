<template>
    <div class="login-body">
        <div class="login-panel">
            <div class="login-content">
                <div class="logo-container">
                    <img src="../assets/layout/images/logo-windows11.svg" alt="Logo" class="logo" />
                </div>
                <h2 class="title">Akademi Yönetim Sistemi</h2>
                
                <div class="form-container">
                    <div class="p-fluid">
                        <div class="field">
                            <label for="email" class="mb-2">E-posta</label>
                            <div class="p-input-icon-left">
                                <i class="pi pi-envelope"></i>
                                <InputText id="email" v-model="email" type="email" placeholder="E-posta adresiniz" :class="{'p-invalid': submitted && !email}" />
                            </div>
                            <small v-if="submitted && !email" class="p-error">E-posta gereklidir.</small>
                        </div>
                        
                        <div class="field">
                            <label for="password" class="mb-2">Şifre</label>
                            <div class="p-input-icon-left">
                                <i class="pi pi-lock"></i>
                                <Password id="password" v-model="password" placeholder="Şifreniz" :class="{'p-invalid': submitted && !password}" toggleMask :feedback="false" />
                            </div>
                            <small v-if="submitted && !password" class="p-error">Şifre gereklidir.</small>
                        </div>
                        
                        <div class="field-checkbox">
                            <Checkbox id="rememberme" v-model="rememberMe" :binary="true" />
                            <label for="rememberme" class="ml-2">Beni Hatırla</label>
                        </div>
                        
                        <div class="login-options">
                            <h3 class="option-title">Giriş Yapılacak Hesap</h3>
                            <div class="options-container">
                                <div class="option" :class="{ 'selected': userType === 'employee' }" @click="userType = 'employee'; setDemoCredentials('employee')">
                                    <i class="pi pi-user option-icon"></i>
                                    <span class="option-label">Çalışan</span>
                                </div>
                                <div class="option" :class="{ 'selected': userType === 'admin' }" @click="userType = 'admin'; setDemoCredentials('admin')">
                                    <i class="pi pi-briefcase option-icon"></i>
                                    <span class="option-label">Yönetici</span>
                                </div>
                            </div>
                        </div>
                        
                        <Button label="Giriş Yap" @click="handleLogin" :loading="loading" icon="pi pi-sign-in" class="login-button" />
                    </div>
                </div>
                
                <div v-if="submitted && email && password && userType === 'employee'" class="test-credentials">
                    <p><b>Demo Çalışan:</b> employee@example.com / 123456</p>
                </div>
                <div v-if="submitted && email && password && userType === 'admin'" class="test-credentials">
                    <p><b>Demo Yönetici:</b> admin@example.com / 123456</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { login } from '../services/auth';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';

const router = useRouter();
const toast = useToast();

// Form data
const email = ref('');
const password = ref('');
const userType = ref('employee');
const rememberMe = ref(false);
const submitted = ref(false);
const loading = ref(false);

// Login function
async function handleLogin() {
    submitted.value = true;
    
    if (email.value && password.value) {
        loading.value = true;
        
        try {
            // Supabase login
            const { data, error } = await login(email.value, password.value);
            
            if (error) {
                toast.add({ severity: 'error', summary: 'Giriş Başarısız', detail: error.message, life: 3000 });
            } else {
                // Check if user role matches the selected role
                const userRole = data.user?.user_metadata?.role || 'employee';
                
                if (userRole !== userType.value) {
                    toast.add({ 
                        severity: 'warn', 
                        summary: 'Yanlış Hesap Tipi', 
                        detail: `Seçtiğiniz hesap tipi ile giriş yapılan hesap tipi uyuşmuyor.`, 
                        life: 3000 
                    });
                } else {
                    toast.add({ severity: 'success', summary: 'Giriş Başarılı', detail: 'Hoş geldiniz!', life: 3000 });
                    router.push('/dashboard');
                }
            }
        } catch (err) {
            toast.add({ severity: 'error', summary: 'Sistemsel Hata', detail: 'Bir sorun oluştu, lütfen tekrar deneyin.', life: 3000 });
            console.error(err);
        } finally {
            loading.value = false;
        }
    }
}

// Demo credentials for easy access
const demoCredentials = reactive([
    { role: 'employee', email: 'employee@example.com', password: '123456' },
    { role: 'admin', email: 'admin@example.com', password: '123456' }
]);

function setDemoCredentials(userRole) {
    const credentials = demoCredentials.find(cred => cred.role === userRole);
    if (credentials) {
        email.value = credentials.email;
        password.value = credentials.password;
    }
}
</script>

<style scoped>
.login-body {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #f5f7f9;
    margin: 0;
    padding: 0;
    font-family: 'Lato', sans-serif;
}

.login-panel {
    width: 500px;
    padding: 40px;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.login-content {
    text-align: center;
}

.logo-container {
    margin-bottom: 20px;
}

.logo {
    width: 100px;
    height: 100px;
    margin: 0 auto;
}

.title {
    color: #0078d4;
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 30px;
}

.form-container {
    text-align: left;
    margin-bottom: 20px;
}

.login-options {
    margin: 25px 0;
}

.option-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 15px;
    color: #333;
}

.options-container {
    display: flex;
    gap: 15px;
    justify-content: center;
}

.option {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    padding: 15px;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.option.selected {
    border-color: #0078d4;
    background-color: rgba(0, 120, 212, 0.05);
}

.option-icon {
    font-size: 24px;
    margin-bottom: 8px;
    color: #0078d4;
}

.option-label {
    font-size: 14px;
    font-weight: 500;
}

.login-button {
    width: 100%;
    background-color: #0078d4;
    border-color: #0078d4;
    margin-top: 20px;
    font-size: 16px;
    padding: 12px;
}

.error-message {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 15px;
    color: #e24c4c;
    font-size: 14px;
}

.forgot-password {
    margin-top: 20px;
}

.forgot-password a {
    color: #0078d4;
    text-decoration: none;
    font-size: 14px;
}

.forgot-password a:hover {
    text-decoration: underline;
}

.test-account-info {
    margin-top: 30px;
    border-top: 1px solid #e0e0e0;
    padding-top: 20px;
}

.test-account-title {
    font-weight: 600;
    margin-bottom: 10px;
    color: #555;
}

.test-account {
    font-size: 14px;
    margin-bottom: 5px;
    color: #666;
}

.test-credentials {
    font-size: 14px;
    margin-top: 10px;
    color: #666;
}
</style>
