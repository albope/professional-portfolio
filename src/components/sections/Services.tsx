import type { CSSProperties } from "react";
import { AgendaArt } from "@/components/services/AgendaArt";
import { ArtStage } from "@/components/services/ArtStage";
import { BuildArt } from "@/components/services/BuildArt";
import { ConnectArt } from "@/components/services/ConnectArt";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Button } from "@/components/ui/Button";
import { TextLink } from "@/components/ui/TextLink";
import {
  copyEs,
  proyectoDestacado,
  proyectoTarjetas,
  servicioCasos,
  servicioNeeds,
  type ServicioItem,
} from "@/data/copy";
import { contactHref } from "@/data/site";

const { servicios } = copyEs;

/** Slug de cada ancla de caso (`#padel` → `plataforma-clubes-padel`), para medir el clic. */
const slugPorAncla: Record<string, string> = Object.fromEntries(
  [proyectoDestacado, ...proyectoTarjetas].map(({ ancla, slug }) => [`#${ancla}`, slug]),
);

/**
 * Cada servicio se dibuja según la forma de su copy: la agenda trae `dias`,
 * la conexión trae `origen` y la web solo su `aria`. La conexión se repite en
 * cada entrada en pantalla (`each`), las otras dos se reproducen una vez.
 */
function ServiceArt({ ilustracion }: { ilustracion: ServicioItem["ilustracion"] }) {
  if (ilustracion.dias) {
    return (
      <ArtStage>
        <AgendaArt aria={ilustracion.aria} titulo={ilustracion.titulo} dias={ilustracion.dias} />
      </ArtStage>
    );
  }
  if (ilustracion.origen) {
    return (
      <ArtStage mode="each">
        <ConnectArt
          aria={ilustracion.aria}
          origen={ilustracion.origen}
          destino={ilustracion.destino}
          pie_origen={ilustracion.pie_origen}
          pie_destino={ilustracion.pie_destino}
        />
      </ArtStage>
    );
  }
  return (
    <ArtStage>
      <BuildArt aria={ilustracion.aria} />
    </ArtStage>
  );
}

/**
 * Qué hacemos (especificación 3.3). La única sección con la cabecera partida:
 * desde 980 px, el titular a la izquierda (7fr) y la entradilla a la derecha
 * (5fr), alineada abajo.
 *
 * Tres servicios. Cada uno cuenta para cuándo sirve antes de qué es, pone un
 * ejemplo y ofrece dos salidas: la consulta con su tema ya marcado en el
 * formulario (`/?necesidad=<clave>#contacto`: sin JS el enlace lleva al
 * formulario, pero marcar el tema necesita JS) y el caso de esta misma
 * página que lo demuestra. Una columna hasta 699 px, ilustración | texto de 700 a 1023 y
 * tres columnas desde 1024.
 *
 * El cierre recoge a quien no sabe en qué servicio encaja: botón fantasma con
 * el tema «Todavía no lo tengo claro» preseleccionado.
 */
export function Services() {
  return (
    <section id="que-hacemos" aria-labelledby="que-hacemos-titulo" className="section bg-bg pt-section-tight">
      <div className="wrap">
        <header className="sec-head 980:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] 980:items-end 980:gap-x-16" data-reveal>
          <h2 id="que-hacemos-titulo" className="text-h2">
            {servicios.h2}
          </h2>
          <p className="max-w-[36em] text-lead text-ink-2 980:pb-1.5">{servicios.entradilla}</p>
        </header>

        <div className="grid gap-14 1024:grid-cols-3 1024:gap-10">
          {servicios.items.map((item, index) => {
            const need = servicioNeeds[index];
            const caso = servicioCasos[index];
            return (
              <article
                key={need}
                className="flex flex-col 700:grid 700:grid-cols-2 700:items-center 700:gap-8 1024:flex 1024:items-stretch 1024:gap-0"
                data-reveal
                style={{ "--rd": index } as CSSProperties}
              >
                <ServiceArt ilustracion={item.ilustracion} />
                {/* De 700 a 1023 el texto va al lado de la ilustración y centrado con
                    ella: ahí sobra el aire de arriba que la separa cuando va debajo. */}
                {/* Desde 1024 px los tres artículos miden lo mismo (la fila de la
                    rejilla) y el texto se estira hasta abajo: los enlaces van
                    al fondo (`mt-auto`) y forman línea en las tres columnas. */}
                <div className="grid content-start gap-2.5 pt-[26px] 700:pt-0 1024:flex 1024:flex-1 1024:flex-col 1024:pt-[26px]">
                  <h3 className="text-h3">{item.titulo}</h3>
                  <p className="text-base font-medium leading-[1.45]">{item.para_cuando}</p>
                  <p className="text-base leading-[1.55] text-ink-2">{item.descripcion}</p>
                  <p className="text-small leading-[1.55] text-ink-2">{item.ejemplo}</p>
                  {/* Cada enlace mide 40 px de alto táctil (5.3): el margen de arriba
                      descuenta ese aire para que el primero quede donde en la referencia. */}
                  <div className="mt-1 flex flex-col items-start text-small 1024:mt-auto 1024:pt-1">
                    <ArrowLink
                      href={contactHref({ need })}
                      tone="cobalt"
                      trackLocation="service"
                      trackDestination="contact"
                      trackNeed={need}
                    >
                      {item.consulta}
                    </ArrowLink>
                    <TextLink
                      href={caso}
                      standalone
                      trackLocation="service"
                      trackDestination="projects"
                      trackNeed={need}
                      trackProject={slugPorAncla[caso]}
                    >
                      {item.caso}
                    </TextLink>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div
          className="mt-[clamp(48px,6vw,80px)] flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-line pt-7"
          data-reveal
        >
          <p className="max-w-[34em] text-[1.125rem] leading-[1.6]">{servicios.cierre.texto}</p>
          <Button
            href={contactHref({ need: "diagnostico" })}
            variant="ghost"
            arrow
            trackLocation="service"
            trackNeed="diagnostico"
          >
            {servicios.cierre.boton}
          </Button>
        </div>
      </div>
    </section>
  );
}
