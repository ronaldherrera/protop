# Protop

**El tablón de anuncios de los profesionales de reformas, en digital.** Un directorio de profesionales y empresas de reformas, construcción y servicios para el hogar de toda España, con fichas de cada profesional, solicitudes de presupuesto y valoraciones respaldadas por factura.

🌐 **[protop.es](https://protop.es)**

<!-- Añadir aquí 2–3 capturas: buscador, ficha de profesional y comparador de propuestas -->
<!-- ![Protop](docs/capturas/directorio.png) -->

| | |
| --- | --- |
| **1.219 fichas en toda España** | Generadas a partir de datos abiertos de OpenStreetMap y revisadas desde un panel de administración. |
| **~1.600 páginas prerenderizadas** | Una página por oficio y localidad (`/electricistas/madrid`) para posicionar en Google desde una SPA estática. |
| **Valoraciones que no se pueden inventar** | Cada valoración necesita una factura. Las facturas se guardan en un bucket privado al que solo acceden los administradores, con URLs firmadas de 5 minutos. Un trigger recalcula la reputación cuando se aprueba una valoración. |
| **Flujo completo de presupuestos** | Solicitud → propuestas de los profesionales que coinciden en oficio y zona → comparación. Las reglas de visibilidad se aplican en la base de datos con RLS, no solo en la interfaz. |

**Stack:** React 19 · TypeScript · Vite · Supabase (Postgres, RLS, Auth, Storage, Edge Functions) · GitHub Actions → Hostinger

Diseñado y desarrollado por **Ronald Herrera** · [ronaldherrera.es](https://ronaldherrera.es) · [LinkedIn](https://linkedin.com/in/ronald-sc-herrera)

---

## Stack y por qué

Protop.es está en un hosting **compartido** de Hostinger (sin Node.js persistente), así que la arquitectura es:

- **Frontend**: Vite + React + TypeScript, compilado como SPA estática (`dist/`) y servido directamente por Hostinger.
- **Backend**: [Supabase](https://supabase.com) (Postgres + Auth + Storage + Edge Functions) hace de servidor. Las reglas sensibles (permisos, aprobación de valoraciones, validación de pagos) viven ahí, no solo en el cliente.
- **Pagos** (fases posteriores): Stripe en modo test, validado siempre en servidor.
- **Despliegue**: GitHub Actions construye el proyecto en cada push a `main` y sube `dist/` a Hostinger por FTPS.

No hay servidor Node propio ni microservicios: no hacen falta con este hosting y esta escala.

## Desarrollo local

```bash
npm install
npm run dev
```

Variables de entorno: copia `.env.example` a `.env.local` y rellena con los valores de tu proyecto Supabase (Project Settings → API). El proyecto Supabase de Protop ya existe; pide la URL/clave al resto del equipo o consulta `.env.production` (la URL y la clave publicable no son secretas, van igualmente en el bundle del cliente).

```bash
npm run build     # compila a dist/
npm run lint       # oxlint
npm run preview    # sirve el build de producción en local
```

## Base de datos (Supabase)

El esquema vive como migraciones SQL en `supabase/migrations/`, versionadas en el repo. Para aplicar cambios:

Protop tiene su propia cuenta de Supabase (proyecto `uofnwnxpxsicotsxqgfu`, región eu-north-1), separada del resto de proyectos.

```bash
supabase link --project-ref uofnwnxpxsicotsxqgfu            # vincula esta carpeta al proyecto
supabase db push                                             # aplica las migraciones pendientes
```

La CLI debe autenticarse con la cuenta de Protop: un `SUPABASE_ACCESS_TOKEN` de esa cuenta o `supabase login` con ella.

Tras cambiar el esquema, regenera los tipos TypeScript:

```bash
supabase gen types typescript --linked > src/types/database.ts
```

Tablas: `familias` (5 grupos amplios: Reformas integrales, Instalaciones, Carpintería y cerramientos, Mantenimiento y exterior, Especialidades y otros) y `categorias` (22 oficios concretos, cada uno con `familia_id`), ambas con `icono_url` apuntando a `/iconos/*.svg`; `zonas`; `profesionales` + `profesional_zonas` + `profesional_categorias` (un profesional puede tener varios oficios, elegidos como chips; `profesionales.categoria_id` guarda el principal —el primero marcado— y `profesional_categorias` el conjunto completo, que es lo que decide qué solicitudes de presupuesto ve y puede responder) (mezcla de datos de demostración con `es_demo = true` y fichas reales creadas por usuarios registrados, vinculadas por `user_id`); y `perfiles` (1:1 con cada cuenta de `auth.users`, se crea sola vía trigger al registrarse). RLS: lectura pública de familias/categorías/zonas/profesionales publicados; cada usuario solo puede crear/editar su propia ficha profesional y su propio perfil — nunca los de otra cuenta ni desde un cliente anónimo.

Tabla `valoraciones`: cada fila es una puntuación estructurada (6 conceptos, 1-5 o "no aplica") con su factura adjunta, en estado `pendiente` / `aprobada` / `rechazada`. Un trigger (`recalcular_reputacion_profesional`) recalcula automáticamente `puntuacion_global`, `trabajos_valorados` y `desglose_por_concepto` del profesional cada vez que cambia el estado de una valoración — con precisión completa, el redondeo a un decimal es solo de presentación (sección 7). Solo cuentan las aprobadas.

Tablas `solicitudes`, `propuestas` y `aclaraciones` (secciones 8 y 9): una solicitud pasa por `borrador` → `pendiente_pago` → `abierta` → `cerrada`. Sin Stripe integrado todavía (Fase 6), el paso `pendiente_pago → abierta` lo hace manualmente una cuenta administradora desde `/admin` — no es un cobro real. Solo ven una solicitud `abierta` los profesionales cuya ficha coincide en categoría y zona (comprobado con usuarios de prueba reales: quien no coincide ni la ve ni puede proponer). Las aclaraciones son un hilo mínimo por solicitud, no una mensajería general.

Buckets de Storage:
- `fotos-profesionales` (público en lectura): cada usuario solo sube/borra en su propia carpeta (`{user_id}/...`).
- `facturas` (**privado**, sin URL pública permanente): cada usuario solo sube en su propia carpeta; solo las cuentas con `perfiles.es_admin = true` pueden leer, y siempre mediante una URL firmada de 5 minutos (`createSignedUrl`), nunca una URL pública permanente. Límite de 8 MB y solo imagen/PDF, aplicado por el propio bucket.
- `solicitudes-fotos` (**privado**): el dueño sube a su propia carpeta; puede leerlas el propio dueño, cualquier cuenta con ficha profesional (el filtrado real por categoría/zona ya ocurre al decidir qué solicitudes ve cada profesional) y administración. URLs firmadas de 1 hora.

Para convertir una cuenta en administradora (no hay alta de administradores desde la interfaz todavía): `update perfiles set es_admin = true where id = '<uuid del usuario>';` desde el SQL Editor de Supabase.

Tablas `trabajos_publicados` y `trabajo_comentarios`: un portfolio del profesional, **totalmente separado** del sistema de valoraciones — sin factura, sin revisión de administración, no afecta a `puntuacion_global`. El profesional publica un trabajo y, si quiere, vincula al cliente real mediante la función `vincular_cliente_trabajo(trabajo_id, email)` (RPC `SECURITY DEFINER`: busca la cuenta por correo en `auth.users`, que no es consultable directamente desde el cliente, y solo expone si existe o no). El cliente vinculado puede dejar un comentario público, opcional y único por trabajo.

## Despliegue a Hostinger

El workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) construye la app y la sube por FTPS en cada push a `main`. Antes del primer despliegue:

1. **Vaciar `public_html`** (o la carpeta del dominio protop.es) desde hPanel → Administrador de archivos. Actualmente tiene un WordPress que hay que retirar antes de subir la SPA. Haz una copia de seguridad si te interesa conservar algo.
2. **Crear/consultar una cuenta FTP** en hPanel → Archivos → Cuentas FTP.
3. En GitHub, en el repo → Settings → Secrets and variables → Actions, añade:
   - `FTP_SERVER` (host FTP, normalmente algo como `ftp.protop.es` o la IP que indique Hostinger)
   - `FTP_USERNAME`
   - `FTP_PASSWORD`
   - `FTP_SERVER_DIR` (opcional; solo si necesitas apuntar a una subcarpeta distinta de la raíz FTP, p. ej. `./public_html/` — depende de cómo esté montado el dominio en tu cuenta)
4. Haz push a `main` (o lanza el workflow manualmente desde la pestaña Actions) y comprueba que protop.es carga la SPA sin dar 404 al refrescar rutas internas (el `.htaccess` en `public/` se encarga de eso).

## Estructura

```
src/
  app/          router y layout general
  pages/        una por ruta
  components/   ui/ (primitivas), layout/, estado/, directorio/
  features/     lógica de negocio por dominio (directorio/ por ahora)
  lib/          acceso a datos y configuración (cliente Supabase, env)
  types/
public/
  iconos/       logo real, icono de marca (favicon) e iconos de familias/categorías (SVG)
```

## Identidad de marca

Logo, tipografía (Montserrat para encabezados, Roboto para texto) y paleta (`--color-brand-*` naranja #D45A1B, `--color-accent-*` verde grisáceo #717E76, `--color-ink` gris oscuro #333334, `--color-cream` blanco roto #F7F3EA) definidos en `src/index.css`. El logo real vive en `public/iconos/logotipo.svg` (claro) y `logotipo-negativo.svg` (para fondos oscuros, como el pie de página); el icono de marca (favicon/PWA) es `public/iconos/icono-protop-color.svg`.

## Qué funciona ahora mismo

- Navegación completa (Home, Directorio, Ficha profesional, Solicitar presupuesto, Áreas privadas, Admin, Acceso) y responsive de móvil a escritorio.
- Buscador por oficio y localidad desde la Home, con filtros y estados de carga/"sin resultados"/error en el Directorio — todo leído en vivo desde Supabase (React Query + RLS).
- Ficha profesional con reputación, desglose por concepto y distintivos, tal como pide la sección 6 del documento de producto, servida desde la base de datos real.
- Categorías y zonas son datos reales de referencia en Supabase, administrables desde el Table Editor sin tocar código (sección 5 del documento).
- **Registro e inicio de sesión reales** (email/contraseña vía Supabase Auth, con confirmación por correo). Una misma cuenta sirve tanto de particular como de profesional — no hace falta registrarse dos veces (sección 12).
- **Área del profesional**: crear y editar la propia ficha (datos, especialidades, zonas, contacto, foto de perfil y fotos de trabajos con subida real a Supabase Storage). Solo el dueño de la cuenta puede editar su ficha; se aplica por RLS en el servidor, no solo en la interfaz.
- **Área del particular**: edición de datos básicos de la cuenta (nombre, teléfono).
- Rutas `/particular` y `/profesional` protegidas: redirigen a `/acceso` si no hay sesión iniciada.
- **Valorar un trabajo**: desde la ficha pública de un profesional real (no de demostración), cualquier cuenta puede puntuar los 6 conceptos estructurados (sin comentarios libres) y adjuntar la factura. Queda pendiente de revisión y no cuenta para la puntuación hasta que se apruebe.
- **Consola de administración** (`/admin`, solo cuentas con `es_admin = true`): cola de valoraciones pendientes con acceso a la factura vía URL firmada, y aprobar/rechazar con motivo. La reputación del profesional se recalcula sola. También muestra, aparte, las solicitudes pendientes de pago para abrirlas manualmente.
- **Área del particular**: además de los datos básicos, ahora muestra "Mis valoraciones" y "Mis solicitudes de presupuesto" (con enlace a crear una nueva y al detalle/comparación de cada una).
- **Solicitar presupuesto** (`/solicitar-presupuesto`, requiere cuenta): formulario por pasos (qué necesitas → dónde y cuándo, con fotos opcionales → repaso) que guarda un borrador. Desde el detalle de la solicitud, el particular la envía a pago, ve las propuestas recibidas en formato comparable (alcance, importe, materiales, exclusiones, plazo, estimación vs. confirmado…) y puede cerrarla.
- **Área del profesional**: además de la ficha, ahora muestra "Solicitudes disponibles" en su categoría y zona; desde el detalle de cada una puede enviar su propuesta (una por solicitud) o ver la que ya envió.
- **Aclaraciones**: hilo de preguntas/respuestas dentro de cada solicitud, visible solo para el particular y los profesionales que han enviado propuesta ahí.
- **Trabajos publicados**: portfolio del profesional (título, descripción, fotos, fecha) en su perfil público. Puede vincular al cliente real por email; ese cliente ve el trabajo en su área particular y puede dejar un comentario opcional, público, sin pasar por revisión — independiente de la reputación oficial.

## Qué depende de configuración pendiente

- **Despliegue real a Hostinger**: falta que añadas los secrets `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` en GitHub (ver arriba) y que vacíes `public_html` del WordPress actual.
- **Nadie es administrador todavía por defecto**: hay que marcar manualmente `es_admin = true` en Supabase para cada cuenta que deba serlo (ver arriba).
- **Pagos reales (Stripe)**: no integrados todavía — llegan en la Fase 6. Hasta entonces, abrir una solicitud pendiente de pago es una acción manual de administración, sin cobro real.
- El correo de confirmación de registro usa la plantilla y el remitente por defecto de Supabase (sin marca de Protop todavía); para producción conviene personalizarlo desde el dashboard de Supabase (Authentication → Email Templates).

## Decisiones comerciales todavía abiertas (documento de producto, sección 10)

No se han fijado y no se han inventado en la interfaz: precio por solicitud de presupuesto, número de propuestas comprometidas, plazo de respuesta, condiciones de devolución, y tarifas/duración de los anuncios patrocinados. Cuando se aborden las fases de pagos y patrocinados, esta configuración quedará preparada pero con los cobros reales desactivados hasta que se concreten.
