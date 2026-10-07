/* BAKI-FIT Arena Patch - tambahan tab "Arena" tanpa mengubah kode lama.
   Pasang: <script src="awake-patch.js"></script> sebelum </body> di index.html.
   Hubungkan latihan: panggil window.BakiAwake.addXP(jumlah, 'Latihan selesai') saat sesi selesai. */
(function(){
const K='awake_v1',$=s=>document.querySelector(s);
const key=d=>{d=d||new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const yk=()=>{const d=new Date();d.setDate(d.getDate()-1);return key(d)};
const def=()=>({xp:0,lvl:1,pts:0,st:{STR:5,AGI:5,END:5,VIT:5,WIL:5},day:'',prog:[0,0,0,0],done:false,streak:0,last:'',boss:{},lost:false});
let S;try{S=Object.assign(def(),JSON.parse(localStorage.getItem(K)||'{}'))}catch(e){S=def()}
const save=()=>{try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}};
const need=l=>80+l*40;
const RK=[[1,'E','Bayangan'],[5,'D','Petarung Jalanan'],[10,'C','Pukulan Baja'],[20,'B','Monster Arena'],[30,'A','Raja Arena'],[45,'S','Iblis Arena']];
const rank=()=>[...RK].reverse().find(r=>S.lvl>=r[0]);
const Q=[['Push-up',50,10,'rep'],['Sit-up',50,10,'rep'],['Squat',50,10,'rep'],['Jalan / Lari',3,.5,'km']];
const BOSS=[
 {n:'Karang',l:1,xp:150,c:'100 push-up dalam satu hari',k:0},
 {n:'Naga Hitam',l:5,xp:300,c:'Bench press 1x berat badan',k:1},
 {n:'Raja Besi',l:10,xp:600,c:'Deadlift 1,5x berat badan',k:2},
 {n:'Iblis Merah',l:20,xp:1000,c:'Pull-up 15 repetisi',k:3},
 {n:'Bayangan Mutlak',l:35,xp:2000,c:'Squat 2x berat badan',k:4}];
const STN={STR:'Kekuatan',AGI:'Kelincahan',END:'Stamina',VIT:'Vitalitas',WIL:'Tekad'};

/* ---------- ilustrasi (karakter orisinal) ---------- */
const heroSVG=`<svg viewBox="0 0 300 230" class="ar-hero-svg" aria-hidden="true">
<defs><radialGradient id="arg" cx="50%" cy="55%" r="55%"><stop offset="0" stop-color="#ff3b30" stop-opacity=".85"/><stop offset=".6" stop-color="#8a1118" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<linearGradient id="arb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2a2e"/><stop offset="1" stop-color="#120d10"/></linearGradient></defs>
<rect width="300" height="230" fill="#0a0709"/>
<g class="ar-rays" style="transform-origin:150px 120px">${Array.from({length:18},(_,i)=>`<path d="M150 120L${150+260*Math.cos(i*Math.PI/9)} ${120+260*Math.sin(i*Math.PI/9)}L${150+260*Math.cos((i+.35)*Math.PI/9)} ${120+260*Math.sin((i+.35)*Math.PI/9)}Z" fill="#c8262d" opacity=".13"/>`).join('')}</g>
<circle cx="150" cy="120" r="130" fill="url(#arg)"/>
<g stroke="#ff5a52" stroke-width="1.2" fill="url(#arb)" stroke-linejoin="round">
<path d="M82 112Q44 104 36 56L56 50Q66 84 98 94Z"/><path d="M218 112Q256 104 264 56L244 50Q234 84 202 94Z"/>
<ellipse cx="44" cy="52" rx="13" ry="11"/><ellipse cx="256" cy="52" rx="13" ry="11"/>
<path d="M100 100Q150 76 200 100L194 150Q176 196 160 232H140Q124 196 106 150Z"/>
<circle cx="150" cy="56" r="23"/><path d="M118 90Q150 64 182 90L170 80Q150 70 130 80Z"/>
<circle cx="96" cy="104" r="22"/><circle cx="204" cy="104" r="22"/></g>
<g stroke="#ff5a52" stroke-width="1" fill="none" opacity=".8"><path d="M150 82V228M128 100Q118 140 136 190M172 100Q182 140 164 190M120 118Q150 130 180 118M126 142Q150 152 174 142M96 92Q104 108 96 124M204 92Q196 108 204 124"/></g>
<path d="M132 52Q150 40 168 52" stroke="#000" stroke-width="3" fill="none" opacity=".55"/></svg>`;
function face(b){const hair=['M70 70L78 22L95 50L108 12L125 48L145 14L155 52L175 20L180 70Z','M66 76Q70 20 120 18Q172 20 176 76Q150 48 121 52Q92 48 66 76Z','M64 74L72 30L92 60L96 18L116 52L134 16L142 56L160 26L176 74Z','M70 80Q74 30 121 26Q168 30 172 80L152 52Q121 40 90 52Z','M60 78Q68 18 121 14Q174 18 182 78Q150 44 121 50Q92 44 60 78Z'][b.k],
 col=['#8a5a3c','#5d6470','#a07a52','#b0262d','#2b2230'][b.k];
 return `<svg viewBox="0 0 242 190" class="ar-face" aria-hidden="true"><rect width="242" height="190" fill="#120d10"/><circle cx="121" cy="100" r="82" fill="#c8262d" opacity=".18"/>
<path d="M30 190Q40 150 90 142H152Q202 150 212 190Z" fill="${col}" stroke="#000"/><rect x="104" y="116" width="34" height="34" fill="#a56d52"/>
<ellipse cx="121" cy="86" rx="48" ry="56" fill="#b37a5c" stroke="#000"/><path d="${hair}" fill="#0b0809" stroke="#000"/>
<path d="M88 84L110 90L88 96Z" fill="#fff"/><path d="M154 84L132 90L154 96Z" fill="#fff"/><circle cx="100" cy="90" r="3.2" fill="#ff3b30"/><circle cx="142" cy="90" r="3.2" fill="#ff3b30"/>
<path d="M84 74L112 80M158 74L130 80" stroke="#000" stroke-width="4"/><path d="M121 94V112M104 126Q121 132 138 126" stroke="#5a2e22" stroke-width="2.5" fill="none"/>
${b.k%2?'<path d="M96 70L108 108" stroke="#ece6d8" stroke-width="2.2" opacity=".7"/>':''}</svg>`}

/* ---------- gaya ---------- */
const css=`.ar-p{position:fixed;left:0;right:0;top:0;bottom:calc(68px + env(safe-area-inset-bottom,0px));z-index:900;background:#0a0709;color:#ece6d8;overflow-y:auto;display:none;padding:calc(10px + env(safe-area-inset-top,0px)) 14px 24px;font-family:inherit}
.ar-p.on{display:block}.ar-w{max-width:620px;margin:0 auto}
.ar-h{font-family:Anton,Impact,sans-serif;letter-spacing:.03em;font-weight:400}
.ar-hero{position:relative;border:1px solid #5a1a1f;border-radius:16px;overflow:hidden}.ar-hero-svg{display:block;width:100%}
.ar-hero .ar-t{position:absolute;left:14px;bottom:12px;right:14px;display:flex;justify-content:space-between;align-items:flex-end}
.ar-rk{font:400 54px/1 Anton,Impact,sans-serif;color:#ff5a52;text-shadow:0 0 18px #c8262d}
.ar-c{background:#17131a;border:1px solid #2a2330;border-radius:14px;padding:14px;margin-top:12px}
.ar-bar{height:10px;border-radius:9px;background:#2a2330;overflow:hidden;margin-top:6px}.ar-bar i{display:block;height:100%;background:linear-gradient(90deg,#c8262d,#ff5a52,#d4a84a)}
.ar-r{display:flex;justify-content:space-between;align-items:center;gap:10px}.ar-s{color:#9ba3b0;font-size:13px}
.ar-b{background:#c8262d;color:#fff;border:0;border-radius:9px;padding:9px 14px;font:600 14px inherit;cursor:pointer}.ar-b.g{background:transparent;border:1px solid #3a3040;color:#ece6d8}.ar-b:disabled{opacity:.35;cursor:default}
.ar-b:focus-visible,.ar-x:focus-visible{outline:2px solid #ff5a52;outline-offset:2px}
.ar-x{position:sticky;top:0;float:right;z-index:2;background:#17131a;color:#ece6d8;border:1px solid #3a3040;border-radius:50%;width:36px;height:36px;font-size:18px;cursor:pointer}
.ar-bs{display:flex;gap:12px;align-items:center}.ar-face{width:96px;border-radius:10px;border:1px solid #3a3040;flex:none}.ar-lock{filter:grayscale(1) brightness(.4)}
.ar-lv{position:fixed;inset:0;z-index:1000;background:#0a0709f2;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#ece6d8;text-align:center;animation:arf .4s}
.ar-lv .ar-h{font-size:64px;color:#ff5a52;text-shadow:0 0 30px #c8262d}.ar-tt{position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#ece6d8;color:#111;padding:9px 15px;border-radius:10px;font-weight:600;z-index:1001}
@keyframes arf{from{opacity:0;transform:scale(1.08)}}@keyframes arr{to{transform:rotate(360deg)}}
@media(prefers-reduced-motion:no-preference){.ar-rays{animation:arr 40s linear infinite}.ar-lv .ar-h{animation:arf .7s}}
.ar-fab{position:fixed;right:14px;bottom:84px;z-index:800;border-radius:50%;width:52px;height:52px;background:#c8262d;color:#fff;border:0;font-size:22px}`;

/* ---------- logika ---------- */
function roll(){const t=key();if(S.day===t)return;if(S.day&&!S.done&&S.last!==yk()&&S.streak>0){S.lost=true;S.streak=0}else if(S.day&&S.done)S.lost=false;S.day=t;S.prog=[0,0,0,0];S.done=false;save()}
function addXP(n,why){roll();S.xp+=n;let up=false;while(S.xp>=need(S.lvl)){S.xp-=need(S.lvl);S.lvl++;S.pts+=3;up=true}save();if(up)levelUp();else tt('+'+n+' XP'+(why?' - '+why:''));draw()}
function tt(m){const e=document.createElement('div');e.className='ar-tt';e.textContent=m;document.body.appendChild(e);setTimeout(()=>e.remove(),1800)}
function levelUp(){const r=rank(),o=document.createElement('div');o.className='ar-lv';o.setAttribute('role','alert');o.innerHTML=`<div class="ar-s">Naik tingkat</div><div class="ar-h">LEVEL ${S.lvl}</div><div style="margin:8px 0 18px">Rank ${r[1]}: ${r[2]}. +3 poin status</div><button class="ar-b">Lanjutkan</button>`;o.querySelector('button').onclick=()=>o.remove();document.body.appendChild(o)}
function radar(){const ax=Object.keys(STN),m=10+S.lvl*2,pt=(i,v)=>{const a=-Math.PI/2+i*2*Math.PI/5;return[110+Math.cos(a)*v*80,110+Math.sin(a)*v*80]};
 const poly=v=>ax.map((k,i)=>pt(i,v(k)).join(',')).join(' ');
 return `<svg viewBox="0 0 220 220" width="100%" style="max-width:260px;display:block;margin:auto" role="img" aria-label="Radar status">${[.33,.66,1].map(s=>`<polygon points="${poly(()=>s)}" fill="none" stroke="#3a3040"/>`).join('')}<polygon points="${poly(k=>Math.min(1,S.st[k]/m))}" fill="#c8262d88" stroke="#ff5a52" stroke-width="2"/>${ax.map((k,i)=>{const[x,y]=pt(i,1.18);return `<text x="${x}" y="${y+4}" fill="#9ba3b0" font-size="11" text-anchor="middle">${k}</text>`}).join('')}</svg>`}

function html(){roll();const r=rank(),n=need(S.lvl),done=S.prog.every((v,i)=>v>=Q[i][1]);
 return `<div class="ar-w"><button class="ar-x" data-ar="close" aria-label="Tutup">×</button>
<div class="ar-hero">${heroSVG}<div class="ar-t"><div><div class="ar-s">Level</div><div class="ar-h" style="font-size:34px">${S.lvl}</div></div><div style="text-align:right"><div class="ar-s">${r[2]}</div><div class="ar-rk">${r[1]}</div></div></div></div>
<div class="ar-c"><div class="ar-r"><b>XP</b><span class="ar-s">${S.xp} / ${n}</span></div><div class="ar-bar"><i style="width:${S.xp/n*100}%"></i></div><div class="ar-s" style="margin-top:8px">Beruntun: ${S.streak} hari${S.lost?' (putus kemarin, mulai lagi hari ini)':''}</div></div>
<h3 class="ar-h" style="font-size:24px;margin:18px 0 0">Misi harian</h3>
<div class="ar-c">${Q.map((q,i)=>`<div class="ar-r" style="padding:7px 0"><div style="flex:1"><div>${q[0]}</div><div class="ar-bar"><i style="width:${Math.min(100,S.prog[i]/q[1]*100)}%"></i></div></div><span class="ar-s" style="min-width:70px;text-align:right">${S.prog[i]}/${q[1]} ${q[3]}</span><button class="ar-b g" data-q="${i}" ${S.done?'disabled':''} aria-label="Tambah ${q[0]}">+${q[2]}</button></div>`).join('')}
<button class="ar-b" style="width:100%;margin-top:10px" data-ar="claim" ${(!done||S.done)?'disabled':''}>${S.done?'Misi selesai hari ini':'Klaim hadiah (+120 XP)'}</button></div>
<h3 class="ar-h" style="font-size:24px;margin:18px 0 0">Status</h3>
<div class="ar-c">${radar()}<div class="ar-s" style="text-align:center;margin:6px 0">Poin tersedia: <b style="color:#d4a84a">${S.pts}</b></div>
${Object.keys(STN).map(k=>`<div class="ar-r" style="padding:4px 0"><span>${STN[k]}</span><span><b>${S.st[k]}</b> <button class="ar-b g" data-st="${k}" ${S.pts?'':'disabled'} aria-label="Tambah ${STN[k]}">+</button></span></div>`).join('')}</div>
<h3 class="ar-h" style="font-size:24px;margin:18px 0 0">Bos arena</h3>
${BOSS.map(b=>{const lk=S.lvl<b.l,dn=S.boss[b.n];return `<div class="ar-c ar-bs">${face(b).replace('class="ar-face"',`class="ar-face ${lk?'ar-lock':''}"`)}<div style="flex:1"><div class="ar-h" style="font-size:20px">${lk?'???':b.n}</div><div class="ar-s">${lk?'Terbuka di level '+b.l:b.c}</div><div style="margin-top:8px">${dn?'<span style="color:#5fae7a">Dikalahkan</span>':`<button class="ar-b" data-boss="${b.k}" ${lk?'disabled':''}>Tandai kalah (+${b.xp} XP)</button>`}</div></div></div>`}).join('')}
<p class="ar-s" style="margin-top:16px;text-align:center">Karakter dan ilustrasi di sini orisinal, terinspirasi gaya petarung manga.</p></div>`}

let P;
function draw(){if(P&&P.classList.contains('on')){const y=P.scrollTop;P.innerHTML=html();P.scrollTop=y}}
function open(){P.classList.add('on');draw()}function close(){P.classList.remove('on')}
function init(){
 const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
 P=document.createElement('div');P.className='ar-p';P.setAttribute('role','dialog');P.setAttribute('aria-label','Arena');document.body.appendChild(P);
 P.addEventListener('click',e=>{const t=e.target.closest('[data-ar],[data-q],[data-st],[data-boss]');if(!t)return;const D=t.dataset;
  if(D.ar=='close')return close();
  if(D.q!==undefined&&!S.done){const i=+D.q;S.prog[i]=Math.min(Q[i][1],+(S.prog[i]+Q[i][2]).toFixed(1));save();draw();return}
  if(D.ar=='claim'){S.done=true;S.streak=(S.last===yk())?S.streak+1:1;S.last=key();S.lost=false;save();addXP(120,'Misi harian');return}
  if(D.st){if(S.pts){S.pts--;S.st[D.st]++;save();draw()}return}
  if(D.boss!==undefined){const b=BOSS[+D.boss];if(confirm('Kamu sudah menyelesaikan tantangan: '+b.c+'?')){S.boss[b.n]=1;save();addXP(b.xp,b.n+' dikalahkan')}}});
 const nav=$('nav');
 if(nav&&nav.lastElementChild){const b=nav.lastElementChild.cloneNode(true);[...b.attributes].forEach(a=>{if(/^(data-|on|id$|aria-current)/.test(a.name))b.removeAttribute(a.name)});b.className=b.className.replace(/\b\S*(active|on|sel)\S*\b/g,'').trim();
  const c=b.children;if(c.length>=2){c[0].textContent='♛';c[c.length-1].textContent='Arena'}else b.textContent='♛ Arena';
  b.addEventListener('click',e=>{e.stopPropagation();e.preventDefault();open()},true);nav.appendChild(b);
  nav.addEventListener('click',e=>{if(!b.contains(e.target))close()})}
 else{const f=document.createElement('button');f.className='ar-fab';f.textContent='♛';f.setAttribute('aria-label','Buka Arena');f.onclick=open;document.body.appendChild(f)}
}
window.BakiAwake={addXP,open,close,state:()=>S};
if(document.readyState=='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
