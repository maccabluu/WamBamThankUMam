from pathlib import Path
import shutil
import sys

root = Path(sys.argv[1])
tools = Path(__file__).resolve().parent

src = tools / 'gameplay-1136.js'
assert src.exists(), 'gameplay-1136.js missing'
assert (root / 'gameplay-1135.js').exists(), '11.3.5 production base missing gameplay-1135.js'
assert (root / 'gameplay-1134.js').exists(), '11.3.4 layout layer missing'
assert (root / 'artwork' / 'booster-bar-reference-1132.png').exists(), 'booster artwork missing'
assert (root / 'artwork' / 'wambam-level1-bg.jpg').exists(), 'Bam Lounge background missing'
assert (root / 'wam-campaign.js').exists(), 'campaign missing'

shutil.copyfile(src, root / 'gameplay-1136.js')

index = root / 'index.html'
html = index.read_text()
assert 'gameplay-1135.js' in html, '11.3.5 script hook missing'
assert 'gameplay-1136.js' not in html, '11.3.6 already injected'
html = html.replace('</body>', '  <script src="gameplay-1136.js"></script>\n</body>', 1)
index.write_text(html)

for name in ['data.js', 'code3.js']:
    p = root / name
    if p.exists():
        p.write_text(p.read_text().replace('11.3.5', '11.3.6'))

patched = (root / 'gameplay-1136.js').read_text()
assert "hammer:{left:137,top:1082}" in patched
assert 'wam1136-clean-mask' in patched
assert "top:1110px" in patched
assert 'wam1134-count{display:none' in patched
assert 'gameplay-1136.js' in index.read_text()

print('Applied Alpha 11.3.6: exact booster-dot count alignment plus hard visual mask for the persistent bottom-right stray oval.')
