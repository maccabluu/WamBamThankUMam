(()=>{
'use strict';
const U=window.WamUI;
if(!U?.GameView)return;
const P=U.GameView.prototype;
if(P.__wam1132Patched)return;
P.__wam1132Patched=true;

const BAR_PATH='artwork/booster-bar-reference-1132.png';
const MAP=[
  {key:'hammer',label:'HAMMER',left:17},
  {key:'rocket',label:'MIC BLAST',left:149},
  {key:'swap',label:'SHUFFLE',left:281},
  {key:'disco',label:'SPOTLIGHT',left:414}
];

function imp(el,prop,value){if(el)el.style.setProperty(prop,value,'important');}

function ensureBar(view){
  if(view?.config?.id!==1||!view.stage)return;
  const stage=view.stage;
  const barUrl=new URL(BAR_PATH,document.baseURI).href;

  const tray=stage.querySelector('.wam112-booster-tray');
  if(tray)imp(tray,'display','none');
  const title=stage.querySelector('.wam112-booster-title');
  if(title)imp(title,'display','none');

  let bar=stage.querySelector('.wam1132-reference-bar, .wam1131-reference-bar');
  if(!bar){
    bar=document.createElement('img');
    stage.appendChild(bar);
  }
  bar.className='wam1131-reference-bar wam1132-reference-bar';
  bar.dataset.assetPath=BAR_PATH;
  bar.alt='';
  bar.setAttribute('aria-hidden','true');
  if(bar.src!==barUrl)bar.src=barUrl;
  imp(bar,'position','absolute');
  imp(bar,'left','15px');
  imp(bar,'top','994px');
  imp(bar,'width','690px');
  imp(bar,'height','171px');
  imp(bar,'object-fit','fill');
  imp(bar,'display','block');
  imp(bar,'z-index','8');
  imp(bar,'pointer-events','none');
  imp(bar,'border','0');
  imp(bar,'margin','0');
  imp(bar,'padding','0');
  imp(bar,'filter','drop-shadow(0 6px 7px #13000baa)');

  MAP.forEach(spec=>{
    const b=view.boosterButtons?.[spec.key]?.b;
    if(!b)return;
    b.dataset.booster=spec.key;
    b.title=spec.label;
    b.setAttribute('aria-label',spec.label);
    imp(b,'position','absolute');
    imp(b,'left',(15+spec.left)+'px');
    imp(b,'top','1003px');
    imp(b,'width','121px');
    imp(b,'height','149px');
    imp(b,'display','block');
    imp(b,'opacity','0');
    imp(b,'background','transparent');
    imp(b,'border','0');
    imp(b,'box-shadow','none');
    imp(b,'padding','0');
    imp(b,'margin','0');
    imp(b,'z-index','12');
    imp(b,'pointer-events','auto');
    imp(b,'transform','none');
    imp(b,'overflow','hidden');
    Array.from(b.children).forEach(child=>imp(child,'display','none'));
    Array.from(b.childNodes).forEach(n=>{if(n.nodeType===3)n.textContent='';});
  });
}

const render=P.render;
P.render=function(){
  render.call(this);
  ensureBar(this);
};
})();
