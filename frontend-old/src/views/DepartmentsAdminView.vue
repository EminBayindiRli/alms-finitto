<template>
    <div class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-8 flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">Departman Yönetimi</h1>
            <p class="mt-1 text-sm text-gray-500">
              Departmanları oluşturun, düzenleyin ve yönetin
            </p>
          </div>
          <div class="flex space-x-2">
            <RouterLink 
              to="/admin/dashboard" 
              class="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
            >
              <ArrowLeftIcon class="mr-1.5 h-4 w-4" />
              Yönetici Paneline Dön
            </RouterLink>
            <button
              type="button"
              class="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon class="mr-1.5 h-4 w-4" />
              Yeni Departman Ekle
            </button>
          </div>
        </div>
        
        <!-- Filtre ve Arama -->
        <div class="mb-6 bg-white shadow rounded-lg p-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="col-span-1">
              <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Departman Ara</label>
              <div class="relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  v-model="searchQuery"
                  class="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="İsim, kod veya yönetici"
                />
              </div>
            </div>
            
            <div class="col-span-1">
              <label for="sort" class="block text-sm font-medium text-gray-700 mb-1">Sıralama</label>
              <select
                id="sort"
                v-model="sortBy"
                class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="name">İsim (A-Z)</option>
                <option value="nameDesc">İsim (Z-A)</option>
                <option value="employeeCount">Çalışan Sayısı (Artan)</option>
                <option value="employeeCountDesc">Çalışan Sayısı (Azalan)</option>
                <option value="performance">Performans (Artan)</option>
                <option value="performanceDesc">Performans (Azalan)</option>
              </select>
            </div>
            
            <div class="col-span-1">
              <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Durum</label>
              <select
                id="status"
                v-model="statusFilter"
                class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="all">Tümü</option>
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Departman Listesi -->
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <BuildingOfficeIcon class="h-5 w-5 mr-2 text-indigo-500" />
              Departmanlar
              <span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {{ filteredDepartments.length }}
              </span>
            </h3>
          </div>
          
          <!-- Yükleniyor -->
          <div v-if="loading" class="px-4 py-12 text-center">
            <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Departmanlar yükleniyor...
            </div>
          </div>
          
          <!-- Veri Yok -->
          <div v-else-if="filteredDepartments.length === 0" class="px-4 py-12 text-center">
            <BuildingOfficeIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">Departman Bulunamadı</h3>
            <p class="mt-1 text-sm text-gray-500">
              Arama kriterlerinize uygun departman bulunamadı veya henüz departman oluşturulmadı.
            </p>
            <div class="mt-6">
              <button
                type="button"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusIcon class="-ml-1 mr-2 h-5 w-5" />
                Yeni Departman Oluştur
              </button>
            </div>
          </div>
          
          <!-- Departmanlar Tablosu -->
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Departman
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Yönetici
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Çalışan Sayısı
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performans
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="department in paginatedDepartments" :key="department.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-indigo-100 rounded-md">
                        <BuildingOfficeIcon class="h-6 w-6 text-indigo-600" />
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ department.name }}</div>
                        <div class="text-sm text-gray-500">{{ department.code }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ department.manager }}</div>
                    <div class="text-sm text-gray-500">{{ department.managerTitle }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ department.employeeCount }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div
                          class="h-2.5 rounded-full"
                          :class="{
                            'bg-green-500': department.performance >= 80,
                            'bg-yellow-500': department.performance >= 60 && department.performance < 80,
                            'bg-red-500': department.performance < 60
                          }"
                          :style="{ width: `${department.performance}%` }"
                        ></div>
                      </div>
                      <span class="text-sm">{{ department.performance }}%</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="department.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                    >
                      {{ department.active ? 'Aktif' : 'Pasif' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end space-x-3">
                      <button
                        @click="viewDepartmentDetails(department.id)"
                        class="text-indigo-600 hover:text-indigo-900"
                        title="Görüntüle"
                      >
                        <EyeIcon class="h-5 w-5" />
                      </button>
                      <button
                        @click="editDepartment(department.id)"
                        class="text-blue-600 hover:text-blue-900"
                        title="Düzenle"
                      >
                        <PencilIcon class="h-5 w-5" />
                      </button>
                      <button
                        @click="toggleDepartmentStatus(department.id)"
                        :class="department.active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'"
                        :title="department.active ? 'Pasif Yap' : 'Aktif Yap'"
                      >
                        <component :is="department.active ? NoSymbolIcon : CheckIcon" class="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Pagination -->
          <div v-if="filteredDepartments.length > 0" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  <span>Gösteriliyor</span>
                  <span class="font-medium"> {{ pagination.from }} </span>
                  <span>-</span>
                  <span class="font-medium"> {{ pagination.to }} </span>
                  <span>/</span>
                  <span class="font-medium"> {{ filteredDepartments.length }} </span>
                  <span>kayıt</span>
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    @click="pagination.currentPage = 1"
                    :disabled="pagination.currentPage === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span class="sr-only">İlk Sayfa</span>
                    <ChevronDoubleLeftIcon class="h-5 w-5" />
                  </button>
                  <button
                    @click="pagination.currentPage--"
                    :disabled="pagination.currentPage === 1"
                    class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span class="sr-only">Önceki</span>
                    <ChevronLeftIcon class="h-5 w-5" />
                  </button>
                  <button
                    v-for="page in pagination.pages"
                    :key="page"
                    @click="pagination.currentPage = page"
                    :class="[
                      page === pagination.currentPage 
                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                      'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                    ]"
                  >
                    {{ page }}
                  </button>
                  <button
                    @click="pagination.currentPage++"
                    :disabled="pagination.currentPage === pagination.totalPages"
                    class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span class="sr-only">Sonraki</span>
                    <ChevronRightIcon class="h-5 w-5" />
                  </button>
                  <button
                    @click="pagination.currentPage = pagination.totalPages"
                    :disabled="pagination.currentPage === pagination.totalPages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span class="sr-only">Son Sayfa</span>
                    <ChevronDoubleRightIcon class="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue'
  import { RouterLink, useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import {
    ArrowLeftIcon,
    BuildingOfficeIcon,
    MagnifyingGlassIcon,
    PlusIcon,
    PencilIcon,
    EyeIcon,
    NoSymbolIcon,
    CheckIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
  } from '@heroicons/vue/24/outline'
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  // Yetki kontrolü
  onMounted(() => {
    if (!authStore.isAdmin()) {
      router.push('/access-denied')
    }
  })
  
  // Tip tanımlamaları
  interface Department {
    id: string
    name: string
    code: string
    manager: string
    managerTitle: string
    employeeCount: number
    performance: number
    active: boolean
  }
  
  // State tanımlamaları
  const departments = ref<Department[]>([])
  const loading = ref(true)
  const searchQuery = ref('')
  const sortBy = ref('name')
  const statusFilter = ref('all')
  
  // Pagination
  const pagination = ref({
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 1,
    pages: [] as number[],
    from: 1,
    to: 10
  })
  
  // Filtrelenmiş departmanlar
  const filteredDepartments = computed(() => {
    let result = [...departments.value]
    
    // Arama filtresi
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(dept => 
        dept.name.toLowerCase().includes(query) || 
        dept.code.toLowerCase().includes(query) || 
        dept.manager.toLowerCase().includes(query)
      )
    }
    
    // Durum filtresi
    if (statusFilter.value !== 'all') {
      const isActive = statusFilter.value === 'active'
      result = result.filter(dept => dept.active === isActive)
    }
    
    // Sıralama
    switch (sortBy.value) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'nameDesc':
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'employeeCount':
        result.sort((a, b) => a.employeeCount - b.employeeCount)
        break
      case 'employeeCountDesc':
        result.sort((a, b) => b.employeeCount - a.employeeCount)
        break
      case 'performance':
        result.sort((a, b) => a.performance - b.performance)
        break
      case 'performanceDesc':
        result.sort((a, b) => b.performance - a.performance)
        break
      default:
        break
    }
    
    return result
  })
  
  // Sayfalanmış departmanlar
  const paginatedDepartments = computed(() => {
    const start = (pagination.value.currentPage - 1) * pagination.value.itemsPerPage
    const end = start + pagination.value.itemsPerPage
    return filteredDepartments.value.slice(start, end)
  })
  
  // Sayfalama bilgisini güncelle
  watch(filteredDepartments, () => {
    pagination.value.totalPages = Math.ceil(filteredDepartments.value.length / pagination.value.itemsPerPage)
    updatePaginationInfo()
  })
  
  watch(() => pagination.value.currentPage, () => {
    updatePaginationInfo()
  })
  
  function updatePaginationInfo() {
    const from = (pagination.value.currentPage - 1) * pagination.value.itemsPerPage + 1
    const to = Math.min(from + pagination.value.itemsPerPage - 1, filteredDepartments.value.length)
    pagination.value.from = from
    pagination.value.to = to
    
    // Sayfa numaralarını hesapla
    const pages = []
    const maxVisiblePages = 5 // En fazla gösterilecek sayfa sayısı
    
    if (pagination.value.totalPages <= maxVisiblePages) {
      // Tüm sayfaları göster
      for (let i = 1; i <= pagination.value.totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Sayfa sayısı fazla, sadece belirli sayfaları göster
      const currentPage = pagination.value.currentPage
      const totalPages = pagination.value.totalPages
      
      if (currentPage <= 3) {
        // Başlangıç sayfalarındayız
        for (let i = 1; i <= 5; i++) {
          pages.push(i)
        }
      } else if (currentPage >= totalPages - 2) {
        // Son sayfalardayız
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // Ortadayız
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i)
        }
      }
    }
    
    pagination.value.pages = pages
  }
  
  // Departmanları yükle
  async function loadDepartments() {
    loading.value = true
    
    try {
      // Simüle edilmiş API çağrısı
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock veri
      departments.value = generateMockDepartments()
      
      // Sayfalama bilgisini güncelle
      pagination.value.totalPages = Math.ceil(departments.value.length / pagination.value.itemsPerPage)
      updatePaginationInfo()
    } catch (error) {
      console.error('Error loading departments:', error)
    } finally {
      loading.value = false
    }
  }
  
  // Departman detaylarını görüntüle
  function viewDepartmentDetails(id: string) {
    console.log('View department details:', id)
  }
  
  // Departman düzenle
  function editDepartment(id: string) {
    console.log('Edit department:', id)
  }
  
  // Departman durumunu değiştir
  function toggleDepartmentStatus(id: string) {
    const department = departments.value.find(d => d.id === id)
    if (department) {
      department.active = !department.active
    }
  }
  
  // Mock departman verisi oluştur
  function generateMockDepartments(): Department[] {
    const mockDepartments = [
      {
        id: '1',
        name: 'İnsan Kaynakları',
        code: 'IK',
        manager: 'Ayşe Yılmaz',
        managerTitle: 'İK Direktörü',
        employeeCount: 12,
        performance: 85,
        active: true
      },
      {
        id: '2',
        name: 'Finans',
        code: 'FIN',
        manager: 'Mehmet Kaya',
        managerTitle: 'Finans Direktörü',
        employeeCount: 18,
        performance: 92,
        active: true
      },
      {
        id: '3',
        name: 'Satış',
        code: 'SAT',
        manager: 'Ali Öztürk',
        managerTitle: 'Satış Direktörü',
        employeeCount: 25,
        performance: 88,
        active: true
      },
      {
        id: '4',
        name: 'Pazarlama',
        code: 'PAZ',
        manager: 'Zeynep Demir',
        managerTitle: 'Pazarlama Müdürü',
        employeeCount: 15,
        performance: 78,
        active: true
      },
      {
        id: '5',
        name: 'Bilgi Teknolojileri',
        code: 'BT',
        manager: 'Deniz Yıldız',
        managerTitle: 'BT Direktörü',
        employeeCount: 20,
        performance: 90,
        active: true
      },
      {
        id: '6',
        name: 'Müşteri İlişkileri',
        code: 'CRM',
        manager: 'Selin Arslan',
        managerTitle: 'CRM Müdürü',
        employeeCount: 22,
        performance: 75,
        active: true
      },
      {
        id: '7',
        name: 'Lojistik',
        code: 'LOJ',
        manager: 'Baran Şahin',
        managerTitle: 'Lojistik Müdürü',
        employeeCount: 18,
        performance: 82,
        active: true
      },
      {
        id: '8',
        name: 'Ar-Ge',
        code: 'RND',
        manager: 'Ceren Yılmaz',
        managerTitle: 'Ar-Ge Direktörü',
        employeeCount: 15,
        performance: 95,
        active: true
      },
      {
        id: '9',
        name: 'Hukuk',
        code: 'HUK',
        manager: 'Kemal Aydın',
        managerTitle: 'Baş Hukuk Müşaviri',
        employeeCount: 6,
        performance: 88,
        active: true
      },
      {
        id: '10',
        name: 'Üretim',
        code: 'URE',
        manager: 'Levent Öztürk',
        managerTitle: 'Üretim Müdürü',
        employeeCount: 45,
        performance: 72,
        active: false
      },
      {
        id: '11',
        name: 'Kalite Kontrol',
        code: 'KAL',
        manager: 'Gül Aksoy',
        managerTitle: 'Kalite Direktörü',
        employeeCount: 10,
        performance: 84,
        active: true
      },
      {
        id: '12',
        name: 'İdari İşler',
        code: 'IDI',
        manager: 'Okan Çelik',
        managerTitle: 'İdari İşler Müdürü',
        employeeCount: 8,
        performance: 68,
        active: true
      },
      {
        id: '13',
        name: 'Kurumsal İletişim',
        code: 'KUR',
        manager: 'Ece Yalçın',
        managerTitle: 'Kurumsal İletişim Müdürü',
        employeeCount: 7,
        performance: 80,
        active: true
      },
      {
        id: '14',
        name: 'Tedarik Zinciri',
        code: 'TED',
        manager: 'Burak Koç',
        managerTitle: 'Tedarik Zinciri Direktörü',
        employeeCount: 12,
        performance: 76,
        active: false
      },
      {
        id: '15',
        name: 'Eğitim',
        code: 'EGT',
        manager: 'Pınar Yücel',
        managerTitle: 'Eğitim Direktörü',
        employeeCount: 5,
        performance: 91,
        active: true
      }
    ]
    
    return mockDepartments
  }
  
  // Sayfa yüklendiğinde departmanları getir
  onMounted(() => {
    loadDepartments()
  })
  </script>