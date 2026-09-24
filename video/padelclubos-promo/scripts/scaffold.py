"""Genera timeline.ts, registros y escenas provisionales desde docs/storyboard.json.

Uso: python3 scripts/scaffold.py
No sobrescribe escenas que ya existan.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sb = json.loads((ROOT / "docs" / "storyboard.json").read_text())


def ident(scene_id: str) -> str:
    parts = re.split(r"[^a-zA-Z0-9]+", scene_id)
    name = "".join(p[:1].upper() + p[1:] for p in parts if p)
    return name if name[:1].isalpha() else "S" + name


land = [{"id": s["id"], "bars": s["bars"]} for s in sb["landscape"]]
port = [{"id": s["id"], "bars": s["bars"]} for s in sb["portrait"]]
assert abs(sum(s["bars"] for s in land) - 30) < 1e-9, sum(s["bars"] for s in land)
assert abs(sum(s["bars"] for s in port) - 15) < 1e-9, sum(s["bars"] for s in port)

ids = []
for s in land + port:
    if s["id"] not in ids:
        ids.append(s["id"])

fmt = lambda lst: "\n".join(f'  {{id: "{s["id"]}", bars: {s["bars"]}}},' for s in lst)
tl = (ROOT / "src" / "timeline.ts").read_text()
tl = re.sub(
    r"// Provisional:.*?\nexport const PORTRAIT: SceneSpec\[\] = \[.*?\];\n",
    "// Storyboard definitivo: docs/storyboard.md\n"
    f"export const LANDSCAPE: SceneSpec[] = [\n{fmt(land)}\n];\n\n"
    f"export const PORTRAIT: SceneSpec[] = [\n{fmt(port)}\n];\n",
    tl,
    flags=re.S,
)
tl = re.sub(
    r"// Storyboard definitivo: docs/storyboard.md\nexport const LANDSCAPE: SceneSpec\[\] = \[.*?\];\n\nexport const PORTRAIT: SceneSpec\[\] = \[.*?\];\n",
    "// Storyboard definitivo: docs/storyboard.md\n"
    f"export const LANDSCAPE: SceneSpec[] = [\n{fmt(land)}\n];\n\n"
    f"export const PORTRAIT: SceneSpec[] = [\n{fmt(port)}\n];\n",
    tl,
    flags=re.S,
)
(ROOT / "src" / "timeline.ts").write_text(tl)

scenes_dir = ROOT / "src" / "scenes"
for sid in ids:
    d = scenes_dir / sid
    d.mkdir(parents=True, exist_ok=True)
    idx = d / "index.tsx"
    if not idx.exists():
        idx.write_text(
            'import React from "react";\n'
            'import {Placeholder} from "../../Placeholder";\n\n'
            f'export const Scene: React.FC = () => <Placeholder id="{sid}" />;\n'
        )
    cues = d / "cues.ts"
    if not cues.exists():
        cues.write_text('import type {SceneCues} from "../../sfx";\n\nexport const cues: SceneCues = {landscape: [], portrait: []};\n')

imports = "\n".join(f'import {{Scene as {ident(s)}}} from "./{s}";' for s in ids)
entries = "\n".join(f'  "{s}": {ident(s)},' for s in ids)
(scenes_dir / "index.ts").write_text(
    'import type React from "react";\n'
    f"{imports}\n\n"
    "/**\n * Registro de escenas: id del storyboard → componente. Cada escena lee su\n"
    " * formato con useFormat() y trabaja en frames relativos a su inicio.\n */\n"
    f"export const SCENES: Record<string, React.FC> = {{\n{entries}\n}};\n"
)
cimports = "\n".join(f'import {{cues as {ident(s)}}} from "./{s}/cues";' for s in ids)
(scenes_dir / "cues.ts").write_text(
    'import type {SceneCues} from "../sfx";\n'
    f"{cimports}\n\n"
    "/** Registro de cues por escena (id del storyboard → cues de cada formato). */\n"
    f"export const CUES: Record<string, SceneCues> = {{\n{entries}\n}};\n"
)
print("escenas:", ", ".join(ids))
