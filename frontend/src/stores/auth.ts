import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase, getCurrentUser, isAdmin } from '@/utils/supabase'
import type { User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const isAdminUser = ref(false)

  const isAuthenticated = computed(() => !!user.value)

  async function loadUser() {
    try {
      loading.value = true
      user.value = await getCurrentUser()
      if (user.value) {
        isAdminUser.value = await isAdmin()
      }
    } catch (error) {
      console.error('Error loading user:', error)
      user.value = null
      isAdminUser.value = false
    } finally {
      loading.value = false
    }
  }

  async function login(email: string, password: string) {
    try {
      loading.value = true
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      user.value = data.user
      await loadUser()
    } catch (error) {
      console.error('Error logging in:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      loading.value = true
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      user.value = null
      isAdminUser.value = false
    } catch (error) {
      console.error('Error logging out:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    isAdminUser,
    isAuthenticated,
    loadUser,
    login,
    logout,
  }
})
