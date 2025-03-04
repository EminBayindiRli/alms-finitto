import { createClient } from '@supabase/supabase-js'
import type {  PostgrestSingleResponse, SupabaseClient } from '@supabase/supabase-js'

// Environment variables'ları import.meta.env veya window.ENV'den al
const getEnv = (key: string) => {
  // Önce import.meta.env den almayı dene
  if (import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  
  // Sonra window.ENV'den almayı dene (runtime injection için)
  // @ts-ignore
  if (window.ENV && window.ENV[key]) {
    // @ts-ignore
    return window.ENV[key];
  }
  
  // Varsayılan değerleri kontrol et
  if (key === 'VITE_SUPABASE_URL') {
    return 'https://hevfqvlmlzwktzpbvfyq.supabase.co';
  }
  
  if (key === 'VITE_SUPABASE_ANON_KEY') {
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhldmZxdmxtbHp3a3R6cGJ2ZnlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkzMDYxNzcsImV4cCI6MjAyNDg4MjE3N30.qYQjUX8y5-yUvWnZGTtfAdWtXCp8iR4Ib3eAmq_xCRQ';
  }
  
  // Hiçbir değer bulunamadıysa undefined döndür
  return undefined;
}

// Supabase credentials alalım
const supabaseUrl = getEnv('VITE_SUPABASE_URL')
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY')

// Debug için ekstra log
console.log('Supabase Konfigürasyonu:', {
  url: supabaseUrl,
  keyLength: supabaseAnonKey ? supabaseAnonKey.length : 0
})

// Hata durumunu kontrol et
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', { 
    url: supabaseUrl ? 'defined' : 'undefined', 
    key: supabaseAnonKey ? 'defined' : 'undefined' 
  })
}

// Mock Supabase client
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signOut: () => Promise.resolve({ error: null }),
        signUp: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        signIn: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: new Error('Supabase not configured') })
      },
      from: (_table: string) => {
        // Mock data response
        const mockResponse = {
          data: [],
          error: null,
          count: null,
          status: 200,
          statusText: 'OK',
        };
        
        // Common query builder that can be returned from all methods to allow chaining
        const queryBuilder = {
          data: [],
          error: null,
          count: null,
          status: 200,
          statusText: 'OK',
          
          // Add all filter methods
          eq: () => ({
            ...queryBuilder,
            single: () => Promise.resolve(mockResponse as PostgrestSingleResponse<any>),
            maybeSingle: () => Promise.resolve(mockResponse as PostgrestSingleResponse<any>)
          }),
          neq: () => queryBuilder,
          gt: () => queryBuilder,
          gte: () => queryBuilder,
          lt: () => queryBuilder,
          lte: () => queryBuilder,
          like: () => queryBuilder,
          ilike: () => queryBuilder,
          is: () => queryBuilder,
          in: () => queryBuilder,
          contains: () => queryBuilder,
          containedBy: () => queryBuilder,
          rangeLt: () => queryBuilder,
          rangeGt: () => queryBuilder,
          rangeGte: () => queryBuilder,
          rangeLte: () => queryBuilder,
          rangeAdjacent: () => queryBuilder,
          overlaps: () => queryBuilder,
          textSearch: () => queryBuilder,
          match: () => queryBuilder,
          not: () => queryBuilder,
          or: () => queryBuilder,
          filter: () => queryBuilder,
          
          // Modifier methods
          order: () => queryBuilder,
          limit: () => queryBuilder,
          range: () => queryBuilder,
          single: () => Promise.resolve(mockResponse as PostgrestSingleResponse<any>),
          maybeSingle: () => Promise.resolve(mockResponse as PostgrestSingleResponse<any>)
        };
        
        return {
          select: (_query = '') => {
            return queryBuilder as any;
          },
          insert: () => Promise.resolve({ error: null }),
          update: () => Promise.resolve({ error: null }),
          delete: () => Promise.resolve({ error: null }),
          upsert: () => Promise.resolve({ error: null })
        };
      }
    } as unknown as SupabaseClient;

export const getCurrentUser = async () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase is not configured. Cannot get current user.')
    return null
  }
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch (err) {
    console.error('Error getting current user:', err)
    return null
  }
}

export const isAdmin = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false
    
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    return data?.role === 'admin'
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

export default supabase
