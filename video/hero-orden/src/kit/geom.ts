import {ease} from "../lib/anim"
import type {Caja, Corte, Layout, Punto} from "../layout"
import {FILAS, type FilaId} from "../textos"

const RAD = Math.PI / 180

/** Centro de una caja. */
export const centroCaja = (c: Caja): Punto => ({x: c.x + c.w / 2, y: c.y + c.h / 2})

/**
 * Punto local (xl, yl) de una pieza → lienzo, aplicando el giro (grados) alrededor
 * del centro de su caja y después el desplazamiento vertical `dy` (respiración).
 * Pantalla con y hacia abajo: x' = dx·cos θ − dy·sin θ, y' = dx·sin θ + dy·cos θ.
 * Para puntos dentro de una burbuja, antes se suma su `caja.x/y` local al grupo.
 */
export const aGlobal = (caja: Caja, giro: number, xl: number, yl: number, dy = 0): Punto => {
  const c = centroCaja(caja)
  const px = caja.x + xl - c.x
  const py = caja.y + yl - c.y
  const cos = Math.cos(giro * RAD)
  const sin = Math.sin(giro * RAD)
  return {x: c.x + px * cos - py * sin, y: c.y + px * sin + py * cos + dy}
}

/**
 * Respiración: signo · A · sin(π · k · frame / (dur − 1)).
 * Vale 0 EXACTO en el primer y en el último fotograma de la escena (sin(πk) en
 * coma flotante no es 0), así las fronteras entre escenas son idénticas.
 */
export const respira = (frame: number, dur: number, k: number, signo: number, A: number): number => {
  if (frame <= 0 || frame >= dur - 1) return 0
  return signo * A * Math.sin((Math.PI * k * frame) / (dur - 1))
}

/** Caja de la baldosa de la fila `id` en el corte. */
export const baldosa = (L: Layout, corte: Corte, id: FilaId): Caja => {
  const i = (FILAS[corte] as readonly FilaId[]).indexOf(id)
  if (i < 0) throw new Error(`La fila «${id}» no existe en el corte ${corte}`)
  const {x, tops, baldosa: b} = L.filas
  return {x: x + b.dx, y: tops[i] + b.dy, w: b.lado, h: b.lado}
}

/**
 * Vuelo de una pieza a la baldosa de su fila. `p` es progreso LINEAL 0 a 1: aquí se
 * le aplica ease.inOut. Devuelve el centro, la escala, el giro y la opacidad de la silueta.
 */
export const vuelo = (
  p: number,
  origen: {caja: Caja, giro: number},
  destino: Caja,
): {cx: number, cy: number, escala: number, giro: number, opacidad: number} => {
  const q = ease.inOut(p)
  const a = centroCaja(origen.caja)
  const b = centroCaja(destino)
  return {
    cx: a.x + (b.x - a.x) * q,
    cy: a.y + (b.y - a.y) * q,
    escala: (destino.w / Math.max(origen.caja.w, origen.caja.h)) ** q,
    giro: origen.giro * (1 - q),
    // = 1 − (p − 0,8) / 0,2, escrito así para que valga 0 exacto en p = 1
    opacidad: p <= 0.8 ? 1 : (1 - p) * 5,
  }
}
