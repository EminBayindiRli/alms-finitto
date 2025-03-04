<template>
  <div class="flex flex-col w-full bg-[#1c1c1c] min-h-screen text-white">
    <!-- Dashboard Header -->
    <div class="py-6 px-6 md:px-10 border-b border-gray-800">
      <h1 class="text-2xl font-medium text-white flex items-center">
        <span class="inline-block w-3 h-3 rounded-full bg-emerald-500 mr-3"></span>
        {{ isEmployee ? 'Kişisel Dashboard' : 'Şirket Dashboard' }}
      </h1>
      <p class="text-gray-400 mt-1">
        {{ isEmployee ? 'Kişisel eğitim ve performans verileriniz' : 'Şirket geneli eğitim ve performans verileri' }}
      </p>
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
            <div class="animate-ping absolute w-full h-full rounded-full bg-emerald-500 opacity-75"></div>
            <div class="relative w-full h-full rounded-full bg-emerald-500"></div>
          </div>
          <p class="mt-4 text-gray-400">Veriler yükleniyor...</p>
        </div>
      </div>

      <!-- Content (when loaded) -->
      <div v-else class="space-y-8">
        <!-- Summary Cards - First Row -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Total Employees Card -->
          <div class="bg-[#2e2e2e] rounded-lg p-6 border border-gray-800">
            <div class="flex justify-between">
              <h3 class="text-sm font-medium text-gray-400">{{ isEmployee ? 'Departman Çalışanları' : 'Toplam Çalışan' }}</h3>
              <span class="flex h-6 w-6 rounded-full bg-violet-500/20 items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-violet-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </span>
            </div>
            <p class="mt-2 text-3xl font-semibold">{{ totalEmployees }}</p>
            <div class="mt-2 flex items-center text-sm">
              <router-link to="/employees" class="text-emerald-500 hover:text-emerald-400 font-medium">
                {{ isEmployee ? 'Departmandaki çalışanlar' : 'Tüm çalışanları görüntüle' }} →
              </router-link>
            </div>
          </div>

          <!-- Average Performance Card -->
          <div class="bg-[#2e2e2e] rounded-lg p-6 border border-gray-800">
            <div class="flex justify-between">
              <h3 class="text-sm font-medium text-gray-400">{{ isEmployee ? 'Performansınız' : 'Ortalama Performans' }}</h3>
              <span class="flex h-6 w-6 rounded-full bg-cyan-500/20 items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </span>
            </div>
            <div class="flex items-baseline mt-2">
              <p class="text-3xl font-semibold">{{ avgPerformance }}%</p>
              <div class="ml-2 flex items-center text-sm font-medium" :class="{
                'text-emerald-500': avgPerformance > 70,
                'text-amber-500': avgPerformance > 50 && avgPerformance <= 70,
                'text-red-500': avgPerformance <= 50
              }">
                <span>{{ 
                  avgPerformance > 70 
                    ? 'Yüksek' 
                    : avgPerformance > 50 
                      ? 'Orta' 
                      : 'Düşük' 
                }}</span>
              </div>
            </div>
            <div class="mt-2 flex items-center text-sm">
              <router-link to="/performance" class="text-emerald-500 hover:text-emerald-400 font-medium">
                {{ isEmployee ? 'Performans detayları' : 'Performans raporları' }} →
              </router-link>
            </div>
          </div>

          <!-- Training Completion Card -->
          <div class="bg-[#2e2e2e] rounded-lg p-6 border border-gray-800">
            <div class="flex justify-between">
              <h3 class="text-sm font-medium text-gray-400">{{ isEmployee ? 'Eğitim Tamamlamanız' : 'Eğitim Tamamlama' }}</h3>
              <span class="flex h-6 w-6 rounded-full bg-amber-500/20 items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </span>
            </div>
            <div class="flex items-baseline mt-2">
              <p class="text-3xl font-semibold">{{ completionRate }}%</p>
              <div class="ml-2 flex items-center text-sm">
                <div class="relative w-16 h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div class="absolute top-0 left-0 h-full rounded-full" 
                    :class="{
                      'bg-emerald-500': completionRate >= 70,
                      'bg-amber-500': completionRate >= 40 && completionRate < 70,
                      'bg-red-500': completionRate < 40
                    }"
                    :style="`width: ${completionRate}%`"></div>
                </div>
              </div>
            </div>
            <div class="mt-2 flex items-center text-sm">
              <router-link to="/trainings" class="text-emerald-500 hover:text-emerald-400 font-medium">
                {{ isEmployee ? 'Eğitimlerinize gidin' : 'Eğitim ilerlemesi' }} →
              </router-link>
            </div>
          </div>
        </div>

        <!-- Recent Activity Section (Conditional for Employee) -->
        <div v-if="isEmployee" class="bg-[#2e2e2e] rounded-lg p-6 border border-gray-800">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-medium">Son Aktiviteleriniz</h3>
              <p class="text-sm text-gray-400 mt-1">Son 30 gün içindeki aktiviteleriniz</p>
            </div>
          </div>
          
          <div class="space-y-4">
            <div v-for="(activity, index) in recentActivities" :key="index" class="flex border-b border-gray-700 pb-4 last:border-0 last:pb-0">
              <div class="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center" :class="`bg-${activity.color}-500/20`">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="`text-${activity.color}-400`" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path v-if="activity.type === 'training'" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  <path v-else-if="activity.type === 'performance'" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm">{{ activity.description }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ activity.time }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Department Performance Chart -->
          <div class="bg-[#2e2e2e] rounded-lg p-6 border border-gray-800">
            <div class="flex flex-col mb-4">
              <h3 class="text-lg font-medium">{{ isEmployee ? 'Performans Gelişiminiz' : 'Departman Performansı' }}</h3>
              <p class="text-sm text-gray-400">Son 30 günlük {{ isEmployee ? 'kişisel performans' : 'departman bazlı performans' }} verileri</p>
            </div>
            <div class="h-80">
              <canvas ref="performanceChart"></canvas>
            </div>
          </div>

          <!-- Training Completion Chart -->
          <div class="bg-[#2e2e2e] rounded-lg p-6 border border-gray-800">
            <div class="flex flex-col mb-4">
              <h3 class="text-lg font-medium">{{ isEmployee ? 'Eğitim İlerleyişiniz' : 'Eğitim Tamamlama Oranları' }}</h3>
              <p class="text-sm text-gray-400">{{ isEmployee ? 'Son 6 aydaki eğitim kategorilerine göre ilerleyişiniz' : 'Departman bazlı eğitim tamamlama oranları' }}</p>
            </div>
            <div class="h-80">
              <canvas ref="completionChart"></canvas>
            </div>
          </div>
        </div>
        
        <!-- Upcoming Trainings Section -->
        <div v-if="isEmployee && upcomingTrainings.length > 0" class="bg-[#2e2e2e] rounded-lg p-6 border border-gray-800">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-medium">Yaklaşan Eğitimleriniz</h3>
              <p class="text-sm text-gray-400 mt-1">Önümüzdeki hafta içinde tamamlanması gereken eğitimler</p>
            </div>
            <router-link to="/trainings" class="text-sm text-cyan-500 hover:text-cyan-400 mt-2 md:mt-0">
              Tüm eğitimler →
            </router-link>
          </div>
          
          <div class="space-y-4">
            <div v-for="(training, index) in upcomingTrainings" :key="index" class="flex items-center bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div class="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center bg-amber-500/20 text-amber-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div class="ml-4 flex-1">
                <p class="text-sm font-medium">{{ training.name }}</p>
                <div class="flex justify-between items-center mt-1">
                  <p class="text-xs text-gray-400">Son Tarih: {{ training.dueDate }}</p>
                  <div>
                    <span class="text-xs px-2 py-1 rounded-full" :class="getDueDateClass(training.daysLeft)">
                      {{ training.daysLeft }} gün kaldı
                    </span>
                  </div>
                </div>
              </div>
              <router-link :to="`/trainings/${training.id}`" class="ml-4 text-cyan-500 hover:text-cyan-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '../api'
import Chart from 'chart.js/auto'
import { useAuthStore } from '@/stores/auth'

// Auth store for role-based content
const authStore = useAuthStore()
const isEmployee = computed(() => authStore.isEmployee())
const employeeId = computed(() => authStore.getUserInfo()?.employeeId || '')

// Data refs
const totalEmployees = ref(0)
const avgPerformance = ref(0)
const completionRate = ref(0)
const loading = ref(true)
const error = ref<string | null>(null)

// Chart refs
const performanceChart = ref<HTMLCanvasElement | null>(null)
const completionChart = ref<HTMLCanvasElement | null>(null)

// Recent activities (for employee view)
const recentActivities = ref([
  {
    type: 'training',
    color: 'amber',
    description: 'Siber Güvenlik Eğitimi tamamlandı',
    time: '2 gün önce'
  },
  {
    type: 'performance',
    color: 'cyan',
    description: 'Haftalık performans değerlendirmesi yapıldı',
    time: '5 gün önce'
  },
  {
    type: 'training',
    color: 'amber',
    description: 'İletişim Becerileri Eğitimi başladı',
    time: '1 hafta önce'
  },
  {
    type: 'document',
    color: 'emerald',
    description: 'Aylık rapor teslim edildi',
    time: '2 hafta önce'
  }
])

// Upcoming trainings (for employee view)
const upcomingTrainings = ref([
  {
    id: 1,
    name: 'Proje Yönetimi Temelleri',
    dueDate: '10 Mart 2025',
    daysLeft: 7
  },
  {
    id: 2,
    name: 'Veri Gizliliği ve KVKK',
    dueDate: '8 Mart 2025',
    daysLeft: 5
  },
  {
    id: 3,
    name: 'Takım Çalışması ve İşbirliği',
    dueDate: '6 Mart 2025',
    daysLeft: 3
  }
])

// Chart instances - define as variables to instantiate and clean up charts
// Used in createPerformanceChart and createCompletionChart functions
let perfChart: Chart | null = null // Used to store performance chart instance
let compChart: Chart | null = null // Used to store completion chart instance

// Chart colors (Supabase dark theme)
const chartColors = {
  emerald: '#10b981',
  emeraldLight: 'rgba(16, 185, 129, 0.2)',
  violet: '#8b5cf6',
  violetLight: 'rgba(139, 92, 246, 0.2)',
  amber: '#f59e0b',
  amberLight: 'rgba(245, 158, 11, 0.2)',
  cyan: '#06b6d4',
  cyanLight: 'rgba(6, 182, 212, 0.2)',
  slate: '#94a3b8',
  slateLight: 'rgba(148, 163, 184, 0.2)'
}

// Helper function for upcoming training due dates
function getDueDateClass(daysLeft: number): string {
  if (daysLeft <= 3) return 'bg-red-500/20 text-red-400'
  if (daysLeft <= 5) return 'bg-amber-500/20 text-amber-400'
  return 'bg-emerald-500/20 text-emerald-400'
}

onMounted(async () => {
  try {
    loading.value = true
    error.value = null
    console.log('Fetching data from API...')
    
    // Determine endpoint based on user role
    const endpoint = isEmployee.value 
      ? `analyze/employee/${employeeId.value}` 
      : 'analyze/all'
    
    const response = await api.get(endpoint)
    const data = response.data
    
    // Update stats based on API response
    totalEmployees.value = isEmployee.value ? data.department_size : data.total_employees
    avgPerformance.value = data.avg_performance
    completionRate.value = data.completion_rate
    
    // Create charts
    setTimeout(() => {
      if (data.performance_data) {
        createPerformanceChart(data.performance_data.labels, data.performance_data.values)
      } else {
        // Fallback to dummy data if API doesn't provide it
        createPerformanceChart(
          ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          [65, 68, 72, 75, 78, 82]
        )
      }
      
      if (data.completion_data) {
        createCompletionChart(data.completion_data.labels, data.completion_data.values)
      } else {
        // Fallback to dummy data if API doesn't provide it
        createCompletionChart(
          isEmployee.value 
            ? ['Teknik', 'İletişim', 'Liderlik', 'Güvenlik']
            : ['Yazılım', 'Pazarlama', 'İK', 'Finans', 'Operasyon'],
          isEmployee.value 
            ? [85, 70, 60, 90]
            : [78, 65, 92, 80, 72]
        )
      }
    }, 100)
    
  } catch (e: unknown) {
    console.error('Error fetching data:', e)
    error.value = (e as Error).message || 'Veriler yüklenirken bir hata oluştu'
    
    // Load dummy data on error
    totalEmployees.value = isEmployee.value ? 15 : 248
    avgPerformance.value = isEmployee.value ? 78 : 72
    completionRate.value = isEmployee.value ? 85 : 68
    
    // Create charts with dummy data
    setTimeout(() => {
      createPerformanceChart(
        ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        [65, 68, 72, 75, 78, 82]
      )
      
      createCompletionChart(
        isEmployee.value 
          ? ['Teknik', 'İletişim', 'Liderlik', 'Güvenlik']
          : ['Yazılım', 'Pazarlama', 'İK', 'Finans', 'Operasyon'],
        isEmployee.value 
          ? [85, 70, 60, 90]
          : [78, 65, 92, 80, 72]
      )
    }, 100)
  } finally {
    loading.value = false
  }
})

// Create performance chart
function createPerformanceChart(labels: string[], data: number[]) {
  if (!performanceChart.value) return
  
  const ctx = performanceChart.value.getContext('2d')
  if (!ctx) return
  
  perfChart = new Chart(ctx, {
    type: isEmployee.value ? 'line' : 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: isEmployee.value ? 'Performans Puanı' : 'Ortalama Performans',
        data: data,
        backgroundColor: isEmployee.value ? chartColors.cyanLight : chartColors.cyan,
        borderColor: chartColors.cyan,
        borderWidth: 2,
        tension: 0.3,
        fill: isEmployee.value
      }]
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
            color: '#fff'
          }
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

// Create completion chart
function createCompletionChart(labels: string[], data: number[]) {
  if (!completionChart.value) return
  
  const ctx = completionChart.value.getContext('2d')
  if (!ctx) return
  
  // Create colors array based on number of labels
  const backgroundColors = [
    chartColors.emerald,
    chartColors.violet,
    chartColors.amber,
    chartColors.cyan,
    chartColors.slate
  ]
  
  compChart = new Chart(ctx, {
    type: isEmployee.value ? 'radar' : 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        label: 'Tamamlanma Oranı (%)',
        data: data,
        backgroundColor: isEmployee.value 
          ? 'rgba(6, 182, 212, 0.3)'
          : backgroundColors.slice(0, labels.length),
        borderColor: isEmployee.value ? chartColors.cyan : 'transparent',
        borderWidth: 2,
        pointBackgroundColor: isEmployee.value ? chartColors.cyan : undefined,
        pointRadius: isEmployee.value ? 4 : undefined
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: isEmployee.value ? {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: {
            color: '#94a3b8',
            backdropColor: 'transparent',
            showLabelBackdrop: false
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          angleLines: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        }
      } : {},
      plugins: {
        legend: {
          position: isEmployee.value ? 'top' : 'right',
          labels: {
            color: '#fff',
            padding: 20,
            font: {
              size: 12
            }
          }
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
</script>

<style scoped>
/* Supabase-like styles */
:deep(.chartjs-tooltip) {
  background-color: rgba(0, 0, 0, 0.85);
  border-radius: 0.375rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.chartjs-tooltip-key) {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 10px;
  border-radius: 50%;
}
</style>