<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8 flex items-center justify-between">
        <h1 class="text-2xl font-semibold text-gray-900">Genel Bakış</h1>
        <div v-if="authStore.isAdmin()" class="flex space-x-2">
          <RouterLink 
            to="/admin/dashboard" 
            class="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <CogIcon class="mr-1.5 h-4 w-4" />
            Yönetici Paneli
          </RouterLink>
        </div>
      </div>
      
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

      <!-- Eğitim Tavsiyeleri Bölümü - Çalışan Paneli -->
      <div v-if="authStore.isEmployee()" class="mt-8">
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 flex items-center">
            <AcademicCapIcon class="h-5 w-5 mr-2 text-indigo-500" />
            Eğitim Tavsiyeleri
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Performansınızı artıracak ve kariyer gelişiminize katkı sağlayacak özel eğitim tavsiyeleri
          </p>
          
          <!-- Tavsiye Edilen Eğitimler Listesi -->
          <div class="mt-5 space-y-4">
            <div v-for="(training, index) in recommendedTrainings" :key="index" class="border border-gray-200 rounded-md p-4 hover:bg-gray-50">
              <div class="flex items-start">
                <div class="flex-shrink-0 mt-1">
                  <div :class="`inline-flex items-center justify-center h-8 w-8 rounded-md ${training.iconBackground} text-white`">
                    <component :is="training.icon" class="h-4 w-4" aria-hidden="true" />
                  </div>
                </div>
                <div class="ml-4 flex-1">
                  <h4 class="text-sm font-medium text-gray-900">{{ training.title }}</h4>
                  <p class="mt-1 text-xs text-gray-500">{{ training.description }}</p>
                  <div class="mt-2 flex items-center space-x-2 text-xs">
                    <span class="flex items-center text-gray-500">
                      <ClockIcon class="h-3 w-3 mr-1" /> {{ training.duration }}
                    </span>
                    <span>•</span>
                    <span :class="`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${training.difficultyColor}`">
                      {{ training.difficulty }}
                    </span>
                  </div>
                </div>
                <div>
                  <button 
                    type="button"
                    class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Eğitime Git
                  </button>
                </div>
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
import { RouterLink } from 'vue-router'
import { supabase } from '@/utils/supabase'
import { useAuthStore } from '@/stores/auth'
import { PostgrestResponse } from '@supabase/supabase-js'
import {
  UserGroupIcon,
  BuildingOfficeIcon,
  UsersIcon,
  ChartBarIcon,
  AcademicCapIcon,
  ClockIcon,
  CogIcon,
  LightBulbIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon as GroupIcon
} from '@heroicons/vue/24/outline'
import DepartmentPerformanceChart from '@/components/dashboard/DepartmentPerformanceChart.vue'
import TeamPerformanceChart from '@/components/dashboard/TeamPerformanceChart.vue'

// Auth store'u kullan
const authStore = useAuthStore()

// TypeScript tip tanımları
interface ChartData {
  name: string;
  value: number;
}

interface Training {
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  difficultyColor: string;
  icon: any;
  iconBackground: string;
}

// İstatistikler
const stats = ref({
  totalEmployees: 0,
  totalDepartments: 0,
  totalTeams: 0,
  averagePerformance: 0
})

// Grafik verileri
const departmentPerformance = ref<ChartData[]>([])
const teamPerformance = ref<ChartData[]>([])

// Tavsiye edilen eğitimler
const recommendedTrainings = ref<Training[]>([
  {
    title: 'Liderlik ve Takım Yönetimi',
    description: 'Etkili liderlik becerileri ve takım dinamiklerini anlama',
    duration: '3 saat',
    difficulty: 'Orta',
    difficultyColor: 'bg-yellow-100 text-yellow-800',
    icon: LightBulbIcon,
    iconBackground: 'bg-indigo-500'
  },
  {
    title: 'İletişim Becerileri',
    description: 'İş ortamında etkili iletişim ve sunum teknikleri',
    duration: '2 saat',
    difficulty: 'Başlangıç',
    difficultyColor: 'bg-green-100 text-green-800',
    icon: ChatBubbleLeftRightIcon,
    iconBackground: 'bg-green-500'
  },
  {
    title: 'Takım Çalışması ve İşbirliği',
    description: 'Ekip içi uyumu arttırma ve ortak hedeflere ulaşma',
    duration: '4 saat',
    difficulty: 'İleri',
    difficultyColor: 'bg-red-100 text-red-800',
    icon: GroupIcon,
    iconBackground: 'bg-blue-500'
  }
])

onMounted(async () => {
  try {
    // Verileri yükle
    const employeesResponse = (await supabase
      .from('employees')
      .select('id', { count: 'exact' })) as PostgrestResponse<any>
    
    const employees = employeesResponse.data || []
    
    const departmentsResponse = (await supabase
      .from('departments')
      .select('id', { count: 'exact' })) as PostgrestResponse<any>
    
    const departments = departmentsResponse.data || []
    
    const teamsResponse = (await supabase
      .from('teams')
      .select('id', { count: 'exact' })) as PostgrestResponse<any>
    
    const teams = teamsResponse.data || []

    // İstatistikleri güncelle
    stats.value = {
      totalEmployees: employees?.length || 120, // Mock değerler
      totalDepartments: departments?.length || 8,
      totalTeams: teams?.length || 24,
      averagePerformance: calculateAveragePerformance(employees || []) || 78
    }

    // Grafik verilerini hazırla
    departmentPerformance.value = prepareDepartmentData(departments || [])
    teamPerformance.value = prepareTeamData(teams || [])
    
    // Eğer veri yoksa mock veriler kullan
    if (departmentPerformance.value.length === 0) {
      departmentPerformance.value = [
        { name: 'İnsan Kaynakları', value: 82 },
        { name: 'Finans', value: 91 },
        { name: 'Pazarlama', value: 78 },
        { name: 'Satış', value: 88 },
        { name: 'Müşteri İlişkileri', value: 75 },
        { name: 'Ar-Ge', value: 89 }
      ]
    }
    
    if (teamPerformance.value.length === 0) {
      teamPerformance.value = [
        { name: 'Alpha', value: 85 },
        { name: 'Beta', value: 79 },
        { name: 'Delta', value: 92 },
        { name: 'Omega', value: 77 },
        { name: 'Sigma', value: 83 }
      ]
    }
  } catch (error) {
    console.error('Error loading dashboard data:', error)
    
    // Hata durumunda mock veriler kullan
    stats.value = {
      totalEmployees: 120,
      totalDepartments: 8,
      totalTeams: 24,
      averagePerformance: 78
    }
    
    departmentPerformance.value = [
      { name: 'İnsan Kaynakları', value: 82 },
      { name: 'Finans', value: 91 },
      { name: 'Pazarlama', value: 78 },
      { name: 'Satış', value: 88 },
      { name: 'Müşteri İlişkileri', value: 75 },
      { name: 'Ar-Ge', value: 89 }
    ]
    
    teamPerformance.value = [
      { name: 'Alpha', value: 85 },
      { name: 'Beta', value: 79 },
      { name: 'Delta', value: 92 },
      { name: 'Omega', value: 77 },
      { name: 'Sigma', value: 83 }
    ]
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
    name: dept.name || 'İsimsiz Departman',
    value: dept.performance || Math.floor(Math.random() * 20) + 70 // Mock değerler
  }))
}

function prepareTeamData(teams: any[]) {
  // Takım verilerini grafik için hazırla
  return teams.map(team => ({
    name: team.name || 'İsimsiz Takım',
    value: team.performance || Math.floor(Math.random() * 20) + 70 // Mock değerler
  }))
}
</script>
