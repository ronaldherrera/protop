import { Briefcase, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useModo } from '../../features/modo/useModo'
import { cn } from '../../lib/cn'

export function SelectorModo() {
  const { modo, setModo } = useModo()
  const navigate = useNavigate()

  function cambiar(nuevo: 'particular' | 'profesional') {
    setModo(nuevo)
    navigate(nuevo === 'profesional' ? '/profesional' : '/particular')
  }

  return (
    <div className="flex gap-1 rounded-lg border border-neutral-200 bg-white p-1 text-sm font-medium shadow-sm">
      <button
        type="button"
        onClick={() => cambiar('particular')}
        className={cn(
          'flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 transition-colors',
          modo === 'particular' ? 'bg-brand-600 text-white shadow-sm' : 'text-neutral-500 hover:bg-neutral-50',
        )}
      >
        <User className="h-4 w-4" /> Particular
      </button>
      <button
        type="button"
        onClick={() => cambiar('profesional')}
        className={cn(
          'flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 transition-colors',
          modo === 'profesional' ? 'bg-brand-600 text-white shadow-sm' : 'text-neutral-500 hover:bg-neutral-50',
        )}
      >
        <Briefcase className="h-4 w-4" /> Profesional
      </button>
    </div>
  )
}
