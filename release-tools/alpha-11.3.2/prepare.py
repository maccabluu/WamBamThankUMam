from pathlib import Path
import shutil
import sys


root = Path(sys.argv[1])
tools = Path(__file__).resolve().parent

script = tools / 'gameplay-1132.js'
artwork = tools / 'booster-bar-reference-1132.png'
assert script.is_file(), 'gameplay-1132.js missing'
assert artwork.is_file(), 'booster-bar-reference-1132.png missing'

shutil.copyfile(script, root / script.name)
art_dir = root / 'artwork'
art_dir.mkdir(parents=True, exist_ok=True)
shutil.copyfile(artwork, art_dir / artwork.name)

index = root / 'index.html'
html = index.read_text()
assert 'gameplay-1131.js' in html, 'real 11.3.1 production base missing'
assert 'gameplay-1132.js' not in html, '11.3.2 already injected'
html = html.replace('</body>', '  <script src="gameplay-1132.js"></script>\n</body>', 1)
index.write_text(html)

for name in ['wam-campaign.js', 'data.js', 'code3.js']:
    path = root / name
    if path.exists():
        path.write_text(path.read_text().replace('11.3.1', '11.3.2'))

patched = (root / script.name).read_text()
assert "BAR_PATH='artwork/booster-bar-reference-1132.png'" in patched
assert "new URL(BAR_PATH,document.baseURI).href" in patched
assert "top','994px'" in patched
assert "width','690px'" in patched
assert "height','171px'" in patched
assert "opacity','0'" in patched
print('Applied Alpha 11.3.2 valid PNG booster asset fix over the real 11.3.1 production base.')
