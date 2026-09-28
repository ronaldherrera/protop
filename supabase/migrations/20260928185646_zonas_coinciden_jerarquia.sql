-- Ahora que una zona puede ser una comunidad autónoma entera o un municipio
-- suelto, el matching de solicitudes con profesionales tiene que entender
-- la jerarquía: un profesional que trabaja "en toda Cantabria" debe ver las
-- solicitudes de Santander, y viceversa, un particular que pide presupuesto
-- para "toda Cantabria" debe llegar a profesionales que solo marcaron
-- municipios sueltos de esa comunidad.

create function zonas_coinciden(zona_a uuid, zona_b uuid)
returns boolean
language sql
stable
as $$
  select zona_a = zona_b
  or exists (
    select 1 from zonas za, zonas zb
    where za.id = zona_a and zb.id = zona_b
    and (
      (za.tipo = 'municipio' and zb.tipo = 'comunidad' and za.comunidad_slug = zb.slug)
      or (zb.tipo = 'municipio' and za.tipo = 'comunidad' and zb.comunidad_slug = za.slug)
    )
  );
$$;

drop policy "Profesionales ven solicitudes abiertas que encajan" on solicitudes;
create policy "Profesionales ven solicitudes abiertas que encajan" on solicitudes
  for select using (
    estado = 'abierta'
    and exists (
      select 1 from profesionales p
      join profesional_categorias pc on pc.profesional_id = p.id
      join profesional_zonas pz on pz.profesional_id = p.id
      where p.user_id = auth.uid()
      and pc.categoria_id = solicitudes.categoria_id
      and zonas_coinciden(pz.zona_id, solicitudes.zona_id)
    )
  );

drop policy "Un profesional envia su propuesta a una solicitud que encaja" on propuestas;
create policy "Un profesional envia su propuesta a una solicitud que encaja" on propuestas
  for insert with check (
    exists (select 1 from profesionales p where p.id = profesional_id and p.user_id = auth.uid())
    and exists (
      select 1 from solicitudes s
      join profesional_categorias pc on pc.profesional_id = propuestas.profesional_id
      join profesional_zonas pz on pz.profesional_id = propuestas.profesional_id
      where s.id = solicitud_id
      and s.estado = 'abierta'
      and pc.categoria_id = s.categoria_id
      and zonas_coinciden(pz.zona_id, s.zona_id)
    )
  );
