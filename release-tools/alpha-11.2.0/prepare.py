from pathlib import Path
import base64
import hashlib
import shutil
import sys

root = Path(sys.argv[1])
tools = Path(__file__).resolve().parent

EXPECTED_BG_SHA = '3c55897aa5db6fc4f5373360cc151a3b298ebaf38c03727d841508aedd2e8a87'
EXPECTED_BG_SIZE = 61783


def once(text, old, new, label):
    count = text.count(old)
    assert count == 1, f"Expected one {label} hook, found {count}"
    return text.replace(old, new, 1)

# Work only against the decoded production Wam Bam APK.
campaign = root / 'wam-campaign.js'
assert campaign.exists(), 'Production wam-campaign.js is missing'
s = campaign.read_text()

old_level = "{id:1, name:'Bam Lounge', moves:24, targets:{cherries:22,diamond:16,star:18}, bags:[], tip:'Swap neighbours to match 3. Match 4 for a line blast.'},"
new_level = "{id:1, name:'Bam Lounge Opening', moves:24, targets:{cherries:18,star:12}, bags:[], background:'artwork/wambam-level1-bg.jpg', difficulty:'Easy', tip:'Match 3 to collect the goals. Match 4 in a line to make a powerful line blast.'},"
s = once(s, old_level, new_level, 'Level 1 definition')

shape_hook = "const SHAPES = {\n    arch:"
shape_new = "const SHAPES = {\n    square:['########','########','########','########','########','########','########','########'],\n    arch:"
s = once(s, shape_hook, shape_new, 'square board shape')

old_early = "const earlyShapes=['arch','stage','hourglass','wings','window','stage','arch','wings','hourglass'];"
new_early = "const earlyShapes=['square','stage','hourglass','wings','window','stage','arch','wings','hourglass'];"
s = once(s, old_early, new_early, 'Level 1 square board selection')
s = s.replace('11.1.4', '11.2.0').replace('11.1.5', '11.2.0')
campaign.write_text(s)

# Reconstruct the approved Bam Lounge artwork from small text chunks. This
# avoids binary corruption in repository transport and verifies the exact art.
parts = sorted(tools.glob('bg.b64.part*'))
assert [p.name for p in parts] == [f'bg.b64.part{i:02d}' for i in range(5)], 'Level 1 background parts are incomplete'
encoded = ''.join(p.read_text().strip() for p in parts)
raw = base64.b64decode(encoded, validate=True)
assert len(raw) == EXPECTED_BG_SIZE, f'Level 1 background size mismatch: {len(raw)}'
assert hashlib.sha256(raw).hexdigest() == EXPECTED_BG_SHA, 'Level 1 background SHA mismatch'
assert raw[:2] == b'\xff\xd8' and raw[-2:] == b'\xff\xd9', 'Level 1 background is not a complete JPEG'
dst_bg = root / 'artwork' / 'wambam-level1-bg.jpg'
dst_bg.parent.mkdir(parents=True, exist_ok=True)
dst_bg.write_bytes(raw)

# Add the real Level 1 HUD/progress layer without replacing the match-3 engine.
shutil.copyfile(tools / 'gameplay-112.js', root / 'gameplay-112.js')
index = root / 'index.html'
html = index.read_text()
assert 'gameplay-112.js' not in html, '11.2 gameplay script is already injected'
html = once(html, '</body>', '  <script src="gameplay-112.js"></script>\n</body>', 'index body close')
index.write_text(html)

# Keep visible internal version labels in sync when present.
for name in ['data.js', 'code3.js']:
    p = root / name
    if p.exists():
        t = p.read_text()
        p.write_text(t.replace('11.1.4', '11.2.0').replace('11.1.5', '11.2.0'))

# Static invariants before apktool rebuild.
patched = campaign.read_text()
assert "id:1, name:'Bam Lounge Opening'" in patched
assert "targets:{cherries:18,star:12}" in patched
assert "background:'artwork/wambam-level1-bg.jpg'" in patched
assert "const earlyShapes=['square'" in patched
assert (root / 'gameplay-112.js').exists()
assert 'gameplay-112.js' in index.read_text()
assert dst_bg.stat().st_size == EXPECTED_BG_SIZE
assert hashlib.sha256(dst_bg.read_bytes()).hexdigest() == EXPECTED_BG_SHA

print('Applied Wam Bam Alpha 11.2.0 Level 1 prototype: new Bam Lounge background, square board, goals/moves HUD, 3-star progress and real booster tray.')
