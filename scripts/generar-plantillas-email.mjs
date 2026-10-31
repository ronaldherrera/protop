// Genera las plantillas de los correos de la cuenta (Supabase Auth) en supabase/plantillas/*.html
// a partir de supabase/plantillas/textos.json, con la marca de Protop (igual que en Tankily).
// Uso: node scripts/generar-plantillas-email.mjs                 → botones con el enlace estándar de Supabase
//      node scripts/generar-plantillas-email.mjs --enlace-propio  → botones a protop.es/verificar (con la web publicada)
import fs from 'node:fs'
import path from 'node:path'

const DIR = path.join(process.cwd(), 'supabase', 'plantillas')
const textos = JSON.parse(fs.readFileSync(path.join(DIR, 'textos.json'), 'utf8'))
const SITIO = 'https://protop.es'
// Imágenes en el almacenamiento público de Supabase: se ven aunque la web aún no esté publicada.
const IMAGENES = 'https://uofnwnxpxsicotsxqgfu.supabase.co/storage/v1/object/public/fotos-profesionales/marca'
const TIPOS = ['confirmacion', 'recuperacion', 'enlace', 'cambio_email']
const ENLACE_PROPIO = process.argv.includes('--enlace-propio')

// Colores de la marca en versión clara: los clientes de correo no respetan bien el modo oscuro.
const C = {
  fondo: '#fbfaf8',
  tarjeta: '#ffffff',
  linea: '#ebe8e3',
  tinta: '#2e2f30',
  texto: '#575a5c',
  suave: '#6b6f71',
  naranja: '#d45a1b',
  boton: '#b84a12',
}

// Con la web publicada, el botón lleva a protop.es (no a supabase.co): un enlace a otro dominio que el del
// remitente es lo que más hace sospechar a Gmail y Outlook. La página /verificar completa la acción.
const TIPO_OTP = { confirmacion: 'email', recuperacion: 'recovery', enlace: 'email', cambio_email: 'email_change' }
const enlace = (tipo) =>
  ENLACE_PROPIO ? `${SITIO}/verificar?token_hash={{ .TokenHash }}&type=${TIPO_OTP[tipo]}` : '{{ .ConfirmationURL }}'

function plantilla(tipo) {
  const t = textos[tipo]
  const url = enlace(tipo)
  return `<!doctype html>
<!-- Generado por scripts/generar-plantillas-email.mjs: edita textos.json y vuelve a generarlo -->
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${t.asunto}</title></head>
<body style="margin:0;padding:0;background:${C.fondo};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${t.previa}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.fondo};padding:32px 16px;">
<tr><td align="center">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">
    <tr><td style="padding:0 8px 18px;">
      <a href="${SITIO}" style="text-decoration:none;">
        <table role="presentation" cellpadding="0" cellspacing="0"><tr>
          <td style="padding-right:10px;"><img src="${IMAGENES}/icono-animado.gif" width="48" height="48" alt="" style="display:block;border:0;border-radius:11px;"></td>
          <td style="font-size:26px;font-weight:800;letter-spacing:-0.5px;line-height:1;"><span style="color:${C.tinta};">pro</span><span style="color:${C.naranja};">top</span></td>
        </tr></table>
      </a>
    </td></tr>
    <tr><td style="background:${C.tarjeta};border:1px solid ${C.linea};border-radius:18px;padding:32px 28px;border-top:4px solid ${C.naranja};">
      <h1 style="margin:0 0 12px;font-size:22px;line-height:1.25;color:${C.tinta};font-weight:700;">${t.titulo}</h1>
      <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:${C.texto};">${t.texto}</p>
      <p style="margin:0 0 28px;"><a href="${url}" style="display:inline-block;padding:13px 24px;border-radius:999px;background:${C.boton};color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;">${t.boton}</a></p>
      <p style="margin:0 0 6px;font-size:12px;line-height:1.5;color:${C.suave};">${textos.comun.reserva}</p>
      <p style="margin:0 0 22px;font-size:12px;line-height:1.5;word-break:break-all;"><a href="${url}" style="color:${C.boton};">${url}</a></p>
      <p style="margin:0;padding-top:16px;border-top:1px dashed ${C.linea};font-size:13px;line-height:1.5;color:${C.suave};">${textos.comun.pie}</p>
    </td></tr>
    <tr><td style="padding:16px 8px 0;font-size:12px;line-height:1.6;color:${C.suave};text-align:center;">
      Protop · ${textos.comun.lema}<br>
      <a href="mailto:${textos.comun.contacto}" style="color:${C.suave};">${textos.comun.contacto}</a> · <a href="${SITIO}/legal/privacidad" style="color:${C.suave};">Privacidad</a>
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>
`
}

for (const tipo of TIPOS) fs.writeFileSync(path.join(DIR, `${tipo}.html`), plantilla(tipo))
console.log(`Plantillas generadas en supabase/plantillas/ (${ENLACE_PROPIO ? 'enlaces a protop.es/verificar' : 'enlace estándar de Supabase'}). Asuntos:`)
for (const tipo of TIPOS) console.log(`  ${tipo}: ${textos[tipo].asunto}`)
