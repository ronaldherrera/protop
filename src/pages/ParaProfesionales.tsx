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
      <section className="relative overflow-hidden border-b border-neutral-200 bg-brand-50">
        <img
          src="/fotos/profesional-autonomo.webp"
          alt="Equipo de profesionales de reformas sonriendo con sus herramientas en una vivienda en obras"
          className="absolute inset-0 h-full w-full object-cover object-[65%_25%]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-50 from-15% via-brand-50/60 via-50% to-brand-50/0" />

        <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-xl">
            <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
              Encuentra trabajo cerca de ti — y quédate con el 100%
            </h1>
            <p className="mt-3 text-neutral-700">
              Protop conecta a particulares con profesionales de reformas y hogar en su zona. Publica tu ficha,
              responde a solicitudes reales y cobra el 100% de lo que factures.
            </p>
            <Button type="button" tamano="lg" className="mt-6" onClick={registrarse}>
              Publicar mi ficha gratis
            </Button>
          </div>
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
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <img
            src="/fotos/herramientas-flatlay.webp"
            alt="Herramientas de profesionales de reformas y mantenimiento del hogar"
            className="aspect-square w-full rounded-2xl object-cover shadow-sm"
            loading="lazy"
          />
          <div className="flex flex-col gap-6">
            {PASOS.map(({ Icono, titulo, texto }, indice) => (
              <div key={titulo} className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
                  {indice + 1}
                </span>
                <div>
                  <h3 className="flex items-center gap-2 font-medium text-neutral-900">
                    <Icono className="h-4 w-4 text-brand-500" aria-hidden="true" />
                    {titulo}
                  </h3>
                  <p className="mt-1 text-sm text-neutral-600">{texto}</p>
                </div>
              </div>
            ))}
          </div>
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
