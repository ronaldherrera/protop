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
    <div className="flex gap-1 rounded-lg bg-neutral-100 p-1 text-sm font-medium">
      <button
        type="button"
        onClick={() => cambiar('particular')}
        className={cn(
          'flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5',
          modo === 'particular' ? 'bg-white text-brand-700 shadow-sm' : 'text-neutral-600',
        )}
      >
        <User className="h-4 w-4" /> Particular
      </button>
      <button
        type="button"
        onClick={() => cambiar('profesional')}
        className={cn(
          'flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5',
          modo === 'profesional' ? 'bg-white text-brand-700 shadow-sm' : 'text-neutral-600',
        )}
      >
        <Briefcase className="h-4 w-4" /> Profesional
      </button>
    </div>
  )
}
