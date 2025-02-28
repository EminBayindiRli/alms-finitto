import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/utils/supabase'
import type { User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const userRole = ref<string>('')
  const loading = ref(false)
  
  // Kullanıcının kimlik doğrulamasının yapılıp yapılmadığını kontrol eden hesaplanmış özellik
  const isAuthenticated = computed(() => !!user.value)

  async function setUser(userData: User | null) {
    user.value = userData
    
    // Kullanıcı rolünü Supabase'den al
    if (userData) {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userData.id)
        .single()
      
      userRole.value = data?.role || 'user'
    } else {
      userRole.value = ''
    }
  }

  // Kullanıcı oturumunu kontrol et ve yükle
  async function loadUser() {
    loading.value = true
    try {
      console.log('Loading user session...')
      const { data } = await supabase.auth.getSession()
      console.log('Session data:', data)
      
      if (data.session) {
        await setUser(data.session.user)
        return true
      } else {
        await setUser(null)
        return false
      }
    } catch (error) {
      console.error('Error loading user:', error)
      await setUser(null)
      return false
    } finally {
      loading.value = false
    }
  }

  async function checkSession() {
    loading.value = true
    try {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        await setUser(data.session.user)
      }
    } catch (error) {
      console.error('Session check error:', error)
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    try {
      await supabase.auth.signOut()
      await setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      loading.value = false
    }
  }

  function isAdmin() {
    return userRole.value === 'admin'
  }

  return {
    user,
    userRole,
    loading,
    isAuthenticated,
    setUser,
    loadUser,
    checkSession,
    logout,
    isAdmin
  }
})
