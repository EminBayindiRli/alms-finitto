<template>
  <div class="flex flex-col w-full bg-[#1c1c1c] min-h-screen text-white">
    <!-- Header -->
    <div class="py-6 px-6 md:px-10 border-b border-gray-800">
      <h1 class="text-2xl font-medium text-white flex items-center">
        <span class="inline-block w-3 h-3 rounded-full bg-emerald-500 mr-3"></span>
        Çalışanlar
      </h1>
      <p class="text-gray-400 mt-1">Tüm şirket çalışanları ve performans bilgileri</p>
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
          <p class="mt-4 text-gray-400">Çalışan verileri yükleniyor...</p>
        </div>
      </div>

      <!-- Content (when loaded) -->
      <div v-else class="space-y-8">
        <!-- Filter and Search -->
        <div class="bg-[#2e2e2e] rounded-lg p-6 border border-gray-800">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="relative flex-1">
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="İsim, departman veya pozisyon ara..." 
                class="w-full py-2 px-3 pr-10 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white text-sm"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div class="flex space-x-2">
              <select 
                v-model="departmentFilter" 
                class="bg-gray-800 border border-gray-700 text-white text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent py-2 px-3"
              >
                <option value="">Tüm Departmanlar</option>
                <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
              </select>
              
              <select 
                v-model="sortBy" 
                class="bg-gray-800 border border-gray-700 text-white text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent py-2 px-3"
              >
                <option value="name">İsme Göre</option>
                <option value="department">Departmana Göre</option>
                <option value="performance">Performansa Göre</option>
                <option value="completion">Eğitim Tamamlamaya Göre</option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Employee Table -->
        <div class="bg-[#2e2e2e] rounded-lg border border-gray-800">
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="border-b border-gray-700">
                  <th scope="col" class="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Çalışan</th>
                  <th scope="col" class="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Departman</th>
                  <th scope="col" class="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Pozisyon</th>
                  <th scope="col" class="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Performans</th>
                  <th scope="col" class="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Eğitim Tamamlama</th>
                  <th scope="col" class="px-5 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">İşlemler</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-700">
                <tr v-for="employee in filteredEmployees" :key="employee.id" class="hover:bg-gray-800/50">
                  <td class="px-5 py-4 whitespace-nowrap text-sm">
                    <div class="flex items-center">
                      <div class="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300 mr-3">
                        {{ employee.name.charAt(0) }}{{ employee.surname.charAt(0) }}
                      </div>
                      <div>
                        <div class="font-medium">{{ employee.name }} {{ employee.surname }}</div>
                        <div class="text-gray-400 text-xs">{{ employee.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-300">{{ employee.department }}</td>
                  <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-300">{{ employee.position }}</td>
                  <td class="px-5 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="relative w-full max-w-[100px] h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div class="absolute top-0 left-0 h-full rounded-full" 
                          :style="`width: ${employee.performance}%`"
                          :class="{
                            'bg-emerald-500': employee.performance >= 70,
                            'bg-amber-500': employee.performance >= 40 && employee.performance < 70,
                            'bg-red-500': employee.performance < 40
                          }"></div>
                      </div>
                      <span class="ml-2 text-sm text-gray-300">{{ employee.performance }}%</span>
                    </div>
                  </td>
                  <td class="px-5 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="relative w-full max-w-[100px] h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div class="absolute top-0 left-0 h-full rounded-full" 
                          :style="`width: ${employee.completionRate}%`"
                          :class="{
                            'bg-emerald-500': employee.completionRate >= 70,
                            'bg-amber-500': employee.completionRate >= 40 && employee.completionRate < 70,
                            'bg-red-500': employee.completionRate < 40
                          }"></div>
                      </div>
                      <span class="ml-2 text-sm text-gray-300">{{ employee.completionRate }}%</span>
                    </div>
                  </td>
                  <td class="px-5 py-4 whitespace-nowrap text-sm text-center">
                    <router-link 
                      :to="`/employees/${employee.id}`" 
                      class="inline-flex items-center px-2.5 py-1.5 border border-gray-700 text-xs font-medium rounded bg-gray-700 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500"
                    >
                      Detaylar
                    </router-link>
                  </td>
                </tr>
                <tr v-if="filteredEmployees.length === 0">
                  <td colspan="6" class="px-5 py-8 text-center text-gray-400">
                    <div class="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p>Gösterilecek çalışan bulunamadı</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Pagination -->
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-400">
            Toplam {{ totalEmployees }} çalışandan {{ filteredEmployees.length }} gösteriliyor
          </div>
          <div class="flex space-x-2">
            <button 
              @click="prevPage" 
              :disabled="currentPage === 1" 
              class="inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
            >
              Önceki
            </button>
            <button 
              @click="nextPage" 
              :disabled="currentPage * itemsPerPage >= filteredEmployees.length" 
              class="inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
            >
              Sonraki
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '../api'

// Data types
interface Employee {
  id: number
  name: string
  surname: string
  email: string
  department: string
  position: string
  performance: number
  completionRate: number
}

// Refs
const employees = ref<Employee[]>([])
const totalEmployees = ref(0)
const departments = ref<string[]>([])
const loading = ref(true)
const error = ref('')

// Filters and pagination
const searchQuery = ref('')
const departmentFilter = ref('')
const sortBy = ref('name')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Computed properties
const filteredEmployees = computed(() => {
  let result = [...employees.value]
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(employee => 
      employee.name.toLowerCase().includes(query) || 
      employee.surname.toLowerCase().includes(query) || 
      employee.department.toLowerCase().includes(query) || 
      employee.position.toLowerCase().includes(query)
    )
  }
  
  // Apply department filter
  if (departmentFilter.value) {
    result = result.filter(employee => employee.department === departmentFilter.value)
  }
  
  // Apply sorting
  result.sort((a, b) => {
    switch(sortBy.value) {
      case 'name':
        return (a.name + a.surname).localeCompare(b.name + b.surname)
      case 'department':
        return a.department.localeCompare(b.department)
      case 'performance':
        return b.performance - a.performance
      case 'completion':
        return b.completionRate - a.completionRate
      default:
        return 0
    }
  })
  
  // Apply pagination
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return result.slice(start, end)
})

// Fetch data
onMounted(async () => {
  try {
    loading.value = true
    error.value = ''
    
    const response = await api.get('employees')
    employees.value = response.data || []
    totalEmployees.value = employees.value.length
    
    // Extract all unique departments
    const deptSet = new Set<string>()
    employees.value.forEach(employee => deptSet.add(employee.department))
    departments.value = Array.from(deptSet).sort()
    
  } catch (e: any) {
    console.error('Error fetching employees:', e)
    error.value = e.message || 'Çalışan verileri yüklenirken bir hata oluştu'
  } finally {
    loading.value = false
  }
})

// Pagination methods
function nextPage() {
  if (currentPage.value * itemsPerPage.value < employees.value.length) {
    currentPage.value++
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}
</script>

<style scoped>
/* Transitions */
button, a, input, select {
  transition: all 0.2s;
}

/* Table hover effect */
tr {
  transition: background-color 0.15s ease;
}
</style>