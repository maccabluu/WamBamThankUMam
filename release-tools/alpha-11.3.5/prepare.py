from pathlib import Path
import shutil
import sys

root = Path(sys.argv[1])
tools = Path(__file__).resolve().parent

src = tools / 'gameplay-1135.js'
assert src.exists(), 'gameplay-1135.js missing'
assert (root / 'gameplay-1134.js').exists(), '11.3.4 production base missing gameplay-1134.js'
assert (root / 'gameplay-1133.js').exists(), '11.3.3 presentation layer missing'
assert (root / 'artwork' / 'booster-bar-reference-1132.png').exists(), 'fixed booster artwork missing'
assert (root / 'wam-campaign.js').exists(), 'campaign missing'

# UI-only patch. Do not change any campaign/gameplay definitions.
shutil.copyfile(src, root / 'gameplay-1135.js')

index = root / 'index.html'
html = index.read_text()
assert 'gameplay-1134.js' in html, '11.3.4 script hook missing'
assert 'gameplay-1135.js' not in html, '11.3.5 already injected'
html = html.replace('</body>', '  <script src="gameplay-1135.js"></script>\n</body>', 1)
index.write_text(html)

for name in ['data.js', 'code3.js']:
    p = root / name
    if p.exists():
        p.write_text(p.read_text().replace('11.3.4', '11.3.5'))

patched = (root / 'gameplay-1135.js').read_text()
assert 'const COUNT_POS' in patched
assert "top:1104" in patched
assert 'removeBottomRightStray' in patched
assert 'background:transparent' in patched
assert 'gameplay-1135.js' in index.read_text()

print('Applied Alpha 11.3.5: live booster numbers aligned to printed dots and bottom-right stray overlay forcibly removed for Levels 2-9.')
