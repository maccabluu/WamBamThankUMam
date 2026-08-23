(()=>{
'use strict';

const W=11;
const H=11;
const TYPES=['heart','lipstick','cherries','diamond','star','heel'];
const TARGET_START={cherries:30,diamond:18,star:20};
const BOOSTERS=['rocket','hammer','disco','swap'];
const BOOSTER_LABELS={rocket:'LIP LASER',hammer:'HEEL SMASH',disco:'DISCO BALL',swap:'SWAP'};

let board=[];
let moves=16;
let targets={...TARGET_START};
let coins=Number(localStorage.getItem('wb_coins')||12450);
let lives=Number(localStorage.getItem('wb_lives')||5);
let boosterCounts=JSON.parse(localStorage.getItem('wb_boosters')||'{"rocket":3,"hammer":3,"disco":3,"swap":3}');
let boosterMode=null;
let swapFirst=null;
let selected=null;
let pointerStart=null;
let locked=false;
let tileEls=[];
let soundOn=localStorage.getItem('wb_sound')!=='0';
let vibrationOn=localStorage.getItem('wb_vibrate')!=='0';

const home=document.getElementById('homeScreen');
const game=document.getElementById('gameScreen');
const boardEl=document.getElementById('board');
const modal=document.getElementById('modal');
const toast=document.getElementById('toast');
const $=id=>document.getElementById(id);
const idx=(x,y)=>y*W+x;
const inside=(x,y)=>x>=0&&x<W&&y>=0&&y<H;
const rand=n=>Math.floor(Math.random()*n);
const kindAt=(x,y)=>board[idx(x,y)];

function setText(id,value){const el=$(id);if(el)el.textContent=value;}
function persist(){
  localStorage.setItem('wb_coins',coins);
  localStorage.setItem('wb_lives',lives);
  localStorage.setItem('wb_boosters',JSON.stringify(boosterCounts));
}

function feedback(freq=430,ms=16){
  if(vibrationOn&&navigator.vibrate)navigator.vibrate(ms);
  if(!soundOn)return;
  try{
    const Ctx=window.AudioContext||window.webkitAudioContext;
    if(!Ctx)return;
    const c=feedback.ctx||(feedback.ctx=new Ctx());
    if(c.state==='suspended')c.resume();
    const o=c.createOscillator();
    const g=c.createGain();
    o.frequency.value=freq;
    g.gain.setValueAtTime(.03,c.currentTime);
    g.gain.exponentialRampToValueAtTime(.001,c.currentTime+.04);
    o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.045);
  }catch(_){ }
}

function svg(kind){
  if(kind==='heart')return `<svg class="piece" viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="h" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ff7596"/><stop offset=".45" stop-color="#f2164f"/><stop offset="1" stop-color="#9d0028"/></linearGradient></defs><path d="M50 88C39 74 12 61 12 35C12 17 35 10 50 29C65 10 88 17 88 35C88 61 61 74 50 88Z" fill="url(#h)" stroke="#7b001e" stroke-width="5"/><path d="M26 29C30 21 39 20 44 27" fill="none" stroke="#ffb9c9" stroke-width="5" stroke-linecap="round"/></svg>`;
  if(kind==='lipstick')return `<svg class="piece" viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="l" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ff6ca6"/><stop offset="1" stop-color="#e60055"/></linearGradient><linearGradient id="g" x1="0" x2="1"><stop stop-color="#fff09a"/><stop offset=".5" stop-color="#d98b08"/><stop offset="1" stop-color="#ffe36e"/></linearGradient></defs><g transform="rotate(8 50 50)"><rect x="33" y="45" width="34" height="38" rx="4" fill="#111" stroke="#444" stroke-width="3"/><rect x="36" y="38" width="28" height="18" fill="url(#g)" stroke="#9c5d04" stroke-width="3"/><path d="M39 41V21Q39 12 47 10L62 16V41Z" fill="url(#l)" stroke="#9d0036" stroke-width="3"/><path d="M44 18Q51 14 57 17" stroke="#ffb9d2" stroke-width="4" fill="none" stroke-linecap="round"/></g></svg>`;
  if(kind==='cherries')return `<svg class="piece" viewBox="0 0 100 100" aria-hidden="true"><path d="M48 47Q45 25 30 18M55 45Q62 23 71 18Q58 14 49 20" fill="none" stroke="#31942d" stroke-width="7" stroke-linecap="round"/><circle cx="34" cy="63" r="19" fill="#ed163f" stroke="#8c001b" stroke-width="4"/><circle cx="67" cy="62" r="19" fill="#f51a43" stroke="#8c001b" stroke-width="4"/><circle cx="27" cy="55" r="5" fill="#ff9cad"/><circle cx="60" cy="54" r="5" fill="#ff9cad"/><path d="M61 19Q75 10 84 21Q71 29 61 19" fill="#55b43c" stroke="#257b22" stroke-width="3"/></svg>`;
  if(kind==='diamond')return `<svg class="piece" viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="d" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#bafaff"/><stop offset=".45" stop-color="#1adcf1"/><stop offset="1" stop-color="#0091c4"/></linearGradient></defs><path d="M18 34L33 15H68L83 34L50 87Z" fill="url(#d)" stroke="#08728f" stroke-width="4"/><path d="M18 34H83M33 15L42 34L50 87M68 15L58 34L50 87" fill="none" stroke="#e8ffff" stroke-width="3" opacity=".8"/></svg>`;
  if(kind==='star')return `<svg class="piece" viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="s" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff176"/><stop offset=".5" stop-color="#ffc21a"/><stop offset="1" stop-color="#f28a05"/></linearGradient></defs><path d="M50 8L61 35L91 37L68 56L76 86L50 69L24 86L32 56L9 37L39 35Z" fill="url(#s)" stroke="#a85c02" stroke-width="4"/><path d="M50 17L57 38" stroke="#fff8b8" stroke-width="5" stroke-linecap="round"/></svg>`;
  return `<svg class="piece" viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="sh" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ff5d4e"/><stop offset="1" stop-color="#c51021"/></linearGradient></defs><path d="M24 22Q41 40 47 56Q56 69 80 68L85 79Q63 88 38 79Q25 73 21 62Q17 48 24 22Z" fill="url(#sh)" stroke="#8f101a" stroke-width="4"/><path d="M24 22Q34 35 38 48" fill="none" stroke="#ffaaa1" stroke-width="5"/><path d="M70 68L78 87" stroke="#8f101a" stroke-width="8" stroke-linecap="round"/></svg>`;
}

function updateHUD(){
  setText('movesValue',moves);
  setText('targetCherries',Math.max(0,targets.cherries));
  setText('targetDiamond',Math.max(0,targets.diamond));
  setText('targetStar',Math.max(0,targets.star));
  setText('homeCoins',coins.toLocaleString());
  setText('homeLives',lives);
  for(const b of BOOSTERS){
    const n=boosterCounts[b]||0;
    setText(b+'Count',n);
    const el=document.querySelector(`[data-booster="${b}"]`);
    if(!el)continue;
    el.classList.toggle('disabled',n<=0);
    el.classList.toggle('active',boosterMode===b);
  }
}

function generateBoard(){
  for(let attempt=0;attempt<80;attempt++){
    board=Array(W*H).fill(0);
    for(let y=0;y<H;y++){
      for(let x=0;x<W;x++){
        let opts=[0,1,2,3,4,5];
        if(x>=2&&board[idx(x-1,y)]===board[idx(x-2,y)])opts=opts.filter(v=>v!==board[idx(x-1,y)]);
        if(y>=2&&board[idx(x,y-1)]===board[idx(x,y-2)])opts=opts.filter(v=>v!==board[idx(x,y-1)]);
        board[idx(x,y)]=opts[rand(opts.length)];
      }
    }
    if(findMove())return;
  }
  shuffleInternal(false);
}

function ensureTiles(){
  if(tileEls.length===W*H)return;
  tileEls=[];
  const frag=document.createDocumentFragment();
  for(let y=0;y<H;y++){
    for(let x=0;x<W;x++){
      const el=document.createElement('div');
      el.className='tile';
      el.dataset.x=x;
      el.dataset.y=y;
      el.dataset.kind='';
      frag.appendChild(el);
      tileEls.push(el);
    }
  }
  boardEl.replaceChildren(frag);
}

function renderBoard(){
  ensureTiles();
  for(let i=0;i<board.length;i++){
    const el=tileEls[i];
    const value=board[i];
    const k=TYPES[value]||TYPES[0];
    const x=i%W;
    const y=Math.floor(i/W);
    const isSelected=selected&&selected[0]===x&&selected[1]===y;
    el.className=`tile kind-${k}${isSelected?' selected':''}`;
    if(el.dataset.kind!==k){
      el.dataset.kind=k;
      el.innerHTML=svg(k);
    }
  }
  updateHUD();
}

function boardTileFromEvent(e){
  const target=e.target instanceof Element?e.target.closest('.tile'):null;
  return target&&boardEl.contains(target)?target:null;
}

function onBoardDown(e){
  if(locked)return;
  const el=boardTileFromEvent(e);
  if(!el)return;
  e.preventDefault();
  pointerStart={x:e.clientX,y:e.clientY,gx:+el.dataset.x,gy:+el.dataset.y,id:e.pointerId};
  try{boardEl.setPointerCapture(e.pointerId);}catch(_){ }
}

async function onBoardUp(e){
  if(locked||!pointerStart)return;
  e.preventDefault();
  const start=pointerStart;
  pointerStart=null;
  try{boardEl.releasePointerCapture(e.pointerId);}catch(_){ }
  const {gx,gy}=start;

  if(boosterMode&&boosterMode!=='swap'){
    await useTargetedBooster(boosterMode,gx,gy);
    return;
  }

  if(boosterMode==='swap'){
    if(!swapFirst){
      swapFirst=[gx,gy];
      selected=[gx,gy];
      renderBoard();
      showToast('PICK NEXT TILE');
      return;
    }
    const [sx,sy]=swapFirst;
    swapFirst=null;
    selected=null;
    if(Math.abs(sx-gx)+Math.abs(sy-gy)!==1){
      showToast('PICK A NEIGHBOUR');
      renderBoard();
      return;
    }
    consumeBooster('swap');
    swapCells(idx(sx,sy),idx(gx,gy));
    renderBoard();
    await sleep(90);
    let m=findMatches();
    if(m.length)await resolveMatches(m);
    boosterMode=null;
    renderBoard();
    checkEnd();
    return;
  }

  const dx=e.clientX-start.x;
  const dy=e.clientY-start.y;
  const mag=Math.hypot(dx,dy);
  const cellWidth=Math.max(1,boardEl.clientWidth/W);
  const threshold=Math.max(12,cellWidth*.28);
  if(mag<threshold){
    handleTap(gx,gy);
    return;
  }
  const dir=Math.abs(dx)>Math.abs(dy)?[dx>0?1:-1,0]:[0,dy>0?1:-1];
  await trySwap(gx,gy,gx+dir[0],gy+dir[1]);
}

function handleTap(x,y){
  if(!selected){selected=[x,y];renderBoard();return;}
  const [sx,sy]=selected;
  if(Math.abs(sx-x)+Math.abs(sy-y)===1){selected=null;trySwap(sx,sy,x,y);}
  else{selected=[x,y];renderBoard();}
}

function swapCells(a,b){const t=board[a];board[a]=board[b];board[b]=t;}

function findMatches(){
  const set=new Set();
  for(let y=0;y<H;y++){
    let s=0;
    while(s<W){
      let e=s+1;
      while(e<W&&board[idx(e,y)]===board[idx(s,y)])e++;
      if(e-s>=3)for(let x=s;x<e;x++)set.add(idx(x,y));
      s=e;
    }
  }
  for(let x=0;x<W;x++){
    let s=0;
    while(s<H){
      let e=s+1;
      while(e<H&&board[idx(x,e)]===board[idx(x,s)])e++;
      if(e-s>=3)for(let y=s;y<e;y++)set.add(idx(x,y));
      s=e;
    }
  }
  return [...set];
}

async function trySwap(x1,y1,x2,y2){
  if(locked||!inside(x2,y2))return;
  locked=true;
  const a=idx(x1,y1),b=idx(x2,y2);
  swapCells(a,b);
  renderBoard();
  await sleep(90);
  let m=findMatches();
  if(!m.length){
    swapCells(a,b);
    renderBoard();
    showToast('NO MATCH');
    locked=false;
    return;
  }
  moves--;
  feedback(500,18);
  await resolveMatches(m);
  locked=false;
  checkEnd();
}

function countTargets(indices){
  for(const i of indices){
    const k=TYPES[board[i]];
    if(k==='cherries'&&targets.cherries>0)targets.cherries--;
    if(k==='diamond'&&targets.diamond>0)targets.diamond--;
    if(k==='star'&&targets.star>0)targets.star--;
  }
}

async function resolveMatches(matches){
  while(matches.length){
    countTargets(matches);
    for(const i of matches)tileEls[i]?.classList.add('clearing');
    if(matches.length>=5)flash('BAM!');
    else if(matches.length>=4)flash('WAM!');
    else showToast('NICE!');
    updateHUD();
    await sleep(120);
    for(const i of matches)board[i]=-1;
    collapse();
    renderBoard();
    await sleep(85);
    matches=findMatches();
  }
  if(!findMove())shuffleInternal();
}

function collapse(){
  for(let x=0;x<W;x++){
    const vals=[];
    for(let y=H-1;y>=0;y--){
      const v=board[idx(x,y)];
      if(v>=0)vals.push(v);
    }
    while(vals.length<H)vals.push(rand(TYPES.length));
    for(let y=H-1,n=0;y>=0;y--,n++)board[idx(x,y)]=vals[n];
  }
}

function findMove(){
  for(let y=0;y<H;y++){
    for(let x=0;x<W;x++){
      for(const[dX,dY]of[[1,0],[0,1]]){
        const nx=x+dX,ny=y+dY;
        if(!inside(nx,ny))continue;
        const a=idx(x,y),b=idx(nx,ny);
        swapCells(a,b);
        const ok=findMatches().length>0;
        swapCells(a,b);
        if(ok)return[[x,y],[nx,ny]];
      }
    }
  }
  return null;
}

function shuffleInternal(show=true){
  let vals=board.length===W*H?[...board]:Array.from({length:W*H},()=>rand(TYPES.length));
  let guard=0;
  do{
    for(let i=vals.length-1;i>0;i--){
      const j=rand(i+1);
      [vals[i],vals[j]]=[vals[j],vals[i]];
    }
    board=[...vals];
    guard++;
  }while((findMatches().length||!findMove())&&guard<120);
  if(guard>=120){
    for(let i=0;i<board.length;i++)board[i]=rand(TYPES.length);
  }
  renderBoard();
  if(show)showToast('SHUFFLED!');
}

function consumeBooster(name){
  boosterCounts[name]=Math.max(0,(boosterCounts[name]||0)-1);
  persist();
  feedback(610,25);
  updateHUD();
}

async function useTargetedBooster(name,x,y){
  if((boosterCounts[name]||0)<=0){
    boosterMode=null;
    showToast('NONE LEFT');
    updateHUD();
    return;
  }
  locked=true;
  let cells=[];
  if(name==='hammer')cells=[idx(x,y)];
  if(name==='rocket'){
    for(let xx=0;xx<W;xx++)cells.push(idx(xx,y));
    for(let yy=0;yy<H;yy++)cells.push(idx(x,yy));
    cells=[...new Set(cells)];
  }
  if(name==='disco'){
    const k=kindAt(x,y);
    for(let i=0;i<board.length;i++)if(board[i]===k)cells.push(i);
  }
  consumeBooster(name);
  countTargets(cells);
  for(const i of cells)tileEls[i]?.classList.add('clearing');
  flash(name==='rocket'?'LIP LASER!':name==='hammer'?'HEEL SMASH!':'DISCO!');
  await sleep(135);
  for(const i of cells)board[i]=-1;
  collapse();
  renderBoard();
  const m=findMatches();
  if(m.length)await resolveMatches(m);
  boosterMode=null;
  locked=false;
  renderBoard();
  checkEnd();
}

function selectBooster(name){
  if(locked)return;
  if((boosterCounts[name]||0)<=0){showToast('NONE LEFT');return;}
  boosterMode=boosterMode===name?null:name;
  swapFirst=null;
  selected=null;
  renderBoard();
  showToast(boosterMode?(name==='swap'?'PICK TWO TILES':`${BOOSTER_LABELS[name]} READY`):'CANCELLED');
}

function checkEnd(){
  updateHUD();
  if(targets.cherries<=0&&targets.diamond<=0&&targets.star<=0){
    coins+=250;
    persist();
    updateHUD();
    showModal('WAM! YOU WON','All three targets cleared. You won 250 coins!','PLAY AGAIN',startGame);
    return;
  }
  if(moves<=0){
    lives=Math.max(0,lives-1);
    persist();
    updateHUD();
    showModal('OUT OF MOVES',`Targets left: ${Math.max(0,targets.cherries)} cherries, ${Math.max(0,targets.diamond)} diamonds, ${Math.max(0,targets.star)} stars.`,'TRY AGAIN',startGame);
  }
}

function startGame(){
  home.classList.remove('active');
  game.classList.add('active');
  moves=16;
  targets={...TARGET_START};
  boosterMode=null;
  swapFirst=null;
  selected=null;
  pointerStart=null;
  locked=false;
  generateBoard();
  renderBoard();
  closeModal();
  feedback(560,16);
}

function goHome(){
  game.classList.remove('active');
  home.classList.add('active');
  boosterMode=null;
  selected=null;
  swapFirst=null;
  pointerStart=null;
  closeModal();
  updateHUD();
}
window.goHome=goHome;

function flash(text){
  const el=$('bamFlash');
  if(!el)return;
  el.textContent=text;
  el.classList.add('show');
  feedback(700,35);
  clearTimeout(flash.t);
  flash.t=setTimeout(()=>el.classList.remove('show'),300);
}

function showToast(text){
  toast.textContent=text;
  toast.classList.add('show');
  clearTimeout(showToast.t);
  showToast.t=setTimeout(()=>toast.classList.remove('show'),620);
}

function showModal(title,text,primary='OK',action=null){
  setText('modalTitle',title);
  setText('modalText',text);
  setText('modalPrimary',primary);
  $('modalPrimary').onclick=()=>{feedback();closeModal();if(action)action();};
  modal.classList.add('show');
}
function closeModal(){modal.classList.remove('show');}

function settingsModal(){
  const text=`Sound: ${soundOn?'ON':'OFF'} • Vibration: ${vibrationOn?'ON':'OFF'}`;
  showModal('SETTINGS',text,'TOGGLE BOTH',()=>{
    soundOn=!soundOn;
    vibrationOn=!vibrationOn;
    localStorage.setItem('wb_sound',soundOn?'1':'0');
    localStorage.setItem('wb_vibrate',vibrationOn?'1':'0');
    settingsModal();
  });
}

function action(name){
  feedback();
  if(name==='profile')showModal('LEVEL 25','Your Wam Bam profile is ready for the progression system.');
  else if(name==='lives')showModal('LIVES',`You have ${lives} lives.`);
  else if(name==='coins')showModal('COINS',`You have ${coins.toLocaleString()} coins.`);
  else if(name==='vip')showModal('VIP','VIP rewards and daily bonuses are coming in a later update.');
  else if(name==='events')showModal('EVENTS','Play limited-time Wam Bam events and win rewards.');
  else if(name==='shop')showModal('SHOP','The shop is ready for coins, lives and booster packs.');
  else if(name==='challenges')showModal('CHALLENGES','Clear 30 cherries, 18 diamonds and 20 stars in 16 moves.','PLAY CHALLENGE',startGame);
  else if(name==='settings')settingsModal();
}

function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

boardEl.addEventListener('pointerdown',onBoardDown,{passive:false});
boardEl.addEventListener('pointerup',onBoardUp,{passive:false});
boardEl.addEventListener('pointercancel',()=>{pointerStart=null;});
$('playButton').addEventListener('pointerup',startGame);
document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('pointerup',()=>action(b.dataset.action)));
document.querySelectorAll('[data-booster]').forEach(b=>b.addEventListener('pointerup',()=>selectBooster(b.dataset.booster)));
$('pauseButton').addEventListener('pointerup',()=>showModal('PAUSED','Take a break or return to the lounge.','RESUME',closeModal));
$('modalClose').addEventListener('pointerup',closeModal);
document.addEventListener('contextmenu',e=>e.preventDefault());
updateHUD();
})();
