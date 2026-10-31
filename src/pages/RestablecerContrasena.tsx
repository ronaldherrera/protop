import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LoadingState } from '../components/estado/LoadingState'
import { Button } from '../components/ui/Button'
import { CampoContrasena } from '../components/ui/CampoContrasena'
import { claseEtiqueta } from '../components/ui/estilosFormulario'
import { baseBoton, tamanosBoton, variantesBoton } from '../components/ui/estilosBoton'
import { cambiarContrasena } from '../features/auth/api'
import { useAuth } from '../features/auth/useAuth'
import { cn } from '../lib/cn'

/** Destino del enlace "crear una contraseña nueva": Supabase abre una sesión temporal al llegar. */
export function RestablecerContrasena() {
  const { user, cargando } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [repetida, setRepetida] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (cargando) return <LoadingState etiqueta="Comprobando el enlace…" />

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
        <h1 className="titular text-4xl text-neutral-900">Este enlace ya no sirve</h1>
        <p className="mt-3 text-neutral-600">
          Los enlaces para cambiar la contraseña caducan al poco tiempo y solo se pueden usar una vez. Pide otro
          desde la pantalla de acceso.
        </p>
        <Link to="/acceso" className={cn(baseBoton, variantesBoton.primario, tamanosBoton.lg, 'mt-6')}>
          Pedir un enlace nuevo
        </Link>
      </div>
    )
  }

  async function enviar(evento: FormEvent) {
    evento.preventDefault()
    setError(null)
    if (password !== repetida) {
      setError('Las dos contraseñas no coinciden.')
      return
    }
    setEnviando(true)
    try {
      await cambiarContrasena(password)
      navigate('/particular', { replace: true })
    } catch (err) {
      setError(
        err instanceof Error && err.message.includes('should be different')
          ? 'La contraseña nueva tiene que ser distinta de la anterior.'
          : 'No se ha podido cambiar la contraseña. Inténtalo de nuevo.',
      )
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="titular text-4xl text-neutral-900">Elige tu contraseña nueva</h1>
      <form onSubmit={enviar} className="mt-8 flex flex-col gap-4">
        <label className="block">
          <span className={claseEtiqueta}>Contraseña nueva</span>
          <CampoContrasena
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(evento) => setPassword(evento.target.value)}
          />
          <span className="mt-1.5 block text-xs text-neutral-500">Al menos 8 caracteres.</span>
        </label>
        <label className="block">
          <span className={claseEtiqueta}>Repítela</span>
          <CampoContrasena
            required
            minLength={8}
            autoComplete="new-password"
            value={repetida}
            onChange={(evento) => setRepetida(evento.target.value)}
          />
        </label>
        {error && (
          <p className="rounded-md bg-danger-100 px-3 py-2 text-sm text-danger-500" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" tamano="lg" disabled={enviando}>
          {enviando ? 'Guardando…' : 'Guardar contraseña'}
        </Button>
      </form>
    </div>
  )
}
