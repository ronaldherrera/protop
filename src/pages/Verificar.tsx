import type { EmailOtpType } from '@supabase/supabase-js'
import { Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { baseBoton, tamanosBoton, variantesBoton } from '../components/ui/estilosBoton'
import { tomarDestinoPendiente } from '../features/auth/destinoPendiente'
import { cn } from '../lib/cn'
import { supabase } from '../lib/supabaseClient'
import { useSeo } from '../lib/useSeo'

// A dónde se va después de cada tipo de enlace del correo.
const DESTINO: Partial<Record<EmailOtpType, string>> = {
  email: '/particular',
  signup: '/particular',
  magiclink: '/particular',
  recovery: '/restablecer-contrasena',
  email_change: '/particular',
}

/**
 * Los botones de los correos de la cuenta llevan aquí (protop.es/verificar?token_hash=…&type=…) en lugar de a
 * supabase.co: así el enlace es del mismo dominio que el remitente y el correo no parece phishing.
 */
export function Verificar() {
  const [parametros] = useSearchParams()
  const navigate = useNavigate()
  const [fallo, setFallo] = useState(false)
  const hecho = useRef(false)
  const tokenHash = parametros.get('token_hash')
  const tipo = parametros.get('type') as EmailOtpType | null
  const enlaceCompleto = Boolean(tokenHash && tipo && DESTINO[tipo])
  const error = !enlaceCompleto || fallo
  useSeo('Comprobando el enlace | Protop', 'Comprobando el enlace del correo.', { noIndex: true })

  useEffect(() => {
    if (hecho.current || !enlaceCompleto || !tokenHash || !tipo) return
    hecho.current = true // el código solo vale una vez (en desarrollo, React ejecuta los efectos dos veces)
    supabase.auth.verifyOtp({ token_hash: tokenHash, type: tipo }).then(({ error: errorVerificacion }) => {
      if (errorVerificacion) {
        setFallo(true)
        return
      }
      // Tras confirmar la cuenta se vuelve a lo que se estaba haciendo (por ejemplo, reclamar una ficha).
      const pendiente = tipo === 'recovery' ? null : tomarDestinoPendiente()
      navigate(pendiente ?? (DESTINO[tipo] as string), { replace: true })
    })
  }, [enlaceCompleto, tokenHash, tipo, navigate])

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
      {error ? (
        <>
          <h1 className="titular text-4xl text-neutral-900">Este enlace ya no sirve</h1>
          <p className="mt-3 text-neutral-600">
            Los enlaces de los correos solo se pueden usar una vez y caducan en una hora. Entra con tu email o pide uno
            nuevo.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/acceso" className={cn(baseBoton, variantesBoton.primario, tamanosBoton.lg)}>
              Entrar en mi cuenta
            </Link>
          </div>
        </>
      ) : (
        <>
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand-500" aria-hidden="true" />
          <h1 className="titular mt-4 text-3xl text-neutral-900">Comprobando el enlace…</h1>
        </>
      )}
    </div>
  )
}
