(()=>{
'use strict';
const U=window.WamUI;
if(!U?.GameView)return;
const P=U.GameView.prototype;
if(P.__wam1137Patched)return;
P.__wam1137Patched=true;

const MIN_LEVEL=2;
const MAX_LEVEL=9;
const JUKEBOX_POS={left:644,top:1082};

function inScope(view){
  const id=Number(view?.config?.id||0);
  return id>=MIN_LEVEL&&id<=MAX_LEVEL&&!!view?.stage;
}
function imp(el,prop,value){if(el)el.style.setProperty(prop,value,'important');}

function installStyle(){
  if(document.getElementById('wam-1137-style'))return;
  const s=document.createElement('style');
  s.id='wam-1137-style';
  s.textContent=`
  .wam1137-jukebox-count{
    position:absolute!important;width:28px!important;height:28px!important;
    display:flex!important;align-items:center!important;justify-content:center!important;
    padding:0!important;margin:0!important;border:0!important;background:transparent!important;
    color:#fff!important;font-family:Arial,Helvetica,sans-serif!important;font-size:20px!important;font-weight:900!important;
    line-height:28px!important;text-align:center!important;text-shadow:0 2px 0 #6b0736,0 0 3px #6b0736!important;
    z-index:10003!important;pointer-events:none!important;
  }
  .wam1133-chapter .wam-board-title{z-index:100!important;pointer-events:auto!important;overflow:visible!important}
  .wam1133-chapter .wam-board-title button[aria-label="Show a matching move"]{
    position:relative!important;z-index:101!important;pointer-events:auto!important;touch-action:manipulation!important;
  }
  .wam1137-hint{
    animation:wam1137HintPulse .52s ease-in-out 0s 3 alternate!important;
    box-shadow:inset 0 0 0 5px #fff06a,0 0 18px #ff2f91,0 0 28px #fff06a!important;
  }
  @keyframes wam1137HintPulse{
    from{filter:brightness(1);transform:scale(1)}
    to{filter:brightness(1.35);transform:scale(.94)}
  }
  `;
  document.head.appendChild(s);
}

function jukeboxCount(view){
  const live=view?.game?.boosters?.jukebox;
  if(Number.isFinite(Number(live)))return String(Math.max(0,Number(live)));
  try{
    const stored=Number(localStorage.getItem('wambam-jukebox-count'));
    if(Number.isFinite(stored)&&stored>=0)return String(stored);
  }catch(_){ }
  return '0';
}

function ensureJukeboxCount(view){
  const stage=view.stage;
  let badge=stage.querySelector('.wam1137-jukebox-count');
  if(!badge){
    badge=document.createElement('span');
    badge.className='wam1137-jukebox-count';
    badge.dataset.key='jukebox';
    stage.appendChild(badge);
  }
  badge.textContent=jukeboxCount(view);
  imp(badge,'left',JUKEBOX_POS.left+'px');
  imp(badge,'top',JUKEBOX_POS.top+'px');
}

function clearCustomHint(view){
  view?.cells?.forEach(({b})=>b?.classList?.remove('wam1137-hint'));
  if(view?.__wam1137HintTimer){
    clearTimeout(view.__wam1137HintTimer);
    view.__wam1137HintTimer=null;
  }
}

function forceHint(view){
  if(!inScope(view)||view.busy||view.paused||view.ended||view.disposed)return;
  clearCustomHint(view);
  view.clearHint?.();
  const pair=view.game?.findMove?.();
  if(!pair||!pair.length)return;
  pair.forEach(i=>{
    const cell=view.cells?.[i]?.b;
    if(cell)cell.classList.add('hint','wam1137-hint');
  });
  view.__wam1137HintTimer=setTimeout(()=>{
    view?.cells?.forEach(({b})=>b?.classList?.remove('wam1137-hint'));
    view.__wam1137HintTimer=null;
  },1800);
}

function repairHintButton(view){
  const title=view.stage.querySelector('.wam-board-title');
  const hint=title?.querySelector('button[aria-label="Show a matching move"],button');
  if(!hint)return;
  imp(title,'z-index','100');
  imp(title,'pointer-events','auto');
  imp(hint,'z-index','101');
  imp(hint,'pointer-events','auto');
  imp(hint,'touch-action','manipulation');
  hint.disabled=false;
  if(hint.dataset.wam1137Bound==='1')return;
  hint.dataset.wam1137Bound='1';
  hint.addEventListener('click',e=>{
    e.preventDefault();
    e.stopImmediatePropagation();
    forceHint(view);
  },true);
}

function ensure(view){
  if(!inScope(view))return;
  installStyle();
  ensureJukeboxCount(view);
  repairHintButton(view);
}

const render=P.render;
P.render=function(){
  render.call(this);
  ensure(this);
};

const dispose=P.dispose;
P.dispose=function(){
  clearCustomHint(this);
  return dispose.call(this);
};
})();
