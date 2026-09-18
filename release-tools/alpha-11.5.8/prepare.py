from pathlib import Path
import sys

root=Path(sys.argv[1])
src=Path(__file__).resolve().parent/'counter-optical-1158.js'
assert src.exists()
index=root/'index.html'
text=index.read_text()
assert 'counter-align-1157.js' in text
if 'counter-optical-1158.js' not in text:
    text=text.replace('</body>','  <script src="counter-optical-1158.js"></script>\n</body>',1)
    index.write_text(text)
(root/'counter-optical-1158.js').write_text(src.read_text())
print('Applied Levels 11-100 booster number optical alignment patch.')
