// ═══════════════════════════════════════════════
//  MEGAMANIA REMAKE — game.js
// ═══════════════════════════════════════════════
const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');
const W = 480, H = 520;

// ── DOM ────────────────────────────────────────
const scoreEl  = document.getElementById('score-val');
const levelEl  = document.getElementById('level-val');
const livesEl  = document.getElementById('lives-val');
const energyEl = document.getElementById('energy-bar-fill');
const waveEl   = document.getElementById('wave-val');
const overlay  = document.getElementById('overlay');

// ── Audio ──────────────────────────────────────
const AC = new (window.AudioContext || window.webkitAudioContext)();

function playLaser() {
  const o = AC.createOscillator(), g = AC.createGain();
  o.connect(g); g.connect(AC.destination);
  o.type = 'square';
  o.frequency.setValueAtTime(900, AC.currentTime);
  o.frequency.exponentialRampToValueAtTime(200, AC.currentTime + 0.1);
  g.gain.setValueAtTime(0.28, AC.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, AC.currentTime + 0.1);
  o.start(); o.stop(AC.currentTime + 0.1);
}

function playExplosion() {
  const buf = AC.createBuffer(1, AC.sampleRate * 0.22, AC.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random()*2-1)*(1-i/d.length);
  const src = AC.createBufferSource(), g = AC.createGain(), f = AC.createBiquadFilter();
  f.type='bandpass'; f.frequency.value=160;
  src.buffer=buf; src.connect(f); f.connect(g); g.connect(AC.destination);
  g.gain.setValueAtTime(0.7, AC.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, AC.currentTime+0.22);
  src.start(); src.stop(AC.currentTime+0.22);
}

function playLevelUp() {
  [523,659,784,1047].forEach((f,i)=>{
    const o=AC.createOscillator(),g=AC.createGain();
    o.connect(g); g.connect(AC.destination); o.type='square'; o.frequency.value=f;
    const t=AC.currentTime+i*0.1;
    g.gain.setValueAtTime(0.2,t); g.gain.exponentialRampToValueAtTime(0.001,t+0.09);
    o.start(t); o.stop(t+0.09);
  });
}

function playDeath() {
  const o=AC.createOscillator(),g=AC.createGain();
  o.connect(g); g.connect(AC.destination); o.type='sawtooth';
  o.frequency.setValueAtTime(440,AC.currentTime);
  o.frequency.exponentialRampToValueAtTime(50,AC.currentTime+0.5);
  g.gain.setValueAtTime(0.45,AC.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001,AC.currentTime+0.5);
  o.start(); o.stop(AC.currentTime+0.5);
}

// ── Starfield ──────────────────────────────────
const STARS = Array.from({length:90}, ()=>({
  x:Math.random()*W, y:Math.random()*H,
  sp:Math.random()*0.9+0.2,
  sz:Math.random()<0.25?2:1,
  br:Math.random()
}));
function drawStars() {
  STARS.forEach(s=>{
    s.y+=s.sp; if(s.y>H){s.y=0;s.x=Math.random()*W;}
    ctx.fillStyle=`rgba(255,255,255,${0.3+0.7*s.br})`;
    ctx.fillRect(s.x|0,s.y|0,s.sz,s.sz);
  });
}

// ── Sprites ────────────────────────────────────
const TYPES  = ['burger','cookie','iron','bowtie','diamond'];
const COLORS = {
  burger: ['#ff8800','#ffe082','#8B4513','#4caf50','#ff0'],
  cookie: ['#d2691e','#fff8e1','#8B4513','#f8bbd0','#ff9800'],
  iron:   ['#90a4ae','#cfd8dc','#546e7a','#b0bec5','#fff'],
  bowtie: ['#e040fb','#ce93d8','#ab47bc','#f8bbd0','#fff'],
  diamond:['#00e5ff','#b2ebf2','#00bcd4','#e0f7fa','#fff'],
};

function px(x,y,dx,dy,w,h,c){ctx.fillStyle=c;ctx.fillRect(x+dx,y+dy,w,h);}

function drawBurger(x,y) {
  px(x,y,-6,-7,12,4,'#ff8800');px(x,y,-4,-9,8,3,'#ff8800');
  px(x,y,-3,-8,2,1,'#fff8e1');px(x,y,1,-8,2,1,'#fff8e1');
  px(x,y,-7,-4,14,2,'#4caf50');
  px(x,y,-6,-2,12,3,'#8B4513');
  px(x,y,-5,1,10,2,'#ffeb3b');
  px(x,y,-6,3,12,4,'#ff8800');
  ctx.fillStyle='#000';ctx.fillRect(x-3,y-6,2,2);ctx.fillRect(x+1,y-6,2,2);
}

function drawCookie(x,y) {
  ctx.fillStyle='#d2691e';
  ctx.beginPath();ctx.arc(x,y,8,0,Math.PI*2);ctx.fill();
  [[-3,-3],[2,-4],[-4,1],[3,2],[0,4],[-1,-1]].forEach(([dx,dy])=>{
    ctx.fillStyle='#3e2723';ctx.fillRect(x+dx-1,y+dy-1,2,2);
  });
  ctx.fillStyle='rgba(255,255,210,0.45)';
  ctx.beginPath();ctx.arc(x-2,y-2,2.5,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#fff8e1';ctx.fillRect(x-3,y-1,2,2);ctx.fillRect(x+1,y-1,2,2);
  ctx.fillStyle='#000';ctx.fillRect(x-2,y-1,1,1);ctx.fillRect(x+2,y-1,1,1);
}

function drawIron(x,y) {
  px(x,y,-6,-2,12,6,'#90a4ae');
  px(x,y,-5,-5,3,3,'#90a4ae');px(x,y,-4,-6,2,2,'#90a4ae');
  px(x,y,-2,-7,4,3,'#546e7a');
  [-3,-1,1,3].forEach(dx=>px(x,y,dx,1,1,1,'#e0e0e0'));
  px(x,y,-5,-1,10,1,'#cfd8dc');
  px(x,y,5,0,3,2,'#37474f');px(x,y,7,-3,2,5,'#37474f');
  ctx.fillStyle='#263238';ctx.fillRect(x-2,y-1,2,2);ctx.fillRect(x+1,y-1,2,2);
}

function drawBowtie(x,y) {
  ctx.fillStyle='#e040fb';
  ctx.beginPath();ctx.moveTo(x-9,y-6);ctx.lineTo(x-1,y);ctx.lineTo(x-9,y+6);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(x+9,y-6);ctx.lineTo(x+1,y);ctx.lineTo(x+9,y+6);ctx.closePath();ctx.fill();
  ctx.fillStyle='#ce93d8';ctx.fillRect(x-2,y-3,4,6);
  ctx.fillStyle='#f3e5f5';ctx.fillRect(x-7,y-3,2,2);ctx.fillRect(x+5,y-3,2,2);
  ctx.fillStyle='#fff';ctx.fillRect(x-3,y-1,2,2);ctx.fillRect(x+1,y-1,2,2);
  ctx.fillStyle='#4a148c';ctx.fillRect(x-2,y-1,1,1);ctx.fillRect(x+2,y-1,1,1);
}

function drawDiamond(x,y) {
  ctx.fillStyle='#00e5ff';
  ctx.beginPath();ctx.moveTo(x,y-9);ctx.lineTo(x+7,y);ctx.lineTo(x,y+9);ctx.lineTo(x-7,y);ctx.closePath();ctx.fill();
  ctx.fillStyle='#b2ebf2';
  ctx.beginPath();ctx.moveTo(x,y-5);ctx.lineTo(x+3,y-1);ctx.lineTo(x,y+4);ctx.lineTo(x-3,y-1);ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.55)';
  ctx.beginPath();ctx.moveTo(x,y-9);ctx.lineTo(x+7,y);ctx.lineTo(x,y-1);ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(0,0,0,0.5)';ctx.fillRect(x-2,y-2,2,2);ctx.fillRect(x+1,y-2,2,2);
}

const DRAW = {burger:drawBurger,cookie:drawCookie,iron:drawIron,bowtie:drawBowtie,diamond:drawDiamond};

function drawPlayer(x,y) {
  // glow
  ctx.fillStyle='rgba(0,180,255,0.12)';ctx.fillRect(x-14,y+6,28,14);
  // body
  ctx.fillStyle='#00e5ff';ctx.fillRect(x-3,y-12,6,14);
  // wings
  ctx.fillStyle='#0288d1';ctx.fillRect(x-14,y-2,11,8);ctx.fillRect(x+3,y-2,11,8);
  ctx.fillStyle='#00bcd4';ctx.fillRect(x-14,y+2,4,4);ctx.fillRect(x+10,y+2,4,4);
  // cockpit
  ctx.fillStyle='#e0f7fa';ctx.fillRect(x-2,y-10,4,6);
  ctx.fillStyle='rgba(255,255,255,0.65)';ctx.fillRect(x-1,y-9,2,4);
  // engines
  ctx.fillStyle='#01579b';ctx.fillRect(x-8,y+4,6,4);ctx.fillRect(x+2,y+4,6,4);
  // flame
  const fl=0.55+Math.random()*0.45;
  ctx.fillStyle=`rgba(255,150,0,${fl})`;ctx.fillRect(x-1,y+8,2,5);
  ctx.fillStyle=`rgba(255,240,80,${fl*0.7})`;ctx.fillRect(x,y+9,1,3);
}

function drawBullet(x,y) {
  ctx.fillStyle='#ff0';ctx.fillRect(x-1,y-8,3,11);
  ctx.fillStyle='#fff';ctx.fillRect(x,y-9,1,5);
  // glow
  ctx.fillStyle='rgba(255,255,0,0.2)';ctx.fillRect(x-3,y-10,7,14);
}

// ── Particles ──────────────────────────────────
class Particle {
  constructor(x,y,c){
    this.x=x;this.y=y;
    this.vx=(Math.random()-0.5)*7;
    this.vy=(Math.random()-0.5)*7;
    this.life=1;
    this.decay=Math.random()*0.035+0.035;
    this.sz=Math.random()*5+2;
    this.c=c;
  }
  update(){this.x+=this.vx;this.y+=this.vy;this.vy+=0.12;this.life-=this.decay;}
  draw(){
    ctx.globalAlpha=Math.max(0,this.life);
    ctx.fillStyle=this.c;
    ctx.fillRect(this.x-this.sz/2,this.y-this.sz/2,this.sz,this.sz);
    ctx.globalAlpha=1;
  }
}

// ── Float Scores ───────────────────────────────
class FloatScore {
  constructor(x,y,txt,c){this.x=x;this.y=y;this.txt=txt;this.c=c||'#ff0';this.life=1;}
  update(){this.y-=0.8;this.life-=0.022;}
  draw(){
    ctx.globalAlpha=Math.max(0,this.life);
    ctx.fillStyle=this.c;
    ctx.font='bold 9px "Press Start 2P",monospace';
    ctx.textAlign='center';
    ctx.fillText(this.txt,this.x,this.y);
    ctx.textAlign='left';
    ctx.globalAlpha=1;
  }
}

// ── State ──────────────────────────────────────
// states: menu | playing | dying | levelup | gameover
let state = 'menu';
let loopRunning = false;
let score=0, lives=3, level=1, wave=1;
let energy=100, energyDrainRate=3;
let screenFlash=0; // red flash timer

const player={x:W/2,y:H-42,speed:5,invincible:0};
let bullets=[], bulletCooldown=0;
let enemies=[], particles=[], floatScores=[];
let zigDir=1, enemySpeedX=1.2, enemySpeedY=0.4;
let dyingTimer=0, levelupTimer=0;

// ── Input ──────────────────────────────────────
const keys={};
document.addEventListener('keydown',e=>{
  keys[e.code]=true;
  if(e.code==='Space'){
    e.preventDefault();
    if(AC.state==='suspended') AC.resume();
    if(state==='menu')    { startGame(); return; }
    if(state==='gameover'){ showMenu();  return; }
  }
});
document.addEventListener('keyup',e=>{ keys[e.code]=false; });

// ── Helpers ────────────────────────────────────
function rectsOverlap(ax,ay,aw,ah,bx,by,bw,bh){
  return ax<bx+bw && ax+aw>bx && ay<by+bh && ay+ah>by;
}
function updateHUD(){
  scoreEl.textContent=score.toString().padStart(6,'0');
  levelEl.textContent=level;
  livesEl.textContent='❤'.repeat(Math.max(0,lives));
  waveEl.textContent=wave;
  const pct=Math.max(0,energy);
  energyEl.style.width=pct+'%';
  if(pct>60)      energyEl.style.background='linear-gradient(90deg,#0f0,#8f0)';
  else if(pct>30) energyEl.style.background='linear-gradient(90deg,#ff0,#f80)';
  else            energyEl.style.background='linear-gradient(90deg,#f00,#f40)';
}

// ── Overlay helpers ────────────────────────────
function hideOverlay(){ overlay.style.display='none'; }
function showOverlay(html){ overlay.innerHTML=html; overlay.style.display='flex'; }

function showMenu(){
  state='menu';
  showOverlay(`
    <h1>MEGAMANIA<br>REMAKE</h1>
    <p>← → MOVER &nbsp; SPACE ATIRAR</p>
    <p>Destrua as ondas de inimigos!</p>
    <p>Mantenha a energia cheia!</p>
    <div class="sub">— PRESSIONE ESPAÇO —</div>`);
}

function showGameOver(){
  state='gameover';
  showOverlay(`
    <h1>GAME<br>OVER</h1>
    <div class="score-final">PONTUAÇÃO: ${score}</div>
    <p>LEVEL ALCANÇADO: ${level}</p>
    <div class="sub">— PRESSIONE ESPAÇO —</div>`);
}

function showLevelBanner(){
  state='levelup'; levelupTimer=2.5;
  showOverlay(`
    <h1>FASE ${level}<br>CONCLUÍDA!</h1>
    <div class="score-final">+1000 PONTOS</div>
    <p>PRÓXIMA: ${TYPES[level % TYPES.length].toUpperCase()}</p>
    <div class="sub">Preparando próxima onda…</div>`);
}

// ── Spawn ──────────────────────────────────────
function spawnWave(){
  enemies=[]; bullets=[];
  const type=TYPES[(level-1)%TYPES.length];
  const cols=8, rows=3, sX=52, sY=46;
  const oX=(W-(cols-1)*sX)/2;
  for(let r=0;r<rows;r++)
    for(let c=0;c<cols;c++)
      enemies.push({x:oX+c*sX, y:52+r*sY, w:26, h:22,
        type, alive:true, wobble:Math.random()*Math.PI*2});
  zigDir=1;
}

// ── Start ──────────────────────────────────────
function startGame(){
  score=0; lives=3; level=1; wave=1; energy=100;
  energyDrainRate=3; enemySpeedX=1.2; enemySpeedY=0.4;
  player.x=W/2; player.invincible=0;
  particles=[]; floatScores=[];
  spawnWave();
  state='playing';
  hideOverlay(); updateHUD();
  if(!loopRunning){ loopRunning=true; requestAnimationFrame(loop); }
}

function beginNextWave(){
  level++; wave++;
  energy=100;
  player.x=W/2; player.invincible=0;
  energyDrainRate = Math.min(3+level*0.45, 11);
  enemySpeedX     = Math.min(1.2+level*0.18, 3.8);
  enemySpeedY     = Math.min(0.4+level*0.05, 1.3);
  particles=[]; floatScores=[];
  spawnWave();
  state='playing';
  hideOverlay(); updateHUD();
}

// ── Death ──────────────────────────────────────
function triggerDeath(){
  // Ignora se já invencível OU se já estamos processando uma morte
  if(player.invincible>0 || state==='dying' || state==='gameover') return;
  playDeath();
  const cls=['#ff0','#f80','#f00','#fff'];
  for(let i=0;i<32;i++) particles.push(new Particle(player.x,player.y,cls[Math.floor(Math.random()*4)]));
  screenFlash=0.5;
  lives--;
  state='dying'; dyingTimer=1.4;
}

// ── Update Playing ─────────────────────────────
function updatePlaying(dt){
  // energy drain (só drena se a nave não está ressurgindo)
  if(player.invincible<=0) energy -= energyDrainRate*dt;
  if(energy<30) screenFlash=Math.max(screenFlash,0.04);
  if(energy<=0){ energy=0; triggerDeath(); return; }

  // move player
  if((keys['ArrowLeft']||keys['KeyA']) && player.x>18) player.x-=player.speed;
  if((keys['ArrowRight']||keys['KeyD']) && player.x<W-18) player.x+=player.speed;
  if(player.invincible>0) player.invincible-=dt;

  // shoot
  bulletCooldown-=dt;
  if((keys['Space']||keys['KeyZ']) && bulletCooldown<=0){
    bullets.push({x:player.x,y:player.y-14});
    bulletCooldown=0.17; playLaser();
  }

  // move bullets
  bullets.forEach(b=>b.y-=13);
  bullets=bullets.filter(b=>b.y>-12);

  // enemies alive?
  const alive=enemies.filter(e=>e.alive);
  if(alive.length===0){
    energy=Math.min(100,energy+45);
    score+=1000;
    floatScores.push(new FloatScore(W/2,H/2-30,'+1000 BÔNUS!','#0f0'));
    playLevelUp(); showLevelBanner(); return;
  }

  // zigzag bounds
  const minX=Math.min(...alive.map(e=>e.x));
  const maxX=Math.max(...alive.map(e=>e.x));
  if(maxX>W-18||minX<18){
    zigDir*=-1;
    alive.forEach(e=>e.y+=16);
  }

  // update each enemy
  enemies.forEach(e=>{
    if(!e.alive) return;
    e.x+=enemySpeedX*zigDir;
    e.wobble+=2.2*dt;
    e.y+=Math.sin(e.wobble*1.4)*enemySpeedY;

    // bullet hit
    for(let bi=bullets.length-1;bi>=0;bi--){
      const b=bullets[bi];
      if(rectsOverlap(b.x-2,b.y-8,5,14,e.x-e.w/2,e.y-e.h/2,e.w,e.h)){
        e.alive=false; bullets.splice(bi,1);
        const pts=100+level*10; score+=pts;
        playExplosion();
        const cs=COLORS[e.type];
        for(let i=0;i<14;i++) particles.push(new Particle(e.x,e.y,cs[Math.floor(Math.random()*cs.length)]));
        floatScores.push(new FloatScore(e.x,e.y-10,'+'+pts));
        break;
      }
    }

    // player collision
    if(e.alive&&player.invincible<=0&&state==='playing'&&
       rectsOverlap(player.x-13,player.y-11,26,22,e.x-e.w/2,e.y-e.h/2,e.w,e.h)){
      e.alive=false;
      triggerDeath();
      return; // interrompe processamento deste inimigo após morte
    }

    // reached bottom
    if(e.y>H-28){ e.alive=false; energy=Math.max(0,energy-18); screenFlash=0.3; }
  });

  particles.forEach(p=>p.update()); particles=particles.filter(p=>p.life>0);
  floatScores.forEach(f=>f.update()); floatScores=floatScores.filter(f=>f.life>0);
}

// ── Update Dying ───────────────────────────────
function updateDying(dt){
  dyingTimer-=dt;
  particles.forEach(p=>p.update()); particles=particles.filter(p=>p.life>0);
  floatScores.forEach(f=>f.update()); floatScores=floatScores.filter(f=>f.life>0);
  if(dyingTimer<=0){
    if(lives<=0){ showGameOver(); return; }
    // Restaura a nave com energia parcial para evitar morte imediata
    energy = 60;
    player.x = W/2;
    player.invincible = 3;
    bullets = [];
    state = 'playing';
  }
}

// ── Update LevelUp ─────────────────────────────
function updateLevelup(dt){
  levelupTimer-=dt;
  if(levelupTimer<=0) beginNextWave();
}

// ── Draw ───────────────────────────────────────
function drawScene(){
  enemies.forEach(e=>{
    if(!e.alive) return;
    DRAW[e.type](e.x,e.y);
  });
  bullets.forEach(b=>drawBullet(b.x,b.y));
  if(state==='playing'||state==='levelup'){
    const blink=player.invincible<=0||Math.floor(player.invincible*10)%2===0;
    if(blink) drawPlayer(player.x,player.y);
  }
  particles.forEach(p=>p.draw());
  floatScores.forEach(f=>f.draw());
}

// ── Main Loop (single RAF, never duplicated) ───
let lastTs=0;
function loop(ts){
  const dt=Math.min((ts-lastTs)/1000,0.05); lastTs=ts;

  // clear
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='#000'; ctx.fillRect(0,0,W,H);
  drawStars();

  // state dispatch
  if(state==='playing')  updatePlaying(dt);
  else if(state==='dying')   updateDying(dt);
  else if(state==='levelup') updateLevelup(dt);

  drawScene();
  updateHUD();

  // red screen flash (low energy / hit)
  if(screenFlash>0){
    ctx.fillStyle=`rgba(255,0,0,${Math.min(screenFlash,0.35)})`;
    ctx.fillRect(0,0,W,H);
    screenFlash-=dt*1.8;
  }

  requestAnimationFrame(loop); // always keep single loop alive
}

// ── Boot ───────────────────────────────────────
showMenu();
loopRunning=true;
requestAnimationFrame(loop);
