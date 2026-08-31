from __future__ import annotations

from pathlib import Path

from pptx.enum.text import MSO_ANCHOR, PP_ALIGN

from components.diagrams import indexed_row, process_step
from components.primitives import (
    add_picture_cover,
    eyebrow,
    label_value,
    line,
    rect,
    registration_marks,
    textbox,
    title_block,
    wordmark,
)
from layouts.base import blank_slide, chrome
from theme.tokens import FONTS, GRID, PALETTE


def cover(presentation, data: dict, number: int, total: int):
    slide = blank_slide(presentation, dark=True)
    wordmark(slide, dark=True, x=10.82, y=0.52, scale=1.2)
    eyebrow(slide, data["eyebrow"], dark=True, y=0.58, w=6.4)
    textbox(slide, data["client"], GRID.left, 1.42, 7.7, 0.32, font=FONTS.mono, size=10.5, color=PALETTE.cobalt_bright, tracking=0.18, uppercase=True)
    title_block(slide, data["title"], dark=True, y=1.88, w=10.7, h=2.1, size=35.5, square_x=9.93, square_y=3.48)
    textbox(slide, data["subtitle"], GRID.left, 4.24, 7.8, 0.85, font=FONTS.body, size=15.5, color="C9C8C1")
    rect(slide, GRID.left, 5.34, 3.15, 0.46, line=PALETTE.cobalt_bright)
    textbox(slide, data["status"], GRID.left + 0.16, 5.47, 2.82, 0.2, font=FONTS.mono, size=7.8, color=PALETTE.cobalt_bright, tracking=0.12, uppercase=True)
    line(slide, GRID.left, 6.86, GRID.width - GRID.right, 6.86, color=PALETTE.line_dark)
    textbox(slide, data["confidentiality"], GRID.left, 7.02, 3.8, 0.18, font=FONTS.mono, size=7.2, color="85858C", tracking=0.10, uppercase=True)
    textbox(slide, data["date"], 10.4, 7.02, 2.2, 0.18, font=FONTS.mono, size=7.2, color="85858C", align=PP_ALIGN.RIGHT)
    return slide


def understanding(presentation, data: dict, number: int, total: int):
    slide = blank_slide(presentation)
    eyebrow(slide, data["eyebrow"])
    chrome(slide, number, total, label=data["footer_label"])
    title_block(slide, data["title"], y=1.18, w=10.4, h=1.52, size=33, square_x=10.05, square_y=2.10)
    textbox(slide, data["lead"], GRID.left, 2.92, 6.25, 0.82, font=FONTS.body, size=15, color=PALETTE.ink_soft)
    line(slide, GRID.left, 4.05, GRID.width - GRID.right, 4.05, color=PALETTE.line)
    col_w = (GRID.content_width - 0.44) / 3
    for i, item in enumerate(data["points"]):
        x = GRID.left + i * (col_w + 0.22)
        if i:
            line(slide, x - 0.11, 4.28, x - 0.11, 6.55, color=PALETTE.line)
        textbox(slide, item["index"], x, 4.40, col_w, 0.22, font=FONTS.mono, size=8.2, color=PALETTE.cobalt, tracking=0.14)
        textbox(slide, item["title"], x, 4.82, col_w - 0.12, 0.58, font=FONTS.display, size=17.5, color=PALETTE.ink, uppercase=True)
        textbox(slide, item["body"], x, 5.60, col_w - 0.18, 0.72, font=FONTS.body, size=10.6, color=PALETTE.ink_mute)
    return slide


def solution(presentation, data: dict, number: int, total: int):
    slide = blank_slide(presentation, dark=True)
    eyebrow(slide, data["eyebrow"], dark=True)
    chrome(slide, number, total, dark=True, label=data["footer_label"])
    title_block(slide, data["title"], dark=True, y=1.03, w=8.9, h=1.2, size=29.5, square_x=8.02, square_y=1.87)
    textbox(slide, data["lead"], GRID.left, 2.40, 7.0, 0.52, font=FONTS.body, size=13.4, color="B8B7B0")
    x_positions = [0.72, 3.75, 6.78, 9.81]
    for i, item in enumerate(data["pillars"]):
        x = x_positions[i]
        active = i == 0
        rect(slide, x, 3.35, 2.80, 2.68, fill=PALETTE.cobalt_bright if active else None, line=PALETTE.cobalt_bright if active else PALETTE.line_dark)
        label_color = PALETTE.ink if active else PALETTE.cobalt_bright
        text_color = PALETTE.ink if active else PALETTE.paper
        body_color = PALETTE.ink_2 if active else "A9A8A2"
        textbox(slide, item["index"], x + 0.18, 3.57, 0.60, 0.2, font=FONTS.mono, size=8, color=label_color)
        textbox(slide, item["title"], x + 0.18, 4.02, 2.34, 0.65, font=FONTS.display, size=15.6, color=text_color, uppercase=True)
        textbox(slide, item["body"], x + 0.18, 4.89, 2.34, 0.86, font=FONTS.body, size=9.8, color=body_color)
    return slide


def evidence(presentation, data: dict, number: int, total: int, asset_root: Path):
    slide = blank_slide(presentation)
    eyebrow(slide, data["eyebrow"])
    chrome(slide, number, total, label=data["footer_label"])
    title_block(slide, data["title"], y=1.02, w=8.7, h=1.0, size=28.5, square_x=8.16, square_y=1.62)
    textbox(slide, data["lead"], GRID.left, 2.17, 7.4, 0.5, font=FONTS.body, size=12.2, color=PALETTE.ink_mute)
    frame_x, frame_y, frame_w, frame_h = 0.72, 2.92, 7.72, 3.38
    rect(slide, frame_x, frame_y, frame_w, frame_h, fill=PALETTE.paper_2, line=PALETTE.line)
    add_picture_cover(slide, asset_root / data["image"], frame_x + 0.14, frame_y + 0.14, frame_w - 0.28, frame_h - 0.28)
    registration_marks(slide, frame_x, frame_y, frame_w, frame_h)
    for idx, item in enumerate(data["proofs"]):
        y = 3.03 + idx * 1.08
        textbox(slide, item["index"], 8.83, y, 0.50, 0.22, font=FONTS.mono, size=8.2, color=PALETTE.cobalt)
        textbox(slide, item["title"], 9.42, y - 0.02, 2.95, 0.28, font=FONTS.body, size=10.6, color=PALETTE.ink, bold=True)
        textbox(slide, item["body"], 9.42, y + 0.31, 2.90, 0.56, font=FONTS.body, size=9.3, color=PALETTE.ink_mute)
        if idx < len(data["proofs"]) - 1:
            line(slide, 8.83, y + 0.91, 12.61, y + 0.91, color=PALETTE.line)
    textbox(slide, data["caption"], frame_x, 6.40, 7.72, 0.20, font=FONTS.mono, size=7.2, color=PALETTE.ink_faint, tracking=0.08)
    return slide


def process(presentation, data: dict, number: int, total: int):
    slide = blank_slide(presentation)
    eyebrow(slide, data["eyebrow"])
    chrome(slide, number, total, label=data["footer_label"])
    title_block(slide, data["title"], y=1.03, w=9.2, h=1.0, size=29.5, square_x=9.10, square_y=1.63)
    textbox(slide, data["lead"], GRID.left, 2.15, 8.3, 0.5, font=FONTS.body, size=12.4, color=PALETTE.ink_mute)
    step_w = 1.82
    gap = 0.20
    for i, item in enumerate(data["steps"]):
        x = GRID.left + i * (step_w + gap)
        process_step(slide, item["index"], item["title"], item["body"], x, 3.16, step_w, active=i == len(data["steps"]) - 1)
        if i < len(data["steps"]) - 1:
            line(slide, x + step_w, 3.45, x + step_w + gap, 3.45, color=PALETTE.cobalt)
    rect(slide, GRID.left, 5.47, GRID.content_width, 0.80, fill=PALETTE.paper_2)
    textbox(slide, data["result_label"], GRID.left + 0.20, 5.67, 1.18, 0.20, font=FONTS.mono, size=7.8, color=PALETTE.cobalt, tracking=0.12, uppercase=True)
    textbox(slide, data["result"], GRID.left + 1.55, 5.61, 9.95, 0.38, font=FONTS.body, size=12.5, color=PALETTE.ink, bold=True)
    return slide
