(()=>{
'use strict';

const app=document.getElementById('app');
const home=document.getElementById('homeScreen');
const game=document.getElementById('gameScreen');
const modal=document.getElementById('modal');
const modalTitle=document.getElementById('modalTitle');
const modalText=document.getElementById('modalText');
if(!app||!home||!game)return;

const css=document.createElement('link');
css.rel='stylesheet';
css.href='features.css';
document.head.appendChild(css);

const loungeSteps=[
  {name:'Neon Sign',icon:'✦',copy:'Light up the Bam Lounge entrance.'},
  {name:'Velvet Seating',icon:'♥',copy:'Add the red velvet booths.'},
  {name:'Jukebox',icon:'♫',copy:'Bring the music back to the room.'},
  {name:'Dance Floor',icon:'★',copy:'Finish the Lounge with a glowing floor.'}
];

const storyLines=[
  ['RUBY RAY','This place used to shake every night. We are bringing the Bam Lounge back.'],
  ['LOLA LUXE','Give me lights, velvet and a jukebox. I will make this room shine again.'],
  ['JOHNNY JIVE','I found the old sound system. Win the next challenge and I will get it running.'],
  ['FRANKIE FLASH','Cute little makeover. Beat me on the dance floor if you want to keep this place.']
];

let loungeStage=Math.max(0,Math.min(4,Number(localStorage.getItem('wb_lounge_stage')||0)));
let storyIndex=Math.max(0,Math.min(storyLines.length-1,Number(localStorage.getItem('wb_story_index')||0)));
let bossActive=false;

const layer=document.createElement('section');
layer.id='wamFeatureLayer';
layer.className='wam-feature-layer';
layer.setAttribute('aria-hidden','true');
app.appendChild(layer);

const bossHud=document.createElement('div');
bossHud.id='bossHud';
bossHud.className='boss-hud';
bossHud.innerHTML='<div class="boss-name"><span>⚡</span><b>FRANKIE FLASH</b><small>BOSS</small></div><div class="boss-meter"><i id="bossMeterFill"></i></div><div class="boss-hp"><b id="bossHpValue">100</b>%</div>';
game.appendChild(bossHud);

function feedback(){
  try{if(navigator.vibrate)navigator.vibrate(18);}catch(_){ }
}

function showLayer(){
  layer.classList.add('show');
  layer.setAttribute('aria-hidden','false');
  home.classList.remove('active');
}

function closeLayer(){
  layer.classList.remove('show');
  layer.setAttribute('aria-hidden','true');
  home.classList.add('active');
}

function header(title,subtitle='WAM WORLD'){
  return `<div class="feature-top"><button class="feature-back" data-feature-back aria-label="Back">‹</button><div><small>${subtitle}</small><h1>${title}</h1></div><button class="feature-home" data-feature-home aria-label="Home">⌂</button></div>`;
}

function bindChrome(back){
  layer.querySelector('[data-feature-back]')?.addEventListener('pointerup',()=>{feedback();back();});
  layer.querySelector('[data-feature-home]')?.addEventListener('pointerup',()=>{feedback();closeLayer();});
}

function openWorld(){
  showLayer();
  const completed=loungeStage===4;
  layer.innerHTML=`${header('WAM WORLD','WELCOME TO')}
    <div class="feature-scroll world-scroll">
      <div class="world-intro"><b>MAKE WAM BAM YOURS</b><span>Build the Lounge, meet the crew and take on special bosses.</span></div>
      <button class="world-card lounge-card" data-open-lounge>
        <span class="world-icon">♬</span><div><small>CHAPTER 1</small><h2>BAM LOUNGE</h2><p>${loungeStage}/4 upgrades complete</p></div><i>${completed?'✓':'›'}</i>
      </button>
      <button class="world-card story-card" data-open-story>
        <span class="world-icon">★</span><div><small>STORY</small><h2>MEET THE CREW</h2><p>Ruby, Lola, Johnny and rival Frankie.</p></div><i>›</i>
      </button>
      <button class="world-card boss-card" data-open-boss>
        <span class="world-icon">⚡</span><div><small>SPECIAL STAGE</small><h2>BOSS BATTLE</h2><p>Take on Frankie Flash.</p></div><i>›</i>
      </button>
      <div class="coming-strip"><b>NEXT CHAPTER</b><span>Bam Diner</span><em>COMING NEXT</em></div>
    </div>`;
  bindChrome(closeLayer);
  layer.querySelector('[data-open-lounge]').addEventListener('pointerup',()=>{feedback();openLounge();});
  layer.querySelector('[data-open-story]').addEventListener('pointerup',()=>{feedback();openStory();});
  layer.querySelector('[data-open-boss]').addEventListener('pointerup',()=>{feedback();openBoss();});
}

function loungeScene(){
  return `<div class="lounge-scene stage-${loungeStage}">
      <div class="lounge-wall-lines"></div>
      <div class="lounge-neon ${loungeStage>=1?'built':''}"><small>THE</small><b>BAM</b><span>LOUNGE</span></div>
      <div class="lounge-seat left ${loungeStage>=2?'built':''}"></div><div class="lounge-seat right ${loungeStage>=2?'built':''}"></div>
      <div class="lounge-jukebox ${loungeStage>=3?'built':''}"><span>♫</span></div>
      <div class="lounge-floor ${loungeStage>=4?'built':''}"></div>
      <div class="lounge-stage-label">${loungeStage===0?'EMPTY ROOM':loungeStage===4?'BAM LOUNGE COMPLETE':loungeSteps[loungeStage-1].name.toUpperCase()+' ADDED'}</div>
    </div>`;
}

function openLounge(){
  showLayer();
  const next=loungeSteps[loungeStage];
  layer.innerHTML=`${header('BAM LOUNGE','CHAPTER 1')}
    <div class="feature-scroll lounge-scroll">
      ${loungeScene()}
      <div class="lounge-progress"><div><b>${loungeStage}</b><span>/ 4</span></div><p>${loungeStage===4?'The Lounge is finished. Your next location is the Bam Diner.':next.copy}</p></div>
      <div class="upgrade-track">
        ${loungeSteps.map((s,i)=>`<div class="upgrade-step ${i<loungeStage?'done':i===loungeStage?'next':'locked'}"><span>${i<loungeStage?'✓':s.icon}</span><b>${s.name}</b></div>`).join('')}
      </div>
      ${loungeStage<4?`<button class="feature-main-button" data-build-upgrade>BUILD ${next.name.toUpperCase()}</button>`:`<button class="feature-main-button complete" data-open-story>START THE STORY</button>`}
    </div>`;
  bindChrome(openWorld);
  layer.querySelector('[data-build-upgrade]')?.addEventListener('pointerup',()=>{
    loungeStage++;
    localStorage.setItem('wb_lounge_stage',String(loungeStage));
    feedback();
    openLounge();
  });
  layer.querySelector('[data-open-story]')?.addEventListener('pointerup',()=>{feedback();openStory();});
}

function characterStrip(){
  const chars=[['RR','Ruby Ray','Owner & Singer'],['LL','Lola Luxe','Designer'],['JJ','Johnny Jive','DJ'],['FF','Frankie Flash','Rival']];
  return chars.map((c,i)=>`<div class="crew-card crew-${i}"><span>${c[0]}</span><b>${c[1]}</b><small>${c[2]}</small></div>`).join('');
}

function openStory(){
  showLayer();
  const [name,line]=storyLines[storyIndex];
  layer.innerHTML=`${header('MEET THE CREW','WAM BAM STORY')}
    <div class="feature-scroll story-scroll">
      <div class="crew-row">${characterStrip()}</div>
      <div class="episode-card"><small>EPISODE 1</small><h2>REOPEN THE BAM LOUNGE</h2><p>The old Lounge has been dark for years. Ruby wants it back before Frankie takes over the street.</p></div>
      <div class="dialogue-card"><div class="dialogue-avatar">${name.split(' ').map(x=>x[0]).join('')}</div><div><b>${name}</b><p>${line}</p></div></div>
      <div class="story-dots">${storyLines.map((_,i)=>`<i class="${i===storyIndex?'active':''}"></i>`).join('')}</div>
      <button class="feature-main-button" data-story-next>${storyIndex===storyLines.length-1?'FACE FRANKIE':'NEXT'}</button>
    </div>`;
  bindChrome(openWorld);
  layer.querySelector('[data-story-next]').addEventListener('pointerup',()=>{
    feedback();
    if(storyIndex<storyLines.length-1){
      storyIndex++;
      localStorage.setItem('wb_story_index',String(storyIndex));
      openStory();
    }else openBoss();
  });
}

function openBoss(){
  showLayer();
  layer.innerHTML=`${header('BOSS BATTLE','SPECIAL STAGE')}
    <div class="feature-scroll boss-scroll">
      <div class="boss-poster"><div class="boss-lightning">⚡</div><small>LEVEL 10 BOSS</small><h2>FRANKIE FLASH</h2><p>Clear the level targets to drain Frankie's meter before your moves run out.</p><div class="boss-reward"><span>★</span><div><small>REWARD</small><b>250 COINS</b></div></div></div>
      <div class="boss-rules"><b>HOW TO WIN</b><span>Match cherries, diamonds and stars.</span><span>Every cleared target damages the boss.</span><span>Finish all targets before you run out of moves.</span></div>
      <button class="feature-main-button boss-start" data-start-boss>START BOSS</button>
    </div>`;
  bindChrome(openWorld);
  layer.querySelector('[data-start-boss]').addEventListener('pointerup',startBoss);
}

function startBoss(){
  feedback();
  bossActive=true;
  layer.classList.remove('show');
  layer.setAttribute('aria-hidden','true');
  game.classList.add('boss-active');
  document.getElementById('playButton')?.dispatchEvent(new Event('pointerup',{bubbles:true}));
  updateBossMeter();
}

function num(id){
  const value=Number(document.getElementById(id)?.textContent||0);
  return Number.isFinite(value)?Math.max(0,value):0;
}

function updateBossMeter(){
  if(!bossActive)return;
  const remaining=num('targetCherries')+num('targetDiamond')+num('targetStar');
  const pct=Math.max(0,Math.min(100,Math.round((remaining/68)*100)));
  const fill=document.getElementById('bossMeterFill');
  const value=document.getElementById('bossHpValue');
  if(fill)fill.style.width=pct+'%';
  if(value)value.textContent=pct;
}

const hudObserver=new MutationObserver(updateBossMeter);
['targetCherries','targetDiamond','targetStar'].forEach(id=>{
  const el=document.getElementById(id);
  if(el)hudObserver.observe(el,{childList:true,characterData:true,subtree:true});
});

const modalObserver=new MutationObserver(()=>{
  if(!bossActive||!modal?.classList.contains('show'))return;
  if(modalTitle?.textContent.includes('YOU WON')){
    modalTitle.textContent='FRANKIE DEFEATED!';
    modalText.textContent='You cleared the boss stage and won 250 coins. The Bam Lounge story continues!';
    bossActive=false;
    game.classList.remove('boss-active');
    localStorage.setItem('wb_boss_1','1');
  }else if(modalTitle?.textContent.includes('OUT OF MOVES')){
    modalTitle.textContent='FRANKIE WINS THIS ROUND';
    modalText.textContent='Try again and clear every target before the moves run out.';
  }
});
if(modal)modalObserver.observe(modal,{attributes:true,attributeFilter:['class']});

const loungeSign=document.querySelector('.left-neon');
if(loungeSign){
  loungeSign.setAttribute('role','button');
  loungeSign.setAttribute('tabindex','0');
  loungeSign.setAttribute('aria-label','Open Wam World and Bam Lounge');
  loungeSign.addEventListener('pointerup',()=>{feedback();openWorld();});
}

const oldGoHome=window.goHome;
window.goHome=function(){
  bossActive=false;
  game.classList.remove('boss-active');
  layer.classList.remove('show');
  layer.setAttribute('aria-hidden','true');
  if(typeof oldGoHome==='function')oldGoHome();
  else{game.classList.remove('active');home.classList.add('active');}
};

})();
