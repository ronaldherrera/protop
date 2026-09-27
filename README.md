# Protop

Directorio digital de profesionales de reformas, construcción y servicios para el hogar. Lanzamiento inicial en Santander y alrededores.

Estado actual: **Fase 2 — directorio y fichas profesionales conectados a Supabase**, con datos de demostración claramente etiquetados en el directorio y la ficha profesional.

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

```bash
supabase login                                              # una vez por máquina
supabase link --project-ref bydlbfsssfpcdaqprqgl            # vincula esta carpeta al proyecto
supabase db push                                             # aplica las migraciones pendientes
```

Tras cambiar el esquema, regenera los tipos TypeScript:

```bash
supabase gen types typescript --linked > src/types/database.ts
```

Tablas actuales: `categorias` y `zonas` (datos reales de referencia, editables desde el Table Editor de Supabase sin tocar código) y `profesionales` + `profesional_zonas` (de momento solo con datos de demostración, marcados con `es_demo = true`; el alta real de profesionales llega en la Fase 3). RLS activado en las cuatro tablas: lectura pública, ninguna escritura desde el cliente anónimo.

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
```

## Qué funciona ahora mismo

- Navegación completa (Home, Directorio, Ficha profesional, Solicitar presupuesto, Áreas privadas, Admin, Acceso) y responsive de móvil a escritorio.
- Buscador por oficio y localidad desde la Home, con filtros y estados de carga/"sin resultados"/error en el Directorio — todo leído en vivo desde Supabase (React Query + RLS).
- Ficha profesional con reputación, desglose por concepto y distintivos, tal como pide la sección 6 del documento de producto, servida desde la base de datos real.
- Categorías y zonas son datos reales de referencia en Supabase, administrables desde el Table Editor sin tocar código (sección 5 del documento).

## Qué depende de configuración pendiente

- **Despliegue real a Hostinger**: falta que añadas los secrets `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` en GitHub (ver arriba) y que vacíes `public_html` del WordPress actual.
- **Autenticación, facturas privadas y Stripe**: no se han tocado todavía — llegan en las fases 3 y siguientes.

## Decisiones comerciales todavía abiertas (documento de producto, sección 10)

No se han fijado y no se han inventado en la interfaz: precio por solicitud de presupuesto, número de propuestas comprometidas, plazo de respuesta, condiciones de devolución, y tarifas/duración de los anuncios patrocinados. Cuando se aborden las fases de pagos y patrocinados, esta configuración quedará preparada pero con los cobros reales desactivados hasta que se concreten.
