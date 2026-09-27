-- Corrige recursión infinita: la política "Un administrador ve todos los
-- perfiles" llama a es_admin_actual(), y esa función consultaba `perfiles`
-- sujeta a RLS, lo que volvía a evaluar la misma política una y otra vez
-- ("stack depth limit exceeded"). SECURITY DEFINER hace que esa consulta
-- puntual se ejecute sin pasar por RLS, rompiendo el ciclo.

create or replace function public.es_admin_actual() returns boolean as $$
  select coalesce((select es_admin from perfiles where id = auth.uid()), false);
$$ language sql stable security definer set search_path = public;
