-- El particular y los profesionales que participan en una misma solicitud
-- (aclaraciones, comparación de propuestas) necesitan ver el nombre del
-- otro. La única política de select existente en `perfiles` era "ver el
-- propio perfil" (+ administración), así que el embed `perfiles(nombre)`
-- devolvía null para cualquier otro participante.

create policy "Participantes de una misma solicitud ven el nombre de los demas" on perfiles
  for select using (
    exists (
      select 1 from solicitudes s
      where (
        s.particular_id = perfiles.id
        or exists (
          select 1 from propuestas pr
          join profesionales p on p.id = pr.profesional_id
          where pr.solicitud_id = s.id and p.user_id = perfiles.id
        )
      )
      and (
        s.particular_id = auth.uid()
        or exists (
          select 1 from propuestas pr2
          join profesionales p2 on p2.id = pr2.profesional_id
          where pr2.solicitud_id = s.id and p2.user_id = auth.uid()
        )
      )
    )
  );
