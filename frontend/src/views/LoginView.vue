<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">ALMS Sistemine Giriş</h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div v-if="errorMessage" class="rounded-md bg-red-50 p-4 mb-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Hata</h3>
              <div class="mt-2 text-sm text-red-700">
                <p>{{ errorMessage }}</p>
              </div>
            </div>
          </div>
        </div>

        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">E-posta</label>
            <div class="mt-1">
              <input
                id="email"
                v-model="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Şifre</label>
            <div class="mt-1">
              <input
                id="password"
                v-model="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="rememberMe"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900"> Beni hatırla </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-blue-600 hover:text-blue-500"> Şifreni mi unuttun? </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              :disabled="loading"
            >
              <span v-if="loading">Giriş yapılıyor...</span>
              <span v-else>Giriş Yap</span>
            </button>
          </div>
        </form>

        <!-- Test Kullanıcı Bilgileri -->
        <div class="mt-6 bg-yellow-50 p-3 rounded-md">
          <h3 class="text-sm font-medium text-yellow-800">Test Kullanıcı Bilgileri</h3>
          <p class="text-sm text-yellow-700 mt-1">E-posta: <strong>admin@alms.com</strong></p>
          <p class="text-sm text-yellow-700">Şifre: <strong>admin123</strong></p>
          <p class="text-xs mt-2 text-yellow-600">Bu kullanıcı test amaçlıdır ve sadece geliştirme ortamında kullanılmalıdır.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const errorMessage = ref('')

// Hazır test admin kullanıcısını oluştur 
async function createTestUser() {
  try {
    // Test kullanıcısı var mı kontrol et
    const { data: existingUsers } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'admin@alms.com')
      .maybeSingle()

    if (!existingUsers) {
      // Test kullanıcısını oluştur
      const { data, error } = await supabase.auth.signUp({
        email: 'admin@alms.com',
        password: 'admin123'
      })

      if (error) {
        console.error('Test kullanıcı oluşturulurken hata:', error)
        return
      }

      // Kullanıcı profilini oluştur ve admin rolü ver
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user?.id,
          email: 'admin@alms.com',
          name: 'Admin Kullanıcı',
          role: 'admin',
          active: true
        })

      if (profileError) {
        console.error('Profil oluşturulurken hata:', profileError)
      }
    }
  } catch (error) {
    console.error('Test kullanıcı oluşturma hatası:', error)
  }
}

async function handleLogin() {
  errorMessage.value = ''
  loading.value = true

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })

    if (error) throw error

    await authStore.setUser(data.user)
    router.push('/')
  } catch (error: any) {
    console.error('Login error:', error)
    errorMessage.value = error.message || 'Giriş yaparken bir hata oluştu. Lütfen bilgilerinizi kontrol edip tekrar deneyin.'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  // Eğer kullanıcı zaten giriş yapmışsa anasayfaya yönlendir
  const { data } = await supabase.auth.getSession()
  if (data.session) {
    router.push('/')
  }

  // Test kullanıcısını oluştur
  await createTestUser()
})
</script>
