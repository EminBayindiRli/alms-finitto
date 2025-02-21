<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Çalışan Listesi</h1>
    
    <!-- Arama ve Filtreleme -->
    <div class="mb-6 flex gap-4">
      <input 
        type="text" 
        v-model="searchQuery"
        placeholder="Çalışan Ara..."
        class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
      <select 
        v-model="selectedDepartment"
        class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Tüm Departmanlar</option>
        <option v-for="dept in departments" :key="dept" :value="dept">
          {{ dept }}
        </option>
      </select>
    </div>

    <!-- Çalışan Tablosu -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Çalışan ID
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Departman
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Performans
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Son Güncelleme
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              İşlemler
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="employee in filteredEmployees" :key="employee.id">
            <td class="px-6 py-4 whitespace-nowrap">{{ employee.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ employee.department }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="h-2.5 w-full bg-gray-200 rounded-full">
                  <div 
                    class="h-2.5 bg-blue-600 rounded-full" 
                    :style="{ width: employee.performance + '%' }"
                  ></div>
                </div>
                <span class="ml-2">{{ employee.performance }}%</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ new Date(employee.lastUpdated).toLocaleDateString() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <router-link 
                :to="'/employee/' + employee.id"
                class="text-blue-600 hover:text-blue-900"
              >
                Detay
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const searchQuery = ref('')
const selectedDepartment = ref('')
const employees = ref([])
const departments = ref([])

// Filtreleme mantığı
const filteredEmployees = computed(() => {
  return employees.value.filter(employee => {
    const matchesSearch = employee.id.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesDepartment = !selectedDepartment.value || employee.department === selectedDepartment.value
    return matchesSearch && matchesDepartment
  })
})

// API'den veri çekme işlemleri buraya eklenecek
</script>
