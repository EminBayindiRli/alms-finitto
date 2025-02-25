<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Başlık ve Filtreler -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 class="text-2xl font-semibold text-gray-900">Takımlar</h1>
        <div class="mt-4 sm:mt-0 flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
          <!-- Departman Filtresi -->
          <select
            v-model="selectedDepartment"
            class="block w-full sm:w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Tüm Departmanlar</option>
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
              {{ dept.name }}
            </option>
          </select>

          <!-- Performans Filtresi -->
          <select
            v-model="performanceFilter"
            class="block w-full sm:w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Tüm Performanslar</option>
            <option value="high">Yüksek Performans (>80%)</option>
            <option value="medium">Orta Performans (60-80%)</option>
            <option value="low">Düşük Performans (<60%)</option>
          </select>
        </div>
      </div>

      <!-- Takım Listesi -->
      <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div
          v-for="team in filteredTeams"
          :key="team.id"
          class="bg-white shadow rounded-lg"
        >
          <!-- Takım Başlığı -->
          <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">
                {{ team.name }}
              </h3>
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="getPerformanceClass(team.performance)"
              >
                {{ team.performance }}% Performans
              </span>
            </div>
            <p class="mt-1 text-sm text-gray-500">
              {{ team.department_name }} Departmanı
            </p>
          </div>

          <!-- Takım İstatistikleri -->
          <div class="px-4 py-5 sm:p-6">
            <dl class="grid grid-cols-2 gap-4">
              <div>
                <dt class="text-sm font-medium text-gray-500">Takım Lideri</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ team.leader }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Üye Sayısı</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ team.member_count }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Proje Sayısı</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ team.project_count }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Ortalama Verimlilik</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ team.efficiency }}%</dd>
              </div>
            </dl>

            <!-- Performans Grafiği -->
            <div class="mt-6">
              <TeamPerformanceChart :data="team.performance_data" />
            </div>

            <!-- Öneriler -->
            <div class="mt-6">
              <h4 class="text-sm font-medium text-gray-900">Geliştirme Önerileri</h4>
              <ul class="mt-2 divide-y divide-gray-200">
                <li
                  v-for="(suggestion, index) in team.suggestions"
                  :key="index"
                  class="py-2"
                >
                  <div class="flex items-start">
                    <LightBulbIcon class="h-5 w-5 text-yellow-400 mt-0.5" />
                    <p class="ml-2 text-sm text-gray-600">{{ suggestion }}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <!-- Aksiyon Butonları -->
          <div class="px-4 py-4 sm:px-6 bg-gray-50 rounded-b-lg">
            <div class="flex justify-between">
              <button
                @click="viewTeamDetails(team.id)"
                class="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Detayları Görüntüle
              </button>
              <button
                @click="downloadTeamReport(team.id)"
                class="text-sm font-medium text-gray-600 hover:text-gray-500"
              >
                Rapor İndir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { LightBulbIcon } from '@heroicons/vue/24/outline'
import { supabase } from '@/utils/supabase'
import TeamPerformanceChart from '@/components/team/TeamPerformanceChart.vue'

const teams = ref<any[]>([])
const departments = ref<any[]>([])
const selectedDepartment = ref('')
const performanceFilter = ref('')

const filteredTeams = computed(() => {
  let filtered = [...teams.value]

  // Departman filtresi
  if (selectedDepartment.value) {
    filtered = filtered.filter(team => team.department_id === selectedDepartment.value)
  }

  // Performans filtresi
  if (performanceFilter.value) {
    filtered = filtered.filter(team => {
      const performance = team.performance
      switch (performanceFilter.value) {
        case 'high':
          return performance > 80
        case 'medium':
          return performance >= 60 && performance <= 80
        case 'low':
          return performance < 60
        default:
          return true
      }
    })
  }

  return filtered
})

function getPerformanceClass(performance: number) {
  if (performance >= 80) return 'bg-green-100 text-green-800'
  if (performance >= 60) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}

async function loadTeams() {
  try {
    const { data: teamsData, error: teamsError } = await supabase
      .from('teams')
      .select(`
        *,
        department:departments(name),
        members:team_members(count),
        projects:team_projects(count),
        performance_data:team_performance(*),
        suggestions:team_suggestions(*)
      `)
      .order('name')

    if (teamsError) throw teamsError

    teams.value = teamsData?.map(team => ({
      ...team,
      department_name: team.department?.name,
      member_count: team.members,
      project_count: team.projects,
      performance_data: processPerformanceData(team.performance_data),
      suggestions: team.suggestions?.map((s: any) => s.suggestion) || []
    })) || []

    // Departmanları yükle
    const { data: deptsData, error: deptsError } = await supabase
      .from('departments')
      .select('id, name')
      .order('name')

    if (deptsError) throw deptsError
    departments.value = deptsData || []
  } catch (error) {
    console.error('Error loading teams:', error)
  }
}

function processPerformanceData(data: any[]) {
  // Son 6 ayın performans verilerini işle
  return data
    ?.slice(-6)
    .map(d => ({
      date: new Date(d.date),
      value: d.performance
    })) || []
}

function viewTeamDetails(teamId: string) {
  // Takım detay sayfasına yönlendir
  // router.push(`/teams/${teamId}`)
}

async function downloadTeamReport(teamId: string) {
  try {
    // Backend'den rapor al
    const response = await fetch(`/api/teams/${teamId}/report`)
    const blob = await response.blob()
    
    // Raporu indir
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `team-report-${teamId}.pdf`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading report:', error)
  }
}

onMounted(() => {
  loadTeams()
})</script>
