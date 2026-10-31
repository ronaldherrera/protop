import { MailCheck } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { Link, Navigate, useLocation, useSearchParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { CampoContrasena } from '../components/ui/CampoContrasena'
import { claseCampo, claseEtiqueta } from '../components/ui/estilosFormulario'
import { iniciarSesion, pedirRestablecerContrasena, reenviarConfirmacion, registrarse } from '../features/auth/api'
import { guardarDestinoPendiente } from '../features/auth/destinoPendiente'
import { useAuth } from '../features/auth/useAuth'
import { cn } from '../lib/cn'
import { useSeo } from '../lib/useSeo'

type Modo = 'entrar' | 'registrarse' | 'olvido'

export function Acceso() {
  const [parametros] = useSearchParams()
  const ubicacion = useLocation() as { state?: { desde?: string } }
  const { user, cargando: cargandoSesion } = useAuth()

  const esProfesional = parametros.get('rol') === 'profesional'
  // Solo rutas internas: nunca redirigir a otra web con un parámetro de la URL.
  const volverParametro = parametros.get('volver')
  const volver =
    ubicacion.state?.desde ?? (volverParametro?.startsWith('/') && !volverParametro.startsWith('//') ? volverParametro : undefined)
  useSeo('Entrar en Protop', 'Entra en tu cuenta de Protop o crea una nueva.', { noIndex: true })
  const [modo, setModo] = useState<Modo>(esProfesional ? 'registrarse' : 'entrar')
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [enviando, setEnviando] = useState(false)
  // Si el enlace del correo falla, Supabase vuelve aquí con el error en el fragmento de la URL (#error_code=…).
  const [errorEnlace] = useState(leerErrorDelEnlace)
  const [error, setError] = useState<string | null>(errorEnlace)
  const [sinConfirmar, setSinConfirmar] = useState(errorEnlace !== null)
  const [correoEnviado, setCorreoEnviado] = useState<'registro' | 'olvido' | null>(null)

  if (!cargandoSesion && user) {
    const destino = volver ?? (esProfesional ? '/profesional' : '/particular')
    return <Navigate to={destino} replace />
  }

  function cambiarModo(nuevo: Modo) {
    setModo(nuevo)
    setError(null)
    setSinConfirmar(false)
  }

  async function reenviar() {
    if (!email) {
      setError('Escribe tu correo y te mandamos un enlace nuevo.')
      return
    }
    setEnviando(true)
    try {
      await reenviarConfirmacion(email, volver)
      setCorreoEnviado('registro')
    } catch (err) {
      setError(err instanceof Error ? traducirError(err.message) : 'Ha ocurrido un error inesperado.')
    } finally {
      setEnviando(false)
    }
  }

  async function enviar(evento: FormEvent) {
    evento.preventDefault()
    setError(null)
    setSinConfirmar(false)
    setEnviando(true)
    try {
      if (modo === 'registrarse') {
        guardarDestinoPendiente(volver)
        await registrarse(email, password, nombre, volver)
        setCorreoEnviado('registro')
      } else if (modo === 'olvido') {
        await pedirRestablecerContrasena(email)
        setCorreoEnviado('olvido')
      } else {
        await iniciarSesion(email, password)
      }
    } catch (err) {
      setError(err instanceof Error ? traducirError(err.message) : 'Ha ocurrido un error inesperado.')
      setSinConfirmar(err instanceof Error && err.message.includes('Email not confirmed'))
    } finally {
      setEnviando(false)
    }
  }

  if (correoEnviado) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
        <MailCheck className="h-10 w-10 text-accent-500" aria-hidden="true" />
        <h1 className="titular mt-4 text-4xl text-neutral-900">Revisa tu correo</h1>
        <p className="mt-3 text-neutral-600">
          {correoEnviado === 'registro'
            ? 'Te hemos enviado un enlace a '
            : 'Si hay una cuenta con ese correo, te hemos enviado un enlace para crear una contraseña nueva a '}
          <strong className="text-neutral-900">{email}</strong>.
          {correoEnviado === 'registro' && ' Ábrelo para activar tu cuenta.'}
        </p>
        <p className="mt-3 text-sm text-neutral-500">
          Si no lo ves en unos minutos, mira en la carpeta de correo no deseado.
        </p>
      </div>
    )
  }

  const titulo =
    modo === 'olvido'
      ? 'Crea una contraseña nueva'
      : esProfesional
        ? 'Publica tu ficha en Protop'
        : modo === 'registrarse'
          ? 'Crea tu cuenta'
          : 'Entra en tu cuenta'

  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_24rem] lg:items-start">
      <div className="max-w-md">
        <h1 className="titular text-5xl leading-[0.98] text-neutral-900">{titulo}</h1>
        <p className="mt-4 text-neutral-600">
          {modo === 'olvido'
            ? 'Escribe el correo con el que te registraste y te enviaremos un enlace para elegir otra contraseña.'
            : esProfesional
              ? 'Tu ficha es gratis y no cobramos comisión por los trabajos. La misma cuenta te sirve también para pedir presupuestos como particular.'
              : 'Una sola cuenta para todo: buscar profesionales, pedir presupuestos, valorar trabajos y, si eres profesional, publicar tu ficha.'}
        </p>
      </div>

      <div className="rounded-tarjeta bg-carton p-6 shadow-tarjeta ring-1 ring-neutral-200">
        {modo !== 'olvido' && (
          <div className="flex rounded-md bg-neutral-100 p-1" role="tablist" aria-label="Tipo de acceso">
            {(
              [
                ['entrar', 'Ya tengo cuenta'],
                ['registrarse', 'Crear cuenta'],
              ] as const
            ).map(([valor, etiqueta]) => (
              <button
                key={valor}
                type="button"
                role="tab"
                aria-selected={modo === valor}
                onClick={() => cambiarModo(valor)}
                className={cn(
                  'flex-1 rounded py-2 text-sm font-semibold',
                  modo === valor ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600 hover:text-neutral-900',
                )}
              >
                {etiqueta}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={enviar} className={cn('flex flex-col gap-4', modo !== 'olvido' && 'mt-6')} noValidate={false}>
          {modo === 'registrarse' && (
            <label className="block">
              <span className={claseEtiqueta}>Nombre</span>
              <input
                type="text"
                required
                autoComplete="name"
                value={nombre}
                onChange={(evento) => setNombre(evento.target.value)}
                className={claseCampo}
              />
            </label>
          )}

          <label className="block">
            <span className={claseEtiqueta}>Correo electrónico</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
              className={claseCampo}
            />
          </label>

          {modo !== 'olvido' && (
            <label className="block">
              <span className="flex items-baseline justify-between">
                <span className={claseEtiqueta}>Contraseña</span>
                {modo === 'entrar' && (
                  <button
                    type="button"
                    onClick={() => cambiarModo('olvido')}
                    className="text-sm font-medium text-brand-700 hover:underline"
                  >
                    ¿La has olvidado?
                  </button>
                )}
              </span>
              <CampoContrasena
                required
                minLength={8}
                autoComplete={modo === 'registrarse' ? 'new-password' : 'current-password'}
                aria-describedby={modo === 'registrarse' ? 'ayuda-contrasena' : undefined}
                value={password}
                onChange={(evento) => setPassword(evento.target.value)}
              />
              {modo === 'registrarse' && (
                <span id="ayuda-contrasena" className="mt-1.5 block text-xs text-neutral-500">
                  Al menos 8 caracteres.
                </span>
              )}
            </label>
          )}

          {error && (
            <div className="rounded-md bg-danger-100 px-3 py-2 text-sm text-danger-500" role="alert">
              <p>{error}</p>
              {sinConfirmar && (
                <button
                  type="button"
                  onClick={reenviar}
                  disabled={enviando}
                  className="mt-1.5 font-semibold text-brand-700 underline hover:text-brand-800"
                >
                  Reenviar el correo de confirmación
                </button>
              )}
            </div>
          )}

          {modo === 'registrarse' && (
            <p className="text-xs leading-relaxed text-neutral-500">
              Al crear la cuenta aceptas el <Link to="/legal/aviso-legal" className="underline">aviso legal</Link> y la{' '}
              <Link to="/legal/privacidad" className="underline">política de privacidad</Link>. No te enviaremos
              publicidad.
            </p>
          )}

          <Button type="submit" tamano="lg" disabled={enviando} className="w-full">
            {enviando
              ? 'Un momento…'
              : modo === 'registrarse'
                ? 'Crear cuenta'
                : modo === 'olvido'
                  ? 'Enviarme el enlace'
                  : 'Entrar'}
          </Button>

          {modo === 'olvido' && (
            <button
              type="button"
              onClick={() => cambiarModo('entrar')}
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
            >
              Volver a entrar con mi contraseña
            </button>
          )}
        </form>
      </div>
    </div>
  )
}

function traducirError(mensaje: string): string {
  if (mensaje.includes('Invalid login credentials')) return 'El correo o la contraseña no son correctos.'
  if (mensaje.includes('Email not confirmed'))
    return 'Todavía no has confirmado tu correo. Abre el enlace del último correo que te enviamos.'
  if (mensaje.includes('User already registered')) return 'Ya hay una cuenta con ese correo. Prueba a entrar con ella.'
  if (mensaje.includes('Password should be at least')) return 'La contraseña debe tener al menos 8 caracteres.'
  if (mensaje.toLowerCase().includes('rate limit'))
    return 'Hemos enviado demasiados correos seguidos. Espera unos minutos y vuelve a intentarlo.'
  return mensaje
}

function leerErrorDelEnlace(): string | null {
  if (typeof window === 'undefined') return null
  const fragmento = new URLSearchParams(window.location.hash.slice(1))
  const codigo = fragmento.get('error_code')
  if (!codigo) return null
  if (codigo === 'otp_expired')
    return 'El enlace ha caducado o ya se usó. Escribe tu correo y te mandamos uno nuevo.'
  return 'No hemos podido confirmar tu cuenta con ese enlace. Escribe tu correo y te mandamos uno nuevo.'
}
