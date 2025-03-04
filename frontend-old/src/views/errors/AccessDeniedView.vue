<template>
  <div class="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <div class="inline-flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mx-auto">
          <ShieldExclamationIcon class="h-12 w-12 text-red-600" />
        </div>
        <h1 class="mt-4 text-3xl font-extrabold text-gray-900">Erişim Reddedildi</h1>
        <h2 class="mt-2 text-xl font-medium text-gray-700">Bu sayfaya erişim yetkiniz bulunmamaktadır.</h2>
        <p class="mt-2 text-base text-gray-500">
          İhtiyaç duyduğunuz yetkiler için sistem yöneticisiyle iletişime geçin.
        </p>
        <div class="mt-8 flex justify-center space-x-4">
          <RouterLink 
            to="/" 
            class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <HomeIcon class="mr-2 h-5 w-5" /> 
            Ana Sayfaya Dön
          </RouterLink>
          <button 
            type="button"
            @click="goBack"
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowLeftIcon class="mr-2 h-5 w-5" />
            Geri Dön
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { ShieldExclamationIcon, HomeIcon, ArrowLeftIcon } from '@heroicons/vue/24/outline'

const router = useRouter()

function goBack() {
  router.back()
}
</script>
