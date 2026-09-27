import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'
import { env } from './env'

if (!env.supabaseUrl || !env.supabaseAnonKey) {
  throw new Error(
    'Faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Copia .env.example a .env.local y rellénalas.',
  )
}

export const supabase = createClient<Database>(env.supabaseUrl, env.supabaseAnonKey)
