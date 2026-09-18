(()=>{
'use strict';
const U=window.WamUI;
if(!U?.GameView)return;
const P=U.GameView.prototype;
if(P.__wam1158CounterOptical)return;
P.__wam1158CounterOptical=1;

const MIN=11,MAX=100;
const BAR_LEFT=15,BAR_TOP=1094;
const COUNT_SIZE=44;
const POS={
  hammer:{x:135,y:107},
  rocket:{x:261,y:108},
  swap:{x:388,y:109},
  disco:{x:514,y:109},
  jukebox:{x:640,y:109}
};

function scope(v){
  const id=Number(v?.config?.id||0);
  return id>=MIN&&id<=MAX&&!!v?.stage;
}
function imp(e,p,v){if(e)e.style.setProperty(p,v,'important')}

function place(el,key){
  const p=POS[key];
  if(!el||!p)return;
  imp(el,'left',(BAR_LEFT+p.x-COUNT_SIZE/2)+'px');
  imp(el,'top',(BAR_TOP+p.y-COUNT_SIZE/2)+'px');
  imp(el,'width',COUNT_SIZE+'px');
  imp(el,'height',COUNT_SIZE+'px');
  imp(el,'line-height',COUNT_SIZE+'px');
  imp(el,'text-align','center');
  imp(el,'padding','0');
  imp(el,'margin','0');
  imp(el,'border','0');
  imp(el,'background','transparent');
  imp(el,'box-shadow','none');
  imp(el,'z-index','210');
}

function fix(v){
  if(!scope(v))return;
  for(const key of ['hammer','rocket','swap','disco']){
    place(v.stage.querySelector(`.wam1150-count[data-k="${key}"]`),key);
  }
  place(v.stage.querySelector('.wam1150-juke-count'),'jukebox');
}

const render=P.render;
P.render=function(){
  render.call(this);
  fix(this);
};
})();