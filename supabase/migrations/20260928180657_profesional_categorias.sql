-- Un profesional puede tener varios oficios (chips), no solo uno.
--
-- Se mantiene profesionales.categoria_id como "oficio principal" (el primer
-- chip elegido), usado para la tarjeta/ficha y como no rompe nada existente.
-- La nueva tabla profesional_categorias guarda el conjunto completo de
-- oficios y pasa a ser la fuente de verdad para el matching con solicitudes
-- (un profesional debe ver/optar a solicitudes de cualquiera de sus oficios,
-- no solo del principal), replicando el patrón ya usado en profesional_zonas.

create table profesional_categorias (
  profesional_id uuid not null references profesionales (id) on delete cascade,
  categoria_id uuid not null references categorias (id) on delete cascade,
  primary key (profesional_id, categoria_id)
);

create index profesional_categorias_categoria_id_idx on profesional_categorias (categoria_id);

insert into profesional_categorias (profesional_id, categoria_id)
select id, categoria_id from profesionales;

alter table profesional_categorias enable row level security;

create policy "Categorías de profesionales publicados visibles para todos" on profesional_categorias
  for select using (
    exists (
      select 1 from profesionales
      where profesionales.id = profesional_categorias.profesional_id
      and profesionales.publicado = true
    )
  );

create policy "Un usuario gestiona las categorías de su propia ficha (alta)" on profesional_categorias
  for insert with check (
    exists (
      select 1 from profesionales
      where profesionales.id = profesional_categorias.profesional_id
      and profesionales.user_id = auth.uid()
    )
  );

create policy "Un usuario gestiona las categorías de su propia ficha (baja)" on profesional_categorias
  for delete using (
    exists (
      select 1 from profesionales
      where profesionales.id = profesional_categorias.profesional_id
      and profesionales.user_id = auth.uid()
    )
  );

-- Matching de solicitudes: antes solo por categoria_id (oficio principal),
-- ahora por cualquiera de los oficios del profesional.

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
      and pz.zona_id = solicitudes.zona_id
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
      and pz.zona_id = s.zona_id
    )
  );
