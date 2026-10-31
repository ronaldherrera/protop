-- Búsqueda del directorio en la base de datos, paginable. Hasta ahora el navegador descargaba todas las fichas y
-- filtraba él: con negocios de toda la península eso son decenas de miles (y PostgREST corta en 1000 filas).
-- Devuelve filas de profesionales para que PostgREST pueda incrustar oficios y zonas igual que en el select normal.

create or replace function public.buscar_profesionales(
  p_categorias text[] default null,
  p_zona text default null,
  p_texto text default null
) returns setof profesionales
language sql
stable
set search_path = public
as $$
  with filtro_zona as (
    select slug, tipo, comunidad_slug from zonas where slug = p_zona
  ),
  hay_reales as (
    -- Las fichas de ejemplo solo se enseñan mientras no haya ningún negocio real.
    select exists (select 1 from profesionales where not es_demo) as si
  ),
  texto as (
    select '%' || replace(replace(replace(trim(coalesce(p_texto, '')), '\', '\\'), '%', '\%'), '_', '\_') || '%' as patron,
      trim(coalesce(p_texto, '')) = '' as vacio
  )
  select p.*
  from profesionales p, hay_reales, texto
  where (not hay_reales.si or not p.es_demo)
    and (
      coalesce(cardinality(p_categorias), 0) = 0
      or exists (
        select 1 from profesional_categorias pc join categorias c on c.id = pc.categoria_id
        where pc.profesional_id = p.id and c.slug = any (p_categorias)
      )
    )
    -- Igual que coincideZona: quien trabaja en una comunidad entera sale al buscar cualquiera de sus municipios,
    -- y buscar la comunidad encuentra a quien solo ha marcado municipios sueltos de ella.
    and (
      coalesce(p_zona, '') = ''
      or exists (
        select 1
        from profesional_zonas pz
        join zonas z on z.id = pz.zona_id
        cross join filtro_zona f
        where pz.profesional_id = p.id
          and (
            z.slug = f.slug
            or (f.tipo = 'municipio' and z.slug = f.comunidad_slug)
            or (f.tipo = 'comunidad' and z.comunidad_slug = f.slug)
          )
      )
    )
    and (
      texto.vacio
      or p.nombre_comercial ilike texto.patron
      or exists (
        select 1 from jsonb_array_elements(coalesce(p.especialidades, '[]'::jsonb)) e
        where e ->> 'nombre' ilike texto.patron
      )
    )
  -- Mismo orden que ordenarProfesionales: puntuación, trabajos valorados y, en empate, la ficha más completa.
  order by
    p.puntuacion_global desc nulls last,
    p.trabajos_valorados desc,
    (p.foto_perfil_url is not null)::int
      + (trim(coalesce(p.descripcion, '')) <> '')::int
      + (jsonb_array_length(coalesce(p.especialidades, '[]'::jsonb)) > 0)::int
      + (coalesce(cardinality(p.fotos_trabajos), 0) > 0)::int
      + ((
          (coalesce(p.contacto ->> 'telefono', '') <> '')::int
          + (coalesce(p.contacto ->> 'whatsapp', '') <> '')::int
          + (coalesce(p.contacto ->> 'email', '') <> '')::int
          + (coalesce(p.contacto ->> 'web', '') <> '')::int
        ) > 1)::int desc,
    p.id
$$;

grant execute on function public.buscar_profesionales(text[], text, text) to anon, authenticated;
