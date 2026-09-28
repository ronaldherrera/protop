-- Reestructura el directorio de oficios en dos niveles: familias (grupos
-- amplios, con icono de marca) y categorías (oficios concretos dentro de
-- cada familia, con su propio icono). No hay profesionales ni solicitudes
-- reales todavía (solo demo), así que se puede remapear sin riesgo.

create table familias (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  slug text not null unique,
  icono_url text,
  orden int not null default 0,
  created_at timestamptz not null default now()
);

alter table categorias add column familia_id uuid references familias (id);
alter table categorias add column icono_url text;

alter table familias enable row level security;

create policy "Familias visibles para todas" on familias
  for select using (true);

insert into familias (nombre, slug, icono_url, orden) values
  ('Reformas integrales', 'reformas-integrales', '/iconos/icono-reformas-integrales.svg', 1),
  ('Instalaciones', 'instalaciones', '/iconos/icono-instalacviones.svg', 2),
  ('Carpintería y cerramientos', 'carpinteria-cerramientos', '/iconos/icono-carpinteria-cerramientos.svg', 3),
  ('Mantenimiento y exterior', 'mantenimiento-exterior', '/iconos/icono-mantenimiento-exterior.svg', 4),
  ('Especialidades y otros', 'especialidades-otros', '/iconos/icono-especialidades-otros.svg', 5);

-- Las 3 categorías antiguas que tienen un equivalente directo se actualizan
-- en el sitio (mismo id, mismo slug): así los profesionales de demo que ya
-- las usan quedan enlazados sin necesidad de remapeo.
update categorias set
  nombre = 'Electricidad y comunicación',
  icono_url = '/iconos/icono-electricidad.svg',
  familia_id = (select id from familias where slug = 'instalaciones'),
  orden = 2
where slug = 'electricidad';

update categorias set
  nombre = 'Fontanería',
  icono_url = '/iconos/icono-fontaneria.svg',
  familia_id = (select id from familias where slug = 'instalaciones'),
  orden = 1
where slug = 'fontaneria';

update categorias set
  nombre = 'Albañilería',
  icono_url = '/iconos/icono-albañileria.svg',
  familia_id = (select id from familias where slug = 'reformas-integrales'),
  orden = 1
where slug = 'albanileria';

-- El resto de categorías nuevas, sin equivalente directo, se insertan.
insert into categorias (nombre, slug, icono_url, familia_id, orden)
select v.nombre, v.slug, v.icono_url, f.id, v.orden
from (values
  ('Pintura y decoración', 'pintura-decoracion', '/iconos/icono-pintura-decoracion.svg', 'reformas-integrales', 2),
  ('Pladur y falsos techos', 'pladur-falsos-techos', '/iconos/icono-pladur-falsos-techos.svg', 'reformas-integrales', 3),
  ('Suelos y tarimas', 'suelos-tarimas', '/iconos/icono-suelos-tarimas.svg', 'reformas-integrales', 4),

  ('Gas y calefacción', 'gas-calefaccion', '/iconos/icono-gas.svg', 'instalaciones', 3),
  ('Climatización y aire acondicionado', 'climatizacion', '/iconos/icono-climatizacion.svg', 'instalaciones', 4),
  ('Energía solar y placas fotovoltaicas', 'energia-solar', '/iconos/icono-renovables.svg', 'instalaciones', 5),

  ('Carpintería de madera', 'carpinteria-madera', '/iconos/icono-carpinteria-madera.svg', 'carpinteria-cerramientos', 1),
  ('Carpintería de aluminio y PVC', 'carpinteria-aluminio-pvc', '/iconos/icono-carpinteria-metalica.svg', 'carpinteria-cerramientos', 2),
  ('Puertas y ventanas', 'puertas-ventanas', '/iconos/icono-puertas-ventanas.svg', 'carpinteria-cerramientos', 3),
  ('Persianas y cerramientos', 'persianas-cerramientos', '/iconos/icono-cerramientos.svg', 'carpinteria-cerramientos', 4),

  ('Limpieza de viviendas o locales', 'limpieza', '/iconos/icono-limpieza.svg', 'mantenimiento-exterior', 1),
  ('Jardinería', 'jardineria', '/iconos/icono-jardineria.svg', 'mantenimiento-exterior', 2),
  ('Poda y mantenimiento de zonas verdes', 'poda-zonas-verdes', '/iconos/icono-poda.svg', 'mantenimiento-exterior', 3),
  ('Piscinas', 'piscinas', '/iconos/icono-piscinas.svg', 'mantenimiento-exterior', 4),

  ('Impermeabilizaciones', 'impermeabilizaciones', '/iconos/icono-tejados.svg', 'especialidades-otros', 1),
  ('Aislamiento térmico o acústico', 'aislamiento', '/iconos/icono-aislamiento.svg', 'especialidades-otros', 2),
  ('Rehabilitación de fachadas', 'rehabilitacion-fachadas', '/iconos/icono-fachadas.svg', 'especialidades-otros', 3),
  ('Derribos y desescombros', 'derribos-desescombros', '/iconos/icono-derribos.svg', 'especialidades-otros', 4),
  ('Reparaciones urgentes 24h', 'urgencias-24h', '/iconos/icono-urgencias.svg', 'especialidades-otros', 5)
) as v(nombre, slug, icono_url, familia_slug, orden)
join familias f on f.slug = v.familia_slug;

-- Reasigna a las nuevas categorías los profesionales que usaban las 3
-- antiguas que no tienen equivalente directo (pintura, carpintería,
-- reformas generales), y luego borra esas 3 filas ya huérfanas.
update profesionales set categoria_id = (select id from categorias where slug = 'pintura-decoracion')
where categoria_id = (select id from categorias where slug = 'pintura' and familia_id is null);

update profesionales set categoria_id = (select id from categorias where slug = 'carpinteria-madera')
where categoria_id = (select id from categorias where slug = 'carpinteria' and familia_id is null);

update profesionales set categoria_id = (select id from categorias where slug = 'albanileria')
where categoria_id = (select id from categorias where slug = 'reformas-generales' and familia_id is null);

delete from categorias where familia_id is null;

alter table categorias alter column familia_id set not null;
