(()=>{
'use strict';
const U=window.WamUI;
if(!U?.GameView)return;

const P=U.GameView.prototype;
if(P.__wam11510ReactionMove)return;
P.__wam11510ReactionMove=1;

function fix(v){
  if(Number(v?.config?.id)!==10 || !v?.stage)return;
  const r=v.stage.querySelector('.wam1140-reaction');
  if(!r)return;
  r.style.setProperty('left','315px','important');
  r.style.setProperty('right','auto','important');
  r.style.setProperty('top','270px','important');
  r.style.setProperty('max-width','175px','important');
  r.style.setProperty('z-index','45','important');
}

const render=P.render;
P.render=function(){
  render.call(this);
  fix(this);
};
})();