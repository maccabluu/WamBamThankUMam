(()=>{
'use strict';
const U=window.WamUI;
if(!U?.GameView)return;
const P=U.GameView.prototype;
if(P.__wam1157CounterAlign)return;
P.__wam1157CounterAlign=1;

const MIN=11,MAX=100;
const BAR_LEFT=15,BAR_TOP=1094;
const COUNT_Y=99;
const COUNT_SIZE=44;
const COUNT_CENTERS={hammer:135,rocket:260,swap:390,disco:515,jukebox:640};

function scope(v){
  const id=Number(v?.config?.id||0);
  return id>=MIN&&id<=MAX&&!!v?.stage;
}
function imp(e,p,v){if(e)e.style.setProperty(p,v,'important');}

function install(){
  if(document.getElementById('wam1157-css'))return;
  const s=document.createElement('style');
  s.id='wam1157-css';
  s.textContent=`
  .wam1150-standard .wam1150-count,
  .wam1150-standard .wam1150-juke-count{
    width:44px!important;
    height:44px!important;
    padding:0!important;
    margin:0!important;
    border:0!important;
    border-radius:50%!important;
    background:transparent!important;
    box-shadow:none!important;
    color:#fff!important;
    font-size:21px!important;
    font-weight:900!important;
    line-height:44px!important;
    text-align:center!important;
    text-shadow:0 2px 0 #6b0736,0 0 3px #6b0736!important;
    display:block!important;
    pointer-events:none!important;
    z-index:209!important;
    box-sizing:border-box!important
  }
  `;
  document.head.appendChild(s);
}

function align(v){
  if(!scope(v))return;
  install();

  for(const key of ['hammer','rocket','swap','disco']){
    const c=v.stage.querySelector(`.wam1150-count[data-k="${key}"]`);
    if(!c)continue;
    const cx=COUNT_CENTERS[key];
    imp(c,'left',(BAR_LEFT+cx-COUNT_SIZE/2)+'px');
    imp(c,'top',(BAR_TOP+COUNT_Y-COUNT_SIZE/2)+'px');
    imp(c,'width',COUNT_SIZE+'px');
    imp(c,'height',COUNT_SIZE+'px');
    imp(c,'line-height',COUNT_SIZE+'px');
    imp(c,'border','0');
    imp(c,'background','transparent');
    imp(c,'box-shadow','none');
  }

  const jc=v.stage.querySelector('.wam1150-juke-count');
  if(jc){
    imp(jc,'left',(BAR_LEFT+COUNT_CENTERS.jukebox-COUNT_SIZE/2)+'px');
    imp(jc,'top',(BAR_TOP+COUNT_Y-COUNT_SIZE/2)+'px');
    imp(jc,'width',COUNT_SIZE+'px');
    imp(jc,'height',COUNT_SIZE+'px');
    imp(jc,'line-height',COUNT_SIZE+'px');
    imp(jc,'border','0');
    imp(jc,'background','transparent');
    imp(jc,'box-shadow','none');
  }
}

const render=P.render;
P.render=function(){
  render.call(this);
  align(this);
};
})();