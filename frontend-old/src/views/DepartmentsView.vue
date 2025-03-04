<template>
  <div class="flex flex-col w-full bg-[#1c1c1c] min-h-screen text-white">
    <!-- Header -->
    <div class="py-6 px-6 md:px-10 border-b border-gray-800">
      <h1 class="text-2xl font-medium text-white flex items-center">
        <span class="inline-block w-3 h-3 rounded-full bg-violet-500 mr-3"></span>
        Departmanlar
      </h1>
      <p class="text-gray-400 mt-1">Şirket departmanları ve performans bilgileri</p>
    </div>

    <!-- Main Content -->
    <div class="flex-1 p-6 md:p-10">
      <!-- Error State -->
      <div v-if="error" class="mb-8 bg-red-900/20 border border-red-700 text-red-200 rounded-md p-4 flex items-start">
        <div class="mr-3 mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 class="text-sm font-medium">Veri yüklenirken bir hata oluştu</h3>
          <p class="mt-1 text-sm text-red-300">{{ error }}</p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="flex flex-col items-center">
          <div class="w-10 h-10 relative">
            <div class="animate-ping absolute w-full h-full rounded-full bg-violet-500 opacity-75"></div>
            <div class="relative w-full h-full rounded-full bg-violet-500"></div>
          </div>
          <p class="mt-4 text-gray-400">Departman verileri yükleniyor...</p>
        </div>
      </div>

      <!-- Content (when loaded) -->
      <div v-else class="space-y-8">
        <!-- Department Overview Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="department in departments" :key="department.id" class="bg-[#2e2e2e] rounded-lg border border-gray-800 overflow-hidden">
            <div class="h-2" :class="`bg-${getDepartmentColor(department.performance)}-500`"></div>
            <div class="p-6">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-lg font-medium">{{ department.name }}</h3>
                  <p class="text-sm text-gray-400 mt-1">{{ department.employeeCount }} Çalışan</p>
                </div>
                <div class="h-10 w-10 rounded-full flex items-center justify-center" :class="`bg-${getDepartmentColor(department.performance)}-500/20`">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="`text-${getDepartmentColor(department.performance)}-400`" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              
              <div class="mt-6 space-y-4">
                <!-- Performance -->
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span class="text-gray-400">Performans</span>
                    <span class="font-medium">{{ department.performance }}%</span>
                  </div>
                  <div class="w-full bg-gray-700 rounded-full h-2">
                    <div class="h-2 rounded-full" :style="`width: ${department.performance}%`" :class="`bg-${getDepartmentColor(department.performance)}-500`"></div>
                  </div>
                </div>
                
                <!-- Training Completion -->
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span class="text-gray-400">Eğitim Tamamlama</span>
                    <span class="font-medium">{{ department.trainingCompletion }}%</span>
                  </div>
                  <div class="w-full bg-gray-700 rounded-full h-2">
                    <div class="h-2 rounded-full" :style="`width: ${department.trainingCompletion}%`" :class="`bg-${getDepartmentColor(department.trainingCompletion)}-500`"></div>
                  </div>
                </div>
                
                <!-- Budget Usage -->
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span class="text-gray-400">Bütçe Kullanımı</span>
                    <span class="font-medium">{{ department.budgetUsage }}%</span>
                  </div>
                  <div class="w-full bg-gray-700 rounded-full h-2">
                    <div class="h-2 rounded-full" :style="`width: ${department.budgetUsage}%`" :class="`bg-${getBudgetColor(department.budgetUsage)}-500`"></div>
                  </div>
                </div>
              </div>
              
              <div class="mt-6 pt-4 border-t border-gray-700">
                <div class="flex justify-between text-sm">
                  <div>
                    <span class="text-gray-400">Departman Yöneticisi:</span>
                    <span class="ml-1">{{ department.manager }}</span>
                  </div>
                  <router-link :to="`/departments/${department.id}`" class="text-violet-400 hover:text-violet-300">
                    Detaylar →
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Department Performance Chart -->
        <div class="bg-[#2e2e2e] rounded-lg p-6 border border-gray-800">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-medium">Departman Performans Karşılaştırması</h3>
              <p class="text-sm text-gray-400 mt-1">Son 6 aydaki performans değişimi</p>
            </div>
            <div class="mt-3 md:mt-0 flex">
              <select 
                v-model="chartPeriod" 
                @change="updateChart"
                class="bg-gray-800 border border-gray-700 text-white text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent py-2 px-3"
              >
                <option value="3">Son 3 Ay</option>
                <option value="6">Son 6 Ay</option>
                <option value="12">Son 12 Ay</option>
              </select>
            </div>
          </div>
          <div class="h-80">
            <canvas ref="performanceChart"></canvas>
          </div>
        </div>
        
        <!-- Department Stats Table -->
        <div class="bg-[#2e2e2e] rounded-lg border border-gray-800">
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="border-b border-gray-700">
                  <th scope="col" class="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Departman</th>
                  <th scope="col" class="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Çalışan Sayısı</th>
                  <th scope="col" class="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ortalama Kıdem (Yıl)</th>
                  <th scope="col" class="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Açık Pozisyon</th>
                  <th scope="col" class="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Yıllık Bütçe (₺)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-700">
                <tr v-for="department in departments" :key="`table-${department.id}`" class="hover:bg-gray-800/50">
                  <td class="px-5 py-4 whitespace-nowrap text-sm">
                    <div class="flex items-center">
                      <div class="h-8 w-8 rounded-md flex items-center justify-center mr-3 text-lg" :class="`bg-${getDepartmentColor(department.performance)}-500/20 text-${getDepartmentColor(department.performance)}-400`">
                        {{ department.name.charAt(0) }}
                      </div>
                      <span class="ml-2 font-medium">{{ department.name }}</span>
                    </div>
                  </td>
                  <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-300">{{ department.employeeCount }}</td>
                  <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-300">{{ department.averageTenure }}</td>
                  <td class="px-5 py-4 whitespace-nowrap text-sm">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="department.openPositions > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'">
                      {{ department.openPositions }}
                    </span>
                  </td>
                  <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-300">{{ formatCurrency(department.annualBudget) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../api'
import Chart from 'chart.js/auto'

// Data types
interface Department {
  id: number
  name: string
  manager: string
  employeeCount: number
  performance: number
  trainingCompletion: number
  budgetUsage: number
  averageTenure: number
  openPositions: number
  annualBudget: number
}

// Refs
const departments = ref<Department[]>([])
const loading = ref(true)
const error = ref('')
const performanceChart = ref<HTMLCanvasElement | null>(null)
const chartPeriod = ref('6')
let chart: Chart | null = null

// Fetch data
onMounted(async () => {
  try {
    loading.value = true
    error.value = ''
    
    const response = await api.get('departments')
    departments.value = response.data || []
    
    // If API fails, use dummy data
    if (!departments.value.length) {
      departments.value = getDummyDepartments()
    }
    
    // Initialize chart after data is loaded
    setTimeout(() => {
      createPerformanceChart()
    }, 200)
    
  } catch (e: any) {
    console.error('Error fetching departments:', e)
    error.value = e.message || 'Departman verileri yüklenirken bir hata oluştu'
    
    // Load dummy data on error
    departments.value = getDummyDepartments()
    
    // Still try to create chart
    setTimeout(() => {
      createPerformanceChart()
    }, 200)
  } finally {
    loading.value = false
  }
})

// Format currency helper
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('tr-TR', { 
    style: 'currency', 
    currency: 'TRY',
    maximumFractionDigits: 0
  }).format(value)
}

// Helper functions for UI
function getDepartmentColor(value: number): string {
  if (value >= 75) return 'emerald'
  if (value >= 50) return 'amber'
  return 'red'
}

function getBudgetColor(value: number): string {
  if (value <= 75) return 'emerald'
  if (value <= 90) return 'amber'
  return 'red'
}

// Chart creation
function createPerformanceChart() {
  if (!performanceChart.value) return
  
  const ctx = performanceChart.value.getContext('2d')
  if (!ctx) return
  
  // Define chart colors
  const chartColors = {
    violet: '#8b5cf6',
    emerald: '#10b981',
    amber: '#f59e0b',
    cyan: '#06b6d4',
    pink: '#ec4899',
    blue: '#3b82f6',
    red: '#ef4444',
    gray: '#94a3b8'
  }
  
  // Get chart data based on period
  const data = getPerformanceChartData(parseInt(chartPeriod.value))
  
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: data.datasets.map((dataset, index) => ({
        ...dataset,
        borderColor: Object.values(chartColors)[index % Object.values(chartColors).length],
        backgroundColor: 'transparent',
        tension: 0.3,
        borderWidth: 2,
        pointBackgroundColor: Object.values(chartColors)[index % Object.values(chartColors).length],
        pointRadius: 3
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#94a3b8'
          }
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#94a3b8'
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: '#fff',
            padding: 20
          },
          position: 'top',
          align: 'end'
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1
        }
      }
    }
  })
}

// Update chart when period changes
function updateChart() {
  if (!chart) return
  
  const data = getPerformanceChartData(parseInt(chartPeriod.value))
  
  chart.data.labels = data.labels
  data.datasets.forEach((dataset, index) => {
    if (chart?.data.datasets[index]) {
      chart.data.datasets[index].data = dataset.data
    }
  })
  
  chart.update()
}

// Generate chart data based on period
function getPerformanceChartData(months: number) {
  const labels = []
  const currentDate = new Date()
  
  // Generate labels (months)
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(currentDate)
    date.setMonth(date.getMonth() - i)
    labels.push(date.toLocaleDateString('tr-TR', { month: 'short' }))
  }
  
  // Generate datasets
  const datasets = departments.value.map(dept => {
    // Generate random performance data that trends upward or downward
    const performanceData = []
    let value = dept.performance - (Math.random() * 15)
    const trend = Math.random() > 0.5 ? 1 : -1
    
    for (let i = 0; i < months; i++) {
      value += trend * (Math.random() * 5 - 2)
      value = Math.max(40, Math.min(95, value)) // Keep between 40-95
      performanceData.push(Math.round(value))
    }
    
    // Last value should match current performance
    performanceData[performanceData.length - 1] = dept.performance
    
    return {
      label: dept.name,
      data: performanceData
    }
  })
  
  return { labels, datasets }
}

// Dummy data for testing or when API fails
function getDummyDepartments(): Department[] {
  return [
    {
      id: 1,
      name: 'Yazılım',
      manager: 'Ahmet Yılmaz',
      employeeCount: 48,
      performance: 87,
      trainingCompletion: 92,
      budgetUsage: 68,
      averageTenure: 3.6,
      openPositions: 5,
      annualBudget: 8500000
    },
    {
      id: 2,
      name: 'Pazarlama',
      manager: 'Ayşe Demir',
      employeeCount: 32,
      performance: 76,
      trainingCompletion: 81,
      budgetUsage: 92,
      averageTenure: 2.8,
      openPositions: 2,
      annualBudget: 6200000
    },
    {
      id: 3,
      name: 'İnsan Kaynakları',
      manager: 'Mehmet Kaya',
      employeeCount: 15,
      performance: 82,
      trainingCompletion: 95,
      budgetUsage: 65,
      averageTenure: 4.2,
      openPositions: 1,
      annualBudget: 2800000
    },
    {
      id: 4,
      name: 'Finans',
      manager: 'Zeynep Şahin',
      employeeCount: 22,
      performance: 91,
      trainingCompletion: 87,
      budgetUsage: 78,
      averageTenure: 5.3,
      openPositions: 0,
      annualBudget: 3500000
    },
    {
      id: 5,
      name: 'Müşteri Hizmetleri',
      manager: 'Can Özkan',
      employeeCount: 35,
      performance: 65,
      trainingCompletion: 72,
      budgetUsage: 88,
      averageTenure: 2.1,
      openPositions: 3,
      annualBudget: 3200000
    },
    {
      id: 6,
      name: 'Operasyon',
      manager: 'Elif Yıldız',
      employeeCount: 42,
      performance: 78,
      trainingCompletion: 68,
      budgetUsage: 95,
      averageTenure: 3.8,
      openPositions: 0,
      annualBudget: 7100000
    }
  ]
}
</script>

<style scoped>
/* Transitions */
button, a, select {
  transition: all 0.2s;
}

/* Table hover effect */
tr {
  transition: background-color 0.15s ease;
}

/* Chart tooltip customization */
:deep(.chartjs-tooltip) {
  background-color: #1c1c1c !important;
  border: 1px solid #333 !important;
}
</style>