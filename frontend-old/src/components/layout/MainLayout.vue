<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 shadow-sm overflow-y-auto">
      <div class="flex items-center h-16 px-4 border-b border-gray-200">
        <h1 class="text-xl font-semibold text-[#0078d4]">ALMS</h1>
      </div>
      
      <nav class="mt-2 px-2">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="group flex items-center px-3 py-2 text-sm font-medium rounded-md my-1"
          :class="[
            $route.path === item.path
              ? 'bg-[#f0f5ff] text-[#0078d4] border-l-4 border-[#0078d4]'
              : 'text-gray-700 hover:bg-gray-50 hover:text-[#0078d4]'
          ]"
        >
          <component
            :is="item.icon"
            class="mr-3 flex-shrink-0 h-5 w-5"
            :class="[
              $route.path === item.path
                ? 'text-[#0078d4]'
                : 'text-gray-500 group-hover:text-[#0078d4]'
            ]"
            aria-hidden="true"
          />
          {{ item.name }}
        </router-link>
      </nav>
    </div>

    <!-- Main content -->
    <div class="pl-64 flex flex-col flex-1">
      <!-- Top navbar -->
      <div class="sticky top-0 z-10 flex h-14 bg-white border-b border-gray-200">
        <div class="flex-1 px-4 flex justify-between">
          <div class="flex-1 flex items-center">
            <h1 class="text-lg font-semibold text-gray-800">
              {{ currentPageTitle }}
            </h1>
          </div>
          <div class="ml-4 flex items-center md:ml-6">
            <!-- Bildirimler -->
            <button class="p-1 rounded-full text-gray-500 hover:text-[#0078d4] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0078d4]">
              <span class="sr-only">Bildirimleri görüntüle</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          
            <!-- Profile dropdown -->
            <div class="ml-3 relative">
              <button
                @click="toggleProfileMenu"
                class="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0078d4]"
              >
                <span class="sr-only">Kullanıcı menüsü</span>
                <div class="h-8 w-8 rounded-full bg-[#0078d4] flex items-center justify-center text-white">
                  {{ userInitials }}
                </div>
              </button>

              <div
                v-if="showProfileMenu"
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
              >
                <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Profil
                </router-link>
                <router-link to="/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Ayarlar
                </router-link>
                <div class="border-t border-gray-100 my-1"></div>
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Çıkış Yap
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sayfa başlık kısmı -->
      <div class="py-3 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200 shadow-sm">
        <div class="flex items-center">
          <h2 class="text-xl font-semibold text-gray-800">{{ currentPageTitle }}</h2>
        </div>
      </div>

      <!-- Page content -->
      <main class="flex-1 pb-8">
        <div class="py-4">
          <div class="mx-auto px-4 sm:px-6 md:px-8">
            <slot />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  HomeIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  UserIcon,
  Cog6ToothIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const showProfileMenu = ref(false)

const menuItems = [
  { name: 'Dashboard', path: '/', icon: HomeIcon },
  { name: 'Departmanlar', path: '/departments', icon: BuildingOfficeIcon },
  { name: 'Takımlar', path: '/teams', icon: UserGroupIcon },
  { name: 'Çalışanlar', path: '/employees', icon: UserIcon },
  { name: 'Yönetim', path: '/management', icon: Cog6ToothIcon },
]

const currentPageTitle = computed(() => {
  const currentItem = menuItems.find(item => item.path === route.path)
  return currentItem?.name || 'Dashboard'
})

const userInitials = computed(() => {
  const name = authStore.user?.email || ''
  return name.substring(0, 2).toUpperCase()
})

// Profil menüsü dışına tıklandığında menüyü kapat
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (showProfileMenu.value && !target.closest('.relative')) {
    showProfileMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function toggleProfileMenu() {
  showProfileMenu.value = !showProfileMenu.value
}

async function handleLogout() {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>

<style scoped>
/* Yumuşak geçişler için */
a, button {
  transition: all 0.2s ease;
}

/* Scrollbar stili */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #a8a8a8;
}
</style>
