from __future__ import annotations

from pptx.enum.text import PP_ALIGN

from components.corporate import table as corporate_table
from components.primitives import eyebrow, footer, line, rect, textbox, title_block, wordmark
from layouts.base import blank_slide, chrome
from theme.tokens import FONTS, GRID, PALETTE


def table_slide(presentation, data: dict, number: int, total: int):
    slide = blank_slide(presentation)
    eyebrow(slide, data["eyebrow"])
    chrome(slide, number, total, label=data["footer_label"])
    title_block(slide, data["title"], y=1.03, w=10.8, h=1.05, size=29.5)
    textbox(slide, data["lead"], GRID.left, 2.12, 8.8, 0.46, font=FONTS.body, size=12.1, color=PALETTE.ink_mute)
    widths = data.get("widths") or [GRID.content_width / len(data["headers"])] * len(data["headers"])
    row_height = data.get("row_height", 0.56)
    corporate_table(slide, data["headers"], data["rows"], GRID.left, 2.90, widths, row_height=row_height, highlighted_rows=set(data.get("highlighted_rows", [])))
    if data.get("note"):
        table_end = 2.90 + 0.48 + len(data["rows"]) * row_height
        note_y = min(6.70, table_end + 0.10)
        textbox(slide, data["note"], GRID.left, note_y, GRID.content_width, 0.16, font=FONTS.mono, size=6.6, color=PALETTE.ink_faint, tracking=0.04, uppercase=True)
    return slide


def budget(presentation, data: dict, number: int, total: int):
    slide = blank_slide(presentation, dark=True)
    eyebrow(slide, data["eyebrow"], dark=True)
    chrome(slide, number, total, dark=True, label=data["footer_label"])
    title_block(slide, data["title"], dark=True, y=1.03, w=9.8, h=1.05, size=29.5)
    textbox(slide, data["lead"], GRID.left, 2.12, 8.8, 0.46, font=FONTS.body, size=12.1, color="B8B7B0")
    rows = [[item["phase"], item["scope"], item["amount"], item["payment"]] for item in data["items"]]
    corporate_table(
        slide,
        ["FASE", "ALCANCE", "IMPORTE", "PAGO"],
        rows,
        GRID.left,
        2.87,
        [1.55, 6.02, 1.70, 2.62],
        dark=True,
        row_height=0.54,
        alignments=[PP_ALIGN.LEFT, PP_ALIGN.LEFT, PP_ALIGN.RIGHT, PP_ALIGN.LEFT],
    )
    rect(slide, 8.65, 5.66, 3.96, 0.73, fill=PALETTE.cobalt_bright)
    textbox(slide, data.get("total_label", "INVERSIÓN TOTAL"), 8.84, 5.86, 1.72, 0.18, font=FONTS.mono, size=6.9, color=PALETTE.ink, tracking=0.07, uppercase=True)
    textbox(slide, data["total"], 10.52, 5.78, 1.88, 0.32, font=FONTS.display, size=14.5, color=PALETTE.ink, align=PP_ALIGN.RIGHT, uppercase=True)
    textbox(slide, data.get("tax_note", "Impuestos no incluidos salvo indicación."), GRID.left, 6.44, 7.4, 0.18, font=FONTS.mono, size=6.8, color="85858C", tracking=0.04)
    return slide


def conditions(presentation, data: dict, number: int, total: int):
    slide = blank_slide(presentation)
    eyebrow(slide, data["eyebrow"])
    chrome(slide, number, total, label=data["footer_label"])
    title_block(slide, data["title"], y=1.03, w=9.8, h=1.05, size=29.5)
    textbox(slide, data["lead"], GRID.left, 2.12, 8.8, 0.46, font=FONTS.body, size=12.1, color=PALETTE.ink_mute)
    items = data["items"]
    for i, item in enumerate(items[:6]):
        col, row = i % 2, i // 2
        x = GRID.left + col * 6.06
        y = 2.92 + row * 1.08
        line(slide, x, y, x + 5.74, y, color=PALETTE.line)
        textbox(slide, item.get("index", f"{i + 1:02d}"), x, y + 0.18, 0.46, 0.18, font=FONTS.mono, size=7.3, color=PALETTE.cobalt)
        textbox(slide, item["label"], x + 0.62, y + 0.15, 1.48, 0.24, font=FONTS.body, size=9.6, color=PALETTE.ink, bold=True)
        textbox(slide, item["value"], x + 2.16, y + 0.15, 3.45, 0.52, font=FONTS.body, size=9.1, color=PALETTE.ink_mute)
    return slide


def team(presentation, data: dict, number: int, total: int):
    slide = blank_slide(presentation)
    eyebrow(slide, data["eyebrow"])
    chrome(slide, number, total, label=data["footer_label"])
    title_block(slide, data["title"], y=1.03, w=9.8, h=1.05, size=29.5)
    textbox(slide, data["lead"], GRID.left, 2.12, 8.8, 0.46, font=FONTS.body, size=12.1, color=PALETTE.ink_mute)
    people = data["people"]
    gap = 0.28
    w = (GRID.content_width - gap * (len(people) - 1)) / len(people)
    for i, person in enumerate(people):
        x = GRID.left + i * (w + gap)
        rect(slide, x, 2.94, w, 3.35, fill=PALETTE.ink if i == 0 else None, line=PALETTE.ink if i == 0 else PALETTE.line)
        accent = PALETTE.cobalt_bright if i == 0 else PALETTE.cobalt
        ink = PALETTE.paper if i == 0 else PALETTE.ink
        muted = "B8B7B0" if i == 0 else PALETTE.ink_mute
        rect(slide, x + 0.18, 3.18, 0.78, 0.78, fill=accent)
        textbox(slide, person.get("initials", person["role"][:2]), x + 0.18, 3.42, 0.78, 0.26, font=FONTS.display, size=11, color=PALETTE.ink if i == 0 else PALETTE.paper, align=PP_ALIGN.CENTER, uppercase=True)
        textbox(slide, person["role"], x + 0.18, 4.28, w - 0.36, 0.60, font=FONTS.display, size=14.2, color=ink, uppercase=True)
        textbox(slide, person["focus"], x + 0.18, 5.08, w - 0.36, 0.76, font=FONTS.body, size=9.1, color=muted)
        textbox(slide, person.get("dedication", "SEGÚN FASE"), x + 0.18, 6.00, w - 0.36, 0.18, font=FONTS.mono, size=6.6, color=accent, tracking=0.08, uppercase=True)
    return slide


def stack(presentation, data: dict, number: int, total: int):
    slide = blank_slide(presentation, dark=True)
    eyebrow(slide, data["eyebrow"], dark=True)
    chrome(slide, number, total, dark=True, label=data["footer_label"])
    title_block(slide, data["title"], dark=True, y=1.03, w=9.8, h=1.05, size=29.5)
    textbox(slide, data["lead"], GRID.left, 2.12, 8.8, 0.46, font=FONTS.body, size=12.1, color="B8B7B0")
    for i, group in enumerate(data["groups"][:5]):
        y = 2.93 + i * 0.67
        line(slide, GRID.left, y, GRID.width - GRID.right, y, color=PALETTE.line_dark)
        textbox(slide, group["label"], GRID.left, y + 0.22, 2.16, 0.18, font=FONTS.mono, size=7.2, color=PALETTE.cobalt_bright, tracking=0.09, uppercase=True)
        cursor = 3.18
        for technology in group["items"]:
            box_w = max(1.04, min(2.18, 0.10 * len(technology) + 0.56))
            rect(slide, cursor, y + 0.13, box_w, 0.36, line=PALETTE.line_dark)
            textbox(slide, technology, cursor + 0.08, y + 0.24, box_w - 0.16, 0.16, font=FONTS.mono, size=6.7, color=PALETTE.paper, align=PP_ALIGN.CENTER)
            cursor += box_w + 0.14
    line(slide, GRID.left, 6.28, GRID.width - GRID.right, 6.28, color=PALETTE.line_dark)
    textbox(slide, data.get("note", "La tecnología se decide por adecuación al problema, no por moda."), GRID.left, 6.46, 9.6, 0.20, font=FONTS.mono, size=7.1, color="85858C", tracking=0.04)
    return slide


def next_steps(presentation, data: dict, number: int, total: int):
    slide = blank_slide(presentation)
    eyebrow(slide, data["eyebrow"])
    chrome(slide, number, total, label=data["footer_label"])
    title_block(slide, data["title"], y=1.03, w=9.8, h=1.05, size=29.5)
    textbox(slide, data["lead"], GRID.left, 2.12, 8.8, 0.46, font=FONTS.body, size=12.1, color=PALETTE.ink_mute)
    steps = data["steps"]
    gap = 0.32
    w = (GRID.content_width - gap * (len(steps) - 1)) / len(steps)
    for i, item in enumerate(steps):
        x = GRID.left + i * (w + gap)
        active = i == 0
        rect(slide, x, 2.94, w, 3.17, fill=PALETTE.ink if active else None, line=PALETTE.ink if active else PALETTE.line)
        accent = PALETTE.cobalt_bright if active else PALETTE.cobalt
        ink = PALETTE.paper if active else PALETTE.ink
        muted = "B8B7B0" if active else PALETTE.ink_mute
        textbox(slide, item.get("index", f"{i + 1:02d}"), x + 0.20, 3.20, w - 0.40, 0.18, font=FONTS.mono, size=7.4, color=accent)
        textbox(slide, item["action"], x + 0.20, 3.62, w - 0.40, 0.80, font=FONTS.display, size=16.8, color=ink, uppercase=True)
        textbox(slide, item["body"], x + 0.20, 4.66, w - 0.40, 0.70, font=FONTS.body, size=9.4, color=muted)
        line(slide, x + 0.20, 5.54, x + w - 0.20, 5.54, color=PALETTE.line_dark if active else PALETTE.line)
        textbox(slide, item.get("timing", "A CONCRETAR"), x + 0.20, 5.76, w - 0.40, 0.18, font=FONTS.mono, size=6.8, color=accent, tracking=0.07, uppercase=True)
    return slide


def corporate_closing(presentation, data: dict, number: int, total: int):
    slide = blank_slide(presentation, dark=True)
    wordmark(slide, dark=True, x=10.82, y=0.52, scale=1.2)
    eyebrow(slide, data["eyebrow"], dark=True)
    title_block(slide, data["title"], dark=True, y=1.66, w=10.7, h=1.80, size=38)
    textbox(slide, data["lead"], GRID.left, 3.92, 7.55, 0.82, font=FONTS.body, size=15.2, color="B8B7B0")
    rect(slide, GRID.left, 5.18, 4.36, 0.58, fill=PALETTE.cobalt_bright)
    textbox(slide, data.get("cta", "HABLEMOS DEL SIGUIENTE PASO"), GRID.left + 0.18, 5.36, 4.00, 0.20, font=FONTS.mono, size=7.4, color=PALETTE.ink, tracking=0.09, uppercase=True, align=PP_ALIGN.CENTER)
    textbox(slide, data.get("contact", "VALENCIA · ESPAÑA"), GRID.left, 6.26, 5.4, 0.20, font=FONTS.mono, size=7.5, color="85858C", tracking=0.10, uppercase=True)
    footer(slide, number, total, dark=True, label=data["footer_label"])
    return slide
