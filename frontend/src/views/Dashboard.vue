<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">ALMS Dashboard</h1>
    
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
      <strong class="font-bold">Hata!</strong>
      <span class="block sm:inline"> {{ error }}</span>
    </div>
    
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Özet Kartları -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-2">Toplam Çalışan</h3>
        <p class="text-3xl font-bold text-blue-600">{{ totalEmployees }}</p>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-2">Ortalama Performans</h3>
        <p class="text-3xl font-bold text-green-600">{{ avgPerformance }}%</p>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-2">Eğitim Tamamlama</h3>
        <p class="text-3xl font-bold text-purple-600">{{ completionRate }}%</p>
      </div>
    </div>

    <!-- Departman İstatistikleri -->
    <div v-if="!loading && !error" class="mt-8">
      <h2 class="text-xl font-semibold mb-4">Departman İstatistikleri</h2>
      <div class="bg-white p-6 rounded-lg shadow">
        <!-- Buraya Chart.js grafikleri eklenecek -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const totalEmployees = ref(0)
const avgPerformance = ref(0)
const completionRate = ref(0)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    loading.value = true
    error.value = null
    console.log('Fetching data from API...')
    
    const response = await axios.get('/analyze/all')
    console.log('Response:', response.data)
    
    const data = response.data
    
    totalEmployees.value = data.total_employees || 0
    
    // Departman istatistiklerinden ortalama performans hesaplama
    if (data.department_statistics) {
      let totalPerformance = 0
      let departmentCount = 0
      
      Object.values(data.department_statistics).forEach((dept: any) => {
        if (dept.performance) {
          totalPerformance += dept.performance
          departmentCount++
        }
      })
      
      avgPerformance.value = departmentCount > 0 
        ? Math.round(totalPerformance / departmentCount) 
        : 0
    }
    
    // Tamamlanma oranı hesaplama
    if (data.department_statistics) {
      let totalCompletion = 0
      let departmentCount = 0
      
      Object.values(data.department_statistics).forEach((dept: any) => {
        if (dept.completion_rate) {
          totalCompletion += dept.completion_rate
          departmentCount++
        }
      })
      
      completionRate.value = departmentCount > 0 
        ? Math.round(totalCompletion / departmentCount) 
        : 0
    }
  } catch (e: any) {
    console.error('Error fetching data:', e)
    error.value = e.message || 'Veri yüklenirken bir hata oluştu'
  } finally {
    loading.value = false
  }
})
</script>
