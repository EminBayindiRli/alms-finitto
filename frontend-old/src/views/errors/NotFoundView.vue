<template>
  <div class="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <h1 class="text-9xl font-extrabold text-indigo-600">404</h1>
        <h2 class="mt-4 text-3xl font-bold text-gray-900 tracking-tight">Sayfa Bulunamadı</h2>
        <p class="mt-2 text-base text-gray-500">
          Üzgünüz, aradığınız sayfayı bulamadık.
        </p>
        <div class="mt-8">
          <RouterLink 
            to="/" 
            class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <HomeIcon class="mr-2 h-5 w-5" /> 
            Ana Sayfaya Dön
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { HomeIcon } from '@heroicons/vue/24/outline'
</script>
