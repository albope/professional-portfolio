from dataclasses import dataclass

@dataclass(frozen=True)
class Palette:
    paper: str = "F7F6F2"
    paper_2: str = "EFEDE6"
    ink: str = "101013"
    ink_2: str = "18181C"
    ink_soft: str = "3D3C35"
    ink_mute: str = "5A594F"
    ink_faint: str = "8A887D"
    cobalt: str = "2743E0"
    cobalt_deep: str = "1E35B8"
    cobalt_bright: str = "6B83FF"
    line: str = "E2E0D8"
    line_dark: str = "38383D"


@dataclass(frozen=True)
class Fonts:
    display: str = "Archivo Black"
    body: str = "Archivo"
    mono: str = "Fragment Mono"


@dataclass(frozen=True)
class Grid:
    width: float = 13.333333
    height: float = 7.5
    left: float = 0.72
    right: float = 0.72
    top: float = 0.52
    bottom: float = 0.42
    content_width: float = 11.893333
    gutter: float = 0.22
    footer_y: float = 7.08


@dataclass(frozen=True)
class Spacing:
    xs: float = 0.08
    sm: float = 0.16
    md: float = 0.24
    lg: float = 0.48
    xl: float = 0.72
    section: float = 1.00


@dataclass(frozen=True)
class Geometry:
    radius: float = 0.0
    hairline_pt: float = 0.75
    rule_pt: float = 1.0
    accent_square: float = 0.105


PALETTE = Palette()
FONTS = Fonts()
GRID = Grid()
SPACING = Spacing()
GEOMETRY = Geometry()


def dark_accent(dark: bool) -> str:
    return PALETTE.cobalt_bright if dark else PALETTE.cobalt
