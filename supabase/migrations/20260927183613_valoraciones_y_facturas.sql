-- Fase 4: facturas privadas, revisión administrativa y valoraciones.
--
-- Sin sistema de solicitudes todavía (Fase 5), así que el trabajo se acredita
-- vía "contacto directo gratuito" (sección 7 del documento de producto): el
-- particular sube una factura y puntúa conceptos estructurados; solo cuenta
-- para la reputación del profesional cuando un administrador la aprueba.

-- La puntuación se guarda con precisión completa; el redondeo es solo de
-- presentación en la interfaz (sección 7).
alter table profesionales alter column puntuacion_global type numeric;

create table valoraciones (
  id uuid primary key default gen_random_uuid(),
  profesional_id uuid not null references profesionales (id),
  particular_id uuid not null references auth.users (id),
  calidad_acabado smallint check (calidad_acabado between 1 and 5),
  puntualidad smallint check (puntualidad between 1 and 5),
  cumplimiento_plazos smallint check (cumplimiento_plazos between 1 and 5),
  limpieza_cuidado smallint check (limpieza_cuidado between 1 and 5),
  comunicacion smallint check (comunicacion between 1 and 5),
  respeto_presupuesto smallint check (respeto_presupuesto between 1 and 5),
  descripcion_trabajo text,
  factura_ruta text not null,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'aprobada', 'rechazada')),
  motivo_revision text,
  revisado_por uuid references auth.users (id),
  revisado_en timestamptz,
  created_at timestamptz not null default now(),
  constraint al_menos_un_concepto check (
    calidad_acabado is not null or puntualidad is not null or cumplimiento_plazos is not null
    or limpieza_cuidado is not null or comunicacion is not null or respeto_presupuesto is not null
  )
);

create index valoraciones_profesional_id_idx on valoraciones (profesional_id);
create index valoraciones_particular_id_idx on valoraciones (particular_id);
create index valoraciones_estado_idx on valoraciones (estado);

-- Helper: ¿el usuario actual es administrador? Se apoya en la política de
-- "un usuario ve su propio perfil" ya existente sobre `perfiles`.
create function public.es_admin_actual() returns boolean as $$
  select coalesce((select es_admin from perfiles where id = auth.uid()), false);
$$ language sql stable;

alter table valoraciones enable row level security;

create policy "Un particular crea sus propias valoraciones pendientes" on valoraciones
  for insert with check (particular_id = auth.uid() and estado = 'pendiente');

create policy "Un particular ve sus propias valoraciones" on valoraciones
  for select using (particular_id = auth.uid());

create policy "Un administrador ve todas las valoraciones" on valoraciones
  for select using (public.es_admin_actual());

create policy "Un administrador revisa valoraciones" on valoraciones
  for update using (public.es_admin_actual());

-- Recalcula la reputación del profesional a partir de sus valoraciones
-- aprobadas. SECURITY DEFINER: el trigger debe poder actualizar
-- `profesionales` aunque quien apruebe sea un administrador sin permiso de
-- escritura directa sobre la ficha ajena.
create function public.recalcular_reputacion_profesional(target_id uuid) returns void as $$
  with aprobadas as (
    select
      calidad_acabado, puntualidad, cumplimiento_plazos,
      limpieza_cuidado, comunicacion, respeto_presupuesto,
      (
        select avg(v) from unnest(array[
          calidad_acabado, puntualidad, cumplimiento_plazos,
          limpieza_cuidado, comunicacion, respeto_presupuesto
        ]) as v
        where v is not null
      ) as media_trabajo
    from valoraciones
    where profesional_id = target_id and estado = 'aprobada'
  )
  update profesionales p set
    trabajos_valorados = (select count(*) from aprobadas),
    puntuacion_global = (select avg(media_trabajo) from aprobadas),
    desglose_por_concepto = coalesce((
      select jsonb_strip_nulls(jsonb_build_object(
        'calidad_acabado', avg(calidad_acabado),
        'puntualidad', avg(puntualidad),
        'cumplimiento_plazos', avg(cumplimiento_plazos),
        'limpieza_cuidado', avg(limpieza_cuidado),
        'comunicacion', avg(comunicacion),
        'respeto_presupuesto', avg(respeto_presupuesto)
      ))
      from aprobadas
    ), '{}'::jsonb)
  where p.id = target_id;
$$ language sql security definer set search_path = public;

create function public.trg_valoraciones_recalcular() returns trigger as $$
begin
  if tg_op = 'DELETE' then
    perform public.recalcular_reputacion_profesional(old.profesional_id);
    return old;
  end if;

  perform public.recalcular_reputacion_profesional(new.profesional_id);
  if tg_op = 'UPDATE' and old.profesional_id is distinct from new.profesional_id then
    perform public.recalcular_reputacion_profesional(old.profesional_id);
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger valoraciones_recalcular
  after insert or update or delete on valoraciones
  for each row execute function public.trg_valoraciones_recalcular();

-- Bucket privado de facturas: nunca público, sin URL permanente. Solo su
-- propio dueño puede subir, y solo administración puede leer (proceso de
-- revisión), tal como exige la sección 7.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'facturas', 'facturas', false, 8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
);

create policy "Un usuario sube sus propias facturas" on storage.objects
  for insert with check (
    bucket_id = 'facturas'
    and (storage.foldername(name)) [1] = auth.uid()::text
  );

create policy "Solo administración lee facturas" on storage.objects
  for select using (bucket_id = 'facturas' and public.es_admin_actual());
