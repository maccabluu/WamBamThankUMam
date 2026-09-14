(()=>{
'use strict';
const C=window.WamCampaign,U=window.WamUI;
if(!C||!U)return;
const storage=U.storage;
let currentRuntime=null,panel=null;
function css(){if(document.getElementById('wam-home-111-style'))return;const s=document.createElement('style');s.id='wam-home-111-style';s.textContent=`
#wambam-world-entry{display:none!important}
#wambam-home-111{position:absolute;inset:0;z-index:190;pointer-events:none;font-family:Arial,Helvetica,sans-serif}
.wam111-hit{position:absolute;border:0;background:transparent;color:transparent;padding:0;margin:0;pointer-events:auto;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
.wam111-hit:focus-visible{outline:4px solid #62fff2;outline-offset:-5px;border-radius:18px}
.wam111-panel{position:absolute;inset:0;z-index:900;background:#090611e8;display:flex;align-items:center;justify-content:center;padding:5%;pointer-events:auto;color:#fff}
.wam111-card{width:100%;max-height:86%;overflow:auto;border:4px solid #ffd66b;border-radius:28px;background:linear-gradient(160deg,#35132f,#120b17);padding:5%;box-shadow:0 8px 0 #51072d;text-align:center}
.wam111-card h2{margin:0 0 12px;color:#ff63a8;font-size:clamp(30px,7vw,54px)}
.wam111-card p{font-size:clamp(16px,3.5vw,26px);line-height:1.4;color:#fff0e8}
.wam111-row{display:grid;grid-template-columns:1fr 1fr;gap:3%;margin:4% 0}
.wam111-stat{border:2px solid #56eee5;border-radius:18px;padding:4%;background:#14272c;font-weight:900;font-size:clamp(14px,3vw,23px)}
.wam111-btn{width:100%;min-height:64px;margin-top:3%;border:3px solid #ffe078;border-radius:24px;background:linear-gradient(#ff4f9e,#c3075d);color:white;font:900 clamp(18px,4vw,30px) Arial;box-shadow:0 5px 0 #5e082f}
.wam111-btn.cyan{background:linear-gradient(#5df6ec,#159ba3);color:#102a2d}
.wam111-shopitem{display:grid;grid-template-columns:1fr auto;align-items:center;gap:4%;text-align:left;border:2px solid #7a6077;border-radius:18px;padding:4%;margin:3% 0;background:#1d1420}
.wam111-shopitem b{display:block;color:#ffe497;font-size:clamp(17px,3.7vw,27px)}
`;document.head.appendChild(s)}
function close(){panel?.remove();panel=null}
function shell(title){close();const root=document.getElementById('wambam-home-effects');if(!root)return null;panel=document.createElement('div');panel.className='wam111-panel';panel.innerHTML=`<section class="wam111-card"><h2>${title}</h2><div data-body></div><button class="wam111-btn cyan" data-close>CLOSE</button></section>`;panel.querySelector('[data-close]').onclick=close;root.appendChild(panel);return panel.querySelector('[data-body]')}
function coins(){return Math.max(0,C.read(storage,'wambam-coins',0))}
function addCoins(n){C.write(storage,'wambam-coins',coins()+n)}
function profile(){const p=C.progress(storage),body=shell('MY WAM BAM');if(!body)return;const stars=p.stars.reduce((a,b)=>a+b,0);body.innerHTML=`<div class="wam111-row"><div class="wam111-stat">LEVEL<br>${p.selected}</div><div class="wam111-stat">STARS<br>${stars}</div><div class="wam111-stat">COINS<br>${coins()}</div><div class="wam111-stat">LEVELS CLEARED<br>${p.highest}</div></div><p>Your Wam Bam progress is saved on this device.</p>`}
function events(){const body=shell('EVENTS');if(!body)return;const gift=C.read(storage,'wambam-event-gift-claimed',0),matches=C.read(storage,'wambam-event-matches',0),matchClaim=C.read(storage,'wambam-event-match-claimed',0);body.innerHTML=`<div class="wam111-shopitem"><div><b>DAILY SPOTLIGHT</b>Free lounge gift · 150 coins</div><button class="wam111-btn" data-gift ${gift?'disabled':''}>${gift?'CLAIMED':'CLAIM'}</button></div><div class="wam111-shopitem"><div><b>MATCH MANIA</b>Clear 25 icons today · ${Math.min(25,matches)}/25 · 300 coins</div><button class="wam111-btn" data-match ${matches<25||matchClaim?'disabled':''}>${matchClaim?'CLAIMED':'CLAIM'}</button></div>`;const g=body.querySelector('[data-gift]');if(g)g.onclick=()=>{addCoins(150);C.write(storage,'wambam-event-gift-claimed',1);events()};const m=body.querySelector('[data-match]');if(m)m.onclick=()=>{addCoins(300);C.write(storage,'wambam-event-match-claimed',1);events()}}
function shop(){const body=shell('BAM SHOP');if(!body)return;const inv=C.inventory(storage),items=[['rocket','LIP LASER',250],['hammer','HEEL SMASH',250],['disco','DISCO BALL',400],['swap','FREE SWAP',300]];body.innerHTML=`<p>Coins: <b>${coins()}</b></p>`+items.map(([k,n,c])=>`<div class="wam111-shopitem"><div><b>${n}</b>Owned: ${inv[k]} · ${c} coins</div><button class="wam111-btn" data-buy="${k}" data-cost="${c}" ${coins()<c?'disabled':''}>BUY</button></div>`).join('');body.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>{const cost=Number(b.dataset.cost),k=b.dataset.buy;if(coins()<cost)return;C.write(storage,'wambam-coins',coins()-cost);const next=C.inventory(storage);next[k]=(next[k]||0)+1;C.saveInventory(storage,next);shop()})}
function vip(){const body=shell('VIP');if(!body)return;body.innerHTML='<p>VIP is reserved for a future Wam Bam update. This button is now connected and ready for the VIP rewards system.</p>'}
function levelMap(){if(!currentRuntime)return;gdjs.evtTools.runtimeScene.replaceScene(currentRuntime,'Level Map',false)}
function settings(){if(!currentRuntime)return;gdjs.evtTools.runtimeScene.pushScene(currentRuntime,'Settings')}
function world(){window.WamWorld?.open?.()}
function hit(root,label,left,top,width,height,action){const b=document.createElement('button');b.type='button';b.className='wam111-hit';b.setAttribute('aria-label',label);Object.assign(b.style,{left,top,width,height});b.onclick=e=>{e.preventDefault();e.stopPropagation();action()};root.appendChild(b)}
function attachHome(runtimeScene){currentRuntime=runtimeScene;css();const host=document.getElementById('wambam-home-effects');if(!host)return;host.querySelector('#wambam-home-111')?.remove();const root=document.createElement('div');root.id='wambam-home-111';host.appendChild(root);
 hit(root,'Player profile','2%','1%','17%','11%',profile);
 hit(root,'Hearts shop','42%','2%','7%','6%',shop);
 hit(root,'Coin shop','73%','2%','7%','6%',shop);
 hit(root,'VIP','81%','1.5%','17%','8%',vip);
 hit(root,'Play','22%','69%','56%','10%',levelMap);
 hit(root,'Events','1.5%','78.5%','22.5%','13%',events);
 hit(root,'Shop','24.5%','78.5%','23.5%','13%',shop);
 hit(root,'Wam World','48%','78.5%','25%','13%',world);
 hit(root,'Settings','73%','78.5%','26%','13%',settings);
}
window.WamHome111={attachHome,events,shop,profile,vip};
})();