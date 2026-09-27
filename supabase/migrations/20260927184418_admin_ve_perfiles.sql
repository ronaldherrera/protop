-- Administración necesita ver el nombre de quien envía cada valoración
-- para poder revisarla (sección 12: "revisión de perfiles... y valoraciones").

create policy "Un administrador ve todos los perfiles" on perfiles
  for select using (public.es_admin_actual());
