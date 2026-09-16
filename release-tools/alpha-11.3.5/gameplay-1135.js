(()=>{
'use strict';
const U=window.WamUI;
if(!U?.GameView)return;
const P=U.GameView.prototype;
if(P.__wam1135Patched)return;
P.__wam1135Patched=true;

const MIN_LEVEL=2;
const MAX_LEVEL=9;
/* These are the printed pink-dot positions inside the 690x171 reference strip. */
const COUNT_POS={
  hammer:{left:130,top:1104},
  rocket:{left:262,top:1104},
  swap:{left:395,top:1104},
  disco:{left:528,top:1104}
};

function inScope(view){
  const id=Number(view?.config?.id||0);
  return id>=MIN_LEVEL&&id<=MAX_LEVEL&&!!view?.stage;
}
function imp(el,prop,value){if(el)el.style.setProperty(prop,value,'important');}

function installStyle(){
  if(document.getElementById('wam-1135-style'))return;
  const s=document.createElement('style');
  s.id='wam-1135-style';
  s.textContent=`
  /* 11.3.5: use the pink dots already printed in the booster strip. Only draw the live number. */
  .wam1133-chapter .wam1134-count{
    width:32px!important;height:32px!important;
    display:flex!important;align-items:center!important;justify-content:center!important;
    padding:0!important;margin:0!important;border:0!important;border-radius:0!important;
    background:transparent!important;box-shadow:none!important;
    color:#fff!important;font-family:Arial,Helvetica,sans-serif!important;
    font-size:23px!important;font-weight:900!important;line-height:32px!important;
    text-align:center!important;text-shadow:0 2px 0 #6b0736,0 0 3px #6b0736!important;
    z-index:18!important;pointer-events:none!important;
  }
  `;
  document.head.appendChild(s);
}

function alignCounts(view){
  const stage=view.stage;
  for(const [key,pos] of Object.entries(COUNT_POS)){
    const badge=stage.querySelector(`.wam1134-count[data-key="${key}"]`);
    if(!badge)continue;
    imp(badge,'left',pos.left+'px');
    imp(badge,'top',pos.top+'px');
    imp(badge,'width','32px');
    imp(badge,'height','32px');
    imp(badge,'background','transparent');
    imp(badge,'border','0');
    imp(badge,'border-radius','0');
    imp(badge,'box-shadow','none');
  }
}

function removeBottomRightStray(view){
  const stage=view.stage;
  const sr=stage.getBoundingClientRect();
  const protectedClasses=['wam1133-reference-bar','wam1134-count','wam-grid','wam-board-title','wam1133-goals','wam1133-moves','wam1133-stars','wam-pause'];
  stage.querySelectorAll('div,span,button,b,strong,em').forEach(el=>{
    if(protectedClasses.some(c=>el.classList?.contains(c)))return;
    if(el.closest('.wam-grid,.wam1133-goals,.wam1133-moves,.wam1133-stars,.wam-board-title'))return;
    const r=el.getBoundingClientRect();
    if(!r.width||!r.height)return;
    const relLeft=r.left-sr.left;
    const relTop=r.top-sr.top;
    const isBottomRight=relLeft>610&&relTop>1060;
    const looksLikeOval=r.width>=45&&r.width<=120&&r.height>=70&&r.height<=180;
    if(isBottomRight&&looksLikeOval){
      imp(el,'display','none');
      imp(el,'opacity','0');
      imp(el,'pointer-events','none');
      el.setAttribute('aria-hidden','true');
    }
  });
}

function ensure(view){
  if(!inScope(view))return;
  installStyle();
  alignCounts(view);
  removeBottomRightStray(view);
}

const render=P.render;
P.render=function(){
  render.call(this);
  ensure(this);
};
})();
