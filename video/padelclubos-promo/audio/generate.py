"""Genera la banda sonora sincronizada con el montaje (storyboard §6).

Lee out/timeline.json (npx tsx scripts/export-timeline.ts) y escribe, para
cada formato, en public/audio/:
  soundtrack-<fmt>.wav  música + efectos (la que usa el vídeo)
  music-<fmt>.wav       solo música
  sfx-<fmt>.wav         solo efectos (para montar otra música encima)

Tonalidad: La menor en el problema y Do mayor (su relativo) desde el drop.
Progresión de producto: | Do | Sol | Lam | Fa |, un acorde por compás.

Uso: python3 audio/generate.py [16x9|9x16|all]
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

sys.path.insert(0, str(Path(__file__).parent))
from arrangement import ARRANGEMENT  # noqa: E402
from synth import (  # noqa: E402
    BAR, BEAT, SR, Track, bell, clap, crash, hat, highpass, keys, kick, make_ir, marimba, master, n, pingpong,
    pluck, reverb, reverse_cymbal, sfx_buzz, sfx_clack, sfx_click, sfx_flip, sfx_impact, sfx_ping,
    sfx_pop, sfx_riser, sfx_success, sfx_swipe, sfx_tick, sfx_tock, sfx_type, sfx_vibrate, sfx_whoosh,
    shaker, sidechain_env, snare, snare_ghost, sub_bass, supersaw,
)

ROOT = Path(__file__).resolve().parent.parent

# (bajo, voces del pad). Voz superior casi fija (Mi5/Re5) para que el pad respire poco.
CHORDS = {
    "C": (n("C2"), [n("C4"), n("E4"), n("G4"), n("E5")]),
    "Cadd9": (n("C2"), [n("C4"), n("E4"), n("G4"), n("D5")]),
    "G": (n("G1"), [n("B3"), n("D4"), n("G4"), n("D5")]),
    "Am": (n("A1"), [n("C4"), n("E4"), n("A4"), n("E5")]),
    "F": (n("F1"), [n("C4"), n("F4"), n("A4"), n("E5")]),
    "Fmaj7": (n("F1"), [n("F3"), n("A3"), n("C4"), n("E4")]),
    "Gsus4": (n("G1"), [n("G3"), n("C4"), n("D4"), n("G4")]),
    # Problema: La menor con Si♭ encima (tensión de semitono).
    "Am(b9)": (n("A1"), [n("A3"), n("C4"), n("E4"), n("Bb4")]),
    "Am_bare": (n("A1"), [n("A3"), n("C4"), n("E4")]),
}
LOOP = ["C", "G", "Am", "F"]
# Motivo del problema (La–Do–Mi–Si) y su espejo en mayor (Do–Mi–Sol–Si).
MOTIF_MINOR = [n("A4"), n("C5"), n("E5"), n("B4")]
MOTIF_MAJOR = [n("C5"), n("E5"), n("G5"), n("B5")]
ARP = [0, 2, 3, 2, 1, 3, None, 2]


class Mix:
    def __init__(self, duration: float):
        self.duration = duration
        self.drums = Track(duration)
        self.bass = Track(duration)
        self.pads = Track(duration)
        self.lead = Track(duration)
        self.fx_music = Track(duration)
        self.sfx = Track(duration)
        self.kicks: list[float] = []
        self.sweeps: list[tuple[float, float]] = []  # barridos de filtro (inicio, fin)

    def kick(self, t: float, gain: float = 0.95, punch: float = 1.0):
        self.drums.add(kick(punch), t, gain)
        self.kicks.append(t)


# ------------------------------------------------------------ secciones

def sec_tension(m: Mix, start: float, bars: int, p: dict):
    """Problema (La menor): dron sub, tic de reloj en negras, pluck filtrado
    La–Do–Mi–Si en corcheas que se abre; bombo half-time, pad con Si♭ y bajo
    en corcheas desde `halftime_from`; ghost snares; riser al final."""
    ht = p.get("halftime_from", 2)
    gh = p.get("ghosts_from", 4)
    rs = p.get("riser_from", bars - 1)
    total = bars * BAR
    # Dron sub continuo en La1.
    m.bass.add(sub_bass(n("A1"), total - 0.1, 0.8), start, 0.32)
    for b in range(bars):
        at = start + b * BAR
        prog = b / max(1, bars - 1)
        cutoff_open = 600 * (3000 / 600) ** prog
        for k in range(4):
            m.drums.add(hat(False), at + k * BEAT, 0.09)  # tic de reloj (−24 dB aprox.)
        for k in range(8):
            note = MOTIF_MINOR[k % 4]
            m.lead.add(pluck(note, 0.14, bright=0.18 + 0.55 * prog), at + k * BEAT / 2, 0.2)
        if b >= ht:
            m.kick(at, 0.62, 0.8)
            m.kick(at + 2 * BEAT, 0.55, 0.8)
            root, chord = CHORDS["Am(b9)"]
            m.pads.add(supersaw(chord, BAR, cutoff=cutoff_open, attack=0.2, release=0.5), at, 0.34)
            for k in range(8):
                m.bass.add(sub_bass(root + 12, BEAT / 2 - 0.04, 0.7), at + k * BEAT / 2, 0.22)
        else:
            root, chord = CHORDS["Am_bare"]
            m.pads.add(supersaw(chord, BAR, cutoff=cutoff_open * 0.8, attack=0.4, release=0.6), at, 0.22)
        if b >= gh:
            for k in (3, 7, 11, 14, 15):
                m.drums.add(snare_ghost(), at + k * BEAT / 4, 0.18 + 0.1 * (k > 12))
    if rs < bars:
        rstart = start + rs * BAR
        m.fx_music.add(sfx_riser(start + total - rstart), rstart, 0.3)


def sec_build_short(m: Mix, start: float, bars: int, p: dict):
    """Un compás: riser y platillo invertido que culminan al final del t.3."""
    peak = start + 3 * BEAT
    m.fx_music.add(sfx_riser(peak - start + 0.3)[: int((peak - start) * SR)], start, 0.55)
    m.fx_music.add(reverse_cymbal(peak - start), start, 0.6)
    root, chord = CHORDS["Am(b9)"]
    m.pads.add(supersaw(chord, peak - start, cutoff=5000, attack=1.0, release=0.05, brightness_env=True), start, 0.4)
    steps = int((peak - start) / (BEAT / 4))
    for k in range(steps):
        ph = k / max(1, steps - 1)
        m.drums.add(snare(), start + k * BEAT / 4, 0.1 + 0.3 * ph ** 1.5)


def _groove_bar(m: Mix, at: float, name: str, energy: float, marimba_on: bool, drums: bool = True):
    root, chord = CHORDS[name]
    if drums:
        for b in range(4):
            m.kick(at + b * BEAT)
            if b in (1, 3):
                m.drums.add(clap(), at + b * BEAT, 0.4)
            m.drums.add(hat(open_=energy > 0.85), at + b * BEAT + BEAT / 2, 0.2)
            for s in range(4):
                m.drums.add(shaker(), at + b * BEAT + s * BEAT / 4, (0.1 if s % 2 else 0.06) * energy)
        # «toc» de pádel como percusión en el «y» del 4.
        m.drums.add(sfx_tock(1.0), at + 3.5 * BEAT, 0.16)
    # Bajo sincopado.
    for pos, length, octave in ((0.5, 0.45, 0), (1.5, 0.45, 0), (2.25, 0.2, 12), (2.5, 0.45, 0), (3.5, 0.4, 0)):
        m.bass.add(sub_bass(root + octave, BEAT * length), at + pos * BEAT, 0.6 if octave == 0 else 0.3)
    m.pads.add(supersaw(chord, BAR, cutoff=1600 + 2400 * energy, attack=0.04, release=0.45), at, 0.5)
    # Piano eléctrico FM en contratiempos (y del 2 y del 4).
    for pos in (1.5, 3.5):
        m.lead.add(keys([c + 12 for c in chord[:3]], BEAT * 0.4), at + pos * BEAT, 0.3)
    for k, idx in enumerate(ARP):
        if idx is None:
            continue
        m.lead.add(pluck(chord[idx] + 12, 0.15, bright=0.55 + 0.35 * energy), at + k * BEAT / 2, 0.22)
    if marimba_on:
        for pos, note in zip((0.0, 0.5, 1.0, 2.0), MOTIF_MAJOR):
            m.lead.add(marimba(note, 0.7), at + pos * BEAT, 0.5)


def sec_drop(m: Mix, start: float, bars: int, p: dict):
    """Drop en Do mayor: sub boom + crash filtrado y groove completo."""
    m.fx_music.add(sfx_impact(), start, 0.8)
    m.drums.add(crash(2.4), start, 0.5)
    if p.get("final"):
        root, chord = CHORDS["Cadd9"]
        m.pads.add(supersaw(chord + [chord[0] + 12], BAR * 0.9, cutoff=4200, attack=0.01, release=0.8), start, 0.4)
    # Motivo de marca en campana sobre el primer compás.
    for beat, note in ((0.0, "E5"), (0.75, "G5"), (1.5, "C6")):
        m.lead.add(bell(n(note), 1.6, index=1.8), start + beat * BEAT, 0.3)
    for b in range(bars):
        _groove_bar(m, start + b * BAR, LOOP[b % 4], 1.0, marimba_on=False)


def sec_groove(m: Mix, start: float, bars: int, p: dict):
    mf = p.get("marimba_from", 999)
    for b in range(bars):
        at = start + b * BAR
        # La progresión sigue desde el drop: el drop ocupa Do–Sol, así que el
        # groove arranca en Lam–Fa y los cambios de escena caen en Do o Lam.
        name = LOOP[(b + p.get("offset", 2)) % 4]
        energy = 0.85 + 0.15 * (b / max(1, bars - 1))
        _groove_bar(m, at, name, energy, marimba_on=b >= mf)
    if p.get("sweep_last"):
        end = start + bars * BAR
        m.sweeps.append((end - 2 * BEAT, end))


def sec_breakdown(m: Mix, start: float, bars: int, p: dict):
    """Sin batería ni bajo: Fa maj7 → Sol sus4, piano sostenido, tic a −30 dB."""
    names = ["Fmaj7", "Gsus4"]
    for b in range(bars):
        at = start + b * BAR
        root, chord = CHORDS[names[b % 2]]
        m.pads.add(supersaw(chord, BAR, cutoff=2400, attack=0.35, release=1.2), at, 0.5)
        m.lead.add(keys([c + 12 for c in chord], BAR * 0.95), at, 0.34)
        for k in range(4):
            m.drums.add(hat(False), at + k * BEAT, 0.05)
    # Swell invertido en el último tiempo.
    end = start + bars * BAR
    m.fx_music.add(reverse_cymbal(BEAT * 1.5), end - BEAT * 1.5, 0.45)


def sec_build_long(m: Mix, start: float, bars: int, p: dict):
    """Build del «configura»: bombo en negras, caja en corcheas y luego en
    semicorcheas, barrido de filtro y riser; Lam → Fa → Sol."""
    names = ["Am", "F", "G"]
    for b in range(bars):
        at = start + b * BAR
        root, chord = CHORDS[names[b % 3]]
        m.pads.add(supersaw(chord, BAR, cutoff=1200 + 1600 * b, attack=0.05, release=0.3), at, 0.45)
        for k in range(8):
            m.bass.add(sub_bass(root, BEAT / 2 - 0.05, 0.8), at + k * BEAT / 2, 0.4)
        for k in range(4):
            m.kick(at + k * BEAT, 0.8)
        if b == 1:
            for k in range(8):
                m.drums.add(snare(), at + k * BEAT / 2, 0.2)
        elif b >= 2:
            for k in range(16):
                m.drums.add(snare(), at + k * BEAT / 4, 0.15 + 0.25 * k / 15)
        for k, idx in enumerate(ARP):
            if idx is not None:
                m.lead.add(pluck(chord[idx] + 12, 0.14, bright=0.4 + 0.25 * b), at + k * BEAT / 2, 0.2)
    m.fx_music.add(sfx_riser(bars * BAR * 0.66), start + bars * BAR * 0.34, 0.45)


def sec_outro(m: Mix, start: float, bars: int, p: dict):
    """Acorde final sostenido (Do add9) y cola."""
    root, chord = CHORDS["Cadd9"]
    tail = bars * BAR
    m.pads.add(supersaw(chord + [chord[0] + 12], tail * 0.55, cutoff=3000, attack=0.02, release=tail * 0.4), start, 0.5)
    m.bass.add(sub_bass(root, tail * 0.45, 0.8), start, 0.4)
    m.lead.add(keys([c + 12 for c in chord[:3]], tail * 0.5), start, 0.3)
    m.kick(start, 0.8)
    for beat, note in ((0.0, "C5"), (0.5, "E5"), (1.0, "G5"), (1.5, "C6")):
        m.lead.add(bell(n(note), 2.4, index=1.4), start + beat * BEAT, 0.28)


SECTIONS = {
    "tension": sec_tension,
    "build_short": sec_build_short,
    "drop": sec_drop,
    "groove": sec_groove,
    "breakdown": sec_breakdown,
    "build_long": sec_build_long,
    "outro": sec_outro,
}


# ------------------------------------------------------------ efectos de sonido

def repitch(x: np.ndarray, factor: float) -> np.ndarray:
    """Cambio de tono tipo cinta (también cambia la duración): basta para efectos cortos."""
    n_in = x.shape[0]
    n_out = max(1, int(round(n_in / factor)))
    src = np.linspace(0, n_in - 1, n_out)
    if x.ndim == 1:
        return np.interp(src, np.arange(n_in), x)
    return np.stack([np.interp(src, np.arange(n_in), x[:, ch]) for ch in range(x.shape[1])], axis=1)


def render_sfx(m: Mix, cues: list[dict]):
    for c in cues:
        t = c["t"]
        g = c.get("gain", 1.0)
        pan = c.get("pan", 0.0)
        kind = c["sfx"]
        pitch = c.get("pitch", 1.0)
        dur = c.get("durS")
        note = c.get("note")
        table = {
            "tock": (lambda: sfx_tock(pitch, metallic=bool(c.get("metallic"))), 0.8),
            "whoosh": (lambda: sfx_whoosh(dur or 0.5, True), 0.5),
            "whooshDown": (lambda: sfx_whoosh(dur or 0.5, False), 0.45),
            "swipe": (sfx_swipe, 0.4),
            "click": (lambda: sfx_click(note), 0.5),
            "pop": (lambda: sfx_pop(note), 0.38),
            "ping": (lambda: sfx_ping(c.get("tone", "dissonant")), 0.4),
            "success": (sfx_success, 0.5),
            "tick": (lambda: sfx_tick(note), 0.35),
            "flip": (sfx_flip, 0.5),
            "type": (sfx_type, 0.45),
            "buzz": (sfx_buzz, 0.55),
            "impact": (sfx_impact, 0.6),
            "riser": (lambda: sfx_riser(dur or 2.0), 0.4),
            "vibrate": (sfx_vibrate, 0.6),
            "clack": (sfx_clack, 0.7),
        }
        if kind not in table:
            raise ValueError(f"sfx desconocido: {kind}")
        make, base = table[kind]
        x = make()
        if kind != "tock" and abs(pitch - 1.0) > 1e-3:
            x = repitch(x, pitch)
        if x.ndim == 1:
            ang = (pan + 1) * np.pi / 4
            x = np.stack([x * np.cos(ang), x * np.sin(ang)], axis=1) * np.sqrt(2)
        m.sfx.add(x, t, base * g)


# ------------------------------------------------------------ mezcla

def gate(length: int, windows: list[tuple[float, float]], ramp: float = 0.008) -> np.ndarray:
    g = np.ones(length)
    r = int(ramp * SR)
    for a, b in windows:
        i, j = int(a * SR), int(b * SR)
        g[i:j] = 0
        if i - r > 0:
            g[i - r:i] = np.minimum(g[i - r:i], np.linspace(1, 0, r))
        if j + r < length:
            g[j:j + r] = np.minimum(g[j:j + r], np.linspace(0, 1, r))
    return g


def apply_sweeps(x: np.ndarray, sweeps: list[tuple[float, float]]) -> np.ndarray:
    """Barrido descendente del filtro en las ventanas indicadas (vuelve abierto después)."""
    from synth import svf_lowpass_sweep

    y = x.copy()
    for a, b in sweeps:
        i, j = int(a * SR), int(b * SR)
        seg = x[i:j]
        cut = np.geomspace(12000, 500, len(seg))
        y[i:j] = np.stack([svf_lowpass_sweep(seg[:, 0], cut, 0.9), svf_lowpass_sweep(seg[:, 1], cut, 0.9)], axis=1)
    return y


def build(fmt: str, timeline: dict):
    spec = timeline[fmt]
    duration = spec["seconds"]
    arr = ARRANGEMENT[fmt]
    m = Mix(duration)
    for sec in arr["sections"]:
        SECTIONS[sec["type"]](m, sec["bar"] * BAR, int(sec["bars"]), sec.get("params", {}))
    render_sfx(m, spec["cues"])

    length = len(m.drums.buf)
    ir_room = make_ir(1.9, 0.025, 5200)
    ir_short = make_ir(0.6, 0.01, 7000)
    sc = sidechain_env(length, m.kicks, depth=0.5, release=0.2)[:, None]

    drums = m.drums.buf
    bass = m.bass.buf * sc
    pads = m.pads.buf * (0.55 + 0.45 * sc)
    lead = m.lead.buf
    lead = lead + pingpong(lead, BEAT * 0.75, 0.35, 4, 0.18)
    fxm = m.fx_music.buf
    music = (
        drums * 0.8
        + reverb(drums, ir_short, 0.08)
        + highpass(bass, 35) * 0.45
        + pads * 1.05
        + reverb(pads, ir_room, 0.4)
        + lead * 1.2
        + reverb(lead, ir_room, 0.33)
        + fxm * 0.8
        + reverb(fxm, ir_room, 0.2)
    )
    music = apply_sweeps(music, m.sweeps)
    music = music * gate(length, arr.get("silence", []))[:, None]
    sfx = m.sfx.buf + reverb(m.sfx.buf, ir_short, 0.12)

    n_out = int(round(duration * SR))
    fade = np.ones(n_out)
    fo = arr.get("fade_out")
    if fo:
        a, b = int(fo[0] * SR), int(fo[1] * SR)
        fade[a:b] = np.linspace(1, 0, b - a) ** 2
        fade[b:] = 0

    def finish(x, target):
        return master(x[:n_out] * fade[:, None], lufs_target=target).astype(np.float32)

    full = finish(music + sfx * 1.1, -14.0)
    only_music = finish(music, -14.0)
    only_sfx = finish(sfx, -18.0)
    return full, only_music, only_sfx


def main():
    which = sys.argv[1] if len(sys.argv) > 1 else "all"
    timeline = json.loads((ROOT / "out" / "timeline.json").read_text())
    out_dir = ROOT / "public" / "audio"
    out_dir.mkdir(parents=True, exist_ok=True)
    for fmt in (["16x9", "9x16"] if which == "all" else [which]):
        full, music, sfx = build(fmt, timeline)
        sf.write(out_dir / f"soundtrack-{fmt}.wav", full, SR, subtype="PCM_24")
        sf.write(out_dir / f"music-{fmt}.wav", music, SR, subtype="PCM_24")
        sf.write(out_dir / f"sfx-{fmt}.wav", sfx, SR, subtype="PCM_24")
        print(f"{fmt}: {len(full) / SR:.2f}s -> public/audio/soundtrack-{fmt}.wav")


if __name__ == "__main__":
    main()
