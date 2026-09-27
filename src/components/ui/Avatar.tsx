function iniciales(nombre: string): string {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((palabra) => palabra[0]?.toUpperCase())
    .join('')
}

export function Avatar({ nombre, fotoUrl, className }: { nombre: string; fotoUrl?: string; className?: string }) {
  if (fotoUrl) {
    return (
      <img
        src={fotoUrl}
        alt={`Logotipo de ${nombre}`}
        className={className ?? 'h-14 w-14 rounded-xl object-cover'}
      />
    )
  }

  return (
    <div
      className={
        className ??
        'flex h-14 w-14 items-center justify-center rounded-xl bg-brand-100 text-lg font-semibold text-brand-700'
      }
      aria-hidden="true"
    >
      {iniciales(nombre)}
    </div>
  )
}
