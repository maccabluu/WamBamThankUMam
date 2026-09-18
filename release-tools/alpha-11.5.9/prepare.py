from pathlib import Path
import sys

root=Path(sys.argv[1])
src=Path(__file__).resolve().parent/'transition-1159.js'
assert src.exists()

index=root/'index.html'
text=index.read_text()
assert 'counter-optical-1158.js' in text

if 'transition-1159.js' not in text:
    text=text.replace('</body>','  <script src="transition-1159.js"></script>\n</body>',1)
    index.write_text(text)

(root/'transition-1159.js').write_text(src.read_text())

print('Applied level transition hold-cover patch to prevent blank/white frames before gameplay.')
