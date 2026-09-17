(()=>{
'use strict';
const U=window.WamUI;
if(!U?.GameView)return;
const P=U.GameView.prototype;
if(P.__wam1155Background)return;
P.__wam1155Background=1;

const MIN_LEVEL=11;
const MAX_LEVEL=100;
const BG_PATH='artwork/wambam-level1-bg.jpg';

function inScope(view){
  const id=Number(view?.config?.id||0);
  return id>=MIN_LEVEL&&id<=MAX_LEVEL&&!!view?.stage;
}
function imp(el,prop,value){if(el)el.style.setProperty(prop,value,'important');}

function applyBackground(view){
  if(!inScope(view))return;
  const art=view.stage.querySelector('.wam-art');
  if(!art)return;
  const bgUrl=new URL(BG_PATH,document.baseURI).href;
  art.alt='';
  if(art.tagName==='IMG'){
    if(art.src!==bgUrl)art.src=bgUrl;
  }else{
    imp(art,'background-image',`url("${bgUrl}")`);
  }
  imp(art,'width','100%');
  imp(art,'height','100%');
  imp(art,'object-fit','cover');
  imp(art,'object-position','center');
  imp(art,'background-size','cover');
  imp(art,'background-position','center');
  imp(art,'filter','saturate(1.04) brightness(.94)');
  imp(art,'opacity','1');
}

const render=P.render;
P.render=function(){
  render.call(this);
  applyBackground(this);
};
})();
