import Image from "next/image";
import Link from "next/link";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { homeShots, getProject } from "@/data/projects";
import { copyEs, partirFlecha, proyectoSlugs } from "@/data/copy";

const { proyectos, destacado } = copyEs;
const verProyecto = partirFlecha(destacado.cta);
const padel = getProject("plataforma-clubes-padel")!;
const cards = [
  { item: proyectos.items[0], slug: proyectoSlugs[0], shot: homeShots.almacenMovimientos, scene: "bg-escena-wms" },
  { item: proyectos.items[1], slug: proyectoSlugs[1], shot: homeShots.radioPortada, scene: "bg-escena-radio" },
];

export function Work() {
  return (
    <section id="proyectos" aria-labelledby="work-title" className="border-t border-line bg-paper">
      <div className="container-editorial seccion">
        <div className="grid items-end gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div>
            <p className="label-mono text-cobalt">{proyectos.kicker}</p>
            <h2 id="work-title" className="display mt-4 max-w-[700px] text-display-sec">{proyectos.h2}</h2>
          </div>
          <p className="max-w-[460px] text-base leading-relaxed text-ink-soft">{proyectos.apoyo}</p>
        </div>

        <article className="mt-10 grid overflow-hidden border border-line lg:grid-cols-[0.85fr_1.15fr]">
          <div className="flex flex-col items-start bg-paper-2 p-6 md:p-9 wide:p-11">
            <p className="label-mono text-[10px] leading-relaxed text-ink-mute">{destacado.etiqueta}</p>
            <h3 className="mt-5 text-[clamp(28px,3vw,42px)] font-semibold leading-[1.08] tracking-[-0.035em]">{destacado.titulo}</h3>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">{destacado.texto}</p>
            <dl className="mt-6 space-y-4 border-t border-line-2 pt-5">
              <div>
                <dt className="text-xs font-semibold text-ink">{proyectos.problema_rotulo}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-ink-mute">{destacado.problema}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-ink">{proyectos.solucion_rotulo}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-ink-mute">{destacado.resultado}</dd>
              </div>
            </dl>
            <ArrowLink href={`/proyectos/${padel.slug}`} arrow={verProyecto.flecha} className="mt-6" trackEvent="case_open" trackLocation="projects" trackProject={padel.slug}>{verProyecto.texto}</ArrowLink>
          </div>
          <Link href={`/proyectos/${padel.slug}`} aria-label={`${verProyecto.texto}: ${destacado.titulo}`} data-track="case_open" data-track-location="projects" data-track-project={padel.slug} data-tono="oscuro" className="group relative flex min-h-[270px] items-center overflow-hidden bg-escena-padel p-5 py-14 sm:min-h-[360px] sm:p-9">
            <span className="absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[0.1em] text-paper/82 sm:left-9">{proyectos.captura}</span>
            <Image {...homeShots.padelRecepcion} alt={homeShots.padelRecepcion.alt} sizes="(min-width: 1440px) 630px, (min-width: 1024px) 48vw, 90vw" className="h-auto w-full border border-paper/28 shadow-2xl transition-transform duration-500 ease-editorial group-hover:-translate-y-1" />
            <Image {...homeShots.padelPortal} alt={homeShots.padelPortal.alt} sizes="(min-width: 1440px) 125px, (min-width: 1024px) 10vw, 18vw" className="absolute bottom-5 right-5 h-auto w-[18%] max-w-[125px] border border-paper/28 shadow-2xl sm:bottom-7 sm:right-7" />
          </Link>
        </article>

        <div className="mt-9 grid gap-10 md:grid-cols-2 md:gap-8">
          {cards.map(({ item, slug, shot, scene }) => (
            <article key={slug}>
              <Link href={`/proyectos/${slug}`} aria-label={`${verProyecto.texto}: ${item.titulo}`} data-track="case_open" data-track-location="projects" data-track-project={slug} data-tono="oscuro" className={`group flex aspect-[16/10] items-center overflow-hidden p-6 md:p-8 ${scene}`}>
                <Image {...shot} alt={shot.alt} sizes="(min-width: 1440px) 580px, (min-width: 768px) 42vw, 85vw" className="h-auto w-full border border-paper/24 shadow-xl transition-transform duration-500 ease-editorial group-hover:-translate-y-1" />
              </Link>
              <p className="label-mono mt-6 text-[10px] text-cobalt">{item.descriptor}</p>
              <h3 className="mt-3 text-[25px] font-semibold leading-[1.15] tracking-[-0.025em]">{item.titulo}</h3>
              <p className="mt-3 max-w-[570px] text-base leading-relaxed text-ink-soft">{item.texto}</p>
              <p className="mt-3 max-w-[550px] text-sm leading-relaxed text-ink-mute">{item.decision}</p>
              <ArrowLink href={`/proyectos/${slug}`} arrow={verProyecto.flecha} className="mt-3" trackEvent="case_open" trackLocation="projects" trackProject={slug}>{verProyecto.texto}</ArrowLink>
            </article>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-line pt-5">
          <p className="label-mono text-[10px] text-ink-mute">{proyectos.mas}</p>
          {[2, 3].map((index) => (
            <ArrowLink key={proyectoSlugs[index]} href={`/proyectos/${proyectoSlugs[index]}`} trackEvent="case_open" trackLocation="projects" trackProject={proyectoSlugs[index]} className="max-w-full text-sm">
              {proyectos.items[index].titulo}
            </ArrowLink>
          ))}
        </div>
      </div>
    </section>
  );
}