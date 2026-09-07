(function(){
  'use strict';
  const U=window.WamUI,{C,storage,el,button,icon,targets,dialog}=U;
  const ns='http://www.w3.org/2000/svg';
  class MapView {
    constructor(scene){
      this.scene=scene;this.progress=C.progress(storage);this.selected=this.progress.selected;this.disposed=false;
      this.view=U.createHost('wambam-level-map','road_map_candy_lounge_v2.png');this.stage=this.view.stage;this.installStyle();
      const header=el('header','wam-map-header');
      header.append(el('div','wam-eyebrow','WAM BAM · THANK U MAM'),el('h1','','YOUR WAM BAM JOURNEY'));
      const cleared=Math.max(this.progress.highest,this.progress.unlocked-1);
      header.append(el('p','',`${cleared} / ${C.TOTAL} levels   ·   ${this.progress.stars.reduce((a,b)=>a+b,0)} rating stars`));
      const home=button('⌂',()=>this.navigate('Untitled scene'),'secondary');home.classList.add('wam-map-home');home.setAttribute('aria-label','Home');header.append(home);this.stage.append(header);
      this.tabs=el('nav','wam-area-tabs');this.tabs.setAttribute('aria-label','Campaign areas');
      C.AREAS.forEach((area,i)=>{const b=button(`${area.from}–${area.to}`,()=>this.showArea(i),'secondary');b.setAttribute('aria-label',`Area ${i+1}: ${area.name}`);this.tabs.append(b);});this.stage.append(this.tabs);
      this.scroller=el('div','wam-map-scroll');this.scroller.id='wambam-map-scroller';this.scroller.tabIndex=0;this.scroller.setAttribute('aria-label',`Level map. Scroll to explore ${C.TOTAL} levels.`);
      this.world=el('div','wam-map-world');this.scroller.append(this.world);this.stage.append(this.scroller);
      const footer=el('footer','wam-map-footer'),actions=el('div','wam-map-actions');
      actions.append(button('MY LEVEL',()=>this.focus(this.progress.unlocked),'secondary'),button('LEVEL LIST',()=>this.list(),'secondary'),button('MY AREAS',()=>this.rooms(),'secondary'));footer.append(actions);
      footer.append(button(`PLAY LEVEL ${this.progress.unlocked}`,()=>this.preview(this.progress.unlocked),'cyan'));this.stage.append(footer);
      this.back=()=>{const modal=this.stage.querySelector('.wam-shade');if(modal)modal.remove();else this.navigate('Untitled scene');};document.addEventListener('backbutton',this.back);
      this.resize=()=>this.focus(this.selected,false);window.addEventListener('resize',this.resize);
      const initial=this.selected;this.showArea(Math.floor((initial-1)/10));this.selected=initial;
      requestAnimationFrame(()=>{if(!this.disposed)this.focus(this.selected,false);});
    }
    installStyle(){
      if(document.getElementById('wam95-map-style'))return;const s=el('style');s.id='wam95-map-style';s.textContent=`
        .wam-map-header{position:absolute;left:0;right:0;top:0;height:170px;padding:22px 20px 18px 122px;z-index:20;background:linear-gradient(#35152f,#170d22);border-bottom:2px solid #b64485}
        .wam-map-header .wam-eyebrow{font-size:16px;margin:0 0 10px;letter-spacing:3px}.wam-map-header h1{font-size:28px;margin:0;color:#ffe7af}.wam-map-header p{margin:14px 0 0;font-size:22px;color:#ffeac9}
        .wam-map-home{position:absolute;left:24px;top:40px;width:74px;height:74px;padding:0;font-size:40px!important}
        .wam-area-tabs{position:absolute;left:0;right:0;top:170px;height:90px;display:flex;gap:12px;padding:12px 24px;background:#28152e;z-index:20}.wam-area-tabs .wam-button{flex:1;padding:10px;font-size:23px;border-radius:18px}.wam-area-tabs [aria-current=true]{border-color:#6df5e7;color:#6df5e7;background:#54344e}
        .wam-map-scroll{position:absolute;top:260px;bottom:197px;left:0;right:0;overflow-y:auto;overflow-x:hidden;touch-action:pan-y;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#eb80b0 #231128;-webkit-overflow-scrolling:touch;background:#140a22}
        .wam-map-world{position:relative;width:100%;height:2450px;background:radial-gradient(ellipse at 20% 25%,#61305e55,transparent 38%),radial-gradient(ellipse at 90% 75%,#27697066,transparent 42%),linear-gradient(#1c0f2d,#341730,#160d24)}
        .wam-route{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}.wam-area-title{position:absolute;top:55px;left:40px;right:40px;text-align:center;color:#ffdea2}.wam-area-title h2{font-size:43px;margin:8px}.wam-area-title p{font-size:22px;margin:12px;color:#ddb6cb}
        .wam-map-stop{position:absolute;width:230px;transform:translate(-50%,-50%);text-align:center;color:#fff}
        .wam-map-node{position:relative;display:block;margin:0 auto;width:98px;height:98px;border:5px solid #ffec9c;border-radius:50%;background:radial-gradient(circle at 30% 20%,#ff92c4,#e51c82 50%,#940b50);color:#fff;font-size:44px;font-weight:900;text-shadow:0 3px #590b36;box-shadow:0 6px 0 #781642,0 0 0 4px #6b2352;touch-action:pan-y!important}
        .wam-map-node.complete{background:radial-gradient(circle at 30% 20%,#6cf8ec,#138c95 60%,#145169)}.wam-map-node.locked{background:linear-gradient(#524156,#27202f);border-color:#b89769;color:#d0bbc7;text-shadow:none;box-shadow:0 5px 0 #191021}.wam-map-node.current{box-shadow:0 5px 0 #791445,0 0 0 6px #fff5aa,0 0 28px #ffba37}
        .wam-node-lock{position:absolute;right:-6px;bottom:-3px;font-size:25px}.wam-node-stars{font-weight:900;font-size:25px;color:#ffde78;letter-spacing:3px;text-shadow:0 2px 4px #000;margin-top:9px}
        .wam-node-name{display:inline-block;margin-top:6px;padding:7px 10px;border:1px solid #bb899865;border-radius:13px;background:#271328f2;color:#fff3d3;font-size:18px;font-weight:800;max-width:245px}
        .wam-node-you{position:absolute;top:-35px;left:48px;right:48px;border-radius:8px;background:#fff0a6;color:#731544;padding:5px;font-size:17px;font-weight:900}
        .wam-map-footer{position:absolute;left:0;right:0;bottom:0;height:197px;padding:18px 24px 24px;background:linear-gradient(#241128,#170d22);border-top:3px solid #9c4475;z-index:30}.wam-map-footer>.wam-button{width:100%;margin-top:14px}
        .wam-map-actions{display:flex;gap:10px}.wam-map-actions .wam-button{flex:1;min-height:52px;padding:10px 4px;font-size:19px}
        .wam-level-picker{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin:25px 0}.wam-level-picker .wam-button{min-height:80px;border-radius:16px;padding:7px;font-size:26px;margin:0}.wam-level-picker small{display:block;font-size:12px;margin-top:6px}
        .wam-room-card{padding:18px;border:2px solid #86506f;border-radius:24px;margin-top:20px;background:#29162f}.wam-room-card h3{font-size:29px;color:#ffe2a6;margin:8px}.wam-room-card p{font-size:21px}.wam-room-card .wam-button{font-size:20px;padding:12px}.wam-room-card.locked{opacity:.65}
        .wam-room-scene{height:250px;position:relative;overflow:hidden;border:2px solid #bb7a94;border-radius:18px;background:linear-gradient(#1b132b 65%,#533148 65%,#301a2c);margin:15px 0}.wam-room-scene:before{content:'';position:absolute;top:15px;left:8%;right:8%;height:180px;border:3px solid #623348;border-radius:70px 70px 0 0;background:repeating-linear-gradient(90deg,#482131 0 20px,#371825 20px 35px)}
        .wam-room-scene{border-color:var(--room-colour)}.room-object{display:none;width:100%;height:100%;object-fit:contain;mix-blend-mode:screen}.wam-room-scene[data-d0=true] .wam-room-sign .room-object,.wam-room-scene[data-d1=true] .wam-room-seat .room-object,.wam-room-scene[data-d2=true] .wam-room-feature .room-object{display:block}
        .wam-room-scene[data-area="1"] .wam-room-sign{left:40%;right:40%;top:15px;height:105px;border-radius:40px;font-size:0}.wam-room-scene[data-area="1"] .wam-room-seat,.wam-room-scene[data-area="3"] .wam-room-seat{display:flex;gap:12px;justify-content:space-around}.wam-room-seat .room-object{width:24%;object-fit:contain}
        .wam-room-scene[data-area="2"][data-d0=true] .wam-room-sign{background:repeating-radial-gradient(circle at 25% 50%,#231a35 0 9px,#df6a9d 10px 12px,#241b37 13px 22px);color:#fff}
        .wam-room-scene[data-area="3"] .wam-room-sign{top:15px;height:150px;left:32%;right:32%;border-radius:70px 70px 0 0}.wam-room-scene[data-area="3"][data-d0=true] .wam-room-sign{border:6px solid #ffe099;background:linear-gradient(90deg,#815039,#ffdb9277,#684267);font-size:20px;color:#fff2c8}
        .wam-room-scene[data-area="1"][data-d3=true] .wam-room-floor{background:repeating-linear-gradient(90deg,#f1a4d1 0 30px,#c97cbd 30px 60px)}
        .wam-room-scene[data-area="2"][data-d3=true]{background:conic-gradient(from 150deg at 10% 0%,#342244 0 16deg,#f8df9255 17deg 35deg,#252039 36deg 180deg),linear-gradient(#1a1728,#533148)}
        .wam-room-sign{position:absolute;top:35px;left:25%;right:25%;padding:8px;border:3px solid #665064;border-radius:14px;font-size:25px;font-weight:900;color:#78556c;background:#1a1225}.wam-room-scene[data-d0=true] .wam-room-sign{border-color:#ff87ca;color:#fff2df;text-shadow:0 0 8px #ff50bb;box-shadow:0 0 14px #fd42af}
        .wam-room-seat{position:absolute;left:16%;right:16%;bottom:40px;height:52px;border:5px solid #532b42;border-radius:22px 22px 5px 5px;background:#351f31}.wam-room-scene[data-d1=true] .wam-room-seat{background:repeating-linear-gradient(90deg,#e64283 0 42px,#c02465 42px 47px);border-color:#f2b1a9;box-shadow:0 6px #63224b}
        .wam-room-feature{position:absolute;width:57px;height:92px;bottom:37px;right:16px;border:4px solid #45344e;border-radius:30px 30px 6px 6px;background:#231e2e}.wam-room-scene[data-d2=true] .wam-room-feature{border-color:#5eeced;background:repeating-linear-gradient(#bf64cd 0 9px,#442a58 9px 14px);box-shadow:0 0 14px #68dbe0}
        .wam-room-floor{position:absolute;left:7%;right:7%;bottom:-18px;height:50px;transform:perspective(70px) rotateX(25deg);background:#382538}.wam-room-scene[data-d3=true] .wam-room-floor{background:repeating-conic-gradient(#edbee0 0 25%,#755c9e 0 50%) 0/35px 35px;box-shadow:0 -5px 25px #dc8bd5}
      `;document.head.append(s);
    }
    showArea(index){
      this.area=index;this.world.replaceChildren();this.nodes={};const area=C.AREAS[index];
      [...this.tabs.children].forEach((b,i)=>b.setAttribute('aria-current',String(i===index)));
      const heading=el('div','wam-area-title');heading.append(el('div','wam-eyebrow',`AREA ${index+1}`),el('h2','',area.name),el('p','',`Levels ${area.from} to ${area.to} · Complete levels to decorate`));this.world.append(heading);
      const configs=C.levels.slice(index*10,index*10+10),xs=[.34,.62,.66,.43,.27,.44,.66,.60,.32,.49];
      const points=configs.map((_,i)=>({x:xs[i]*720,y:2220-i*205}));
      const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 720 2450');svg.classList.add('wam-route');let path=`M${points[0].x} ${points[0].y}`;
      for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],mid=(a.y+b.y)/2;path+=` C${a.x} ${mid} ${b.x} ${mid} ${b.x} ${b.y}`;}
      for(const [width,colour,dash]of [[54,'#65354f',false],[38,area.colour,false],[3,'#fff0ae',true]]){const p=document.createElementNS(ns,'path');p.setAttribute('d',path);p.setAttribute('fill','none');p.setAttribute('stroke',colour);p.setAttribute('stroke-width',width);if(dash)p.setAttribute('stroke-dasharray','12 13');svg.append(p);}this.world.append(svg);
      configs.forEach((config,i)=>{
        const {x,y}=points[i],locked=config.id>this.progress.unlocked,completed=config.id<this.progress.unlocked||config.id<=this.progress.highest;
        const stop=el('div','wam-map-stop');stop.style.left=x+'px';stop.style.top=y+'px';
        const node=el('button','wam-map-node'+(locked?' locked':'')+(completed?' complete':'')+(config.id===this.progress.unlocked?' current':''));node.type='button';node.dataset.level=String(config.id);node.textContent=String(config.id);
        node.setAttribute('aria-label',`Level ${config.id}, ${config.name}${locked?', locked':completed?', completed':', ready to play'}`);if(locked)node.append(el('span','wam-node-lock','🔒'));node.addEventListener('click',()=>this.preview(config.id));stop.append(node);
        const stars=this.progress.stars[config.id-1];stop.append(el('div','wam-node-stars',stars?'★'.repeat(stars)+'☆'.repeat(3-stars):completed?'✓ COMPLETE':'☆ ☆ ☆'),el('div','wam-node-name',config.name));
        if(config.id===this.progress.unlocked)stop.append(el('div','wam-node-you','PLAY NEXT'));this.world.append(stop);this.nodes[config.id]={node,stop,y};
      });
      this.scroller.scrollTop=2450;this.selected=area.from;
    }
    focus(id,smooth=true){
      const area=Math.floor((id-1)/10);if(this.area!==area)this.showArea(area);this.selected=id;const point=this.nodes[id];
      this.scroller.scrollTo({top:Math.max(0,point.y-this.scroller.clientHeight*.52),behavior:smooth&&!matchMedia('(prefers-reduced-motion: reduce)').matches?'smooth':'instant'});point.node.focus({preventScroll:true});
    }
    preview(id){
      if(this.disposed)return;U.audio();this.stage.querySelector('.wam-shade')?.remove();this.selected=id;
      const config=C.level(id),locked=id>this.progress.unlocked,stars=this.progress.stars[id-1],modal=dialog(this.stage,config.name);
      modal.card.prepend(el('div','wam-eyebrow',`LEVEL ${id} · ${config.moves} MOVES · ${config.difficulty}`));if(stars)modal.card.append(el('div','wam-stars','★'.repeat(stars)+'☆'.repeat(3-stars)));
      if(config.mask){const preview=el('div','wam-mini-board');preview.style.gridTemplateColumns=`repeat(${config.mask[0].length},1fr)`;preview.setAttribute('aria-label','Board shape preview');config.mask.forEach((row,r)=>[...row].forEach((cell,c)=>{const blocked=[...(config.bags||[]),...(config.crates||[])].some(([y,x])=>y===r&&x===c),ice=config.ice?.some(([y,x])=>y===r&&x===c);preview.append(el('span',cell==='.'?'hole':blocked?'blocker':ice?'frozen':''));}));modal.card.append(preview);}
      modal.card.append(targets(config),el('p','',locked?`Finish Level ${id-1} to play this level.`:config.tip));const play=button(locked?'LEVEL LOCKED':`PLAY LEVEL ${id}`,()=>this.start(id),'cyan');play.disabled=locked;modal.card.append(play,button('BACK TO MAP',()=>modal.close(),'secondary'));
    }
    list(){
      const modal=dialog(this.stage,'Choose a level','View targets and board shapes, or replay completed levels.'),grid=el('div','wam-level-picker');
      C.levels.forEach(config=>{const locked=config.id>this.progress.unlocked,b=button(String(config.id),()=>{modal.close();this.focus(config.id);this.preview(config.id);},locked?'secondary':'');b.append(el('small','',locked?'LOCKED':this.progress.stars[config.id-1]?'★'.repeat(this.progress.stars[config.id-1]):'VIEW'));b.setAttribute('aria-label',`View Level ${config.id}`);grid.append(b);});modal.card.append(grid,button('CLOSE',()=>modal.close(),'secondary'));
    }
    rooms(){
      this.stage.querySelector('.wam-shade')?.remove();const state=C.renovation(storage),modal=dialog(this.stage,'Make Wam Bam yours',`${state.available} decoration stars available. Earn one for each level you complete for the first time.`);
      C.AREAS.forEach((area,a)=>{
        const locked=state.earned<area.from-1,card=el('section','wam-room-card'+(locked?' locked':''));card.append(el('h3','',area.name));
        const scene=el('div','wam-room-scene');scene.dataset.area=String(a);scene.style.setProperty('--room-colour',area.colour);scene.setAttribute('role','img');scene.setAttribute('aria-label',`${area.name}: ${state.decorated[a].filter(Boolean).length} of 4 decorations added`);state.decorated[a].forEach((done,i)=>scene.dataset['d'+i]=String(done));
        const sign=el('div','wam-room-sign',a===0?'WAM BAM':a===1?'VANITY':a===2?'RECORDS':'COUTURE');
        const seat=el('div','wam-room-seat'),feature=el('div','wam-room-feature'),floor=el('div','wam-room-floor');
        if(a===1){const img=icon('mirror');img.className='room-object';sign.append(img);}
        if(a===1||a===3){['lips','bow','heel'].forEach(type=>{const img=icon(type);img.className='room-object';seat.append(img);});}
        if(a>0){const img=icon(a===1?'compact':a===2?'disco':'diamond');img.className='room-object';feature.append(img);}
        scene.append(sign,seat,feature,floor);card.append(scene);
        if(locked)card.append(el('p','',`Complete Level ${area.from-1} to decorate this area.`));
        area.items.forEach((name,i)=>{const done=state.decorated[a][i],cost=C.DECOR_COSTS[i],b=button(done?`✓ ${name}`:`${name} · ${cost} stars`,()=>{if(C.decorate(storage,a,i)){U.audio('coin');modal.close();this.rooms();}},done?'secondary':'cyan');b.disabled=done||locked||state.available<cost;card.append(b);});modal.card.append(card);
      });modal.card.append(button('BACK TO MAP',()=>modal.close(),'secondary'));
    }
    start(id){if(id>this.progress.unlocked||this.disposed)return;C.write(storage,'wambam-selected-level',id);this.navigate('Game');}
    navigate(name){this.scene.__wam94NextScene=name;this.dispose();}
    dispose(){if(this.disposed)return;this.disposed=true;document.removeEventListener('backbutton',this.back);window.removeEventListener('resize',this.resize);this.view.dispose();}
  }
  window.WamMapView=MapView;
})();
