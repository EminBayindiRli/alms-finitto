import { createClient } from '@supabase/supabase-js'

// Environment variables'ları import.meta.env veya window.ENV'den al
const getEnv = (key: string) => {
  // @ts-ignore - window.ENV tipini global olarak tanımlı değil
  return import.meta.env[key] || (window.ENV && window.ENV[key]) || undefined
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
    if (!user || !supabase) return false
    
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (error) throw error
    return data?.role === 'admin'
  } catch (err) {
    console.error('Error checking admin status:', err)
    return false
  }
}
