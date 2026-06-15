import { createClient } from '@supabase/supabase-js'
import type { Database } from './types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Server-side client for admin operations (use in server components/actions)
export const createServerClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  // Use service role key for server-side operations with elevated privileges
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY

  if (!serviceKey) {
    console.error('SUPABASE_SERVICE_ROLE_KEY is not configured')
    // Fallback to anon key if service key is not available
    return createClient<Database>(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }

  return createClient<Database>(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Helper to get user profile
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw error
  return data
}

// Helper to check if user is admin
export const isAdmin = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase.rpc('is_admin')
  if (error) return false
  return data ?? false
}
