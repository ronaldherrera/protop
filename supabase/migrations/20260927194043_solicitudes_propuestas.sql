-- Fase 5: solicitudes de presupuestos, propuestas y comparación (secciones 8 y 9).
--
-- Pagos todavía no integrados (Fase 6): una solicitud pasa de "pendiente_pago"
-- a "abierta" mediante una acción manual de administración, sin cobro real.

create table solicitudes (
  id uuid primary key default gen_random_uuid(),
  particular_id uuid not null references perfiles (id),
  titulo text not null,
  categoria_id uuid not null references categorias (id),
  zona_id uuid not null references zonas (id),
  descripcion text not null,
  medidas_cantidades text,
  fecha_deseada text,
  informacion_adicional text,
  fotos text[] not null default '{}',
  estado text not null default 'borrador' check (estado in ('borrador', 'pendiente_pago', 'abierta', 'cerrada')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index solicitudes_particular_id_idx on solicitudes (particular_id);
create index solicitudes_matching_idx on solicitudes (estado, categoria_id, zona_id);

create trigger solicitudes_set_updated_at
  before update on solicitudes
  for each row execute function set_updated_at();

create table propuestas (
  id uuid primary key default gen_random_uuid(),
  solicitud_id uuid not null references solicitudes (id) on delete cascade,
  profesional_id uuid not null references profesionales (id),
  alcance_trabajo text not null,
  importe_orientativo numeric not null,
  desglose text,
  materiales_incluidos text,
  mano_obra text,
  tratamiento_impuestos text not null,
  exclusiones text,
  plazo_aproximado text not null,
  necesita_visita boolean not null default false,
  aspectos_pendientes text,
  valida_hasta date not null,
  tipo text not null default 'estimacion' check (tipo in ('estimacion', 'confirmada')),
  created_at timestamptz not null default now(),
  unique (solicitud_id, profesional_id)
);

create index propuestas_solicitud_id_idx on propuestas (solicitud_id);
create index propuestas_profesional_id_idx on propuestas (profesional_id);

create table aclaraciones (
  id uuid primary key default gen_random_uuid(),
  solicitud_id uuid not null references solicitudes (id) on delete cascade,
  autor_id uuid not null references perfiles (id),
  mensaje text not null,
  created_at timestamptz not null default now()
);

create index aclaraciones_solicitud_id_idx on aclaraciones (solicitud_id);

-- RLS

alter table solicitudes enable row level security;
alter table propuestas enable row level security;
alter table aclaraciones enable row level security;

create policy "El particular ve sus propias solicitudes" on solicitudes
  for select using (particular_id = auth.uid());

create policy "Profesionales ven solicitudes abiertas que encajan" on solicitudes
  for select using (
    estado = 'abierta'
    and exists (
      select 1 from profesionales p
      join profesional_zonas pz on pz.profesional_id = p.id
      where p.user_id = auth.uid()
      and p.categoria_id = solicitudes.categoria_id
      and pz.zona_id = solicitudes.zona_id
    )
  );

create policy "Administracion ve todas las solicitudes" on solicitudes
  for select using (public.es_admin_actual());

create policy "El particular crea su solicitud en borrador" on solicitudes
  for insert with check (particular_id = auth.uid() and estado = 'borrador');

create policy "El particular edita su borrador o lo envia a pago" on solicitudes
  for update using (particular_id = auth.uid() and estado = 'borrador')
  with check (particular_id = auth.uid() and estado in ('borrador', 'pendiente_pago'));

create policy "El particular cierra su solicitud abierta" on solicitudes
  for update using (particular_id = auth.uid() and estado = 'abierta')
  with check (particular_id = auth.uid() and estado = 'cerrada');

create policy "Administracion actualiza cualquier solicitud" on solicitudes
  for update using (public.es_admin_actual());

create policy "Un profesional envia su propuesta a una solicitud que encaja" on propuestas
  for insert with check (
    exists (select 1 from profesionales p where p.id = profesional_id and p.user_id = auth.uid())
    and exists (
      select 1 from solicitudes s
      join profesionales p on p.id = profesional_id
      join profesional_zonas pz on pz.profesional_id = p.id
      where s.id = solicitud_id
      and s.estado = 'abierta'
      and s.categoria_id = p.categoria_id
      and pz.zona_id = s.zona_id
    )
  );

create policy "El particular ve las propuestas de sus solicitudes" on propuestas
  for select using (
    exists (select 1 from solicitudes s where s.id = solicitud_id and s.particular_id = auth.uid())
  );

create policy "Un profesional ve sus propias propuestas" on propuestas
  for select using (
    exists (select 1 from profesionales p where p.id = profesional_id and p.user_id = auth.uid())
  );

create policy "Administracion ve todas las propuestas" on propuestas
  for select using (public.es_admin_actual());

create policy "Los participantes de una solicitud escriben aclaraciones" on aclaraciones
  for insert with check (
    autor_id = auth.uid()
    and (
      exists (select 1 from solicitudes s where s.id = solicitud_id and s.particular_id = auth.uid())
      or exists (
        select 1 from propuestas pr
        join profesionales p on p.id = pr.profesional_id
        where pr.solicitud_id = aclaraciones.solicitud_id and p.user_id = auth.uid()
      )
    )
  );

create policy "Los participantes de una solicitud leen sus aclaraciones" on aclaraciones
  for select using (
    exists (select 1 from solicitudes s where s.id = solicitud_id and s.particular_id = auth.uid())
    or exists (
      select 1 from propuestas pr
      join profesionales p on p.id = pr.profesional_id
      where pr.solicitud_id = aclaraciones.solicitud_id and p.user_id = auth.uid()
    )
    or public.es_admin_actual()
  );

-- Bucket privado para fotos de solicitudes. Cualquier cuenta con ficha
-- profesional puede verlas (el filtrado real por categoría/zona ya ocurre al
-- listar qué solicitudes ve cada profesional); nunca es público.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('solicitudes-fotos', 'solicitudes-fotos', false, 8388608, array['image/jpeg', 'image/png', 'image/webp']);

create policy "Un particular sube fotos a su propia solicitud" on storage.objects
  for insert with check (
    bucket_id = 'solicitudes-fotos'
    and (storage.foldername(name)) [1] = auth.uid()::text
  );

create policy "Dueno, profesionales registrados y administracion ven fotos de solicitudes" on storage.objects
  for select using (
    bucket_id = 'solicitudes-fotos'
    and (
      (storage.foldername(name)) [1] = auth.uid()::text
      or public.es_admin_actual()
      or exists (select 1 from profesionales where user_id = auth.uid())
    )
  );
