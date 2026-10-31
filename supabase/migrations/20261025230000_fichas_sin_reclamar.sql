-- Fichas creadas por Protop con datos públicos de negocios que aún no se han registrado.
-- El negocio puede reclamarla (se le asigna sin duplicados) o pedir que se borre.

create extension if not exists unaccent with schema extensions;

-- 0. Seguridad: el dueño de una ficha solo puede escribir los campos de su ficha. Antes podía cambiar
--    también la puntuación, los trabajos valorados, los distintivos o la marca de patrocinio.
--    La reputación la sigue recalculando recalcular_reputacion_profesional (security definer).
revoke insert, update on table profesionales from anon, authenticated;
grant insert (
  slug, user_id, nombre_comercial, categoria_id, especialidades, localidad,
  descripcion_breve, descripcion, foto_perfil_url, fotos_trabajos, contacto
) on table profesionales to authenticated;
grant update (
  nombre_comercial, categoria_id, especialidades, localidad,
  descripcion_breve, descripcion, foto_perfil_url, fotos_trabajos, contacto
) on table profesionales to authenticated;

-- 1. Marca de origen de la ficha.
alter table profesionales add column creado_por_protop boolean not null default false;
alter table profesionales add column fuente_datos text;
alter table profesionales add column reclamada_en timestamptz;

-- 2. Reclamaciones que no se han podido comprobar solas (el email de la cuenta no coincide con el de la ficha).
create table reclamaciones_ficha (
  id uuid primary key default gen_random_uuid(),
  profesional_id uuid not null references profesionales (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  email_cuenta text not null,
  mensaje text,
  estado text not null default 'revision' check (estado in ('revision', 'aprobada', 'rechazada')),
  motivo_revision text,
  created_at timestamptz not null default now(),
  revisada_en timestamptz
);

create unique index reclamaciones_ficha_una_abierta_idx
  on reclamaciones_ficha (profesional_id, user_id) where estado = 'revision';

alter table reclamaciones_ficha enable row level security;

create policy "Cada usuario ve sus reclamaciones" on reclamaciones_ficha
  for select using (user_id = auth.uid());
create policy "Administracion ve todas las reclamaciones" on reclamaciones_ficha
  for select using (public.es_admin_actual());

-- 3. Peticiones de baja de fichas creadas por Protop (las puede enviar cualquiera, sin cuenta).
create table bajas_ficha (
  id uuid primary key default gen_random_uuid(),
  profesional_id uuid not null references profesionales (id) on delete cascade,
  contacto text not null check (length(contacto) between 3 and 200),
  motivo text check (motivo is null or length(motivo) <= 1000),
  created_at timestamptz not null default now()
);

alter table bajas_ficha enable row level security;

create policy "Cualquiera pide la baja de una ficha creada por Protop" on bajas_ficha
  for insert to anon, authenticated with check (
    exists (select 1 from profesionales p where p.id = profesional_id and p.creado_por_protop and p.user_id is null)
  );
create policy "Administracion ve las bajas" on bajas_ficha
  for select using (public.es_admin_actual());
create policy "Administracion resuelve las bajas" on bajas_ficha
  for delete using (public.es_admin_actual());

-- 4. Administración: crear una ficha sin reclamar (con sus oficios y zonas) en una sola llamada.
create or replace function public.crear_ficha_sin_reclamar(
  p_nombre_comercial text,
  p_categoria_ids uuid[],
  p_zona_ids uuid[],
  p_localidad text,
  p_descripcion_breve text,
  p_contacto jsonb,
  p_fuente_datos text
) returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_slug text;
begin
  if not public.es_admin_actual() then
    raise exception 'Solo administración puede crear fichas';
  end if;
  if coalesce(array_length(p_categoria_ids, 1), 0) = 0 then
    raise exception 'La ficha necesita al menos un oficio';
  end if;
  if coalesce(trim(p_fuente_datos), '') = '' then
    raise exception 'Indica de dónde salen los datos (RGPD)';
  end if;

  v_slug := trim(both '-' from regexp_replace(lower(extensions.unaccent(p_nombre_comercial)), '[^a-z0-9]+', '-', 'g'))
    || '-' || substr(md5(random()::text), 1, 5);

  insert into profesionales (
    slug, nombre_comercial, categoria_id, localidad, descripcion_breve, descripcion,
    contacto, creado_por_protop, fuente_datos
  ) values (
    v_slug, trim(p_nombre_comercial), p_categoria_ids[1], trim(p_localidad), trim(p_descripcion_breve), '',
    coalesce(p_contacto, '{}'::jsonb), true, trim(p_fuente_datos)
  ) returning id into v_id;

  insert into profesional_categorias (profesional_id, categoria_id)
    select v_id, unnest(p_categoria_ids);
  insert into profesional_zonas (profesional_id, zona_id)
    select v_id, unnest(p_zona_ids);

  return v_slug;
end;
$$;

-- 5. Reclamar una ficha. Si el email confirmado de la cuenta coincide con el de la ficha, es suya al
--    momento; si no, queda en revisión para administración. Una cuenta solo puede tener una ficha.
create or replace function public.reclamar_ficha(p_profesional_id uuid, p_mensaje text default null)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ficha profesionales%rowtype;
  v_email text;
  v_confirmado timestamptz;
begin
  if auth.uid() is null then
    raise exception 'Hay que entrar en una cuenta para reclamar una ficha';
  end if;

  select * into v_ficha from profesionales where id = p_profesional_id for update;
  if not found or not v_ficha.creado_por_protop then
    return 'no_reclamable';
  end if;
  if v_ficha.user_id is not null then
    return case when v_ficha.user_id = auth.uid() then 'ya_es_tuya' else 'ya_reclamada' end;
  end if;
  if exists (select 1 from profesionales where user_id = auth.uid()) then
    return 'ya_tienes_ficha';
  end if;

  select email, email_confirmed_at into v_email, v_confirmado from auth.users where id = auth.uid();

  if v_confirmado is not null
     and lower(coalesce(v_ficha.contacto ->> 'email', '')) <> ''
     and lower(v_ficha.contacto ->> 'email') = lower(v_email) then
    update profesionales set user_id = auth.uid(), reclamada_en = now() where id = p_profesional_id;
    return 'reclamada';
  end if;

  insert into reclamaciones_ficha (profesional_id, user_id, email_cuenta, mensaje)
    values (p_profesional_id, auth.uid(), v_email, nullif(trim(p_mensaje), ''))
    on conflict do nothing;
  return 'en_revision';
end;
$$;

-- 6. Administración aprueba o rechaza una reclamación en revisión.
create or replace function public.resolver_reclamacion(p_reclamacion_id uuid, p_aprobar boolean, p_motivo text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_reclamacion reclamaciones_ficha%rowtype;
begin
  if not public.es_admin_actual() then
    raise exception 'Solo administración puede resolver reclamaciones';
  end if;

  select * into v_reclamacion from reclamaciones_ficha where id = p_reclamacion_id and estado = 'revision' for update;
  if not found then
    raise exception 'La reclamación ya no está en revisión';
  end if;

  if p_aprobar then
    if exists (select 1 from profesionales where id = v_reclamacion.profesional_id and user_id is not null) then
      raise exception 'Esa ficha ya tiene dueño';
    end if;
    if exists (select 1 from profesionales where user_id = v_reclamacion.user_id) then
      raise exception 'Esa cuenta ya tiene otra ficha';
    end if;
    update profesionales set user_id = v_reclamacion.user_id, reclamada_en = now()
      where id = v_reclamacion.profesional_id;
    -- Las demás reclamaciones de esa ficha dejan de tener sentido.
    update reclamaciones_ficha set estado = 'rechazada', motivo_revision = 'Ficha asignada a otra cuenta', revisada_en = now()
      where profesional_id = v_reclamacion.profesional_id and estado = 'revision' and id <> p_reclamacion_id;
  end if;

  update reclamaciones_ficha
    set estado = case when p_aprobar then 'aprobada' else 'rechazada' end,
        motivo_revision = nullif(trim(p_motivo), ''),
        revisada_en = now()
    where id = p_reclamacion_id;
end;
$$;

-- 7. Administración borra una ficha sin reclamar (atiende una petición de baja).
create or replace function public.borrar_ficha_sin_reclamar(p_profesional_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.es_admin_actual() then
    raise exception 'Solo administración puede borrar fichas';
  end if;
  delete from profesionales where id = p_profesional_id and creado_por_protop and user_id is null;
end;
$$;

revoke all on function public.crear_ficha_sin_reclamar(text, uuid[], uuid[], text, text, jsonb, text) from public;
revoke all on function public.reclamar_ficha(uuid, text) from public;
revoke all on function public.resolver_reclamacion(uuid, boolean, text) from public;
revoke all on function public.borrar_ficha_sin_reclamar(uuid) from public;
grant execute on function public.crear_ficha_sin_reclamar(text, uuid[], uuid[], text, text, jsonb, text) to authenticated;
grant execute on function public.reclamar_ficha(uuid, text) to authenticated;
grant execute on function public.resolver_reclamacion(uuid, boolean, text) to authenticated;
grant execute on function public.borrar_ficha_sin_reclamar(uuid) to authenticated;
