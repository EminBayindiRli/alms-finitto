<template>
    <div class="flex flex-col w-full bg-[#1c1c1c] min-h-screen text-white">
      <!-- Header -->
      <div class="py-6 px-6 md:px-10 border-b border-gray-800">
        <h1 class="text-2xl font-medium text-white flex items-center">
          <span class="inline-block w-3 h-3 rounded-full bg-cyan-500 mr-3"></span>
          Yönetici Paneli
        </h1>
        <p class="text-gray-400 mt-1">Gelişmiş şirket istatistikleri ve yönetim araçları</p>
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
              <div class="animate-ping absolute w-full h-full rounded-full bg-cyan-500 opacity-75"></div>
              <div class="relative w-full h-full rounded-full bg-cyan-500"></div>
            </div>
            <p class="mt-4 text-gray-400">Veriler yükleniyor...</p>
          </div>
        </div>
  
        <!-- Content (when loaded) -->
        <div v-else class="space-y-8">
          <!-- Quick Actions -->
          <div class="bg-[#2e2e2e] rounded-lg p-6 border border-gray-800">
            <h3 class="text-lg font-medium mb-4">Hızlı İşlemler</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button @click="navigateTo('/admin/employees')" class="flex flex-col items-center p-4 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-cyan-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span class="text-sm">Çalışan Yönetimi</span>
              </button>
              
              <button @click="navigateTo('/admin/departments')" class="flex flex-col items-center p-4 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-violet-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span class="text-sm">Departman Yönetimi</span>
              </button>
              
              <button @click="navigateTo('/admin/teams')" class="flex flex-col items-center p-4 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-emerald-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span class="text-sm">Takım Yönetimi</span>
              </button>
              
              <button @click="navigateTo('/admin/trainings')" class="flex flex-col items-center p-4 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-amber-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
                <span class="text-sm">Eğitim Yönetimi</span>
              </button>
            </div>
          </div>
          
          <!-- Summary Stats -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Total Employees -->
            <div class="bg-[#2e2e2e] rounded-lg p-6 border border-gray-800">
              <div class="flex justify-between">
                <h3 class="text-sm font-medium text-gray-400">Toplam Çalışan</h3>
                <span class="flex h-6 w-6 rounded-full bg-cyan-500/20 items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </span>
              </div>
              <p class="mt-2 text-3xl font-semibold">{{ stats.totalEmployees }}</p>
              <p class="mt-2 text-sm text-emerald-500">
                <span class="flex items-center">
                  <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  +{{ stats.employeesGrowth }}% son ayda
                </span>
              </p>
            </div>
            
            <!-- Active Departments -->
            <div class="bg-[#2e2e2e] rounded-lg p-6 border border-gray-800">
              <div class="flex justify-between">
                <h3 class="text-sm font-medium text-gray-400">Aktif Departmanlar</h3>
                <span class="flex h-6 w-6 rounded-full bg-violet-500/20 items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-violet-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd" />
                  </svg>
                </span>
              </div>
              <p class="mt-2 text-3xl font-semibold">{{ stats.totalDepartments }}</p>
              <p class="mt-2 text-sm text-emerald-500">
                <span class="flex items-center">
                  <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  +{{ stats.departmentsGrowth }}% son çeyrekte
                </span>
              </p>
            </div>
            
            <!-- Average Performance -->
            <div class="bg-[#2e2e2e] rounded-lg p-6 border border-gray-800">
              <div class="flex justify-between">
                <h3 class="text-sm font-medium text-gray-400">Ortalama Performans</h3>
                <span class="flex h-6 w-6 rounded-full bg-emerald-500/20 items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                  </svg>
                </span>
              </div>
              <p class="mt-2 text-3xl font-semibold">{{ stats.avgPerformance }}%</p>
              <p class="mt-2 text-sm" :class="stats.performanceChange >= 0 ? 'text-emerald-500' : 'text-red-500'">
                <span class="flex items-center">
                  <svg v-if="stats.performanceChange >= 0" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  <svg v-else class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  {{ stats.performanceChange >= 0 ? '+' : '' }}{{ stats.performanceChange }}% son ayda
                </span>
              </p>
            </div>
            
            <!-- Training Completion -->
            <div class="bg-[#2e2e2e] rounded-lg p-6 border border-gray-800">
              <div class="flex justify-between">
                <h3 class="text-sm font-medium text-gray-400">Eğitim Tamamlama</h3>
                <span class="flex h-6 w-6 rounded-full bg-amber-500/20 items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </span>
              </div>
              <p class="mt-2 text-3xl font-semibold">{{ stats.completionRate }}%</p>
              <p class="mt-2 text-sm" :class="stats.completionChange >= 0 ? 'text-emerald-500' : 'text-red-500'">
                <span class="flex items-center">
                  <svg v-if="stats.completionChange >= 0" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  <svg v-else class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  {{ stats.completionChange >= 0 ? '+' : '' }}{{ stats.completionChange }}% son ayda
                </span>
              </p>
            </div>
          </div>
          
          <!-- Charts Section -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Department Performance Chart -->
            <div class="bg-[#2e2e2e] rounded-lg p-6 border border-gray-800">
              <div class="flex flex-col mb-4">
                <h3 class="text-lg font-medium">Departman Performansı</h3>
                <p class="text-sm text-gray-400">Son 6 aylık performans karşılaştırma</p>
              </div>
              <div class="h-80">
                <canvas ref="departmentChart"></canvas>
              </div>
            </div>
  
            <!-- Employee Growth Chart -->
            <div class="bg-[#2e2e2e] rounded-lg p-6 border border-gray-800">
              <div class="flex flex-col mb-4">
                <h3 class="text-lg font-medium">Çalışan Sayısı Trendi</h3>
                <p class="text-sm text-gray-400">Son 12 aydaki çalışan sayısı değişimi</p>
              </div>
              <div class="h-80">
                <canvas ref="employeeChart"></canvas>
              </div>
            </div>
          </div>
          
          <!-- Recent Activities -->
          <div class="bg-[#2e2e2e] rounded-lg p-6 border border-gray-800">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-medium">Son Aktiviteler</h3>
              <button class="text-sm text-cyan-500 hover:text-cyan-400">Tüm aktiviteler →</button>
            </div>
            
            <div class="space-y-4">
              <div v-for="(activity, index) in recentActivities" :key="index" class="flex border-b border-gray-700 pb-4 last:border-0 last:pb-0">
                <div class="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center" :class="`bg-${activity.color}-500/20`">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="`text-${activity.color}-400`" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path v-if="activity.type === 'user'" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    <path v-else-if="activity.type === 'training'" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    <path v-else-if="activity.type === 'department'" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
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
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import api from '../api'
  import Chart from 'chart.js/auto'
  
  // Router for navigation
  const router = useRouter()
  
  // Chart refs
  const departmentChart = ref<HTMLCanvasElement | null>(null)
  const employeeChart = ref<HTMLCanvasElement | null>(null)
  
  // Data refs
  const loading = ref(true)
  const error = ref('')
  
  // Stats object
  const stats = ref({
    totalEmployees: 0,
    employeesGrowth: 0,
    totalDepartments: A0,
    departmentsGrowth: 0,
    avgPerformance: 0,
    performanceChange: 0,
    completionRate: 0,
    completionChange: 0
  })
  
  // Recent activities
  const recentActivities = ref([
    {
      type: 'user',
      color: 'cyan',
      description: 'Ahmet Yılmaz adlı çalışan sisteme eklendi',
      time: '30 dakika önce'
    },
    {
      type: 'training',
      color: 'amber',
      description: 'Siber Güvenlik Eğitimi Programı oluşturuldu',
      time: '1 saat önce'
    },
    {
      type: 'department',
      color: 'violet',
      description: 'Yazılım Departmanı yapılandırması güncellendi',
      time: '3 saat önce'
    },
    {
      type: 'document',
      color: 'emerald',
      description: 'Aylık performans raporu oluşturuldu',
      time: '5 saat önce'
    }
  ])
  
  // Chart instances
  let deptChart: Chart | null = null
  let emplChart: Chart | null = null
  
  // Navigation helper
  function navigateTo(path: string) {
    router.push(path)
  }
  
  // Chart colors (Supabase dark theme)
  const chartColors = {
    cyan: '#06b6d4',
    cyanLight: 'rgba(6, 182, 212, 0.2)',
    emerald: '#10b981',
    emeraldLight: 'rgba(16, 185, 129, 0.2)',
    violet: '#8b5cf6',
    violetLight: 'rgba(139, 92, 246, 0.2)',
    amber: '#f59e0b',
    amberLight: 'rgba(245, 158, 11, 0.2)',
    gray: '#94a3b8',
    grayLight: 'rgba(148, 163, 184, 0.2)'
  }
  
  onMounted(async () => {
    try {
      loading.value = true
      error.value = ''
      console.log('Fetching admin dashboard data...')
      
      // Fetch data
      const response = await api.get('admin/dashboard/stats')
      console.log('Response:', response.data)
      
      // Update stats
      const data = response.data
      
      stats.value = {
        totalEmployees: data.total_employees || 345,
        employeesGrowth: data.employees_growth || 12.5,
        totalDepartments: data.total_departments || 8,
        departmentsGrowth: data.departments_growth || 25.0,
        avgPerformance: data.avg_performance || 76,
        performanceChange: data.performance_change || 5.2,
        completionRate: data.completion_rate || 68,
        completionChange: data.completion_change || -3.4
      }
      
      // Initialize charts
      setTimeout(() => {
        createDepartmentChart(data.department_data || getDummyDepartmentData())
        createEmployeeChart(data.employee_data || getDummyEmployeeData())
      }, 100)
      
    } catch (e: any) {
      console.error('Error fetching admin dashboard data:', e)
      // Still render with dummy data on error
      setTimeout(() => {
        createDepartmentChart(getDummyDepartmentData())
        createEmployeeChart(getDummyEmployeeData())
      }, 100)
      error.value = e.message || 'Veri yüklenirken bir hata oluştu'
    } finally {
      loading.value = false
    }
  })
  
  // Create department performance chart
  function createDepartmentChart(data: any) {
    if (!departmentChart.value) return
    
    const ctx = departmentChart.value.getContext('2d')
    if (!ctx) return
    
    deptChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: data.datasets.map((dataset: any, index: number) => ({
          ...dataset,
          backgroundColor: Object.values(chartColors)[index * 2],
          borderColor: Object.values(chartColors)[index * 2]
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
              color: '#fff'
            }
          }
        }
      }
    })
  }
  
  // Create employee growth chart
  function createEmployeeChart(data: any) {
    if (!employeeChart.value) return
    
    const ctx = employeeChart.value.getContext('2d')
    if (!ctx) return
    
    emplChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Çalışan Sayısı',
          data: data.values,
          backgroundColor: chartColors.cyanLight,
          borderColor: chartColors.cyan,
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
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

  // Dummy data functions for charts when API fails
  function getDummyDepartmentData() {
    return {
      labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
      datasets: [
        {
          label: 'Yazılım',
          data: [75, 78, 80, 82, 85, 88]
        },
        {
          label: 'Pazarlama',
          data: [65, 68, 70, 72, 74, 76]
        },
        {
          label: 'Finans',
          data: [80, 82, 78, 81, 83, 85]
        }
      ]
    }
  }

  function getDummyEmployeeData() {
    return {
      labels: ['Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık', 'Ocak', 'Şubat'],
      values: [298, 305, 312, 318, 325, 330, 335, 340, 338, 342, 348, 345]
    }
  }
</script>

<style scoped>
/* Supabase-like styles */
:deep(.chartjs-tooltip) {
  background-color: #1c1c1c !important;
  border: 1px solid #333 !important;
}

/* Transitions */
button, a {
  transition: all 0.2s ease;
}
</style>