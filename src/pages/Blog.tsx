import { Link } from 'react-router-dom'

export function Blog() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-semibold text-brand-600">Blog</p>
      <h1 className="text-2xl font-bold text-neutral-900">Todavía no hay artículos publicados</h1>
      <p className="text-neutral-600">
        Aquí iremos publicando contenido sobre reformas, mantenimiento del hogar y cómo sacarle partido a Protop.
      </p>
      <Link to="/" className="text-sm font-medium text-brand-700 hover:underline">
        Volver al inicio
      </Link>
    </div>
  )
}
