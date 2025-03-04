<template>
  <div class="flex flex-col w-full bg-[#1c1c1c] min-h-screen text-white">
    <!-- Header -->
    <div class="py-6 px-6 md:px-10 border-b border-gray-800">
      <h1 class="text-2xl font-medium text-white flex items-center">
        <span class="inline-block w-3 h-3 rounded-full bg-violet-500 mr-3"></span>
        Takımlar
      </h1>
      <p class="text-gray-400 mt-1">Şirket takımlarının performans ve eğitim verileri</p>
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
          <p class="mt-4 text-gray-400">Takım verileri yükleniyor...</p>
        </div>
      </div>

      <!-- Content (when loaded) -->
      <div v-else class="space-y-8">
        <!-- Teams Filter -->
        <div class="bg-[#2e2e2e] rounded-lg p-6 border border-gray-800">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium">Takımlar</h3>
            <div class="relative">
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Takım ara..." 
                class="w-64 py-2 px-3 pr-10 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-white text-sm"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="border-b border-gray-700">
                  <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Takım</th>
                  <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Takım Lideri</th>
                  <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Üye Sayısı</th>
                  <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Performans</th>
                  <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Eğitim Tamamlama</th>
                  <th scope="col" class="px-3 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">İşlemler</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-700">
                <tr v-for="team in filteredTeams" :key="team.id" class="hover:bg-gray-800/50">
                  <td class="px-3 py-4 whitespace-nowrap text-sm font-medium">{{ team.name }}</td>
                  <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-300">{{ team.leader }}</td>
                  <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-300">{{ team.memberCount }}</td>
                  <td class="px-3 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="relative w-full max-w-[100px] h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div class="absolute top-0 left-0 h-full rounded-full" 
                          :style="`width: ${team.performance}%`"
                          :class="{
                            'bg-emerald-500': team.performance >= 70,
                            'bg-amber-500': team.performance >= 40 && team.performance < 70,
                            'bg-red-500': team.performance < 40
                          }"></div>
                      </div>
                      <span class="ml-2 text-sm text-gray-300">{{ team.performance }}%</span>
                    </div>
                  </td>
                  <td class="px-3 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="relative w-full max-w-[100px] h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div class="absolute top-0 left-0 h-full rounded-full" 
                          :style="`width: ${team.completionRate}%`"
                          :class="{
                            'bg-emerald-500': team.completionRate >= 70,
                            'bg-amber-500': team.completionRate >= 40 && team.completionRate < 70,
                            'bg-red-500': team.completionRate < 40
                          }"></div>
                      </div>
                      <span class="ml-2 text-sm text-gray-300">{{ team.completionRate }}%</span>
                    </div>
                  </td>
                  <td class="px-3 py-4 whitespace-nowrap text-sm text-center">
                    <button 
                      @click="selectTeam(team)" 
                      class="inline-flex items-center px-2.5 py-1.5 border border-gray-700 text-xs font-medium rounded bg-gray-700 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Detaylar
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredTeams.length === 0">
                  <td colspan="6" class="px-3 py-8 text-center text-gray-400">
                    <div class="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p>Takım bulunamadı</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Selected Team Performance Chart -->
        <div v-if="selectedTeam" class="bg-[#2e2e2e] rounded-lg p-6 border border-gray-800">
          <div class="flex flex-col mb-4">
            <h3 class="text-lg font-medium">{{ selectedTeam.name }} - Performans Analizi</h3>
            <p class="text-sm text-gray-400">Son 30 günlük performans verileri</p>
          </div>
          
          <div class="h-80">
            <TeamPerformanceChart 
              :data="teamPerformanceData" 
              :loading="chartLoading" 
              :error="chartError" 
            />
          </div>
          
          <!-- Team Members List -->
          <div class="mt-8 border-t border-gray-700 pt-6">
            <h4 class="text-md font-medium mb-4">Takım Üyeleri</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="(member, index) in teamMembers" :key="index" class="bg-gray-800 rounded-md p-4">
                <div class="flex items-start">
                  <div class="h-10 w-10 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-300 mr-3">
                    {{ member.name.charAt(0) }}{{ member.surname.charAt(0) }}
                  </div>
                  <div>
                    <p class="font-medium">{{ member.name }} {{ member.surname }}</p>
                    <p class="text-sm text-gray-400">{{ member.position }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '../api'
import TeamPerformanceChart from '@/components/team/TeamPerformanceChart.vue'

// Data structure
interface TeamMember {
  id: number
  name: string
  surname: string
  position: string
}

interface Team {
  id: number
  name: string
  leader: string
  memberCount: number
  performance: number
  completionRate: number
  members?: TeamMember[]
}

// Refs
const teams = ref<Team[]>([])
const selectedTeam = ref<Team | null>(null)
const teamMembers = ref<TeamMember[]>([])
const teamPerformanceData = ref<{ date: string, performance: number }[]>([])
const loading = ref(true)
const error = ref('')
const chartLoading = ref(false)
const chartError = ref('')
const searchQuery = ref('')

// Computed props
const filteredTeams = computed(() => {
  if (!searchQuery.value) return teams.value
  
  const query = searchQuery.value.toLowerCase()
  return teams.value.filter(team => 
    team.name.toLowerCase().includes(query) || 
    team.leader.toLowerCase().includes(query)
  )
})

// Fetch teams data
onMounted(async () => {
  try {
    loading.value = true
    error.value = ''
    
    const response = await api.get('teams')
    teams.value = response.data || []
    
    // If we have teams, select the first one by default
    if (teams.value.length > 0) {
      selectTeam(teams.value[0])
    }
  } catch (e: any) {
    console.error('Error fetching teams:', e)
    error.value = e.message || 'Takım verileri yüklenirken bir hata oluştu'
  } finally {
    loading.value = false
  }
})

// Select a team and load its details
async function selectTeam(team: Team) {
  try {
    selectedTeam.value = team
    chartLoading.value = true
    chartError.value = ''
    
    // Fetch team members
    const membersResponse = await api.get(`teams/${team.id}/members`)
    teamMembers.value = membersResponse.data || []
    
    // Fetch performance data for chart
    const performanceResponse = await api.get(`teams/${team.id}/performance`)
    teamPerformanceData.value = performanceResponse.data || []
  } catch (e: any) {
    console.error('Error fetching team details:', e)
    chartError.value = e.message || 'Takım detayları yüklenirken bir hata oluştu'
  } finally {
    chartLoading.value = false
  }
}
</script>

<style scoped>
/* Transitions */
button, a, input {
  transition: all 0.2s;
}

/* Table hover effect */
tr {
  transition: background-color 0.15s ease;
}
</style>
