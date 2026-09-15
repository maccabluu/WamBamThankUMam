from pathlib import Path
import shutil
import sys

root = Path(sys.argv[1])
tools = Path(__file__).resolve().parent

src = tools / 'heel-smash-1127.svg'
assert src.exists(), 'heel-smash-1127.svg missing'
dst = root / 'icons' / 'heel-smash-1126.svg'
dst.parent.mkdir(parents=True, exist_ok=True)
shutil.copyfile(src, dst)

for name in ['wam-campaign.js', 'data.js', 'code3.js']:
    p = root / name
    if p.exists():
        p.write_text(p.read_text().replace('11.2.6', '11.2.7'))

assert '<svg' in dst.read_text()
print('Applied Alpha 11.2.7: rebuilt Heel Smash as a true leopard-print stiletto.')
