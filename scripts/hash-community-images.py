#!/usr/bin/env python3
"""Perceptual-hash Hybrid community photos and drop visual duplicates.

Run after adding images to public/images/community/:
  python3 scripts/hash-community-images.py
"""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
OUT = ROOT / "src/data/community-images.json"
COMMUNITY_DIR = PUBLIC / "images/community"
EXTRAS = [
    "images/group.jpg",
    "images/spike.jpg",
    "images/sunset.jpg",
    "images/camp-1.jpg",
    "images/hero-lanzarote.jpg",
    "images/camp-3.jpg",
]
HAMMING_LIMIT = 8


def dhash(img: Image.Image, size: int = 8) -> str:
    grey = img.convert("L").resize((size + 1, size), Image.Resampling.LANCZOS)
    pixels = list(grey.getdata())
    bits = 0
    for row in range(size):
        for col in range(size):
            left = pixels[row * (size + 1) + col]
            right = pixels[row * (size + 1) + col + 1]
            bits = (bits << 1) | (1 if left > right else 0)
    return f"{bits:016x}"


def hamming(a: str, b: str) -> int:
    return (int(a, 16) ^ int(b, 16)).bit_count()


def collect() -> list[Path]:
    files = sorted(COMMUNITY_DIR.glob("*.jpg")) + sorted(COMMUNITY_DIR.glob("*.jpeg"))
    files += sorted(COMMUNITY_DIR.glob("*.png")) + sorted(COMMUNITY_DIR.glob("*.webp"))
    for extra in EXTRAS:
        path = PUBLIC / extra
        if path.exists() and path not in files:
            files.append(path)
    return files


def main() -> None:
    kept: list[dict[str, str]] = []
    skipped: list[str] = []
    for path in collect():
        src = "/" + str(path.relative_to(PUBLIC))
        digest = dhash(Image.open(path))
        twin = next((item for item in kept if hamming(item["dhash"], digest) <= HAMMING_LIMIT), None)
        if twin:
            skipped.append(f"{src}  (same as {twin['src']})")
            continue
        kept.append({"src": src, "dhash": digest})

    OUT.write_text(json.dumps(kept, indent=2) + "\n")
    print(f"Wrote {len(kept)} unique images to {OUT.relative_to(ROOT)}")
    if skipped:
        print("Dropped visual duplicates:")
        for line in skipped:
            print(f"  {line}")


if __name__ == "__main__":
    main()
