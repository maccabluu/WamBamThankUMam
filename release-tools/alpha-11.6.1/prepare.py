from pathlib import Path
import sys

root=Path(sys.argv[1])
mapjs=root/'wam-map.js'
assert mapjs.exists()

s=mapjs.read_text()

replacements=[
  ("const {x,y}=points[i],locked=config.id>this.progress.unlocked,completed=config.id<this.progress.unlocked||config.id<=this.progress.highest;",
   "const {x,y}=points[i],locked=false,completed=config.id<this.progress.unlocked||config.id<=this.progress.highest;"),
  ("const config=C.level(id),locked=id>this.progress.unlocked,stars=this.progress.stars[id-1],modal=dialog(this.stage,config.name);",
   "const config=C.level(id),locked=false,stars=this.progress.stars[id-1],modal=dialog(this.stage,config.name);"),
  ("C.levels.forEach(config=>{const locked=config.id>this.progress.unlocked,b=button(String(config.id),()=>{modal.close();this.focus(config.id);this.preview(config.id);},locked?'secondary':'');",
   "C.levels.forEach(config=>{const locked=false,b=button(String(config.id),()=>{modal.close();this.focus(config.id);this.preview(config.id);},locked?'secondary':'');"),
  ("start(id){if(id>this.progress.unlocked||this.disposed)return;C.write(storage,'wambam-selected-level',id);this.navigate('Game');}",
   "start(id){if(this.disposed)return;C.write(storage,'wambam-selected-level',id);this.navigate('Game');}")
]

for old,new in replacements:
    assert old in s, old
    s=s.replace(old,new,1)

mapjs.write_text(s)
print('Applied temporary testing unlock for all campaign levels. Progress data is not changed.')
