from __future__ import annotations

from pptx.enum.text import PP_ALIGN

from components.primitives import eyebrow, line, rect, textbox, title_block
from layouts.base import blank_slide, chrome
from theme.tokens import FONTS, GRID, PALETTE


def _status(slide, text: str, x: float, y: float, w: float, *, active: bool = False):
    fill = PALETTE.cobalt_bright if active else PALETTE.ink_2
    color = PALETTE.ink if active else PALETTE.paper
    rect(slide, x, y, w, 0.26, fill=fill, line=PALETTE.line_dark)
    textbox(slide, text, x + 0.08, y + 0.07, w - 0.16, 0.12, font=FONTS.mono, size=6.3, color=color, align=PP_ALIGN.CENTER, uppercase=True)


def prototype(presentation, data: dict, number: int, total: int):
    """Editable product proof: desktop operations view plus field mobile flow."""
    slide = blank_slide(presentation)
    eyebrow(slide, data["eyebrow"])
    chrome(slide, number, total, label=data["footer_label"])
    title_block(slide, data["title"], y=1.00, w=9.7, h=1.0, size=28.5)
    textbox(slide, data["lead"], GRID.left, 2.06, 9.4, 0.46, font=FONTS.body, size=12.0, color=PALETTE.ink_mute)

    # Desktop application — all geometry remains editable.
    x, y, w, h = 0.72, 2.76, 8.32, 3.58
    rect(slide, x, y, w, h, fill=PALETTE.ink, line=PALETTE.ink)
    rect(slide, x, y, 1.48, h, fill=PALETTE.ink_2)
    textbox(slide, "RÍO TURIA", x + 0.18, y + 0.21, 1.10, 0.22, font=FONTS.display, size=8.3, color=PALETTE.paper, uppercase=True)
    rect(slide, x + 1.15, y + 0.28, 0.06, 0.06, fill=PALETTE.cobalt_bright)
    for idx, label in enumerate(("Centro de control", "Órdenes", "Agenda", "Clientes", "Informes")):
        item_y = y + 0.73 + idx * 0.43
        if idx == 0:
            rect(slide, x + 0.12, item_y - 0.06, 1.24, 0.31, fill=PALETTE.cobalt_bright)
        textbox(
            slide,
            label,
            x + 0.23,
            item_y,
            1.04,
            0.16,
            font=FONTS.body,
            size=6.8,
            color=PALETTE.ink if idx == 0 else "A8A7A1",
            bold=idx == 0,
        )
    textbox(slide, "CENTRO DE CONTROL", x + 1.78, y + 0.25, 2.7, 0.23, font=FONTS.display, size=10.2, color=PALETTE.paper, uppercase=True)
    textbox(slide, "LUNES · 31 AGO 2026", x + 5.92, y + 0.28, 1.78, 0.17, font=FONTS.mono, size=6.1, color=PALETTE.cobalt_bright, align=PP_ALIGN.RIGHT)

    metric_w = 1.82
    for idx, metric in enumerate(data["metrics"]):
        mx = x + 1.78 + idx * (metric_w + 0.16)
        rect(slide, mx, y + 0.70, metric_w, 0.72, fill=PALETTE.ink_2, line=PALETTE.line_dark)
        textbox(slide, metric["label"], mx + 0.12, y + 0.83, 1.52, 0.14, font=FONTS.mono, size=5.8, color=PALETTE.cobalt_bright, tracking=0.08, uppercase=True)
        textbox(slide, metric["value"], mx + 0.12, y + 1.06, 1.52, 0.22, font=FONTS.display, size=11.0, color=PALETTE.paper, uppercase=True)

    textbox(slide, "ÓRDENES PRIORITARIAS", x + 1.78, y + 1.68, 2.10, 0.17, font=FONTS.mono, size=6.2, color="98979F", tracking=0.08, uppercase=True)
    headers = ("OT", "CLIENTE", "TRABAJO", "TÉCNICO", "ESTADO")
    col_x = (x + 1.78, x + 2.38, x + 3.67, x + 5.52, x + 6.59)
    widths = (0.52, 1.19, 1.75, 0.98, 1.00)
    line(slide, x + 1.78, y + 1.99, x + 7.96, y + 1.99, color=PALETTE.line_dark)
    for hx, hw, label in zip(col_x, widths, headers):
        textbox(slide, label, hx, y + 1.82, hw, 0.13, font=FONTS.mono, size=5.5, color="85858C", uppercase=True)
    for row_idx, order in enumerate(data["orders"]):
        row_y = y + 2.16 + row_idx * 0.43
        line(slide, x + 1.78, row_y + 0.31, x + 7.96, row_y + 0.31, color=PALETTE.line_dark)
        textbox(slide, order["id"], col_x[0], row_y, widths[0], 0.16, font=FONTS.mono, size=6.3, color=PALETTE.cobalt_bright)
        textbox(slide, order["client"], col_x[1], row_y, widths[1], 0.18, font=FONTS.body, size=6.5, color=PALETTE.paper, bold=True)
        textbox(slide, order["task"], col_x[2], row_y, widths[2], 0.22, font=FONTS.body, size=6.3, color="B7B6B0")
        textbox(slide, order["tech"], col_x[3], row_y, widths[3], 0.18, font=FONTS.body, size=6.3, color="B7B6B0")
        _status(slide, order["status"], col_x[4], row_y - 0.04, widths[4], active=row_idx == 0)

    # Mobile field flow.
    mx, my, mw, mh = 9.42, 2.76, 3.19, 3.58
    rect(slide, mx, my, mw, mh, fill=PALETTE.paper_2, line=PALETTE.line)
    textbox(slide, "APP DE CAMPO", mx + 0.19, my + 0.20, 1.80, 0.18, font=FONTS.mono, size=6.8, color=PALETTE.cobalt, tracking=0.10, uppercase=True)
    textbox(slide, data["mobile"]["order"], mx + 0.19, my + 0.58, 1.35, 0.25, font=FONTS.display, size=12.3, color=PALETTE.ink, uppercase=True)
    _status(slide, data["mobile"]["status"], mx + 1.93, my + 0.56, 1.04, active=True)
    textbox(slide, data["mobile"]["client"], mx + 0.19, my + 1.03, 2.54, 0.24, font=FONTS.body, size=8.8, color=PALETTE.ink, bold=True)
    textbox(slide, data["mobile"]["address"], mx + 0.19, my + 1.32, 2.58, 0.36, font=FONTS.body, size=7.6, color=PALETTE.ink_mute)
    line(slide, mx + 0.19, my + 1.83, mx + 2.97, my + 1.83, color=PALETTE.line)
    for idx, item in enumerate(data["mobile"]["checks"]):
        iy = my + 2.02 + idx * 0.39
        rect(slide, mx + 0.19, iy, 0.16, 0.16, fill=PALETTE.cobalt if idx < 2 else None, line=PALETTE.cobalt)
        if idx < 2:
            textbox(slide, "✓", mx + 0.19, iy - 0.01, 0.16, 0.16, font="Arial", size=7, color=PALETTE.paper, align=PP_ALIGN.CENTER)
        textbox(slide, item, mx + 0.48, iy - 0.01, 2.28, 0.21, font=FONTS.body, size=7.6, color=PALETTE.ink)
    rect(slide, mx + 0.19, my + 3.13, 2.78, 0.28, fill=PALETTE.ink)
    textbox(slide, "CONTINUAR INTERVENCIÓN", mx + 0.29, my + 3.21, 2.58, 0.12, font=FONTS.mono, size=6.3, color=PALETTE.paper, align=PP_ALIGN.CENTER, uppercase=True)

    textbox(slide, data["caption"], GRID.left, 6.46, 9.1, 0.18, font=FONTS.mono, size=7.0, color=PALETTE.ink_faint, tracking=0.06, uppercase=True)
    return slide
