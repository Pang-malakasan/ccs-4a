"""Prepare local static posters; requires Pillow and numpy (asset tooling only)."""
from io import BytesIO
from pathlib import Path
from urllib.request import urlopen

import numpy as np
from PIL import Image

root = Path(__file__).resolve().parents[1] / 'static' / 'services'
for number in (2, 3):
    source = f'https://ik.imagekit.io/flzo1bmh5/bougainvillea-flowers_0{number}.webm/ik-thumbnail.jpg?tr=w-900'
    rgb = np.array(Image.open(BytesIO(urlopen(source).read())).convert('RGB'))
    # Key out the black matte everywhere, including enclosed gaps between stems.
    # A short alpha ramp softens JPEG ringing along the flower edges.
    brightness = rgb.max(axis=2).astype(np.float32)
    alpha = (np.clip((brightness - 48) / 24, 0, 1) * 255).astype(np.uint8)
    output = root / f'flowers-0{number}.webp'
    Image.fromarray(np.dstack((rgb, alpha))).save(output, quality=88)
    print(output, output.stat().st_size, 'bytes')