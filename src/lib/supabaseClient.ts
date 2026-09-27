import { createClient } from '@supabase/supabase-js'
import { env, supabaseConfigurado } from './env'

/**
 * Cliente Supabase compartido. En la Fase 1 no se usa todavía desde ninguna
 * pantalla: queda preparado para la Fase 2 (directorio real) y la Fase 3
 * (autenticación). Si faltan las variables de entorno, se deja en null en
 * lugar de lanzar un error, para no romper el resto de la app.
 */
export const supabase = supabaseConfigurado
  ? createClient(env.supabaseUrl as string, env.supabaseAnonKey as string)
  : null
