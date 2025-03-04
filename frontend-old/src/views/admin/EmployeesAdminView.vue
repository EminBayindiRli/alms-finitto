<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">Çalışan Yönetimi</h1>
          <p class="mt-1 text-sm text-gray-500">
            Çalışanları ekleyin, düzenleyin ve yönetin
          </p>
        </div>
        <div class="flex space-x-2">
          <RouterLink 
            to="/admin/dashboard" 
            class="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeftIcon class="mr-1.5 h-4 w-4" />
            Yönetici Paneline Dön
          </RouterLink>
          <button
            type="button"
            class="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <UserPlusIcon class="mr-1.5 h-4 w-4" />
            Yeni Çalışan Ekle
          </button>
        </div>
      </div>
      
      <!-- Placeholder İçerik -->
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Bu sayfa geliştirme aşamasındadır
          </h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">
            Çalışan yönetimi sayfası yakında hizmetinizde olacaktır.
          </p>
        </div>
        <div class="px-4 py-5 sm:p-6">
          <div class="py-10 text-center">
            <UsersIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">Çalışan bulunamadı</h3>
            <p class="mt-1 text-sm text-gray-500">
              Henüz sisteme çalışan eklenmemiş veya veriler yüklenemiyor.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { 
  ArrowLeftIcon,
  UserPlusIcon,
  UsersIcon
} from '@heroicons/vue/24/outline'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

// Yetki kontrolü
onMounted(() => {
  if (!authStore.isAdmin()) {
    router.push('/access-denied')
  }
})
</script>
