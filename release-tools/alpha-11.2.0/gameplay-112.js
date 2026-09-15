(()=>{
'use strict';
const U=window.WamUI;
if(!U?.GameView)return;
const P=U.GameView.prototype;
if(P.__wam112Patched)return;
P.__wam112Patched=true;

function style(){
  if(document.getElementById('wam-112-style'))return;
  const s=document.createElement('style');
  s.id='wam-112-style';
  s.textContent=`
  .wam112-level1{font-family:Arial,Helvetica,sans-serif;color:#fff}
  .wam112-level1 .wam-art{object-fit:cover!important;filter:saturate(1.04) brightness(.94)}

  .wam112-level1 .wam112-goals-panel,
  .wam112-level1 .wam112-moves-panel,
  .wam112-level1 .wam112-stars,
  .wam112-level1 .wam112-booster-tray{position:absolute;box-sizing:border-box;z-index:3}

  .wam112-level1 .wam112-goals-panel{left:18px;top:35px;width:190px;height:184px;border:4px solid #ffd46d;border-radius:25px;background:linear-gradient(180deg,#b40b5eea,#5b123eea);box-shadow:0 6px 0 #35051e,0 0 22px #ff3c9f77,inset 0 0 0 3px #ff8dc1}
  .wam112-level1 .wam112-goals-panel strong{display:block;text-align:center;padding:9px 4px 5px;color:#fff6d3;font-size:25px;letter-spacing:1px;text-shadow:0 2px #6a1338}
  .wam112-level1 .wam-target{left:31px!important;width:163px!important;height:52px!important;z-index:8!important;padding:3px 9px;box-sizing:border-box;border-radius:14px;background:#fff1ddea;color:#52102f!important;font-size:31px!important;box-shadow:inset 0 0 0 2px #ffc1d9;gap:11px!important}
  .wam112-level1 .wam-target img{width:47px!important;height:45px!important;mix-blend-mode:normal!important}
  .wam112-level1 .wam-target.done{background:#d9fff1ea!important;color:#126344!important}

  .wam112-level1 .wam112-moves-panel{right:18px;top:35px;width:154px;height:155px;border:4px solid #ffd46d;border-radius:25px;background:linear-gradient(180deg,#b40b5eea,#5b123eea);box-shadow:0 6px 0 #35051e,0 0 22px #ff3c9f77,inset 0 0 0 3px #ff8dc1;text-align:center}
  .wam112-level1 .wam112-moves-panel strong{display:block;padding-top:10px;color:#fff6d3;font-size:22px;letter-spacing:1px;text-shadow:0 2px #6a1338}
  .wam112-level1 .wam-moves{left:auto!important;right:29px!important;top:79px!important;width:132px!important;height:92px!important;z-index:9!important;color:#fff!important;font-size:58px!important;line-height:1!important;text-shadow:0 4px 0 #55062e,0 0 10px #ff8abb!important}

  .wam112-level1 .wam112-stars{left:222px;top:43px;width:280px;height:123px;text-align:center}
  .wam112-level1 .wam112-stars-label{font-size:20px;font-weight:900;color:#ffe8a5;text-shadow:0 2px #52102f;letter-spacing:1px}
  .wam112-level1 .wam112-star-row{height:53px;display:flex;align-items:center;justify-content:center;gap:17px}
  .wam112-level1 .wam112-star{font-size:45px;line-height:1;color:#5f3155;text-shadow:0 2px #1a0713;transition:transform .18s ease,color .18s ease,filter .18s ease}
  .wam112-level1 .wam112-star.lit{color:#ffd448;filter:drop-shadow(0 0 8px #ff9d28);transform:scale(1.12)}
  .wam112-level1 .wam112-star-track{position:relative;width:258px;height:24px;margin:1px auto 0;border:3px solid #ffd46d;border-radius:99px;background:#32122f;overflow:hidden;box-shadow:0 3px 0 #250419}
  .wam112-level1 .wam112-star-fill{height:100%;width:0;background:linear-gradient(90deg,#ff2f91,#ffb73f);border-radius:99px;transition:width .2s ease}

  .wam112-level1 .wam-board-title{left:132px!important;top:276px!important;width:456px!important;height:44px!important;z-index:8!important;padding:0 10px;box-sizing:border-box;border:3px solid #ffd16a;border-radius:16px;background:#280c2ddd!important;color:#fff1c3!important;font-size:17px!important;box-shadow:0 4px 0 #170311;text-shadow:0 2px #6c1747}
  .wam112-level1 .wam-board-title button{background:#cf176b!important;color:#fff8da!important;border:2px solid #ffd46d!important}
  .wam112-level1 .wam-board-info,.wam112-level1 .wam-shape-tip{display:none!important}

  .wam112-level1 .wam-grid{z-index:6!important;left:132px!important;top:340px!important;width:456px!important;height:456px!important;border-radius:22px;box-shadow:0 0 0 7px #190919e6,0 0 0 11px #ffd16a,0 10px 24px #08020ccc,0 0 28px #ff3c9f77;background:#120b1bd9!important;overflow:hidden}
  .wam112-level1 .wam-grid.shaped .wam-cell{background:linear-gradient(145deg,#26172fee,#171323f2)!important;border:1.5px solid #7e638c!important;border-radius:8px!important;box-shadow:inset 0 1px #ffffff1f!important}
  .wam112-level1 .wam-cell img.supplied{mix-blend-mode:normal!important}
  .wam112-level1 .wam-cell.selected{background:#55305ee8!important;box-shadow:inset 0 0 0 4px #ff4c9e!important}

  .wam112-level1 .wam112-booster-tray{left:20px;top:1017px;width:680px;height:196px;border:4px solid #ffd46d;border-radius:28px;background:linear-gradient(180deg,#4b123eea,#22091fea);box-shadow:0 7px 0 #12020d,0 0 24px #ff3d9a66,inset 0 0 0 3px #a82268}
  .wam112-level1 .wam112-booster-title{position:absolute;top:-29px;left:224px;width:225px;padding:5px 0;border:3px solid #ffd46d;border-radius:18px;background:#b90e63;text-align:center;color:#fff5cd;font-size:19px;font-weight:900;letter-spacing:1px;box-shadow:0 3px 0 #4a092b}
  .wam112-level1 .wam-booster{top:1040px!important;width:138px!important;height:148px!important;z-index:8!important;border:3px solid #ffcf64!important;border-radius:21px!important;background:linear-gradient(180deg,#a20d59,#4c123c)!important;box-shadow:0 5px 0 #26051b,inset 0 0 0 2px #ff64aa!important;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;color:#fff!important;overflow:visible}
  .wam112-level1 .wam-booster.active{box-shadow:0 0 0 5px #5af9ec,0 0 25px #5af9ec,inset 0 0 0 2px #fff!important}
  .wam112-level1 .wam112-boost-icon{width:76px;height:76px;object-fit:contain;pointer-events:none;filter:drop-shadow(0 3px 3px #17000f)}
  .wam112-level1 .wam112-boost-symbol{height:76px;display:flex;align-items:center;justify-content:center;color:#61f4ed;font-size:64px;font-weight:900;text-shadow:0 3px #27051e;pointer-events:none}
  .wam112-level1 .wam112-boost-label{position:static!important;min-width:0!important;min-height:0!important;width:100%!important;height:auto!important;border:0!important;border-radius:0!important;background:transparent!important;color:#fff5d2!important;font-size:13px!important;line-height:16px!important;font-weight:900!important;text-align:center;letter-spacing:.2px;pointer-events:none}
  .wam112-level1 .wam-booster>span:not(.wam112-boost-label){right:-5px!important;top:-8px!important;z-index:5!important;min-width:35px!important;min-height:35px!important;display:flex;align-items:center;justify-content:center;border:3px solid #ffe28b!important;background:#d50e6d!important;color:white!important;font-size:21px!important}
  .wam112-level1 .wam-pause{left:643px!important;top:253px!important;width:60px!important;height:60px!important;z-index:12!important;border:3px solid #ffd46d!important;border-radius:50%!important;background:#8e104eee!important;box-shadow:0 4px 0 #38051f!important}
  .wam112-level1 .wam-pause:after{content:'Ⅱ';display:flex;align-items:center;justify-content:center;width:100%;height:100%;color:#fff4cf;font-size:27px;font-weight:900}
  .wam112-level1 .wam-toast{top:214px!important;z-index:220!important}
  `;
  document.head.appendChild(s);
}

function node(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n}

function ensure(view){
  if(view?.config?.id!==1||!view.stage)return;
  style();
  const stage=view.stage;
  stage.classList.add('wam112-level1');

  const title=stage.querySelector('.wam-board-title span');
  if(title)title.textContent='LEVEL 1 · BAM LOUNGE OPENING';

  const targets=Object.values(view.targetEls||{});
  targets.forEach((entry,i)=>{
    if(!entry?.row)return;
    entry.row.style.top=(91+i*58)+'px';
    entry.row.style.left='31px';
  });

  if(view.board){
    view.board.style.left='132px';
    view.board.style.top='340px';
    view.board.style.width='456px';
    view.board.style.height='456px';
  }

  if(!stage.querySelector('.wam112-goals-panel')){
    const goals=node('div','wam112-goals-panel');
    goals.append(node('strong','', 'GOALS'));
    stage.append(goals);
  }
  if(!stage.querySelector('.wam112-moves-panel')){
    const moves=node('div','wam112-moves-panel');
    moves.append(node('strong','', 'MOVES'));
    stage.append(moves);
  }
  if(!stage.querySelector('.wam112-stars')){
    const wrap=node('div','wam112-stars');
    wrap.append(node('div','wam112-stars-label','LEVEL PROGRESS'));
    const row=node('div','wam112-star-row');
    for(let i=0;i<3;i++){const st=node('span','wam112-star','★');st.dataset.star=String(i+1);row.append(st)}
    const track=node('div','wam112-star-track');track.append(node('div','wam112-star-fill'));
    wrap.append(row,track);stage.append(wrap);
  }
  if(!stage.querySelector('.wam112-booster-tray')){
    const tray=node('div','wam112-booster-tray');tray.append(node('div','wam112-booster-title','BOOSTERS'));stage.append(tray);
  }

  const boosterSpec={
    rocket:{label:'MIC BLAST',src:'icons/microphone.png'},
    hammer:{label:'HEEL SMASH',src:'icons/heel.png'},
    disco:{label:'DISCO BALL',src:'tile_disco_new.png'},
    swap:{label:'FREE SWAP',symbol:'↔'}
  };
  const keys=['rocket','hammer','disco','swap'];
  keys.forEach((key,i)=>{
    const entry=view.boosterButtons?.[key];if(!entry?.b)return;
    const b=entry.b;b.dataset.booster=key;b.style.left=(48+i*158)+'px';
    const spec=boosterSpec[key];b.title=spec.label;b.setAttribute('aria-label',spec.label);
    if(!b.querySelector('.wam112-boost-icon,.wam112-boost-symbol')){
      if(spec.src){const img=node('img','wam112-boost-icon');img.src=spec.src;img.alt='';b.insertBefore(img,b.firstChild)}
      else {const sym=node('b','wam112-boost-symbol',spec.symbol);b.insertBefore(sym,b.firstChild)}
      b.append(node('span','wam112-boost-label',spec.label));
    }
  });
}

function update(view){
  if(view?.config?.id!==1||!view.stage)return;
  const initial=Object.values(view.config.targets||{}).reduce((a,b)=>a+Number(b||0),0)||1;
  const left=Object.values(view.game?.targets||{}).reduce((a,b)=>a+Math.max(0,Number(b||0)),0);
  const progress=Math.max(0,Math.min(1,(initial-left)/initial));
  const fill=view.stage.querySelector('.wam112-star-fill');if(fill)fill.style.width=Math.round(progress*100)+'%';
  view.stage.querySelectorAll('.wam112-star').forEach((star,i)=>star.classList.toggle('lit',progress>=((i+1)/3)-.001));
}

const render=P.render;
P.render=function(){
  render.call(this);
  ensure(this);
  update(this);
};

const dispose=P.dispose;
P.dispose=function(){
  if(this?.stage?.classList)this.stage.classList.remove('wam112-level1');
  return dispose.call(this);
};
})();
