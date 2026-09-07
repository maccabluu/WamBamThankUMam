(function(){
  'use strict';
  const U=window.WamUI,{C,storage,el,button,icon,targets,dialog}=U;
  class MapView {
    constructor(scene){
      this.scene=scene;this.progress=C.progress(storage);this.selected=this.progress.selected;this.disposed=false;
      this.view=U.createHost('wambam-level-map','road_map_candy_lounge_v2.png');this.stage=this.view.stage;
      this.installStyle();
      const header=el('header','wam-map-header');
      header.append(el('div','wam-eyebrow','THE BAM LOUNGE'),el('h1','','WAM BAM JOURNEY'));
      const starTotal=this.progress.stars.reduce((a,b)=>a+b,0);
      const cleared=Math.max(this.progress.highest,this.progress.unlocked-1);
      header.append(el('p','',`${cleared} / ${C.TOTAL} complete   ·   ${starTotal} / ${C.TOTAL*3} stars`));
      const home=button('⌂',()=>this.navigate('Untitled scene'),'secondary');home.classList.add('wam-map-home');home.setAttribute('aria-label','Home');header.append(home);this.stage.append(header);
      this.scroller=el('div','wam-map-scroll');this.scroller.id='wambam-map-scroller';this.scroller.tabIndex=0;this.scroller.setAttribute('aria-label','Level map. Scroll to explore levels 1 to 9.');
      this.world=el('div','wam-map-world');this.scroller.append(this.world);this.stage.append(this.scroller);
      const points=[[39,88.35],[49.4,77.65],[47.3,68.05],[36.5,59.05],[57.1,52.8],[54.9,45.9],[44.4,38.5],[65,32],[57.1,25.9]];
      this.nodes=[];
      C.levels.forEach((config,i)=>{
        const [x,y]=points[i],locked=config.id>this.progress.unlocked,completed=config.id<this.progress.unlocked||config.id<=this.progress.highest;
        const stop=el('div','wam-map-stop');stop.style.left=x+'%';stop.style.top=y+'%';
        const node=el('button','wam-map-node'+(locked?' locked':'')+(completed?' complete':'')+(config.id===this.progress.unlocked?' current':''));node.type='button';node.dataset.level=String(config.id);node.textContent=String(config.id);
        node.setAttribute('aria-label',`Level ${config.id}, ${config.name}${locked?', locked':completed?', completed':', ready to play'}`);
        if(locked)node.append(el('span','wam-node-lock','🔒'));
        // Native click respects pan-y cancellation. Swiping across a node never launches a level.
        node.addEventListener('click',()=>this.preview(config.id));stop.append(node);
        const stars=this.progress.stars[i];stop.append(el('div','wam-node-stars',stars?'★'.repeat(stars)+'☆'.repeat(3-stars):completed?'✓ COMPLETE':'☆ ☆ ☆'));
        stop.append(el('div','wam-node-name',config.name));
        if(config.id===this.progress.unlocked)stop.append(el('div','wam-node-you','PLAY NEXT'));
        this.world.append(stop);this.nodes.push({node,stop,y});
      });
      const future=el('div','wam-map-future','MORE LEVELS SOON');this.world.append(future);
      const footer=el('footer','wam-map-footer');
      const actions=el('div','wam-map-actions');
      actions.append(button('MY LEVEL',()=>this.focus(this.progress.unlocked),'secondary'),button('LEVEL LIST',()=>this.list(),'secondary'));footer.append(actions);
      footer.append(button(`PLAY LEVEL ${this.progress.unlocked}`,()=>this.preview(this.progress.unlocked),'cyan'));this.stage.append(footer);
      this.back=()=>{const modal=this.stage.querySelector('.wam-shade');if(modal)modal.remove();else this.navigate('Untitled scene');};document.addEventListener('backbutton',this.back);
      this.resize=()=>this.focus(this.selected,false);window.addEventListener('resize',this.resize);
      requestAnimationFrame(()=>{if(!this.disposed)this.focus(this.selected,false);});
    }
    installStyle(){
      if(document.getElementById('wam94-map-style'))return;const s=el('style');s.id='wam94-map-style';s.textContent=`
        .wam-map-header{position:absolute;left:0;right:0;top:0;height:167px;padding:20px 30px 18px 130px;z-index:20;background:linear-gradient(#35152f,#170d22);border-bottom:3px solid #b64485;box-shadow:0 12px 25px #170b20a8}
        .wam-map-header .wam-eyebrow{font-size:16px;margin:0 0 9px;letter-spacing:4px}.wam-map-header h1{font-size:32px;margin:0;color:#ffe7af;letter-spacing:.6px}.wam-map-header p{margin:12px 0 0;font-size:23px;color:#ffeac9}
        .wam-map-home{position:absolute;left:25px;top:35px;width:78px;height:78px;padding:0;font-size:44px!important}
        .wam-map-scroll{position:absolute;top:167px;bottom:197px;left:0;right:0;overflow-y:auto;overflow-x:hidden;touch-action:pan-y;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#eb80b0 #231128;-webkit-overflow-scrolling:touch;background:#140a22}
        .wam-map-world{position:relative;width:100%;height:3000px;background:url('road_map_candy_lounge_v2.png') center/100% 100% no-repeat}
        .wam-map-stop{position:absolute;width:230px;transform:translate(-50%,-50%);text-align:center;color:#fff}
        .wam-map-node{position:relative;display:block;margin:0 auto;width:96px;height:96px;border:5px solid #ffec9c;border-radius:50%;background:radial-gradient(circle at 30% 20%,#ff92c4,#e51c82 50%,#940b50);color:#fff;font-size:44px;font-weight:900;text-shadow:0 3px #590b36;box-shadow:0 6px 0 #781642,0 0 0 4px #6b2352;touch-action:pan-y!important}
        .wam-map-node.complete{background:radial-gradient(circle at 30% 20%,#6cf8ec,#138c95 60%,#145169)}.wam-map-node.locked{background:linear-gradient(#524156,#27202f);border-color:#b89769;color:#d0bbc7;text-shadow:none;box-shadow:0 5px 0 #191021}.wam-map-node.current{box-shadow:0 5px 0 #791445,0 0 0 6px #fff5aa,0 0 28px #ffba37}
        .wam-node-lock{position:absolute;right:-6px;bottom:-3px;font-size:25px}.wam-node-stars{font-weight:900;font-size:25px;color:#ffde78;letter-spacing:3px;text-shadow:0 2px 4px #000;margin-top:9px}
        .wam-node-name{display:inline-block;margin-top:6px;padding:7px 12px;border:1px solid #bb899865;border-radius:13px;background:#271328e8;color:#fff3d3;font-size:18px;font-weight:800;white-space:nowrap}
        .wam-node-you{position:absolute;top:-30px;left:52px;right:52px;border-radius:8px;background:#fff0a6;color:#731544;padding:5px;font-size:17px;font-weight:900}
        .wam-map-future{position:absolute;top:17%;left:30%;right:30%;padding:14px 8px;background:#261629d9;border:2px solid #d0a44d;border-radius:18px;color:#ffe7a7;text-align:center;font-size:20px;font-weight:900}
        .wam-map-footer{position:absolute;left:0;right:0;bottom:0;height:197px;padding:18px 30px 24px;background:linear-gradient(#241128,#170d22);border-top:3px solid #9c4475;z-index:30}.wam-map-footer>.wam-button{width:100%;margin-top:14px}
        .wam-map-actions{display:flex;gap:15px}.wam-map-actions .wam-button{flex:1;min-height:52px;padding:10px;font-size:20px}
        .wam-level-picker{display:grid;grid-template-columns:repeat(3,1fr);gap:17px;margin:25px 0}.wam-level-picker button{min-height:95px;border-radius:19px;padding:8px;font-size:29px}.wam-level-picker small{display:block;font-size:15px;margin-top:6px}
      `;document.head.append(s);
    }
    focus(id,smooth=true){
      this.selected=id;const point=this.nodes[id-1];
      this.scroller.scrollTo({top:Math.max(0,this.world.clientHeight*point.y/100-this.scroller.clientHeight*.56),behavior:smooth&&!matchMedia('(prefers-reduced-motion: reduce)').matches?'smooth':'instant'});
      point.node.focus({preventScroll:true});
    }
    preview(id){
      if(this.disposed)return;U.audio();this.stage.querySelector('.wam-shade')?.remove();this.selected=id;
      const config=C.level(id),locked=id>this.progress.unlocked,stars=this.progress.stars[id-1];
      const modal=dialog(this.stage,config.name);modal.card.prepend(el('div','wam-eyebrow',`LEVEL ${id} · ${config.moves} MOVES`));
      if(stars)modal.card.append(el('div','wam-stars','★'.repeat(stars)+'☆'.repeat(3-stars)));
      modal.card.append(targets(config),el('p','',locked?`Finish Level ${id-1} to play this level.`:config.tip));
      const play=button(locked?'LEVEL LOCKED':`PLAY LEVEL ${id}`,()=>this.start(id),'cyan');play.disabled=locked;modal.card.append(play,button('BACK TO MAP',()=>modal.close(),'secondary'));
    }
    list(){
      const modal=dialog(this.stage,'Choose a level','See targets, replay completed levels, or jump to your current stop.');
      const grid=el('div','wam-level-picker');C.levels.forEach(config=>{const locked=config.id>this.progress.unlocked;const b=button(String(config.id),()=>{modal.close();this.focus(config.id);this.preview(config.id);},locked?'secondary':'');b.append(el('small','',locked?'LOCKED':this.progress.stars[config.id-1]?'★'.repeat(this.progress.stars[config.id-1]):'VIEW'));b.setAttribute('aria-label',`View Level ${config.id}`);grid.append(b);});
      modal.card.append(grid,button('CLOSE',()=>modal.close(),'secondary'));
    }
    start(id){if(id>this.progress.unlocked||this.disposed)return;C.write(storage,'wambam-selected-level',id);this.navigate('Game');}
    navigate(name){this.scene.__wam94NextScene=name;this.dispose();}
    dispose(){if(this.disposed)return;this.disposed=true;document.removeEventListener('backbutton',this.back);window.removeEventListener('resize',this.resize);this.view.dispose();}
  }
  window.WamMapView=MapView;
})();
