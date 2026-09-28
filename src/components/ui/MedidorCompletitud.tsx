export function MedidorCompletitud({ porcentaje }: { porcentaje: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-medium text-neutral-600">
        <span>Perfil completo</span>
        <span>{porcentaje}%</span>
      </div>
      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-neutral-200">
        <div
          className="h-full rounded-full bg-brand-500 transition-all"
          style={{ width: `${porcentaje}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-neutral-500">
        Cuanto más completo esté tu perfil, más visibilidad tendrás en el directorio.
      </p>
    </div>
  )
}
