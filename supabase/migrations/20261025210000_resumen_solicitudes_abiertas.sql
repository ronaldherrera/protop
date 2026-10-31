-- Recuento público de solicitudes abiertas por oficio, para enseñar a los profesionales que
-- hay trabajo esperando. Solo devuelve cifras agregadas: ni títulos, ni zonas, ni personas.
-- Las solicitudes en sí siguen visibles únicamente para profesionales registrados (RLS).
create or replace function public.resumen_solicitudes_abiertas()
returns table (categoria_slug text, abiertas integer)
language sql
stable
security definer
set search_path = public
as $$
  select c.slug, count(*)::integer
  from solicitudes s
  join categorias c on c.id = s.categoria_id
  where s.estado = 'abierta'
  group by c.slug
$$;

revoke all on function public.resumen_solicitudes_abiertas() from public;
grant execute on function public.resumen_solicitudes_abiertas() to anon, authenticated;
