import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ADSENSE_ACTIVO, ADSENSE_CMP, guardarConsentimiento, leerConsentimiento } from '../../lib/monetizacion'
import { Button } from '../ui/Button'

/**
 * Aviso de cookies propio, solo mientras AdSense funcione sin el gestor certificado de Google.
 * Las dos opciones pesan lo mismo: rechazar es tan fácil como aceptar.
 */
export function AvisoCookies() {
  const [visible, setVisible] = useState(() => ADSENSE_ACTIVO && !ADSENSE_CMP && leerConsentimiento() === null)

  if (!visible) return null

  function elegir(valor: 'todas' | 'necesarias') {
    guardarConsentimiento(valor)
    setVisible(false)
  }

  return (
    <div
      role="dialog"
      aria-label="Cookies"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-tarjeta bg-white p-5 shadow-tarjeta-alzada ring-1 ring-neutral-200"
    >
      <p className="text-sm text-neutral-700">
        Usamos cookies necesarias para que la web funcione. Si aceptas todas, también las de Google para mostrar
        publicidad que ayuda a mantener Protop gratis.{' '}
        <Link to="/legal/cookies" className="font-semibold text-brand-700 underline">
          Más información
        </Link>
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" variante="secundario" onClick={() => elegir('necesarias')}>
          Solo las necesarias
        </Button>
        <Button type="button" variante="secundario" onClick={() => elegir('todas')}>
          Aceptar todas
        </Button>
      </div>
    </div>
  )
}
