from pathlib import Path
import shutil
import sys

root = Path(sys.argv[1])
tools = Path(__file__).resolve().parent

js = tools / 'gameplay-1131.js'
art = tools / 'booster-bar-reference.jpg'
assert js.exists(), 'gameplay-1131.js missing'
assert art.exists(), 'booster-bar-reference.jpg missing'

shutil.copyfile(js, root / 'gameplay-1131.js')
art_dir = root / 'artwork'
art_dir.mkdir(parents=True, exist_ok=True)
shutil.copyfile(art, art_dir / 'booster-bar-reference-1131.jpg')

index = root / 'index.html'
html = index.read_text()
assert 'gameplay-1130.js' in html, '11.3.0 production base missing'
assert 'gameplay-1131.js' not in html, '11.3.1 already injected'
html = html.replace('</body>', '  <script src="gameplay-1131.js"></script>\n</body>', 1)
index.write_text(html)

for name in ['wam-campaign.js','data.js','code3.js']:
    p = root / name
    if p.exists():
        p.write_text(p.read_text().replace('11.3.0','11.3.1'))

patched = (root / 'gameplay-1131.js').read_text()
assert "BAR_SRC='artwork/booster-bar-reference-1131.jpg'" in patched
assert "top','994px'" in patched
assert "opacity','0'" in patched
assert (art_dir / 'booster-bar-reference-1131.jpg').stat().st_size > 100000
print('Applied Alpha 11.3.1: exact supplied booster-bar artwork with numbers removed and invisible live hit areas.')
