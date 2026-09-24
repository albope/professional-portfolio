import {BAR} from "./lib/anim";

/**
 * Montaje sincronizado a 120 BPM: 1 compás = 2 s = 60 frames a 30 fps.
 * Fuente de verdad compartida con la música (audio/generate.py lee
 * out/timeline.json, que genera scripts/export-timeline.mjs).
 */
export interface SceneSpec {
  id: string;
  bars: number;
}

// Storyboard definitivo: docs/storyboard.md
export const LANDSCAPE: SceneSpec[] = [
  {id: "mensajes-a-deshora", bars: 2},
  {id: "dobles-reservas", bars: 2},
  {id: "gestion-fragmentada", bars: 2},
  {id: "suena-familiar", bars: 1},
  {id: "interruptor", bars: 2},
  {id: "reserva-movil", bars: 2},
  {id: "sin-solapamientos", bars: 2},
  {id: "adios-al-excel", bars: 2},
  {id: "ligas-en-directo", bars: 2},
  {id: "control-de-cobros", bars: 2},
  {id: "todo-en-uno", bars: 2},
  {id: "tu-descansas", bars: 2},
  {id: "configura-en-5-minutos", bars: 3},
  {id: "cta", bars: 4},
];

export const PORTRAIT: SceneSpec[] = [
  {id: "mensajes-a-deshora", bars: 1},
  {id: "dobles-reservas", bars: 1},
  {id: "competiciones-en-excel", bars: 1},
  {id: "interruptor", bars: 1},
  {id: "reserva-movil", bars: 2},
  {id: "sin-solapamientos", bars: 2},
  {id: "ligas-en-directo", bars: 2},
  {id: "tu-descansas", bars: 2},
  {id: "cta", bars: 3},
];

export interface PlacedScene extends SceneSpec {
  from: number;
  durationInFrames: number;
}

export const place = (list: SceneSpec[]): PlacedScene[] => {
  let acc = 0;
  return list.map((s) => {
    const durationInFrames = Math.round(s.bars * BAR);
    const placed = {...s, from: acc, durationInFrames};
    acc += durationInFrames;
    return placed;
  });
};

export const totalFrames = (list: SceneSpec[]) => list.reduce((a, s) => a + Math.round(s.bars * BAR), 0);
