<template>
  <div class="p-6">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold">Çalışan Detayı</h1>
      <button 
        @click="downloadReport"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Rapor İndir
      </button>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="employee" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Performans Metrikleri -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">Performans Metrikleri</h2>
        <div class="space-y-4">
          <div v-for="(value, metric) in employee.current_metrics" :key="metric">
            <div class="flex justify-between mb-1">
              <span class="text-gray-700">{{ metric }}</span>
              <span class="font-semibold">{{ value }}</span>
            </div>
            <div class="h-2 bg-gray-200 rounded-full">
              <div 
                class="h-2 bg-blue-600 rounded-full" 
                :style="{ width: value + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tarihsel Trendler -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">Tarihsel Trendler</h2>
        <!-- Buraya Chart.js grafikleri eklenecek -->
      </div>

      <!-- Öneriler -->
      <div class="bg-white p-6 rounded-lg shadow md:col-span-2">
        <h2 class="text-xl font-semibold mb-4">Eğitim Önerileri</h2>
        <div class="space-y-4">
          <div 
            v-for="(rec, index) in employee.recommendations" 
            :key="index"
            class="p-4 bg-gray-50 rounded-lg"
          >
            <h3 class="font-semibold text-lg mb-2">{{ rec.title }}</h3>
            <p class="text-gray-600">{{ rec.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-600">
      Çalışan bulunamadı.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../api'

// Çalışan veri tipi
interface Recommendation {
  title: string;
  description: string;
}

interface Metrics {
  [key: string]: number | string;
}

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  current_metrics: Metrics;
  recommendations: Recommendation[];
}

const route = useRoute()
const employee = ref<Employee | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await api.get(`analyze/employee/${route.params.id}`)
    employee.value = response.data
  } catch (error) {
    console.error('Error fetching employee data:', error)
  } finally {
    loading.value = false
  }
})

const downloadReport = async () => {
  try {
    const response = await api.get(
      `reports/employee/${route.params.id}`,
      { responseType: 'blob' }
    )
    
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `employee_${route.params.id}_report.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (error) {
    console.error('Error downloading report:', error)
  }
}
</script>
