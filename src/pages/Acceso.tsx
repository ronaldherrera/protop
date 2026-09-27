import { useSearchParams } from 'react-router-dom'
import { PaginaProximamente } from '../components/layout/PaginaProximamente'

export function Acceso() {
  const [parametros] = useSearchParams()
  const esProfesional = parametros.get('rol') === 'profesional'

  return (
    <PaginaProximamente
      titulo={esProfesional ? 'Publica tu ficha en Protop' : 'Accede a tu cuenta'}
      descripcion={
        esProfesional
          ? 'El registro de profesionales (crear tu ficha, mostrar tus servicios y recibir contactos) es gratuito y llega en una fase posterior del proyecto.'
          : 'El acceso e inicio de sesión de particulares llega en una fase posterior del proyecto.'
      }
    />
  )
}
