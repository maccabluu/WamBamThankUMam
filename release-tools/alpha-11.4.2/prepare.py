from pathlib import Path
import base64
import hashlib
import shutil
import sys

root = Path(sys.argv[1])
tools = Path(__file__).resolve().parent
release_tools = tools.parent

assert (root / 'gameplay-1140.js').exists(), '11.4.0 boss base missing gameplay-1140.js'
assert (root / 'wam-ui.js').exists(), 'wam-ui.js missing'
assert (root / 'wam-campaign.js').exists(), 'campaign missing'
assert (root / 'artwork' / 'booster-bar-reference-1132.png').exists(), 'booster strip missing'

# Restore the larger Frankie artwork that was already prepared for 11.4.0.
# The published 11.4.0 accidentally used the tiny 140x240 fallback instead.
parts = [release_tools / 'alpha-11.4.0' / f'frankie-bg.b64.part{i:02d}' for i in range(3)]
for p in parts:
    assert p.exists(), f'Missing Frankie background chunk: {p.name}'
encoded = ''.join(''.join(p.read_text().split()) for p in parts)
raw = base64.b64decode(encoded, validate=True)
assert raw[:3] == b'\xff\xd8\xff', 'Restored Frankie background is not JPEG'
assert len(raw) > 15000, f'Restored Frankie background unexpectedly small: {len(raw)} bytes'

def jpeg_dimensions(data: bytes):
    i = 2
    sof = {0xC0,0xC1,0xC2,0xC3,0xC5,0xC6,0xC7,0xC9,0xCA,0xCB,0xCD,0xCE,0xCF}
    while i + 9 < len(data):
        if data[i] != 0xFF:
            i += 1
            continue
        while i < len(data) and data[i] == 0xFF:
            i += 1
        if i >= len(data):
            break
        marker = data[i]
        i += 1
        if marker in {0xD8,0xD9} or 0xD0 <= marker <= 0xD7:
            continue
        if i + 2 > len(data):
            break
        length = int.from_bytes(data[i:i+2], 'big')
        if marker in sof:
            height = int.from_bytes(data[i+3:i+5], 'big')
            width = int.from_bytes(data[i+5:i+7], 'big')
            return width, height
        if length < 2:
            break
        i += length
    raise AssertionError('Could not read JPEG dimensions')

w, h = jpeg_dimensions(raw)
assert (w, h) == (240, 411), f'Unexpected restored Frankie dimensions: {w}x{h}'
art = root / 'artwork' / 'frankie-level10-bg.jpg'
art.write_bytes(raw)
(root / 'artwork' / 'frankie-level10-bg.sha256').write_text(hashlib.sha256(raw).hexdigest() + '\n')

# Carry forward the user's Hammer reward correction from the failed 11.4.1 build.
hammer_src = release_tools / 'alpha-11.4.1' / 'booster-hammer-1141.svg'
assert hammer_src.exists(), 'Hammer reward icon source missing'
icons = root / 'icons'
icons.mkdir(parents=True, exist_ok=True)
shutil.copyfile(hammer_src, icons / 'booster-hammer-1141.svg')

ui = root / 'wam-ui.js'
text = ui.read_text()
heel_count = text.count('Heel Smash')
assert heel_count >= 1, 'Heel Smash label not found'
text = text.replace('Heel Smash', 'Hammer')
old_icon = "key==='hammer'?C.PIECES.heel.image"
new_icon = "key==='hammer'?'icons/booster-hammer-1141.svg'"
assert text.count(old_icon) == 1, 'Old hammer reward icon expression not found exactly once'
text = text.replace(old_icon, new_icon, 1)
old_shade = '.wam-shade{position:absolute;inset:0;z-index:1000;'
new_shade = '.wam-shade{position:absolute;inset:0;z-index:60000;'
assert text.count(old_shade) == 1, 'Modal shade source not found exactly once'
text = text.replace(old_shade, new_shade, 1)
ui.write_text(text)

# Layer the Level 10 runtime repair after the 11.4.0 boss code.
src = tools / 'gameplay-1142.js'
assert src.exists(), 'gameplay-1142.js missing'
shutil.copyfile(src, root / 'gameplay-1142.js')
index = root / 'index.html'
html = index.read_text()
assert 'gameplay-1140.js' in html, '11.4.0 boss script hook missing'
assert 'gameplay-1142.js' not in html, '11.4.2 already injected'
html = html.replace('</body>', '  <script src="gameplay-1142.js"></script>\n</body>', 1)
index.write_text(html)

for name in ['data.js', 'code3.js']:
    p = root / name
    if p.exists():
        p.write_text(p.read_text().replace('11.4.0', '11.4.2'))

check = ui.read_text()
assert 'Heel Smash' not in check, 'Old Heel Smash label remains'
assert "icons/booster-hammer-1141.svg" in check, 'Hammer reward icon hook missing'
assert 'z-index:60000' in check, 'Modal-over-booster fix missing'
patched = (root / 'gameplay-1142.js').read_text()
for needle in ["pause.textContent='Ⅱ'", 'brightenPieces', 'wam1140-reaction', 'filter:none!important']:
    assert needle in patched, needle
print(f'Applied Alpha 11.4.2: restored {w}x{h} Frankie background, brighter Level 10 board, repaired pause/reaction layout, Hammer reward and modal layering.')
