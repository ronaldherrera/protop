-- Apunta particular_id a perfiles (que a su vez referencia auth.users) en
-- lugar de a auth.users directamente, para que PostgREST pueda anidar
-- `perfiles ( nombre )` al consultar valoraciones desde la app.

alter table valoraciones drop constraint valoraciones_particular_id_fkey;
alter table valoraciones
  add constraint valoraciones_particular_id_fkey
  foreign key (particular_id) references perfiles (id);
