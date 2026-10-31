import { type FormEvent, useState } from 'react'
import { usePedirBajaFicha } from '../../features/reclamaciones/queries'
import { Button } from '../ui/Button'
import { claseAreaTexto, claseCampo, claseEtiqueta } from '../ui/estilosFormulario'
import { Modal } from '../ui/Modal'

/** El negocio (o quien lo represente) pide que se borre una ficha creada por Protop. Sin cuenta. */
export function PedirBajaFicha({ profesionalId, nombre, onCerrar }: { profesionalId: string; nombre: string; onCerrar: () => void }) {
  const pedir = usePedirBajaFicha()
  const [contacto, setContacto] = useState('')
  const [motivo, setMotivo] = useState('')

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    pedir.mutate({ profesionalId, contacto, motivo })
  }

  return (
    <Modal titulo={`Borrar la ficha de ${nombre}`} onCerrar={onCerrar}>
      {pedir.isSuccess ? (
        <div>
          <p className="text-neutral-700">
            Recibido. Revisaremos la petición y borraremos la ficha. Si necesitamos comprobar algo, te escribiremos al
            contacto que nos has dejado.
          </p>
          <Button type="button" className="mt-5" onClick={onCerrar}>
            Cerrar
          </Button>
        </div>
      ) : (
        <form onSubmit={enviar} className="flex flex-col gap-4">
          <p className="text-sm text-neutral-600">
            Creamos esta ficha con los datos públicos del negocio. Si eres su responsable y no quieres aparecer en
            Protop, la borramos.
          </p>
          <label className="block">
            <span className={claseEtiqueta}>Tu email o teléfono</span>
            <input
              required
              minLength={3}
              maxLength={200}
              value={contacto}
              onChange={(evento) => setContacto(evento.target.value)}
              className={claseCampo}
            />
            <span className="mt-1.5 block text-xs text-neutral-500">Solo para confirmar la baja si hace falta.</span>
          </label>
          <label className="block">
            <span className={claseEtiqueta}>Motivo (opcional)</span>
            <textarea
              rows={3}
              maxLength={1000}
              value={motivo}
              onChange={(evento) => setMotivo(evento.target.value)}
              className={claseAreaTexto}
            />
          </label>
          {pedir.isError && (
            <p className="rounded-md bg-danger-100 px-3 py-2 text-sm text-danger-500" role="alert">
              No se ha podido enviar la petición. Inténtalo de nuevo.
            </p>
          )}
          <Button type="submit" disabled={pedir.isPending}>
            {pedir.isPending ? 'Enviando…' : 'Pedir que la borren'}
          </Button>
        </form>
      )}
    </Modal>
  )
}
