(()=>{
'use strict';
const U=window.WamUI;
if(!U?.GameView)return;
const P=U.GameView.prototype;
if(P.__wam1154Goals)return;
P.__wam1154Goals=1;

function imp(el,p,v){if(el)el.style.setProperty(p,v,'important');}
function inScope(v){return Number(v?.config?.id)===10&&!!v?.stage;}

function installStyle(){
  if(document.getElementById('wam-1154-goals-style'))return;
  const s=document.createElement('style');
  s.id='wam-1154-goals-style';
  s.textContent=`
  .wam1140-boss .wam1140-goals{
    width:194px!important;
    height:232px!important;
    min-height:232px!important;
    overflow:hidden!important;
  }
  .wam1140-boss .wam1140-goals:after{
    left:10px!important;
    right:10px!important;
    top:60px!important;
    bottom:8px!important;
  }
  .wam1140-boss .wam1140-goals > .wam-target{
    position:absolute!important;
    left:14px!important;
    width:166px!important;
    height:38px!important;
    padding:0 10px!important;
    margin:0!important;
    display:flex!important;
    align-items:center!important;
    justify-content:space-between!important;
    gap:8px!important;
    box-sizing:border-box!important;
    font-size:27px!important;
    line-height:38px!important;
    white-space:nowrap!important;
    overflow:hidden!important;
    z-index:44!important;
  }
  .wam1140-boss .wam1140-goals > .wam-target img{
    width:36px!important;
    height:36px!important;
    flex:0 0 36px!important;
    object-fit:contain!important;
  }
  `;
  document.head.appendChild(s);
}

function fix(v){
  if(!inScope(v))return;
  installStyle();
  const goals=v.stage.querySelector('.wam1140-goals');
  if(!goals)return;
  imp(goals,'height','232px');
  imp(goals,'min-height','232px');

  const rows=Object.values(v.targetEls||{}).filter(x=>x?.row);
  const tops=[70,118,166];
  rows.forEach((entry,i)=>{
    const row=entry.row;
    if(row.parentElement!==goals)goals.appendChild(row);
    imp(row,'position','absolute');
    imp(row,'left','14px');
    imp(row,'top',(tops[i]??(70+i*48))+'px');
    imp(row,'width','166px');
    imp(row,'height','38px');
    imp(row,'padding','0 10px');
    imp(row,'margin','0');
    imp(row,'overflow','hidden');
    const img=row.querySelector('img');
    if(img){
      imp(img,'width','36px');
      imp(img,'height','36px');
      imp(img,'flex','0 0 36px');
    }
  });
}

const oldRender=P.render;
P.render=function(){
  oldRender.call(this);
  fix(this);
};
})();
