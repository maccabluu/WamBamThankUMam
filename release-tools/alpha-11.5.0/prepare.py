from pathlib import Path
import hashlib
import shutil
import struct
import sys

root = Path(sys.argv[1])
tools = Path(__file__).resolve().parent

campaign = root / 'wam-campaign.js'
engine = root / 'wam-engine.js'
index = root / 'index.html'
ui = root / 'wam-ui.js'
for p in [campaign, engine, index, ui, root / 'gameplay-1140.js', root / 'gameplay-1142.js']:
    assert p.exists(), f'Missing signed production file: {p.name}'

src = tools / 'frankie-level10-bg-1150.png'
raw = src.read_bytes()
assert hashlib.sha256(raw).hexdigest() == '427bd7ccf5de9fcae2c54bbf788391bff2246ef32f405134f2b9d321a0c92019'
assert raw[:8] == b'\x89PNG\r\n\x1a\n'
w, h = struct.unpack('>II', raw[16:24])
assert (w, h) == (958, 1642), (w, h)
assert len(raw) == 3391541, len(raw)
art = root / 'artwork' / 'frankie-level10-bg-1150.png'
art.parent.mkdir(parents=True, exist_ok=True)
shutil.copyfile(src, art)

script_src = tools / 'gameplay-1150.js'
assert script_src.exists(), 'gameplay-1150.js missing'
script_text = script_src.read_text()
for needle in [
    "LEVEL10_BG='artwork/frankie-level10-bg-1150.png'",
    'STANDARD_MIN=11',
    'STANDARD_MAX=100',
    "C.BOOSTER_LABELS.hammer='Hammer'",
    "C.BOOSTER_LABELS.rocket='Mic Blast'",
    "C.BOOSTER_LABELS.swap='Shuffle'",
    "C.BOOSTER_LABELS.disco='Spotlight'",
    "JUKEBOX_KEY='wambam-jukebox-count'",
    'v.game.reshuffle()',
    "label:'JUKEBOX JAM!'",
    "b.textContent='Ⅱ'",
]:
    assert needle in script_text, needle
shutil.copyfile(script_src, root / 'gameplay-1150.js')

html = index.read_text()
assert 'gameplay-1142.js' in html, 'Signed 11.4.2 repair hook missing'
assert 'gameplay-1150.js' not in html, '11.5.0 already injected'
html = html.replace('</body>', '  <script src="gameplay-1150.js"></script>\n</body>', 1)
index.write_text(html)

for name in ['data.js', 'code3.js']:
    p = root / name
    if p.exists():
        text = p.read_text().replace('11.4.2', '11.5.0')
        p.write_text(text)

uitext = ui.read_text()
assert 'Heel Smash' not in uitext, 'Old Heel Smash label returned in signed UI'
assert 'booster-hammer-1141.svg' in uitext, 'Hammer reward artwork hook missing'
assert 'z-index:60000' in uitext, 'Modal-over-booster repair missing'

print(f'Prepared Alpha 11.5.0 with exact Frankie art {w}x{h}, {len(raw)} bytes, SHA256 {hashlib.sha256(raw).hexdigest()}.')
