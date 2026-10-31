import { useEffect, useRef } from 'react'
import { ADSENSE_CLIENTE, ADSENSE_SLOT, cargarScriptAdsense } from '../../lib/monetizacion'
import { cn } from '../../lib/cn'

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

/**
 * Hueco de Google AdSense, siempre rotulado como «Publicidad» (distinto de «Patrocinado», que es un
 * profesional de Protop). Sin AdSense configurado no ocupa sitio.
 */
export function HuecoGoogle({ className }: { className?: string }) {
  const ins = useRef<HTMLModElement>(null)
  const activo = Boolean(ADSENSE_CLIENTE && ADSENSE_SLOT)

  useEffect(() => {
    if (!activo || !ins.current || ins.current.dataset.listo) return
    cargarScriptAdsense()
    ins.current.dataset.listo = '1'
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // AdSense todavía no ha cargado o está bloqueado: el hueco se queda vacío.
    }
  }, [activo])

  if (!activo) return null

  return (
    <aside aria-label="Publicidad" className={cn('rounded-tarjeta bg-white p-3 ring-1 ring-neutral-200', className)}>
      <p className="mb-2 text-xs font-medium text-neutral-500">Publicidad</p>
      <ins
        ref={ins}
        className="adsbygoogle block min-h-[120px]"
        data-ad-client={ADSENSE_CLIENTE}
        data-ad-slot={ADSENSE_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  )
}
