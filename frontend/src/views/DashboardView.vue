<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl font-semibold text-gray-900">Genel Bakış</h1>
      
      <!-- İstatistik Kartları -->
      <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Toplam Çalışan -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <UserGroupIcon class="h-6 w-6 text-gray-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Toplam Çalışan
                  </dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">
                      {{ stats.totalEmployees }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Departman Sayısı -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <BuildingOfficeIcon class="h-6 w-6 text-gray-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Departman Sayısı
                  </dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">
                      {{ stats.totalDepartments }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Takım Sayısı -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <UsersIcon class="h-6 w-6 text-gray-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Takım Sayısı
                  </dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">
                      {{ stats.totalTeams }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Ortalama Verimlilik -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <ChartBarIcon class="h-6 w-6 text-gray-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Ortalama Verimlilik
                  </dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">
                      {{ stats.averagePerformance }}%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Grafikler -->
      <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Departman Performans Grafiği -->
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900">Departman Performansı</h3>
          <div class="mt-4 h-72">
            <DepartmentPerformanceChart :data="departmentPerformance" />
          </div>
        </div>

        <!-- Takım Performans Grafiği -->
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900">Takım Performansı</h3>
          <div class="mt-4 h-72">
            <TeamPerformanceChart :data="teamPerformance" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  UserGroupIcon,
  BuildingOfficeIcon,
  UsersIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'
import { supabase } from '@/utils/supabase'
import DepartmentPerformanceChart from '@/components/dashboard/DepartmentPerformanceChart.vue'
import TeamPerformanceChart from '@/components/dashboard/TeamPerformanceChart.vue'

const stats = ref({
  totalEmployees: 0,
  totalDepartments: 0,
  totalTeams: 0,
  averagePerformance: 0
})

const departmentPerformance = ref([])
const teamPerformance = ref([])

onMounted(async () => {
  try {
    // Verileri yükle
    const { data: employees } = await supabase
      .from('employees')
      .select('*')
    
    const { data: departments } = await supabase
      .from('departments')
      .select('*')
    
    const { data: teams } = await supabase
      .from('teams')
      .select('*')

    // İstatistikleri güncelle
    stats.value = {
      totalEmployees: employees?.length || 0,
      totalDepartments: departments?.length || 0,
      totalTeams: teams?.length || 0,
      averagePerformance: calculateAveragePerformance(employees || [])
    }

    // Grafik verilerini hazırla
    departmentPerformance.value = prepareDepartmentData(departments || [])
    teamPerformance.value = prepareTeamData(teams || [])
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  }
})

function calculateAveragePerformance(employees: any[]) {
  if (!employees.length) return 0
  const total = employees.reduce((sum, emp) => sum + (emp.performance || 0), 0)
  return Math.round(total / employees.length)
}

function prepareDepartmentData(departments: any[]) {
  // Departman verilerini grafik için hazırla
  return departments.map(dept => ({
    name: dept.name,
    value: dept.performance || 0
  }))
}

function prepareTeamData(teams: any[]) {
  // Takım verilerini grafik için hazırla
  return teams.map(team => ({
    name: team.name,
    value: team.performance || 0
  }))
}
</script>
