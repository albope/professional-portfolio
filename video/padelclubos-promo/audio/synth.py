"""Motor de síntesis de la banda sonora de Padel Club OS.

Todo se genera por código (numpy/scipy): instrumentos, efectos, reverb y
masterización. No hay samples de terceros, así que la música es original y
libre de derechos.
"""

from __future__ import annotations

import numpy as np
from scipy import signal

SR = 48_000
BPM = 120.0
BEAT = 60.0 / BPM  # 0,5 s
BAR = BEAT * 4  # 2 s

rng = np.random.default_rng(20260924)


# ---------------------------------------------------------------- utilidades

def midi(n: float) -> float:
    return 440.0 * 2 ** ((n - 69) / 12)


NOTE = {"C": 0, "C#": 1, "Db": 1, "D": 2, "D#": 3, "Eb": 3, "E": 4, "F": 5, "F#": 6, "Gb": 6,
        "G": 7, "G#": 8, "Ab": 8, "A": 9, "A#": 10, "Bb": 10, "B": 11}


def n(name: str) -> int:
    """'A4' -> número MIDI."""
    pitch = name[:-1]
    octave = int(name[-1])
    return 12 * (octave + 1) + NOTE[pitch]


def t_axis(dur: float) -> np.ndarray:
    return np.arange(int(dur * SR)) / SR


def adsr(length: int, a: float, d: float, s: float, r: float, hold: float | None = None) -> np.ndarray:
    """Envolvente ADSR en muestras. `hold` = segundos antes del release."""
    a_n, d_n, r_n = int(a * SR), int(d * SR), int(r * SR)
    total = length
    hold_n = int(hold * SR) if hold is not None else max(0, total - r_n)
    env = np.zeros(total)
    idx = 0
    seg = min(a_n, total)
    if seg > 0:
        env[:seg] = np.linspace(0, 1, seg, endpoint=False) ** 1.5
    idx = seg
    seg = min(d_n, max(0, total - idx))
    if seg > 0:
        env[idx:idx + seg] = 1 - (1 - s) * (np.linspace(0, 1, seg, endpoint=False) ** 0.7)
    idx += seg
    if idx < hold_n:
        env[idx:hold_n] = s
        idx = hold_n
    seg = max(0, total - idx)
    if seg > 0:
        start_level = env[idx - 1] if idx > 0 else s
        env[idx:] = start_level * (1 - np.linspace(0, 1, seg)) ** 2
    return env


def exp_decay(length: int, tau: float) -> np.ndarray:
    return np.exp(-np.arange(length) / (tau * SR))


def lowpass(x: np.ndarray, cutoff: float, order: int = 2) -> np.ndarray:
    cutoff = min(cutoff, SR * 0.45)
    sos = signal.butter(order, cutoff, "low", fs=SR, output="sos")
    return signal.sosfilt(sos, x, axis=0)


def highpass(x: np.ndarray, cutoff: float, order: int = 2) -> np.ndarray:
    sos = signal.butter(order, cutoff, "high", fs=SR, output="sos")
    return signal.sosfilt(sos, x, axis=0)


def bandpass(x: np.ndarray, lo: float, hi: float, order: int = 2) -> np.ndarray:
    sos = signal.butter(order, [lo, min(hi, SR * 0.45)], "band", fs=SR, output="sos")
    return signal.sosfilt(sos, x, axis=0)


def svf_lowpass_sweep(x: np.ndarray, cutoffs: np.ndarray, q: float = 0.9) -> np.ndarray:
    """Filtro de estado variable (Chamberlin) con cutoff variable por muestra."""
    y = np.zeros_like(x)
    low = band = 0.0
    damp = 1.0 / q
    f = 2 * np.sin(np.pi * np.clip(cutoffs, 20, SR * 0.2) / SR)
    for i in range(len(x)):
        high = x[i] - low - damp * band
        band += f[i] * high
        low += f[i] * band
        y[i] = low
    return y


def saw(freq: float | np.ndarray, t: np.ndarray, phase: float = 0.0) -> np.ndarray:
    """Diente de sierra con bandas limitadas (PolyBLEP simple)."""
    if np.isscalar(freq):
        ph = (phase + freq * t) % 1.0
        dt = freq / SR
    else:
        ph = (phase + np.cumsum(freq) / SR) % 1.0
        dt = freq / SR
    y = 2 * ph - 1
    # PolyBLEP
    m1 = ph < dt
    tt = np.where(m1, ph / np.maximum(dt, 1e-9), 0)
    y = y - np.where(m1, tt + tt - tt * tt - 1, 0)
    m2 = ph > 1 - dt
    tt = np.where(m2, (ph - 1) / np.maximum(dt, 1e-9), 0)
    y = y - np.where(m2, tt * tt + tt + tt + 1, 0)
    return y


def sine(freq: float | np.ndarray, t: np.ndarray, phase: float = 0.0) -> np.ndarray:
    if np.isscalar(freq):
        return np.sin(2 * np.pi * freq * t + phase)
    return np.sin(2 * np.pi * np.cumsum(freq) / SR + phase)


def pan_stereo(x: np.ndarray, pan: float = 0.0) -> np.ndarray:
    """pan -1 (izq) … 1 (der), ley de potencia constante."""
    ang = (pan + 1) * np.pi / 4
    return np.stack([x * np.cos(ang), x * np.sin(ang)], axis=1)


def to_stereo(x: np.ndarray) -> np.ndarray:
    return x if x.ndim == 2 else np.stack([x, x], axis=1)


# ---------------------------------------------------------------- pista

class Track:
    """Buffer estéreo en el que se suman eventos."""

    def __init__(self, duration: float):
        self.buf = np.zeros((int(duration * SR) + SR * 4, 2))

    def add(self, x: np.ndarray, at: float, gain: float = 1.0):
        x = to_stereo(x) * gain
        i = int(round(at * SR))
        if i < 0:
            x = x[-i:]
            i = 0
        end = min(len(self.buf), i + len(x))
        if end > i:
            self.buf[i:end] += x[: end - i]


# ---------------------------------------------------------------- instrumentos

def kick(punch: float = 1.0) -> np.ndarray:
    dur = 0.45
    t = t_axis(dur)
    f = 50 + 120 * np.exp(-t / 0.03)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * exp_decay(len(t), 0.12)
    click = highpass(rng.standard_normal(len(t)), 2500) * exp_decay(len(t), 0.004) * 0.35
    y = np.tanh((body + click) * 1.6 * punch) / np.tanh(1.6)
    return y


def clap() -> np.ndarray:
    dur = 0.5
    t = t_axis(dur)
    noise = rng.standard_normal(len(t))
    env = np.zeros(len(t))
    for k, off in enumerate([0.0, 0.011, 0.022]):
        i = int(off * SR)
        env[i:] += exp_decay(len(t) - i, 0.006) * (0.8 if k < 2 else 1.0)
    tail = exp_decay(len(t), 0.09) * 0.55
    y = bandpass(noise, 900, 4200) * (env + tail)
    return y * 0.9


def hat(open_: bool = False) -> np.ndarray:
    dur = 0.35 if open_ else 0.07
    t = t_axis(dur)
    # Metálico tipo 808: cuadradas inarmónicas + ruido.
    freqs = [205.3, 304.4, 369.6, 522.7, 540.0, 800.0]
    metal = sum(signal.square(2 * np.pi * f * 1.9 * t) for f in freqs) / len(freqs)
    y = highpass(metal * 0.6 + rng.standard_normal(len(t)) * 0.5, 7000, order=4)
    return y * exp_decay(len(t), 0.11 if open_ else 0.018)


def shaker() -> np.ndarray:
    t = t_axis(0.09)
    env = np.minimum(1, t / 0.012) * exp_decay(len(t), 0.03)
    return bandpass(rng.standard_normal(len(t)), 5000, 12000) * env * 0.6


def sub_bass(note: int, dur: float, vel: float = 1.0) -> np.ndarray:
    t = t_axis(dur + 0.08)
    f = midi(note)
    y = np.sin(2 * np.pi * f * t) + 0.18 * np.sin(2 * np.pi * 2 * f * t) + 0.06 * saw(f, t)
    y = lowpass(y, 900)
    env = adsr(len(t), 0.004, 0.08, 0.85, 0.07, hold=dur)
    return np.tanh(y * env * 1.3) * vel


def supersaw(notes: list[int], dur: float, cutoff: float = 2400, attack: float = 0.35, release: float = 0.8,
             voices: int = 7, detune: float = 0.12, brightness_env: bool = False) -> np.ndarray:
    total = dur + release
    t = t_axis(total)
    L = np.zeros(len(t))
    R = np.zeros(len(t))
    for note in notes:
        base = midi(note)
        for v in range(voices):
            spread = (v - (voices - 1) / 2) / ((voices - 1) / 2)
            f = base * 2 ** (spread * detune / 12)
            ph = rng.random()
            osc = saw(f, t, ph)
            pan = spread * 0.8
            L += osc * np.cos((pan + 1) * np.pi / 4)
            R += osc * np.sin((pan + 1) * np.pi / 4)
    norm = 1.0 / (len(notes) * voices ** 0.5 * 1.6)
    st = np.stack([L, R], axis=1) * norm
    if brightness_env:
        cut = cutoff * (0.35 + 0.65 * np.minimum(1, t / max(dur, 1e-3)))
        st = np.stack([svf_lowpass_sweep(st[:, 0], cut), svf_lowpass_sweep(st[:, 1], cut)], axis=1)
    else:
        st = lowpass(st, cutoff, order=2)
    env = adsr(len(t), attack, 0.4, 0.8, release, hold=dur)
    return st * env[:, None]


def pluck(note: int, dur: float = 0.3, bright: float = 1.0) -> np.ndarray:
    t = t_axis(dur + 0.25)
    f = midi(note)
    osc = saw(f, t) * 0.6 + saw(f * 1.004, t, 0.3) * 0.4
    cut = 600 + 5200 * bright * np.exp(-t / 0.06)
    y = svf_lowpass_sweep(osc, cut, q=1.2)
    env = adsr(len(t), 0.002, 0.18, 0.0, 0.1, hold=dur)
    return y * env * 0.8


def bell(note: int, dur: float = 1.2, index: float = 2.2) -> np.ndarray:
    """Campana FM (portadora:moduladora 1:3,5), para el motivo de marca."""
    t = t_axis(dur)
    f = midi(note)
    idx = index * np.exp(-t / 0.35)
    mod = np.sin(2 * np.pi * f * 3.5 * t) * idx
    y = np.sin(2 * np.pi * f * t + mod)
    y += 0.25 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t / 0.25)
    return y * exp_decay(len(t), 0.45) * np.minimum(1, t / 0.003) * 0.5


def keys(notes: list[int], dur: float) -> np.ndarray:
    """Piano eléctrico suave (FM 1:1) para la sección de cierre."""
    t = t_axis(dur + 0.6)
    y = np.zeros(len(t))
    for note in notes:
        f = midi(note)
        idx = 1.4 * np.exp(-t / 0.5)
        y += np.sin(2 * np.pi * f * t + idx * np.sin(2 * np.pi * f * t)) * exp_decay(len(t), 1.1)
    env = adsr(len(t), 0.004, 0.3, 0.7, 0.6, hold=dur)
    return y * env / max(1, len(notes)) * 0.7


# ---------------------------------------------------------------- efectos de sonido

def sfx_tock(pitch: float = 1.0, metallic: bool = False) -> np.ndarray:
    """Golpe de pala: seno de 1,1 kHz que cae a 650 Hz en 25 ms + transitorio de
    ruido de 3 ms y cuerpo grave. `metallic` = variante «valla» para errores."""
    t = t_axis(0.25)
    f = (650 + 450 * np.exp(-t / 0.009)) * pitch
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * exp_decay(len(t), 0.03)
    y += 0.45 * np.sin(2 * np.pi * 420 * pitch * t) * exp_decay(len(t), 0.045)
    y += 0.25 * np.sin(2 * np.pi * 2750 * pitch * t) * exp_decay(len(t), 0.01)
    y += bandpass(rng.standard_normal(len(t)), 1500, 7000) * exp_decay(len(t), 0.0025) * 0.9
    if metallic:
        for fm, d in ((1870, 0.12), (2533, 0.09), (3410, 0.07)):
            y += 0.18 * np.sin(2 * np.pi * fm * t) * exp_decay(len(t), d)
    return np.tanh(y * 1.2) * 0.9


def sfx_whoosh(dur: float = 0.6, rising: bool = True, lo: float = 300, hi: float = 5000) -> np.ndarray:
    t = t_axis(dur)
    x = rng.standard_normal(len(t))
    ph = t / dur
    centre = lo * (hi / lo) ** (ph if rising else 1 - ph)
    y = svf_lowpass_sweep(x, centre * 1.6, q=2.2) - svf_lowpass_sweep(x, centre * 0.6, q=2.2)
    env = np.sin(np.pi * np.clip(ph, 0, 1)) ** 1.6
    pan = np.linspace(-0.7, 0.7, len(t))
    L = y * env * np.cos((pan + 1) * np.pi / 4)
    R = y * env * np.sin((pan + 1) * np.pi / 4)
    return np.stack([L, R], axis=1) * 0.6


def sfx_click(note: str | None = None) -> np.ndarray:
    """Clic de UI: ruido de 2 ms + blip de 4 kHz (o afinado a `note`)."""
    t = t_axis(0.06 if note else 0.04)
    f = midi(n(note)) if note else 4000
    y = np.sin(2 * np.pi * f * t) * exp_decay(len(t), 0.012 if note else 0.004)
    y += highpass(rng.standard_normal(len(t)), 4000) * exp_decay(len(t), 0.0015) * 0.5
    return y * 0.6


def sfx_pop(note: str | None = None) -> np.ndarray:
    t = t_axis(0.09)
    base = midi(n(note)) if note else 520
    f = base * (1 + (1 - np.exp(-t / 0.02)) * (0.0 if note else 1.0))
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * exp_decay(len(t), 0.025)
    return y * 0.7


def sfx_ping(tone: str = "dissonant") -> np.ndarray:
    """Aviso de mensaje, 150 ms: disonante (La5+Si♭5) antes del drop,
    consonante (Do6+Sol6) después. Las dos notas suenan juntas."""
    notes = (n("A5"), n("Bb5")) if tone == "dissonant" else (n("C6"), n("G6"))
    y = np.zeros(int(0.5 * SR))
    for k, note in enumerate(notes):
        b = bell(note, 0.45, index=0.9)
        off = int(k * 0.012 * SR)
        y[off: off + len(b)] += b[: len(y) - off] * 0.7
    return y * 0.8


def sfx_success() -> np.ndarray:
    """Confirmación de reserva o pago (celebrate, 400 ms): quinta justa Do6 → Sol6."""
    y = np.zeros(int(1.0 * SR))
    for off_s, note in ((0.0, n("C6")), (0.13, n("G6"))):
        b = bell(note, 0.85, index=1.2)
        off = int(off_s * SR)
        y[off: off + len(b)] += b[: len(y) - off]
    return y * 0.6


def sfx_vibrate() -> np.ndarray:
    """Móvil vibrando: cuadrada de 150 Hz con AM a 25 Hz, dos pulsos."""
    y = np.zeros(int(0.5 * SR))
    for off in (0.0, 0.26):
        t = t_axis(0.2)
        v = lowpass(signal.square(2 * np.pi * 150 * t), 1200) * (0.6 + 0.4 * np.sin(2 * np.pi * 25 * t))
        v *= adsr(len(t), 0.01, 0.02, 0.9, 0.03)
        i = int(off * SR)
        y[i: i + len(v)] += v[: len(y) - i] * 0.45
    return y


def sfx_clack() -> np.ndarray:
    """Interruptor mecánico: doble clic con cuerpo."""
    y = np.zeros(int(0.12 * SR))
    for off, g, f in ((0.0, 1.0, 1800), (0.032, 0.7, 1300)):
        t = t_axis(0.05)
        c = bandpass(rng.standard_normal(len(t)), f * 0.6, f * 2.5) * exp_decay(len(t), 0.004)
        c += np.sin(2 * np.pi * 220 * t) * exp_decay(len(t), 0.012) * 0.6
        i = int(off * SR)
        y[i: i + len(c)] += c[: len(y) - i] * g
    return y * 0.8


def sfx_tick(note: str | None = None) -> np.ndarray:
    t = t_axis(0.03)
    y = bandpass(rng.standard_normal(len(t)), 3000, 9000) * exp_decay(len(t), 0.003) * 0.7
    if note:
        y += np.sin(2 * np.pi * midi(n(note)) * t) * exp_decay(len(t), 0.008) * 0.4
    return y


def sfx_flip() -> np.ndarray:
    """Paleta de marcador que gira: dos clics secos."""
    y = np.zeros(int(0.08 * SR))
    for off, g in [(0, 1.0), (0.028, 0.6)]:
        c = sfx_tick() * g
        i = int(off * SR)
        y[i: i + len(c)] += c[: len(y) - i]
    return y


def sfx_type() -> np.ndarray:
    t = t_axis(0.035)
    y = bandpass(rng.standard_normal(len(t)), 1500, 5000) * exp_decay(len(t), 0.005)
    return y * 0.45


def sfx_buzz() -> np.ndarray:
    """Error / conflicto: 70 Hz + clúster de 120 ms."""
    t = t_axis(0.3)
    y = np.sin(2 * np.pi * 70 * t) * exp_decay(len(t), 0.12) * 0.7
    cl = sum(saw(midi(k), t) for k in (n("A3"), n("Bb3"), n("B3")))
    y += lowpass(cl, 1400) * adsr(len(t), 0.004, 0.03, 0.7, 0.04, hold=0.12) * 0.22
    return np.tanh(y * 1.3) * 0.8


def sfx_impact() -> np.ndarray:
    """Golpe de revelación: boom grave + ruido filtrado largo."""
    t = t_axis(2.5)
    f = 38 + 60 * np.exp(-t / 0.08)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * exp_decay(len(t), 0.45)
    noise = lowpass(rng.standard_normal(len(t)), 3000) * exp_decay(len(t), 0.35) * 0.35
    return np.tanh((boom + noise) * 1.4) * 0.8


def sfx_riser(dur: float) -> np.ndarray:
    t = t_axis(dur)
    ph = t / dur
    x = rng.standard_normal(len(t))
    cut = 400 * (12000 / 400) ** (ph ** 1.6)
    noise = svf_lowpass_sweep(x, cut, q=1.4) * 0.5
    f = midi(n("A2")) * 2 ** (ph * 2)
    tone = saw(f, t) * 0.15
    env = ph ** 2.2
    y = (noise + lowpass(tone, 4000)) * env
    return y


def sfx_swipe() -> np.ndarray:
    return sfx_whoosh(0.28, True, 1200, 9000) * 0.6


# ---------------------------------------------------------------- efectos de mezcla

def make_ir(decay: float = 1.8, predelay: float = 0.02, damp: float = 5000) -> np.ndarray:
    length = int((decay * 1.4 + predelay) * SR)
    t = np.arange(length) / SR
    env = np.exp(-6.9 * t / decay)
    env[: int(predelay * SR)] = 0
    ir = np.stack([rng.standard_normal(length), rng.standard_normal(length)], axis=1) * env[:, None]
    ir = lowpass(ir, damp)
    return ir / np.sqrt(np.sum(ir ** 2, axis=0, keepdims=True))


def reverb(x: np.ndarray, ir: np.ndarray, wet: float = 0.25) -> np.ndarray:
    x = to_stereo(x)
    L = signal.fftconvolve(x[:, 0], ir[:, 0])[: len(x)]
    R = signal.fftconvolve(x[:, 1], ir[:, 1])[: len(x)]
    return np.stack([L, R], axis=1) * wet


def pingpong(x: np.ndarray, time: float, feedback: float = 0.35, repeats: int = 4, wet: float = 0.3) -> np.ndarray:
    x = to_stereo(x)
    out = np.zeros_like(x)
    d = int(time * SR)
    mono = x.mean(axis=1)
    for k in range(1, repeats + 1):
        g = wet * feedback ** (k - 1)
        ch = k % 2
        shifted = np.zeros(len(x))
        if k * d < len(x):
            shifted[k * d:] = mono[: len(x) - k * d]
        out[:, ch] += lowpass(shifted, 5000 - 600 * k) * g
    return out


def sidechain_env(length: int, hits: list[float], depth: float = 0.6, release: float = 0.22) -> np.ndarray:
    env = np.ones(length)
    for h in hits:
        i = int(h * SR)
        if i >= length:
            continue
        seg = min(length - i, int(release * 1.6 * SR))
        tt = np.arange(seg) / SR
        duck = 1 - depth * np.exp(-tt / (release * 0.45)) * (tt < release * 1.6)
        env[i: i + seg] = np.minimum(env[i: i + seg], duck)
    return env


# ---------------------------------------------------------------- masterización

def compressor(x: np.ndarray, threshold_db: float = -14, ratio: float = 2.5, attack: float = 0.01,
               release: float = 0.15, makeup_db: float = 0.0) -> np.ndarray:
    level = np.max(np.abs(x), axis=1)
    # Detector RMS suavizado (vectorizado con filtro de un polo en dos pasadas).
    a_att = np.exp(-1 / (attack * SR))
    a_rel = np.exp(-1 / (release * SR))
    env = np.zeros_like(level)
    e = 0.0
    for i, v in enumerate(level):
        coef = a_att if v > e else a_rel
        e = coef * e + (1 - coef) * v
        env[i] = e
    env_db = 20 * np.log10(np.maximum(env, 1e-6))
    over = np.maximum(0, env_db - threshold_db)
    gain_db = -over * (1 - 1 / ratio) + makeup_db
    return x * (10 ** (gain_db / 20))[:, None]


def limiter(x: np.ndarray, ceiling_db: float = -1.0, lookahead: float = 0.005, release: float = 0.08) -> np.ndarray:
    ceiling = 10 ** (ceiling_db / 20)
    peak = np.max(np.abs(x), axis=1)
    la = int(lookahead * SR)
    # Máximo en ventana de anticipación.
    padded = np.concatenate([peak, np.zeros(la)])
    from scipy.ndimage import maximum_filter1d
    ahead = maximum_filter1d(padded, size=la * 2 + 1)[: len(peak)]
    target = np.minimum(1.0, ceiling / np.maximum(ahead, 1e-9))
    g = np.zeros_like(target)
    cur = 1.0
    a_rel = np.exp(-1 / (release * SR))
    for i, tg in enumerate(target):
        cur = tg if tg < cur else a_rel * cur + (1 - a_rel) * tg
        g[i] = cur
    y = x * g[:, None]
    return np.clip(y, -ceiling, ceiling)


def master(mix: np.ndarray, lufs_target: float = -14.0) -> np.ndarray:
    import pyloudnorm as pyln

    y = highpass(mix, 28, order=2)
    y = compressor(y, threshold_db=-16, ratio=2.0, attack=0.015, release=0.2)
    meter = pyln.Meter(SR)
    for _ in range(3):
        loud = meter.integrated_loudness(y)
        if not np.isfinite(loud):
            break
        y = y * 10 ** ((lufs_target - loud) / 20)
        y = limiter(y, ceiling_db=-1.2)
    return y
