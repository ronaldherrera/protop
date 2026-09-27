import { type FormEvent, useState } from 'react'
import { Navigate, useLocation, useSearchParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { iniciarSesion, registrarse } from '../features/auth/api'
import { useAuth } from '../features/auth/useAuth'

type Modo = 'entrar' | 'registrarse'

export function Acceso() {
  const [parametros] = useSearchParams()
  const ubicacion = useLocation() as { state?: { desde?: string } }
  const { user, cargando: cargandoSesion } = useAuth()

  const esProfesional = parametros.get('rol') === 'profesional'
  const [modo, setModo] = useState<Modo>('entrar')
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [registroEnviado, setRegistroEnviado] = useState(false)

  if (!cargandoSesion && user) {
    const destino = ubicacion.state?.desde ?? (esProfesional ? '/profesional' : '/particular')
    return <Navigate to={destino} replace />
  }

  async function enviar(evento: FormEvent) {
    evento.preventDefault()
    setError(null)
    setEnviando(true)
    try {
      if (modo === 'registrarse') {
        await registrarse(email, password, nombre)
        setRegistroEnviado(true)
      } else {
        await iniciarSesion(email, password)
      }
    } catch (err) {
      setError(err instanceof Error ? traducirError(err.message) : 'Ha ocurrido un error inesperado.')
    } finally {
      setEnviando(false)
    }
  }

  if (registroEnviado) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
        <h1 className="text-xl font-bold text-neutral-900">Revisa tu correo</h1>
        <p className="mt-2 text-neutral-600">
          Te hemos enviado un enlace de confirmación a <strong>{email}</strong>. Ábrelo para activar tu cuenta.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold text-neutral-900">
        {esProfesional ? 'Publica tu ficha en Protop' : 'Accede a tu cuenta'}
      </h1>
      <p className="mt-2 text-sm text-neutral-600">
        {esProfesional
          ? 'Con una cuenta gratuita puedes crear tu ficha de profesional y, si quieres, usar Protop también como particular.'
          : 'Con la misma cuenta puedes buscar profesionales y, si lo necesitas, publicar tu propia ficha.'}
      </p>

      <div className="mt-6 flex gap-1 rounded-lg bg-neutral-100 p-1 text-sm font-medium">
        <button
          type="button"
          onClick={() => setModo('entrar')}
          className={`flex-1 rounded-md py-2 ${modo === 'entrar' ? 'bg-white shadow-sm' : 'text-neutral-600'}`}
        >
          Ya tengo cuenta
        </button>
        <button
          type="button"
          onClick={() => setModo('registrarse')}
          className={`flex-1 rounded-md py-2 ${modo === 'registrarse' ? 'bg-white shadow-sm' : 'text-neutral-600'}`}
        >
          Crear cuenta
        </button>
      </div>

      <form onSubmit={enviar} className="mt-6 flex flex-col gap-4">
        {modo === 'registrarse' && (
          <label className="text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Nombre</span>
            <input
              type="text"
              required
              value={nombre}
              onChange={(evento) => setNombre(evento.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
            />
          </label>
        )}

        <label className="text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Correo electrónico</span>
          <input
            type="email"
            required
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Contraseña</span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(evento) => setPassword(evento.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
          />
        </label>

        {error && <p className="text-sm text-danger-500">{error}</p>}

        <Button type="submit" disabled={enviando} className="w-full">
          {enviando ? 'Enviando…' : modo === 'registrarse' ? 'Crear cuenta' : 'Entrar'}
        </Button>
      </form>
    </div>
  )
}

function traducirError(mensaje: string): string {
  if (mensaje.includes('Invalid login credentials')) return 'Correo o contraseña incorrectos.'
  if (mensaje.includes('User already registered')) return 'Ya existe una cuenta con ese correo.'
  if (mensaje.includes('Password should be at least')) return 'La contraseña debe tener al menos 8 caracteres.'
  return mensaje
}
