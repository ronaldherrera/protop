-- Fase 2: directorio y fichas profesionales.
-- Categorías y zonas son datos reales de referencia (administrables sin tocar
-- código, vía Supabase). Los profesionales siguen siendo de demostración
-- (es_demo = true) hasta la Fase 3, que introduce el registro real.

create table categorias (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  slug text not null unique,
  orden int not null default 0,
  created_at timestamptz not null default now()
);

create table zonas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  slug text not null unique,
  orden int not null default 0,
  created_at timestamptz not null default now()
);

create table profesionales (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nombre_comercial text not null,
  categoria_id uuid not null references categorias (id),
  especialidades text[] not null default '{}',
  localidad text not null,
  descripcion_breve text not null,
  descripcion text not null,
  foto_perfil_url text,
  fotos_trabajos text[] not null default '{}',
  contacto jsonb not null default '{}'::jsonb,
  -- Reputación: se recalculará a partir de valoraciones reales en la Fase 4.
  -- null = "Sin valoraciones verificadas".
  puntuacion_global numeric(2, 1),
  trabajos_valorados int not null default 0,
  desglose_por_concepto jsonb not null default '{}'::jsonb,
  distintivos jsonb not null default '[]'::jsonb,
  -- Patrocinio real (campañas) llega en la Fase 7; de momento es un flag manual.
  patrocinado boolean not null default false,
  es_demo boolean not null default false,
  publicado boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table profesional_zonas (
  profesional_id uuid not null references profesionales (id) on delete cascade,
  zona_id uuid not null references zonas (id) on delete cascade,
  primary key (profesional_id, zona_id)
);

create index profesionales_categoria_id_idx on profesionales (categoria_id);
create index profesional_zonas_zona_id_idx on profesional_zonas (zona_id);

create function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profesionales_set_updated_at
  before update on profesionales
  for each row
  execute function set_updated_at();

-- RLS: lectura pública de categorías/zonas y de profesionales publicados.
-- Sin políticas de escritura para anon: todo insert/update pasa por el
-- service role (migraciones/seed, y más adelante el área de administración).

alter table categorias enable row level security;
alter table zonas enable row level security;
alter table profesionales enable row level security;
alter table profesional_zonas enable row level security;

create policy "Categorías visibles para todos" on categorias
  for select using (true);

create policy "Zonas visibles para todas" on zonas
  for select using (true);

create policy "Profesionales publicados visibles para todos" on profesionales
  for select using (publicado = true);

create policy "Zonas de profesionales publicados visibles para todos" on profesional_zonas
  for select using (
    exists (
      select 1 from profesionales
      where profesionales.id = profesional_zonas.profesional_id
      and profesionales.publicado = true
    )
  );

-- Datos semilla: categorías y zonas (reales), profesionales (demostración).

insert into categorias (nombre, slug, orden) values
  ('Electricidad', 'electricidad', 1),
  ('Fontanería', 'fontaneria', 2),
  ('Albañilería', 'albanileria', 3),
  ('Pintura', 'pintura', 4),
  ('Carpintería', 'carpinteria', 5),
  ('Reformas generales', 'reformas-generales', 6);

insert into zonas (nombre, slug, orden) values
  ('Santander', 'santander', 1),
  ('Camargo', 'camargo', 2),
  ('El Astillero', 'el-astillero', 3),
  ('Santa Cruz de Bezana', 'santa-cruz-de-bezana', 4),
  ('Piélagos', 'pielagos', 5),
  ('Castro-Urdiales', 'castro-urdiales', 6);

with datos as (
  select * from (values
    ('electricidad-bahia-santander', 'Electricidad Bahía', 'electricidad',
     array['Instalaciones nuevas', 'Boletines eléctricos', 'Averías'], 'Santander',
     'Instalaciones y reparaciones eléctricas para vivienda y local.',
     'Empresa familiar dedicada a instalaciones eléctricas en vivienda y local comercial. Trabajamos con boletín oficial y nos coordinamos con otros gremios en reformas integrales.',
     array['https://picsum.photos/seed/protop-elec-1/640/480', 'https://picsum.photos/seed/protop-elec-2/640/480'],
     '{"telefono": "600111222", "whatsapp": "600111222", "email": "contacto@electricidadbahia.demo"}'::jsonb,
     4.6, 23,
     '{"calidad_acabado": 4.7, "puntualidad": 4.5, "cumplimiento_plazos": 4.4, "limpieza_cuidado": 4.8, "comunicacion": 4.6, "respeto_presupuesto": 4.5}'::jsonb,
     '[{"id": "identidad", "etiqueta": "Identidad verificada", "explicacion": "Protop ha comprobado el DNI/NIF del profesional."}]'::jsonb,
     true, array['santander', 'santa-cruz-de-bezana']),
    ('fontaneria-astillero-express', 'Fontanería Astillero Express', 'fontaneria',
     array['Averías urgentes', 'Cambio de grifería', 'Calderas'], 'El Astillero',
     'Urgencias de fontanería y mantenimiento de calderas.',
     'Servicio de fontanería con más de una década en la zona de El Astillero y Camargo. Atendemos averías urgentes y mantenimiento de calderas de gas.',
     array['https://picsum.photos/seed/protop-font-1/640/480'],
     '{"telefono": "600222333", "whatsapp": "600222333"}'::jsonb,
     4.2, 9,
     '{"calidad_acabado": 4.3, "puntualidad": 3.9, "cumplimiento_plazos": 4.1, "limpieza_cuidado": 4.4, "comunicacion": 4.2, "respeto_presupuesto": 4.2}'::jsonb,
     '[{"id": "identidad", "etiqueta": "Identidad verificada", "explicacion": "Protop ha comprobado el DNI/NIF del profesional."}]'::jsonb,
     false, array['el-astillero', 'camargo']),
    ('albanileria-hermanos-ruiz', 'Albañilería Hermanos Ruiz', 'albanileria',
     array['Reformas integrales', 'Tabiquería', 'Alicatados'], 'Santander',
     'Reformas integrales y trabajos de albañilería en general.',
     'Cuadrilla de albañilería con experiencia en reformas integrales de vivienda: tabiquería, alicatados, solados y coordinación con otros oficios.',
     array['https://picsum.photos/seed/protop-alb-1/640/480', 'https://picsum.photos/seed/protop-alb-2/640/480', 'https://picsum.photos/seed/protop-alb-3/640/480'],
     '{"telefono": "600333444", "email": "info@hermanosruiz.demo", "web": "https://hermanosruiz.demo"}'::jsonb,
     4.8, 41,
     '{"calidad_acabado": 4.9, "puntualidad": 4.7, "cumplimiento_plazos": 4.6, "limpieza_cuidado": 4.7, "comunicacion": 4.8, "respeto_presupuesto": 4.9}'::jsonb,
     '[{"id": "identidad", "etiqueta": "Identidad verificada", "explicacion": "Protop ha comprobado el DNI/NIF del profesional."}]'::jsonb,
     false, array['santander', 'pielagos']),
    ('pinturas-cantabria-color', 'Pinturas Cantabria Color', 'pintura',
     array['Pintura de interiores', 'Fachadas', 'Alisado de paredes'], 'Camargo',
     'Pintura de interiores, fachadas y alisado de paredes.',
     'Especialistas en pintura decorativa de interiores y fachadas. Presupuesto sin compromiso y protección de mobiliario incluida en cada trabajo.',
     array['https://picsum.photos/seed/protop-pint-1/640/480'],
     '{"telefono": "600444555", "whatsapp": "600444555"}'::jsonb,
     null, 0,
     '{}'::jsonb,
     '[]'::jsonb,
     false, array['camargo', 'santander']),
    ('carpinteria-la-bahia', 'Carpintería La Bahía', 'carpinteria',
     array['Muebles a medida', 'Puertas y armarios', 'Tarima'], 'Santa Cruz de Bezana',
     'Carpintería a medida: muebles, puertas y tarima.',
     'Taller de carpintería con más de veinte años de trayectoria. Fabricamos muebles a medida y realizamos instalación de puertas, armarios y tarima.',
     array['https://picsum.photos/seed/protop-carp-1/640/480', 'https://picsum.photos/seed/protop-carp-2/640/480'],
     '{"telefono": "600555666", "email": "taller@labahia.demo"}'::jsonb,
     4.4, 15,
     '{"calidad_acabado": 4.6, "puntualidad": 4.2, "cumplimiento_plazos": 4.1, "limpieza_cuidado": 4.5, "comunicacion": 4.4, "respeto_presupuesto": 4.5}'::jsonb,
     '[{"id": "identidad", "etiqueta": "Identidad verificada", "explicacion": "Protop ha comprobado el DNI/NIF del profesional."}]'::jsonb,
     false, array['santa-cruz-de-bezana', 'santander']),
    ('reformas-integrales-pielagos', 'Reformas Integrales Piélagos', 'reformas-generales',
     array['Reforma de cocina', 'Reforma de baño', 'Reforma integral'], 'Piélagos',
     'Reformas integrales de cocina, baño y vivienda completa.',
     'Empresa de reformas que coordina todos los oficios de principio a fin: albañilería, fontanería, electricidad, pintura y carpintería.',
     array['https://picsum.photos/seed/protop-ref-1/640/480', 'https://picsum.photos/seed/protop-ref-2/640/480'],
     '{"telefono": "600666777", "whatsapp": "600666777", "web": "https://reformaspielagos.demo"}'::jsonb,
     4.1, 6,
     '{"calidad_acabado": 4.2, "puntualidad": 3.8, "cumplimiento_plazos": 3.9, "limpieza_cuidado": 4.3, "comunicacion": 4.2, "respeto_presupuesto": 4.1}'::jsonb,
     '[{"id": "identidad", "etiqueta": "Identidad verificada", "explicacion": "Protop ha comprobado el DNI/NIF del profesional."}]'::jsonb,
     true, array['pielagos', 'santander', 'camargo'])
  ) as t(
    slug, nombre_comercial, categoria_slug, especialidades, localidad,
    descripcion_breve, descripcion, fotos_trabajos, contacto,
    puntuacion_global, trabajos_valorados, desglose_por_concepto, distintivos,
    patrocinado, zonas_slugs
  )
),
insertados as (
  insert into profesionales (
    slug, nombre_comercial, categoria_id, especialidades, localidad,
    descripcion_breve, descripcion, fotos_trabajos, contacto,
    puntuacion_global, trabajos_valorados, desglose_por_concepto, distintivos,
    patrocinado, es_demo
  )
  select
    d.slug, d.nombre_comercial, c.id, d.especialidades, d.localidad,
    d.descripcion_breve, d.descripcion, d.fotos_trabajos, d.contacto,
    d.puntuacion_global, d.trabajos_valorados, d.desglose_por_concepto, d.distintivos,
    d.patrocinado, true
  from datos d
  join categorias c on c.slug = d.categoria_slug
  returning id, slug
)
insert into profesional_zonas (profesional_id, zona_id)
select i.id, z.id
from insertados i
join datos d on d.slug = i.slug
join zonas z on z.slug = any (d.zonas_slugs);
