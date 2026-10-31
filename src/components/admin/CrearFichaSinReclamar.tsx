import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCategorias, useFamilias, useZonas } from '../../features/directorio/queries'
import { useCrearFichaSinReclamar } from '../../features/reclamaciones/queries'
import { BuscadorZonasChips } from '../directorio/BuscadorZonas'
import { SelectorChipsCategoria } from '../directorio/SelectorChipsCategoria'
import { cn } from '../../lib/cn'
import { Button } from '../ui/Button'
import { baseBoton, tamanosBoton, variantesBoton } from '../ui/estilosBoton'
import { claseCampo, claseEtiqueta } from '../ui/estilosFormulario'

const NOMBRES_CONTACTO: Record<string, string> = { telefono: 'teléfono', email: 'email', web: 'web' }

const VACIO = {
  nombreComercial: '',
  categoriaIds: [] as string[],
  zonaIds: [] as string[],
  localidad: '',
  descripcionBreve: '',
  telefono: '',
  email: '',
  web: '',
  fuenteDatos: '',
}

/** Alta de un negocio que aún no está en Protop, solo con sus datos públicos. */
export function CrearFichaSinReclamar() {
  const familias = useFamilias()
  const categorias = useCategorias()
  const zonas = useZonas()
  const crear = useCrearFichaSinReclamar()
  const [datos, setDatos] = useState(VACIO)
  const [compromiso, setCompromiso] = useState(false)
  const [creada, setCreada] = useState<{ slug: string; nombre: string; email: string; fuente: string; datos: string } | null>(null)

  function cambiar<K extends keyof typeof VACIO>(clave: K, valor: (typeof VACIO)[K]) {
    setDatos((actuales) => ({ ...actuales, [clave]: valor }))
  }

  async function enviar(evento: FormEvent) {
    evento.preventDefault()
    const contacto = Object.fromEntries(
      [
        ['telefono', datos.telefono],
        ['email', datos.email],
        ['web', datos.web],
      ].filter(([, valor]) => valor.trim()),
    )
    const slug = await crear.mutateAsync({ ...datos, contacto })
    const publicados = ['nombre comercial', 'oficio', 'localidad', ...Object.keys(contacto).map((clave) => NOMBRES_CONTACTO[clave])]
    setCreada({
      slug,
      nombre: datos.nombreComercial,
      email: datos.email.trim(),
      fuente: datos.fuenteDatos.trim(),
      datos: publicados.join(', '),
    })
    setDatos(VACIO)
    setCompromiso(false)
  }

  const listo =
    datos.nombreComercial.trim() &&
    datos.categoriaIds.length > 0 &&
    datos.localidad.trim() &&
    datos.fuenteDatos.trim() &&
    compromiso

  return (
    <form onSubmit={enviar} className="mt-4 flex flex-col gap-4 rounded-tarjeta bg-white p-5 ring-1 ring-neutral-200">
      {creada && <AvisoRgpd {...creada} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={claseEtiqueta}>Nombre comercial</span>
          <input required value={datos.nombreComercial} onChange={(e) => cambiar('nombreComercial', e.target.value)} className={claseCampo} />
        </label>
        <label className="block">
          <span className={claseEtiqueta}>Localidad</span>
          <input required value={datos.localidad} onChange={(e) => cambiar('localidad', e.target.value)} placeholder="Santander" className={claseCampo} />
        </label>
      </div>

      <div>
        <span className={claseEtiqueta}>Oficios</span>
        <SelectorChipsCategoria
          familias={familias.data ?? []}
          categorias={categorias.data ?? []}
          valores={datos.categoriaIds}
          onChange={(valores) => cambiar('categoriaIds', valores)}
        />
      </div>

      <div>
        <span className={claseEtiqueta}>Dónde trabaja</span>
        <BuscadorZonasChips zonas={zonas.data ?? []} valores={datos.zonaIds} onChange={(valores) => cambiar('zonaIds', valores)} />
      </div>

      <label className="block">
        <span className={claseEtiqueta}>Qué hace, en una frase</span>
        <input
          value={datos.descripcionBreve}
          onChange={(e) => cambiar('descripcionBreve', e.target.value)}
          placeholder="Fontanería y calefacción en vivienda"
          className={claseCampo}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className={claseEtiqueta}>Teléfono público</span>
          <input type="tel" value={datos.telefono} onChange={(e) => cambiar('telefono', e.target.value)} className={claseCampo} />
        </label>
        <label className="block">
          <span className={claseEtiqueta}>Email público</span>
          <input type="email" value={datos.email} onChange={(e) => cambiar('email', e.target.value)} className={claseCampo} />
        </label>
        <label className="block">
          <span className={claseEtiqueta}>Web</span>
          <input type="url" value={datos.web} onChange={(e) => cambiar('web', e.target.value)} placeholder="https://" className={claseCampo} />
        </label>
      </div>

      <label className="block">
        <span className={claseEtiqueta}>De dónde salen estos datos</span>
        <input
          required
          value={datos.fuenteDatos}
          onChange={(e) => cambiar('fuenteDatos', e.target.value)}
          placeholder="Su web (enlace) o su ficha de Google Maps"
          className={claseCampo}
        />
        <span className="mt-1.5 block text-xs text-neutral-500">
          Obligatorio: si el negocio pregunta, hay que poder decirle de dónde sacamos sus datos.
        </span>
      </label>

      <label className="flex items-start gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          checked={compromiso}
          onChange={(e) => setCompromiso(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-brand-600"
        />
        Son datos que el propio negocio publica, y le informaré de que tiene esta ficha antes de un mes.
      </label>

      {crear.isError && (
        <p className="rounded-md bg-danger-100 px-3 py-2 text-sm text-danger-500" role="alert">
          No se ha podido crear la ficha. Si acabas de actualizar, falta aplicar la migración (supabase db push).
        </p>
      )}

      <Button type="submit" disabled={!listo || crear.isPending} className="self-start">
        {crear.isPending ? 'Creando…' : 'Crear ficha sin reclamar'}
      </Button>
    </form>
  )
}

/**
 * Aviso del artículo 14 del RGPD al negocio: qué datos tenemos, de dónde salen y cómo reclamar o borrar
 * la ficha. Es informativo (obligación legal), sin promoción: no es una comunicación comercial.
 */
function AvisoRgpd({ slug, nombre, email, fuente, datos }: { slug: string; nombre: string; email: string; fuente: string; datos: string }) {
  const [copiado, setCopiado] = useState(false)
  const origen = window.location.origin
  const asunto = `Información sobre la ficha de ${nombre} en Protop`
  const texto = [
    'Hola:',
    '',
    `Te escribimos para informarte, como exige el artículo 14 del Reglamento General de Protección de Datos, de que hemos publicado una ficha de ${nombre} en Protop, un directorio de profesionales de reformas y reparaciones de toda España.`,
    '',
    `Datos que figuran: ${datos}.`,
    `De dónde los hemos obtenido: ${fuente}.`,
    'Para qué: que los vecinos de la zona puedan encontrar y contactar con profesionales, con datos que el propio negocio ha hecho públicos.',
    '',
    `Puedes ver la ficha aquí: ${origen}/profesionales/${slug}`,
    `Si es tu negocio, puedes gestionarla gratis desde: ${origen}/reclamar/${slug}`,
    'Si prefieres no aparecer, puedes pedir que la borremos desde la propia ficha («Pedir que la borremos») o respondiendo a este correo.',
    '',
    `Más información sobre cómo tratamos los datos y tus derechos: ${origen}/legal/privacidad`,
    '',
    'Un saludo,',
    'Protop',
  ].join('\n')

  async function copiar() {
    await navigator.clipboard.writeText(`${asunto}\n\n${texto}`)
    setCopiado(true)
    window.setTimeout(() => setCopiado(false), 2500)
  }

  return (
    <div className="rounded-tarjeta bg-accent-100 p-4 text-sm text-accent-700" role="status">
      <p>
        Ficha de {nombre} creada.{' '}
        <Link to={`/profesionales/${slug}`} className="font-semibold underline">
          Verla
        </Link>
      </p>
      <p className="mt-2 text-neutral-700">
        Ahora informa al negocio antes de un mes (RGPD, art. 14). El aviso ya está redactado: es solo informativo, sin
        promoción.
      </p>
      <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap rounded-md bg-white p-3 font-sans text-xs text-neutral-700">
        {texto}
      </pre>
      <div className="mt-3 flex flex-wrap gap-2">
        {email && (
          <a
            href={`mailto:${email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(texto)}`}
            className={cn(baseBoton, variantesBoton.primario, tamanosBoton.md)}
          >
            Enviarlo desde mi correo
          </a>
        )}
        <Button type="button" variante="secundario" onClick={copiar}>
          {copiado ? 'Copiado' : 'Copiar el aviso'}
        </Button>
      </div>
      {!email && (
        <p className="mt-2 text-xs text-neutral-600">
          La ficha no tiene email: envíaselo por el medio que use el negocio (correo postal o el formulario de su web).
        </p>
      )}
    </div>
  )
}

