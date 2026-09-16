from pathlib import Path
import shutil
import sys

root = Path(sys.argv[1])
tools = Path(__file__).resolve().parent

src = tools / 'gameplay-1133.js'
assert src.exists(), 'gameplay-1133.js missing'
assert (root / 'gameplay-1132.js').exists(), '11.3.2 production base missing gameplay-1132.js'
assert (root / 'artwork' / 'wambam-level1-bg.jpg').exists(), 'Level 1 Bam Lounge background missing'
assert (root / 'artwork' / 'booster-bar-reference-1132.png').exists(), 'Fixed 11.3.2 booster bar missing'

# This update is deliberately UI-only. Never touch wam-campaign.js here.
shutil.copyfile(src, root / 'gameplay-1133.js')

index = root / 'index.html'
html = index.read_text()
assert 'gameplay-1132.js' in html, '11.3.2 script hook missing'
assert 'gameplay-1133.js' not in html, '11.3.3 already injected'
html = html.replace('</body>', '  <script src="gameplay-1133.js"></script>\n</body>', 1)
index.write_text(html)

# Keep non-gameplay visible/internal labels current without changing campaign data.
for name in ['data.js', 'code3.js']:
    p = root / name
    if p.exists():
        p.write_text(p.read_text().replace('11.3.2', '11.3.3'))

patched = (root / 'gameplay-1133.js').read_text()
assert 'const MIN_LEVEL=2;' in patched
assert 'const MAX_LEVEL=9;' in patched
assert "BG_PATH='artwork/wambam-level1-bg.jpg'" in patched
assert "BAR_PATH='artwork/booster-bar-reference-1132.png'" in patched
assert 'alignTitleToExistingBoard' in patched
assert 'view.board.style.width' not in patched
assert 'view.board.style.height' not in patched
assert 'gameplay-1133.js' in index.read_text()

print('Applied Alpha 11.3.3: Level 1 presentation for Levels 2-9 while preserving campaign/board definitions exactly.')
