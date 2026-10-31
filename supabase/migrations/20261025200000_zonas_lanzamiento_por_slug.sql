-- 20260928185429_zonas_toda_espana actualizó las 6 zonas de lanzamiento por su id de la base
-- antigua. En una base nueva esos ids no existen y Santander, Camargo… se quedaban sin
-- comunidad ni código INE (y fuera de los filtros por «Cantabria»). Aquí se corrigen por slug.
update zonas as z
set tipo = 'municipio', comunidad_slug = 'cantabria', ine_id = d.ine_id
from (
  values
    ('santander', '39075'),
    ('camargo', '39016'),
    ('el-astillero', '39008'),
    ('santa-cruz-de-bezana', '39073'),
    ('pielagos', '39052'),
    ('castro-urdiales', '39020')
) as d (slug, ine_id)
where z.slug = d.slug
  and (z.comunidad_slug is distinct from 'cantabria' or z.ine_id is distinct from d.ine_id);
