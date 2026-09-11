import Image from "next/image";
import Link from "next/link";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { homeShots, getProject } from "@/data/projects";

const padel = getProject("plataforma-clubes-padel")!;
const almacen = getProject("wms-almacen")!;
const evento = getProject("web-boda")!;
const radio = getProject("web-radio")!;
const asistente = getProject("asistente-ia-gestion-proyectos")!;

/** Leyenda del escenario: nombre del trabajo, nunca el tipo de relación. */
const legend = "font-mono text-[10px] uppercase tracking-[0.12em] lg:text-xs lg:tracking-[0.1em]";
/** El escenario sangra hasta los bordes del lienzo en móvil. */
const bleed = "-mx-4 md:-mx-10 lg:mx-0";

const almacenFacts = [
  {
    label: "Qué se desarrolló",
    body: "Aplicación web completa: productos, ubicaciones, stock, movimientos, recuentos, órdenes e informes.",
  },
  {
    label: "Una decisión",
    body: "El stock no se edita a mano: es la proyección de un libro de movimientos inmutable. Anular genera un movimiento compensatorio.",
  },
  {
    label: "Cómo se hizo",
    body: "Diseño y desarrollo en fases acordadas sobre una especificación funcional.",
  },
];

export function Work() {
  return (
    <section id="proyectos" aria-label="Proyectos" className="scroll-mt-6">
      <div className="container-editorial pt-16 lg:pt-24 wide:pt-[120px]">
        <div className="flex flex-col gap-2.5 md:flex-row md:items-end md:justify-between md:gap-12">
          <h2 className="text-[26px] font-semibold leading-[1.1] tracking-[-0.02em] md:text-[34px] md:leading-[1.08]">
            Trabajo reciente
          </h2>
          <p className="max-w-[460px] text-sm leading-[1.5] text-ink-mute md:text-[15px]">
            Cinco proyectos reales: software de gestión, webs y un asistente de IA.
          </p>
        </div>

        {/* Padel Club OS abre la sección en móvil: en escritorio ya ocupa el hero. */}
        <article className="mt-7 lg:hidden">
          <Link
            href={`/proyectos/${padel.slug}`}
            data-track="case_open"
            data-track-location="projects"
            data-track-project={padel.slug}
            data-tono="oscuro"
            className={`group relative block h-[360px] overflow-hidden bg-escena-padel sm:h-[420px] ${bleed}`}
          >
            <p className={`absolute left-4 top-4 text-escena-padel-texto ${legend}`}>
              {padel.sceneLabel}
            </p>
            <Image
              {...homeShots.padelAcademia}
              alt={homeShots.padelAcademia.alt}
              sizes="74vw"
              className="absolute right-0 top-12 h-auto w-[74%] max-w-[420px] border border-escena-padel-borde/55 border-r-0"
            />
            <Image
              {...homeShots.padelPortal}
              alt={homeShots.padelPortal.alt}
              sizes="30vw"
              className="absolute left-4 top-[76px] z-20 h-auto w-[30%] max-w-[150px] border border-escena-padel-borde/55"
            />
            <div className="absolute bottom-4 left-[154px] right-4">
              <h3 className="text-[15px] font-semibold leading-[1.25] text-escena-padel-texto group-hover:underline group-hover:underline-offset-4">
                {padel.title}
              </h3>
              <p className="mt-1.5 text-xs leading-[1.5] text-escena-padel-texto/85">
                {padel.summaryShort}
              </p>
              <span className="mt-2 inline-flex min-h-7 items-center gap-1.5 border-b border-escena-padel-texto/50 text-[13px] font-semibold text-escena-padel-texto">
                Ver el proyecto <span aria-hidden>→</span>
              </span>
            </div>
          </Link>
        </article>

        {/* Sistema de gestión de almacén */}
        <article className="mt-7 lg:mt-10">
          <div
            data-tono="oscuro"
            className={`relative h-[280px] overflow-hidden bg-escena-wms lg:aspect-[66/26] lg:h-auto ${bleed}`}
          >
            <p className={`absolute left-4 top-4 text-escena-wms-texto lg:left-7 lg:top-6 ${legend}`}>
              {almacen.sceneLabel}
            </p>
            <p className={`absolute right-7 top-6 hidden text-escena-wms-texto lg:block ${legend}`}>
              Web + terminal RF
            </p>
            <Image
              {...homeShots.almacenMovimientos}
              alt={homeShots.almacenMovimientos.alt}
              sizes="(min-width: 1440px) 1000px, (min-width: 1024px) 76vw, 74vw"
              className="absolute right-0 top-12 h-auto w-[74%] max-w-[420px] border border-escena-wms-borde border-r-0 lg:left-[22.73%] lg:right-auto lg:top-[12.3%] lg:w-[75.76%] lg:max-w-none lg:border-r"
            />
            <Image
              {...homeShots.almacenRf}
              alt={homeShots.almacenRf.alt}
              sizes="(min-width: 1440px) 220px, (min-width: 1024px) 17vw, 25vw"
              className="absolute left-4 top-24 z-20 h-auto w-[24.6%] max-w-[120px] border border-escena-wms-borde lg:left-[3.03%] lg:top-[18.5%] lg:w-[16.67%] lg:max-w-none"
            />
          </div>

          <div className="pt-4 lg:grid lg:grid-cols-[536fr_760fr] lg:gap-x-6 lg:pt-7">
            <div>
              <p className={`text-ink-mute lg:hidden ${legend}`}>Web + terminal RF</p>
              <h3 className="mt-2 text-[19px] font-semibold leading-[1.2] tracking-[-0.015em] lg:mt-0 lg:text-2xl lg:leading-[1.15]">
                {almacen.title}
              </h3>
              <p className="mt-2 text-sm leading-[1.55] text-ink-soft lg:mt-3 lg:text-base">
                <span className="lg:hidden">{almacen.summaryShort}</span>
                <span className="hidden lg:inline">{almacen.summary}</span>
              </p>
              <ArrowLink
                href={`/proyectos/${almacen.slug}`}
                className="mt-2 lg:mt-3 lg:min-h-8"
                trackEvent="case_open"
                trackLocation="projects"
                trackProject={almacen.slug}
              >
                Ver el proyecto
              </ArrowLink>
            </div>
            <dl className="hidden lg:grid lg:grid-cols-3 lg:gap-x-6 lg:pt-1.5">
              {almacenFacts.map((fact) => (
                <div key={fact.label}>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-mute">
                    {fact.label}
                  </dt>
                  <dd className="mt-2 text-[15px] leading-[1.5] text-ink-soft">{fact.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </article>

        {/* Web de evento y web de radio: sin nombre de cliente y sin enlace
            externo mientras no haya autorización para publicarlos. */}
        <div className="mt-7 grid gap-x-6 gap-y-7 min-[900px]:grid-cols-[536fr_760fr] lg:mt-[72px]">
          <article>
            <Link
              href={`/proyectos/${evento.slug}`}
              data-track="case_open"
              data-track-location="projects"
              data-track-project={evento.slug}
              className="group block"
            >
              <div className="relative flex h-[210px] items-center justify-center overflow-hidden border border-shot bg-escena-evento lg:block lg:aspect-[536/460] lg:h-auto">
                <p className={`absolute left-4 top-4 text-escena-evento-texto lg:left-6 lg:top-[22px] ${legend}`}>
                  {evento.sceneLabel}
                </p>
                <Image
                  {...homeShots.eventoPortada}
                  alt={homeShots.eventoPortada.alt}
                  sizes="(min-width: 900px) 42vw, 77vw"
                  className="h-auto w-[77%] max-w-[360px] border border-escena-evento-texto/20 shadow-[0_10px_28px_rgba(88,3,1,0.18)] lg:absolute lg:left-[4.5%] lg:top-[13%] lg:w-[85%] lg:max-w-none lg:shadow-[0_16px_40px_rgba(88,3,1,0.18)]"
                />
                <Image
                  {...homeShots.eventoCuenta}
                  alt={homeShots.eventoCuenta.alt}
                  sizes="42vw"
                  className="absolute left-[10.4%] top-[49.6%] hidden h-auto w-[85%] border border-escena-evento-texto/20 shadow-[0_16px_40px_rgba(88,3,1,0.18)] lg:block"
                />
              </div>
              <div className="pt-3 lg:pt-6">
                <p className={`text-ink-mute lg:hidden ${legend}`}>{evento.sceneLabel}</p>
                <h3 className="mt-1.5 text-[15px] font-semibold leading-[1.25] tracking-[-0.01em] group-hover:underline group-hover:underline-offset-4 lg:mt-0 lg:text-[22px] lg:leading-[1.15] lg:tracking-[-0.015em]">
                  {evento.title}
                </h3>
                <p className="mt-2.5 hidden text-[15px] leading-[1.55] text-ink-soft lg:block">
                  {evento.summary}
                </p>
                <p className="mt-3 hidden text-sm leading-[1.5] text-ink-mute lg:block">
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em]">Decisión · </span>
                  Consultar el horario y responder ocurre en la misma página, sin cambiar de sitio.
                </p>
                <span className="mt-1 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-cobalt underline-offset-4 transition-all duration-300 ease-editorial group-hover:gap-3 group-hover:text-cobalt-deep lg:mt-2 lg:min-h-8">
                  Ver el proyecto <span aria-hidden className="font-mono">→</span>
                </span>
              </div>
            </Link>
          </article>

          <article>
            <Link
              href={`/proyectos/${radio.slug}`}
              data-track="case_open"
              data-track-location="projects"
              data-track-project={radio.slug}
              data-tono="oscuro"
              className="group block"
            >
              <div className="relative h-[210px] overflow-hidden bg-escena-radio lg:aspect-[760/460] lg:h-auto">
                <p className={`absolute left-4 top-4 text-escena-radio-texto lg:left-7 lg:top-[22px] ${legend}`}>
                  {radio.sceneLabel}
                </p>
                <Image
                  {...homeShots.radioPortada}
                  alt={homeShots.radioPortada.alt}
                  sizes="(min-width: 900px) 50vw, 59vw"
                  className="absolute left-4 top-[52px] h-auto w-[59%] max-w-[300px] shadow-[0_10px_28px_rgba(0,0,0,0.3)] lg:left-[14.7%] lg:top-[17.8%] lg:w-[85.3%] lg:max-w-none lg:shadow-[0_16px_40px_rgba(0,0,0,0.3)]"
                />
                <Image
                  {...homeShots.radioMovil}
                  alt={homeShots.radioMovil.alt}
                  sizes="(min-width: 900px) 12vw, 25vw"
                  className="absolute right-4 top-[31px] z-20 h-auto w-[24.6%] max-w-[120px] shadow-[0_10px_28px_rgba(0,0,0,0.35)] lg:left-[3.7%] lg:right-auto lg:top-[45.2%] lg:w-[19.7%] lg:max-w-none lg:shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
                />
              </div>
              <div className="pt-3 lg:grid lg:grid-cols-2 lg:gap-x-6 lg:pt-6">
                <div>
                  <p className={`text-ink-mute lg:hidden ${legend}`}>{radio.sceneLabel}</p>
                  <h3 className="mt-1.5 text-[15px] font-semibold leading-[1.25] tracking-[-0.01em] group-hover:underline group-hover:underline-offset-4 lg:mt-0 lg:text-[22px] lg:leading-[1.15] lg:tracking-[-0.015em]">
                    {radio.title}
                  </h3>
                  <p className="mt-2.5 hidden text-[15px] leading-[1.55] text-ink-soft lg:block">
                    {radio.summary}
                  </p>
                  <span className="mt-1 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-cobalt underline-offset-4 transition-all duration-300 ease-editorial group-hover:gap-3 group-hover:text-cobalt-deep lg:mt-2 lg:min-h-8">
                    Ver el proyecto <span aria-hidden className="font-mono">→</span>
                  </span>
                </div>
                <p className="hidden text-sm leading-[1.5] text-ink-mute lg:block lg:pt-1">
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em]">Decisión · </span>
                  El reproductor permanece mientras se navega: se puede explorar el archivo sin
                  cortar la escucha.
                </p>
              </div>
            </Link>
          </article>
        </div>

        {/* Asistente de IA */}
        <article
          className={`mt-7 bg-paper-2 px-4 pb-6 pt-5 lg:mt-[72px] lg:grid lg:grid-cols-[496fr_680fr] lg:gap-x-16 lg:px-10 lg:pb-11 lg:pt-10 ${bleed}`}
        >
          <div>
            <p className={`text-ink-mute ${legend}`}>{asistente.sceneLabel}</p>
            <h3 className="mt-2 text-[17px] font-semibold leading-[1.25] tracking-[-0.01em] lg:mt-4 lg:text-2xl lg:leading-[1.15] lg:tracking-[-0.015em]">
              {asistente.title}
            </h3>
            <p className="mt-2 text-sm leading-[1.55] text-ink-soft lg:mt-3 lg:text-base">
              <span className="lg:hidden">{asistente.summaryShort}</span>
              <span className="hidden lg:inline">{asistente.summary}</span>
            </p>
            <ArrowLink
              href={`/proyectos/${asistente.slug}`}
              className="mt-1 lg:mt-4 lg:min-h-8"
              trackEvent="case_open"
              trackLocation="projects"
              trackProject={asistente.slug}
            >
              Ver el proyecto
            </ArrowLink>
          </div>
          <figure className="m-0 mt-4 flex flex-col gap-2.5 lg:mt-0">
            <Image
              {...homeShots.asistenteMovil}
              alt={homeShots.asistenteMovil.alt}
              sizes="92vw"
              className="h-auto w-full border border-shot lg:hidden"
            />
            <Image
              {...homeShots.asistente}
              alt={homeShots.asistente.alt}
              sizes="(min-width: 1440px) 712px, 50vw"
              className="hidden h-auto w-full border border-shot lg:block"
            />
            <figcaption className="hidden font-mono text-[11px] tracking-[0.06em] text-ink-mute lg:block">
              Captura de la aplicación · 49 pasos con memoria, correo, Teams y base de
              conocimiento
            </figcaption>
          </figure>
        </article>
      </div>
    </section>
  );
}
