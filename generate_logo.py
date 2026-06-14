#!/usr/bin/env python3
"""Generate a high-fidelity minimalist dreamclerk logo at multiple sizes."""

from PIL import Image, ImageDraw, ImageFont
import os

# Output directory
OUT_DIR = r"c:\Users\arjun\Downloads\dreamclerk landing"

# Try to find a clean geometric sans-serif font
# Preferences: Arial (clean, geometric, widely available)
FONT_CANDIDATES = [
    r"C:\Windows\Fonts\arial.ttf",
    r"C:\Windows\Fonts\segoeui.ttf",
    r"C:\Windows\Fonts\calibri.ttf",
]

def find_font():
    for path in FONT_CANDIDATES:
        if os.path.exists(path):
            return path
    return None

def render_logo(size, font_path, output_path):
    """Render the dreamclerk wordmark centered on a white square."""
    # Create white image
    img = Image.new("RGB", (size, size), (255, 255, 255))
    draw = ImageDraw.Draw(img)

    # Font size scales with image size (~13% of image dimension for good negative space)
    # We use the size param so the wordmark looks balanced at any favicon size
    font_size = int(size * 0.13)
    font = ImageFont.truetype(font_path, font_size)

    text = "dreamclerk"

    # Get text bounding box for centering
    bbox = draw.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]

    # Center horizontally and vertically
    x = (size - text_w) // 2 - bbox[0]
    y = (size - text_h) // 2 - bbox[1]

    # Draw in solid black
    draw.text((x, y), text, font=font, fill=(0, 0, 0))

    img.save(output_path, "PNG", optimize=True)
    print(f"  Wrote {output_path} ({size}x{size})")

def main():
    font_path = find_font()
    if not font_path:
        print("ERROR: No suitable font found.")
        return
    print(f"Using font: {font_path}")

    # Generate at favicon-relevant sizes + a high-res master
    sizes = {
        "logo.png": 1024,           # master high-res logo
        "logo-512.png": 512,        # large logo
        "favicon.png": 512,         # used as fallback favicon
    }

    for filename, size in sizes.items():
        out = os.path.join(OUT_DIR, filename)
        render_logo(size, font_path, out)

if __name__ == "__main__":
    main()
