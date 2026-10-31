// Titular de Protop para el aviso legal y la política de privacidad (LSSI art. 10, RGPD art. 13).
// Igual que en Tankily: NIF y domicilio vacíos = no se muestran. Al empezar a facturar (Plan Destacado,
// publicidad) la LSSI exige publicarlos: basta con rellenarlos aquí (vale un domicilio profesional u oficina virtual).
export const TITULAR = {
  nombre: 'Ronald Simon Calzadilla Herrera',
  nif: '',
  domicilio: '',
  email: 'contacto@protop.es',
  /** Solo si algún día es una sociedad: datos registrales. */
  registroMercantil: '',
}

export const SITIO = 'protop.es'
export const ULTIMA_ACTUALIZACION = '25 de octubre de 2026'

/** «Nombre (NIF), domicilio», sin lo que esté vacío. */
export function identidadTitular(): string {
  return [TITULAR.nombre + (TITULAR.nif ? ` (NIF ${TITULAR.nif})` : ''), TITULAR.domicilio].filter(Boolean).join(', ')
}
