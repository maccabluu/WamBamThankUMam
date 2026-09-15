from pathlib import Path
import shutil
import sys

root = Path(sys.argv[1])
tools = Path(__file__).resolve().parent

src = tools / 'gameplay-1130.js'
assert src.exists(), 'gameplay-1130.js missing'
shutil.copyfile(src, root / 'gameplay-1130.js')

index = root / 'index.html'
html = index.read_text()
assert 'gameplay-1129.js' in html, '11.2.9 production base missing'
assert 'gameplay-1130.js' not in html, '11.3.0 already injected'
html = html.replace('</body>', '  <script src="gameplay-1130.js"></script>\n</body>', 1)
index.write_text(html)

for name in ['wam-campaign.js','data.js','code3.js']:
    p = root / name
    if p.exists():
        p.write_text(p.read_text().replace('11.2.9','11.3.0'))

patched = (root / 'gameplay-1130.js').read_text()
assert "top','1004px'" in patched
assert "top','1015px'" in patched
assert "font-size','0'" in patched
assert 'wam1130-label' in patched
assert 'gameplay-1130.js' in index.read_text()
print('Applied Alpha 11.3.0: raised reference-matched booster bar with clean under-icon labels.')
