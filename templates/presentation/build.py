from __future__ import annotations

import argparse
import importlib.util
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from layouts import commercial, corporate_business, corporate_editorial, corporate_systems, narrative, product, scope
from layouts.base import create_presentation
from schema import validate_deck


LAYOUTS = {
    "cover": narrative.cover,
    "understanding": narrative.understanding,
    "solution": narrative.solution,
    "evidence": narrative.evidence,
    "prototype": product.prototype,
    "process": narrative.process,
    "scope": scope.scope_index,
    "detail": scope.detail,
    "gallery": scope.gallery,
    "roles": scope.roles,
    "architecture": scope.architecture,
    "horizons": scope.horizons,
    "implementation": commercial.implementation,
    "investment": commercial.investment,
    "exclusions": commercial.exclusions,
    "closing": commercial.closing,
    "section": corporate_editorial.section,
    "editorial": corporate_editorial.editorial,
    "standard": corporate_editorial.standard,
    "split": corporate_editorial.split,
    "pillars": corporate_editorial.pillars,
    "workflow": corporate_systems.workflow,
    "product_showcase": corporate_systems.product_showcase,
    "case_study": corporate_systems.case_study,
    "scope_split": corporate_systems.scope_split,
    "phases": corporate_systems.phases,
    "roadmap": corporate_systems.roadmap,
    "table": corporate_business.table_slide,
    "budget": corporate_business.budget,
    "conditions": corporate_business.conditions,
    "team": corporate_business.team,
    "stack": corporate_business.stack,
    "next_steps": corporate_business.next_steps,
    "corporate_closing": corporate_business.corporate_closing,
}


def load_content(path: Path) -> dict:
    spec = importlib.util.spec_from_file_location("proposal_content", path)
    if not spec or not spec.loader:
        raise RuntimeError(f"No se puede cargar {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.DECK


def build(deck: dict, output: Path) -> None:
    validate_deck(deck)
    presentation = create_presentation()
    total = len(deck["slides"])
    asset_root = ROOT / "assets"
    for number, slide_data in enumerate(deck["slides"], start=1):
        slide_data = dict(slide_data)
        slide_data.setdefault("footer_label", deck["meta"].get("footer_label", "BPM TECH · PROPUESTA"))
        layout_name = slide_data["layout"]
        layout = LAYOUTS[layout_name]
        if layout_name in {"evidence", "product_showcase"}:
            layout(presentation, slide_data, number, total, asset_root)
        else:
            layout(presentation, slide_data, number, total)
    meta = deck["meta"]
    properties = presentation.core_properties
    properties.title = meta.get("title", "")
    properties.subject = meta.get("subject", "")
    properties.author = meta.get("author", "BPM Tech")
    properties.comments = meta.get("comments", "")
    properties.keywords = "BPM Tech, propuesta comercial, sistema editable"
    output.parent.mkdir(parents=True, exist_ok=True)
    presentation.save(output)


def main() -> None:
    parser = argparse.ArgumentParser(description="Genera una propuesta BPM Tech editable en PowerPoint.")
    parser.add_argument(
        "--content",
        type=Path,
        default=ROOT / "examples" / "bpm_system" / "content.py",
        help="Archivo Python que expone DECK.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=ROOT / "output" / "Propuesta_BPM_Tech_Sistema_Propuestas_Comerciales_Ago2026.pptx",
    )
    args = parser.parse_args()
    deck = load_content(args.content.resolve())
    build(deck, args.output.resolve())
    print(args.output.resolve())


if __name__ == "__main__":
    main()
