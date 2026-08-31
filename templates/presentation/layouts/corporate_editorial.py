from __future__ import annotations

from pptx.enum.text import PP_ALIGN

from components.corporate import indexed_column, metric
from components.primitives import eyebrow, line, rect, textbox, title_block
from layouts.base import blank_slide, chrome
from theme.tokens import FONTS, GRID, PALETTE, dark_accent


def section(presentation, data: dict, number: int, total: int):
    slide = blank_slide(presentation, dark=True)
    eyebrow(slide, data["eyebrow"], dark=True)
    chrome(slide, number, total, dark=True, label=data["footer_label"])
    textbox(
        slide,
        data.get("index", f"{number:02d}"),
        GRID.left,
        1.35,
        1.8,
        0.42,
        font=FONTS.mono,
        size=13,
        color=PALETTE.cobalt_bright,
        tracking=0.16,
    )
    title_block(slide, data["title"], dark=True, y=2.00, w=10.8, h=1.75, size=38)
    textbox(
        slide,
        data.get("subtitle", ""),
        GRID.left,
        4.25,
        7.55,
        0.85,
        font=FONTS.body,
        size=15,
        color="B8B7B0",
    )
    line(slide, GRID.left, 5.60, 8.05, 5.60, color=PALETTE.line_dark)
    textbox(
        slide,
        data.get("signal", "UNA IDEA · UN MENSAJE · UNA DECISIÓN"),
        GRID.left,
        5.85,
        7.3,
        0.22,
        font=FONTS.mono,
        size=7.5,
        color="85858C",
        tracking=0.10,
        uppercase=True,
    )
    return slide


def editorial(presentation, data: dict, number: int, total: int):
    dark = data.get("dark", False)
    slide = blank_slide(presentation, dark=dark)
    eyebrow(slide, data["eyebrow"], dark=dark)
    chrome(slide, number, total, dark=dark, label=data["footer_label"])
    ink = PALETTE.paper if dark else PALETTE.ink
    muted = "B8B7B0" if dark else PALETTE.ink_mute
    title_block(slide, data["title"], dark=dark, y=1.35, w=10.5, h=2.15, size=data.get("title_size", 35))
    textbox(slide, data["body"], GRID.left, 3.88, 7.20, 1.20, font=FONTS.body, size=15, color=muted)
    line(slide, 8.55, 3.74, 12.61, 3.74, color=PALETTE.line_dark if dark else PALETTE.line)
    if "metric" in data:
        item = data["metric"]
        metric(slide, item["label"], item["value"], item["note"], 8.55, 4.10, 4.06, dark=dark)
    else:
        textbox(slide, data.get("aside_label", "PRINCIPIO"), 8.55, 4.10, 3.8, 0.2, font=FONTS.mono, size=7.6, color=dark_accent(dark), tracking=0.13, uppercase=True)
        textbox(slide, data.get("aside", "Diseño útil, tecnología sólida y decisiones fáciles de explicar."), 8.55, 4.55, 3.68, 1.25, font=FONTS.body, size=13, color=ink, bold=True)
    return slide


def standard(presentation, data: dict, number: int, total: int):
    slide = blank_slide(presentation)
    eyebrow(slide, data["eyebrow"])
    chrome(slide, number, total, label=data["footer_label"])
    title_block(slide, data["title"], y=1.03, w=10.8, h=1.05, size=29.5)
    textbox(slide, data["lead"], GRID.left, 2.17, 7.0, 0.62, font=FONTS.body, size=12.7, color=PALETTE.ink_mute)
    items = data.get("items", [])
    for i, item in enumerate(items[:4]):
        y = 3.06 + i * 0.78
        line(slide, GRID.left, y, 7.22, y, color=PALETTE.line)
        textbox(slide, item.get("index", f"{i + 1:02d}"), GRID.left, y + 0.18, 0.50, 0.2, font=FONTS.mono, size=7.8, color=PALETTE.cobalt)
        textbox(slide, item["title"], 1.35, y + 0.14, 2.15, 0.26, font=FONTS.body, size=10.4, color=PALETTE.ink, bold=True)
        textbox(slide, item["body"], 3.65, y + 0.14, 3.52, 0.45, font=FONTS.body, size=9.2, color=PALETTE.ink_mute)
    rect(slide, 7.72, 2.17, 4.89, 4.26, fill=PALETTE.ink)
    textbox(slide, data.get("visual_label", "SISTEMA"), 7.98, 2.46, 3.0, 0.2, font=FONTS.mono, size=7.6, color=PALETTE.cobalt_bright, tracking=0.13, uppercase=True)
    textbox(slide, data.get("visual_title", "UN BLOQUE VISUAL\nEDITABLE"), 7.98, 3.03, 4.05, 1.25, font=FONTS.display, size=22, color=PALETTE.paper, uppercase=True)
    line(slide, 7.98, 4.65, 12.11, 4.65, color=PALETTE.line_dark)
    for i, label in enumerate(data.get("visual_items", ["Contexto", "Decisión", "Resultado"])):
        textbox(slide, f"0{i + 1}", 7.98, 5.02 + i * 0.38, 0.35, 0.18, font=FONTS.mono, size=7.2, color=PALETTE.cobalt_bright)
        textbox(slide, label, 8.55, 4.98 + i * 0.38, 3.4, 0.25, font=FONTS.body, size=9.2, color=PALETTE.paper)
    return slide


def split(presentation, data: dict, number: int, total: int):
    slide = blank_slide(presentation)
    eyebrow(slide, data["eyebrow"])
    chrome(slide, number, total, label=data["footer_label"])
    title_block(slide, data["title"], y=1.03, w=10.8, h=1.05, size=29.5)
    textbox(slide, data["lead"], GRID.left, 2.13, 8.8, 0.48, font=FONTS.body, size=12.1, color=PALETTE.ink_mute)
    left = data["left"]
    right = data["right"]
    boxes = ((GRID.left, left, True), (6.82, right, False))
    for x, item, dark in boxes:
        w = 5.79 if x > 1 else 5.65
        rect(slide, x, 2.94, w, 3.35, fill=PALETTE.ink if dark else None, line=PALETTE.ink if dark else PALETTE.line)
        accent = PALETTE.cobalt_bright if dark else PALETTE.cobalt
        ink = PALETTE.paper if dark else PALETTE.ink
        muted = "B8B7B0" if dark else PALETTE.ink_mute
        textbox(slide, item["label"], x + 0.24, 3.20, w - 0.48, 0.2, font=FONTS.mono, size=7.8, color=accent, tracking=0.12, uppercase=True)
        textbox(slide, item["title"], x + 0.24, 3.62, w - 0.48, 0.70, font=FONTS.display, size=18.5, color=ink, uppercase=True)
        for i, value in enumerate(item["items"][:4]):
            textbox(slide, f"{i + 1:02d}", x + 0.24, 4.64 + i * 0.43, 0.36, 0.18, font=FONTS.mono, size=7.2, color=accent)
            textbox(slide, value, x + 0.78, 4.60 + i * 0.43, w - 1.06, 0.29, font=FONTS.body, size=9.4, color=muted)
    return slide


def pillars(presentation, data: dict, number: int, total: int):
    dark = data.get("dark", False)
    slide = blank_slide(presentation, dark=dark)
    eyebrow(slide, data["eyebrow"], dark=dark)
    chrome(slide, number, total, dark=dark, label=data["footer_label"])
    title_block(slide, data["title"], dark=dark, y=1.03, w=9.8, h=1.05, size=29.5)
    textbox(slide, data["lead"], GRID.left, 2.13, 8.8, 0.52, font=FONTS.body, size=12.1, color="B8B7B0" if dark else PALETTE.ink_mute)
    items = data["items"]
    count = len(items)
    gap = 0.30
    width = (GRID.content_width - gap * (count - 1)) / count
    line(slide, GRID.left, 2.96, GRID.width - GRID.right, 2.96, color=PALETTE.line_dark if dark else PALETTE.line)
    for i, item in enumerate(items):
        x = GRID.left + i * (width + gap)
        if i:
            line(slide, x - gap / 2, 2.96, x - gap / 2, 6.25, color=PALETTE.line_dark if dark else PALETTE.line)
        indexed_column(slide, item.get("index", f"{i + 1:02d}"), item["title"], item["body"], x, 3.25, width - 0.12, dark=dark)
        if item.get("signal"):
            rect(slide, x, 5.82, width - 0.12, 0.34, fill=dark_accent(dark))
            textbox(slide, item["signal"], x + 0.08, 5.91, width - 0.28, 0.16, font=FONTS.mono, size=6.8, color=PALETTE.ink if dark else PALETTE.paper, align=PP_ALIGN.CENTER, uppercase=True)
    return slide
