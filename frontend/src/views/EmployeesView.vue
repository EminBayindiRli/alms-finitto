<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Başlık ve Arama/Filtre -->
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Çalışanlar
          </h2>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <div class="flex space-x-4">
            <!-- Arama -->
            <div class="flex-1 min-w-0">
              <label for="search" class="sr-only">Çalışan Ara</label>
              <div class="relative rounded-md shadow-sm">
                <input
                  type="search"
                  v-model="searchQuery"
                  class="block w-full pr-10 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Çalışan ara..."
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <!-- Departman Filtresi -->
            <select
              v-model="selectedDepartment"
              class="block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Tüm Departmanlar</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>

            <!-- Takım Filtresi -->
            <select
              v-model="selectedTeam"
              class="block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Tüm Takımlar</option>
              <option v-for="team in teams" :key="team.id" :value="team.id">
                {{ team.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Çalışan Listesi -->
      <div class="mt-8 flex flex-col">
        <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      v-for="header in tableHeaders"
                      :key="header.key"
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      @click="sortBy(header.key)"
                    >
                      <div class="group inline-flex">
                        {{ header.label }}
                        <span class="ml-2 flex-none rounded" :class="getSortIconClass(header.key)">
                          <ChevronUpDownIcon class="h-5 w-5" />
                        </span>
                      </div>
                    </th>
                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span class="sr-only">Aksiyonlar</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  <tr v-for="employee in filteredEmployees" :key="employee.id">
                    <td class="whitespace-nowrap px-3 py-4 text-sm">
                      <div class="flex items-center">
                        <div class="h-10 w-10 flex-shrink-0">
                          <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                            {{ getInitials(employee.name) }}
                          </div>
                        </div>
                        <div class="ml-4">
                          <div class="font-medium text-gray-900">{{ employee.name }}</div>
                          <div class="text-gray-500">{{ employee.email }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {{ employee.department_name }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {{ employee.team_name }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm">
                      <span
                        class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                        :class="getPerformanceClass(employee.performance)"
                      >
                        {{ employee.performance }}%
                      </span>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {{ employee.training_completion }}%
                    </td>
                    <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <button
                        @click="viewEmployeeDetails(employee.id)"
                        class="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Detaylar
                      </button>
                      <button
                        @click="downloadEmployeeReport(employee.id)"
                        class="text-gray-600 hover:text-gray-900"
                      >
                        Rapor
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Çalışan Karşılaştırma Modal -->
    <TransitionRoot appear :show="isCompareModalOpen" as="template">
      <Dialog as="div" @close="closeCompareModal" class="relative z-10">
        <TransitionChild
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              enter="ease-out duration-300"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  Çalışan Karşılaştırma
                </DialogTitle>
                <!-- Karşılaştırma içeriği buraya gelecek -->
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon
} from '@heroicons/vue/24/outline'
import { supabase } from '@/utils/supabase'

// State
const employees = ref<any[]>([])
const departments = ref<any[]>([])
const teams = ref<any[]>([])
const searchQuery = ref('')
const selectedDepartment = ref('')
const selectedTeam = ref('')
const sortColumn = ref('name')
const sortDirection = ref('asc')
const isCompareModalOpen = ref(false)

// Table headers
const tableHeaders = [
  { key: 'name', label: 'Çalışan' },
  { key: 'department_name', label: 'Departman' },
  { key: 'team_name', label: 'Takım' },
  { key: 'performance', label: 'Performans' },
  { key: 'training_completion', label: 'Eğitim Tamamlama' }
]

// Computed
const filteredEmployees = computed(() => {
  let filtered = [...employees.value]

  // Arama filtresi
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(emp =>
      emp.name.toLowerCase().includes(query) ||
      emp.email.toLowerCase().includes(query)
    )
  }

  // Departman filtresi
  if (selectedDepartment.value) {
    filtered = filtered.filter(emp => emp.department_id === selectedDepartment.value)
  }

  // Takım filtresi
  if (selectedTeam.value) {
    filtered = filtered.filter(emp => emp.team_id === selectedTeam.value)
  }

  // Sıralama
  filtered.sort((a, b) => {
    const aVal = a[sortColumn.value]
    const bVal = b[sortColumn.value]
    
    if (typeof aVal === 'string') {
      return sortDirection.value === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    }
    
    return sortDirection.value === 'asc'
      ? aVal - bVal
      : bVal - aVal
  })

  return filtered
})

// Methods
function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

function getPerformanceClass(performance: number) {
  if (performance >= 80) return 'bg-green-100 text-green-800'
  if (performance >= 60) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}

function getSortIconClass(column: string) {
  return {
    'text-gray-400': sortColumn.value !== column,
    'text-blue-500': sortColumn.value === column
  }
}

function sortBy(column: string) {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
}

function closeCompareModal() {
  isCompareModalOpen.value = false
}

function viewEmployeeDetails(employeeId: string) {
  // Çalışan detay sayfasına yönlendir
  // router.push(`/employees/${employeeId}`)
}

async function downloadEmployeeReport(employeeId: string) {
  try {
    // Backend'den rapor al
    const response = await fetch(`/api/employees/${employeeId}/report`)
    const blob = await response.blob()
    
    // Raporu indir
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `employee-report-${employeeId}.pdf`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading report:', error)
  }
}

async function loadData() {
  try {
    // Çalışanları yükle
    const { data: employeesData, error: employeesError } = await supabase
      .from('employees')
      .select(`
        *,
        department:departments(id, name),
        team:teams(id, name),
        performance:employee_performance(value),
        training:employee_training(completion)
      `)
      .order('name')

    if (employeesError) throw employeesError

    employees.value = employeesData?.map(emp => ({
      ...emp,
      department_name: emp.department?.name,
      team_name: emp.team?.name,
      performance: emp.performance?.value || 0,
      training_completion: emp.training?.completion || 0
    })) || []

    // Departmanları yükle
    const { data: deptsData, error: deptsError } = await supabase
      .from('departments')
      .select('id, name')
      .order('name')

    if (deptsError) throw deptsError
    departments.value = deptsData || []

    // Takımları yükle
    const { data: teamsData, error: teamsError } = await supabase
      .from('teams')
      .select('id, name')
      .order('name')

    if (teamsError) throw teamsError
    teams.value = teamsData || []
  } catch (error) {
    console.error('Error loading data:', error)
  }
}

onMounted(() => {
  loadData()
})</script>
