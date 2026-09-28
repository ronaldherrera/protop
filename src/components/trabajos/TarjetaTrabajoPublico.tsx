import type { TrabajoPublicado } from '../../features/trabajos/types'

function formatearFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
}

export function TarjetaTrabajoPublico({ trabajo }: { trabajo: TrabajoPublicado }) {
  return (
    <div className="rounded-xl border border-neutral-200 p-4">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-medium text-neutral-900">{trabajo.titulo}</h3>
        {trabajo.realizadoEn && <span className="text-xs text-neutral-500">{formatearFecha(trabajo.realizadoEn)}</span>}
      </div>
      {trabajo.descripcion && <p className="mt-1 text-sm text-neutral-600">{trabajo.descripcion}</p>}

      {trabajo.fotos.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {trabajo.fotos.map((url) => (
            <img key={url} src={url} alt={trabajo.titulo} className="aspect-4/3 w-full rounded-lg object-cover" />
          ))}
        </div>
      )}

      {trabajo.comentario && (
        <blockquote className="mt-3 rounded-lg bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
          "{trabajo.comentario.comentario}"
          <footer className="mt-1 text-xs text-neutral-500">— {trabajo.comentario.autorNombre}, cliente</footer>
        </blockquote>
      )}
    </div>
  )
}
