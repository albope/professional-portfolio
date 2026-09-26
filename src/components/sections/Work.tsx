import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { TextLink } from "@/components/ui/TextLink";
import {
  copyEs,
  proyectoDestacado,
  proyectoTambien,
  proyectoTarjetas,
  type ProyectoTarjeta,
} from "@/data/copy";
import { cn } from "@/lib/utils";

const { proyectos } = copyEs;
const { destacado } = proyectos;

/** Ancho del escenario en un tramo de pantalla: consulta (vacía = el resto), ancho y unidad. */
type Tramo = readonly [consulta: string, ancho: number, unidad: "px" | "vw"];

/**
 * Anchos del escenario de cada proyecto, con el contenedor a su máximo de
 * 1200 px y un 5 % de margen a cada lado por debajo (especificación 2.3):
 * - Padel Club OS: la columna de 7fr desde 1024 (667 px) y el contenedor
 *   entero por debajo (90 vw).
 * - Tarjetas: un tercio desde 1024 (368 px), media fila de 700 a 1023, donde
 *   van imagen | texto (45 vw), y el contenedor entero por debajo (90 vw).
 */
const ESCENARIO_PADEL: readonly Tramo[] = [
  ["(min-width: 1024px)", 667, "px"],
  ["", 90, "vw"],
];
const ESCENARIO_TARJETA: readonly Tramo[] = [
  ["(min-width: 1024px)", 368, "px"],
  ["(min-width: 700px)", 45, "vw"],
  ["", 90, "vw"],
];

/**
 * `sizes` de una captura a partir de la parte del escenario que ocupa
 * (0,84 = el 84 % de su ancho). Así el navegador pide los píxeles que va a
 * pintar y no los de la pantalla entera: la captura del almacén mide
 * 3200 px de origen y en la tarjeta ocupa unos 430.
 */
function sizes(escenario: readonly Tramo[], parte: number) {
  return escenario
    .map(([consulta, ancho, unidad]) => [consulta, `${Math.round(ancho * parte)}${unidad}`].filter(Boolean).join(" "))
    .join(", ");
}

/**
 * Detalle ampliado del evento: la imagen entera a 504,5 % dentro de un marco
 * del 72 % de la tarjeta, o sea, unas 3,63 veces el escenario. La franja usa
 * el mismo `sizes` a propósito: las dos piden la misma URL y la captura, de
 * 27 KB, se descarga una sola vez.
 */
const SIZES_EVENTO = sizes(ESCENARIO_TARJETA, 0.72 * 5.045);

/**
 * Marco de una captura dentro de su escenario: posición absoluta, radio de
 * 8 px, sombra de captura y fondo blanco mientras carga. Los móviles cambian
 * radio y sombra (marco de tinta de 4 o 5 px) por `className`.
 */
function Shot({ className, children }: { className: string; children: ReactNode }) {
  return (
    <div className={cn("absolute block overflow-hidden rounded-shot bg-surface shadow-capture", className)}>
      {children}
    </div>
  );
}

/** Clases de la imagen dentro de su marco: ocupa el ancho y conserva su proporción. */
const IMG = "block h-auto w-full";

/**
 * Reencuadre de cada tarjeta (especificación 3.4, ajuste 9 del jurado), en el
 * orden de `copy.proyectos.tarjetas`. Las posiciones son las del prototipo.
 * - Almacén: el listado de movimientos desborda a la derecha y el terminal
 *   de lectura asoma por abajo.
 * - Radio: la web de escritorio al fondo, para que se vean el menú y el
 *   reproductor fijo, y el móvil delante tapando la zona difuminada.
 * - Evento: solo la franja clara de la web (sin el bloque granate) y un
 *   detalle ampliado del selector «ES / FR» y de «Confirmar asistencia». El
 *   detalle repite lo que ya dice el `alt` de la franja: va `aria-hidden`.
 */
const reencuadres: ReadonlyArray<(tarjeta: ProyectoTarjeta) => ReactNode> = [
  (tarjeta) => (
    <>
      <Shot className="left-[7%] top-[12%] w-[118%]">
        <Image
          src="/proyectos/almacen/movimientos.png"
          width={3200}
          height={1800}
          alt={tarjeta.alt_principal}
          sizes={sizes(ESCENARIO_TARJETA, 1.18)}
          className={IMG}
        />
      </Shot>
      <Shot className="-bottom-[30%] right-[7%] w-[30%] rounded-[12px] shadow-phone">
        <Image
          src="/proyectos/almacen/rf-entrada.png"
          width={960}
          height={1600}
          alt={tarjeta.alt_secundaria}
          sizes={sizes(ESCENARIO_TARJETA, 0.3)}
          className={IMG}
        />
      </Shot>
    </>
  ),
  (tarjeta) => (
    <>
      <Shot className="left-[6%] top-[11%] w-[104%]">
        <Image
          src="/proyectos/radio/portada-anonima.jpg"
          width={1296}
          height={593}
          alt={tarjeta.alt_principal}
          sizes={sizes(ESCENARIO_TARJETA, 1.04)}
          className={IMG}
        />
      </Shot>
      <Shot className="left-[34%] top-[18%] w-[36%] rounded-card shadow-phone">
        <Image
          src="/proyectos/radio/movil.jpg"
          width={514}
          height={786}
          alt={tarjeta.alt_secundaria}
          sizes={sizes(ESCENARIO_TARJETA, 0.36)}
          className={IMG}
        />
      </Shot>
    </>
  ),
  (tarjeta) => (
    <>
      {/* 1120/276: la franja clara de arriba, sin el bloque granate. */}
      <Shot className="left-[7%] top-[11%] aspect-[1120/276] w-[128%]">
        <Image
          src="/proyectos/evento/cuenta-anonima.jpg"
          width={1120}
          height={512}
          alt={tarjeta.alt_principal}
          sizes={SIZES_EVENTO}
          className={IMG}
        />
      </Shot>
      {/* Recorta la zona x 897..1120, y 2..40 del original. El fondo es el de la
          propia web, para que el recorte no parpadee en blanco mientras carga. */}
      <div
        className="absolute right-[6%] top-[60%] aspect-[222/38] w-[72%] overflow-hidden rounded-[6px] bg-[#E9E9E1] shadow-[0_0_0_1px_rgba(16,16,19,.08),0_24px_40px_-18px_rgba(16,16,19,.45)]"
        aria-hidden="true"
      >
        <Image
          src="/proyectos/evento/cuenta-anonima.jpg"
          width={1120}
          height={512}
          alt={tarjeta.alt_secundaria}
          sizes={SIZES_EVENTO}
          className="-ml-[404%] -mt-[0.9%] block h-auto w-[504.5%] max-w-none"
        />
      </div>
    </>
  ),
];

/** El último término de la ficha de Padel Club OS es «Hoy»: lleva el cuadrado cobalto de «hecho». */
const FILA_HOY = destacado.ficha.length - 1;

/**
 * Proyectos (especificación 3.4). Banda blanca con filetes y cabecera apilada,
 * para romper el patrón partido de «Qué hacemos». Todo son capturas reales
 * (`next/image`, diferidas y sin `preload`: ninguna es el LCP) en escenarios
 * arena, y ningún proyecto dice qué relación tiene con BPM Tech.
 *
 * - Padel Club OS, el único con nombre y enlace externo: captura de la
 *   academia con el portal del jugador en el móvil delante, y la ficha
 *   «Para el club / Para el jugador / Hoy». Desde 1024 px, 7fr | 5fr.
 * - Tres tarjetas con su reencuadre: una columna en móvil, imagen | texto de
 *   700 a 1023 y tres columnas desde 1024.
 * - Una mención menor del asistente, sin captura.
 *
 * Cada enlace a una ficha mide `case_open` con el slug del proyecto. Sin
 * efectos de elevación al pasar el ratón: la quietud es intencionada.
 */
export function Work() {
  return (
    <section id="proyectos" aria-labelledby="proyectos-titulo" className="section border-y border-line bg-surface">
      <div className="wrap">
        <header className="sec-head max-w-[760px]" data-reveal>
          <h2 id="proyectos-titulo" className="text-h2">
            {proyectos.h2}
          </h2>
          <p className="max-w-[36em] text-lead text-ink-2">{proyectos.entradilla}</p>
        </header>

        <article
          id={proyectoDestacado.ancla}
          className="mb-[clamp(56px,7vw,96px)] grid gap-8 1024:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] 1024:items-center 1024:gap-14"
        >
          <div className="relative aspect-[16/11] overflow-hidden rounded-feature bg-sand" data-reveal>
            <Shot className="left-[6%] top-[8%] w-[84%]">
              <Image
                src="/proyectos/padel/academia.png"
                width={1280}
                height={720}
                alt={destacado.alt_escritorio}
                sizes={sizes(ESCENARIO_PADEL, 0.84)}
                className={IMG}
              />
            </Shot>
            {/* Por debajo de 600 px el móvil crece al 30 % para que se lea. Su
                `sizes` usa ese 30 %, el mayor de sus dos anchos. */}
            <Shot className="-bottom-[24%] right-[5%] w-[30%] rounded-[18px] shadow-phone-lg 600:-bottom-[18%] 600:w-[24%]">
              <Image
                src="/proyectos/padel/portal-movil.png"
                width={390}
                height={884}
                alt={destacado.alt_movil}
                sizes={sizes(ESCENARIO_PADEL, 0.3)}
                className={IMG}
              />
            </Shot>
          </div>

          <div className="grid content-start gap-[22px]" data-reveal style={{ "--rd": 1 } as CSSProperties}>
            <p className="text-small text-ink-2">{destacado.antetitulo}</p>
            <h3 className="-mt-3 text-feature-name">{destacado.nombre}</h3>
            <dl className="border-t border-line">
              {destacado.ficha.map(({ termino, definicion }, index) => (
                <div
                  key={termino}
                  className="grid grid-cols-1 gap-1 border-b border-line py-3.5 600:grid-cols-[8.5em_minmax(0,1fr)] 600:gap-4"
                >
                  <dt className="text-small font-semibold">{termino}</dt>
                  <dd className={cn("text-small leading-[1.55]", index === FILA_HOY ? "text-ink" : "text-ink-2")}>
                    {index === FILA_HOY && (
                      <i className="mr-2 inline-block size-[9px] bg-cobalt align-[1px]" aria-hidden="true" />
                    )}
                    {definicion}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-1">
              <ArrowLink
                href={`/proyectos/${proyectoDestacado.slug}`}
                trackEvent="case_open"
                trackLocation="projects"
                trackProject={proyectoDestacado.slug}
              >
                {destacado.caso}
              </ArrowLink>
              <TextLink href={proyectoDestacado.web} external standalone>
                {destacado.web}
              </TextLink>
            </div>
          </div>
        </article>

        <div className="grid gap-12 1024:grid-cols-3">
          {proyectos.tarjetas.map((tarjeta, index) => {
            const { ancla, slug } = proyectoTarjetas[index];
            return (
              <article
                key={ancla}
                id={ancla}
                className="grid content-start gap-3.5 700:max-[1023px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] 700:max-[1023px]:content-center 700:max-[1023px]:items-start 700:max-[1023px]:gap-x-9 700:max-[1023px]:gap-y-2.5"
                data-reveal
                style={{ "--rd": index } as CSSProperties}
              >
                {/* De 700 a 1023 la imagen ocupa la primera columna y las cinco
                    filas, y el texto se apila a su lado. */}
                <div className="relative mb-2.5 aspect-[4/3] overflow-hidden rounded-card bg-sand 700:max-[1023px]:row-span-5 700:max-[1023px]:mb-0">
                  {reencuadres[index](tarjeta)}
                </div>
                <p className="text-caption text-ink-2">{tarjeta.etiqueta}</p>
                <h3 className="text-h3">{tarjeta.titulo}</h3>
                <p className="text-small leading-[1.55] text-ink-2">{tarjeta.descripcion}</p>
                {/* `justify-self-start`: el área del enlace es su texto, no la fila entera. */}
                <ArrowLink
                  href={`/proyectos/${slug}`}
                  className="justify-self-start text-small"
                  trackEvent="case_open"
                  trackLocation="projects"
                  trackProject={slug}
                >
                  {tarjeta.caso}
                </ArrowLink>
              </article>
            );
          })}
        </div>

        <p
          className="mt-[clamp(48px,6vw,72px)] max-w-[62em] border-t border-line pt-6 text-small text-ink-2"
          data-reveal
        >
          <strong className="font-semibold text-ink">{proyectos.tambien.rotulo}</strong> {proyectos.tambien.texto}{" "}
          <TextLink
            href={`/proyectos/${proyectoTambien.slug}`}
            className="whitespace-nowrap"
            trackEvent="case_open"
            trackLocation="projects"
            trackProject={proyectoTambien.slug}
          >
            {proyectos.tambien.caso}
          </TextLink>
        </p>
      </div>
    </section>
  );
}
