(()=>{
'use strict';
const U=window.WamUI;
if(!U?.GameView)return;
const P=U.GameView.prototype;
if(P.__wam1138Patched)return;
P.__wam1138Patched=true;

const LEVEL1_COUNT_POS={
  hammer:{left:137,top:1082},
  rocket:{left:263,top:1082},
  swap:{left:390,top:1082},
  disco:{left:517,top:1082},
  jukebox:{left:644,top:1082}
};

function imp(el,prop,value){if(el)el.style.setProperty(prop,value,'important');}
function levelId(view){return Number(view?.config?.id||0);}

function installStyle(){
  if(document.getElementById('wam-1138-style'))return;
  const s=document.createElement('style');
  s.id='wam-1138-style';
  s.textContent=`
  .wam1138-level1-count{
    position:absolute!important;width:28px!important;height:28px!important;
    display:flex!important;align-items:center!important;justify-content:center!important;
    margin:0!important;padding:0!important;border:0!important;background:transparent!important;
    color:#fff!important;font-family:Arial,Helvetica,sans-serif!important;font-size:20px!important;font-weight:900!important;
    line-height:28px!important;text-align:center!important;text-shadow:0 2px 0 #6b0736,0 0 3px #6b0736!important;
    z-index:10020!important;pointer-events:none!important;
  }
  .wam1138-pause-restored{
    position:absolute!important;left:640px!important;top:292px!important;width:58px!important;height:58px!important;
    display:flex!important;align-items:center!important;justify-content:center!important;
    margin:0!important;padding:0!important;border:3px solid #ffd46d!important;border-radius:50%!important;
    background:#8e104eee!important;color:#fff4cf!important;box-shadow:0 4px 0 #38051f,0 0 12px #ff4b9b66!important;
    font-family:Arial,Helvetica,sans-serif!important;font-size:29px!important;font-weight:900!important;line-height:1!important;
    opacity:1!important;visibility:visible!important;z-index:10020!important;pointer-events:auto!important;touch-action:manipulation!important;
  }
  `;
  document.head.appendChild(s);
}

function liveCount(view,key){
  if(key==='jukebox'){
    const live=view?.game?.boosters?.jukebox;
    if(Number.isFinite(Number(live)))return String(Math.max(0,Number(live)));
    try{
      const stored=Number(localStorage.getItem('wambam-jukebox-count'));
      if(Number.isFinite(stored)&&stored>=0)return String(stored);
    }catch(_){ }
    return '0';
  }
  const value=Number(view?.game?.boosters?.[key]);
  return Number.isFinite(value)?String(Math.max(0,value)):'0';
}

function ensureLevel1Counts(view){
  if(levelId(view)!==1||!view.stage)return;
  const stage=view.stage;
  for(const [key,pos] of Object.entries(LEVEL1_COUNT_POS)){
    let badge=stage.querySelector(`.wam1138-level1-count[data-key="${key}"]`);
    if(!badge){
      badge=document.createElement('span');
      badge.className='wam1138-level1-count';
      badge.dataset.key=key;
      badge.setAttribute('aria-hidden','true');
      stage.appendChild(badge);
    }
    badge.textContent=liveCount(view,key);
    imp(badge,'left',pos.left+'px');
    imp(badge,'top',pos.top+'px');
  }
}

function ensurePause(view){
  const id=levelId(view);
  if(id<2||id>9||!view.stage)return;
  const pause=view.stage.querySelector('.wam-pause');
  if(!pause)return;
  pause.classList.add('wam1138-pause-restored');
  pause.hidden=false;
  pause.removeAttribute('aria-hidden');
  pause.disabled=false;
  pause.setAttribute('aria-label','Pause game');
  pause.textContent='Ⅱ';
  imp(pause,'display','flex');
  imp(pause,'left','640px');
  imp(pause,'top','292px');
  imp(pause,'width','58px');
  imp(pause,'height','58px');
  imp(pause,'opacity','1');
  imp(pause,'visibility','visible');
  imp(pause,'z-index','10020');
  imp(pause,'pointer-events','auto');
  if(pause.dataset.wam1138Bound==='1')return;
  pause.dataset.wam1138Bound='1';
  pause.addEventListener('click',e=>{
    e.preventDefault();
    e.stopImmediatePropagation();
    if(!view.disposed&&!view.ended)view.pause?.();
  },true);
}

function ensure(view){
  if(!view?.stage)return;
  installStyle();
  ensureLevel1Counts(view);
  ensurePause(view);
}

const render=P.render;
P.render=function(){
  render.call(this);
  ensure(this);
};
})();
