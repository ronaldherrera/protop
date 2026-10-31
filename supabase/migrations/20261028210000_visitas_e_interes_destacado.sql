-- Visitas y contactos de cada ficha, y lista de interés del Plan Destacado.
-- Las visitas son el argumento para que un negocio reclame su ficha («esta ficha ha tenido 37 visitas este mes») y,
-- después, para que contrate el Plan Destacado. Solo se guardan contadores por día: nada que identifique al visitante.

create table visitas_ficha (
  profesional_id uuid not null references profesionales (id) on delete cascade,
  dia date not null default current_date,
  visitas integer not null default 0,
  contactos integer not null default 0,
  primary key (profesional_id, dia)
);

alter table visitas_ficha enable row level security;
-- Nadie lee ni escribe la tabla directamente: se usa con las dos funciones de abajo.

-- Suma una visita o un contacto (clic en llamar, WhatsApp, email o web) a la ficha, en el día de hoy.
create or replace function public.registrar_visita_ficha(p_slug text, p_tipo text default 'visita')
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if p_tipo not in ('visita', 'contacto') then
    raise exception 'Tipo no válido';
  end if;
  select id into v_id from profesionales where slug = p_slug and publicado and not es_demo;
  if v_id is null then
    return;
  end if;
  insert into visitas_ficha (profesional_id, dia, visitas, contactos)
  values (v_id, current_date, (p_tipo = 'visita')::int, (p_tipo = 'contacto')::int)
  on conflict (profesional_id, dia) do update
    set visitas = visitas_ficha.visitas + excluded.visitas,
        contactos = visitas_ficha.contactos + excluded.contactos;
end;
$$;

-- Visitas y contactos de los últimos 30 días. Son públicos a propósito: la ficha sin reclamar los enseña al
-- negocio para que vea que le buscan.
create or replace function public.estadisticas_ficha(p_slug text)
returns table (visitas bigint, contactos bigint)
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(sum(v.visitas), 0), coalesce(sum(v.contactos), 0)
  from profesionales p
  left join visitas_ficha v on v.profesional_id = p.id and v.dia > current_date - 30
  where p.slug = p_slug;
$$;

grant execute on function public.registrar_visita_ficha(text, text) to anon, authenticated;
grant execute on function public.estadisticas_ficha(text) to anon, authenticated;

-- Profesionales que quieren el Plan Destacado antes de que se pueda pagar: así hay a quién avisar el día que
-- se active el cobro. Cualquiera puede apuntarse (con o sin cuenta); solo administración ve la lista.
create table interes_destacado (
  id uuid primary key default gen_random_uuid(),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[a-z]{2,}$' and length(email) <= 200),
  nombre_negocio text check (nombre_negocio is null or length(nombre_negocio) <= 200),
  categoria_id uuid references categorias (id) on delete set null,
  zona text check (zona is null or length(zona) <= 200),
  user_id uuid references auth.users (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);

alter table interes_destacado enable row level security;

create policy "Cualquiera se apunta al Plan Destacado" on interes_destacado
  for insert to anon, authenticated with check (user_id is null or user_id = auth.uid());
create policy "Administracion ve la lista del Plan Destacado" on interes_destacado
  for select using (public.es_admin_actual());
create policy "Administracion borra de la lista del Plan Destacado" on interes_destacado
  for delete using (public.es_admin_actual());
