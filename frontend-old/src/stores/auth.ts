import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'
import { ref } from 'vue'

// User tipi tanımı
interface UserMetadata {
  full_name?: string;
  role?: string;
  employee_id?: string;
}

interface User {
  id: string;
  email: string;
  user_metadata?: UserMetadata;
}

// MOCK DATA - Supabase bağlantı hatalarını aşmak için
const MOCK_ENABLED = true; // Geliştirme sırasında mock verileri etkinleştirmek için flag

// Mock kullanıcı verileri - Hem admin hem employee için
const MOCK_USERS = {
  admin: {
    id: 'mock-admin-id',
    email: 'admin@example.com',
    user_metadata: {
      full_name: 'Admin User',
      role: 'admin'
    }
  },
  employee: {
    id: 'mock-employee-id',
    email: 'employee@example.com',
    user_metadata: {
      full_name: 'Test Employee',
      employee_id: 'EMP001',
      role: 'employee'
    }
  }
};

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)
  
  async function loadUser(): Promise<User | null> {
    loading.value = true
    error.value = null
    
    try {
      console.log('Loading user session...')
      
      if (MOCK_ENABLED) {
        // Mock kullanıcı oturumunu kullan - Supabase bağlantı sorunlarını aşmak için
        console.log('Using MOCK data instead of Supabase due to connection issues')
        const mockSession = localStorage.getItem('mock_user_session');
        
        if (mockSession) {
          user.value = JSON.parse(mockSession) as User;
          console.log('Mock session loaded successfully');
          return user.value;
        }
        
        console.log('No mock session found');
        return null;
      }
      
      // Gerçek Supabase implementasyonu
      const { data } = await supabase.auth.getSession()
      console.log('Session data:', data)
      
      if (data.session?.user) {
        user.value = data.session.user as User
        return user.value
      }
      
      return null
    } catch (err) {
      console.error('Error loading user:', err)
      error.value = err instanceof Error ? err : new Error(String(err))
      return null
    } finally {
      loading.value = false
    }
  }
  
  async function setUser(userData: User): Promise<User> {
    user.value = userData
    
    if (MOCK_ENABLED && userData) {
      // Mock oturumu yerel depolamaya kaydet
      localStorage.setItem('mock_user_session', JSON.stringify(userData));
      console.log('Mock user session saved');
    }
    
    return userData
  }
  
  async function signOut() {
    if (MOCK_ENABLED) {
      // Mock oturumu kaldır
      localStorage.removeItem('mock_user_session');
      user.value = null;
      console.log('Mock user signed out');
      return { error: null };
    }
    
    // Gerçek Supabase implementasyonu
    return supabase.auth.signOut()
  }
  
  async function login(credentials: { email: string; password: string; userType: string; rememberMe: boolean }): Promise<boolean> {
    loading.value = true;
    error.value = null;
    
    try {
      if (MOCK_ENABLED) {
        const { email, userType } = credentials;
        
        // Mock kullanıcı girişini kontrol et
        if (userType === 'admin' && email === MOCK_USERS.admin.email) {
          await setUser(MOCK_USERS.admin);
          return true;
        } else if (userType === 'employee' && email === MOCK_USERS.employee.email) {
          await setUser(MOCK_USERS.employee);
          return true;
        }
        
        // Geçersiz kimlik bilgileri
        throw new Error('Geçersiz e-posta veya şifre');
      }
      
      // Gerçek Supabase implementasyonu
      const { data, error: err } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });
      
      if (err) throw err;
      
      if (data.user) {
        user.value = data.user as User;
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Login error:', err);
      error.value = err instanceof Error ? err : new Error(String(err));
      return false;
    } finally {
      loading.value = false;
    }
  }
  
  // Kullanıcı rolünü kontrol et
  function isAdmin(): boolean {
    return user.value?.user_metadata?.role === 'admin';
  }
  
  function isEmployee(): boolean {
    return user.value?.user_metadata?.role === 'employee';
  }
  
  // Kullanıcı bilgilerini getir
  function getUserInfo() {
    if (!user.value) return null;
    
    return {
      id: user.value.id,
      email: user.value.email,
      role: user.value.user_metadata?.role || 'unknown',
      fullName: user.value.user_metadata?.full_name || '',
      employeeId: user.value.user_metadata?.employee_id || ''
    };
  }
  
  return {
    user,
    loading,
    error,
    loadUser,
    setUser,
    signOut,
    login,
    isAdmin,
    isEmployee,
    getUserInfo,
    MOCK_USERS // Dışarıdan erişim için mock kullanıcıları dışa aktar
  }
})
