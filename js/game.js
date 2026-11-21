const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const store={get:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}};
let muted=store.get('fq_mute',false),Q=[],i=0,pts=0,ok=0,streak=0,best=0,fails=[],locked=false,hinted=false,tStart=0,raf=0;
const TIME=15000,N=30,sym=p=>'/'+(p==='r'?'ř':p)+'/';

// ---- Fondo, carga y tema
for(let n=0;n<14;n++){const e=document.createElement('i');e.style.cssText=`--s:${30+Math.random()*60}px;--x:${Math.random()*100}%;--d:${14+Math.random()*16}s;animation-delay:-${Math.random()*20}s`;$('.bg').append(e)}
$('#chips').innerHTML=Object.keys(PH).map((p,n)=>`<span style="--dl:${n*.15}s">${sym(p)}</span>`).join('');
const msgs=['Afinando los fonemas…','Calentando la lengua…','Colocando el punto de articulación…','¡Listo!'];
let pr=0;const ld=setInterval(()=>{pr+=Math.random()*18+6;$('#barfill').style.width=Math.min(pr,100)+'%';$('#loadtext').textContent=msgs[Math.min(3,Math.floor(pr/34))];if(pr>=100){clearInterval(ld);setTimeout(()=>$('#loader').classList.add('out'),400)}},350);
function setTheme(t){document.documentElement.dataset.theme=t;$('#btnTheme').textContent=t==='dark'?'☀️':'🌙';store.set('fq_theme',t)}
setTheme(store.get('fq_theme',matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'));
$('#btnTheme').onclick=()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');
function paintMute(){const b=$('#btnSound'),t=muted?'Activar sonido':'Silenciar sonido';b.textContent=muted?'🔇':'🔊';b.setAttribute('aria-pressed',muted);b.setAttribute('aria-label',t);b.title=t}
paintMute();
$('#btnSound').onclick=()=>{muted=!muted;store.set('fq_mute',muted);if(muted&&'speechSynthesis' in window)speechSynthesis.cancel();paintMute();toast(muted?'Sonido silenciado':'Sonido activado');if(!muted)beep(740)};

// ---- Sonidos (efectos) y voz (pronunciación)
let ac;function beep(f,d=.15,type='sine'){if(muted)return;try{ac=ac||new AudioContext();if(ac.state==='suspended')ac.resume();const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(.15,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+d);o.connect(g).connect(ac.destination);o.start();o.stop(ac.currentTime+d)}catch{}}
const sfx={ok:()=>{beep(660);setTimeout(()=>beep(880),90)},no:()=>beep(160,.3,'sawtooth'),end:()=>[523,659,784,1046].forEach((f,n)=>setTimeout(()=>beep(f,.25),n*140))};
function toast(t){let e=$('#toast');if(!e){e=document.createElement('div');e.id='toast';e.className='toast';e.setAttribute('role','status');document.body.append(e)}e.textContent=t;e.classList.add('on');clearTimeout(e.t);e.t=setTimeout(()=>e.classList.remove('on'),2200)}
function speak(text,rate=.9,o={}){if(!('speechSynthesis' in window)){if(!o.auto)toast('Tu navegador no admite voz');return}if(muted){if(!o.auto)toast('Sonido silenciado. Actívalo con el botón 🔇');return}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);const v=speechSynthesis.getVoices();const Ls=(o.lang?[o.lang]:[]).concat(['es-VE','es-MX','es-US','es-CO','es-ES']);const pick=Ls.map(l=>v.find(x=>x.lang.replace('_','-')===l)).find(Boolean)||v.find(x=>x.lang.startsWith('es'));if(pick){u.voice=pick;u.lang=pick.lang}else u.lang=o.lang||'es-VE';u.rate=rate;setTimeout(()=>{if(!muted)speechSynthesis.speak(u)},60)}
const SND={p:'pa',t:'ta',b:'ba',m:'ma',s:'sa',k:'ka',a:'a',i:'i',d:'da',g:'ga',f:'fa','θ':'za','ʝ':'ya',x:'ja','tʃ':'cha',n:'na','ɲ':'ña',l:'la','ʎ':'lla','ɾ':'ara',r:'arra',e:'e',o:'o',u:'u'};
function speakPh(p){speak(SND[p],.6,{lang:p==='θ'?'es-ES':null})}
if('speechSynthesis' in window)speechSynthesis.onvoiceschanged=()=>{};

// ---- Pantallas
function show(id){$$('.screen').forEach(s=>s.classList.toggle('active',s.id===id));if(id==='scores')renderScores();if(id!=='game')cancelAnimationFrame(raf)}
const shuffle=a=>{a=[...a];for(let n=a.length-1;n>0;n--){const j=Math.random()*(n+1)|0;[a[n],a[j]]=[a[j],a[n]]}return a};
const plain=w=>w.replace(/[\[\]]/g,'');

// ---- Juego
function start(){const nm=$('#player').value.trim();store.set('fq_name',nm);Q=shuffle(W).slice(0,N);i=pts=ok=streak=best=0;fails=[];show('game');ask()}
function ask(){locked=false;hinted=false;const q=Q[i];$('#qn').textContent=i+1;$('#pts').textContent=pts;$('#streak').textContent=streak;$('#fb').textContent='';$('#hint').textContent='';$('#btnNext').hidden=true;$('#btnHint').disabled=false;$('#btnPh').hidden=true;
 const m=q.w.match(/^(.*)\[(.+)\](.*)$/);let n=0;const L=s=>[...s].map(c=>`<span style="animation-delay:${n++*.06}s">${c}</span>`).join('');
 $('#word').innerHTML=L(m[1])+'<mark>'+L(m[2])+'</mark>'+L(m[3]);
 const keys=Object.keys(PH).filter(k=>k!==q.p);const opts=shuffle([q.p,...shuffle(keys).slice(0,5)]);
 $('#opts').innerHTML=opts.map((p,k)=>`<button class="opt" data-p="${p}" style="animation-delay:${k*.05}s">${sym(p)}</button>`).join('');
 $$('.opt').forEach(b=>b.onclick=()=>answer(b.dataset.p,b));
 tStart=performance.now();cancelAnimationFrame(raf);tick();setTimeout(()=>speak(plain(q.w),.9,{auto:true}),500)}
function tick(){const r=1-(performance.now()-tStart)/TIME;$('#tfill').style.width=Math.max(r,0)*100+'%';if(r<=0&&!locked)answer(null);else if(!locked)raf=requestAnimationFrame(tick)}
function bump(el){el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump')}
function answer(p,btn){if(locked)return;locked=true;cancelAnimationFrame(raf);const q=Q[i],good=p===q.p,left=Math.max(0,1-(performance.now()-tStart)/TIME);
 $$('.opt').forEach(b=>{b.disabled=true;if(b.dataset.p===q.p)b.classList.add('ok')});
 const f=PH[q.p].join(', ').toLowerCase(),letra=q.w.match(/\[(.+)\]/)[1];
 if(good){streak++;best=Math.max(best,streak);ok++;const g=hinted?5:10+Math.round(left*5)+Math.min(streak-1,5);pts+=g;sfx.ok();$('#fb').style.color='var(--ok)';$('#fb').textContent=`¡Correcto! +${g} · «${letra}» = ${sym(q.p)} (${f})`;$('#card').animate([{transform:'scale(1)'},{transform:'scale(1.05)'},{transform:'scale(1)'}],400)}
 else{streak=0;fails.push(`${plain(q.w)} → ${sym(q.p)}`);if(btn)btn.classList.add('no');sfx.no();$('#fb').style.color='var(--bad)';$('#fb').textContent=(p?'Casi. ':'Se acabó el tiempo. ')+`«${letra}» = ${sym(q.p)} (${f})`}
 $('#pts').textContent=pts;bump($('#pts'));$('#streak').textContent=streak;bump($('#streak'));
 $('#btnNext').hidden=false;$('#btnNext').textContent=i===N-1?'Ver resultado':'Siguiente';$('#btnNext').focus()}
function next(){if(i>=N-1)return finish();i++;ask()}
function finish(){show('end');const pc=Math.round(ok/N*100);
 $('#endTitle').textContent=pc>=90?'¡Fonetista experto!':pc>=70?'¡Muy buen oído!':pc>=50?'¡Vas por buen camino!':'¡A practicar más!';
 $('#finalPts').textContent=0;let c=0;const iv=setInterval(()=>{c+=Math.ceil((pts-c)/8)||1;if(c>=pts){c=pts;clearInterval(iv)}$('#finalPts').textContent=c},40);
 $('#endStats').textContent=`${ok} de ${N} correctas (${pc}%) · mejor racha: ${best}`;
 $('#fails').innerHTML=fails.length?'<b>Para repasar:</b><br>'+fails.join(' · '):'';
 const s=store.get('fq_scores',[]);s.push({n:$('#player').value.trim()||'Anónimo',p:pts,ok,d:new Date().toLocaleDateString('es-VE')});s.sort((a,b)=>b.p-a.p);store.set('fq_scores',s.slice(0,50));
 sfx.end();if(pc>=70)confetti()}
function confetti(){for(let n=0;n<70;n++){const e=document.createElement('i');e.className='confetti';e.style.cssText=`left:${Math.random()*100}%;background:${['#071689','#3d5bff','#8aa3ff','#f2c230'][n%4]};animation-duration:${2+Math.random()*2.5}s;animation-delay:${Math.random()}s`;document.body.append(e);setTimeout(()=>e.remove(),5500)}}
function renderScores(){const s=store.get('fq_scores',[]);$('#scoreList').innerHTML=s.length?s.slice(0,10).map((x,n)=>`<li style="animation-delay:${n*.06}s"><span>${['🥇','🥈','🥉'][n]||n+1+'.'} ${x.n.replace(/[<>&]/g,'')} <small>· ${x.ok}/30 · ${x.d}</small></span><b>${x.p}</b></li>`).join(''):'<p class="sub">Aún no hay puntajes. ¡Juega una ronda!</p>'}

// ---- Modales
function modal(h){$('#modalBody').innerHTML=h;$('#modal').classList.add('on')}
$('#closeModal').onclick=()=>$('#modal').classList.remove('on');
$('#modal').onclick=e=>{if(e.target.id==='modal')$('#modal').classList.remove('on')};
$('#btnTable').onclick=()=>modal('<h3>Cuadro de fonemas</h3><table><tr><th>Fonema</th><th>Punto</th><th>Modo</th><th>Sonoridad</th><th>Acústico</th><th>Resonancia</th></tr>'+Object.entries(PH).map(([k,v])=>`<tr><td><b>${sym(k)}</b> <button class="mini" data-p="${k}" aria-label="Escuchar ${sym(k)}">🔈</button></td><td>${v[0]}</td><td>${v[1]}</td><td>${v[2]}</td><td>${v[4]}</td><td>${v[3]}</td></tr>`).join('')+'</table>');
$('#modalBody').addEventListener('click',e=>{const b=e.target.closest('.mini');if(b)speakPh(b.dataset.p)});
$('#btnHow').onclick=()=>modal('<h3>Cómo se juega</h3><ul><li>Cada ronda tiene 30 palabras con una letra resaltada.</li><li>Elige el fonema (AFI) que representa esa letra. Tienes 15 segundos.</li><li>Acierto: 10 puntos + bono por rapidez + bono por racha.</li><li>Con pista ganas solo 5 puntos y oyes el sonido del fonema.</li><li>Escucha la palabra con 🔊 o 🐢. Atajos: 1–6 para responder, Enter para seguir.</li><li>La pronunciación depende de las voces en español de tu dispositivo.</li><li>Se distingue «ll» /ʎ/ de «y» /ʝ/ y «z» /θ/ (variedad peninsular) de «s» /s/.</li></ul>');

// ---- Eventos
$('#player').value=store.get('fq_name','');
$('#btnPlay').onclick=$('#again').onclick=start;
$('#btnScores').onclick=$('#toScores').onclick=()=>show('scores');
$('#backHome').onclick=$('#toHome').onclick=()=>show('home');
$('#clearScores').onclick=()=>{if(confirm('¿Borrar todos los puntajes?')){store.set('fq_scores',[]);renderScores()}};
$('#btnListen').onclick=()=>speak(plain(Q[i].w));$('#btnSlow').onclick=()=>speak(plain(Q[i].w),.45);
$('#btnHint').onclick=()=>{if(locked)return;hinted=true;$('#btnHint').disabled=true;const p=Q[i].p;$('#hint').textContent='Pista: '+PH[p].join(' · ')+(p==='ʎ'?' · Muchas voces lo pronuncian como /ʝ/.':p==='θ'?' · Suena mejor con voz de España.':'')+' (valdrá 5 puntos)';$('#btnPh').hidden=false;speakPh(p)};
$('#btnPh').onclick=()=>speakPh(Q[i].p);
$('#btnNext').onclick=next;
document.addEventListener('keydown',e=>{if(!$('#game').classList.contains('active'))return;if(e.key==='Enter'&&locked)next();const b=$$('.opt')[+e.key-1];if(b&&!locked)b.click()});
