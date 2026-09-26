import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import type { CSSProperties, ReactNode } from "react";
import { ImageResponse } from "next/og";
import { copyEs } from "@/data/copy";
import { site } from "@/data/site";
import type { Project, Shot } from "@/data/projects";
import { color } from "@/lib/palette";

/**
 * Imágenes para compartir (Open Graph), con la piel de la web: papel, tinta
 * y cobalto, Schibsted Grotesk en los titulares y el logo exacto (Fragment
 * Mono con el glifo de tres piezas).
 *
 * `ImageResponse` no lee las fuentes de `next/font` ni acepta fuentes
 * variables ni WOFF2, así que usa archivos TTF propios en `src/assets/fonts`:
 * - `SchibstedGrotesk-400.ttf` y `SchibstedGrotesk-560.ttf`: instancias
 *   estáticas de la variable del repositorio de Google Fonts
 *   (`ofl/schibstedgrotesk`), fijadas en el peso 400 y en el 560 de los
 *   titulares y reducidas al latín con fontTools (`varLib.instancer` con
 *   `wght=400` y `wght=560`, y `subset` a latín básico y Latin-1). Licencia
 *   OFL en `OFL-Schibsted-Grotesk.txt`, sin nombre reservado.
 * - `FragmentMono-Regular.ttf`: la del logo. Licencia en
 *   `OFL-Fragment-Mono.txt`.
 *
 * Satori solo distingue pesos en centenas: la instancia de 560 se registra
 * como 600 y se pide con `fontWeight: 600`.
 */

const W = 1200;
const H = 630;

/** Colores de la paleta (especificación 2.1). */
const C = color;

/** Sombras de la especificación 2.4. */
const SHADOW_CAPTURE = "0 1px 0 rgba(16,16,19,.04), 0 18px 40px -18px rgba(16,16,19,.28), 0 0 0 1px rgba(16,16,19,.07)";
const SHADOW_PHONE = "0 24px 44px -16px rgba(16,16,19,.4)";

type Font = { name: string; data: Buffer; weight: 400 | 600; style: "normal" };
let fonts: Promise<Font[]> | undefined;

function loadFonts() {
  const dir = join(process.cwd(), "src/assets/fonts");
  fonts ??= Promise.all([
    readFile(join(dir, "SchibstedGrotesk-400.ttf")),
    readFile(join(dir, "SchibstedGrotesk-560.ttf")),
    readFile(join(dir, "FragmentMono-Regular.ttf")),
  ]).then(([regular, title, mono]) => [
    { name: "Schibsted", data: regular, weight: 400, style: "normal" },
    { name: "Schibsted", data: title, weight: 600, style: "normal" },
    { name: "Fragment", data: mono, weight: 400, style: "normal" },
  ]);
  return fonts;
}

/** Las capturas viven en `public/`: se incrustan como `data:` para Satori. */
async function dataUri(shot: Shot) {
  const bytes = await readFile(join(process.cwd(), "public", shot.src));
  const type = extname(shot.src) === ".png" ? "image/png" : "image/jpeg";
  return `data:${type};base64,${bytes.toString("base64")}`;
}

/** Dominio público sin `https://` ni `www.`, sacado de la configuración. */
const domain = new URL(site.url).host.replace(/^www\./, "");

/**
 * Logo exacto (brief y `Wordmark`): BPM en tinta y TECH en cobalto, Fragment
 * Mono con 0,06 em de tracking, 10 px hasta el glifo y 5 px entre sus piezas
 * (barra 11 × 3, cuadrado hueco de 11 con trazo 2 y cuadrado macizo de 11).
 * Todo escala con `k` a partir del cuerpo de 19 px.
 */
function Logo({ k = 1.5 }: { k?: number }) {
  const s = 11 * k;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 * k }}>
      <div style={{ display: "flex", fontFamily: "Fragment", fontSize: 19 * k, letterSpacing: 19 * k * 0.06, color: C.ink, lineHeight: 1 }}>
        BPM<span style={{ color: C.cobalt }}>TECH</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 5 * k }}>
        <div style={{ width: s, height: 3 * k, background: C.ink }} />
        <div style={{ width: s, height: s, border: `${2 * k}px solid ${C.ink}` }} />
        <div style={{ width: s, height: s, background: C.cobalt }} />
      </div>
    </div>
  );
}

/** Lienzo común: papel, logo arriba y, abajo, el dominio y la ciudad sobre un filete. */
function Canvas({ children, footerWidth = W - 128 }: { children: ReactNode; footerWidth?: number }) {
  return (
    <div style={{ width: W, height: H, display: "flex", position: "relative", background: C.bg, fontFamily: "Schibsted", color: C.ink }}>
      <div style={{ position: "absolute", left: 64, top: 56, display: "flex" }}>
        <Logo />
      </div>
      {children}
      <div
        style={{
          position: "absolute",
          left: 64,
          bottom: 48,
          width: footerWidth,
          paddingTop: 20,
          borderTop: `1px solid ${C.line2}`,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 21,
          color: C.ink2,
        }}
      >
        <span>{domain}</span>
        <span>{copyEs.meta.ubicacion}</span>
      </div>
    </div>
  );
}

const headline: CSSProperties = { fontWeight: 600, lineHeight: 1.04, letterSpacing: "-0.03em", color: C.ink };

/**
 * Ventana ordenada del hero en su estado final (especificación 4.1): los
 * controles del glifo, «Hoy» y las cuatro filas con su línea de origen y su
 * estado. Todo el texto sale del copy del hero.
 */
function OrderedWindow() {
  const { escritorio } = copyEs.hero.ilustracion;
  return (
    <div
      style={{
        width: 468,
        display: "flex",
        flexDirection: "column",
        background: C.surface,
        border: `1.5px solid ${C.line2}`,
        borderRadius: 16,
        boxShadow: "0 30px 60px -30px rgba(16,16,19,.28)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 7, height: 46, padding: "0 20px", borderBottom: `1px solid ${C.line}` }}>
        <div style={{ width: 12, height: 3, background: C.ink }} />
        <div style={{ width: 12, height: 12, border: `2px solid ${C.ink}` }} />
        <div style={{ width: 12, height: 12, background: C.cobalt }} />
        <div style={{ marginLeft: 22, width: 170, height: 16, borderRadius: 999, background: C.bg, border: `1px solid ${C.line}` }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", padding: "20px 20px 22px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1 }}>{escritorio.cabecera}</span>
            <span style={{ marginTop: 6, fontSize: 14, color: C.ink3 }}>{escritorio.actualizado}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", height: 30, padding: "0 12px", borderRadius: 7, background: C.cobalt, color: "#fff", fontSize: 14, fontWeight: 600 }}>
            + {escritorio.boton}
          </div>
        </div>
        {escritorio.filas.map((fila, index) => (
          <div
            key={fila.titulo}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: 60,
              marginTop: index === 0 ? 0 : 8,
              padding: "0 16px",
              border: `1px solid ${C.line}`,
              borderRadius: 10,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 17, lineHeight: 1.2 }}>{fila.titulo}</span>
              <span style={{ marginTop: 3, fontSize: 13.5, color: C.ink3 }}>{fila.origen}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: C.ink2 }}>
              <div
                style={
                  fila.hecho
                    ? { width: 11, height: 11, background: C.cobalt }
                    : { width: 11, height: 11, border: `2px solid ${C.ink}` }
                }
              />
              {fila.estado}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Imagen de la portada: el titular del hero a la izquierda y, a la derecha,
 * la aplicación ordenada con la que termina su ilustración.
 */
export async function homeImage() {
  return new ImageResponse(
    <Canvas>
      <div style={{ position: "absolute", left: 64, top: 150, width: 560, display: "flex", fontSize: 66, ...headline }}>
        {copyEs.hero.h1}
      </div>
      <div style={{ position: "absolute", right: 64, top: 70, display: "flex" }}>
        <OrderedWindow />
      </div>
    </Canvas>,
    { width: W, height: H, fonts: await loadFonts() },
  );
}

/** Marco de captura: radio 8 y sombra de captura. */
function Capture({ src, width, shot, style }: { src: string; width: number; shot: Shot; style?: CSSProperties }) {
  return (
    <div style={{ position: "absolute", display: "flex", overflow: "hidden", borderRadius: 8, background: C.surface, boxShadow: SHADOW_CAPTURE, ...style }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- Satori pinta `<img>`, no `next/image`. */}
      <img src={src} width={width} height={Math.round((width * shot.height) / shot.width)} alt="" />
    </div>
  );
}

/**
 * Escenario arena de la ficha, a sangre por la derecha y por abajo, con la
 * misma composición que su figura principal.
 */
async function Stage({ project }: { project: Project }) {
  const { figure } = project;
  const src = await dataUri(figure.shot);
  const layers: ReactNode[] = [];

  if (figure.layout === "movil-solo") {
    // Solo el móvil, centrado en el escenario con su marco de tinta.
    const width = 230;
    layers.push(
      <div
        key="movil"
        style={{
          position: "absolute",
          left: 175,
          top: 60,
          display: "flex",
          overflow: "hidden",
          borderRadius: 20,
          border: `5px solid ${C.ink}`,
          background: C.surface,
          boxShadow: SHADOW_PHONE,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- Satori pinta `<img>`, no `next/image`. */}
        <img src={src} width={width} height={Math.round((width * figure.shot.height) / figure.shot.width)} alt="" />
      </div>,
    );
  } else {
    layers.push(<Capture key="shot" src={src} width={660} shot={figure.shot} style={{ left: 44, top: 60 }} />);
  }

  if ("phone" in figure) {
    const phone = await dataUri(figure.phone);
    const front = figure.layout === "movil-delante";
    const width = front ? 170 : 150;
    layers.push(
      <div
        key="phone"
        style={{
          position: "absolute",
          left: front ? 250 : 396,
          top: front ? 110 : 190,
          display: "flex",
          overflow: "hidden",
          borderRadius: 20,
          border: `5px solid ${C.ink}`,
          background: C.surface,
          boxShadow: SHADOW_PHONE,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- Satori pinta `<img>`, no `next/image`. */}
        <img src={phone} width={width} height={Math.round((width * figure.phone.height) / figure.phone.width)} alt="" />
      </div>,
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        left: 620,
        top: 56,
        width: W - 620,
        height: H - 56,
        display: "flex",
        overflow: "hidden",
        background: C.sand,
        borderTopLeftRadius: 16,
      }}
    >
      {layers}
    </div>
  );
}

/**
 * Imagen de una ficha: antetítulo y nombre del proyecto a la izquierda y su
 * captura real en el escenario arena a la derecha.
 */
export async function projectImage(project: Project) {
  const long = project.name.length > 22;
  return new ImageResponse(
    <Canvas footerWidth={500}>
      <div style={{ position: "absolute", left: 64, top: 150, width: 500, display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: 24, lineHeight: 1.3, color: C.ink2 }}>{project.kicker}</span>
        <span style={{ marginTop: 14, fontSize: long ? 54 : 64, ...headline }}>{project.name}</span>
      </div>
      {await Stage({ project })}
    </Canvas>,
    { width: W, height: H, fonts: await loadFonts() },
  );
}
