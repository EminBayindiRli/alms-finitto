<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 w-64 bg-blue-700 text-white">
      <div class="flex items-center justify-center h-16 bg-blue-800">
        <h1 class="text-xl font-bold">ALMS</h1>
      </div>
      
      <nav class="mt-5 px-2">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="group flex items-center px-2 py-2 text-base font-medium rounded-md"
          :class="[
            $route.path === item.path
              ? 'bg-blue-800 text-white'
              : 'text-blue-100 hover:bg-blue-600'
          ]"
        >
          <component
            :is="item.icon"
            class="mr-3 flex-shrink-0 h-6 w-6"
            aria-hidden="true"
          />
          {{ item.name }}
        </router-link>
      </nav>
    </div>

    <!-- Main content -->
    <div class="pl-64 flex flex-col flex-1">
      <!-- Top navbar -->
      <div class="sticky top-0 z-10 flex h-16 bg-white shadow">
        <div class="flex-1 px-4 flex justify-between">
          <div class="flex-1 flex items-center">
            <h1 class="text-2xl font-semibold text-gray-900">
              {{ currentPageTitle }}
            </h1>
          </div>
          <div class="ml-4 flex items-center md:ml-6">
            <!-- Profile dropdown -->
            <div class="ml-3 relative">
              <button
                @click="toggleProfileMenu"
                class="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span class="sr-only">Kullanıcı menüsü</span>
                <div class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {{ userInitials }}
                </div>
              </button>

              <div
                v-if="showProfileMenu"
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
              >
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

      <!-- Page content -->
      <main class="flex-1">
        <div class="py-6">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <slot />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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
