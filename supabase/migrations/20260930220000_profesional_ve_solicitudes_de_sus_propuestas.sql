-- Seguimiento de "Mis propuestas" en el área profesional: para mostrar el
-- título/estado de una solicitud aunque ya se haya cerrado, un profesional
-- necesita poder leer cualquier solicitud sobre la que ya ha enviado una
-- propuesta, no solo las que siguen "abierta". Sin esto, el embed de
-- PostgREST (propuestas -> solicitudes) vuelve null en silencio para esas
-- filas en cuanto el particular cierra la solicitud.

create policy "Un profesional ve las solicitudes de sus propuestas enviadas" on solicitudes
  for select using (
    exists (
      select 1 from propuestas pr
      join profesionales p on p.id = pr.profesional_id
      where pr.solicitud_id = solicitudes.id
      and p.user_id = auth.uid()
    )
  );
