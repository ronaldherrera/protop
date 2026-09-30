import { CheckCircle2, ClipboardList, FileEdit, Percent, Star, Wallet } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'

const VENTAJAS = [
  {
    Icono: Percent,
    titulo: 'Sin comisión por el trabajo',
    texto: 'Lo que cobras es tuyo, el 100%. No nos llevamos un porcentaje de cada trabajo que consigues.',
  },
  {
    Icono: CheckCircle2,
    titulo: 'Gratis de verdad',
    texto: 'Publicar tu ficha, responder solicitudes y enviar presupuestos no cuesta nada, sin letra pequeña.',
  },
  {
    Icono: Star,
    titulo: 'Reputación de trabajos reales',
    texto: 'Tu puntuación sale de valoraciones con factura revisadas por Protop, no de cuánto pagues por destacar.',
  },
]

const PASOS = [
  { Icono: FileEdit, titulo: 'Publica tu ficha', texto: 'Tu oficio, tus zonas y tus trabajos reales. Lleva unos minutos.' },
  { Icono: ClipboardList, titulo: 'Responde solicitudes', texto: 'Verás las que encajan con tu oficio y tu zona, o explora todas.' },
  { Icono: Wallet, titulo: 'Cobra el 100%', texto: 'Acuerdas el trabajo directamente con el cliente, sin intermediarios.' },
]

export function ParaProfesionales() {
  const navigate = useNavigate()

  function registrarse() {
    navigate('/acceso?rol=profesional')
  }

  return (
    <div>
      <section className="border-b border-neutral-200 bg-brand-50">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">Encuentra trabajo cerca de ti, sin comisión</h1>
          <p className="mx-auto mt-3 max-w-xl text-neutral-600">
            Protop conecta a particulares de Santander con profesionales de reformas y hogar. Publica tu ficha,
            responde a solicitudes reales y cobra el 100% de lo que factures.
          </p>
          <Button type="button" tamano="lg" className="mt-6" onClick={registrarse}>
            Publicar mi ficha gratis
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {VENTAJAS.map(({ Icono, titulo, texto }) => (
            <div key={titulo} className="rounded-xl border border-neutral-200 bg-white p-5">
              <Icono className="h-6 w-6 text-brand-500" aria-hidden="true" />
              <h2 className="mt-3 font-semibold text-neutral-900">{titulo}</h2>
              <p className="mt-1 text-sm text-neutral-600">{texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h2 className="text-xl font-semibold text-neutral-900">Cómo funciona</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {PASOS.map(({ Icono, titulo, texto }, indice) => (
            <div key={titulo} className="flex flex-col items-start gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
                  {indice + 1}
                </span>
                <Icono className="h-5 w-5 text-brand-500" aria-hidden="true" />
              </div>
              <h3 className="font-medium text-neutral-900">{titulo}</h3>
              <p className="text-sm text-neutral-600">{texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6">
        <Button type="button" tamano="lg" onClick={registrarse}>
          Publicar mi ficha gratis
        </Button>
        <p className="mt-2 text-xs text-neutral-500">¿Ya tienes cuenta? Entra desde el mismo botón.</p>
      </section>
    </div>
  )
}
