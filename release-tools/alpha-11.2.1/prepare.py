from pathlib import Path
import shutil
import sys

root = Path(sys.argv[1])
tools = Path(__file__).resolve().parent
index = root / 'index.html'

if not index.exists():
    raise SystemExit('Production index.html missing')
if not (root / 'gameplay-112.js').exists():
    raise SystemExit('11.2.0 gameplay layer missing from production base')
if not (root / 'wam-campaign.js').exists():
    raise SystemExit('Production campaign missing')

shutil.copyfile(tools / 'gameplay-1121.js', root / 'gameplay-1121.js')
html = index.read_text()
if 'gameplay-1121.js' in html:
    raise SystemExit('11.2.1 gameplay polish already injected')
needle = '<script src="gameplay-112.js"></script>'
if needle not in html:
    raise SystemExit('11.2.0 gameplay script hook missing')
html = html.replace(needle, needle + '\n  <script src="gameplay-1121.js"></script>', 1)
index.write_text(html)

for name in ['data.js', 'code3.js']:
    p = root / name
    if p.exists():
        p.write_text(p.read_text().replace('11.2.0', '11.2.1'))

print('Applied Wam Bam 11.2.1 larger Level 1 board and clearer booster tray.')
