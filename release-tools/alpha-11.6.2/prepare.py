from pathlib import Path
import sys

root=Path(sys.argv[1])

campaign=root/'wam-campaign.js'
mapjs=root/'wam-map.js'
assert campaign.exists() and mapjs.exists()

# Fix test-level selection so choosing Level 195 actually opens Level 195.
s=campaign.read_text()
old="const selected = clamp(read(storage,'wambam-selected-level',unlocked),1,unlocked);"
new="const selected = clamp(read(storage,'wambam-selected-level',unlocked),1,TOTAL);"
assert old in s
s=s.replace(old,new,1)

# Keep future-level testing temporary. Completing a level beyond the real unlock
# must not advance normal progression, stars, score or rewards.
old_complete="""  function complete(storage, config, movesLeft, score) {
    const old = progress(storage), stars = starRating(config,movesLeft);
    write(storage,`wambam-stars-${config.id}`,Math.max(stars,old.stars[config.id-1]));
    write(storage,`wambam-score-${config.id}`,Math.max(score,read(storage,`wambam-score-${config.id}`,0)));
    write(storage,'wambam-completed-level',Math.max(old.highest,config.id));
    write(storage,'wambam-unlocked-level',Math.max(old.unlocked,Math.min(TOTAL,config.id+1)));
    write(storage,'wambam-selected-level',Math.min(TOTAL,config.id+1));
    return stars;
  }"""
new_complete="""  function complete(storage, config, movesLeft, score) {
    const old = progress(storage), stars = starRating(config,movesLeft);
    const testingAhead = config.id > old.unlocked;
    if(testingAhead) {
      write(storage,'wambam-selected-level',Math.min(TOTAL,config.id+1));
      return stars;
    }
    write(storage,`wambam-stars-${config.id}`,Math.max(stars,old.stars[config.id-1]));
    write(storage,`wambam-score-${config.id}`,Math.max(score,read(storage,`wambam-score-${config.id}`,0)));
    write(storage,'wambam-completed-level',Math.max(old.highest,config.id));
    write(storage,'wambam-unlocked-level',Math.max(old.unlocked,Math.min(TOTAL,config.id+1)));
    write(storage,'wambam-selected-level',Math.min(TOTAL,config.id+1));
    return stars;
  }"""
assert old_complete in s
s=s.replace(old_complete,new_complete,1)
campaign.write_text(s)

# Fix the map footer so it follows the selected test level instead of staying
# stuck on the player's real next level.
m=mapjs.read_text()

old="footer.append(button(`PLAY LEVEL ${this.progress.unlocked}`,()=>this.preview(this.progress.unlocked),'cyan'));this.stage.append(footer);"
new="this.playButton=button(`PLAY LEVEL ${this.selected}`,()=>this.preview(this.selected),'cyan');footer.append(this.playButton);this.stage.append(footer);"
assert old in m
m=m.replace(old,new,1)

old="const initial=this.selected;this.showArea(Math.floor((initial-1)/10));this.selected=initial;"
new="const initial=this.selected;this.showArea(Math.floor((initial-1)/10));this.selected=initial;this.syncPlayButton();"
assert old in m
m=m.replace(old,new,1)

old="this.scroller.scrollTop=1280;this.selected=area.from;"
new="this.scroller.scrollTop=1280;this.selected=area.from;this.syncPlayButton();"
assert old in m
m=m.replace(old,new,1)

old="const area=Math.floor((id-1)/10);if(this.area!==area)this.showArea(area);this.selected=id;const point=this.nodes[id];"
new="const area=Math.floor((id-1)/10);if(this.area!==area)this.showArea(area);this.selected=id;this.syncPlayButton();const point=this.nodes[id];"
assert old in m
m=m.replace(old,new,1)

old="if(this.disposed)return;U.audio();this.stage.querySelector('.wam-shade')?.remove();this.selected=id;"
new="if(this.disposed)return;U.audio();this.stage.querySelector('.wam-shade')?.remove();this.selected=id;this.syncPlayButton();"
assert old in m
m=m.replace(old,new,1)

anchor="    start(id){if(this.disposed)return;C.write(storage,'wambam-selected-level',id);this.navigate('Game');}"
insert="""    syncPlayButton(){if(this.playButton)this.playButton.textContent=`PLAY LEVEL ${this.selected}`;}
    start(id){if(this.disposed)return;C.write(storage,'wambam-selected-level',id);this.navigate('Game');}"""
assert anchor in m
m=m.replace(anchor,insert,1)

mapjs.write_text(m)
print('Applied 11.6.2 testing selection fixes: selected level launches correctly, footer follows selection, future test completions do not alter real progression.')
