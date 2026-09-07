(function () {
  'use strict';
  const C=window.WamCampaign,E=window.WamEngine;
  let storage;try {storage=window.localStorage;}catch(_){storage={getItem:()=>null,setItem:()=>{}};}
  const css=`
    .wam-host{position:fixed;inset:0;z-index:2147483500;overflow:hidden;background:#170b20;font-family:Arial,Helvetica,sans-serif;user-select:none;touch-action:none}
    .wam-stage{position:absolute;width:720px;height:1280px;transform-origin:top left;overflow:hidden;color:#fff}
    .wam-stage *{box-sizing:border-box}.wam-stage button{font-family:Arial,Helvetica,sans-serif;cursor:pointer;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
    .wam-stage button:focus-visible{outline:5px solid #43f5ea;outline-offset:3px}.wam-stage button:disabled{cursor:default;opacity:.5}
    .wam-art{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none}
    .wam-button{border:3px solid #ffe09a;border-radius:28px;background:linear-gradient(#ff55a2,#c80063);color:white;font-size:24px;font-weight:900;padding:17px 24px;min-height:60px;box-shadow:0 5px 0 #4e123f}
    .wam-button.secondary{background:linear-gradient(#503958,#261930);border-color:#ad849f;font-size:21px}
    .wam-button.cyan{background:linear-gradient(#67f4e8,#179aa7);color:#152b35}
    .wam-shade{position:absolute;inset:0;z-index:1000;background:#16091ecc;display:flex;align-items:center;justify-content:center;padding:32px;touch-action:none}
    .wam-dialog{width:610px;max-height:1120px;overflow:auto;border:5px solid #ffc95e;border-radius:34px;background:radial-gradient(ellipse at top,#74204c,#25112d 65%);box-shadow:0 0 0 5px #9d1a60,0 20px 60px #0008;padding:42px 34px;text-align:center}
    .wam-dialog h2{font-size:39px;line-height:1.15;margin:0 0 16px;color:#ffe8b0}.wam-dialog p{font-size:25px;line-height:1.4;margin:20px 0;color:#fff1e7}.wam-dialog .wam-button{display:block;width:100%;margin-top:18px}
    .wam-eyebrow{color:#6df5e7;font-weight:900;letter-spacing:3px;font-size:19px;margin-bottom:16px}.wam-stars{color:#ffd968;font-size:43px;letter-spacing:8px;margin:12px 0}
    .wam-target-list{display:flex;justify-content:center;gap:14px;margin:25px 0}.wam-target-card{display:flex;flex-direction:column;align-items:center;justify-content:center;width:148px;border:2px solid #99597e;border-radius:22px;padding:12px 8px;background:#fff2cf;color:#40102f;font-size:26px;font-weight:900}.wam-target-card img{width:78px;height:78px;object-fit:contain;border-radius:12px;mix-blend-mode:multiply}.wam-target-card small{font-size:15px;line-height:1.2;min-height:34px;margin-top:7px}
    .wam-grid{position:absolute;left:108px;top:327.68px;width:504px;height:746.88px;display:grid;grid-template-columns:repeat(6,1fr);grid-template-rows:repeat(10,1fr);touch-action:none}
    .wam-cell{position:relative;min-width:0;width:100%;height:100%;padding:0;border:1px solid #99653726;border-radius:9px;background:#fff6d714;touch-action:none!important}
    .wam-cell img{position:absolute;width:90%;height:90%;left:5%;top:5%;object-fit:contain;pointer-events:none;border-radius:12px}
    .wam-cell img.supplied{mix-blend-mode:multiply}.wam-cell[data-special=disco] img{width:155%;left:-27.5%;object-fit:cover;clip-path:circle(34%)}
    .wam-cell.selected{z-index:10;background:#fff6b8;box-shadow:inset 0 0 0 4px #ed2786}.wam-cell.hint{animation:wamHint 900ms ease-in-out infinite}
    .wam-special-mark{position:absolute;right:1px;bottom:1px;z-index:2;display:flex;align-items:center;justify-content:center;min-width:28px;height:27px;border:2px solid white;border-radius:10px;background:#b5086b;color:#fff;font-weight:900;font-size:20px;pointer-events:none}
    .wam-cell[data-special=row]{box-shadow:inset 0 -4px #ee2d89,inset 0 4px #ee2d89}.wam-cell[data-special=column]{box-shadow:inset -4px 0 #14aab7,inset 4px 0 #14aab7}.wam-cell[data-special=wrapped]{box-shadow:inset 0 0 0 4px #952bda}
    .wam-moves{position:absolute;left:37px;top:67px;width:102px;height:66px;display:flex;justify-content:center;align-items:center;font-size:54px;font-weight:900;text-shadow:2px 3px #43132e}
    .wam-target{position:absolute;left:562px;width:127px;height:45px;display:flex;align-items:center;gap:8px;color:#281322;font-size:34px;font-weight:900}.wam-target img{width:48px;height:43px;object-fit:contain;mix-blend-mode:multiply;border-radius:7px}.wam-target.done{color:#146d4d}
    .wam-board-title{position:absolute;left:108px;top:284px;width:504px;height:36px;display:flex;align-items:center;justify-content:space-between;font-size:18px;font-weight:900;color:#672245}.wam-board-title button{background:#511b40;color:#ffedbf;border:0;border-radius:14px;padding:5px 14px;font-size:17px;font-weight:900}
    .wam-booster{position:absolute;top:1100px;width:126px;height:148px;background:transparent;border:0;border-radius:50%}.wam-booster.active{box-shadow:0 0 0 4px #64f7f0,inset 0 0 20px #38f4e6}.wam-booster span{position:absolute;right:0;top:0;min-width:33px;min-height:33px;border-radius:50%;border:3px solid #ffe09a;background:#c60064;color:#fff;font-size:23px;font-weight:900}
    .wam-pause{position:absolute;left:632px;top:1132px;width:77px;height:92px;background:transparent;border:0;border-radius:50%}
    .wam-toast{position:absolute;left:70px;right:70px;top:224px;z-index:200;text-align:center;padding:14px 18px;border:3px solid #ffcd61;border-radius:24px;background:#9e125d;color:#fff;font-size:24px;font-weight:900;box-shadow:0 6px 20px #30101d55;pointer-events:none}
    @keyframes wamHint{50%{box-shadow:inset 0 0 0 4px #ff248e;background:#fff59b80}}
    @media(prefers-reduced-motion:reduce){.wam-cell.hint{animation:none;box-shadow:inset 0 0 0 4px #ed2786}}
  `;
  function style() {if(!document.getElementById('wam94-style')){const s=document.createElement('style');s.id='wam94-style';s.textContent=css;document.head.appendChild(s);}}
  function el(tag,className,text) {const n=document.createElement(tag);if(className)n.className=className;if(text!==undefined)n.textContent=text;return n;}
  function button(text,action,className='') {const b=el('button','wam-button '+className,text);b.type='button';b.addEventListener('click',action);return b;}
  function icon(type) {const def=C.PIECES[type],img=el('img',def.card?'supplied':'');img.src=def.image;img.alt=def.label;img.draggable=false;return img;}
  function targets(config,remaining=config.targets) {
    const list=el('div','wam-target-list');
    for(const type of Object.keys(config.targets)) {const card=el('div','wam-target-card');card.append(icon(type),el('span','',remaining[type]===0?'✓':String(remaining[type])),el('small','',C.PIECES[type].label));list.append(card);}
    return list;
  }
  function dialog(stage,title,copy) {
    const shade=el('div','wam-shade'),card=el('section','wam-dialog');
    card.setAttribute('role','dialog');card.setAttribute('aria-modal','true');card.setAttribute('aria-label',title);
    card.append(el('h2','',title));if(copy)card.append(el('p','',copy));shade.append(card);stage.append(shade);
    return {shade,card,close:()=>shade.remove()};
  }
  function createHost(id,background) {
    style();document.getElementById('wambam-home-effects')?.remove();document.getElementById('wambam-mobile-screen-bg')?.remove();
    document.getElementById('wambam-curtain-transition')?.remove();
    const host=el('div','wam-host');host.id=id;
    if(background)host.style.backgroundImage=`linear-gradient(#13081bc9,#13081bc9),url('${background}')`;
    host.style.backgroundSize='cover';
    const stage=el('div','wam-stage');host.append(stage);document.body.append(host);
    const canvas=document.querySelector('canvas');if(canvas)canvas.style.visibility='hidden';
    const fit=()=>{const w=host.clientWidth,h=host.clientHeight,scale=Math.min(w/720,h/1280);stage.style.transform=`scale(${scale})`;stage.style.left=`${(w-720*scale)/2}px`;stage.style.top=`${(h-1280*scale)/2}px`;};
    fit();window.addEventListener('resize',fit);window.visualViewport?.addEventListener('resize',fit);
    return {host,stage,dispose(){window.removeEventListener('resize',fit);window.visualViewport?.removeEventListener('resize',fit);host.remove();if(canvas)canvas.style.visibility='visible';}};
  }
  function audio(name) {
    const shared=window.__wamAudio;if(!shared)return;
    if(name)shared.play?.(name,.55,1);else shared.start?.();
  }
  function record(type,count) {if(count>0)window.__wamEvents?.record?.(type,count);}
  class GameView {
    constructor(scene) {
      this.scene=scene;this.config=C.level(C.progress(storage).selected);this.game=new E.Game(this.config);
      this.selected=null;this.booster=null;this.busy=false;this.paused=false;this.ended=false;this.disposed=false;
      this.view=createHost('wambam-alpha02-overlay',this.config.background);this.stage=this.view.stage;
      const art=el('img','wam-art');art.src=this.config.background;art.alt='Wam Bam lounge';this.stage.append(art);
      this.moves=el('div','wam-moves');this.moves.setAttribute('aria-label','Moves remaining');this.stage.append(this.moves);
      this.targetEls={};Object.keys(this.config.targets).forEach((type,i)=>{const row=el('div','wam-target');row.style.top=(91+i*48)+'px';const count=el('span');row.append(icon(type),count);this.stage.append(row);this.targetEls[type]={row,count};});
      const title=el('div','wam-board-title');title.append(el('span','',`LEVEL ${this.config.id} · ${this.config.name.toUpperCase()}`));
      const hint=button('HINT',()=>this.showHint());hint.className='';hint.setAttribute('aria-label','Show a matching move');title.append(hint);this.stage.append(title);
      this.board=el('div','wam-grid');this.board.setAttribute('role','group');this.board.setAttribute('aria-label','Match board, 6 columns and 10 rows');this.stage.append(this.board);
      this.cells=Array.from({length:E.ROWS*E.COLS},(_,i)=>this.createCell(i));
      this.boosterButtons={};const names={rocket:'Lip Laser',hammer:'Heel Smash',disco:'Disco Ball',swap:'Free Swap'};
      Object.entries(names).forEach(([name,label],i)=>{
        const b=el('button','wam-booster');b.type='button';b.style.left=(35+i*149)+'px';b.setAttribute('aria-label',label);b.title=label;
        const count=el('span');b.append(count);b.addEventListener('click',()=>{if(this.busy||this.paused||this.ended||this.game.boosters[name]<=0)return;audio();this.selected=null;this.booster=this.booster===name?null:name;this.render();if(this.booster)this.toast(name==='swap'?'Choose two neighbouring icons':'Tap an icon to use '+label);});
        this.stage.append(b);this.boosterButtons[name]={b,count};
      });
      const pause=el('button','wam-pause');pause.type='button';pause.setAttribute('aria-label','Pause game');pause.addEventListener('click',()=>this.pause());this.stage.append(pause);
      this.backgroundPause=()=>{if(document.hidden||this.backgrounded){this.cancelDrag();window.__wamAudio?.suspend?.();if(!this.ended&&!this.paused)this.pause(true);}};
      this.onPause=()=>{this.backgrounded=true;this.backgroundPause();};this.onResume=()=>{this.backgrounded=false;};
      document.addEventListener('visibilitychange',this.backgroundPause);document.addEventListener('pause',this.onPause);document.addEventListener('resume',this.onResume);
      this.onBack=()=>this.pause();document.addEventListener('backbutton',this.onBack);
      this.render();this.startHintTimer();
      this.toast(this.config.id>=6?'NEW ICONS · '+this.config.name.toUpperCase():this.config.name.toUpperCase(),1600);
    }
    wait(ms) {return new Promise(resolve=>setTimeout(resolve,matchMedia('(prefers-reduced-motion: reduce)').matches?Math.min(ms,35):ms));}
    async active() {while(this.paused&&!this.disposed)await this.wait(90);return !this.disposed;}
    animate(node,frames,options) {
      if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
      return node.animate?.(frames,options);
    }
    createCell(i) {
      const b=el('button','wam-cell');b.type='button';b.dataset.cell=String(i);
      const img=el('img');img.draggable=false;const mark=el('span','wam-special-mark');b.append(img,mark);
      b.addEventListener('pointerdown',e=>{
        if(e.button!==0||this.busy||this.paused||this.ended||this.drag)return;
        e.preventDefault();audio();this.clearHint();
        this.drag={i,id:e.pointerId,x:e.clientX,y:e.clientY,node:b};try{b.setPointerCapture(e.pointerId);}catch(_){}
      });
      b.addEventListener('pointermove',e=>{
        const d=this.drag;if(!d||d.id!==e.pointerId||d.i!==i)return;e.preventDefault();
        if(this.game.bags.has(i))return;
        const scale=this.view.stage.getBoundingClientRect().width/720;
        const dx=Math.max(-55,Math.min(55,(e.clientX-d.x)/scale)),dy=Math.max(-50,Math.min(50,(e.clientY-d.y)/scale));
        b.style.transform=`translate(${dx}px,${dy}px)`;b.style.zIndex='20';
      });
      b.addEventListener('pointerup',e=>{
        const d=this.drag;if(!d||d.id!==e.pointerId||d.i!==i)return;e.preventDefault();
        const dx=e.clientX-d.x,dy=e.clientY-d.y;this.cancelDrag();
        const rect=b.getBoundingClientRect(),threshold=Math.max(8,Math.min(rect.width,rect.height)*.23);
        if(Math.max(Math.abs(dx),Math.abs(dy))<threshold||this.booster&&this.booster!=='swap'){void this.tap(i);return;}
        const {r,c}=E.coords(i),horizontal=Math.abs(dx)>Math.abs(dy),nr=r+(horizontal?0:Math.sign(dy)),nc=c+(horizontal?Math.sign(dx):0);
        if(nr>=0&&nr<E.ROWS&&nc>=0&&nc<E.COLS)void this.swap(i,E.key(nr,nc));
      });
      b.addEventListener('pointercancel',()=>this.cancelDrag());b.addEventListener('lostpointercapture',()=>{if(this.drag?.i===i)this.cancelDrag();});
      b.addEventListener('click',e=>{if(e.detail===0)void this.tap(i);});
      this.board.append(b);return {b,img,mark};
    }
    cancelDrag(){if(!this.drag)return;const {node,id}=this.drag;this.drag=null;node.style.transform='';node.style.zIndex='';try{node.releasePointerCapture(id);}catch(_){}}
    clearHint(){clearTimeout(this.hintTimer);this.cells?.forEach(({b})=>b.classList.remove('hint'));}
    startHintTimer(){this.clearHint();if(!this.disposed)this.hintTimer=setTimeout(()=>this.showHint(),6500);}
    showHint(){if(this.busy||this.paused||this.ended||this.disposed)return;this.clearHint();const pair=this.game.findMove();if(pair)pair.forEach(i=>this.cells[i].b.classList.add('hint'));}
    toast(text,duration=1200){this.stage.querySelector('.wam-toast')?.remove();const n=el('div','wam-toast',text);n.setAttribute('role','status');this.stage.append(n);setTimeout(()=>n.remove(),duration);}
    render(){
      this.moves.textContent=String(this.game.moves);
      Object.entries(this.targetEls).forEach(([type,{row,count}])=>{count.textContent=this.game.targets[type]===0?'✓':String(this.game.targets[type]);row.classList.toggle('done',this.game.targets[type]===0);row.setAttribute('aria-label',`${C.PIECES[type].label}: ${this.game.targets[type]} remaining`);});
      Object.entries(this.boosterButtons).forEach(([name,{b,count}])=>{count.textContent=this.game.boosters[name];b.disabled=this.game.boosters[name]<=0||this.ended;b.classList.toggle('active',name===this.booster);b.setAttribute('aria-pressed',String(name===this.booster));});
      this.cells.forEach(({b,img,mark},i)=>{
        const p=this.game.board[i],bag=this.game.bags.get(i),type=bag?'handbag':p?.special==='disco'?'disco':p?.type,def=C.PIECES[type];
        b.classList.toggle('selected',this.selected===i);b.dataset.special=bag?'':p?.special||'';b.dataset.piece=type||'empty';
        b.dataset.bagHits=String(bag||0);img.style.visibility=def?'visible':'hidden';
        if(def){const src=bag===2?'handbag_locked.png':def.image;if(img.getAttribute('src')!==src)img.src=src;img.alt='';img.className=def.card?'supplied':'';}
        const special=bag?'':p?.special,labels={row:'↔',column:'↕',wrapped:'✦'};mark.textContent=labels[special]||'';mark.hidden=!labels[special];mark.style.display=labels[special]?'flex':'none';
        const {r,c}=E.coords(i);b.setAttribute('aria-label',`${bag?'Handbag, '+bag+' hits left':def?.label||'Empty'}${special?' '+special:''}, row ${r+1}, column ${c+1}`);
      });
      this.board.setAttribute('aria-busy',String(this.busy));
    }
    async tap(i){
      if(this.busy||this.paused||this.ended||this.disposed)return;audio();this.clearHint();
      if(this.booster&&this.booster!=='swap'){
        const wave=this.game.useBooster(this.booster,i);if(!wave){this.toast('Choose a playable icon');return;}
        this.busy=true;this.booster=null;this.selected=null;this.render();await this.resolve(wave);return;
      }
      if(this.game.bags.has(i)){this.selected=null;this.toast('Match beside the handbag twice');this.render();return;}
      if(this.selected===i){this.selected=null;this.render();return;}
      if(this.selected!==null&&this.game.adjacent(this.selected,i)){await this.swap(this.selected,i);return;}
      this.selected=i;this.render();this.startHintTimer();
    }
    async swap(a,b){
      if(this.busy||this.paused||this.ended||this.disposed)return;
      if(this.game.bags.has(a)||this.game.bags.has(b)){this.toast('Match beside the handbag twice');return;}
      this.busy=true;this.selected=null;this.clearHint();this.render();
      const x=E.coords(a),y=E.coords(b),dx=(y.c-x.c)*84,dy=(y.r-x.r)*74.688;
      const animations=[this.animate(this.cells[a].b,[{transform:'none'},{transform:`translate(${dx}px,${dy}px)`}],{duration:160,fill:'forwards',easing:'ease-in-out'}),this.animate(this.cells[b].b,[{transform:'none'},{transform:`translate(${-dx}px,${-dy}px)`}],{duration:160,fill:'forwards',easing:'ease-in-out'})];
      await this.wait(165);if(!await this.active()){animations.forEach(a=>a?.cancel());return;}
      const result=this.game.attempt(a,b,this.booster==='swap');
      if(!result.valid){
        animations.forEach(a=>a?.reverse());await this.wait(165);animations.forEach(a=>a?.cancel());
        this.busy=false;this.render();this.startHintTimer();return;
      }
      animations.forEach(a=>a?.cancel());this.booster=null;this.render();await this.resolve(result.wave);
    }
    async resolve(first){
      this.busy=true;this.render();let wave=first,combo=0;
      try {
        while(wave?.cells.length){
          if(!await this.active())return;
          if(++combo>80){this.game.reshuffle();this.toast('RESHUFFLE');break;}
          const expanded=this.game.expand(wave.cells,wave.skipDiscos);audio('match');
          if(wave.label)this.toast(wave.label);else if(combo>1)this.toast(`COMBO ×${combo}`);else if(wave.spawns?.length)this.toast(wave.spawns.some(s=>s.special==='disco')?'DISCO CREATED!':'SPECIAL CREATED!');
          const pops=expanded.map(i=>this.animate(this.cells[i].img,[{transform:'scale(1)',opacity:1},{transform:'scale(1.12)',opacity:1,offset:.3},{transform:'scale(.05)',opacity:0}],{duration:200,fill:'forwards',easing:'ease-in'}));
          await this.wait(205);if(!await this.active()){pops.forEach(a=>a?.cancel());return;}
          const result=this.game.clear(wave,combo);pops.forEach(a=>a?.cancel());record('matches',result.cleared.length);record('handbags',result.bagsCleared);
          this.render();const falls=this.game.fall();this.render();
          const drops=falls.map(f=>this.animate(this.cells[f.at].img,[{transform:`translateY(${-f.distance*74.688}px)`,opacity:.5},{transform:'translateY(0)',opacity:1}],{duration:Math.min(380,200+f.distance*22),easing:'cubic-bezier(.3,.6,.4,1)',fill:'both'}));
          await this.wait(falls.length?390:20);drops.forEach(a=>a?.cancel());
          wave=this.game.scan();
        }
        if(!await this.active())return;
        if(this.game.finished){this.end();return;}
        if(!this.game.findMove()){this.game.reshuffle();this.toast('NO MOVES · RESHUFFLE');this.render();await this.wait(250);}
      } catch(error){console.error('Wam Bam move failed',error);this.game.fall();this.game.reshuffle();this.toast('Board refreshed. Keep playing.');}
      finally{if(!this.disposed&&!this.ended){this.busy=false;this.render();this.startHintTimer();}}
    }
    pause(force=false){
      if(this.paused||this.ended||this.disposed||this.busy&&!force)return;
      this.paused=true;this.cancelDrag();this.clearHint();const modal=dialog(this.stage,'Paused',`Level ${this.config.id} · ${this.config.name}`);
      modal.card.append(button('RESUME',()=>{modal.close();this.paused=false;audio();this.startHintTimer();},'cyan'),button('HOW TO PLAY',()=>{const help=dialog(this.stage,'How to play','Match 3 to collect icons. Match 4 for a line blast. Match a T or L for an area blast. Match 5 or a square for a Disco. Swap specials together for bigger clears.');help.card.append(button('BACK',()=>help.close()));}),button('ROAD MAP',()=>this.navigate('Level Map'),'secondary'),button('HOME',()=>this.navigate('Untitled scene'),'secondary'));
    }
    end(){
      if(this.ended)return;this.ended=true;this.busy=true;this.clearHint();this.render();
      if(this.game.won){
        const stars=C.complete(storage,this.config,this.game.moves,this.game.score);
        C.write(storage,'wambam-coins',Math.max(0,C.read(storage,'wambam-coins',0))+250);C.write(storage,'wambam-lives',Math.min(5,C.read(storage,'wambam-lives',5)+1));audio('coin');
        const modal=dialog(this.stage,`Level ${this.config.id} complete!`,this.config.id===C.TOTAL?'All 9 levels complete. Replay any level to improve your stars.':`${this.config.name} complete. Level ${this.config.id+1} is ready.`);
        modal.card.prepend(el('div','wam-eyebrow','WAM BAM · THANK U MAM'));modal.card.append(el('div','wam-stars','★'.repeat(stars)+'☆'.repeat(3-stars)),el('p','',`${this.game.score.toLocaleString()} points · ${this.game.moves} moves left`),el('p','', '+250 coins'));
        if(this.config.id<C.TOTAL)modal.card.append(button(`PLAY LEVEL ${this.config.id+1}`,()=>this.navigate('Game'),'cyan'));
        modal.card.append(button('ROAD MAP',()=>this.navigate('Level Map')),button('REPLAY LEVEL',()=>this.retry(),'secondary'));
      }else{
        C.write(storage,'wambam-lives',Math.max(0,C.read(storage,'wambam-lives',5)-1));
        const modal=dialog(this.stage,'Out of moves',`Level ${this.config.id} · ${this.config.name}`);modal.card.append(targets(this.config,this.game.targets),button('TRY AGAIN',()=>this.retry(),'cyan'),button('ROAD MAP',()=>this.navigate('Level Map'),'secondary'));
      }
    }
    retry(){C.write(storage,'wambam-selected-level',this.config.id);this.navigate('Game');}
    navigate(name){if(this.disposed)return;this.scene.__wam94NextScene=name;this.dispose();}
    dispose(){this.disposed=true;this.cancelDrag();this.clearHint();document.removeEventListener('visibilitychange',this.backgroundPause);document.removeEventListener('pause',this.onPause);document.removeEventListener('resume',this.onResume);document.removeEventListener('backbutton',this.onBack);this.view.dispose();}
  }
  window.WamUI={C,E,storage,el,button,icon,targets,dialog,createHost,audio,GameView};
})();
