"""Replace level artwork in Alpha 11.0.2, retaining its runtime and gameplay."""
from pathlib import Path
import shutil
import sys

root = Path(sys.argv[1])
source = Path(__file__).parent

def replace(text, old, new, count=1):
    assert text.count(old) == count, f'Unexpected base: {old[:100]}'
    return text.replace(old, new)

p = root / 'wam-campaign.js'
s = p.read_text()
s = replace(s, "const VERSION = '11.0.2'", "const VERSION = '11.0.3'")
s = replace(s, "background:'game_background_90.png'", "background:'artwork/lounge-levels.jpg'")
s = replace(s, "background:id>=21&&id<=30?'artwork/disco-diner.jpg':'game_background_90.png'", "background:'artwork/lounge-levels.jpg'")
p.write_text(s)

p = root / 'wam-ui.js'
s = p.read_text()
s = replace(s, "if(this.config.id>=21&&this.config.id<=30)this.stage.classList.add('wam-diner');", "this.stage.classList.add('wam-lounge-art');")
s = replace(s, '(91+i*48)', '(78+i*48)')
s = replace(s, 'this.cellWidth=504/this.game.cols;this.cellHeight=746.88/this.game.rows;', 'this.cellWidth=456/this.game.cols;this.cellHeight=580/this.game.rows;')
s = replace(s, 'Math.min(504/this.game.cols,640/this.game.rows)', 'Math.min(456/this.game.cols,560/this.game.rows)')
s = replace(s, '(430+(620-height)/2)', '(370+(580-height)/2)')
s = replace(s, 'Math.min(1030,430+(620+height)/2+20)', 'Math.min(956,370+(580+height)/2+16)')
s = replace(s, '(35+i*149)', '(30+i*148)')
css = '''
    /* Coordinates match the supplied artwork in the existing 720 x 1280 stage. */
    .wam-lounge-art .wam-art{object-fit:fill}
    .wam-lounge-art .wam-grid{left:132px;top:370px;width:456px;height:580px}
    .wam-lounge-art .wam-board-title{left:134px;top:270px;width:452px;font-size:16px}
    .wam-lounge-art .wam-board-info{left:134px;top:328px;width:452px;font-size:18px}
    .wam-lounge-art .wam-shape-tip{left:138px;width:444px;font-size:17px}
    .wam-lounge-art .wam-moves{left:35px;top:63px;width:116px;height:65px}
    .wam-lounge-art .wam-target{left:556px;width:133px;height:44px}
    .wam-lounge-art .wam-booster{top:1055px;width:140px;height:167px}
    .wam-lounge-art .wam-booster span{right:4px;top:2px}
    .wam-lounge-art .wam-pause{left:622px;top:1110px;width:82px;height:126px}
'''
s = replace(s, '    @keyframes wamHint', css + '    @keyframes wamHint')
p.write_text(s)
for name in ['data.js', 'code3.js']:
    p = root / name
    s = p.read_text()
    assert '11.0.2' in s
    p.write_text(s.replace('11.0.2', '11.0.3'))
(root / 'artwork').mkdir(exist_ok=True)
shutil.copy2(source / 'artwork/lounge-levels.jpg', root / 'artwork/lounge-levels.jpg')
print('Applied Alpha 11.0.3 artwork to all campaign levels.')
