"""Genera la banda sonora sincronizada con el montaje.

Lee out/timeline.json (npx tsx scripts/export-timeline.ts) y escribe, para
cada formato, en public/audio/:
  soundtrack-<fmt>.wav  música + efectos (la que usa el vídeo)
  music-<fmt>.wav       solo música
  sfx-<fmt>.wav         solo efectos (para montar otra música encima)

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
    BAR, BEAT, SR, Track, bell, clap, hat, keys, kick, make_ir, master, n, pingpong, pluck, reverb,
    sfx_buzz, sfx_click, sfx_flip, sfx_impact, sfx_ping, sfx_pop, sfx_riser, sfx_success, sfx_swipe,
    sfx_tick, sfx_tock, sfx_type, sfx_whoosh, shaker, sidechain_env, sub_bass, supersaw,
    sfx_vibrate, sfx_clack,
)

ROOT = Path(__file__).resolve().parent.parent

# Progresión principal (Fa mayor): IV – I – V – vi, un acorde por compás,
# con la nota superior (Do5) como pedal para que las voces se muevan poco.
PROG = {
    "Bb": (n("Bb1"), [n("D4"), n("F4"), n("A4"), n("C5")]),
    "F": (n("F2"), [n("C4"), n("F4"), n("A4"), n("C5")]),
    "C": (n("C2"), [n("C4"), n("E4"), n("G4"), n("C5")]),
    "Dm": (n("D2"), [n("D4"), n("F4"), n("A4"), n("C5")]),
    "Gm": (n("G1"), [n("D4"), n("G4"), n("Bb4"), n("C5")]),
    "Am": (n("A1"), [n("C4"), n("E4"), n("A4"), n("C5")]),
}
LOOP = ["Bb", "F", "C", "Dm"]
TENSION = ["Dm", "Dm", "Bb", "Bb", "Gm", "Gm", "Am", "Am"]

# Patrón del arpegio (índices de nota del acorde, una corchea cada uno; None = silencio).
ARP = [0, 2, 3, 2, 1, 3, None, 2]


class Mix:
    def __init__(self, duration: float):
        self.duration = duration
        self.drums = Track(duration)
        self.bass = Track(duration)
        self.pads = Track(duration)
        self.lead = Track(duration)
        self.fx_music = Track(duration)  # risers/impactos musicales
        self.sfx = Track(duration)
        self.kicks: list[float] = []


def chord_at(names: list[str], bar_index: int):
    return PROG[names[bar_index % len(names)]]


# ------------------------------------------------------------ secciones

def sec_tension(m: Mix, start: float, bars: float, p: dict):
    """Problema: pedal grave, pulso tipo latido, ostinato nervioso filtrado."""
    nb = int(round(bars))
    for b in range(nb):
        at = start + b * BAR
        root, chord = chord_at(p.get("chords", TENSION), b + p.get("offset", 0))
        m.pads.add(supersaw(chord[:3], BAR, cutoff=900 + 300 * b / max(1, nb - 1), attack=0.25, release=0.6), at, 0.4)
        m.bass.add(sub_bass(root + 12, BAR - 0.05, 0.9), at, 0.3)
        # Latido: dos golpes suaves por compás.
        for off, g in ((0, 0.4), (BEAT * 0.5, 0.22)):
            m.drums.add(kick(0.7), at + off, g)
            m.kicks.append(at + off)
        for off, g in ((BEAT * 2, 0.36), (BEAT * 2.5, 0.2)):
            m.drums.add(kick(0.7), at + off, g)
            m.kicks.append(at + off)
        # Reloj: corcheas secas.
        for k in range(8):
            m.drums.add(hat(False), at + k * BEAT / 2, 0.12 if k % 2 else 0.2)
        # Ostinato en semicorcheas, filtrado.
        notes = [chord[0] + 12, chord[1] + 12, chord[0] + 12, chord[2]]
        for k in range(16):
            m.lead.add(pluck(notes[k % 4], 0.1, bright=0.4), at + k * BEAT / 4, 0.12)


def sec_build(m: Mix, start: float, bars: float, p: dict):
    """Subida: redoble que acelera + riser hacia el drop."""
    dur = bars * BAR
    m.fx_music.add(sfx_riser(dur), start, 0.5)
    root, chord = PROG[p.get("chord", "C")]
    m.pads.add(supersaw(chord, dur, cutoff=5000, attack=dur * 0.8, release=0.1, brightness_env=True), start, 0.5)
    m.bass.add(sub_bass(root, dur - 0.05, 0.8), start, 0.4)
    steps = int(dur / (BEAT / 4))
    for k in range(steps):
        t = start + k * BEAT / 4
        ph = k / max(1, steps - 1)
        if ph < 0.5 and k % 2:
            continue
        m.drums.add(clap(), t, 0.12 + 0.35 * ph ** 1.5)


def _groove_bar(m: Mix, at: float, root: int, chord: list[int], p: dict, energy: float):
    drums = p.get("drums", True)
    if drums:
        for b in range(4):
            m.drums.add(kick(), at + b * BEAT, 0.95)
            m.kicks.append(at + b * BEAT)
            if b in (1, 3):
                m.drums.add(clap(), at + b * BEAT, 0.42)
            m.drums.add(hat(open_=energy > 0.8), at + b * BEAT + BEAT / 2, 0.22 if energy > 0.8 else 0.18)
            for s in (1, 3):
                m.drums.add(shaker(), at + b * BEAT + s * BEAT / 4, 0.1 * energy)
    # Bajo en contratiempo (bombeo con el sidechain).
    for b in range(4):
        m.bass.add(sub_bass(root, BEAT / 2 - 0.03), at + b * BEAT + BEAT / 2, 0.62)
        if energy > 0.7:
            m.bass.add(sub_bass(root + 12, BEAT / 4 - 0.02, 0.6), at + b * BEAT + BEAT * 0.75, 0.3)
    m.pads.add(supersaw(chord, BAR, cutoff=1800 + 2600 * energy, attack=0.05, release=0.5), at, 0.62)
    # Arpegio.
    for k, idx in enumerate(ARP):
        if idx is None:
            continue
        m.lead.add(pluck(chord[idx] + 12, 0.16, bright=0.6 + 0.4 * energy), at + k * BEAT / 2, 0.3)


def sec_groove(m: Mix, start: float, bars: float, p: dict):
    energy = p.get("energy", 1.0)
    nb = int(round(bars))
    for b in range(nb):
        root, chord = chord_at(p.get("chords", LOOP), b + p.get("offset", 0))
        _groove_bar(m, start + b * BAR, root, chord, p, energy)
    if bars - nb >= 0.5:
        root, chord = chord_at(p.get("chords", LOOP), nb + p.get("offset", 0))
        at = start + nb * BAR
        m.pads.add(supersaw(chord, BAR / 2, cutoff=3000, attack=0.02, release=0.3), at, 0.5)


def sec_drop(m: Mix, start: float, bars: float, p: dict):
    """Revelación: impacto + motivo de marca en campana + groove completo."""
    m.fx_music.add(sfx_impact(), start, 0.9)
    motif = p.get("motif", [(0.0, "A5"), (0.75, "C6"), (1.5, "F6")])
    for beat, note in motif:
        m.lead.add(bell(n(note), 1.6, index=2.0), start + beat * BEAT, 0.5)
    sec_groove(m, start, bars, {**p, "energy": p.get("energy", 1.0)})


def sec_breakdown(m: Mix, start: float, bars: float, p: dict):
    """Cierre/CTA: sin batería, pads abiertos, piano eléctrico y motivo."""
    nb = int(round(bars))
    chords = p.get("chords", LOOP)
    for b in range(nb):
        at = start + b * BAR
        root, chord = chord_at(chords, b + p.get("offset", 0))
        m.pads.add(supersaw(chord, BAR, cutoff=2600, attack=0.3, release=1.2), at, 0.55)
        m.lead.add(keys([c + 12 for c in chord[:3]], BAR * 0.9), at, 0.4)
        m.bass.add(sub_bass(root, BAR - 0.1, 0.7), at, 0.4)
        if p.get("pulse", True):
            for k in range(4):
                m.drums.add(shaker(), at + k * BEAT + BEAT / 2, 0.08)


def sec_outro(m: Mix, start: float, bars: float, p: dict):
    """Golpe final y acorde que se apaga."""
    m.fx_music.add(sfx_impact(), start, 0.75)
    root, chord = PROG[p.get("chord", "F")]
    tail = min(bars * BAR, m.duration - start)
    m.pads.add(supersaw(chord + [chord[0] + 12], tail * 0.6, cutoff=3200, attack=0.01, release=tail * 0.4), start, 0.6)
    m.bass.add(sub_bass(root, tail * 0.5, 0.9), start, 0.45)
    m.drums.add(kick(), start, 0.9)
    motif = p.get("motif", [(0.0, "F5"), (0.5, "A5"), (1.0, "C6"), (1.5, "F6")])
    for beat, note in motif:
        m.lead.add(bell(n(note), 2.2, index=1.6), start + beat * BEAT, 0.45)


def sec_silence(m: Mix, start: float, bars: float, p: dict):
    pass


SECTIONS = {
    "tension": sec_tension,
    "build": sec_build,
    "drop": sec_drop,
    "groove": sec_groove,
    "breakdown": sec_breakdown,
    "outro": sec_outro,
    "silence": sec_silence,
}


# ------------------------------------------------------------ efectos de sonido

def render_sfx(m: Mix, cues: list[dict]):
    for c in cues:
        t = c["t"]
        g = c.get("gain", 1.0)
        pan = c.get("pan", 0.0)
        kind = c["sfx"]
        pitch = c.get("pitch", 1.0)
        dur = c.get("durS")
        note = c.get("note")
        if kind == "tock":
            x = sfx_tock(pitch)
            base = 0.8
        elif kind == "whoosh":
            x = sfx_whoosh(dur or 0.5, True)
            base = 0.55
        elif kind == "whooshDown":
            x = sfx_whoosh(dur or 0.5, False)
            base = 0.5
        elif kind == "swipe":
            x = sfx_swipe()
            base = 0.45
        elif kind == "click":
            x = sfx_click(note)
            base = 0.55
        elif kind == "pop":
            x = sfx_pop(note)
            base = 0.4
        elif kind == "ping":
            x = sfx_ping(c.get("tone", "dissonant"))
            base = 0.4
        elif kind == "success":
            x = sfx_success()
            base = 0.5
        elif kind == "tick":
            x = sfx_tick(note)
            base = 0.4
        elif kind == "flip":
            x = sfx_flip()
            base = 0.55
        elif kind == "type":
            x = sfx_type()
            base = 0.5
        elif kind == "buzz":
            x = sfx_buzz()
            base = 0.5
        elif kind == "impact":
            x = sfx_impact()
            base = 0.7
        elif kind == "riser":
            x = sfx_riser(dur or 2.0)
            base = 0.45
        elif kind == "vibrate":
            x = sfx_vibrate()
            base = 0.6
        elif kind == "clack":
            x = sfx_clack()
            base = 0.7
        else:
            raise ValueError(f"sfx desconocido: {kind}")
        if x.ndim == 1:
            ang = (pan + 1) * np.pi / 4
            x = np.stack([x * np.cos(ang), x * np.sin(ang)], axis=1) * np.sqrt(2)
        m.sfx.add(x, t, base * g)


# ------------------------------------------------------------ mezcla

def build(fmt: str, timeline: dict):
    spec = timeline[fmt]
    duration = spec["seconds"]
    m = Mix(duration)
    for sec in ARRANGEMENT[fmt]:
        start = sec["bar"] * BAR
        SECTIONS[sec["type"]](m, start, sec["bars"], sec.get("params", {}))
    render_sfx(m, spec["cues"])

    length = len(m.drums.buf)
    ir_room = make_ir(1.9, 0.025, 5200)
    ir_short = make_ir(0.6, 0.01, 7000)
    sc = sidechain_env(length, m.kicks, depth=0.55, release=0.2)[:, None]

    drums = m.drums.buf
    bass = m.bass.buf * sc
    pads = m.pads.buf * (0.55 + 0.45 * sc)
    lead = m.lead.buf
    lead = lead + pingpong(lead, BEAT * 0.75, 0.35, 4, 0.22)
    fxm = m.fx_music.buf
    music = (
        drums * 0.8
        + reverb(drums, ir_short, 0.08)
        + bass * 0.55
        + pads * 1.05
        + reverb(pads, ir_room, 0.4)
        + lead * 1.25
        + reverb(lead, ir_room, 0.35)
        + fxm * 0.8
        + reverb(fxm, ir_room, 0.2)
    )
    sfx = m.sfx.buf + reverb(m.sfx.buf, ir_short, 0.12)

    n_out = int(round(duration * SR))
    # Final: fundido de 60 ms para que el corte no haga clic.
    fade = np.ones(n_out)
    fl = int(0.06 * SR)
    fade[-fl:] = np.linspace(1, 0, fl)

    def finish(x, target):
        y = master(x[:n_out] * fade[:, None], lufs_target=target)
        return y.astype(np.float32)

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
