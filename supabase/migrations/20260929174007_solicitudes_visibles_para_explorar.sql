-- El muro del profesional deja explorar libremente todas las solicitudes
-- abiertas (no solo las de su oficio/zona), para "filtrar de forma libre".
-- Responder sigue restringido a las que de verdad encajan: la política de
-- "propuestas" (zonas_coinciden + categoría) no cambia.

drop policy "Profesionales ven solicitudes abiertas que encajan" on solicitudes;
create policy "Profesionales ven todas las solicitudes abiertas" on solicitudes
  for select using (
    estado = 'abierta'
    and exists (select 1 from profesionales p where p.user_id = auth.uid())
  );
