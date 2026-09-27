import { supabase } from './supabaseClient'

const BUCKET = 'fotos-profesionales'

export async function subirFoto(userId: string, archivo: File): Promise<string> {
  const extension = archivo.name.split('.').pop() ?? 'jpg'
  const ruta = `${userId}/${crypto.randomUUID()}.${extension}`

  const { error } = await supabase.storage.from(BUCKET).upload(ruta, archivo, {
    cacheControl: '3600',
  })
  if (error) throw error

  return supabase.storage.from(BUCKET).getPublicUrl(ruta).data.publicUrl
}
