-- Modelo de negocio (25/10/2026): pedir presupuestos es gratis para los particulares y los
-- ingresos vienen del Plan Destacado (suscripción mensual por oficio) y de la publicidad.

-- 1. Solicitudes gratis: el particular publica su borrador directamente (borrador → abierta).
--    El estado 'pendiente_pago' se conserva en el check por el historial, pero ya no se usa.
drop policy "El particular edita su borrador o lo envia a pago" on solicitudes;
create policy "El particular edita su borrador o lo publica" on solicitudes
  for update using (particular_id = auth.uid() and estado = 'borrador')
  with check (particular_id = auth.uid() and estado in ('borrador', 'abierta'));

update solicitudes set estado = 'abierta' where estado = 'pendiente_pago';

-- 2. Precio del Plan Destacado por oficio. Sin fila (o inactiva) = no se puede contratar en ese oficio.
create table precios_destacado (
  categoria_id uuid primary key references categorias (id) on delete cascade,
  precio_mensual_centimos integer not null check (precio_mensual_centimos > 0),
  stripe_price_id text,
  activo boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table precios_destacado enable row level security;

create policy "Cualquiera ve los precios activos" on precios_destacado
  for select using (activo or public.es_admin_actual());
create policy "Administracion gestiona los precios" on precios_destacado
  for all using (public.es_admin_actual()) with check (public.es_admin_actual());

-- 3. Suscripciones: las escribe solo el webhook de Stripe (service_role). El profesional ve las suyas.
create table suscripciones_destacado (
  id uuid primary key default gen_random_uuid(),
  profesional_id uuid not null references profesionales (id) on delete cascade,
  categoria_id uuid not null references categorias (id),
  estado text not null check (estado in ('pendiente', 'activa', 'impagada', 'cancelada')),
  stripe_subscription_id text unique,
  stripe_customer_id text,
  activa_hasta timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index suscripciones_destacado_una_activa_idx
  on suscripciones_destacado (profesional_id, categoria_id) where estado in ('activa', 'pendiente');
create index suscripciones_destacado_categoria_idx on suscripciones_destacado (categoria_id) where estado = 'activa';

alter table suscripciones_destacado enable row level security;

create policy "El profesional ve sus suscripciones" on suscripciones_destacado
  for select using (exists (select 1 from profesionales p where p.id = profesional_id and p.user_id = auth.uid()));
create policy "Administracion ve todas las suscripciones" on suscripciones_destacado
  for select using (public.es_admin_actual());

-- 4. En qué oficios sale destacado cada profesional (solo el slug: es lo que ya se ve en público
--    como «Patrocinado»). Ni importes ni datos de Stripe.
create or replace function public.oficios_destacados()
returns table (profesional_id uuid, categoria_slug text)
language sql
stable
security definer
set search_path = public
as $$
  select s.profesional_id, c.slug
  from suscripciones_destacado s
  join categorias c on c.id = s.categoria_id
  where s.estado = 'activa' and (s.activa_hasta is null or s.activa_hasta > now())
$$;

revoke all on function public.oficios_destacados() from public;
grant execute on function public.oficios_destacados() to anon, authenticated;
