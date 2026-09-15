(()=>{
'use strict';
const U=window.WamUI;
if(!U?.GameView)return;
const P=U.GameView.prototype;
if(P.__wam1123Patched)return;
P.__wam1123Patched=true;

function style(){
  if(document.getElementById('wam-1123-style'))return;
  const s=document.createElement('style');
  s.id='wam-1123-style';
  s.textContent=`
  /* 11.2.3: keep board large but reveal more of the Wam Bam girl */
  .wam112-level1 .wam-board-title{left:34px!important;top:270px!important;width:540px!important;height:46px!important}
  .wam112-level1 .wam-grid{left:34px!important;top:326px!important;width:540px!important;height:540px!important;border-radius:24px!important}
  .wam112-level1 .wam-pause{left:646px!important;top:250px!important}

  /* Royal-style 3-star progress bar inspired by the user's second reference image */
  .wam112-level1 .wam112-stars{left:218px!important;top:48px!important;width:292px!important;height:170px!important;overflow:visible!important}
  .wam112-level1 .wam112-stars-label{display:none!important}
  .wam112-level1 .wam112-star-row{position:absolute!important;left:0!important;top:0!important;width:292px!important;height:70px!important;display:flex!important;justify-content:space-around!important;align-items:flex-start!important;z-index:5!important;pointer-events:none!important}
  .wam112-level1 .wam112-star{font-size:62px!important;color:#6a345c!important;text-shadow:0 4px 0 #4c153a,0 0 4px #fff2b8!important;filter:none!important}
  .wam112-level1 .wam112-star.lit{color:#ffc928!important;filter:drop-shadow(0 0 7px #ffae2a)!important;transform:scale(1.08)!important}
  .wam112-level1 .wam112-star-track{position:absolute!important;left:0!important;top:55px!important;width:292px!important;height:48px!important;margin:0!important;border:5px solid #f5bf45!important;border-radius:27px!important;background:linear-gradient(180deg,#481541,#261126)!important;box-shadow:0 5px 0 #7f4218,0 0 0 2px #7b2356,inset 0 0 0 3px #140914!important;overflow:hidden!important}
  .wam112-level1 .wam112-star-fill{height:100%!important;background:linear-gradient(90deg,#ff2d86 0%,#f52d8d 48%,#b51e74 100%)!important;border-radius:20px!important;box-shadow:inset 0 4px 7px #ff9bc777!important}
  .wam112-level1 .wam112-stars:after{content:'LEVEL 1';position:absolute;left:74px;top:100px;width:144px;height:48px;display:flex;align-items:center;justify-content:center;border:4px solid #f5bf45;border-top:0;border-radius:0 0 20px 20px;background:linear-gradient(180deg,#ffd760,#f2a33b);color:#521431;font-size:23px;font-weight:900;letter-spacing:.4px;text-shadow:0 1px #fff3bd;box-shadow:0 4px 0 #8d4b1d;z-index:3}

  /* Transparent-looking booster artwork: remove the visible white squares by blending them into the dark card */
  .wam112-level1 .wam-booster{background:rgba(72,8,52,.34)!important;backdrop-filter:blur(3px)!important}
  .wam112-level1 .wam112-booster-tray{background:linear-gradient(180deg,rgba(62,8,49,.55),rgba(19,4,17,.58))!important;backdrop-filter:blur(4px)!important}
  .wam112-level1 .wam-booster[data-booster="rocket"] .wam112-boost-icon,
  .wam112-level1 .wam-booster[data-booster="hammer"] .wam112-boost-icon{mix-blend-mode:multiply!important;filter:contrast(1.2) saturate(1.25) brightness(1.16) drop-shadow(0 4px 4px #16000daa)!important;background:transparent!important}
  .wam112-level1 .wam-booster[data-booster="disco"] .wam112-boost-icon{filter:drop-shadow(0 4px 5px #16000daa) saturate(1.18)!important;background:transparent!important}
  .wam112-level1 .wam112-boost-icon,.wam112-level1 .wam112-boost-symbol{width:132px!important;height:98px!important;background:transparent!important;box-shadow:none!important}
  `;
  document.head.appendChild(s);
}

function ensure(view){
  if(view?.config?.id!==1||!view.stage)return;
  style();
  if(view.board){
    view.board.style.left='34px';
    view.board.style.top='326px';
    view.board.style.width='540px';
    view.board.style.height='540px';
  }
}

const render=P.render;
P.render=function(){render.call(this);ensure(this);};
})();
