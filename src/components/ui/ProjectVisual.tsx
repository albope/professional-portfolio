import type { ProjectVisualVariant } from "@/data/projects";
import { cn } from "@/lib/utils";

interface Flow {
  label: string;
  steps: [string, string, string];
  details: [string, string, string];
  connections: string;
}

const flows: Record<ProjectVisualVariant, Flow> = {
  padel: {
    label: "Flujo de reservas",
    steps: ["Elegir pista", "Reservar", "Gestionar"],
    details: ["Disponibilidad para el jugador", "Reserva y pago", "Agenda y administración del club"],
    connections: "Jugadores · Pistas · Socios · Competiciones",
  },
  wms: {
    label: "Flujo de almacén",
    steps: ["Registrar", "Ubicar", "Consultar"],
    details: ["Entradas y referencias", "Ubicaciones y movimientos", "Inventario y permisos por rol"],
    connections: "Referencias · Ubicaciones · Movimientos",
  },
  assistant: {
    label: "Del contexto a la decisión",
    steps: ["Reunir", "Analizar", "Revisar"],
    details: ["Consulta, documentos y fuentes disponibles", "Agente de proyectos o de producto", "Propuesta, supuestos y fuentes consultadas"],
    connections: "Documentación · Proyectos · Decisiones · Estimaciones",
  },
  boda: {
    label: "Flujo de invitados",
    steps: ["Informarse", "Confirmar", "Organizar"],
    details: ["Información del evento", "Asistencia y preferencias", "Panel privado y avisos"],
    connections: "Invitación · Confirmaciones · Gestión",
  },
  radio: {
    label: "Recorrido de escucha",
    steps: ["Escuchar", "Explorar", "Continuar"],
    details: ["Reproducción en directo", "Programas y archivo", "Audio durante la navegación"],
    connections: "Directo · Programas · Reproductor persistente",
  },
};

/** Diagramas funcionales: describen los proyectos sin simular capturas de producto. */
export function ProjectVisual({
  variant,
  context = "card",
}: {
  variant: ProjectVisualVariant;
  context?: "card" | "case";
}) {
  const flow = flows[variant];
  const expanded = context === "case";

  return (
    <div className={cn("flex h-full flex-col justify-between", expanded ? "gap-8" : "min-h-[200px] gap-6")}>
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-xs uppercase tracking-[0.1em] text-paper/75">
          {flow.label}
        </p>
        <span aria-hidden="true" className="h-2 w-2 shrink-0 bg-cobalt-bright" />
      </div>
      <ol className={cn("grid", expanded ? "grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-5" : "grid-cols-3 gap-3")}>
        {flow.steps.map((step, index) => (
          <li
            key={step}
            className={cn(
              "relative min-w-0 border px-3 py-4",
              index === 1 ? "border-cobalt-bright bg-cobalt-bright/10" : "border-paper/30",
              expanded && "sm:min-h-[160px] sm:p-5"
            )}
          >
            <span className="font-mono text-xs text-cobalt-bright">0{index + 1}</span>
            <p className={cn("mt-3 break-words font-medium text-paper", expanded ? "text-lg" : "text-xs sm:text-sm")}>
              {step}
            </p>
            {expanded && <p className="mt-2 text-sm leading-relaxed text-paper/75">{flow.details[index]}</p>}
            {index < 2 && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute bg-ink font-mono text-cobalt-bright",
                  expanded
                    ? "-bottom-6 left-1/2 -translate-x-1/2 rotate-90 px-1 sm:-right-[17px] sm:bottom-auto sm:left-auto sm:top-1/2 sm:translate-x-0 sm:-translate-y-1/2 sm:rotate-0"
                    : "-right-[11px] top-1/2 -translate-y-1/2 text-xs"
                )}
              >
                →
              </span>
            )}
          </li>
        ))}
      </ol>
      <p className="border-t border-paper/20 pt-4 font-mono text-xs leading-relaxed text-paper/75 ">
        {flow.connections}
      </p>
    </div>
  );
}
