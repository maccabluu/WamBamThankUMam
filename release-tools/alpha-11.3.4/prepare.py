from pathlib import Path
import shutil
import sys

root = Path(sys.argv[1])
tools = Path(__file__).resolve().parent

src = tools / 'gameplay-1134.js'
assert src.exists(), 'gameplay-1134.js missing'
assert (root / 'gameplay-1133.js').exists(), '11.3.3 production base missing gameplay-1133.js'
assert (root / 'gameplay-1132.js').exists(), '11.3.2 booster fix missing gameplay-1132.js'
assert (root / 'artwork' / 'booster-bar-reference-1132.png').exists(), 'fixed booster artwork missing'
assert (root / 'wam-campaign.js').exists(), 'campaign missing'

# Deliberately UI-only. Never modify campaign definitions.
shutil.copyfile(src, root / 'gameplay-1134.js')

index = root / 'index.html'
html = index.read_text()
assert 'gameplay-1133.js' in html, '11.3.3 script hook missing'
assert 'gameplay-1134.js' not in html, '11.3.4 already injected'
html = html.replace('</body>', '  <script src="gameplay-1134.js"></script>\n</body>', 1)
index.write_text(html)

for name in ['data.js', 'code3.js']:
    p = root / name
    if p.exists():
        p.write_text(p.read_text().replace('11.3.3', '11.3.4'))

patched = (root / 'gameplay-1134.js').read_text()
assert 'const MIN_LEVEL=2;' in patched
assert 'const MAX_LEVEL=9;' in patched
assert 'ensureCounts' in patched
assert 'fitGoals' in patched
assert 'enlargeExistingBoard' in patched
assert 'removeStrays' in patched
assert 'gameplay-1134.js' in index.read_text()

print('Applied Alpha 11.3.4: Levels 2-9 bigger existing boards, live booster counts, fitted goals and stray overlay removal.')
