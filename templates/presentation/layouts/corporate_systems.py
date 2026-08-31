from __future__ import annotations

from pathlib import Path

from pptx.enum.text import PP_ALIGN

from components.primitives import (
    add_picture_cover,
    eyebrow,
    line,
    rect,
    registration_marks,
    textbox,
    title_block,
)
from layouts.base import blank_slide, chrome
from theme.tokens import FONTS, GRID, PALETTE


def workflow(presentation, data: dict, number: int, total: int):
    slide = blank_slide(presentation, dark=True)
    eyebrow(slide, data["eyebrow"], dark=True)
    chrome(slide, number, total, dark=True, label=data["footer_label"])
    title_block(slide, data["title"], dark=True, y=1.03, w=9.8, h=1.05, size=29.5)
    textbox(slide, data["lead"], GRID.left, 2.12, 8.9, 0.48, font=FONTS.body, size=12.1, color="B8B7B0")
    nodes = data["nodes"]
    positions = [(0.72, 3.16), (3.28, 3.16), (5.84, 3.16), (8.40, 3.16), (10.56, 3.16)]
    box_w = [2.12, 2.12, 2.12, 1.72, 2.05]
    for i, node in enumerate(nodes[:5]):
        x, y = positions[i]
        decision = node.get("decision", False)
        active = node.get("active", False)
        rect(slide, x, y, box_w[i], 0.78, fill=PALETTE.cobalt_bright if active else None, line=PALETTE.cobalt_bright if (active or decision) else PALETTE.line_dark)
        color = PALETTE.ink if active else PALETTE.paper
        textbox(slide, node.get("index", f"{i + 1:02d}"), x + 0.12, y + 0.12, 0.34, 0.18, font=FONTS.mono, size=7.2, color=PALETTE.ink if active else PALETTE.cobalt_bright)
        textbox(slide, node["title"], x + 0.12, y + 0.38, box_w[i] - 0.24, 0.24, font=FONTS.body, size=9.2, color=color, bold=True, align=PP_ALIGN.CENTER)
        if i < min(len(nodes), 5) - 1:
            line(slide, x + box_w[i], y + 0.39, positions[i + 1][0], y + 0.39, color=PALETTE.cobalt_bright)
    branch = data.get("branch")
    if branch:
        source_index = min(branch.get("from", 2), len(nodes) - 1)
        sx, sy = positions[source_index]
        source_center = sx + box_w[source_index] / 2
        line(slide, source_center, sy + 0.78, source_center, 4.62, color=PALETTE.cobalt_bright)
        line(slide, source_center, 4.62, 8.40, 4.62, color=PALETTE.cobalt_bright)
        rect(slide, 8.40, 4.28, 3.54, 0.70, line=PALETTE.line_dark)
        textbox(slide, branch["label"], 8.55, 4.47, 3.24, 0.24, font=FONTS.body, size=9.2, color=PALETTE.paper, bold=True, align=PP_ALIGN.CENTER)
    for i, item in enumerate(data.get("notes", [])[:3]):
        x = GRID.left + i * 4.02
        line(slide, x, 5.62, x + 3.72, 5.62, color=PALETTE.line_dark)
        textbox(slide, item["label"], x, 5.86, 3.4, 0.18, font=FONTS.mono, size=7.2, color=PALETTE.cobalt_bright, tracking=0.10, uppercase=True)
        textbox(slide, item["body"], x, 6.17, 3.55, 0.42, font=FONTS.body, size=9.1, color="AAA9A3")
    return slide


def product_showcase(presentation, data: dict, number: int, total: int, asset_root: Path):
    slide = blank_slide(presentation)
    eyebrow(slide, data["eyebrow"])
    chrome(slide, number, total, label=data["footer_label"])
    title_block(slide, data["title"], y=1.03, w=9.5, h=1.05, size=29)
    textbox(slide, data["lead"], GRID.left, 2.12, 8.6, 0.46, font=FONTS.body, size=12.1, color=PALETTE.ink_mute)
    frame_x, frame_y, frame_w, frame_h = 0.72, 2.90, 8.13, 3.48
    rect(slide, frame_x, frame_y, frame_w, frame_h, fill=PALETTE.paper_2, line=PALETTE.line)
    if data.get("image"):
        add_picture_cover(slide, asset_root / data["image"], frame_x + 0.12, frame_y + 0.12, frame_w - 0.24, frame_h - 0.24)
    else:
        rect(slide, frame_x + 0.18, frame_y + 0.18, frame_w - 0.36, 0.34, fill=PALETTE.ink)
        rect(slide, frame_x + 0.18, frame_y + 0.72, 1.46, frame_h - 1.00, fill=PALETTE.ink_2)
        for i in range(4):
            rect(slide, frame_x + 1.90, frame_y + 0.72 + i * 0.54, frame_w - 2.30, 0.36, fill=PALETTE.paper if i else PALETTE.cobalt, line=PALETTE.line if i else PALETTE.cobalt)
    registration_marks(slide, frame_x, frame_y, frame_w, frame_h)
    textbox(slide, data.get("caption", "CAPTURA / PRODUCTO / INTERFAZ"), frame_x, 6.47, frame_w, 0.18, font=FONTS.mono, size=7.0, color=PALETTE.ink_faint, tracking=0.08, uppercase=True)
    for i, item in enumerate(data["points"][:4]):
        y = 2.96 + i * 0.84
        textbox(slide, item.get("index", f"{i + 1:02d}"), 9.25, y, 0.36, 0.18, font=FONTS.mono, size=7.6, color=PALETTE.cobalt)
        textbox(slide, item["title"], 9.75, y - 0.02, 2.55, 0.26, font=FONTS.body, size=9.8, color=PALETTE.ink, bold=True)
        textbox(slide, item["body"], 9.75, y + 0.27, 2.60, 0.44, font=FONTS.body, size=8.8, color=PALETTE.ink_mute)
    return slide


def case_study(presentation, data: dict, number: int, total: int):
    slide = blank_slide(presentation)
    eyebrow(slide, data["eyebrow"])
    chrome(slide, number, total, label=data["footer_label"])
    title_block(slide, data["title"], y=1.03, w=9.7, h=1.05, size=29.5)
    textbox(slide, data["lead"], GRID.left, 2.12, 8.8, 0.46, font=FONTS.body, size=12.1, color=PALETTE.ink_mute)
    items = [data["context"], data["problem"], data["solution"], data["result"]]
    labels = ["CONTEXTO", "PROBLEMA", "SOLUCIÓN", "RESULTADO"]
    for i, (label, body) in enumerate(zip(labels, items)):
        col, row = i % 2, i // 2
        x = GRID.left + col * 6.06
        y = 2.93 + row * 1.46
        line(slide, x, y, x + 5.74, y, color=PALETTE.cobalt if i == 3 else PALETTE.line)
        textbox(slide, f"0{i + 1} · {label}", x, y + 0.18, 2.4, 0.18, font=FONTS.mono, size=7.4, color=PALETTE.cobalt, tracking=0.08)
        textbox(slide, body, x, y + 0.52, 5.55, 0.70, font=FONTS.body, size=10.0, color=PALETTE.ink, bold=i == 3)
    rect(slide, GRID.left, 5.98, GRID.content_width, 0.48, fill=PALETTE.ink)
    textbox(slide, "TECNOLOGÍA", GRID.left + 0.18, 6.13, 1.25, 0.16, font=FONTS.mono, size=7.0, color=PALETTE.cobalt_bright, tracking=0.08)
    textbox(slide, " · ".join(data["technology"]), 2.16, 6.09, 10.15, 0.23, font=FONTS.mono, size=7.4, color=PALETTE.paper)
    return slide


def scope_split(presentation, data: dict, number: int, total: int):
    slide = blank_slide(presentation)
    eyebrow(slide, data["eyebrow"])
    chrome(slide, number, total, label=data["footer_label"])
    title_block(slide, data["title"], y=1.03, w=9.7, h=1.05, size=29.5)
    textbox(slide, data["lead"], GRID.left, 2.12, 8.8, 0.46, font=FONTS.body, size=12.1, color=PALETTE.ink_mute)
    blocks = ((GRID.left, data["included"], False, "INCLUIDO"), (6.82, data["excluded"], True, "NO INCLUIDO"))
    for x, block, dark, fallback in blocks:
        w = 5.79 if x > 1 else 5.65
        rect(slide, x, 2.92, w, 3.44, fill=PALETTE.ink if dark else None, line=PALETTE.ink if dark else PALETTE.line)
        accent = PALETTE.cobalt_bright if dark else PALETTE.cobalt
        ink = PALETTE.paper if dark else PALETTE.ink
        muted = "B8B7B0" if dark else PALETTE.ink_mute
        textbox(slide, block.get("label", fallback), x + 0.24, 3.19, w - 0.48, 0.20, font=FONTS.mono, size=7.7, color=accent, tracking=0.12, uppercase=True)
        textbox(slide, block["title"], x + 0.24, 3.58, w - 0.48, 0.48, font=FONTS.display, size=16.5, color=ink, uppercase=True)
        for i, item in enumerate(block["items"][:5]):
            textbox(slide, "■", x + 0.24, 4.34 + i * 0.40, 0.20, 0.18, font=FONTS.mono, size=7.0, color=accent)
            textbox(slide, item, x + 0.56, 4.29 + i * 0.40, w - 0.88, 0.30, font=FONTS.body, size=9.2, color=muted)
    return slide


def phases(presentation, data: dict, number: int, total: int):
    slide = blank_slide(presentation)
    eyebrow(slide, data["eyebrow"])
    chrome(slide, number, total, label=data["footer_label"])
    title_block(slide, data["title"], y=1.03, w=9.7, h=1.05, size=29.5)
    textbox(slide, data["lead"], GRID.left, 2.12, 8.8, 0.46, font=FONTS.body, size=12.1, color=PALETTE.ink_mute)
    items = data["phases"]
    gap = 0.20
    w = (GRID.content_width - gap * (len(items) - 1)) / len(items)
    for i, item in enumerate(items):
        x = GRID.left + i * (w + gap)
        active = item.get("active", False)
        rect(slide, x, 2.94, w, 3.35, fill=PALETTE.ink if active else None, line=PALETTE.ink if active else PALETTE.line)
        accent = PALETTE.cobalt_bright if active else PALETTE.cobalt
        ink = PALETTE.paper if active else PALETTE.ink
        muted = "B8B7B0" if active else PALETTE.ink_mute
        textbox(slide, item.get("index", f"{i + 1:02d}"), x + 0.18, 3.18, w - 0.36, 0.18, font=FONTS.mono, size=7.4, color=accent)
        textbox(slide, item["title"], x + 0.18, 3.56, w - 0.36, 0.55, font=FONTS.display, size=14.2, color=ink, uppercase=True)
        for j, key in enumerate(("objective", "deliverable", "duration")):
            label = {"objective": "OBJETIVO", "deliverable": "ENTREGABLE", "duration": "DURACIÓN"}[key]
            y = 4.38 + j * 0.62
            textbox(slide, label, x + 0.18, y, w - 0.36, 0.16, font=FONTS.mono, size=6.5, color=accent, tracking=0.08)
            textbox(slide, item[key], x + 0.18, y + 0.22, w - 0.36, 0.32, font=FONTS.body, size=8.4, color=muted)
    return slide


def roadmap(presentation, data: dict, number: int, total: int):
    slide = blank_slide(presentation, dark=True)
    eyebrow(slide, data["eyebrow"], dark=True)
    chrome(slide, number, total, dark=True, label=data["footer_label"])
    title_block(slide, data["title"], dark=True, y=1.03, w=9.7, h=1.05, size=29.5)
    textbox(slide, data["lead"], GRID.left, 2.12, 8.8, 0.46, font=FONTS.body, size=12.1, color="B8B7B0")
    periods = data["periods"]
    label_w = 2.42
    grid_x = GRID.left + label_w
    grid_w = GRID.content_width - label_w
    cell_w = grid_w / len(periods)
    for i, period in enumerate(periods):
        x = grid_x + i * cell_w
        textbox(slide, period, x, 2.90, cell_w, 0.20, font=FONTS.mono, size=7.2, color=PALETTE.cobalt_bright, align=PP_ALIGN.CENTER, uppercase=True)
        line(slide, x, 3.22, x, 6.37, color=PALETTE.line_dark)
    line(slide, grid_x + grid_w, 3.22, grid_x + grid_w, 6.37, color=PALETTE.line_dark)
    for row_i, item in enumerate(data["tracks"][:4]):
        y = 3.22 + row_i * 0.78
        line(slide, GRID.left, y, GRID.width - GRID.right, y, color=PALETTE.line_dark)
        textbox(slide, item["label"], GRID.left, y + 0.27, label_w - 0.22, 0.20, font=FONTS.body, size=9.2, color=PALETTE.paper, bold=True)
        start = max(0, item["start"])
        span = max(1, item["span"])
        bar_x = grid_x + start * cell_w + 0.10
        bar_w = span * cell_w - 0.20
        rect(slide, bar_x, y + 0.20, bar_w, 0.38, fill=PALETTE.cobalt_bright if item.get("active", False) else PALETTE.ink_2, line=PALETTE.cobalt_bright if item.get("active", False) else PALETTE.line_dark)
        textbox(slide, item.get("output", ""), bar_x + 0.08, y + 0.31, bar_w - 0.16, 0.16, font=FONTS.mono, size=6.5, color=PALETTE.ink if item.get("active", False) else PALETTE.paper, align=PP_ALIGN.CENTER, uppercase=True)
    line(slide, GRID.left, 6.34, GRID.width - GRID.right, 6.34, color=PALETTE.line_dark)
    return slide
