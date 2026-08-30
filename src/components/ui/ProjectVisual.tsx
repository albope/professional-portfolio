import type { ProjectVisualVariant } from "@/data/projects";

/**
 * Visuales abstractos de proyecto: wireframes de rectángulos de 1px sobre
 * tinta, con un solo elemento en cobalto claro por visual. Recreados del
 * handoff de diseño como composiciones div, sin imágenes.
 *
 * context "card" = tarjeta de la home · "case" = banda del case study.
 */
export function ProjectVisual({
  variant,
  context = "card",
}: {
  variant: ProjectVisualVariant;
  context?: "card" | "case";
}) {
  if (context === "case") {
    switch (variant) {
      case "padel":
        return <PadelCase />;
      case "wms":
        return <WmsCase />;
      case "docs":
        return <DocsCase />;
      case "assistant":
        return <AssistantCase />;
      default:
        return null;
    }
  }

  switch (variant) {
    case "padel":
      return <PadelCard />;
    case "wms":
      return <WmsCard />;
    case "docs":
      return <DocsCard />;
    case "assistant":
      return <AssistantCard />;
    case "boda":
      return <BodaMini />;
    case "radio":
      return <RadioMini />;
  }
}

const L22 = "border border-[#F7F6F2]/[0.22]";
const L12 = "border border-[#F7F6F2]/[0.12]";
const L25 = "border border-[#F7F6F2]/[0.25]";
const BRIGHT = "border border-cobalt-bright";

/* ————— Tarjetas de la home ————— */

function PadelCard() {
  return (
    <div className="grid h-full grid-cols-[1.4fr_1fr] gap-2.5" aria-hidden>
      <div className={`${L22} grid grid-rows-[24px_1fr]`}>
        <div className="border-b border-[#F7F6F2]/[0.22]" />
        <div className="grid grid-cols-7 grid-rows-4">
          <div className={`${L12} col-start-2 row-start-2 bg-cobalt-bright/35`} />
          <div className={`${L12} col-start-5 row-start-3 bg-cobalt-bright/[0.18]`} />
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        <div className={`${L22} flex-1`} />
        <div className={`${BRIGHT} flex h-[34%] items-center justify-center`}>
          <span className="font-mono text-[10px] text-cobalt-bright">
            RESERVA CONFIRMADA
          </span>
        </div>
      </div>
    </div>
  );
}

function WmsCard() {
  return (
    <div className="grid h-full grid-cols-5 grid-rows-3 gap-2.5" aria-hidden>
      <div className={`${L22} row-span-3`} />
      <div className={`${L22} col-span-3`} />
      <div className={L22} />
      <div className={`${L12} col-span-2 col-start-2 row-span-2 row-start-2 grid grid-cols-4 grid-rows-3`}>
        <div className="col-start-2 row-start-2 bg-cobalt-bright/30" />
      </div>
      <div className={`${BRIGHT} col-span-2 col-start-4 row-start-2 flex items-center justify-center`}>
        <span className="font-mono text-[10px] text-cobalt-bright">
          UBICACIÓN A-03-2
        </span>
      </div>
      <div className={`${L22} col-span-2 col-start-4 row-start-3`} />
    </div>
  );
}

function DocsCard() {
  return (
    <div className="flex h-full items-center gap-3.5" aria-hidden>
      <div className={`${L22} flex h-[78%] w-[26%] flex-col gap-1.5 p-2.5`}>
        <div className="h-px w-[80%] bg-[#F7F6F2]/30" />
        <div className="h-px w-[60%] bg-[#F7F6F2]/30" />
        <div className="h-px w-[70%] bg-[#F7F6F2]/30" />
      </div>
      <span className="font-mono text-[13px] text-cobalt-bright">→</span>
      <div className={`${BRIGHT} flex h-[46%] w-[20%] items-center justify-center`}>
        <span className="font-mono text-[10px] text-cobalt-bright">IA</span>
      </div>
      <span className="font-mono text-[13px] text-cobalt-bright">→</span>
      <div className={`${L22} flex h-[78%] w-[26%] flex-col justify-end gap-1.5 p-2.5`}>
        <div className="h-2 border border-[#F7F6F2]/30" />
        <div className="h-2 border border-[#F7F6F2]/30" />
        <div className="h-2 border border-cobalt-bright/70" />
      </div>
    </div>
  );
}

function AssistantCard() {
  return (
    <div className="mx-auto flex h-full max-w-[82%] flex-col justify-center gap-3" aria-hidden>
      <div className={`${L22} max-w-[70%] self-end px-3.5 py-2.5`}>
        <span className="font-mono text-[10px] text-[#F7F6F2]/60">
          ¿Cuál es el plazo de garantía?
        </span>
      </div>
      <div className={`${BRIGHT} max-w-[78%] px-3.5 py-2.5`}>
        <span className="font-mono text-[10px] text-cobalt-bright">
          Dos años desde la entrega. Fuente: manual de posventa, pág. 12
        </span>
      </div>
      <div className="mt-1.5 h-px bg-[#F7F6F2]/[0.15]" />
    </div>
  );
}

function BodaMini() {
  return (
    <div className="flex h-full w-full items-center justify-center" aria-hidden>
      <div className="flex h-[70px] w-[54px] items-center justify-center border border-[#F7F6F2]/40">
        <span className="font-mono text-[9px] text-cobalt-bright">RSVP</span>
      </div>
    </div>
  );
}

function RadioMini() {
  const bars: Array<[string, boolean]> = [
    ["40%", true],
    ["75%", true],
    ["55%", false],
    ["90%", true],
    ["35%", false],
  ];
  return (
    <div className="flex h-full w-full items-center justify-center" aria-hidden>
      <div className="flex h-10 items-end gap-[3px]">
        {bars.map(([h, bright], i) => (
          <div
            key={i}
            style={{ height: h }}
            className={bright ? "w-[3px] bg-cobalt-bright" : "w-[3px] bg-[#F7F6F2]/50"}
          />
        ))}
      </div>
    </div>
  );
}

/* ————— Bandas de case study ————— */

function PadelCase() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-[200px_1fr]" aria-hidden>
      <div className={`${L25} flex h-[220px] flex-col gap-2.5 p-4`}>
        <span className="h-1.5 w-[60%] bg-[#F7F6F2]/25" />
        <span className="h-1.5 w-[80%] bg-[#F7F6F2]/[0.15]" />
        <span className="h-1.5 w-[70%] bg-[#F7F6F2]/[0.15]" />
        <span className="h-1.5 w-[75%] bg-cobalt-bright/60" />
      </div>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className={`${L25} h-14`} />
          <div className={`${L25} h-14`} />
          <div className={`${BRIGHT} h-14 bg-cobalt-bright/[0.12]`} />
          <div className={`${L25} h-14`} />
        </div>
        <div className={`${L25} flex h-[148px] items-end gap-2.5 p-4`}>
          <span className="h-[40%] w-[22px] bg-[#F7F6F2]/20" />
          <span className="h-[65%] w-[22px] bg-[#F7F6F2]/20" />
          <span className="h-[50%] w-[22px] bg-[#F7F6F2]/20" />
          <span className="h-[85%] w-[22px] bg-cobalt-bright" />
          <span className="h-[70%] w-[22px] bg-[#F7F6F2]/20" />
        </div>
      </div>
    </div>
  );
}

function WmsCase() {
  return (
    <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6" aria-hidden>
      <div className={`${L25} h-11`} />
      <div className={`${L25} h-11`} />
      <div className={`${BRIGHT} h-11 bg-cobalt-bright/[0.12]`} />
      <div className={`${L25} h-11`} />
      <div className={`${L25} h-11`} />
      <div className={`${L25} h-11`} />
      <div className={`${L25} h-11`} />
      <div className={`${L25} h-11`} />
      <div className={`${L25} h-11`} />
      <div className={`${L25} h-11`} />
      <div className={`${BRIGHT} h-11`} />
      <div className={`${L25} h-11`} />
    </div>
  );
}

function DocsCase() {
  return (
    <div className="flex items-center gap-3.5" aria-hidden>
      <div className={`${L25} flex h-16 w-[52px] shrink-0 flex-col gap-[5px] p-2`}>
        <span className="h-[3px] w-[70%] bg-[#F7F6F2]/30" />
        <span className="h-[3px] w-[90%] bg-[#F7F6F2]/20" />
        <span className="h-[3px] w-[80%] bg-[#F7F6F2]/20" />
      </div>
      <span className="font-mono text-[13px] text-cobalt-bright">→</span>
      <div className={`${BRIGHT} flex h-16 flex-1 items-center bg-cobalt-bright/10 px-3.5`}>
        <span className="font-mono text-[10px] text-[#F7F6F2]/60">
          campos extraídos y validados
        </span>
      </div>
    </div>
  );
}

function AssistantCase() {
  return (
    <div className="flex flex-col gap-2.5" aria-hidden>
      <div className={`${L25} max-w-[75%] self-end px-3.5 py-2.5`}>
        <span className="font-mono text-[10px] text-[#F7F6F2]/60">
          ¿cómo tramito una devolución?
        </span>
      </div>
      <div className={`${BRIGHT} max-w-[75%] self-start bg-cobalt-bright/10 px-3.5 py-2.5`}>
        <span className="font-mono text-[10px] text-[#F7F6F2]/70">
          respuesta con cita → manual, pág. 12
        </span>
      </div>
    </div>
  );
}
