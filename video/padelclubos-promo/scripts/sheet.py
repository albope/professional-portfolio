"""Hoja de contactos: une varios fotogramas en una sola imagen con su número.

Uso: python3 scripts/sheet.py <salida.png> <frame1.png> <frame2.png> ...
"""
import re
import sys

from PIL import Image, ImageDraw, ImageFont

out, *files = sys.argv[1:]
imgs = [Image.open(f).convert("RGB") for f in files]
w, h = imgs[0].size
cols = 4 if w >= h else 6
thumb_w = 1600 // cols if w >= h else 1800 // cols
thumb_h = int(h * thumb_w / w)
rows = (len(imgs) + cols - 1) // cols
pad = 8
label_h = 22
sheet = Image.new("RGB", (cols * (thumb_w + pad) + pad, rows * (thumb_h + label_h + pad) + pad), (40, 38, 35))
draw = ImageDraw.Draw(sheet)
try:
    font = ImageFont.truetype("DejaVuSans.ttf", 15)
except OSError:
    font = ImageFont.load_default()
for k, (img, f) in enumerate(zip(imgs, files)):
    r, c = divmod(k, cols)
    x = pad + c * (thumb_w + pad)
    y = pad + r * (thumb_h + label_h + pad)
    sheet.paste(img.resize((thumb_w, thumb_h), Image.LANCZOS), (x, y + label_h))
    m = re.search(r"-f(\d+)\.png$", f)
    draw.text((x + 2, y + 3), f"frame {int(m.group(1)) if m else k}", fill=(230, 225, 215), font=font)
sheet.save(out)
print(out)
