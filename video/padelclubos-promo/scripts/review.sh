#!/usr/bin/env bash
# Uso: scripts/review.sh <composicion> [frames|auto] [escala]
# Renderiza fotogramas y los junta en out/review/<composicion>.png
set -euo pipefail
cd "$(dirname "$0")/.."
id="$1"; frames="${2:-auto}"; scale="${3:-0.5}"
dir="out/review/$id"
rm -rf "$dir"; mkdir -p "$dir"
node scripts/still.mjs "$id" "$frames" --scale="$scale" --out="$dir" > "$dir/list.txt"
python3 scripts/sheet.py "out/review/$id.png" $(cat "$dir/list.txt")
