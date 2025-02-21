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

onMounted(async () => {
  try {
    const response = await axios.get('https://alms-last.onrender.com/analyze/all')
    const data = response.data
    
    totalEmployees.value = data.total_employees
    // Diğer metrikleri de ekleyin
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  }
})
</script>
