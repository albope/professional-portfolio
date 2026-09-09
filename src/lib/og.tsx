import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

let fonts: Promise<Buffer[]> | undefined;

export async function brandImage(title: string, label: string) {
  fonts ??= Promise.all([
    readFile(join(process.cwd(), "src/assets/fonts/ArchivoBlack-Regular.ttf")),
    readFile(join(process.cwd(), "src/assets/fonts/FragmentMono-Regular.ttf")),
  ]);
  const [display, mono] = await fonts;

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", background: "#f7f6f2", color: "#101013", padding: "52px 64px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "Fragment", fontSize: 24 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          BPM<span style={{ color: "#2743e0" }}>TECH</span>
          <span style={{ marginLeft: 14, width: 14, height: 14, background: "#2743e0" }} />
        </div>
        <span style={{ fontSize: 16, color: "#5a594f" }}>{label}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", marginTop: 20, marginBottom: 20 }}>
        <div style={{ fontFamily: "Archivo Black", fontSize: title.length > 68 ? 58 : 70, lineHeight: 1.03, letterSpacing: -1.5, textTransform: "uppercase" }}>{title}</div>
        <div style={{ width: 32, height: 8, background: "#2743e0", marginTop: 28 }} />
      </div>
      <div style={{ borderTop: "1px solid #d8d6cc", paddingTop: 22, display: "flex", justifyContent: "space-between", fontFamily: "Fragment", fontSize: 17, color: "#5a594f" }}>
        <span>Software · Webs · Automatización</span>
        <span>bpmtechstudio.com</span>
      </div>
    </div>,
    {
      width: 1200, height: 630,
      fonts: [
        { name: "Archivo Black", data: display, weight: 400, style: "normal" },
        { name: "Fragment", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
