from __future__ import annotations

from pptx.enum.text import PP_ALIGN

from components.primitives import line, rect, textbox
from theme.tokens import FONTS, PALETTE, dark_accent


def indexed_row(
    slide,
    index: str,
    title: str,
    body: str,
    x: float,
    y: float,
    w: float,
    *,
    dark: bool = False,
    height: float = 0.72,
):
    accent = dark_accent(dark)
    title_color = PALETTE.paper if dark else PALETTE.ink
    body_color = "B4B3AC" if dark else PALETTE.ink_mute
    rule = PALETTE.line_dark if dark else PALETTE.line
    line(slide, x, y, x + w, y, color=rule)
    textbox(slide, index, x, y + 0.15, 0.5, 0.2, font=FONTS.mono, size=8.2, color=accent)
    textbox(slide, title, x + 0.62, y + 0.12, 2.25, 0.28, font=FONTS.body, size=11, color=title_color, bold=True)
    textbox(slide, body, x + 3.0, y + 0.12, w - 3.0, height - 0.12, font=FONTS.body, size=9.2, color=body_color)


def process_step(slide, index: str, title: str, body: str, x: float, y: float, w: float, *, dark: bool = False, active: bool = False):
    accent = dark_accent(dark)
    ink = PALETTE.paper if dark else PALETTE.ink
    muted = "B4B3AC" if dark else PALETTE.ink_mute
    fill = accent if active else None
    if fill:
        rect(slide, x, y, w, 0.58, fill=fill)
        index_color = PALETTE.ink if dark else PALETTE.paper
        title_color = index_color
    else:
        line(slide, x, y, x + w, y, color=PALETTE.line_dark if dark else PALETTE.line)
        index_color = accent
        title_color = ink
    textbox(slide, index, x + 0.08, y + 0.14, 0.35, 0.2, font=FONTS.mono, size=8, color=index_color)
    textbox(slide, title, x + 0.48, y + 0.11, w - 0.56, 0.25, font=FONTS.body, size=10.2, color=title_color, bold=True)
    textbox(slide, body, x, y + 0.72, w, 0.62, font=FONTS.body, size=9.1, color=muted)


def architecture_node(slide, label: str, x: float, y: float, w: float, h: float, *, dark: bool = False, active: bool = False):
    accent = dark_accent(dark)
    fill = accent if active else None
    border = accent if active else (PALETTE.line_dark if dark else PALETTE.line)
    text_color = (PALETTE.ink if dark else PALETTE.paper) if active else (PALETTE.paper if dark else PALETTE.ink)
    rect(slide, x, y, w, h, fill=fill, line=border)
    textbox(slide, label, x + 0.10, y + 0.10, w - 0.20, h - 0.20, font=FONTS.body, size=10, color=text_color, bold=True, align=PP_ALIGN.CENTER)


def mini_layout(slide, x: float, y: float, w: float, h: float, variant: int, *, dark: bool = False):
    bg = PALETTE.ink if dark else PALETTE.paper
    rule = PALETTE.line_dark if dark else PALETTE.line
    accent = dark_accent(dark)
    rect(slide, x, y, w, h, fill=bg, line=rule)
    rect(slide, x + 0.10, y + 0.10, 0.04, 0.04, fill=accent)
    if variant == 0:
        rect(slide, x + 0.10, y + 0.35, w * 0.65, 0.10, fill=PALETTE.paper if dark else PALETTE.ink)
        rect(slide, x + 0.10, y + 0.52, w * 0.48, 0.05, fill=rule)
    elif variant == 1:
        for i in range(3):
            line(slide, x + 0.10, y + 0.34 + i * 0.22, x + w - 0.10, y + 0.34 + i * 0.22, color=rule)
            rect(slide, x + 0.10, y + 0.40 + i * 0.22, 0.04, 0.04, fill=accent)
    elif variant == 2:
        rect(slide, x + 0.10, y + 0.32, w * 0.48, h * 0.50, fill=PALETTE.ink_2 if dark else PALETTE.paper_2)
        for i in range(3):
            line(slide, x + w * 0.63, y + 0.38 + i * 0.18, x + w - 0.10, y + 0.38 + i * 0.18, color=rule)
    else:
        for i in range(4):
            xx = x + 0.10 + i * (w - 0.28) / 4
            rect(slide, xx, y + 0.42, (w - 0.40) / 4, 0.32, fill=accent if i == 0 else None, line=accent if i == 0 else rule)
