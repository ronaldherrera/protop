-- Portfolio de "trabajos publicados" en el perfil del profesional. Separado
-- por completo del sistema de valoraciones (factura + revisión de admin):
-- aquí el profesional publica un trabajo, vincula opcionalmente al cliente
-- real, y ese cliente puede dejar un comentario libre si quiere. No afecta
-- a la reputación ni requiere revisión.

create table trabajos_publicados (
  id uuid primary key default gen_random_uuid(),
  profesional_id uuid not null references profesionales (id) on delete cascade,
  titulo text not null,
  descripcion text,
  fotos text[] not null default '{}',
  realizado_en date,
  cliente_id uuid references perfiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index trabajos_publicados_profesional_id_idx on trabajos_publicados (profesional_id);
create index trabajos_publicados_cliente_id_idx on trabajos_publicados (cliente_id);

create trigger trabajos_publicados_set_updated_at
  before update on trabajos_publicados
  for each row execute function set_updated_at();

create table trabajo_comentarios (
  id uuid primary key default gen_random_uuid(),
  trabajo_id uuid not null references trabajos_publicados (id) on delete cascade unique,
  autor_id uuid not null references perfiles (id),
  comentario text not null,
  created_at timestamptz not null default now()
);

alter table trabajos_publicados enable row level security;
alter table trabajo_comentarios enable row level security;

create policy "Trabajos publicados visibles para todos" on trabajos_publicados
  for select using (true);

create policy "Un profesional crea sus propios trabajos" on trabajos_publicados
  for insert with check (
    exists (select 1 from profesionales where id = profesional_id and user_id = auth.uid())
  );

create policy "Un profesional edita sus propios trabajos" on trabajos_publicados
  for update using (
    exists (select 1 from profesionales where id = profesional_id and user_id = auth.uid())
  );

create policy "Un profesional borra sus propios trabajos" on trabajos_publicados
  for delete using (
    exists (select 1 from profesionales where id = profesional_id and user_id = auth.uid())
  );

create policy "Comentarios de trabajos visibles para todos" on trabajo_comentarios
  for select using (true);

create policy "El cliente vinculado comenta su trabajo" on trabajo_comentarios
  for insert with check (
    autor_id = auth.uid()
    and exists (
      select 1 from trabajos_publicados t
      where t.id = trabajo_id and t.cliente_id = auth.uid()
    )
  );

create policy "El autor borra su propio comentario" on trabajo_comentarios
  for delete using (autor_id = auth.uid());

-- Vincula un cliente existente a un trabajo por su correo. SECURITY DEFINER
-- porque auth.users no es consultable directamente desde el cliente; solo
-- expone si existe o no una cuenta con ese correo, nada más.
create function public.vincular_cliente_trabajo(trabajo_id_param uuid, email_cliente text)
returns void as $$
declare
  target_id uuid;
begin
  if not exists (
    select 1 from trabajos_publicados t
    join profesionales p on p.id = t.profesional_id
    where t.id = trabajo_id_param and p.user_id = auth.uid()
  ) then
    raise exception 'No tienes permiso sobre este trabajo.';
  end if;

  select id into target_id from auth.users where email = email_cliente;

  if target_id is null then
    raise exception 'No encontramos ninguna cuenta con ese correo.';
  end if;

  update trabajos_publicados set cliente_id = target_id where id = trabajo_id_param;
end;
$$ language plpgsql security definer set search_path = public;

grant execute on function public.vincular_cliente_trabajo(uuid, text) to authenticated;
