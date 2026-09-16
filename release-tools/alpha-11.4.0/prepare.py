from pathlib import Path
import base64
import hashlib
import shutil
import sys

root = Path(sys.argv[1])
tools = Path(__file__).resolve().parent

src = tools / 'gameplay-1140.js'
parts = [tools / f'frankie-bg.b64.part{i:02d}' for i in range(3)]
assert src.exists(), 'gameplay-1140.js missing'
assert all(p.exists() for p in parts), 'Frankie background payload part missing'
assert (root / 'gameplay-1138.js').exists(), '11.3.8 production base missing gameplay-1138.js'
assert (root / 'artwork' / 'booster-bar-reference-1132.png').exists(), 'booster strip missing'
assert (root / 'wam-campaign.js').exists(), 'campaign missing'

# Rebuild the approved Frankie Flash artwork from verified payload chunks.
encoded = ''.join(''.join(p.read_text().split()) for p in parts)
raw = base64.b64decode(encoded, validate=True)
assert len(raw) == 18665, f'Frankie background size mismatch: {len(raw)}'
sha = hashlib.sha256(raw).hexdigest()
assert sha == '5146fd1f4aac4fea7922c7c5b3080e59c03c2724eb9473a2e5cfc7841037efad', sha
assert raw[:3] == b'\xff\xd8\xff', 'Frankie background is not JPEG'
art = root / 'artwork' / 'frankie-level10-bg.jpg'
art.write_bytes(raw)

# Change only the Level 10 generated design tuple: title and 30 moves.
campaign = root / 'wam-campaign.js'
before = campaign.read_text()
old = "['Kiss & Tell','arch',0,'ice',10,27],"
new = "['Frankie Flash','arch',0,'ice',10,30],"
assert before.count(old) == 1, 'Level 10 source tuple not found exactly once'
after = before.replace(old, new, 1)
assert after.replace(new, old, 1) == before, 'Unexpected campaign mutation'
campaign.write_text(after)

# Add the Level 10 boss runtime after all existing 11.3.x fixes.
shutil.copyfile(src, root / 'gameplay-1140.js')
index = root / 'index.html'
html = index.read_text()
assert 'gameplay-1138.js' in html, '11.3.8 script hook missing'
assert 'gameplay-1140.js' not in html, '11.4.0 already injected'
html = html.replace('</body>', '  <script src="gameplay-1140.js"></script>\n</body>', 1)
index.write_text(html)

for name in ['data.js', 'code3.js']:
    p = root / name
    if p.exists():
        p.write_text(p.read_text().replace('11.3.8', '11.4.0'))

patched = (root / 'gameplay-1140.js').read_text()
for needle in ['FRANKIE FLASH', 'BOSS HEALTH', 'FRANKIE STOLE A MOVE', 'frankie-level10-bg.jpg', 'wam1140-health-fill']:
    assert needle in patched, needle
assert 'gameplay-1140.js' in index.read_text()
print('Applied Alpha 11.4.0: Frankie Flash Level 10 boss with approved stage artwork, 30 moves, boss health HUD and boss attacks.')
