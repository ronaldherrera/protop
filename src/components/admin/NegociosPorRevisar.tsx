import { AlertTriangle, ExternalLink } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  type NegocioCandidato,
  useCandidatosPendientes,
  useDescartarCandidato,
  usePublicarCandidato,
} from '../../features/admin/candidatos'
import { usePendientesAdmin } from '../../features/admin/usePendientesAdmin'
import { useCategorias } from '../../features/directorio/queries'
import type { MediosContacto } from '../../types/profesional'
import { EmptyState } from '../estado/EmptyState'
import { ErrorState } from '../estado/ErrorState'
import { LoadingState } from '../estado/LoadingState'
import { Button } from '../ui/Button'
import { claseCampo, claseEtiqueta } from '../ui/estilosFormulario'

/** Negocios con datos públicos que esperan revisión antes de publicarse como fichas sin reclamar. */
export function NegociosPorRevisar() {
  const candidatos = useCandidatosPendientes()
  const total = usePendientesAdmin(true).data?.candidatos ?? 0
  const [publicados, setPublicados] = useState<{ nombre: string; slug: string }[]>([])

  if (candidatos.isLoading) return <LoadingState etiqueta="Cargando negocios…" />
  if (candidatos.isError) return <ErrorState descripcion="No se han podido cargar los negocios por revisar." />

  return (
    <div className="mt-3">
      {publicados.length > 0 && (
        <p className="mb-3 rounded-md bg-accent-50 px-3 py-2 text-sm text-accent-600" role="status">
          Publicado:{' '}
          {publicados.map((p, i) => (
            <span key={p.slug}>
              {i > 0 && ', '}
              <Link to={`/profesionales/${p.slug}`} className="font-semibold underline">
                {p.nombre}
              </Link>
            </span>
          ))}
        </p>
      )}
      {!candidatos.data?.length ? (
        <EmptyState titulo="No hay negocios por revisar" />
      ) : (
        <>
          <p className="text-sm text-neutral-600">
            {total > candidatos.data.length
              ? `${total} por revisar; aquí van los ${candidatos.data.length} primeros y, según los resuelvas, entran los siguientes.`
              : `${candidatos.data.length} por revisar.`}{' '}
            Corrige lo que haga falta y publícalo, o descártalo si no encaja.
          </p>
          <ul className="mt-3 flex flex-col gap-3">
            {candidatos.data.map((candidato) => (
              <Candidato
                key={candidato.id}
                candidato={candidato}
                alPublicar={(slug, nombre) => setPublicados((actual) => [{ nombre, slug }, ...actual].slice(0, 5))}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

function Candidato({ candidato, alPublicar }: { candidato: NegocioCandidato; alPublicar: (slug: string, nombre: string) => void }) {
  const categorias = useCategorias()
  const publicar = usePublicarCandidato()
  const descartar = useDescartarCandidato()
  const [nombre, setNombre] = useState(candidato.nombre)
  const [categoriaId, setCategoriaId] = useState(candidato.categoriaId ?? '')
  const [descripcion, setDescripcion] = useState(candidato.descripcionBreve)
  const [telefono, setTelefono] = useState(candidato.contacto.telefono ?? '')
  const [email, setEmail] = useState(candidato.contacto.email ?? '')
  const [web, setWeb] = useState(candidato.contacto.web ?? '')
  const ocupado = publicar.isPending || descartar.isPending
  const sinContacto = !telefono.trim() && !email.trim() && !web.trim()

  async function enviar(evento: FormEvent) {
    evento.preventDefault()
    const contacto: MediosContacto = Object.fromEntries(
      Object.entries({ telefono, email, web }).filter(([, valor]) => valor.trim()).map(([clave, valor]) => [clave, valor.trim()]),
    )
    const slug = await publicar.mutateAsync({
      id: candidato.id,
      nombre: nombre.trim(),
      categoriaId,
      zonaId: candidato.zonaId,
      localidad: candidato.localidad,
      descripcionBreve: descripcion.trim(),
      contacto,
    })
    alPublicar(slug, nombre.trim())
  }

  return (
    <li className="rounded-tarjeta bg-white p-4 ring-1 ring-neutral-200">
      <form onSubmit={enviar}>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold text-neutral-500">
              {candidato.localidad || 'Sin municipio'}
              {candidato.direccion && ` · ${candidato.direccion}`}
            </p>
          </div>
          {candidato.enlaceFuente && (
            <a
              href={candidato.enlaceFuente}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline"
            >
              Ver en el mapa <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          )}
        </div>

        {candidato.avisos && (
          <p className="mt-2 flex items-start gap-2 rounded-md bg-warning-100 px-3 py-2 text-sm text-neutral-800">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-500" aria-hidden="true" />
            {candidato.avisos}
          </p>
        )}

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className={claseEtiqueta}>Nombre</span>
            <input required value={nombre} onChange={(e) => setNombre(e.target.value)} className={claseCampo} />
          </label>
          <label className="block">
            <span className={claseEtiqueta}>Oficio</span>
            <select required value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} className={claseCampo}>
              <option value="">Elige un oficio</option>
              {categorias.data?.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={claseEtiqueta}>Descripción breve</span>
            <input required value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className={claseCampo} />
          </label>
          <label className="block">
            <span className={claseEtiqueta}>Teléfono</span>
            <input value={telefono} onChange={(e) => setTelefono(e.target.value)} inputMode="tel" className={claseCampo} />
          </label>
          <label className="block">
            <span className={claseEtiqueta}>Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className={claseCampo} />
          </label>
          <label className="block sm:col-span-2">
            <span className={claseEtiqueta}>Web</span>
            <input value={web} onChange={(e) => setWeb(e.target.value)} type="url" className={claseCampo} />
          </label>
        </div>

        {(publicar.isError || descartar.isError) && (
          <p className="mt-3 rounded-md bg-danger-100 px-3 py-2 text-sm text-danger-500" role="alert">
            {(publicar.error ?? descartar.error)?.message ?? 'No se ha podido guardar.'}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button type="submit" disabled={ocupado || sinContacto}>
            {publicar.isPending ? 'Publicando…' : 'Publicar ficha'}
          </Button>
          <Button type="button" variante="secundario" disabled={ocupado} onClick={() => descartar.mutate(candidato.id)}>
            Descartar
          </Button>
          {sinContacto && <span className="text-sm text-neutral-500">Necesita al menos un teléfono, email o web.</span>}
        </div>
      </form>
    </li>
  )
}
