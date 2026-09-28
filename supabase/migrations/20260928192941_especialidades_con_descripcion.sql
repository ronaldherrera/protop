-- Cada especialidad pasa de ser una simple etiqueta de texto a tener también
-- su propia descripción opcional (p.ej. "Colocación de telefonillos" +
-- explicación de en qué consiste ese trabajo en concreto).
--
-- ALTER COLUMN ... USING no admite una subconsulta directamente, así que la
-- conversión de text[] a jsonb pasa por una función auxiliar que se borra
-- al terminar.

create function texto_array_a_especialidades(entradas text[])
returns jsonb
language sql
immutable
as $$
  select coalesce(jsonb_agg(jsonb_build_object('nombre', e, 'descripcion', '')), '[]'::jsonb)
  from unnest(entradas) as e
$$;

alter table profesionales alter column especialidades drop default;

alter table profesionales
  alter column especialidades type jsonb
  using texto_array_a_especialidades(especialidades);

alter table profesionales alter column especialidades set default '[]'::jsonb;

drop function texto_array_a_especialidades(text[]);
