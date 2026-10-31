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

/** `volver`: ruta interna a la que lleva el enlace de confirmación (por ejemplo, la ficha que se reclama). */
export async function registrarse(email: string, password: string, nombre: string, volver?: string) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    // El enlace del correo vuelve a la misma web desde la que se registró (local o protop.es).
    options: {
      data: { nombre },
      emailRedirectTo: `${window.location.origin}/acceso${volver ? `?volver=${encodeURIComponent(volver)}` : ''}`,
    },
  })
  if (error) throw error
}

/** Vuelve a mandar el correo de confirmación de una cuenta que aún no lo ha abierto. */
export async function reenviarConfirmacion(email: string, volver?: string) {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: { emailRedirectTo: `${window.location.origin}/acceso${volver ? `?volver=${encodeURIComponent(volver)}` : ''}` },
  })
  if (error) throw error
}

export async function iniciarSesion(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function pedirRestablecerContrasena(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/restablecer-contrasena`,
  })
  if (error) throw error
}

export async function cambiarContrasena(password: string) {
  const { error } = await supabase.auth.updateUser({ password })
  if (error) throw error
}

export async function cerrarSesion() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
