<template>
  <div class="min-h-screen flex flex-col justify-center bg-[#1c1c1c] text-white">
    <div class="w-full max-w-xl mx-auto px-6 md:px-8">
      <!-- Logo -->
      <div class="flex justify-center mb-10">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-emerald-500 rounded flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
            </svg>
          </div>
          <span class="text-xl font-medium">ALMS</span>
        </div>
      </div>

      <!-- Login Form -->
      <div class="bg-[#2e2e2e] rounded-lg border border-gray-800 overflow-hidden shadow-xl">
        <div class="px-8 pt-8">
          <h2 class="text-xl font-medium mb-1">Giriş yap</h2>
          <p class="text-gray-400 text-sm mb-6">ALMS sistemine hoş geldiniz</p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mx-8 mb-4 p-3 bg-red-900/20 border border-red-700 text-red-300 text-sm rounded-md">
          {{ error }}
        </div>

        <div class="px-8 pb-8">
          <!-- User Type Selection -->
          <div class="flex mb-6 space-x-4">
            <button 
              @click="userType = 'admin'" 
              class="flex-1 py-2 px-4 rounded focus:outline-none border"
              :class="userType === 'admin' ? 'bg-gray-700 border-emerald-500 text-white' : 'bg-transparent border-gray-700 text-gray-400 hover:bg-gray-700'"
            >
              Yönetici
            </button>
            <button 
              @click="userType = 'employee'" 
              class="flex-1 py-2 px-4 rounded focus:outline-none border" 
              :class="userType === 'employee' ? 'bg-gray-700 border-emerald-500 text-white' : 'bg-transparent border-gray-700 text-gray-400 hover:bg-gray-700'"
            >
              Çalışan
            </button>
          </div>

          <!-- Email Input -->
          <div class="mb-4">
            <label for="email" class="block text-sm text-gray-400 mb-2">E-posta</label>
            <input 
              id="email" 
              v-model="email" 
              type="email" 
              placeholder="E-posta adresinizi girin" 
              class="w-full py-2 px-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white"
              :class="v$.email.$error ? 'border-red-500' : ''" 
              @blur="v$.email.$touch()"
            />
            <div v-if="v$.email.$error" class="text-red-400 text-xs mt-1">
              {{ v$.email.$errors[0].$message }}
            </div>
          </div>

          <!-- Password Input -->
          <div class="mb-6">
            <label for="password" class="block text-sm text-gray-400 mb-2">Şifre</label>
            <input 
              id="password" 
              v-model="password" 
              type="password" 
              placeholder="Şifrenizi girin" 
              class="w-full py-2 px-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white"
              :class="v$.password.$error ? 'border-red-500' : ''" 
              @blur="v$.password.$touch()"
            />
            <div v-if="v$.password.$error" class="text-red-400 text-xs mt-1">
              {{ v$.password.$errors[0].$message }}
            </div>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center">
              <input 
                id="remember" 
                v-model="rememberMe" 
                type="checkbox" 
                class="h-4 w-4 rounded border-gray-700 bg-gray-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-gray-800"
              />
              <label for="remember" class="ml-2 text-sm text-gray-400">Beni hatırla</label>
            </div>
            <div>
              <a href="#" class="text-sm text-emerald-500 hover:text-emerald-400">Şifremi unuttum</a>
            </div>
          </div>

          <!-- Login Button -->
          <button 
            @click="login" 
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            :disabled="loading"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Giriş yapılıyor...' : 'Giriş Yap' }}
          </button>
        </div>
      </div>

      <!-- Test User Info -->
      <div class="mt-8 bg-gray-800/50 rounded-lg p-4 border border-gray-700">
        <h3 class="text-sm font-medium text-gray-300 mb-2">Test Kullanıcı Bilgileri:</h3>
        <div class="text-xs text-gray-400 space-y-1">
          <p><strong>Yönetici:</strong> admin@example.com / password</p>
          <p><strong>Çalışan:</strong> employee@example.com / password</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useVuelidate } from '@vuelidate/core'
import { required, email as emailValidator } from '@vuelidate/validators'

const router = useRouter()
const authStore = useAuthStore()

// Form fields
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const userType = ref('admin') // default to admin
const loading = ref(false)
const error = ref('')

// Validation rules
const rules = {
  email: { required, email: emailValidator },
  password: { required }
}

const v$ = useVuelidate(rules, { email, password })

async function login() {
  // Reset error
  error.value = ''
  
  // Validate form
  const isFormValid = await v$.value.$validate()
  if (!isFormValid) return
  
  try {
    loading.value = true
    
    const success = await authStore.login({
      email: email.value,
      password: password.value,
      userType: userType.value,
      rememberMe: rememberMe.value
    })
    
    if (success) {
      // Redirect based on user role
      if (authStore.isAdmin()) {
        router.push('/admin-dashboard')
      } else {
        router.push('/dashboard')
      }
    } else {
      error.value = 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.'
    }
  } catch (e: any) {
    console.error('Login error:', e)
    error.value = e.message || 'Bir hata oluştu. Lütfen tekrar deneyin.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Focus and transition styles */
input:focus, button:focus {
  outline: none;
}

/* Transitions */
button, input, a {
  transition: all 0.2s;
}
</style>
