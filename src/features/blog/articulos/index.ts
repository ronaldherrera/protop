import type { ComponentType } from 'react'
import { AireAcondicionadoOBombaDeCalor } from './AireAcondicionadoOBombaDeCalor'
import { ComoOrganizarUnaReformaIntegral } from './ComoOrganizarUnaReformaIntegral'
import { CuandoLlamarAUnElectricista } from './CuandoLlamarAUnElectricista'
import { CuantoCuestaPintarUnPiso } from './CuantoCuestaPintarUnPiso'
import { CuantoCuestaUnFontanero } from './CuantoCuestaUnFontanero'

export const ARTICULOS: Record<string, ComponentType> = {
  'cuanto-cuesta-un-fontanero': CuantoCuestaUnFontanero,
  'cuando-llamar-a-un-electricista': CuandoLlamarAUnElectricista,
  'aire-acondicionado-o-bomba-de-calor': AireAcondicionadoOBombaDeCalor,
  'cuanto-cuesta-pintar-un-piso': CuantoCuestaPintarUnPiso,
  'como-organizar-una-reforma-integral': ComoOrganizarUnaReformaIntegral,
}
