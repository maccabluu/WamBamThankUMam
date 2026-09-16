from pathlib import Path
import base64
import shutil
import sys

root = Path(sys.argv[1])
tools = Path(__file__).resolve().parent

js = tools / 'gameplay-1131.js'
assert js.exists(), 'gameplay-1131.js missing'

parts = [tools / f'booster-bar-reference.b64.part{i}' for i in range(1, 7)]
for part in parts:
    assert part.exists(), f'{part.name} missing'

encoded = ''.join(part.read_text().strip() for part in parts)
data = base64.b64decode(encoded, validate=True)
assert len(data) > 30000, f'booster artwork unexpectedly small: {len(data)} bytes'
assert data[:2] == b'\xff\xd8', 'booster artwork is not JPEG'
assert data[-2:] == b'\xff\xd9', 'booster artwork JPEG is truncated'

shutil.copyfile(js, root / 'gameplay-1131.js')
art_dir = root / 'artwork'
art_dir.mkdir(parents=True, exist_ok=True)
(art_dir / 'booster-bar-reference-1131.jpg').write_bytes(data)

index = root / 'index.html'
html = index.read_text()
assert 'gameplay-1130.js' in html, '11.3.0 production base missing'
assert 'gameplay-1131.js' not in html, '11.3.1 already injected'
html = html.replace('</body>', '  <script src="gameplay-1131.js"></script>\n</body>', 1)
index.write_text(html)

for name in ['wam-campaign.js', 'data.js', 'code3.js']:
    p = root / name
    if p.exists():
        p.write_text(p.read_text().replace('11.3.0', '11.3.1'))

patched = (root / 'gameplay-1131.js').read_text()
assert "BAR_SRC='artwork/booster-bar-reference-1131.jpg'" in patched
assert "top','994px'" in patched
assert "opacity','0'" in patched
assert (art_dir / 'booster-bar-reference-1131.jpg').stat().st_size > 30000
print(f'Applied Alpha 11.3.1: exact supplied booster-bar artwork ({len(data)} bytes) with no visible inventory numbers and invisible live hit areas.')
