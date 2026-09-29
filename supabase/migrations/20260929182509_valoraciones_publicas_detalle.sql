-- La ficha pública solo mostraba el desglose AGREGADO por concepto. Ahora
-- también se puede ver, para cada valoración aprobada, en qué trabajo se
-- basó (descripcion_trabajo) — pero sin exponer nunca quién la escribió
-- (particular_id) ni la ruta de la factura, que siguen siendo privadas.
--
-- valoraciones tiene RLS que solo deja ver a su autor o a un admin, así
-- que en vez de abrir esa tabla entera al público se crea una vista con
-- únicamente las columnas seguras, filtrada a estado = 'aprobada'. Al no
-- llevar `security_invoker`, la vista se ejecuta con el propietario
-- (bypass de RLS de la tabla base) y se le da grant de SELECT a
-- anon/authenticated explícitamente — la tabla original sigue bloqueada.

create view public.valoraciones_publicas as
select
  id,
  profesional_id,
  descripcion_trabajo,
  created_at,
  calidad_acabado,
  puntualidad,
  cumplimiento_plazos,
  limpieza_cuidado,
  comunicacion,
  respeto_presupuesto
from valoraciones
where estado = 'aprobada';

grant select on public.valoraciones_publicas to anon, authenticated;
