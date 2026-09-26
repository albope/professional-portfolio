"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { copyEs, partirFlecha } from "@/data/copy";
import { booking } from "@/data/booking";
import { trackEvent, type AnalyticsProperties } from "@/lib/analytics";
import {
  DIAGNOSTICO_EVENT, DIAGNOSTICO_LIMITS, DIAGNOSTICO_TIMEOUTS,
  clean, fallback, isDiagnosticoResponse, type Diagnostico, type DiagnosticoSource,
} from "@/lib/diagnostico";

const d = copyEs.diagnostico;
const ctaLlamada = partirFlecha(d.resultado.cta_llamada);
const ctaEscrito = partirFlecha(d.resultado.cta_escrito);
const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribe = () => () => {};
const chip =
  "min-h-10 border border-line-2 px-3.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink transition-colors duration-300 ease-soft hover:border-cobalt hover:text-cobalt";
const label = "font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3";
const columnLabel = "font-mono text-[11px] uppercase tracking-[0.1em] text-ink";

type Status = "idle" | "busy" | "done";

function codeFor(status: number, payload: unknown): AnalyticsProperties["code"] {
  if (status === 429) return "rate_limited";
  if (status === 503) return "unavailable";
  if (status === 408 || status === 504) return "timeout";
  if (status === 413) return "too_large";
  if (status === 400 || status === 415) return "invalid_request";
  const code = payload && typeof payload === "object" ? (payload as { code?: unknown }).code : undefined;
  return code === "unexpected" ? "unexpected" : "provider";
}

/**
 * Estados: vacío, escribiendo, validación, cargando y resultado. Si la IA
 * falla por lo que sea (sin clave, red, límite, respuesta inválida) se usa la
 * plantilla por palabras clave y se dice en la cabecera del resultado.
 *
 * El placeholder se escribe solo y las fases del resultado aparecen una a
 * una; con `prefers-reduced-motion` el placeholder es fijo y las fases
 * aparecen a la vez. El botón queda deshabilitado hasta hidratar, como el
 * formulario de contacto.
 */
export function DiagnosticoForm() {
  const id = useId();
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<Diagnostico | null>(null);
  const [source, setSource] = useState<DiagnosticoSource>("ia");
  const [fecha, setFecha] = useState("");
  const [step, setStep] = useState(0);
  const [shown, setShown] = useState(0);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const resultRef = useRef<HTMLElement>(null);
  const attempt = useRef(0);
  const busy = status === "busy";

  // Placeholder que se escribe solo, letra a letra, rotando tres ejemplos.
  useEffect(() => {
    const el = textRef.current;
    if (!el || text || window.matchMedia(REDUCED).matches) return;
    let phrase = 0, chars = 0, hold = 0;
    const timer = window.setInterval(() => {
      const full = d.placeholders[phrase];
      if (hold > 0) { hold -= 1; return; }
      chars += 1;
      el.placeholder = full.slice(0, chars);
      if (chars >= full.length) { hold = 60; chars = 0; phrase = (phrase + 1) % d.placeholders.length; }
    }, 45);
    return () => {
      window.clearInterval(timer);
      el.placeholder = d.placeholders[0];
    };
  }, [text]);

  // Cargando: cinco cuadrados que se rellenan en bucle y mensajes rotatorios.
  useEffect(() => {
    if (!busy) return;
    const timer = window.setInterval(() => setStep((s) => s + 1), 240);
    return () => window.clearInterval(timer);
  }, [busy]);

  // Resultado: las cinco fases aparecen cada 260 ms y el foco va al resultado.
  // Con movimiento reducido `run` ya las deja todas a la vista.
  useEffect(() => {
    if (status !== "done") return;
    resultRef.current?.focus({ preventScroll: true });
    if (window.matchMedia(REDUCED).matches) return;
    const timer = window.setInterval(() => {
      setShown((s) => {
        if (s + 1 >= 5) window.clearInterval(timer);
        return s + 1;
      });
    }, 260);
    return () => window.clearInterval(timer);
  }, [status, result]);

  function pick(texto: string) {
    setText(texto);
    setError("");
    textRef.current?.focus();
  }

  async function run(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const texto = text.trim().slice(0, DIAGNOSTICO_LIMITS.maxChars);
    if (texto.length < DIAGNOSTICO_LIMITS.minChars) {
      setError(d.error_corto);
      textRef.current?.focus();
      return;
    }
    const mine = (attempt.current += 1);
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), DIAGNOSTICO_TIMEOUTS.client);
    setError("");
    setResult(null);
    setStep(0);
    setShown(0);
    setStatus("busy");
    trackEvent("diagnostico_submit", { location: "diagnostico" });
    let r: Diagnostico | null = null;
    let src: DiagnosticoSource = "ia";
    try {
      const response = await fetch("/api/diagnostico", {
        method: "POST", signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto }),
      });
      const payload: unknown = await response.json().catch(() => null);
      if (response.ok && isDiagnosticoResponse(payload)) r = payload.result;
      else trackEvent("diagnostico_error", { location: "diagnostico", code: codeFor(response.status, payload) });
    } catch {
      trackEvent("diagnostico_error", { location: "diagnostico", code: controller.signal.aborted ? "timeout" : "network" });
    } finally {
      window.clearTimeout(timer);
    }
    if (mine !== attempt.current) return;
    if (!r) { r = fallback(texto); src = "plantilla"; }
    setResult(clean(r));
    setSource(src);
    setFecha(new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }));
    setShown(window.matchMedia(REDUCED).matches ? 5 : 0);
    setStatus("done");
    trackEvent("diagnostico_result", { location: "diagnostico", source: src });
  }

  function toForm() {
    const msg = text.trim() + (result ? `\n\n${d.mensaje_formulario}: ${result.titular}.` : "");
    window.dispatchEvent(new CustomEvent(DIAGNOSTICO_EVENT, { detail: msg }));
  }

  const lit = step % 6;
  const columnas = result
    ? [result.construir, result.conectar, result.noHaceFalta].map((items, index) => ({ label: d.resultado.columnas[index], items }))
    : [];

  return (
    <div className="text-ink">
      <form onSubmit={run} noValidate className="flex flex-col gap-[18px]">
        <label htmlFor={`${id}-texto`} className={label}>{d.etiqueta}</label>
        <textarea
          ref={textRef}
          id={`${id}-texto`}
          name="texto"
          value={text}
          onChange={(event) => { setText(event.target.value); setError(""); }}
          rows={4}
          maxLength={DIAGNOSTICO_LIMITS.maxChars}
          placeholder={d.placeholders[0]}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="min-h-[168px] w-full resize-y border border-ink bg-bg px-6 py-[22px] text-[clamp(18px,1.7vw,24px)] font-medium leading-[1.4] tracking-[-0.01em] text-ink placeholder:text-ink-3 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-cobalt"
        />
        <div className="flex flex-wrap items-center gap-2">
          <span className={`mr-1.5 ${label} text-ink-3`}>{d.ejemplos_rotulo}</span>
          {d.ejemplos.map((ejemplo) => (
            <button key={ejemplo.rotulo} type="button" onClick={() => pick(ejemplo.texto)} className={chip}>
              {ejemplo.rotulo}
            </button>
          ))}
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-7 gap-y-3.5">
          <Button type="submit" size="lg" disabled={busy || !hydrated} className="w-full 600:w-auto">
            {busy ? d.boton_ocupado : result ? d.boton_repetir : d.boton}
          </Button>
          <p className={`${label} text-ink-3`}>{d.nota_boton}</p>
        </div>
        {error && (
          <p id={`${id}-error`} role="alert" className="text-sm text-error">
            {error}
          </p>
        )}
      </form>

      {busy && (
        <div role="status" className="mt-10 flex items-center gap-[18px] border-t border-ink pt-5">
          <span className="flex gap-2" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => {
              const on = i < lit;
              const last = i === 4;
              return (
                <span
                  key={i}
                  className={`block h-3.5 w-3.5 border-2 transition-colors duration-300 ease-soft ${
                    on ? (last ? "border-cobalt bg-cobalt" : "border-ink bg-ink") : "border-ink bg-transparent"
                  }`}
                />
              );
            })}
          </span>
          <p className="font-mono text-xs uppercase tracking-[0.1em] text-ink-3">
            {d.cargando[Math.floor(step / 4) % d.cargando.length]}…
          </p>
        </div>
      )}

      {result && status === "done" && (
        <article
          ref={resultRef}
          tabIndex={-1}
          aria-live="polite"
          className="mt-11 border-t border-ink pt-[18px] focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-cobalt"
        >
          <div className="flex flex-wrap justify-between gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
            <span>{d.resultado.rotulo} · {fecha}</span>
            <span>{source === "ia" ? d.resultado.fuente_ia : d.resultado.fuente_plantilla}</span>
          </div>
          <h3 className="mt-7 font-title tracking-[-0.026em] max-w-[980px] text-[clamp(28px,3.6vw,56px)] leading-[0.96] text-ink">{result.titular}</h3>
          <p className="mt-5 max-w-[720px] text-[clamp(16px,1.3vw,19px)] leading-[1.6] text-ink-2">{result.lectura}</p>

          <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-x-6 gap-y-7">
            {columnas.map((columna) => (
              <div key={columna.label} className="border-t border-ink pt-3.5">
                <p className={columnLabel}>{columna.label}</p>
                <ul className="mt-3">
                  {columna.items.map((item) => (
                    <li key={item} className="border-t border-line py-2.5 text-[15px] leading-[1.5] text-ink-2">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <ol className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-x-6">
            {result.fases.map((fase, index) => {
              const on = index < shown;
              const last = index === result.fases.length - 1;
              return (
                <li
                  key={fase.num}
                  className={`border-t border-ink pb-6 pt-4 transition-[opacity,transform] duration-500 ease-soft ${
                    on ? "translate-y-0 opacity-100" : "translate-y-2 opacity-[0.18]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className={`block h-3 w-3 border-2 ${
                        on ? (last ? "border-cobalt bg-cobalt" : "border-ink bg-ink") : "border-ink bg-transparent"
                      }`}
                    />
                    <span className="font-mono text-xs text-cobalt">{fase.num}</span>
                  </div>
                  <p className="mt-3 text-lg font-semibold tracking-[-0.01em]">{fase.titulo}</p>
                  <p className="mt-2 text-sm leading-[1.5] text-ink-2">{fase.texto}</p>
                  <p className="mt-3.5 font-mono text-xs leading-[1.5] text-ink-3">
                    <span aria-hidden="true">↳ </span>
                    {fase.entregable}
                  </p>
                </li>
              );
            })}
          </ol>

          <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-end gap-x-[88px] gap-y-7">
            <p className="border-l-2 border-cobalt pl-4 text-[15px] leading-[1.55] text-ink-2">
              <span className={columnLabel}>{d.resultado.pregunta} · </span>
              {result.pregunta}
            </p>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
              <Button href={booking.url} external size="lg" trackLocation="diagnostico" trackDestination="booking">
                {ctaLlamada.texto} <span aria-hidden="true" className="font-mono">{ctaLlamada.flecha}</span>
              </Button>
              <ArrowLink
                href="/#contacto"
                arrow={ctaEscrito.flecha}
                onClick={toForm}
                trackEvent="cta_click"
                trackLocation="diagnostico"
                trackDestination="contact"
              >
                {ctaEscrito.texto}
              </ArrowLink>
            </div>
          </div>
          <p className="mt-7 max-w-[720px] text-[13px] leading-[1.55] text-ink-3">{d.resultado.nota}</p>
        </article>
      )}
    </div>
  );
}
