(()=>{
'use strict';
const U=window.WamUI;
if(!U?.GameView)return;
const P=U.GameView.prototype;
if(P.__wam1142Patched)return;
P.__wam1142Patched=true;

const LEVEL=10;
function inScope(v){return Number(v?.config?.id)===LEVEL&&!!v?.stage;}
function imp(el,p,v){if(el)el.style.setProperty(p,v,'important');}

function installStyle(){
  if(document.getElementById('wam-1142-style'))return;
  const s=document.createElement('style');
  s.id='wam-1142-style';
  s.textContent=`
  .wam1140-boss .wam-art{
    filter:none!important;
    opacity:1!important;
    object-fit:cover!important;
    image-rendering:auto!important;
  }
  .wam1140-boss .wam-grid{
    background:rgba(45,18,52,.72)!important;
    box-shadow:0 0 0 7px #160816e8,0 0 0 11px #ffd16a,0 10px 24px #08020ccc,0 0 34px #ff2f9aaa!important;
  }
  .wam1140-boss .wam-grid.shaped .wam-cell{
    background:linear-gradient(145deg,rgba(105,61,117,.92),rgba(56,30,68,.94))!important;
    border:1.5px solid #d3a7dc!important;
    box-shadow:inset 0 1px 0 #ffffff4a,0 1px 2px #0d0612aa!important;
    filter:none!important;
    opacity:1!important;
  }
  .wam1140-boss .wam-cell *,
  .wam1140-boss .wam-cell img{
    opacity:1!important;
    filter:none!important;
  }
  .wam1140-boss .wam-cell img{
    filter:drop-shadow(0 2px 2px #12061388)!important;
  }
  .wam1140-boss .wam-cell.selected{
    background:#8c4f92f2!important;
    box-shadow:inset 0 0 0 4px #ff5aa8,0 0 10px #ff5aa899!important;
  }
  .wam1140-boss .wam1140-reaction{
    right:84px!important;
    top:276px!important;
    max-width:170px!important;
    z-index:70!important;
  }
  .wam1140-boss .wam-pause{
    left:650px!important;
    right:auto!important;
    top:300px!important;
    width:58px!important;
    height:58px!important;
    display:flex!important;
    align-items:center!important;
    justify-content:center!important;
    padding:0!important;
    opacity:1!important;
    visibility:visible!important;
    z-index:90!important;
    pointer-events:auto!important;
    touch-action:manipulation!important;
    border:3px solid #ffd46d!important;
    border-radius:50%!important;
    background:#8e104ef5!important;
    color:#fff4cf!important;
    font-family:Arial,Helvetica,sans-serif!important;
    font-size:29px!important;
    font-weight:900!important;
    line-height:1!important;
    box-shadow:0 4px 0 #38051f,0 0 12px #ff4b9b66!important;
  }
  `;
  document.head.appendChild(s);
}

function repairPause(v){
  const pause=v.stage.querySelector('.wam-pause');
  if(!pause)return;
  pause.hidden=false;
  pause.removeAttribute('aria-hidden');
  pause.disabled=false;
  pause.setAttribute('aria-label','Pause game');
  pause.textContent='Ⅱ';
  imp(pause,'display','flex');
  imp(pause,'opacity','1');
  imp(pause,'visibility','visible');
  imp(pause,'pointer-events','auto');
  if(pause.dataset.wam1142Bound==='1')return;
  pause.dataset.wam1142Bound='1';
  pause.addEventListener('click',e=>{
    e.preventDefault();
    e.stopImmediatePropagation();
    if(!v.disposed&&!v.ended)v.pause?.();
  },true);
}

function brightenPieces(v){
  v.stage.querySelectorAll('.wam-cell').forEach(cell=>{
    imp(cell,'opacity','1');
    imp(cell,'filter','none');
    cell.querySelectorAll('*').forEach(child=>imp(child,'opacity','1'));
  });
}

function ensure(v){
  if(!inScope(v))return;
  installStyle();
  repairPause(v);
  brightenPieces(v);
}

const render=P.render;
P.render=function(){render.call(this);ensure(this);};

const swap=P.swap;
P.swap=async function(a,b){
  const result=await swap.call(this,a,b);
  ensure(this);
  return result;
};
})();
