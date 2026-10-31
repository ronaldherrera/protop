import { Eye, EyeOff } from 'lucide-react'
import { type InputHTMLAttributes, useState } from 'react'
import { cn } from '../../lib/cn'
import { claseCampo } from './estilosFormulario'

/** Campo de contraseña con botón para mostrarla u ocultarla. */
export function CampoContrasena({ className, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  const [visible, setVisible] = useState(false)

  return (
    <span className="relative block">
      <input {...props} type={visible ? 'text' : 'password'} className={cn(claseCampo, 'pr-12', className)} />
      <button
        type="button"
        onClick={() => setVisible((actual) => !actual)}
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-md text-neutral-500 hover:text-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-600"
      >
        {visible ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
      </button>
    </span>
  )
}
