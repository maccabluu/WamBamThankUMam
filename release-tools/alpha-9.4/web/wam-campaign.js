(function (root, factory) {
  const campaign = factory();
  if (typeof module === 'object' && module.exports) module.exports = campaign;
  else root.WamCampaign = campaign;
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';
  const VERSION = '9.4.0';
  const PIECES = {
    heart: {label: 'Purple heart', image: 'tile_heart_new.png'},
    star: {label: 'Gold star', image: 'tile_star_new.png'},
    diamond: {label: 'Diamond', image: 'tile_diamond_new.png'},
    cherries: {label: 'Cherries', image: 'tile_cherries_new.png'},
    bam: {label: 'BAM burst', image: 'tile_bam_new.png'},
    disco: {label: 'Disco ball', image: 'tile_disco_new.png'},
    handbag: {label: 'Handbag', image: 'handbag_open.png'},
    lips: {label:'Red lips', image:'icons/lips.png', card:true},
    bow: {label:'Pink bow', image:'icons/bow.png', card:true},
    heel: {label:'Leopard heel', image:'icons/heel.png', card:true},
    mirror: {label:'Hand mirror', image:'icons/mirror.png', card:true},
    earrings: {label:'Gold earrings', image:'icons/earrings.png', card:true},
    microphone: {label:'Microphone', image:'icons/microphone.png', card:true},
    compact: {label:'Rose compact', image:'icons/compact.png', card:true},
    wine: {label:'Pink drink', image:'icons/wine.png', card:true},
    nails: {label:'Pink nails', image:'icons/nails.png', card:true},
    eyelashes: {label:'Eyelashes', image:'icons/eyelashes.png', card:true}
  };
  const bags5 = [[0,1],[0,4],[3,0],[3,5],[6,0],[6,5],[9,1],[9,4]];
  const levels = [
    {id:1, name:'Bam Lounge', moves:16, targets:{cherries:30,diamond:18,star:20}, bags:[], tip:'Swap neighbours to match 3. Match 4 for a line blast.'},
    {id:2, name:'Disco Diner', moves:18, targets:{heart:30,cherries:28,bam:22}, bags:[], tip:'Match 4 in a row, then match the striped icon to clear a line.'},
    {id:3, name:'Starlight Stage', moves:22, targets:{heart:28,bam:22,disco:3}, bags:[], tip:'A square or a line of 5 makes a Disco. Swap a Disco with a neighbour.'},
    {id:4, name:'Frozen Lounge', moves:22, targets:{diamond:32,star:28,heart:26}, bags:[], tip:'T and L matches make area blasts. Combine two specials for a bigger clear.'},
    {id:5, name:'Couture Vault', moves:26, targets:{handbag:8,heart:24,diamond:22}, bags:bags5, tip:'Match beside each handbag twice. Cleared bags open room for falling icons.'},
    {id:6, name:'Lipstick & Leopard', moves:26, targets:{lips:30,bow:26,heel:24}, palette:['lips','bow','heel','mirror','earrings'], bags:[], tip:'Collect red lips, pink bows and leopard heels. Match 4 to make a line blast.'},
    {id:7, name:'Spotlight Disco', moves:28, targets:{microphone:28,compact:26,disco:3}, palette:['microphone','compact','wine','bow','eyelashes'], bags:[], tip:'Collect microphones and rose compacts. Make and activate 3 Disco balls.'},
    {id:8, name:'Glamour Vault', moves:30, targets:{handbag:10,nails:28,earrings:26}, palette:['nails','earrings','eyelashes','heel','mirror'], bags:[[1,0],[1,5],[3,1],[3,4],[5,0],[5,5],[7,1],[7,4],[9,2],[9,3]], tip:'Clear ten handbags and collect pink nails and gold earrings. Match beside each bag twice.'},
    {id:9, name:'Bam Grand Finale', moves:32, targets:{lips:34,microphone:30,disco:4}, palette:['lips','microphone','compact','wine','bow'], bags:[], tip:'Collect lips and microphones, then activate 4 Discos. Combine specials for bigger clears.'}
  ].map(level => Object.freeze({background:'game_background_90.png', palette:['heart','star','diamond','cherries','bam'], ...level}));
  const TOTAL = levels.length;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, Number.isFinite(value) ? value : min));
  function level(id) { return levels[clamp(Math.floor(Number(id)),1,TOTAL)-1]; }
  function read(storage, key, fallback = 0) {
    try { const n = parseInt(storage.getItem(key),10); return Number.isFinite(n) ? n : fallback; }
    catch (_) { return fallback; }
  }
  function write(storage, key, value) { try { storage.setItem(key,String(value)); } catch (_) {} }
  function progress(storage) {
    const highest = clamp(read(storage,'wambam-completed-level',0),0,TOTAL);
    const unlocked = clamp(Math.max(read(storage,'wambam-unlocked-level',1),highest+1),1,TOTAL);
    const selected = clamp(read(storage,'wambam-selected-level',unlocked),1,unlocked);
    return {highest,unlocked,selected,stars:levels.map(l => clamp(read(storage,`wambam-stars-${l.id}`,0),0,3))};
  }
  function starRating(config, movesLeft) {
    const ratio = movesLeft/config.moves;
    return ratio >= .3 ? 3 : ratio >= .1 ? 2 : 1;
  }
  function complete(storage, config, movesLeft, score) {
    const old = progress(storage), stars = starRating(config,movesLeft);
    write(storage,`wambam-stars-${config.id}`,Math.max(stars,old.stars[config.id-1]));
    write(storage,`wambam-score-${config.id}`,Math.max(score,read(storage,`wambam-score-${config.id}`,0)));
    write(storage,'wambam-completed-level',Math.max(old.highest,config.id));
    write(storage,'wambam-unlocked-level',Math.max(old.unlocked,Math.min(TOTAL,config.id+1)));
    write(storage,'wambam-selected-level',Math.min(TOTAL,config.id+1));
    return stars;
  }
  return {VERSION,PIECES,levels,TOTAL,level,read,write,progress,starRating,complete};
});
