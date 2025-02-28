import { createClient } from '@supabase/supabase-js'

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
  
  // Hiçbir değer bulunamadıysa undefined döndür
  return undefined;
}

// Supabase credentials alalım
const supabaseUrl = getEnv('VITE_SUPABASE_URL')
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY')

// Hata durumunu kontrol et
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', { 
    url: supabaseUrl ? 'defined' : 'undefined', 
    key: supabaseAnonKey ? 'defined' : 'undefined' 
  })
}

// createClient'ı çağırmadan önce null kontrolü yaparak oluşturalım
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      // Fallback stub implementasyonu
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null } }),
        signOut: () => Promise.resolve({ error: null }),
        signUp: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        signIn: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: null }),
            maybeSingle: () => Promise.resolve({ data: null, error: null })
          })
        }),
        insert: () => Promise.resolve({ error: null })
      })
    }

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
    const user = await getCurrentUser()
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
