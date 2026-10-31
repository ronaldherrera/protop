import type { Categoria, Familia } from '../../types/profesional'

type Props = {
  familias: Familia[]
  categorias: Categoria[]
  value: string
  onChange: (valor: string) => void
  campoValor?: 'slug' | 'id'
  opcionVacia?: string
  required?: boolean
  className?: string
  'aria-label'?: string
}

export function SelectorCategoria({
  familias,
  categorias,
  value,
  onChange,
  campoValor = 'slug',
  opcionVacia = 'Cualquier oficio',
  required = false,
  className = 'w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900',
  'aria-label': etiqueta,
}: Props) {
  return (
    <select aria-label={etiqueta} required={required} value={value} onChange={(e) => onChange(e.target.value)} className={className}>
      <option value="">{opcionVacia}</option>
      {familias.map((familia) => {
        const categoriasFamilia = categorias.filter((c) => c.familiaId === familia.id)
        if (categoriasFamilia.length === 0) return null
        return (
          <optgroup key={familia.id} label={familia.nombre}>
            {categoriasFamilia.map((categoria) => (
              <option key={categoria.id} value={campoValor === 'id' ? categoria.id : categoria.slug}>
                {categoria.nombre}
              </option>
            ))}
          </optgroup>
        )
      })}
    </select>
  )
}
