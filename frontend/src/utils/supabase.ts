import { createClient } from '@supabase/supabase-js'

// Environment variables'ları import.meta.env veya window.ENV'den al
const getEnv = (key: string) => {
  // @ts-ignore - window.ENV tipini global olarak tanımlı değil
  return import.meta.env[key] || (window.ENV && window.ENV[key]) || undefined
}

const supabaseUrl = getEnv('VITE_SUPABASE_URL')
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  // Hata fırlatmak yerine konsola yazalım
}

// Eğer credentials varsa client'ı oluştur, yoksa boş bir nesne döndür
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const getCurrentUser = async () => {
  if (!supabase) {
    console.error('Supabase client is not initialized')
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
