import Image from "next/image";
import Link from "next/link";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { homeShots, getProject } from "@/data/projects";
import { copyEs, partirFlecha, proyectoSlugs } from "@/data/copy";

const { proyectos, destacado } = copyEs;
const [almacen, evento, radio, asistente] = proyectos.items;
const [slugAlmacen, slugEvento, slugRadio, slugAsistente] = proyectoSlugs;
const padel = getProject("plataforma-clubes-padel")!;

/**
 * Los cuatro proyectos de la rejilla llevan el mismo rótulo de enlace que el
 * destacado. Es copy que ya existe, no texto inventado: sin él las fichas de
 * evento, radio y asistente quedarían sin ninguna entrada desde la portada.
 */
const verProyecto = partirFlecha(destacado.cta);

/** Leyenda del escenario: nombre del trabajo, nunca el tipo de relación. */
const legend = "font-mono text-[10px] uppercase tracking-[0.12em] lg:text-xs lg:tracking-[0.1em]";
/** El escenario sangra hasta los bordes del lienzo en móvil. */
const bleed = "-mx-4 md:-mx-10 lg:mx-0";
const cardTitle =
  "text-[17px] font-semibold leading-[1.25] tracking-[-0.01em] lg:text-[25px] lg:leading-[1.15] lg:tracking-[-0.015em]";
const decisionLabel = "font-mono text-[11px] uppercase tracking-[0.1em]";

export function Work() {
  return (
    <section id="proyectos" aria-label="Proyectos" className="scroll-mt-6">
      <div className="container-editorial pt-16 lg:pt-24 wide:pt-[120px]">
        <div className="rejilla-editorial">
          <h2 className="display text-[26px] leading-[1.02] lg:text-[32px] wide:text-[40px]">
            {proyectos.h2}
          </h2>
          <p className="mt-3 max-w-[520px] text-[15px] leading-[1.55] text-ink-mute lg:mt-0 lg:text-base wide:text-[17px] wide:leading-[1.6]">
            {proyectos.apoyo}
          </p>
        </div>

        {/* Padel Club OS abre la sección en móvil: en escritorio ya ocupa el hero. */}
        <article className="mt-8 lg:hidden">
          <Link
            href={`/proyectos/${padel.slug}`}
            data-track="case_open"
            data-track-location="projects"
            data-track-project={padel.slug}
            data-tono="oscuro"
            className={`group relative block h-[360px] overflow-hidden bg-escena-padel sm:h-[420px] ${bleed}`}
          >
            <p className={`absolute left-4 top-4 text-escena-padel-texto ${legend}`}>
              {destacado.etiqueta}
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
                {destacado.titulo}
              </h3>
              <span className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-[13px] font-semibold text-escena-padel-texto">
                <span className="border-b border-escena-padel-texto/50">{verProyecto.texto}</span>
                <span aria-hidden>{verProyecto.flecha}</span>
              </span>
            </div>
          </Link>
        </article>

        {/* Gestión de almacén: escenario a sangre y ficha de tres filas. */}
        <article className="mt-8 lg:mt-14">
          <div
            data-tono="oscuro"
            className={`relative h-[280px] overflow-hidden bg-escena-wms lg:aspect-[66/26] lg:h-auto ${bleed}`}
          >
            <p className={`absolute left-4 top-4 text-escena-wms-texto lg:left-7 lg:top-6 ${legend}`}>
              {almacen.descriptor}
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

          <div className="rejilla-editorial pt-5 lg:pt-8">
            <div>
              <p className={`text-ink-mute lg:hidden ${legend}`}>{almacen.descriptor}</p>
              <h3 className={`mt-2 lg:mt-0 ${cardTitle}`}>{almacen.titulo}</h3>
              <p className="mt-2.5 text-sm leading-[1.55] text-ink-soft lg:mt-3.5 lg:text-base">
                {almacen.texto}
              </p>
              <ArrowLink
                href={`/proyectos/${slugAlmacen}`}
                arrow={verProyecto.flecha}
                className="mt-1.5 lg:mt-4"
                trackEvent="case_open"
                trackLocation="projects"
                trackProject={slugAlmacen}
              >
                {verProyecto.texto}
              </ArrowLink>
            </div>
            {almacen.ficha && (
              <dl className="mt-6 grid gap-y-5 border-t border-line pt-5 lg:mt-0 lg:grid-cols-3 lg:gap-x-6 lg:border-t-0 lg:pt-1.5">
                {Object.entries(almacen.ficha).map(([label, body]) => (
                  <div key={label}>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-mute lg:text-[11px] lg:tracking-[0.1em]">
                      {label}
                    </dt>
                    <dd className="mt-2 text-sm leading-[1.5] text-ink-soft lg:text-[15px]">{body}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </article>

        {/* Web de evento y web de radio: sin nombre de cliente y sin enlace externo. */}
        <div className="mt-10 grid gap-x-[88px] gap-y-10 min-[900px]:grid-cols-[536fr_696fr] lg:mt-[72px]">
          <article>
            <Link
              href={`/proyectos/${slugEvento}`}
              data-track="case_open"
              data-track-location="projects"
              data-track-project={slugEvento}
              className="group block"
            >
              <div className="relative flex h-[210px] items-center justify-center overflow-hidden border border-shot bg-escena-evento lg:block lg:aspect-[536/460] lg:h-auto">
                <p className={`absolute left-4 top-4 text-escena-evento-texto lg:left-6 lg:top-[22px] ${legend}`}>
                  {evento.descriptor}
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
              <div className="pt-4 lg:pt-6">
                <p className={`text-ink-mute lg:hidden ${legend}`}>{evento.descriptor}</p>
                <h3 className={`mt-1.5 group-hover:underline group-hover:underline-offset-4 lg:mt-0 ${cardTitle}`}>
                  {evento.titulo}
                </h3>
                <p className="mt-2.5 text-sm leading-[1.55] text-ink-soft lg:text-[15px]">
                  {evento.texto}
                </p>
                <p className="mt-3 text-sm leading-[1.5] text-ink-mute">
                  <span className={decisionLabel}>Decisión · </span>
                  {evento.decision}
                </p>
                <span className="mt-1.5 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-cobalt underline-offset-4 transition-all duration-300 ease-editorial group-hover:gap-3 group-hover:text-cobalt-deep">
                  {verProyecto.texto}
                  <span aria-hidden className="font-mono">{verProyecto.flecha}</span>
                </span>
              </div>
            </Link>
          </article>

          <article>
            <Link
              href={`/proyectos/${slugRadio}`}
              data-track="case_open"
              data-track-location="projects"
              data-track-project={slugRadio}
              data-tono="oscuro"
              className="group block"
            >
              <div className="relative h-[210px] overflow-hidden bg-escena-radio lg:aspect-[696/460] lg:h-auto">
                <p className={`absolute left-4 top-4 text-escena-radio-texto lg:left-7 lg:top-[22px] ${legend}`}>
                  {radio.descriptor}
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
              <div className="pt-4 lg:grid lg:grid-cols-2 lg:gap-x-6 lg:pt-6">
                <div>
                  <p className={`text-ink-mute lg:hidden ${legend}`}>{radio.descriptor}</p>
                  <h3 className={`mt-1.5 group-hover:underline group-hover:underline-offset-4 lg:mt-0 ${cardTitle}`}>
                    {radio.titulo}
                  </h3>
                  <p className="mt-2.5 text-sm leading-[1.55] text-ink-soft lg:text-[15px]">
                    {radio.texto}
                  </p>
                  <span className="mt-1.5 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-cobalt underline-offset-4 transition-all duration-300 ease-editorial group-hover:gap-3 group-hover:text-cobalt-deep">
                    {verProyecto.texto}
                    <span aria-hidden className="font-mono">{verProyecto.flecha}</span>
                  </span>
                </div>
                <p className="mt-3 text-sm leading-[1.5] text-ink-mute lg:mt-0 lg:pt-1">
                  <span className={decisionLabel}>Decisión · </span>
                  {radio.decision}
                </p>
              </div>
            </Link>
          </article>
        </div>

        {/* Asistente de IA: la captura va sin la marca del producto. */}
        <article
          className={`mt-10 bg-paper-2 px-4 pb-7 pt-6 lg:mt-[72px] lg:grid lg:grid-cols-[496fr_680fr] lg:gap-x-16 lg:px-10 lg:pb-11 lg:pt-10 ${bleed}`}
        >
          <div>
            <p className={`text-ink-mute ${legend}`}>{asistente.descriptor}</p>
            <h3 className={`mt-2 lg:mt-4 ${cardTitle}`}>{asistente.titulo}</h3>
            <p className="mt-2.5 text-sm leading-[1.55] text-ink-soft lg:mt-3.5 lg:text-base">
              {asistente.texto}
            </p>
            <ArrowLink
              href={`/proyectos/${slugAsistente}`}
              arrow={verProyecto.flecha}
              className="mt-1.5 lg:mt-4"
              trackEvent="case_open"
              trackLocation="projects"
              trackProject={slugAsistente}
            >
              {verProyecto.texto}
            </ArrowLink>
          </div>
          <figure className="m-0 mt-5 lg:mt-0">
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
          </figure>
        </article>
      </div>
    </section>
  );
}
