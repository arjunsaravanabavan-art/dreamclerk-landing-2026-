#!/usr/bin/env python3
"""Generate favicon PNGs at standard sizes.

Strategy:
- Small sizes (16, 32): single "d" monogram, black on white square
- Medium-large (180, 192, 512): full "dreamclerk" wordmark
"""

from PIL import Image, ImageDraw, ImageFont
import os
import shutil

OUT_DIR = r"c:\Users\arjun\Downloads\dreamclerk landing"
PUBLIC_DIR = os.path.join(OUT_DIR, "app", "public")
FONT_PATH = r"C:\Windows\Fonts\arial.ttf"

# (filename, size, text)
SIZES = [
    ("favicon-16.png", 16, "d"),         # tab favicon
    ("favicon-32.png", 32, "d"),         # standard tab favicon
    ("apple-touch-icon.png", 180, "dreamclerk"),  # iOS
    ("favicon-192.png", 192, "dreamclerk"),       # android
    ("favicon-512.png", 512, "dreamclerk"),       # PWA / og
]

def render(size, text, output_path):
    img = Image.new("RGB", (size, size), (255, 255, 255))
    draw = ImageDraw.Draw(img)

    if text == "dreamclerk":
        # Proportional font size for full wordmark
        font_size = int(size * 0.13)
    else:
        # Single letter monogram — large, fills the box
        font_size = int(size * 0.78)

    font = ImageFont.truetype(FONT_PATH, font_size)
    bbox = draw.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    x = (size - text_w) // 2 - bbox[0]
    y = (size - text_h) // 2 - bbox[1]

    draw.text((x, y), text, font=font, fill=(0, 0, 0))
    img.save(output_path, "PNG", optimize=True)
    print(f"  {output_path}  ({size}x{size}, text={text!r})")


def main():
    os.makedirs(PUBLIC_DIR, exist_ok=True)
    for filename, size, text in SIZES:
        out = os.path.join(OUT_DIR, filename)
        render(size, text, out)
        # Also place in app/public/ so Vite serves it as /<filename>
        public_out = os.path.join(PUBLIC_DIR, filename)
        shutil.copy2(out, public_out)
        print(f"  Copied to {public_out}")


if __name__ == "__main__":
    main()
