-- Negocios candidatos: datos públicos (de momento, de OpenStreetMap) que administración revisa antes de
-- publicarlos como fichas sin reclamar. Solo administración ve y toca esta tabla.

create table negocios_candidatos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (length(trim(nombre)) between 2 and 120),
  categoria_id uuid references categorias (id),
  zona_id uuid references zonas (id),
  localidad text not null default '',
  descripcion_breve text not null default '',
  contacto jsonb not null default '{}'::jsonb,
  direccion text,
  -- Origen de los datos (RGPD y licencia): «OpenStreetMap (ODbL) node/123».
  fuente_datos text not null,
  enlace_fuente text,
  -- Por qué conviene mirarlo antes de publicar (puede ser solo tienda, cerrajería industrial…).
  avisos text,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'publicado', 'descartado')),
  profesional_id uuid references profesionales (id) on delete set null,
  created_at timestamptz not null default now(),
  revisado_en timestamptz
);

-- La misma fuente no entra dos veces aunque se vuelva a cargar la lista.
create unique index negocios_candidatos_fuente_idx on negocios_candidatos (fuente_datos);
create index negocios_candidatos_estado_idx on negocios_candidatos (estado);

alter table negocios_candidatos enable row level security;

create policy "Administracion ve los candidatos" on negocios_candidatos
  for select using (public.es_admin_actual());
create policy "Administracion descarta candidatos" on negocios_candidatos
  for update using (public.es_admin_actual()) with check (public.es_admin_actual());

-- Publicar un candidato: crea la ficha sin reclamar con los datos revisados y deja constancia en el candidato.
create or replace function public.publicar_negocio_candidato(
  p_id uuid,
  p_nombre text,
  p_categoria_id uuid,
  p_zona_id uuid,
  p_localidad text,
  p_descripcion_breve text,
  p_contacto jsonb
) returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_candidato negocios_candidatos;
  v_slug text;
begin
  if not public.es_admin_actual() then
    raise exception 'Solo administración puede publicar negocios';
  end if;

  select * into v_candidato from negocios_candidatos where id = p_id for update;
  if not found then
    raise exception 'Ese candidato no existe';
  end if;
  if v_candidato.estado <> 'pendiente' then
    raise exception 'Ese candidato ya está revisado';
  end if;

  v_slug := public.crear_ficha_sin_reclamar(
    p_nombre,
    array[p_categoria_id],
    case when p_zona_id is null then array[]::uuid[] else array[p_zona_id] end,
    p_localidad,
    p_descripcion_breve,
    p_contacto,
    v_candidato.fuente_datos
  );

  update negocios_candidatos
     set estado = 'publicado',
         revisado_en = now(),
         profesional_id = (select id from profesionales where slug = v_slug)
   where id = p_id;

  return v_slug;
end;
$$;

revoke all on function public.publicar_negocio_candidato(uuid, text, uuid, uuid, text, text, jsonb) from public;
grant execute on function public.publicar_negocio_candidato(uuid, text, uuid, uuid, text, text, jsonb) to authenticated;
