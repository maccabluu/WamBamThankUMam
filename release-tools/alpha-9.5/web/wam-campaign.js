(function (root, factory) {
  const campaign = factory();
  if (typeof module === 'object' && module.exports) module.exports = campaign;
  else root.WamCampaign = campaign;
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';
  const VERSION = '9.5.0';
  const PIECES = {
    ice: {label:'Ice tiles', image:'obstacles/ice.svg'},
    crate: {label:'Gift boxes', image:'obstacles/crate.svg'},
    flyer: {label:'Flying kiss', image:'icons/lips.png', card:true},
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
    {id:1, name:'Bam Lounge', moves:24, targets:{cherries:22,diamond:16,star:18}, bags:[], tip:'Swap neighbours to match 3. Match 4 for a line blast.'},
    {id:2, name:'Disco Diner', moves:25, targets:{heart:30,cherries:28,bam:22}, bags:[], tip:'Match 4 in a row, then match the striped icon to clear a line.'},
    {id:3, name:'Starlight Stage', moves:22, targets:{heart:28,bam:22,disco:3}, bags:[], tip:'A square or a line of 5 makes a Disco. Swap a Disco with a neighbour.'},
    {id:4, name:'Frozen Lounge', moves:22, targets:{diamond:32,star:28,heart:26}, bags:[], tip:'T and L matches make area blasts. Combine two specials for a bigger clear.'},
    {id:5, name:'Couture Vault', moves:26, targets:{handbag:8,heart:24,diamond:22}, bags:bags5, tip:'Match beside each handbag twice. Cleared bags open room for falling icons.'},
    {id:6, name:'Lipstick & Leopard', moves:26, targets:{lips:30,bow:26,heel:24}, palette:['lips','bow','heel','mirror','earrings'], bags:[], tip:'Collect red lips, pink bows and leopard heels. Match 4 to make a line blast.'},
    {id:7, name:'Spotlight Disco', moves:28, targets:{microphone:28,compact:26,disco:3}, palette:['microphone','compact','wine','bow','eyelashes'], bags:[], tip:'Collect microphones and rose compacts. Make and activate 3 Disco balls.'},
    {id:8, name:'Glamour Vault', moves:30, targets:{handbag:10,nails:28,earrings:26}, palette:['nails','earrings','eyelashes','heel','mirror'], bags:[[1,0],[1,5],[3,1],[3,4],[5,0],[5,5],[7,1],[7,4],[9,2],[9,3]], tip:'Clear ten handbags and collect pink nails and gold earrings. Match beside each bag twice.'},
    {id:9, name:'Bam Grand Finale', moves:32, targets:{lips:34,microphone:30,disco:4}, palette:['lips','microphone','compact','wine','bow'], bags:[], tip:'Collect lips and microphones, then activate 4 Discos. Combine specials for bigger clears.'}
  ].map(level => Object.freeze({area:0, difficulty:'Normal', background:'game_background_90.png', palette:['heart','star','diamond','cherries','bam'], ...level}));

  const SHAPES = {
    arch:['..####..','.######.','########','########','########','########','.######.','..####..'],
    steps:['####....','#####...','######..','#######.','.#######','..######','...#####','....####'],
    hourglass:['########','########','.######.','..####..','..####..','.######.','########','########'],
    window:['########','########','###..###','###..###','###..###','###..###','########','########'],
    wings:['###..###','###..###','########','########','########','########','###..###','###..###'],
    bridge:['###..###','###..###','###..###','########','########','###..###','###..###','###..###'],
    diamond:['...##...','..####..','.######.','########','########','.######.','..####..','...##...'],
    stage:['.######.','.######.','########','########','########','########','########','..####..'],
    split:['###.###','###.###','###.###','###.###','###.###','###.###','###.###','###.###','###.###']
  };
  const PALETTES = [
    ['lips','bow','heel','mirror','earrings'],
    ['microphone','compact','wine','bow','eyelashes'],
    ['nails','earrings','eyelashes','heel','mirror'],
    ['heart','star','diamond','cherries','bam']
  ];
  // Each entry is an authored layout/goal pairing. No random endless-level filler.
  const designs = [
    ['Kiss & Tell','arch',0,'ice',10,27],
    ['Neon Steps','steps',0,'crate',8,28],
    ['Pink Ice Party','hourglass',0,'ice',16,30],
    ['Window Shopping','window',2,'handbag',8,31],
    ['Double Trouble','split',0,'crate',12,31],
    ['Velvet Wings','wings',0,'ice',20,30],
    ['Mirror Mirror','stage',2,'crate',16,33],
    ['Heart of Glass','diamond',3,'ice',12,29],
    ['Gift Wrap','arch',0,'crate',18,32],
    ['Lounge After Dark','bridge',0,'handbag',10,34],
    ['Lipstick Lounge Finale','hourglass',0,'mixed',18,37],
    ['Sound Check','stage',1,'ice',14,29],
    ['Step to the Beat','steps',1,'crate',14,31],
    ['Disco Windows','window',1,'ice',22,33],
    ['Across the Floor','bridge',1,'handbag',10,34],
    ['The Double Act','split',1,'crate',16,34],
    ['Spotlight Sparkle','diamond',1,'ice',18,33],
    ['Backstage Gifts','wings',1,'crate',20,35],
    ['Encore Encore','hourglass',1,'handbag',12,35],
    ['Midnight Music','arch',1,'mixed',20,37],
    ['Disco Diner Finale','stage',1,'mixed',24,40],
    ['The Dressing Room','arch',2,'ice',18,31],
    ['Couture Stairs','steps',2,'crate',16,33],
    ['Behind the Mirror','window',2,'handbag',12,36],
    ['Two Sides of Glam','split',2,'ice',24,35],
    ['Diamond Dressing','diamond',2,'crate',12,34],
    ['Velvet Vault','wings',2,'mixed',20,37],
    ['Golden Hour','hourglass',2,'ice',24,36],
    ['Catwalk Crossing','bridge',2,'crate',18,37],
    ['Bam Before the Storm','arch',2,'mixed',24,39],
    ['The Grand Wam Bam','stage',2,'mixed',28,42]
  ];
  function obstacleCells(mask, count, offset) {
    const cols=mask[0].length, options=[];
    mask.forEach((row,r)=>[...row].forEach((cell,c)=>{
      // Keep the central lanes open. Blockers always have an approach cell.
      if(cell==='#' && c!==Math.floor(cols/2) && c!==Math.floor(cols/2)-1)options.push([r,c]);
    }));
    const ranked=options.map(([r,c])=>({cell:[r,c],rank:((r*43+c*29+offset*17)%101)})).sort((a,b)=>a.rank-b.rank);
    return ranked.slice(0,count).map(x=>x.cell);
  }
  designs.forEach(([name,shape,paletteId,kind,count,moves],index)=>{
    const id=index+10,mask=SHAPES[shape],palette=PALETTES[paletteId];
    const positions=obstacleCells(mask,count,id);
    const bags=kind==='handbag'?positions:[];
    const crates=kind==='crate'?positions.map(([r,c])=>[r,c,id>=26?2:1]):[];
    const ice=kind==='ice'?positions.map(([r,c])=>[r,c,id>=21?2:1]):[];
    if(kind==='mixed')positions.forEach(([r,c],n)=>{if(n%3===0)bags.push([r,c]);else if(n%3===1)crates.push([r,c,2]);else ice.push([r,c,2]);});
    const targets=kind==='mixed'?{handbag:bags.length,crate:crates.length,ice:ice.length}:
      {[kind]:positions.length,[palette[0]]:id<20?24:28,[palette[1]]:id<20?20:24};
    const tip=(kind==='ice'?'Clear icons on each ice tile. Double ice needs two clears.':kind==='crate'?'Match beside gift boxes or hit them with a special. Ribboned boxes need two hits.':kind==='handbag'?'Match beside each handbag twice to open more board space.':'Clear handbags, ribboned gift boxes and ice. Aim combined specials at the obstacles.')+
      ' A square of four makes a Flying Kiss, which seeks a target. Five in a line makes a Disco.';
    levels.push(Object.freeze({id,name,moves,mask,shape,area:Math.min(3,Math.floor((id-1)/10)),difficulty:id%10===0?'Finale':id%5===0?'Hard':'Normal',squareSpecial:'flyer',targets,palette,bags,crates,ice,tip,background:'game_background_90.png'}));
  });
  const AREAS=[
    {name:'The Bam Lounge',from:1,to:10,colour:'#e62681',items:['Neon sign','Velvet seating','Jukebox','Dance floor']},
    {name:'Lipstick Lounge',from:11,to:20,colour:'#d043aa',items:['Vanity mirror','Lip display','Rose lights','Photo corner']},
    {name:'Disco Diner',from:21,to:30,colour:'#149da6',items:['Record wall','Diner booths','Disco ball','Spotlight stage']},
    {name:'Couture Club',from:31,to:40,colour:'#815ed1',items:['Gold doorway','Couture rail','Diamond display','Finale lights']}
  ];
  const DECOR_COSTS=[2,3,2,3];
  function renovation(storage) {
    const p=progress(storage),earned=Math.max(p.highest,p.unlocked-1);
    const decorated=AREAS.map((area,a)=>area.items.map((_,i)=>read(storage,`wambam-decor-${a}-${i}`,0)===1));
    const spent=decorated.reduce((sum,items)=>sum+items.reduce((n,done,i)=>n+(done?DECOR_COSTS[i]:0),0),0);
    return {earned,available:Math.max(0,earned-spent),decorated};
  }
  function decorate(storage,area,item) {
    if(!AREAS[area]||!Number.isInteger(item)||item<0||item>=4)return false;
    const current=renovation(storage);
    if(current.decorated[area][item]||current.earned<AREAS[area].from-1||current.available<DECOR_COSTS[item])return false;
    write(storage,`wambam-decor-${area}-${item}`,1);
    return read(storage,`wambam-decor-${area}-${item}`,0)===1;
  }

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
  return {VERSION,PIECES,levels,TOTAL,AREAS,DECOR_COSTS,renovation,decorate,level,read,write,progress,starRating,complete};
});
