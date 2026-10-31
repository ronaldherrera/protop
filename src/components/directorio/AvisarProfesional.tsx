import { Mail } from 'lucide-react'
import { SITIO } from '../../features/blog/seo'
import type { Profesional } from '../../types/profesional'
import { WhatsAppIcon } from '../icons/WhatsAppIcon'
import { baseBoton, tamanosBoton, variantesBoton } from '../ui/estilosBoton'
import { cn } from '../../lib/cn'

/** Un móvil español (6xx o 7xx) puede recibir WhatsApp; un fijo no. */
function numeroWhatsApp(profesional: Profesional): string | null {
  const candidato = profesional.contacto.whatsapp ?? profesional.contacto.telefono
  if (!candidato) return null
  const digitos = candidato.replace(/[^0-9]/g, '').replace(/^0034|^34/, '')
  return /^[67]\d{8}$/.test(digitos) ? `34${digitos}` : null
}

/**
 * Para fichas que el negocio aún no ha reclamado: el particular avisa él mismo, desde su WhatsApp o
 * su correo, con un mensaje ya escrito. Lo envía una persona interesada, no Protop (LSSI, art. 21).
 */
export function AvisarProfesional({ profesional }: { profesional: Profesional }) {
  const enlaceFicha = `${SITIO}/profesionales/${profesional.slug}`
  const enlaceReclamar = `${SITIO}/reclamar/${profesional.slug}`
  const texto =
    `Hola, te he encontrado en Protop, el tablón de profesionales de reformas, ` +
    `y me gustaría pedirte un presupuesto. Esta es tu ficha: ${enlaceFicha}\n\n` +
    `Si la reclamas (es gratis), podrás recibir solicitudes de trabajo como la mía: ${enlaceReclamar}`

  const whatsapp = numeroWhatsApp(profesional)
  const email = profesional.contacto.email

  if (!whatsapp && !email) return null

  return (
    <div className="mt-5 border-t border-dashed border-neutral-300 pt-4">
      <p className="text-sm font-semibold text-neutral-900">Todavía no usa Protop</p>
      <p className="mt-1 text-sm text-neutral-600">
        Avísale de que quieres un presupuesto. Se abre tu WhatsApp o tu correo con el mensaje escrito: lo revisas y lo
        envías tú.
      </p>
      <div className="mt-3 flex flex-col gap-2">
        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(texto)}`}
            target="_blank"
            rel="noreferrer"
            className={cn(baseBoton, variantesBoton.secundario, tamanosBoton.md, 'justify-start')}
          >
            <WhatsAppIcon className="h-4 w-4" />
            Avisarle por WhatsApp
          </a>
        )}
        {email && (
          <a
            href={`mailto:${email}?subject=${encodeURIComponent('Presupuesto a través de Protop')}&body=${encodeURIComponent(texto)}`}
            className={cn(baseBoton, variantesBoton.secundario, tamanosBoton.md, 'justify-start')}
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Avisarle por email
          </a>
        )}
      </div>
    </div>
  )
}
