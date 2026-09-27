-- Fase 3: registro, permisos y edición de perfiles.
-- Una cuenta (auth.users) puede actuar a la vez como particular y como
-- profesional: "perfiles" guarda los datos básicos de cualquier cuenta, y
-- "profesionales" se vincula a esa cuenta mediante user_id cuando el usuario
-- crea su ficha. No hace falta registrarse dos veces.

create table perfiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text not null,
  telefono text,
  es_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger perfiles_set_updated_at
  before update on perfiles
  for each row
  execute function set_updated_at();

-- Crea automáticamente el perfil básico al registrarse.
create function public.handle_new_user() returns trigger as $$
begin
  insert into public.perfiles (id, nombre)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'nombre', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table perfiles enable row level security;

create policy "Un usuario ve su propio perfil" on perfiles
  for select using (auth.uid() = id);

create policy "Un usuario edita su propio perfil" on perfiles
  for update using (auth.uid() = id);

-- Vincula fichas profesionales a la cuenta que las crea y gestiona.

alter table profesionales add column user_id uuid references auth.users (id);
create index profesionales_user_id_idx on profesionales (user_id);

create policy "Un usuario crea su propia ficha profesional" on profesionales
  for insert with check (auth.uid() = user_id);

create policy "Un usuario edita su propia ficha profesional" on profesionales
  for update using (auth.uid() = user_id);

create policy "Un usuario gestiona las zonas de su propia ficha (alta)" on profesional_zonas
  for insert with check (
    exists (
      select 1 from profesionales
      where profesionales.id = profesional_zonas.profesional_id
      and profesionales.user_id = auth.uid()
    )
  );

create policy "Un usuario gestiona las zonas de su propia ficha (baja)" on profesional_zonas
  for delete using (
    exists (
      select 1 from profesionales
      where profesionales.id = profesional_zonas.profesional_id
      and profesionales.user_id = auth.uid()
    )
  );

-- Bucket público para fotos de perfil y de trabajos (nunca facturas: esas son
-- privadas y llegan en la Fase 4 en un bucket aparte).

insert into storage.buckets (id, name, public)
values ('fotos-profesionales', 'fotos-profesionales', true);

create policy "Fotos de profesionales visibles para todos" on storage.objects
  for select using (bucket_id = 'fotos-profesionales');

create policy "Un usuario sube sus propias fotos" on storage.objects
  for insert with check (
    bucket_id = 'fotos-profesionales'
    and (storage.foldername(name)) [1] = auth.uid()::text
  );

create policy "Un usuario borra sus propias fotos" on storage.objects
  for delete using (
    bucket_id = 'fotos-profesionales'
    and (storage.foldername(name)) [1] = auth.uid()::text
  );
