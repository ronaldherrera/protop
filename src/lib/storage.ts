import { supabase } from './supabaseClient'

const BUCKET_FOTOS = 'fotos-profesionales'
const BUCKET_FACTURAS = 'facturas'
const BUCKET_SOLICITUDES = 'solicitudes-fotos'

export async function subirFoto(userId: string, archivo: File): Promise<string> {
  const extension = archivo.name.split('.').pop() ?? 'jpg'
  const ruta = `${userId}/${crypto.randomUUID()}.${extension}`

  const { error } = await supabase.storage.from(BUCKET_FOTOS).upload(ruta, archivo, {
    cacheControl: '3600',
  })
  if (error) throw error

  return supabase.storage.from(BUCKET_FOTOS).getPublicUrl(ruta).data.publicUrl
}

/** Sube una factura al bucket privado y devuelve su ruta interna (no una URL). */
export async function subirFactura(userId: string, archivo: File): Promise<string> {
  const extension = archivo.name.split('.').pop() ?? 'pdf'
  const ruta = `${userId}/${crypto.randomUUID()}.${extension}`

  const { error } = await supabase.storage.from(BUCKET_FACTURAS).upload(ruta, archivo)
  if (error) throw error

  return ruta
}

/** URL firmada de corta duración; nunca una URL pública permanente (sección 7). */
export async function obtenerUrlFirmadaFactura(ruta: string): Promise<string> {
  const { data, error } = await supabase.storage.from(BUCKET_FACTURAS).createSignedUrl(ruta, 300)
  if (error) throw error
  return data.signedUrl
}

/** Sube una foto de solicitud al bucket privado y devuelve su ruta interna. */
export async function subirFotoSolicitud(userId: string, archivo: File): Promise<string> {
  const extension = archivo.name.split('.').pop() ?? 'jpg'
  const ruta = `${userId}/${crypto.randomUUID()}.${extension}`

  const { error } = await supabase.storage.from(BUCKET_SOLICITUDES).upload(ruta, archivo)
  if (error) throw error

  return ruta
}

export async function obtenerUrlFirmadaFotoSolicitud(ruta: string): Promise<string> {
  const { data, error } = await supabase.storage.from(BUCKET_SOLICITUDES).createSignedUrl(ruta, 3600)
  if (error) throw error
  return data.signedUrl
}
