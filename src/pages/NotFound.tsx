import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-semibold text-brand-600">Error 404</p>
      <h1 className="text-2xl font-bold text-neutral-900">No encontramos esta página</h1>
      <p className="text-neutral-600">Puede que la dirección esté mal escrita o que la página ya no exista.</p>
      <Link to="/" className="text-sm font-medium text-brand-700 hover:underline">
        Volver al inicio
      </Link>
    </div>
  )
}
