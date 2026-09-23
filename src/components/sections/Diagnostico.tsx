"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { copyEs } from "@/data/copy";

const { diagnostico } = copyEs;
const DiagnosticoForm = dynamic(
  () => import("@/components/diagnostico/DiagnosticoForm").then((module) => module.DiagnosticoForm),
  { loading: () => <p role="status" className="py-5 text-sm text-ink-mute">Cargando el asistente…</p> },
);

/** Se carga solo al abrirlo y conserva la idea al cerrar y volver a abrir. */
export function Diagnostico() {
  const [loaded, setLoaded] = useState(false);
  return (
    <section id="diagnostico" aria-label={diagnostico.kicker} className="container-editorial pb-12 md:pb-16">
      <details className="group border-y border-line" onToggle={(event) => { if (event.currentTarget.open) setLoaded(true); }}>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 marker:content-none [&::-webkit-details-marker]:hidden">
          <span>
            <span className="label-mono text-[10px] text-ink-mute">{diagnostico.kicker}</span>
            <span className="mt-2 block text-lg font-semibold">{diagnostico.resumen}</span>
          </span>
          <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center border border-line font-mono text-xl text-cobalt group-open:bg-cobalt group-open:text-paper">
            <span className="group-open:hidden">+</span><span className="hidden group-open:inline">−</span>
          </span>
        </summary>
        <div className="border-t border-line pb-8 pt-7">
          <h2 className="text-2xl font-semibold tracking-tight">{diagnostico.h2}</h2>
          <p className="mb-7 mt-3 max-w-[700px] text-base leading-relaxed text-ink-soft">{diagnostico.apoyo}</p>
          {loaded && <DiagnosticoForm />}
          <noscript><p>{diagnostico.sin_js}</p></noscript>
        </div>
      </details>
    </section>
  );
}