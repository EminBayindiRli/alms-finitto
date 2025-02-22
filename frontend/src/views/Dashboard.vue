<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">ALMS Dashboard</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    <div class="mt-8">
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

const API_URL = import.meta.env.VITE_API_URL || 'https://alms-backend-api.onrender.com'

onMounted(async () => {
  try {
    const response = await axios.get(`${API_URL}/analyze/all`)
    const data = response.data
    
    totalEmployees.value = data.total_employees || 0
    
    // Departman istatistiklerinden ortalama performans hesaplama
    if (data.department_statistics) {
      let totalPerformance = 0
      let departmentCount = 0
      for (const dept in data.department_statistics) {
        if (data.department_statistics[dept].performance) {
          totalPerformance += data.department_statistics[dept].performance
          departmentCount++
        }
      }
      avgPerformance.value = departmentCount > 0 ? Math.round(totalPerformance / departmentCount) : 0
    }

    // Eğitim tamamlama oranı hesaplama
    if (data.department_statistics) {
      let totalCompletion = 0
      let departmentCount = 0
      for (const dept in data.department_statistics) {
        if (data.department_statistics[dept].completion_rate) {
          totalCompletion += data.department_statistics[dept].completion_rate
          departmentCount++
        }
      }
      completionRate.value = departmentCount > 0 ? Math.round(totalCompletion / departmentCount) : 0
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    // Hata durumunda kullanıcıya bilgi vermek için alert ekleyelim
    alert('Veriler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.')
  }
})
</script>
