import { useState } from 'react'

export type Modo = 'particular' | 'profesional'

const CLAVE_ALMACENAMIENTO = 'protop_modo'

function leerModoGuardado(): Modo {
  try {
    return localStorage.getItem(CLAVE_ALMACENAMIENTO) === 'profesional' ? 'profesional' : 'particular'
  } catch {
    return 'particular'
  }
}

export function useModo() {
  const [modo, setModoInterno] = useState<Modo>(leerModoGuardado)

  function setModo(nuevo: Modo) {
    setModoInterno(nuevo)
    try {
      localStorage.setItem(CLAVE_ALMACENAMIENTO, nuevo)
    } catch {
      // localStorage puede no estar disponible (navegación privada); no es crítico.
    }
  }

  return { modo, setModo }
}
