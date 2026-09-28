-- Los comentarios de trabajo_comentarios son públicos (select using true),
-- pero perfiles no tenía ninguna política que dejara ver el nombre de quien
-- los escribe, así que el embed `perfiles(nombre)` volvía null para
-- cualquier visitante anónimo. Mismo patrón que ya se corrigió para
-- aclaraciones de solicitudes: quien comenta públicamente, su nombre
-- también es público en ese contexto.

create policy "Cualquiera ve el nombre de quien comenta un trabajo publico" on perfiles
  for select using (
    exists (select 1 from trabajo_comentarios where autor_id = perfiles.id)
  );
