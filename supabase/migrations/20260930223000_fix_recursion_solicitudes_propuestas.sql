-- Corrige recursión infinita entre las RLS de `solicitudes` y `propuestas`:
-- la política nueva en `solicitudes` ("...de sus propuestas enviadas")
-- consulta `propuestas`, que a su vez tiene una política ("El particular
-- ve las propuestas de sus solicitudes") que consulta `solicitudes` —
-- cada hop entre las dos tablas volvía a evaluar la política de la otra
-- ("stack depth limit exceeded"), rompiendo "Solicitudes de presupuesto"
-- para todos los profesionales. Mismo patrón que la recursión de
-- es_admin_actual() en 20260927184945: una función SECURITY DEFINER hace
-- que la consulta puntual a `propuestas` no pase por su propia RLS, lo que
-- rompe el ciclo.

create or replace function public.profesional_tiene_propuesta_en(p_solicitud_id uuid) returns boolean as $$
  select exists (
    select 1 from propuestas pr
    join profesionales p on p.id = pr.profesional_id
    where pr.solicitud_id = p_solicitud_id
    and p.user_id = auth.uid()
  );
$$ language sql stable security definer set search_path = public;

drop policy "Un profesional ve las solicitudes de sus propuestas enviadas" on solicitudes;
create policy "Un profesional ve las solicitudes de sus propuestas enviadas" on solicitudes
  for select using (public.profesional_tiene_propuesta_en(solicitudes.id));
