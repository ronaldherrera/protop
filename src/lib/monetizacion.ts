// Google AdSense, en dos fases (igual que en Tankily):
//  1. VITE_ADSENSE_CLIENT (ca-pub-…): el build genera ads.txt y la web puede cargar AdSense, pero solo
//     a quien acepta «todas» en nuestro aviso de cookies.
//  2. VITE_ADSENSE_CMP=1, cuando el mensaje de consentimiento del RGPD esté configurado en AdSense
//     (Privacidad y mensajes): el gestor certificado de Google sustituye a nuestro aviso.
// Sin VITE_ADSENSE_CLIENT no se carga nada y no aparece ningún aviso.
export const ADSENSE_CLIENTE: string | undefined = import.meta.env.VITE_ADSENSE_CLIENT || undefined
export const ADSENSE_SLOT: string | undefined = import.meta.env.VITE_ADSENSE_SLOT || undefined
export const ADSENSE_ACTIVO = Boolean(ADSENSE_CLIENTE)
export const ADSENSE_CMP = ADSENSE_ACTIVO && import.meta.env.VITE_ADSENSE_CMP === '1'

export const CLAVE_CONSENTIMIENTO = 'protop-consentimiento-cookies'
export const EVENTO_CONSENTIMIENTO = 'protop:consentimiento'

export type Consentimiento = 'todas' | 'necesarias'

export function leerConsentimiento(): Consentimiento | null {
  try {
    const valor = localStorage.getItem(CLAVE_CONSENTIMIENTO)
    return valor === 'todas' || valor === 'necesarias' ? valor : null
  } catch {
    return null
  }
}

export function guardarConsentimiento(valor: Consentimiento) {
  try {
    localStorage.setItem(CLAVE_CONSENTIMIENTO, valor)
  } catch {
    // Sin almacenamiento (modo privado estricto): el aviso volverá a salir, nada más.
  }
  window.dispatchEvent(new CustomEvent(EVENTO_CONSENTIMIENTO, { detail: valor }))
}

export function cargarScriptAdsense() {
  if (!ADSENSE_ACTIVO || document.getElementById('adsense')) return
  if (!ADSENSE_CMP && leerConsentimiento() !== 'todas') {
    window.addEventListener(
      EVENTO_CONSENTIMIENTO,
      (evento) => {
        if ((evento as CustomEvent<Consentimiento>).detail === 'todas') cargarScriptAdsense()
      },
      { once: true },
    )
    return
  }
  const script = document.createElement('script')
  script.id = 'adsense'
  script.async = true
  script.crossOrigin = 'anonymous'
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENTE}`
  document.head.appendChild(script)
}
