import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "BPM Tech — Software a medida, automatización e IA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#101013",
          color: "#F7F6F2",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "26px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(247,246,242,0.55)",
          }}
        >
          <div style={{ width: "14px", height: "14px", background: "#2743E0" }} />
          Estudio de software — Valencia
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: "84px",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
          }}
        >
          <span>El software que tu negocio</span>
          <span>necesita, construido a medida.</span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid rgba(247,246,242,0.18)",
            paddingTop: "36px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "12px",
              fontSize: "44px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            BPM Tech
            <div style={{ width: "12px", height: "12px", background: "#2743E0" }} />
          </div>
          <div style={{ fontSize: "24px", color: "rgba(247,246,242,0.5)" }}>
            Software · Automatización · IA
          </div>
        </div>
      </div>
    ),
    size
  );
}
