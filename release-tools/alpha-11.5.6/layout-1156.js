(()=>{
'use strict';
const U=window.WamUI;
if(!U?.GameView)return;
const P=U.GameView.prototype;
if(P.__wam1156Layout)return;
P.__wam1156Layout=1;

const MIN=11,MAX=100;
function scope(v){const id=Number(v?.config?.id||0);return id>=MIN&&id<=MAX&&!!v?.stage}
function imp(e,p,v){if(e)e.style.setProperty(p,v,'important')}

function install(){
  if(document.getElementById('wam1156-css'))return;
  const s=document.createElement('style');
  s.id='wam1156-css';
  s.textContent=`
  .wam1150-standard .wam1150-stars{
    left:218px!important;top:28px!important;width:292px!important;height:158px!important;
    overflow:visible!important;z-index:120!important;text-align:center!important
  }
  .wam1150-standard .wam1150-star-row{
    position:absolute!important;left:0!important;top:0!important;width:292px!important;height:46px!important;
    display:flex!important;align-items:center!important;justify-content:space-around!important;
    z-index:123!important;pointer-events:none!important
  }
  .wam1150-standard .wam1150-star{
    font-size:46px!important;line-height:46px!important;color:#7a3d68!important;
    text-shadow:0 3px 0 #371329,0 0 5px #fff0ae!important
  }
  .wam1150-standard .wam1150-star.lit{
    color:#ffc928!important;filter:drop-shadow(0 0 7px #ffae2a)!important;transform:scale(1.08)!important
  }
  .wam1150-standard .wam1150-track{
    left:0!important;top:48px!important;width:292px!important;height:44px!important;
    border:5px solid #f5bf45!important;border-radius:25px!important;
    background:linear-gradient(180deg,#481541,#261126)!important;
    box-shadow:0 5px 0 #7f4218,0 0 0 2px #7b2356,inset 0 0 0 3px #140914!important;
    overflow:hidden!important;z-index:121!important
  }
  .wam1150-standard .wam1150-level{
    left:74px!important;top:88px!important;width:144px!important;height:48px!important;
    border:4px solid #f5bf45!important;border-top:0!important;border-radius:0 0 20px 20px!important;
    background:linear-gradient(180deg,#ffd760,#f2a33b)!important;
    box-shadow:0 4px 0 #8d4b1d!important;z-index:122!important;
    font-size:23px!important
  }

  .wam1150-standard .wam1150-bar{
    left:15px!important;top:1094px!important;width:690px!important;height:171px!important;
    object-fit:fill!important;z-index:200!important;filter:drop-shadow(0 6px 7px #13000baa)!important
  }
  .wam1150-standard .wam1150-count{
    top:1182px!important;z-index:205!important
  }
  .wam1150-standard .wam1150-juke-hit{
    top:1103px!important;z-index:208!important
  }
  .wam1150-standard .wam1150-juke-count{
    top:1182px!important;z-index:209!important
  }
  .wam1150-standard .wam-booster{
    top:1103px!important;z-index:208!important
  }
  `;
  document.head.appendChild(s);
}

function fix(v){
  if(!scope(v))return;
  install();

  const bar=v.stage.querySelector('.wam1150-bar');
  if(bar){imp(bar,'top','1094px');imp(bar,'z-index','200')}

  const specs=[
    ['hammer',32,137],
    ['rocket',164,269],
    ['swap',296,401],
    ['disco',429,534]
  ];
  for(const [key,left,countLeft] of specs){
    const b=v.boosterButtons?.[key]?.b;
    if(b){
      imp(b,'left',left+'px');
      imp(b,'top','1103px');
      imp(b,'width','121px');
      imp(b,'height','149px');
      imp(b,'opacity','0');
      imp(b,'z-index','208');
    }
    const c=v.stage.querySelector(`.wam1150-count[data-k="${key}"]`);
    if(c){imp(c,'left',countLeft+'px');imp(c,'top','1182px');imp(c,'z-index','205')}
  }

  const j=v.stage.querySelector('.wam1150-juke-hit');
  if(j){imp(j,'left','577px');imp(j,'top','1103px');imp(j,'width','121px');imp(j,'height','149px')}
  const jc=v.stage.querySelector('.wam1150-juke-count');
  if(jc){imp(jc,'left','649px');imp(jc,'top','1182px')}

  const stars=v.stage.querySelector('.wam1150-stars');
  if(stars)imp(stars,'z-index','120');
}

const render=P.render;
P.render=function(){render.call(this);fix(this)};
})();