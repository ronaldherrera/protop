import { useMutation } from '@tanstack/react-query'
import { Check } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { apuntarseDestacado, SinListaDestacado } from '../../features/destacado/api'
import { useCategorias } from '../../features/directorio/queries'
import { TITULAR } from '../../features/legal/titular'
import { Button } from '../ui/Button'
import { claseCampo, claseEtiqueta } from '../ui/estilosFormulario'

/**
 * Lista de espera del Plan Destacado mientras el cobro no está activo: quien se apunta recibe un aviso el día que se
 * pueda contratar. Si la base aún no tiene la tabla, se ofrece mandar el mismo mensaje por email.
 */
export function ListaInteresDestacado() {
  const categorias = useCategorias()
  const [email, setEmail] = useState('')
  const [nombreNegocio, setNombreNegocio] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [zona, setZona] = useState('')
  const apuntarse = useMutation({ mutationFn: apuntarseDestacado })

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    apuntarse.mutate({ email, nombreNegocio, categoriaId: categoriaId || null, zona })
  }

  if (apuntarse.isSuccess) {
    return (
      <p className="flex gap-2 rounded-xl bg-accent-50 p-4 text-sm text-accent-700" role="status">
        <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        Apuntado. Te escribiremos a {email} el día que se pueda contratar, con el precio de tu oficio.
      </p>
    )
  }

  if (apuntarse.error instanceof SinListaDestacado) {
    const asunto = encodeURIComponent('Quiero el Plan Destacado')
    const cuerpo = encodeURIComponent(`Negocio: ${nombreNegocio}\nZona: ${zona}\nEmail: ${email}`)
    return (
      <p className="rounded-xl bg-neutral-100 p-4 text-sm text-neutral-700">
        La lista aún no está abierta. Escríbenos a{' '}
        <a href={`mailto:${TITULAR.email}?subject=${asunto}&body=${cuerpo}`} className="font-semibold text-brand-700 underline">
          {TITULAR.email}
        </a>{' '}
        y te avisamos.
      </p>
    )
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className={claseEtiqueta}>Tu email</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={claseCampo} />
        </label>
        <label className="block">
          <span className={claseEtiqueta}>Nombre del negocio</span>
          <input value={nombreNegocio} onChange={(e) => setNombreNegocio(e.target.value)} className={claseCampo} />
        </label>
        <label className="block">
          <span className={claseEtiqueta}>Tu oficio</span>
          <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} className={claseCampo}>
            <option value="">Elige tu oficio</option>
            {(categorias.data ?? []).map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={claseEtiqueta}>Dónde trabajas</span>
          <input value={zona} onChange={(e) => setZona(e.target.value)} placeholder="Ej. Madrid" className={claseCampo} />
        </label>
      </div>
      {apuntarse.isError && (
        <p className="text-sm text-danger-500" role="alert">
          No hemos podido apuntarte. Revisa el email e inténtalo de nuevo.
        </p>
      )}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <Button type="submit" disabled={apuntarse.isPending}>
          {apuntarse.isPending ? 'Apuntando…' : 'Avisadme cuando esté disponible'}
        </Button>
        <p className="text-xs text-neutral-500">Solo usamos tu email para este aviso.</p>
      </div>
    </form>
  )
}
