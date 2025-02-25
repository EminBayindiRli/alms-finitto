<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Başlık ve Filtre -->
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900">Departmanlar</h1>
        <div class="flex space-x-4">
          <select
            v-model="selectedMetric"
            class="block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="performance">Performans</option>
            <option value="efficiency">Verimlilik</option>
            <option value="satisfaction">Memnuniyet</option>
          </select>
        </div>
      </div>

      <!-- Departman Kartları -->
      <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="department in departments"
          :key="department.id"
          class="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
        >
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg font-medium text-gray-900">
              {{ department.name }}
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              Yönetici: {{ department.manager }}
            </p>
          </div>
          <div class="px-4 py-5 sm:p-6">
            <!-- Metrikler -->
            <dl class="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <dt class="text-sm font-medium text-gray-500">Çalışan Sayısı</dt>
                <dd class="mt-1 text-3xl font-semibold text-gray-900">
                  {{ department.employeeCount }}
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">{{ metricLabel }}</dt>
                <dd class="mt-1 text-3xl font-semibold" :class="getMetricColor(department[selectedMetric])">
                  {{ department[selectedMetric] }}%
                </dd>
              </div>
            </dl>

            <!-- Trend Grafiği -->
            <div class="mt-6 h-32">
              <DepartmentTrendChart :data="department.trends" :metric="selectedMetric" />
            </div>
          </div>
          <div class="px-4 py-4 sm:px-6">
            <!-- Öneriler -->
            <h4 class="text-sm font-medium text-gray-900">Öneriler</h4>
            <ul class="mt-2 divide-y divide-gray-200">
              <li v-for="(suggestion, index) in department.suggestions" :key="index" class="py-2">
                <div class="flex items-start">
                  <LightBulbIcon class="h-5 w-5 text-yellow-400 mt-0.5" />
                  <p class="ml-2 text-sm text-gray-600">{{ suggestion }}</p>
                </div>
              </li>
            </ul>
          </div>
          <div class="px-4 py-4 sm:px-6 bg-gray-50">
            <div class="flex justify-between">
              <button
                @click="viewDetails(department.id)"
                class="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Detayları Görüntüle
              </button>
              <button
                @click="downloadReport(department.id)"
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
import DepartmentTrendChart from '@/components/department/DepartmentTrendChart.vue'

const selectedMetric = ref('performance')
const departments = ref<any[]>([])

const metricLabel = computed(() => {
  const labels = {
    performance: 'Performans',
    efficiency: 'Verimlilik',
    satisfaction: 'Memnuniyet'
  }
  return labels[selectedMetric.value as keyof typeof labels]
})

function getMetricColor(value: number) {
  if (value >= 80) return 'text-green-600'
  if (value >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

async function loadDepartments() {
  try {
    const { data, error } = await supabase
      .from('departments')
      .select(`
        *,
        employees:employee_count(*),
        trends:department_trends(*),
        suggestions:department_suggestions(*)
      `)
      .order('name')

    if (error) throw error

    departments.value = data?.map(dept => ({
      ...dept,
      employeeCount: dept.employees,
      trends: processTrends(dept.trends),
      suggestions: dept.suggestions?.map((s: any) => s.suggestion) || []
    })) || []
  } catch (error) {
    console.error('Error loading departments:', error)
  }
}

function processTrends(trends: any[]) {
  // Son 6 ayın trendlerini işle
  return trends
    ?.slice(-6)
    .map(t => ({
      date: new Date(t.date),
      performance: t.performance,
      efficiency: t.efficiency,
      satisfaction: t.satisfaction
    })) || []
}

async function viewDetails(departmentId: string) {
  // Departman detay sayfasına yönlendir
  // router.push(`/departments/${departmentId}`)
}

async function downloadReport(departmentId: string) {
  try {
    // Backend'den rapor al
    const response = await fetch(`/api/departments/${departmentId}/report`)
    const blob = await response.blob()
    
    // Raporu indir
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `department-report-${departmentId}.pdf`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading report:', error)
  }
}

onMounted(() => {
  loadDepartments()
})</script>
