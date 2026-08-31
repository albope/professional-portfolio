from __future__ import annotations

from pptx.enum.text import PP_ALIGN

from components.diagrams import architecture_node, indexed_row, mini_layout
from components.primitives import eyebrow, line, rect, textbox, title_block
from layouts.base import blank_slide, chrome
from theme.tokens import FONTS, GRID, PALETTE


def scope_index(presentation, data: dict, number: int, total: int):
    slide = blank_slide(presentation)
    eyebrow(slide, data["eyebrow"])
    chrome(slide, number, total, label=data["footer_label"])
    title_block(slide, data["title"], y=1.03, w=9.5, h=1.0, size=29, square_x=9.43, square_y=1.63)
    textbox(slide, data["lead"], GRID.left, 2.12, 8.2, 0.44, font=FONTS.body, size=12, color=PALETTE.ink_mute)
    items = data["items"]
    col_w = 5.74
    for i, item in enumerate(items):
        col = i % 2
        row = i // 2
        x = GRID.left + col * (col_w + 0.42)
        y = 2.88 + row * 0.87
        indexed_row(slide, item["index"], item["title"], item["body"], x, y, col_w, height=0.75)
    return slide


def detail(presentation, data: dict, number: int, total: int):
    slide = blank_slide(presentation, dark=True)
    eyebrow(slide, data["eyebrow"], dark=True)
    chrome(slide, number, total, dark=True, label=data["footer_label"])
    title_block(slide, data["title"], dark=True, y=1.03, w=8.6, h=1.0, size=28.5, square_x=8.50, square_y=1.64)
    textbox(slide, data["lead"], GRID.left, 2.12, 7.2, 0.56, font=FONTS.body, size=12.1, color="B5B4AE")
    for i, row in enumerate(data["rows"]):
        y = 3.03 + i * 0.63
        active = row.get("active", False)
        if active:
            rect(slide, GRID.left, y, 7.02, 0.48, fill=PALETTE.cobalt_bright)
        else:
            rect(slide, GRID.left, y, 7.02, 0.48, line=PALETTE.line_dark)
        color = PALETTE.ink if active else PALETTE.paper
        textbox(slide, row["index"], GRID.left + 0.16, y + 0.14, 0.40, 0.16, font=FONTS.mono, size=7.6, color=color)
        textbox(slide, row["signal"], GRID.left + 0.69, y + 0.11, 2.22, 0.22, font=FONTS.body, size=9.5, color=color, bold=True)
        textbox(slide, row["choice"], GRID.left + 3.12, y + 0.11, 3.68, 0.23, font=FONTS.body, size=9.2, color=color)
    for i, item in enumerate(data["notes"]):
        x = 8.17
        y = 3.03 + i * 1.36
        textbox(slide, item["label"], x, y, 3.75, 0.20, font=FONTS.mono, size=7.8, color=PALETTE.cobalt_bright, tracking=0.13, uppercase=True)
        textbox(slide, item["body"], x, y + 0.34, 3.76, 0.73, font=FONTS.body, size=10.3, color=PALETTE.paper)
        if i < len(data["notes"]) - 1:
            line(slide, x, y + 1.16, 12.61, y + 1.16, color=PALETTE.line_dark)
    return slide


def gallery(presentation, data: dict, number: int, total: int):
    slide = blank_slide(presentation)
    eyebrow(slide, data["eyebrow"])
    chrome(slide, number, total, label=data["footer_label"])
    title_block(slide, data["title"], y=1.03, w=9.2, h=1.0, size=29, square_x=9.02, square_y=1.64)
    textbox(slide, data["lead"], GRID.left, 2.13, 8.8, 0.42, font=FONTS.body, size=12.1, color=PALETTE.ink_mute)
    cols, thumb_w, thumb_h, gap_x, gap_y = 4, 2.72, 1.10, 0.34, 0.30
    for i, item in enumerate(data["items"]):
        col, row = i % cols, i // cols
        x = GRID.left + col * (thumb_w + gap_x)
        y = 2.95 + row * (thumb_h + 0.62 + gap_y)
        mini_layout(slide, x, y, thumb_w, thumb_h, i % 4, dark=item.get("dark", False))
        textbox(slide, item["label"], x, y + thumb_h + 0.16, thumb_w, 0.22, font=FONTS.mono, size=7.5, color=PALETTE.cobalt, tracking=0.10, uppercase=True)
        textbox(slide, item["purpose"], x, y + thumb_h + 0.39, thumb_w, 0.25, font=FONTS.body, size=9.2, color=PALETTE.ink_mute)
    return slide


def roles(presentation, data: dict, number: int, total: int):
    slide = blank_slide(presentation)
    eyebrow(slide, data["eyebrow"])
    chrome(slide, number, total, label=data["footer_label"])
    title_block(slide, data["title"], y=1.03, w=9.4, h=1.0, size=29.5, square_x=9.15, square_y=1.63)
    textbox(slide, data["lead"], GRID.left, 2.13, 8.6, 0.46, font=FONTS.body, size=12.1, color=PALETTE.ink_mute)
    col_w = GRID.content_width / len(data["roles"])
    line(slide, GRID.left, 2.95, GRID.width - GRID.right, 2.95, color=PALETTE.line)
    for i, item in enumerate(data["roles"]):
        x = GRID.left + i * col_w
        if i:
            line(slide, x, 2.95, x, 5.98, color=PALETTE.line)
        textbox(slide, item["index"], x + 0.17, 3.22, col_w - 0.34, 0.20, font=FONTS.mono, size=8, color=PALETTE.cobalt)
        textbox(slide, item["title"], x + 0.17, 3.62, col_w - 0.34, 0.55, font=FONTS.display, size=15.2, color=PALETTE.ink, uppercase=True)
        textbox(slide, item["body"], x + 0.17, 4.36, col_w - 0.34, 1.28, font=FONTS.body, size=10, color=PALETTE.ink_mute)
    rect(slide, GRID.left, 6.18, GRID.content_width, 0.48, fill=PALETTE.paper_2)
    textbox(slide, data["traceability"], GRID.left + 0.18, 6.32, GRID.content_width - 0.36, 0.20, font=FONTS.mono, size=7.5, color=PALETTE.ink_mute, tracking=0.08, uppercase=True)
    return slide


def architecture(presentation, data: dict, number: int, total: int):
    slide = blank_slide(presentation, dark=True)
    eyebrow(slide, data["eyebrow"], dark=True)
    chrome(slide, number, total, dark=True, label=data["footer_label"])
    title_block(slide, data["title"], dark=True, y=1.02, w=9.2, h=1.0, size=29.5, square_x=9.03, square_y=1.63)
    textbox(slide, data["lead"], GRID.left, 2.12, 8.8, 0.52, font=FONTS.body, size=12.2, color="B4B3AC")
    node_y, node_h = 3.18, 0.72
    positions = [0.72, 3.18, 5.64, 8.10, 10.56]
    for i, node in enumerate(data["nodes"]):
        architecture_node(slide, node, positions[i], node_y, 2.05, node_h, dark=True, active=i == 2)
        if i < len(data["nodes"]) - 1:
            line(slide, positions[i] + 2.05, node_y + node_h / 2, positions[i + 1], node_y + node_h / 2, color=PALETTE.cobalt_bright)
    for i, item in enumerate(data["details"]):
        x = GRID.left + i * 3.05
        textbox(slide, item["label"], x, 4.72, 2.70, 0.20, font=FONTS.mono, size=7.6, color=PALETTE.cobalt_bright, tracking=0.12, uppercase=True)
        textbox(slide, item["body"], x, 5.08, 2.70, 0.78, font=FONTS.body, size=9.7, color=PALETTE.paper)
    textbox(slide, data["note"], GRID.left, 6.38, 10.8, 0.25, font=FONTS.mono, size=7.5, color="85858C", tracking=0.06)
    return slide


def horizons(presentation, data: dict, number: int, total: int):
    slide = blank_slide(presentation)
    eyebrow(slide, data["eyebrow"])
    chrome(slide, number, total, label=data["footer_label"])
    title_block(slide, data["title"], y=1.03, w=10.0, h=1.0, size=29.5, square_x=9.91, square_y=1.63)
    textbox(slide, data["lead"], GRID.left, 2.13, 8.9, 0.46, font=FONTS.body, size=12.1, color=PALETTE.ink_mute)
    split_x = 6.82
    rect(slide, GRID.left, 2.96, 5.65, 3.28, fill=PALETTE.ink)
    rect(slide, split_x, 2.96, 5.79, 3.28, line=PALETTE.line)
    textbox(slide, data["current"]["label"], GRID.left + 0.24, 3.21, 2.4, 0.22, font=FONTS.mono, size=8, color=PALETTE.cobalt_bright, tracking=0.13, uppercase=True)
    textbox(slide, data["current"]["title"], GRID.left + 0.24, 3.65, 4.95, 0.69, font=FONTS.display, size=19, color=PALETTE.paper, uppercase=True)
    for i, item in enumerate(data["current"]["items"]):
        textbox(slide, f"{i + 1:02d}", GRID.left + 0.24, 4.67 + i * 0.45, 0.40, 0.18, font=FONTS.mono, size=7.5, color=PALETTE.cobalt_bright)
        textbox(slide, item, GRID.left + 0.78, 4.63 + i * 0.45, 4.40, 0.26, font=FONTS.body, size=9.6, color=PALETTE.paper)
    textbox(slide, data["future"]["label"], split_x + 0.24, 3.21, 2.8, 0.22, font=FONTS.mono, size=8, color=PALETTE.cobalt, tracking=0.13, uppercase=True)
    textbox(slide, data["future"]["title"], split_x + 0.24, 3.65, 4.95, 0.69, font=FONTS.display, size=19, color=PALETTE.ink, uppercase=True)
    for i, item in enumerate(data["future"]["items"]):
        textbox(slide, f"{i + 1:02d}", split_x + 0.24, 4.67 + i * 0.45, 0.40, 0.18, font=FONTS.mono, size=7.5, color=PALETTE.cobalt)
        textbox(slide, item, split_x + 0.78, 4.63 + i * 0.45, 4.50, 0.26, font=FONTS.body, size=9.6, color=PALETTE.ink_mute)
    return slide
