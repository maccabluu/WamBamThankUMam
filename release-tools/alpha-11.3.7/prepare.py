from pathlib import Path
import shutil
import sys

root = Path(sys.argv[1])
tools = Path(__file__).resolve().parent

src = tools / 'gameplay-1137.js'
assert src.exists(), 'gameplay-1137.js missing'
assert (root / 'gameplay-1136.js').exists(), '11.3.6 production base missing gameplay-1136.js'
assert (root / 'gameplay-1135.js').exists(), '11.3.5 layer missing'
assert (root / 'artwork' / 'booster-bar-reference-1132.png').exists(), 'booster artwork missing'
assert (root / 'wam-campaign.js').exists(), 'campaign missing'

# UI-only patch. Do not touch campaign/gameplay definitions.
shutil.copyfile(src, root / 'gameplay-1137.js')

index = root / 'index.html'
html = index.read_text()
assert 'gameplay-1136.js' in html, '11.3.6 script hook missing'
assert 'gameplay-1137.js' not in html, '11.3.7 already injected'
html = html.replace('</body>', '  <script src="gameplay-1137.js"></script>\n</body>', 1)
index.write_text(html)

for name in ['data.js', 'code3.js']:
    p = root / name
    if p.exists():
        p.write_text(p.read_text().replace('11.3.6', '11.3.7'))

patched = (root / 'gameplay-1137.js').read_text()
assert 'JUKEBOX_POS' in patched
assert 'forceHint' in patched
assert 'repairHintButton' in patched
assert 'wam1137-jukebox-count' in patched
assert 'gameplay-1137.js' in index.read_text()

print('Applied Alpha 11.3.7: Jukebox count plus explicit working Hint binding for Levels 2-9.')
