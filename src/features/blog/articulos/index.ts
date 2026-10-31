import type { ComponentType } from 'react'
import { AireAcondicionadoOBombaDeCalor } from './AireAcondicionadoOBombaDeCalor'
import { AislarCasaDelFrio } from './AislarCasaDelFrio'
import { BoletinElectrico } from './BoletinElectrico'
import { CambiarBaneraPorPlatoDeDucha } from './CambiarBaneraPorPlatoDeDucha'
import { CambiarPuertasDeInterior } from './CambiarPuertasDeInterior'
import { CerrarLaTerraza } from './CerrarLaTerraza'
import { ComoCompararPresupuestos } from './ComoCompararPresupuestos'
import { ComoOrganizarUnaReformaIntegral } from './ComoOrganizarUnaReformaIntegral'
import { CuandoLlamarAUnElectricista } from './CuandoLlamarAUnElectricista'
import { CuantoCuestaCambiarVentanas } from './CuantoCuestaCambiarVentanas'
import { CuantoCuestaPintarUnPiso } from './CuantoCuestaPintarUnPiso'
import { CuantoCuestaReformarUnaCocina } from './CuantoCuestaReformarUnaCocina'
import { CuantoCuestaReformarUnBano } from './CuantoCuestaReformarUnBano'
import { CuantoCuestaUnElectricista } from './CuantoCuestaUnElectricista'
import { CuantoCuestaUnFontanero } from './CuantoCuestaUnFontanero'
import { GoterasEnElTejado } from './GoterasEnElTejado'
import { HumedadesEnCasa } from './HumedadesEnCasa'
import { PersianasQueNoSuben } from './PersianasQueNoSuben'
import { PintarFachadaCostera } from './PintarFachadaCostera'
import { PlacasSolaresCantabria } from './PlacasSolaresCantabria'
import { PladurEnCasa } from './PladurEnCasa'
import { QueSueloPoner } from './QueSueloPoner'
import { RevisionCalderaGas } from './RevisionCalderaGas'
import { TirarUnTabique } from './TirarUnTabique'
import { UrgenciasEnCasa } from './UrgenciasEnCasa'

export const ARTICULOS: Record<string, ComponentType> = {
  'humedades-en-casa-cantabria': HumedadesEnCasa,
  'cuanto-cuesta-reformar-un-bano': CuantoCuestaReformarUnBano,
  'boletin-electrico-cie': BoletinElectrico,
  'revision-caldera-de-gas': RevisionCalderaGas,
  'cambiar-banera-por-plato-de-ducha': CambiarBaneraPorPlatoDeDucha,
  'como-comparar-presupuestos-de-reforma': ComoCompararPresupuestos,
  'pintar-fachada-zona-costera-cantabria': PintarFachadaCostera,
  'cuanto-cuesta-reformar-una-cocina': CuantoCuestaReformarUnaCocina,
  'cuanto-cuesta-un-fontanero': CuantoCuestaUnFontanero,
  'cuando-llamar-a-un-electricista': CuandoLlamarAUnElectricista,
  'aire-acondicionado-o-bomba-de-calor': AireAcondicionadoOBombaDeCalor,
  'cuanto-cuesta-pintar-un-piso': CuantoCuestaPintarUnPiso,
  'como-organizar-una-reforma-integral': ComoOrganizarUnaReformaIntegral,
  'cuanto-cuesta-cambiar-ventanas': CuantoCuestaCambiarVentanas,
  'placas-solares-cantabria': PlacasSolaresCantabria,
  'aislar-casa-del-frio': AislarCasaDelFrio,
  'que-suelo-poner-en-casa': QueSueloPoner,
  'pladur-en-casa': PladurEnCasa,
  'urgencias-en-casa': UrgenciasEnCasa,
  'persianas-que-no-suben': PersianasQueNoSuben,
  'cerrar-la-terraza': CerrarLaTerraza,
  'tirar-un-tabique': TirarUnTabique,
  'goteras-en-el-tejado': GoterasEnElTejado,
  'cuanto-cuesta-un-electricista': CuantoCuestaUnElectricista,
  'cambiar-puertas-de-interior': CambiarPuertasDeInterior,
}
