import React from "react";
import {interpolateColors} from "remotion";
import {Bell, ChevronRight, FileUp, Globe, Home, Search, Sun} from "lucide-react";
import {Isotipo} from "../../brand/Logo";
import {color, displayStyle, monoStyle, radius, shadow, textStyle} from "../../brand/tokens";
import {Avatar, NAV_GROUPS} from "../../components";
import {ease, progress} from "../../lib/anim";
import {T16 as T} from "./cues";
import {CONTENT, LABEL_COL, PAGE_TITLE_Y, PANEL, SIDE, TOPBAR, ZONE} from "./geo";

/** Sidebar tinta a 0,7× con «Socios» activo en el grupo Comunidad. */
const Sidebar: React.FC = () => (
  <div style={{position: "absolute", left: 0, top: 0, width: SIDE, height: PANEL.h, background: color.ink900, overflow: "hidden"}}>
    <div
      style={{
        height: TOPBAR,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "0 14px",
        borderBottom: `2px solid ${color.darkBorder}`,
      }}
    >
      <Isotipo size={30} tone="dark" />
      <span style={{...displayStyle(750), fontSize: 16, color: color.darkText, whiteSpace: "nowrap"}}>PadelClub OS</span>
    </div>
    <div style={{padding: "12px 8px", display: "flex", flexDirection: "column", gap: 8}}>
      {NAV_GROUPS.map((g) => (
        <div key={g.title} style={{display: "flex", flexDirection: "column"}}>
          <div
            style={{
              ...textStyle(600),
              fontSize: 16,
              lineHeight: "26px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: color.ink400,
              padding: "0 10px",
            }}
          >
            {g.title}
          </div>
          {g.items.map((item) => {
            const on = item.id === "socios";
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                style={{
                  height: 31,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "0 10px",
                  borderRadius: 6,
                  background: on ? "#1F3A2C" : "transparent",
                  boxShadow: on ? `inset 3px 0 0 ${color.green400}` : "none",
                  color: on ? color.darkText : "#CFC8BA",
                  ...textStyle(on ? 700 : 500),
                  fontSize: 16,
                  whiteSpace: "nowrap",
                }}
              >
                <Icon size={18} strokeWidth={2} />
                {item.label}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  </div>
);

const Topbar: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: SIDE,
      top: 0,
      width: PANEL.w - SIDE,
      height: TOPBAR,
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 32px",
      borderBottom: `2px solid ${color.sand300}`,
    }}
  >
    <div style={{display: "flex", alignItems: "center", gap: 8, ...textStyle(500), fontSize: 16, color: color.ink500}}>
      <Home size={17} strokeWidth={2} />
      <span>Dashboard</span>
      <ChevronRight size={16} strokeWidth={2} />
      <span style={{...textStyle(600), color: color.ink900}}>Socios</span>
    </div>
    <div style={{display: "flex", alignItems: "center", gap: 24, color: color.ink900}}>
      <Search size={20} strokeWidth={2} />
      <Globe size={20} strokeWidth={2} />
      <Sun size={20} strokeWidth={2} />
      <Bell size={20} strokeWidth={2} />
      <Avatar initials="LM" size={40} bg={color.green700} />
    </div>
  </div>
);

/** Cabecera de la página: título y buscador. */
const PageHead: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: CONTENT.x - PANEL.x,
      top: PAGE_TITLE_Y - PANEL.y,
      width: CONTENT.r - CONTENT.x,
      height: 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <span style={{...displayStyle(800), fontSize: 40, lineHeight: 1, color: color.ink900}}>Socios</span>
    <div
      style={{
        width: 360,
        height: 40,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0 14px",
        borderRadius: radius.control + 2,
        border: `2px solid ${color.sand300}`,
        background: color.surface,
        ...textStyle(400),
        fontSize: 17,
        color: color.ink400,
      }}
    >
      <Search size={18} strokeWidth={2} />
      Buscar socio
    </div>
  </div>
);

/** Zona de importación: borde discontinuo de 2 px, etiqueta y eyebrow mono. */
const DropZone: React.FC<{frame: number}> = ({frame}) => {
  // Estado «arrastrando encima» mientras cae la hoja.
  const over = progress(frame, T.drop - 3, 4, ease.out) * (1 - progress(frame, T.land + 2, 8, ease.out));
  const stroke = interpolateColors(over, [0, 1], [color.sand400, color.ink500]);
  const x = ZONE.x - PANEL.x;
  const y = ZONE.y - PANEL.y;
  return (
    <>
      <svg width={ZONE.w} height={ZONE.h} style={{position: "absolute", left: x, top: y, overflow: "visible"}}>
        <rect
          x={1}
          y={1}
          width={ZONE.w - 2}
          height={ZONE.h - 2}
          rx={radius.surface}
          fill={`rgba(231, 226, 216, ${(0.28 + 0.3 * over).toFixed(3)})`}
          stroke={stroke}
          strokeWidth={2}
          strokeDasharray="10 8"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: LABEL_COL.x - PANEL.x,
          top: LABEL_COL.y - PANEL.y,
          width: LABEL_COL.w,
          height: LABEL_COL.h,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: radius.surface,
            background: color.surface,
            border: `2px solid ${color.sand300}`,
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: color.ink900,
            boxShadow: shadow.card,
          }}
        >
          <FileUp size={30} strokeWidth={2} />
        </div>
        <span style={{...monoStyle(500), fontSize: 16, letterSpacing: "0.12em", color: color.ink500, marginTop: 32}}>
          IMPORTACIÓN MASIVA
        </span>
        <span style={{...displayStyle(760), fontSize: 32, lineHeight: 1.15, color: color.ink900, marginTop: 12}}>
          Importar
          <br />
          desde Excel
        </span>
      </div>
    </>
  );
};

/** Panel del club: todo lo que no es la hoja. */
export const Panel: React.FC<{frame: number; children?: React.ReactNode}> = ({frame, children}) => (
  <div
    style={{
      position: "absolute",
      left: PANEL.x,
      top: PANEL.y,
      width: PANEL.w,
      height: PANEL.h,
      borderRadius: 16,
      overflow: "hidden",
      background: color.background,
      boxShadow: shadow.float,
    }}
  >
    <Sidebar />
    <Topbar />
    <PageHead />
    <DropZone frame={frame} />
    {children}
    <div style={{position: "absolute", inset: 0, borderRadius: 16, border: `2px solid ${color.sand300}`, pointerEvents: "none"}} />
  </div>
);
