import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { portadaDeProfesional } from "../../features/directorio/imagen";
import { cn } from "../../lib/cn";
import type { Profesional } from "../../types/profesional";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Puntuacion } from "../ui/Puntuacion";
import { IconoCategoria } from "./IconoCategoria";

/**
 * Cada profesional se presenta como la tarjeta de visita que dejaría clavada en el tablón:
 * apaisada, con el nombre comercial como protagonista y la reputación en el pie.
 */
export function TarjetaProfesional({
  profesional,
  patrocinado = false,
}: {
  profesional: Profesional;
  patrocinado?: boolean;
}) {
  const otrosOficios = profesional.oficios.length - 1;
  const portada = portadaDeProfesional(profesional);
  const esLogo = portada.tipo === "logo";

  return (
    <Link
      to={`/profesionales/${profesional.slug}`}
      className={cn(
        "group flex min-w-0 flex-col overflow-hidden rounded-tarjeta bg-carton shadow-tarjeta transition-shadow",
        "hover:shadow-tarjeta-alzada focus-visible:shadow-tarjeta-alzada",
      )}
    >
      <img
        src={portada.src}
        alt={
          portada.tipo === "cartel"
            ? ""
            : esLogo
              ? `Logotipo de ${profesional.nombreComercial}`
              : `Trabajo de ${profesional.nombreComercial}`
        }
        width={1200}
        height={560}
        loading="lazy"
        className={cn(
          "aspect-[15/7] w-full shrink-0",
          esLogo
            ? "border-b border-neutral-100 bg-white object-contain px-6 py-2"
            : "object-cover",
        )}
      />
      <div className="flex flex-1 flex-col p-5 pt-4">
        <div className="flex items-center justify-between gap-3">
          <p className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-neutral-600">
            <IconoCategoria
              iconoUrl={profesional.categoriaIconoUrl}
              nombre={profesional.categoriaNombre}
              className="h-4 w-4 shrink-0"
            />
            <span className="truncate">{profesional.categoriaNombre}</span>
            {otrosOficios > 0 && (
              <span className="shrink-0 text-neutral-400">
                y {otrosOficios}{" "}
                {otrosOficios === 1 ? "oficio más" : "oficios más"}
              </span>
            )}
          </p>
          <div className="flex shrink-0 gap-1.5">
            {profesional.esDemo && <Badge tono="ejemplo">Ejemplo</Badge>}
            {patrocinado && <Badge tono="patrocinado">Patrocinado</Badge>}
          </div>
        </div>

        <div className="mb-4 mt-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="titular line-clamp-2 text-[1.6rem] leading-[1.05] text-neutral-900 group-hover:text-brand-700">
              {profesional.nombreComercial}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm text-neutral-600">
              {profesional.descripcionBreve}
            </p>
          </div>
          {!esLogo && (
            <Avatar
              nombre={profesional.nombreComercial}
              fotoUrl={profesional.fotoPerfilUrl}
              className="h-14 w-14 shrink-0 rounded-xl object-cover text-lg"
            />
          )}
        </div>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-4 gap-y-2 border-t-[1.5px] border-dashed border-neutral-200 pt-3">
          <Puntuacion
            puntuacion={profesional.puntuacionGlobal}
            trabajosValorados={profesional.trabajosValorados}
            tamano="sm"
          />
          <p className="flex items-center gap-1 text-sm text-neutral-600">
            <MapPin
              className="h-4 w-4 shrink-0 text-neutral-400"
              aria-hidden="true"
            />
            {profesional.localidad}
          </p>
        </div>
      </div>
    </Link>
  );
}
