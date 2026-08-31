from __future__ import annotations


SUPPORTED_LAYOUTS = {
    "cover",
    "understanding",
    "solution",
    "evidence",
    "prototype",
    "process",
    "scope",
    "detail",
    "gallery",
    "roles",
    "architecture",
    "horizons",
    "implementation",
    "investment",
    "exclusions",
    "closing",
    "section",
    "editorial",
    "standard",
    "split",
    "pillars",
    "workflow",
    "product_showcase",
    "case_study",
    "scope_split",
    "phases",
    "roadmap",
    "table",
    "budget",
    "conditions",
    "team",
    "stack",
    "next_steps",
    "corporate_closing",
}


def validate_deck(deck: dict) -> None:
    if not isinstance(deck, dict):
        raise TypeError("DECK debe ser un diccionario.")
    for key in ("meta", "slides"):
        if key not in deck:
            raise ValueError(f"Falta DECK['{key}'].")
    if not deck["slides"]:
        raise ValueError("La propuesta debe contener al menos una diapositiva.")
    for index, slide in enumerate(deck["slides"], start=1):
        layout = slide.get("layout")
        if layout not in SUPPORTED_LAYOUTS:
            raise ValueError(f"Slide {index}: layout no soportado: {layout!r}")
        if layout != "cover" and "eyebrow" not in slide:
            raise ValueError(f"Slide {index}: falta eyebrow.")
        if "title" not in slide:
            raise ValueError(f"Slide {index}: falta title.")
