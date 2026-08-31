from __future__ import annotations

import argparse
import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


def get_font(size: int):
    for candidate in (
        Path(r"C:\Windows\Fonts\segoeui.ttf"),
        Path(r"C:\Windows\Fonts\arial.ttf"),
    ):
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default()


def make_sheet(render_dir: Path, output: Path, columns: int = 3) -> None:
    slides = list(render_dir.glob("*.PNG")) + list(render_dir.glob("*.png"))
    def slide_number(path: Path) -> int:
        match = re.search(r"(\d+)$", path.stem)
        return int(match.group(1)) if match else 10_000
    slides = sorted(set(slides), key=slide_number)
    if not slides:
        raise RuntimeError(f"No hay renders en {render_dir}")

    thumb_w, thumb_h = 480, 270
    pad, label_h = 24, 38
    rows = (len(slides) + columns - 1) // columns
    width = pad + columns * (thumb_w + pad)
    height = pad + rows * (thumb_h + label_h + pad)
    sheet = Image.new("RGB", (width, height), "#101013")
    draw = ImageDraw.Draw(sheet)
    font = get_font(18)

    for index, path in enumerate(slides):
        image = Image.open(path).convert("RGB")
        image.thumbnail((thumb_w, thumb_h), Image.Resampling.LANCZOS)
        col, row = index % columns, index // columns
        x = pad + col * (thumb_w + pad)
        y = pad + row * (thumb_h + label_h + pad)
        draw.text((x, y + 7), f"{index + 1:02d}", fill="#F7F6F2", font=font)
        sheet.paste(image, (x, y + label_h))

    output.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output)


def main() -> None:
    root = Path(__file__).resolve().parent
    parser = argparse.ArgumentParser()
    parser.add_argument("--render-dir", type=Path, default=root / "output" / "rendered")
    parser.add_argument("--output", type=Path, default=root / "output" / "contact-sheet.png")
    args = parser.parse_args()
    make_sheet(args.render_dir.resolve(), args.output.resolve())
    print(args.output.resolve())


if __name__ == "__main__":
    main()
