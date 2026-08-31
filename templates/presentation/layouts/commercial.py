from __future__ import annotations

from pptx.enum.text import PP_ALIGN

from components.primitives import eyebrow, line, rect, textbox, title_block, wordmark
from layouts.base import blank_slide, chrome
from theme.tokens import FONTS, GRID, PALETTE


def implementation(presentation, data: dict, number: int, total: int):
    slide = blank_slide(presentation)
    eyebrow(slide, data["eyebrow"])
    chrome(slide, number, total, label=data["footer_label"])
    title_block(slide, data["title"], y=1.03, w=9.3, h=1.0, size=29.5, square_x=9.20, square_y=1.63)
    textbox(slide, data["lead"], GRID.left, 2.13, 9.0, 0.46, font=FONTS.body, size=12.2, color=PALETTE.ink_mute)
    cols, col_w = 4, 2.78
    gap = 0.26
    for i, step in enumerate(data["steps"]):
        col, row = i % cols, i // cols
        x = GRID.left + col * (col_w + gap)
        y = 3.05 + row * 1.32
        line(slide, x, y, x + col_w, y, color=PALETTE.cobalt if i < 4 else PALETTE.line)
        textbox(slide, step["index"], x, y + 0.17, 0.80, 0.25, font=FONTS.mono, size=7.8, color=PALETTE.cobalt)
        textbox(slide, step["title"], x, y + 0.48, col_w - 0.12, 0.35, font=FONTS.body, size=10.2, color=PALETTE.ink, bold=True)
        textbox(slide, step["body"], x, y + 0.84, col_w - 0.16, 0.39, font=FONTS.body, size=8.9, color=PALETTE.ink_mute)
    rect(slide, GRID.left, 5.93, GRID.content_width, 0.58, fill=PALETTE.paper_2)
    textbox(slide, data["note"], GRID.left + 0.20, 6.10, GRID.content_width - 0.40, 0.22, font=FONTS.mono, size=7.7, color=PALETTE.ink_mute, tracking=0.06)
    return slide


def investment(presentation, data: dict, number: int, total: int):
    slide = blank_slide(presentation)
    eyebrow(slide, data["eyebrow"])
    chrome(slide, number, total, label=data["footer_label"])
    title_block(slide, data["title"], y=1.03, w=10.5, h=1.0, size=29, square_x=10.36, square_y=1.63)
    textbox(slide, data["lead"], GRID.left, 2.13, 9.4, 0.42, font=FONTS.body, size=11.8, color=PALETTE.ink_mute)
    cards = data["blocks"]
    x_positions = [0.72, 4.47, 8.22]
    widths = [3.49, 3.49, 4.39]
    for i, block in enumerate(cards):
        x, w = x_positions[i], widths[i]
        fill = PALETTE.ink if block.get("dark") else None
        border = PALETTE.ink if block.get("dark") else PALETTE.line
        rect(slide, x, 2.92, w, 3.38, fill=fill, line=border)
        label_color = PALETTE.cobalt_bright if block.get("dark") else PALETTE.cobalt
        text_color = PALETTE.paper if block.get("dark") else PALETTE.ink
        body_color = "B4B3AC" if block.get("dark") else PALETTE.ink_mute
        textbox(slide, block["label"], x + 0.20, 3.18, w - 0.40, 0.20, font=FONTS.mono, size=7.7, color=label_color, tracking=0.11, uppercase=True)
        textbox(slide, block["value"], x + 0.20, 3.62, w - 0.40, 0.68, font=FONTS.display, size=19 if i < 2 else 18, color=text_color, uppercase=True)
        line(slide, x + 0.20, 4.52, x + w - 0.20, 4.52, color=PALETTE.line_dark if block.get("dark") else PALETTE.line)
        for j, item in enumerate(block["items"]):
            textbox(slide, f"{j + 1:02d}", x + 0.20, 4.79 + j * 0.38, 0.38, 0.18, font=FONTS.mono, size=7.3, color=label_color)
            textbox(slide, item, x + 0.67, 4.75 + j * 0.38, w - 0.90, 0.25, font=FONTS.body, size=8.8, color=body_color)
    textbox(slide, data["note"], GRID.left, 6.46, GRID.content_width, 0.20, font=FONTS.mono, size=7.2, color=PALETTE.ink_faint, tracking=0.05)
    return slide


def exclusions(presentation, data: dict, number: int, total: int):
    slide = blank_slide(presentation, dark=True)
    eyebrow(slide, data["eyebrow"], dark=True)
    chrome(slide, number, total, dark=True, label=data["footer_label"])
    title_block(slide, data["title"], dark=True, y=1.02, w=7.9, h=1.0, size=32, square_x=6.36, square_y=1.65)
    textbox(slide, data["lead"], GRID.left, 2.18, 7.7, 0.50, font=FONTS.body, size=12.2, color="B4B3AC")
    items = data["items"]
    col_w = 5.64
    for i, item in enumerate(items):
        col, row = i % 2, i // 2
        x = GRID.left + col * (col_w + 0.62)
        y = 3.05 + row * 0.78
        line(slide, x, y, x + col_w, y, color=PALETTE.line_dark)
        textbox(slide, item["index"], x, y + 0.18, 0.44, 0.20, font=FONTS.mono, size=7.8, color=PALETTE.cobalt_bright)
        textbox(slide, item["title"], x + 0.58, y + 0.14, 2.35, 0.25, font=FONTS.body, size=10.3, color=PALETTE.paper, bold=True)
        textbox(slide, item["body"], x + 3.02, y + 0.14, col_w - 3.02, 0.42, font=FONTS.body, size=8.9, color="A7A6A0")
    rect(slide, GRID.left, 6.35, GRID.content_width, 0.42, line=PALETTE.cobalt_bright)
    textbox(slide, data["note"], GRID.left + 0.18, 6.47, GRID.content_width - 0.36, 0.18, font=FONTS.mono, size=7.4, color=PALETTE.cobalt_bright, tracking=0.07, uppercase=True)
    return slide


def closing(presentation, data: dict, number: int, total: int):
    slide = blank_slide(presentation, dark=True)
    eyebrow(slide, data["eyebrow"], dark=True)
    wordmark(slide, dark=True, x=10.80, y=0.52, scale=1.15)
    title_block(slide, data["title"], dark=True, y=1.23, w=9.4, h=1.45, size=34, square_x=8.74, square_y=2.15)
    rect(slide, GRID.left, 3.17, 5.50, 2.02, fill=PALETTE.cobalt_bright)
    textbox(slide, data["action_label"], GRID.left + 0.25, 3.46, 4.9, 0.20, font=FONTS.mono, size=8, color=PALETTE.ink, tracking=0.14, uppercase=True)
    textbox(slide, data["action_title"], GRID.left + 0.25, 3.89, 4.84, 0.61, font=FONTS.display, size=18, color=PALETTE.ink, uppercase=True)
    textbox(slide, data["action_body"], GRID.left + 0.25, 4.61, 4.82, 0.38, font=FONTS.body, size=10, color=PALETTE.ink_2)
    textbox(slide, data["checklist_label"], 6.79, 3.18, 4.2, 0.20, font=FONTS.mono, size=8, color=PALETTE.cobalt_bright, tracking=0.14, uppercase=True)
    for i, item in enumerate(data["checklist"]):
        y = 3.65 + i * 0.48
        textbox(slide, f"{i + 1:02d}", 6.79, y, 0.40, 0.20, font=FONTS.mono, size=7.8, color=PALETTE.cobalt_bright)
        textbox(slide, item, 7.34, y - 0.03, 4.95, 0.30, font=FONTS.body, size=10.2, color=PALETTE.paper)
    line(slide, GRID.left, 6.42, GRID.width - GRID.right, 6.42, color=PALETTE.line_dark)
    textbox(slide, data["brand"], GRID.left, 6.67, 3.5, 0.25, font=FONTS.display, size=11.5, color=PALETTE.paper, uppercase=True)
    textbox(slide, data["descriptor"], GRID.left, 6.98, 5.0, 0.18, font=FONTS.mono, size=7.2, color="85858C", tracking=0.08, uppercase=True)
    textbox(slide, data["version"], 9.35, 6.98, 3.26, 0.18, font=FONTS.mono, size=7.2, color="85858C", align=PP_ALIGN.RIGHT, tracking=0.05, uppercase=True)
    return slide
