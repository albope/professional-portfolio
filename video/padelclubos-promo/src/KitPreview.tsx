import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import {Calendar, Euro, TrendingUp, Users} from "lucide-react";
import {Logo} from "./brand/Logo";
import {color, displayStyle} from "./brand/tokens";
import {
  AppShell,
  Badge,
  BookingGrid,
  Button,
  CourtLines,
  Cursor,
  DayClock,
  KpiCard,
  MarcadorModule,
  PadelBall,
  PageTitle,
  PhoneFrame,
  PlayerBottomNav,
  STATUS_BAR_H,
  WordsReveal,
} from "./components";
import {fmt} from "./lib/anim";

/** Muestrario del kit (solo para revisión, no forma parte del vídeo). */
export const KitPreview: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: color.sand200}}>
      <div style={{position: "absolute", left: 40, top: 30, transform: "scale(0.62)", transformOrigin: "0 0"}}>
        <AppShell active="dashboard" crumb="Resumen">
          <PageTitle title="Bienvenido a Valencia Pádel Club" subtitle="Resumen del club Valencia Pádel Club." />
          <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 24}}>
            <KpiCard label="Reservas hoy" value="24" icon={Calendar} />
            <KpiCard label="Socios activos" value="342" icon={Users} />
            <KpiCard label="Ocupación" value="87%" icon={TrendingUp} />
            <KpiCard label="Ingresos hoy" value={fmt.eur(1284)} icon={Euro} />
          </div>
          <BookingGrid
            frame={frame + 60}
            courts={["Pista 1", "Pista 2", "Pista 3", "Pista 4"]}
            slots={["18:00", "19:30", "21:00"]}
            cells={[
              {court: 0, slot: 0, state: "reserved", label: "Marta G.", at: 0},
              {court: 1, slot: 0, state: "class", label: "Iniciación", at: 0},
              {court: 2, slot: 1, state: "recurring", label: "Reserva habitual", at: 0},
              {court: 3, slot: 2, state: "pending", label: "Pendiente", at: 0},
            ]}
          />
        </AppShell>
      </div>
      <div style={{position: "absolute", right: 60, top: 40, display: "flex", flexDirection: "column", gap: 24, alignItems: "flex-end"}}>
        <Logo height={70} />
        <div style={{display: "flex", gap: 12}}>
          <Button>Solicitar demo</Button>
          <Button variant="secondary">Ver cómo funciona</Button>
          <Badge tone="success">Cobrado</Badge>
          <Badge tone="warning">Pendiente</Badge>
        </div>
        <MarcadorModule frame={frame} start={20} total={fmt.eur2(24)} width={520} />
        <WordsReveal text="Todas las herramientas para tu club." frame={frame + 60} style={{fontSize: 44, color: color.ink900, width: 620}} />
        <div style={{display: "flex", gap: 30, alignItems: "center"}}>
          <CourtLines length={300} draw={1} stroke={color.green600} />
          <PadelBall size={60} spin={20} />
        </div>
      </div>
      <div style={{position: "absolute", left: 1000, top: 560, transform: "scale(0.55)", transformOrigin: "0 0"}}>
        <PhoneFrame>
          <div style={{paddingTop: STATUS_BAR_H + 20, paddingLeft: 20, ...displayStyle(800), fontSize: 30}}>Reservar pista</div>
          <PlayerBottomNav active="reservar" />
        </PhoneFrame>
      </div>
      <div style={{position: "absolute", left: 1000, top: 380, width: 600, height: 200, background: color.ink900}}>
        <DayClock frame={frame} mood="alert" day={[{at: 0, value: "LUN"}, {at: 22, value: "MAR"}]} time={[{at: 0, value: "23:47"}, {at: 20, value: "00:06"}]} />
      </div>
      <div style={{position: "absolute", left: 0, top: 0, width: 1920, height: 1080}}>
        <Cursor frame={frame} keys={[{at: 0, x: 700, y: 700}, {at: 40, x: 400, y: 500, click: true}]} />
      </div>
    </AbsoluteFill>
  );
};
