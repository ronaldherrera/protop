import { supabase } from '../../lib/supabaseClient'

export type Perfil = {
  id: string
  nombre: string
  telefono: string | null
  esAdmin: boolean
}

export async function obtenerPerfil(userId: string): Promise<Perfil | null> {
  const { data, error } = await supabase
    .from('perfiles')
    .select('id, nombre, telefono, es_admin')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  return { id: data.id, nombre: data.nombre, telefono: data.telefono, esAdmin: data.es_admin }
}

export async function actualizarPerfil(userId: string, cambios: { nombre: string; telefono: string | null }) {
  const { error } = await supabase.from('perfiles').update(cambios).eq('id', userId)
  if (error) throw error
}

export async function registrarse(email: string, password: string, nombre: string) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nombre } },
  })
  if (error) throw error
}

export async function iniciarSesion(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function cerrarSesion() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
