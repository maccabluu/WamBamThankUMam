(()=>{
'use strict';
const U=window.WamUI;
if(!U?.GameView)return;
const P=U.GameView.prototype;
if(P.__wam1153Goals)return;
P.__wam1153Goals=1;

function imp(el,p,v){if(el)el.style.setProperty(p,v,'important');}
function inScope(v){return Number(v?.config?.id)===10&&!!v?.stage;}

function installStyle(){
  if(document.getElementById('wam-1153-goals-style'))return;
  const s=document.createElement('style');
  s.id='wam-1153-goals-style';
  s.textContent=`
  .wam1140-boss .wam1140-goals{
    height:232px!important;
    min-height:232px!important;
    overflow:hidden!important;
  }
  .wam1140-boss .wam1140-goals:after{
    top:60px!important;
    bottom:8px!important;
  }
  .wam1140-boss .wam-target{
    left:31px!important;
    width:163px!important;
    height:40px!important;
    padding:0 12px!important;
    display:flex!important;
    align-items:center!important;
    justify-content:space-between!important;
    gap:8px!important;
    box-sizing:border-box!important;
    font-size:28px!important;
    line-height:40px!important;
    white-space:nowrap!important;
    overflow:visible!important;
  }
  .wam1140-boss .wam-target img{
    width:38px!important;
    height:38px!important;
    flex:0 0 38px!important;
    object-fit:contain!important;
  }
  `;
  document.head.appendChild(s);
}

function fix(v){
  if(!inScope(v))return;
  installStyle();
  const goals=v.stage.querySelector('.wam1140-goals');
  if(goals){
    imp(goals,'height','232px');
    imp(goals,'min-height','232px');
  }
  const rows=Object.values(v.targetEls||{}).filter(x=>x?.row);
  const tops=[72,120,168];
  rows.forEach((entry,i)=>{
    const top=tops[i]??(72+i*48);
    imp(entry.row,'top',top+'px');
    imp(entry.row,'height','40px');
    imp(entry.row,'left','31px');
    imp(entry.row,'width','163px');
  });
}

const oldRender=P.render;
P.render=function(){
  oldRender.call(this);
  fix(this);
};
})();
