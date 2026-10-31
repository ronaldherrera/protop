# Pendientes de Protop

Lo que falta por hacer fuera del código (cuentas, paneles, datos) o que necesita una decisión. Marca cada punto
cuando esté hecho.

## Antes de publicar la web nueva

- [ ] **Aplicar las migraciones pendientes** en la base de datos, desde `protop-web`: `supabase db push`
  - `20261025200000_zonas_lanzamiento_por_slug.sql`: Santander y los otros 5 municipios de lanzamiento vuelven a Cantabria.
  - `20261025210000_resumen_solicitudes_abiertas.sql`: contador público de trabajos abiertos.
  - `20261025220000_solicitudes_gratis_y_plan_destacado.sql`: solicitudes gratis, tablas y precios del Plan Destacado.
  - `20261025230000_fichas_sin_reclamar.sql`: fichas creadas por Protop, reclamaciones y bajas. **Arregla además un
    fallo de seguridad** (el dueño de una ficha podía cambiar su propia puntuación).
- [x] **Datos del titular** en `src/features/legal/titular.ts`: nombre y email puestos, igual que en Tankily.
- [ ] **NIF y domicilio** en ese mismo archivo **cuando Protop empiece a facturar** (Plan Destacado o publicidad): la
  LSSI exige publicarlos. Vacíos no se muestran; vale un domicilio profesional u oficina virtual.

## Negocios de OpenStreetMap (Cantabria y resto de España)

- [x] Migraciones `negocios_candidatos` y `buscar_profesionales` aplicadas; directorio paginado en la base.
- [x] Cantabria: 80 fichas publicadas (26-27 oct 2026).
- [x] Resto de España, islas incluidas: 1.139 fichas publicadas el 28 oct 2026 (1.219 en total).
- [ ] **Revisar los 508 negocios pendientes** en «Negocios por revisar» del panel (se muestran de 50 en 50).
- [ ] **Avisar a cada negocio publicado en el plazo de un mes** (RGPD, artículo 14): quién somos, de dónde salen
  sus datos y que puede reclamar o borrar la ficha. Plazo: Cantabria hacia el 26 nov 2026, el resto hacia el
  28 nov 2026. Hay una plantilla en «Dar de alta un negocio».
- [x] **Textos «Santander y alrededores»** cambiados a toda España (28 oct 2026). Las guías del blog sobre
  Cantabria se quedan como guías locales.

## Páginas por oficio, visitas y Plan Destacado (28 oct 2026)

- [ ] **Aplicar la migración** `20261028210000_visitas_e_interes_destacado.sql` (`supabase db push`): contadores de
  visitas y contactos de cada ficha y lista de interés del Plan Destacado. Sin ella la web funciona igual, pero no
  cuenta visitas ni guarda a quien se apunta (el formulario ofrece escribir por email).
- [ ] **Desplegar** y comprobar en el móvil `/electricistas`, `/fontaneros/cataluna`, una ficha y `/para-profesionales`.
- [ ] **Search Console**: volver a enviar el sitemap (ahora tiene unas 1.600 URL: páginas de oficio y fichas).
- [ ] **Stripe** para cobrar el Plan Destacado. Cuando esté, escribir a la lista que se apunte (Administración →
  Lista del Plan Destacado).
- [ ] Revisar la línea nueva de la política de privacidad sobre la lista del Plan Destacado y los contadores de visitas.

## Guías y Google

- [ ] **Tras el despliegue, comprobar el HTML estático**: abre `https://protop.es/blog/humedades-en-casa-cantabria` y
  mira el código fuente (Ctrl+U): debe verse el texto de la guía, no solo `<div id="root"></div>`. Si sale vacío, el
  hosting no está aplicando el `.htaccess` nuevo.
- [ ] **Search Console**: enviar `https://protop.es/sitemap.xml` y pedir la indexación de `/blog` y de las 8 guías nuevas.
- [ ] **Prueba de resultados enriquecidos** de Google con una guía: debe detectar artículo, preguntas frecuentes y
  ruta de navegación.

## Correo propio (como en Tankily)

El correo que trae Supabase solo permite unos 2 envíos por hora y suele acabar en spam. Con un buzón propio los
correos de la cuenta (confirmar, contraseña nueva…) llegan bien y con la marca.

1. [x] **Buzón** `contacto@protop.es` en Hostinger (25/10/2026).
2. [x] **DNS del correo** comprobado el 25/10/2026: MX de Hostinger, SPF, DKIM (hostingermail-a y -b) y DMARC.
3. [x] **SMTP en Supabase** (25/10/2026): `smtp.hostinger.com:465`, remitente «Protop <contacto@protop.es>».
4. [x] **Plantillas con la marca activadas** (25/10/2026): icono animado (la chincheta clava la tarjeta), «protop»,
   texto de vista previa y enlace de reserva. Las imágenes están en el almacenamiento público de Supabase
   (`fotos-profesionales/marca/`). Para cambiar un texto: edita `supabase/plantillas/textos.json`, ejecuta
   `node scripts/generar-plantillas-email.mjs` y pídeme que las vuelva a aplicar.
   - [ ] **Después de publicar la web**: regenerarlas con `--enlace-propio` para que los botones lleven a
     `protop.es/verificar` en lugar de a supabase.co (menos sospechoso para Gmail) y volver a aplicarlas.
5. [x] **Límite de envíos**: 30 correos por hora (lo puso Supabase al activar el SMTP). Subirlo cuando haya volumen, sin
   pasar del límite diario del plan de correo de Hostinger (hPanel → Correos).
6. [ ] **Foto de Protop en Gmail** (la que sale junto al remitente). Ahora sale la de tu cuenta personal porque
   `contacto@protop.es` está añadida en ella como dirección alternativa. Para que salga el icono de Protop:
   quitarla de tu cuenta personal y crear una cuenta de Google propia con ella (accounts.google.com → Crear cuenta →
   «Usar mi dirección de correo electrónico actual»), con `public/icono-512.png` como foto. Google no admite fotos
   animadas: la animación va dentro del correo.

## Fichas creadas por Protop

- [ ] Al crear cada ficha, enviar al negocio el **aviso del RGPD (art. 14)** antes de un mes: la administración lo
  muestra ya redactado tras crearla («Enviarlo desde mi correo» o «Copiar el aviso»).
- [ ] Consultar con un abogado de protección de datos antes de dar de alta negocios en cantidad.

## Publicidad (Google AdSense)

- [ ] En AdSense (la cuenta de Tankily vale): añadir el sitio `protop.es` y crear un bloque de anuncios «display».
- [ ] En GitHub → repo `protop` → Settings → Secrets and variables → Actions → **Variables**: `VITE_ADSENSE_CLIENT`
  (`ca-pub-…`) y `VITE_ADSENSE_SLOT`. El siguiente despliegue genera `ads.txt`.
- [ ] Cuando aprueben el sitio: AdSense → Privacidad y mensajes → mensaje de consentimiento para Europa, y la variable
  `VITE_ADSENSE_CMP` = `1`.
- [ ] AdSense → Bloquear controles: bloquear a la competencia (Habitissimo, Cronoshare, Fixxer…).

## Plan Destacado (preparado, apagado)

- [ ] Cuenta de Stripe para Protop (puede ser la de Tankily) para conectar el cobro automático.
- [ ] Fijar los precios por oficio en Administración → Precios del Plan Destacado cuando haya profesionales y visitas.
