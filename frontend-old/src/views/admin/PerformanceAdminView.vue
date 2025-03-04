<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">Performans Yönetimi</h1>
          <p class="mt-1 text-sm text-gray-500">
            Şirket genelinde performans metriklerini izleyin ve yönetin
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
        </div>
      </div>
      
      <!-- Bu bileşen şu an sadece bir iskelet olarak oluşturuldu -->
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <div class="p-6 text-center text-gray-500">
          <ChartBarSquareIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-lg font-medium text-gray-900">Performans Yönetimi Sayfası Yapım Aşamasında</h3>
          <p class="mt-1 text-sm text-gray-500">Bu bileşen henüz tamamlanmadı. Yakında burada performans yönetim araçları yer alacak.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { 
  ArrowLeftIcon,
  ChartBarSquareIcon
} from '@heroicons/vue/24/outline'
</script>
