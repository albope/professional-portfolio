from __future__ import annotations

from collections.abc import Sequence

from pptx.enum.text import PP_ALIGN

from components.primitives import line, rect, textbox
from theme.tokens import FONTS, PALETTE, dark_accent


def metric(slide, label: str, value: str, note: str, x: float, y: float, w: float, *, dark: bool = False):
    accent = dark_accent(dark)
    ink = PALETTE.paper if dark else PALETTE.ink
    muted = "A8A7A1" if dark else PALETTE.ink_mute
    rule = PALETTE.line_dark if dark else PALETTE.line
    line(slide, x, y, x + w, y, color=rule)
    textbox(slide, label, x, y + 0.18, w, 0.18, font=FONTS.mono, size=7.6, color=accent, tracking=0.12, uppercase=True)
    textbox(slide, value, x, y + 0.55, w, 0.55, font=FONTS.display, size=22, color=ink, uppercase=True)
    textbox(slide, note, x, y + 1.20, w, 0.50, font=FONTS.body, size=9.5, color=muted)


def tag(slide, text: str, x: float, y: float, w: float, *, dark: bool = False, active: bool = False):
    accent = dark_accent(dark)
    base = PALETTE.paper if dark else PALETTE.ink
    if active:
        rect(slide, x, y, w, 0.34, fill=accent, line=accent)
        text_color = PALETTE.ink if dark else PALETTE.paper
    else:
        rect(slide, x, y, w, 0.34, line=PALETTE.line_dark if dark else PALETTE.line)
        text_color = base
    textbox(slide, text, x + 0.10, y + 0.09, w - 0.20, 0.16, font=FONTS.mono, size=6.8, color=text_color, align=PP_ALIGN.CENTER, uppercase=True)


def table(
    slide,
    headers: Sequence[str],
    rows: Sequence[Sequence[str]],
    x: float,
    y: float,
    widths: Sequence[float],
    *,
    dark: bool = False,
    row_height: float = 0.56,
    highlighted_rows: set[int] | None = None,
    alignments: Sequence | None = None,
):
    highlighted_rows = highlighted_rows or set()
    alignments = alignments or [PP_ALIGN.LEFT] * len(headers)
    rule = PALETTE.line_dark if dark else PALETTE.line
    accent = dark_accent(dark)
    ink = PALETTE.paper if dark else PALETTE.ink
    muted = "B0AFA9" if dark else PALETTE.ink_mute
    total_w = sum(widths)
    line(slide, x, y, x + total_w, y, color=accent, width=1.0)
    cursor = x
    for index, (header, width) in enumerate(zip(headers, widths)):
        textbox(slide, header, cursor + 0.08, y + 0.17, width - 0.16, 0.18, font=FONTS.mono, size=7.1, color=accent, tracking=0.08, uppercase=True, align=alignments[index])
        cursor += width
    header_bottom = y + 0.48
    line(slide, x, header_bottom, x + total_w, header_bottom, color=rule)
    for row_index, row in enumerate(rows):
        row_y = header_bottom + row_index * row_height
        if row_index in highlighted_rows:
            rect(slide, x, row_y, total_w, row_height, fill=accent)
        cursor = x
        for col_index, (value, width) in enumerate(zip(row, widths)):
            if row_index in highlighted_rows:
                color = PALETTE.ink if dark else PALETTE.paper
            else:
                color = ink if col_index == 0 else muted
            textbox(
                slide,
                value,
                cursor + 0.08,
                row_y + 0.16,
                width - 0.16,
                row_height - 0.18,
                font=FONTS.body if col_index else FONTS.mono,
                size=8.8 if col_index else 7.5,
                color=color,
                bold=col_index == 1,
                align=alignments[col_index],
            )
            cursor += width
        if row_index not in highlighted_rows:
            line(slide, x, row_y + row_height, x + total_w, row_y + row_height, color=rule)


def indexed_column(slide, index: str, title: str, body: str, x: float, y: float, w: float, *, dark: bool = False):
    accent = dark_accent(dark)
    ink = PALETTE.paper if dark else PALETTE.ink
    muted = "AAA9A3" if dark else PALETTE.ink_mute
    textbox(slide, index, x, y, w, 0.20, font=FONTS.mono, size=7.8, color=accent, tracking=0.10, uppercase=True)
    textbox(slide, title, x, y + 0.41, w, 0.62, font=FONTS.display, size=15.5, color=ink, uppercase=True)
    textbox(slide, body, x, y + 1.22, w, 0.92, font=FONTS.body, size=9.8, color=muted)
