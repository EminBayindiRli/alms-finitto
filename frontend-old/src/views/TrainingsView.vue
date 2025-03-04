<template>
    <div class="flex flex-col w-full bg-[#1c1c1c] min-h-screen text-white">
      <!-- Header -->
      <div class="py-6 px-6 md:px-10 border-b border-gray-800">
        <h1 class="text-2xl font-medium text-white flex items-center">
          <span class="inline-block w-3 h-3 rounded-full bg-amber-500 mr-3"></span>
          Eğitimler
        </h1>
        <p class="text-gray-400 mt-1">Tüm şirket eğitimleri ve tamamlama bilgileri</p>
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
              <div class="animate-ping absolute w-full h-full rounded-full bg-amber-500 opacity-75"></div>
              <div class="relative w-full h-full rounded-full bg-amber-500"></div>
            </div>
            <p class="mt-4 text-gray-400">Eğitim verileri yükleniyor...</p>
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
                  placeholder="Eğitim adı, kategori veya içerik ara..." 
                  class="w-full py-2 px-3 pr-10 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white text-sm"
                />
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <div class="flex space-x-2">
                <select 
                  v-model="categoryFilter" 
                  class="bg-gray-800 border border-gray-700 text-white text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent py-2 px-3"
                >
                  <option value="">Tüm Kategoriler</option>
                  <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
                </select>
                
                <select 
                  v-model="sortBy" 
                  class="bg-gray-800 border border-gray-700 text-white text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent py-2 px-3"
                >
                  <option value="name">İsme Göre</option>
                  <option value="date">Tarihe Göre</option>
                  <option value="duration">Süreye Göre</option>
                  <option value="completion">Tamamlama Oranına Göre</option>
                </select>
              </div>
            </div>
          </div>
          
          <!-- Training Cards Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div v-for="training in filteredTrainings" :key="training.id" 
                 class="bg-[#2e2e2e] rounded-lg border border-gray-800 overflow-hidden hover:border-amber-500/30 transition-colors duration-300">
              <div class="relative">
                <img :src="training.image" :alt="training.name" class="w-full h-40 object-cover" />
                <div class="absolute top-3 right-3 px-2 py-1 text-xs rounded-md text-white" :class="getCategoryColorClass(training.category)">
                  {{ training.category }}
                </div>
              </div>
              
              <div class="p-6">
                <h3 class="text-lg font-medium mb-2">{{ training.name }}</h3>
                <p class="text-gray-400 text-sm mb-4 line-clamp-2">{{ training.description }}</p>
                
                <div class="flex items-center text-sm text-gray-400 mb-4">
                  <div class="flex items-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{{ training.duration }} saat</span>
                  </div>
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{{ training.participantCount }} katılımcı</span>
                  </div>
                </div>
                
                <!-- Completion Progress -->
                <div class="mb-4">
                  <div class="flex justify-between text-sm mb-1">
                    <span class="text-gray-400">Tamamlanma Oranı</span>
                    <span>{{ training.completionRate }}%</span>
                  </div>
                  <div class="w-full bg-gray-700 rounded-full h-2">
                    <div class="h-2 rounded-full" :style="`width: ${training.completionRate}%`" :class="getCompletionColorClass(training.completionRate)"></div>
                  </div>
                </div>
                
                <div class="flex justify-between items-center">
                  <div class="text-sm">
                    <span class="text-gray-400">Son Güncelleme:</span>
                    <span class="ml-1">{{ formatDate(training.lastUpdated) }}</span>
                  </div>
                  <router-link :to="`/trainings/${training.id}`"
                     class="inline-flex items-center px-3 py-1.5 border border-amber-500/30 text-xs font-medium rounded-md text-amber-400 hover:bg-amber-500/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-amber-500">
                    Eğitime Git
                  </router-link>
                </div>
              </div>
            </div>
            
            <!-- Empty State -->
            <div v-if="filteredTrainings.length === 0" class="col-span-full py-16">
              <div class="flex flex-col items-center text-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 class="text-lg font-medium text-gray-300">Eğitim bulunamadı</h3>
                <p class="text-gray-400 mt-2 max-w-md">
                  Arama kriterlerinize uygun eğitim bulunamadı. Lütfen filtreleri değiştirin veya başka bir arama terimi deneyin.
                </p>
              </div>
            </div>
          </div>
          
          <!-- Training Categories Summary -->
          <div class="bg-[#2e2e2e] rounded-lg p-6 border border-gray-800">
            <h3 class="text-lg font-medium mb-6">Kategori Özeti</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div v-for="(stat, category) in categorySummary" :key="category" class="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div class="flex justify-between items-start mb-4">
                  <div :class="`text-${getCategoryColor(category)}-400`" class="text-sm font-medium">{{ category }}</div>
                  <div :class="`bg-${getCategoryColor(category)}-500/20`" class="h-8 w-8 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" :class="`h-4 w-4 text-${getCategoryColor(category)}-400`" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <div class="space-y-1">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-400">Toplam Eğitim</span>
                    <span>{{ stat.count }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-400">Ortalama Süre</span>
                    <span>{{ stat.avgDuration }} saat</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-400">Tamamlanma</span>
                    <span>{{ stat.avgCompletion }}%</span>
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
  
  // Data types
  interface Training {
    id: number
    name: string
    description: string
    category: string
    image: string
    duration: number
    participantCount: number
    completionRate: number
    lastUpdated: string // ISO date string
  }
  
  interface CategorySummary {
    [key: string]: {
      count: number
      avgDuration: number
      avgCompletion: number
    }
  }
  
  // Refs
  const trainings = ref<Training[]>([])
  const categories = ref<string[]>([])
  const loading = ref(true)
  const error = ref('')
  const categorySummary = ref<CategorySummary>({})
  
  // Filters and pagination
  const searchQuery = ref('')
  const categoryFilter = ref('')
  const sortBy = ref('name')
  
  // Computed properties
  const filteredTrainings = computed(() => {
    let result = [...trainings.value]
    
    // Apply search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(training => 
        training.name.toLowerCase().includes(query) || 
        training.description.toLowerCase().includes(query) || 
        training.category.toLowerCase().includes(query)
      )
    }
    
    // Apply category filter
    if (categoryFilter.value) {
      result = result.filter(training => training.category === categoryFilter.value)
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch(sortBy.value) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'date':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        case 'duration':
          return b.duration - a.duration
        case 'completion':
          return b.completionRate - a.completionRate
        default:
          return 0
      }
    })
    
    return result
  })
  
  // Helper functions
  function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('tr-TR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }).format(date)
  }
  
  function getCategoryColor(category: string): string {
    const categoryColors: {[key: string]: string} = {
      'Teknik': 'cyan',
      'Kişisel Gelişim': 'emerald',
      'Liderlik': 'violet',
      'İş Güvenliği': 'amber',
      'Yazılım': 'blue',
      'Pazarlama': 'pink',
      'Finans': 'yellow'
    }
    
    return categoryColors[category] || 'gray'
  }
  
  function getCategoryColorClass(category: string): string {
    return `bg-${getCategoryColor(category)}-500/20 text-${getCategoryColor(category)}-400`
  }
  
  function getCompletionColorClass(rate: number): string {
    if (rate >= 75) return 'bg-emerald-500'
    if (rate >= 50) return 'bg-amber-500'
    return 'bg-red-500'
  }
  
  // Fetch data
  onMounted(async () => {
    try {
      loading.value = true
      error.value = ''
      
      const response = await api.get('trainings')
      trainings.value = response.data || []
      
      // If API fails, use dummy data
      if (!trainings.value.length) {
        trainings.value = getDummyTrainings()
      }
      
      // Extract unique categories
      const categorySet = new Set<string>()
      trainings.value.forEach(training => categorySet.add(training.category))
      categories.value = Array.from(categorySet).sort()
      
      // Generate category summary
      calculateCategorySummary()
      
    } catch (e: any) {
      console.error('Error fetching trainings:', e)
      error.value = e.message || 'Eğitim verileri yüklenirken bir hata oluştu'
      
      // Load dummy data on error
      trainings.value = getDummyTrainings()
      
      // Extract unique categories
      const categorySet = new Set<string>()
      trainings.value.forEach(training => categorySet.add(training.category))
      categories.value = Array.from(categorySet).sort()
      
      // Still generate category summary
      calculateCategorySummary()
    } finally {
      loading.value = false
    }
  })
  
  // Calculate category summary stats
  function calculateCategorySummary() {
    const summary: CategorySummary = {}
    
    categories.value.forEach(category => {
      const categoryTrainings = trainings.value.filter(t => t.category === category)
      const totalDuration = categoryTrainings.reduce((sum, t) => sum + t.duration, 0)
      const totalCompletion = categoryTrainings.reduce((sum, t) => sum + t.completionRate, 0)
      
      summary[category] = {
        count: categoryTrainings.length,
        avgDuration: Math.round(totalDuration / categoryTrainings.length * 10) / 10,
        avgCompletion: Math.round(totalCompletion / categoryTrainings.length)
      }
    })
    
    categorySummary.value = summary
  }
  
  // Dummy data for testing or when API fails
  function getDummyTrainings(): Training[] {
    return [
      {
        id: 1,
        name: 'JavaScript Temelleri',
        description: 'JavaScript dilinin temel yapıları, değişkenler, döngüler, koşullar ve fonksiyonlar hakkında kapsamlı bir eğitim.',
        category: 'Yazılım',
        image: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        duration: 8,
        participantCount: 156,
        completionRate: 76,
        lastUpdated: '2023-12-15T10:30:00Z'
      },
      {
        id: 2,
        name: 'İletişim Becerileri',
        description: 'Etkili iletişim kurma, aktif dinleme ve zorlu iletişim durumlarını yönetme hakkında pratik bilgiler.',
        category: 'Kişisel Gelişim',
        image: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        duration: 4,
        participantCount: 210,
        completionRate: 92,
        lastUpdated: '2024-01-05T14:20:00Z'
      },
      {
        id: 3,
        name: 'Takım Liderliği',
        description: 'Etkili takım yönetimi, delegasyon, motivasyon ve performans değerlendirme yöntemleri.',
        category: 'Liderlik',
        image: 'https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        duration: 12,
        participantCount: 84,
        completionRate: 68,
        lastUpdated: '2024-02-12T09:15:00Z'
      },
      {
        id: 4,
        name: 'İş Yerinde Güvenlik',
        description: 'İş yerinde olası tehlikeler, acil durum prosedürleri ve güvenli çalışma uygulamaları hakkında temel bilgiler.',
        category: 'İş Güvenliği',
        image: 'https://images.unsplash.com/photo-1578496781379-7dcfb995293d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        duration: 2,
        participantCount: 305,
        completionRate: 95,
        lastUpdated: '2023-11-20T11:40:00Z'
      },
      {
        id: 5,
        name: 'SQL Veritabanı Yönetimi',
        description: 'SQL sorguları yazma, veritabanı tasarımı ve optimizasyon teknikleri hakkında kapsamlı bir kurs.',
        category: 'Teknik',
        image: 'https://images.unsplash.com/photo-1569396116180-210c182bedb8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        duration: 10,
        participantCount: 123,
        completionRate: 61,
        lastUpdated: '2024-01-18T15:50:00Z'
      },
      {
        id: 6,
        name: 'Dijital Pazarlama Stratejileri',
        description: 'Sosyal medya, SEO, içerik pazarlaması ve dijital reklam kampanyaları oluşturma hakkında güncel bilgiler.',
        category: 'Pazarlama',
        image: 'https://images.unsplash.com/photo-1557838923-2985c318be48?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        duration: 6,
        participantCount: 178,
        completionRate: 72,
        lastUpdated: '2024-02-05T13:10:00Z'
      },
      {
        id: 7,
        name: 'Finansal Tablolar ve Analiz',
        description: 'Bilanço, gelir tablosu ve nakit akış tablosu okuma ve analiz etme becerileri.',
        category: 'Finans',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        duration: 8,
        participantCount: 95,
        completionRate: 58,
        lastUpdated: '2023-12-08T10:20:00Z'
      },
      {
        id: 8,
        name: 'Stres Yönetimi',
        description: 'İş yerinde stresi tanıma, stres kaynaklarını belirleme ve etkili stres yönetimi teknikleri öğrenme.',
        category: 'Kişisel Gelişim',
        image: 'https://images.unsplash.com/photo-1479644025832-60dabb8ccbce?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        duration: 3,
        participantCount: 245,
        completionRate: 89,
        lastUpdated: '2024-01-30T09:45:00Z'
      },
      {
        id: 9,
        name: 'React Web Geliştirme',
        description: 'Modern web uygulamaları geliştirmek için React kütüphanesinin kullanımı ve en iyi pratikler.',
        category: 'Yazılım',
        image: 'https://images.unsplash.com/photo-1481487196290-c152efe083f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        duration: 15,
        participantCount: 112,
        completionRate: 54,
        lastUpdated: '2024-02-20T14:30:00Z'
      }
    ]
  }
  </script>
  
  <style scoped>
  /* Transitions */
  button, a, input, select {
    transition: all 0.2s;
  }
  
  /* Line clamping for descriptions */
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;  
    overflow: hidden;
  }
  
  /* Card hover effect */
  .hover\:border-amber-500\/30:hover {
    border-color: rgba(245, 158, 11, 0.3);
  }
  </style>