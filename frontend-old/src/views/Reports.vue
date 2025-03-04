<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Raporlar</h1>

    <!-- Rapor Filtreleri -->
    <div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <input 
        type="text" 
        v-model="searchQuery"
        placeholder="Rapor Ara..."
        class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
      
      <select 
        v-model="selectedDepartment"
        class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Tüm Departmanlar</option>
        <option v-for="dept in departments" :key="dept" :value="dept">
          {{ dept }}
        </option>
      </select>

      <select 
        v-model="selectedPeriod"
        class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="daily">Günlük</option>
        <option value="weekly">Haftalık</option>
        <option value="monthly">Aylık</option>
        <option value="quarterly">Üç Aylık</option>
      </select>
    </div>

    <!-- Rapor Listesi -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="report in filteredReports" 
        :key="report.id"
        class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="font-semibold text-lg">{{ report.title }}</h3>
            <p class="text-gray-600 text-sm">{{ report.department }}</p>
          </div>
          <span class="text-sm text-gray-500">{{ formatDate(report.date) }}</span>
        </div>
        
        <p class="text-gray-700 mb-4 line-clamp-2">{{ report.description }}</p>
        
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-500">
            {{ report.type }} Rapor
          </span>
          <button 
            @click="downloadReport(report.id)"
            class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            İndir
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const searchQuery = ref('')
const selectedDepartment = ref('')
const selectedPeriod = ref('monthly')
const departments = ref([])
const reports = ref([])

// Filtreleme mantığı
const filteredReports = computed(() => {
  return reports.value.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesDepartment = !selectedDepartment.value || report.department === selectedDepartment.value
    return matchesSearch && matchesDepartment
  })
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const downloadReport = async (reportId: string) => {
  try {
    // API endpoint'i eklenecek
    console.log('Downloading report:', reportId)
  } catch (error) {
    console.error('Error downloading report:', error)
  }
}

// API'den veri çekme işlemleri buraya eklenecek
</script>
