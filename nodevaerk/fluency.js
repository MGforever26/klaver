/* Nodeværk: separat, målt træning i hurtig genkendelse af enkeltnoder. */
(function(root){
'use strict';
const IDS=['treble','bass'].flatMap(clef=>Array.from({length:13},(_,i)=>clef+':'+(i-2)));
const COUNTS=[10,20,30,50];
const median=xs=>{if(!xs.length)return null;const a=xs.slice().sort((x,y)=>x-y),i=Math.floor(a.length/2);return a.length%2?a[i]:(a[i-1]+a[i])/2;};
function shuffled(xs,r=Math.random){const a=xs.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function stats(xs){const ok=xs.filter(x=>x.correct),ms=median(ok.map(x=>x.ms));return {total:xs.length,correct:ok.length,accuracy:xs.length?Math.round(100*ok.length/xs.length):null,medianMs:ms};}
function weight(id,history){
 const xs=history.filter(x=>x.id===id).slice(-12);
 if(!xs.length)return 1;
 const failures=xs.filter(x=>!x.correct).length/xs.length;
 const secs=median(xs.filter(x=>x.correct).map(x=>x.ms));
 return Math.min(7,1+3.5*failures+(secs===null?1:Math.max(0,secs-1700)/1700));
}
function weighted(history,r=Math.random,avoid=null){
 const options=IDS.filter(id=>id!==avoid),ws=options.map(id=>weight(id,history)),sum=ws.reduce((a,b)=>a+b,0);
 let value=r()*sum;
 for(let i=0;i<options.length;i++){value-=ws[i];if(value<0)return options[i];}
 return options[options.length-1];
}
function plan(data,count,r=Math.random){
 if(!COUNTS.includes(count))throw Error('Ugyldigt antal enkeltnoder');
 const deck=Array.isArray(data.deck)?data.deck.filter(id=>IDS.includes(id)):[];
 const history=Array.isArray(data.attempts)?data.attempts:[];
 const primary=count>=IDS.length?IDS.length:Math.ceil(count*.8);
 const fullDeck=count>=IDS.length?shuffled(IDS,r):null;
 const result=[];
 for(let i=0;i<primary;i++){
  if(count>=IDS.length){result.push(fullDeck[i]);continue;}
  if(!deck.length)deck.push(...shuffled(IDS,r));
  result.push(deck.shift());
 }
 for(let i=primary;i<count;i++)result.push(weighted(history,r,result[result.length-1]));
 data.deck=deck;
 // Spred gentagelserne mellem alle spørgsmål; undgå to ens lige efter hinanden.
 const mixed=shuffled(result,r);
 for(let i=1;i<mixed.length;i++){
  if(mixed[i]!==mixed[i-1])continue;
  const j=mixed.findIndex((v,k)=>k>i&&v!==mixed[i-1]&&(k===mixed.length-1||v!==mixed[k+1]));
  if(j>i)[mixed[i],mixed[j]]=[mixed[j],mixed[i]];
 }
 return mixed;
}
root.NVFluency={IDS,COUNTS,stats,weight,plan,median};
if(typeof document==='undefined')return;

const E=root.NV;
let chosenCount=30,clockStart=0,clockElapsed=0,pending=null;
function ensure(){
 if(!state.fluency||!Array.isArray(state.fluency.attempts))state.fluency={attempts:[],runs:[],deck:[],active:null,count:30};
 const f=state.fluency;
 if(!Array.isArray(f.runs))f.runs=[];
 if(!Array.isArray(f.deck))f.deck=[];
 if(!COUNTS.includes(f.count))f.count=30;
 return f;
}
function stopTimer(){if(clockStart){clockElapsed+=Math.max(0,performance.now()-clockStart);clockStart=0;}const s=currentSession();if(s&&s.phase==='question')s.elapsedMs=clockElapsed;return Math.min(180000,Math.max(0,Math.round(clockElapsed)));}
function beginTimer(){clockElapsed=Math.max(0,Number(currentSession()?.elapsedMs)||0);clockStart=document.hidden?0:performance.now();}
function clearNext(){if(pending!==null){clearTimeout(pending);pending=null;}}
function closeFluency(){clearNext();stopTimer();}
function formatMs(ms){return ms===null?'…':(ms/1000).toFixed(2).replace('.',',')+' s';}
function pitch(id){const [clef,step]=id.split(':');return {clef,step:Number(step),note:E.fromDiatonic((clef==='treble'?30:18)+Number(step))};}
function name(id){const p=pitch(id);return (p.note.letter==='B'?'H':p.note.letter)+(p.clef==='treble'?' · G-nøgle':' · F-nøgle');}
function currentSession(){return ensure().active;}
function injectChip(){
 const chips=APP.querySelector('.chips');
 if(chips&&!chips.querySelector('[data-action="fluency-open"]'))chips.insertAdjacentHTML('beforeend','<button class="chip fluency-chip" data-action="fluency-open">Enkeltnoder</button>');
}
const previousHome=home;
home=function(){closeFluency();previousHome();injectChip();};
const previousProgress=progress;
progress=function(){
 closeFluency();previousProgress();
 const f=ensure(),a=f.attempts,all=stats(a),last=stats(a.slice(-30)),prev=stats(a.slice(-60,-30));
 const card=document.createElement('section');card.className='card fluency-stat-card';
 const runs=f.runs.slice(-7).reverse();
 card.innerHTML='<div class="eyebrow">Separat hastighedstræning</div><h2>Enkeltnoder</h2><p class="subtle">G- og F-nøgle blandet. Tæller ikke med i dine øvrige svar, niveauer eller øvegrupper.</p>'+
 '<div class="fluency-metrics"><div><strong>'+all.total+'</strong><span>Besvarede noder</span></div><div><strong>'+(all.accuracy===null?'…':all.accuracy+'%')+'</strong><span>Korrekte i alt</span></div><div><strong>'+formatMs(last.medianMs)+'</strong><span>Median, sidste 30 svar</span></div></div>'+
 (prev.medianMs!==null&&last.medianMs!==null?'<p class="subtle">Forrige 30 svar: '+formatMs(prev.medianMs)+' i median for korrekte svar. Sammenlign altid også træfsikkerheden.</p>':'<p class="subtle">Efter flere sessioner kan du sammenligne dine svartider over tid.</p>')+
 (runs.length?'<h3>Seneste sessioner</h3><div class="fluency-history">'+runs.map(x=>'<div><span>'+new Date(x.at).toLocaleDateString('da-DK',{day:'numeric',month:'short'})+' · '+x.count+' toner</span><strong>'+formatMs(x.medianMs)+'</strong><span>'+x.correct+'/'+x.count+' rigtige</span></div>').join('')+'</div>':'')+
 '<button class="secondary" data-action="fluency-open">Øv enkeltnoder</button>';
 APP.querySelector('main').appendChild(card);
};
const previousHelp=help;
help=function(){closeFluency();save();previousHelp();const el=APP.querySelector('.help-content');if(el)el.insertAdjacentHTML('afterbegin','<h2>Hurtig nodegenkendelse</h2><p>Under »Hvad vil du øve?« kan du vælge Enkeltnoder: 10, 20, 30 eller 50 naturlige toner i G- og F-nøgle, blandet. Alle linjer og mellemrum samt én ekstra position og én hjælpelinje over og under hvert system indgår. Svar med ét tryk. Svartiden måles til første svar, og svære positioner får lidt flere gentagelser. Resultaterne er helt adskilt fra øvegrupper og niveauer.</p>');const footer=Array.from(el?.querySelectorAll('p')||[]).find(p=>p.textContent.includes('Nodeværk · Version 5.0'));if(footer)footer.textContent=footer.textContent.replace('Version 5.0','Version 5.2');};
function setup(){
 closeFluency();page='fluency-setup';const f=ensure();chosenCount=f.count;
 const s=f.active,canResume=s&&s.phase!=='summary'&&s.index<s.ids.length;
 shell('<button class="back-button" data-action="fluency-exit">'+icon('back')+'Til øvelserne</button>'+
 '<section class="hero"><div class="eyebrow">Hurtig genkendelse</div><h1>Enkeltnoder</h1><p>G- og F-nøgle blandet. Alle fem linjer, mellemrum og de nærmeste positioner udenfor. Genkend tonen, og tryk én gang.</p></section>'+
 (canResume?'<section class="card"><h2>Fortsæt din session</h2><p class="subtle">'+s.index+' af '+s.ids.length+' toner gennemført.</p><button class="primary" data-action="fluency-resume">Fortsæt hvor du slap'+icon('arrow')+'</button></section>':'')+
 '<section class="card"><h2>Hvor mange toner?</h2><p class="subtle">De svære toner dukker gradvist oftere op, mens alle positioner fortsat bliver trænet.</p><div class="fluency-counts" role="group" aria-label="Antal toner">'+COUNTS.map(n=>'<button class="chip '+(n===chosenCount?'active':'')+'" aria-pressed="'+(n===chosenCount)+'" data-action="fluency-count" data-value="'+n+'">'+n+'</button>').join('')+'</div><button class="primary" data-action="fluency-start">Start '+chosenCount+' toner'+icon('arrow')+'</button></section>'+
 '<p class="storage-note">Denne træning har sin egen statistik. Den ændrer ikke din samlede progression.</p>',false);
}
function start(count){
 closeFluency();const f=ensure();f.count=count;f.active={ids:plan(f,count),index:0,results:[],phase:'question',startedAt:Date.now(),elapsedMs:0};
 save();draw(true);
}
function draw(scroll=false){
 clearNext();page='fluency-exercise';const s=currentSession();if(!s)return setup();
 if(s.phase==='summary')return results();
 const id=s.ids[s.index],p=pitch(id),q=s.results[s.index],done=s.index,total=s.ids.length;
 const score={key:'C',time:null,measures:[{treble:p.clef==='treble'?[p.note]:[],bass:p.clef==='bass'?[p.note]:[]}]};
 shell('<div class="exercise-top row"><button class="back-button" data-action="fluency-pause">'+icon('back')+'Gem og hold pause</button><span class="pill">'+(done+1)+' / '+total+'</span></div>'+
 '<div class="fluency-progress"><div style="width:'+Math.round(100*done/total)+'%"></div></div>'+
 '<section class="question-heading"><span class="eyebrow">'+(p.clef==='treble'?'G-nøgle · Højre hånd':'F-nøgle · Venstre hånd')+'</span><h1>Hvilken tone ser du?</h1><p>Tryk på tonenavnet. Det første svar tæller.</p></section>'+
 '<div class="score-card"><div class="score-tools"><span class="eyebrow">Ingen fortegn</span><button class="text-button" data-action="fluency-zoom">'+icon('zoom')+'Forstør</button></div><div id="fluency-score" class="score"></div></div>'+
 (q?'<div class="feedback '+(q.correct?'':'incorrect')+'"><div class="feedback-title">'+icon(q.correct?'check':'repeat')+(q.correct?'Rigtigt!':'Det er '+name(id))+'</div>'+(q.correct?'<p>Godt set.</p>':'<p>Du svarede '+esc(q.guess)+'. Se placeringen på nodesystemet.</p>')+'</div><button class="primary" data-action="fluency-next">'+(done+1>=total?'Se resultatet':'Næste tone')+icon('arrow')+'</button>':
 '<div class="fluency-answers" role="group" aria-label="Vælg tonenavn">'+['C','D','E','F','G','A','H'].map(n=>'<button data-action="fluency-answer" data-value="'+n+'">'+n+'</button>').join('')+'</div>')+
 '<p class="below-button">Svar hurtigt, men bevar præcisionen.</p>',false);
 try{Notation.render(document.getElementById('fluency-score'),score,{target:{measure:0,clef:p.clef,index:0}});}
 catch(err){console.error('Nodeværk: Enkeltnoder',err);const area=APP.querySelector('.fluency-answers');if(area)area.innerHTML='<div class="alert">Noden kunne ikke tegnes. Prøv at genindlæse appen.</div>';}
 if(q){stopTimer();if(q.correct)pending=setTimeout(()=>{pending=null;if(page==='fluency-exercise'&&currentSession()?.results[s.index])advance();},420);}
 else beginTimer();
 if(scroll)window.scrollTo(0,0);
}
function answer(letter){
 const s=currentSession();if(!s||s.phase!=='question'||s.results[s.index])return;
 if(!['C','D','E','F','G','A','H'].includes(letter))return;
 const id=s.ids[s.index],p=pitch(id),expected=p.note.letter==='B'?'H':p.note.letter,ms=stopTimer(),correct=letter===expected;
 const item={id,correct,guess:letter,ms,at:Date.now()};
 s.results[s.index]=item;ensure().attempts.push(item);if(ensure().attempts.length>5000)ensure().attempts.splice(0,ensure().attempts.length-5000);
 s.phase='feedback';save();draw();
}
function advance(){
 const s=currentSession();if(!s||s.phase!=='feedback')return;
 clearNext();s.index++;
 if(s.index>=s.ids.length){
  s.phase='summary';const report=stats(s.results);
  ensure().runs.push({at:Date.now(),count:s.ids.length,...report});
  if(ensure().runs.length>250)ensure().runs.shift();
  save();results();
 }else{s.phase='question';s.elapsedMs=0;save();draw(true);}
}
function results(){
 closeFluency();page='fluency-summary';const s=currentSession();if(!s)return setup();const report=stats(s.results);
 const wrong=s.results.filter(x=>!x.correct);
 const hist=ensure().runs.slice(-5).reverse();
 shell('<section class="hero"><div class="eyebrow">Din hastighedstræning</div><h1>Session gennemført</h1><p>Godt arbejde. Svartiden er målt frem til dit første tryk, ikke efterfølgende rettelser.</p></section>'+
 '<div class="fluency-metrics fluency-result-metrics"><div><strong>'+report.correct+'/'+report.total+'</strong><span>Korrekte</span></div><div><strong>'+(report.accuracy===null?'…':report.accuracy+'%')+'</strong><span>Træfsikkerhed</span></div><div><strong>'+formatMs(report.medianMs)+'</strong><span>Median, korrekte</span></div></div>'+
 (wrong.length?'<section class="card"><h2>Disse skal gentages</h2>'+wrong.slice(0,8).map(x=>'<div class="review-row"><strong>'+name(x.id)+'</strong><p>Du svarede '+esc(x.guess)+'.</p></div>').join('')+'</section>':'')+
 (hist.length>1?'<section class="card"><h2>Udvikling over tid</h2><div class="fluency-history">'+hist.map(x=>'<div><span>'+new Date(x.at).toLocaleDateString('da-DK',{day:'numeric',month:'short'})+'</span><strong>'+formatMs(x.medianMs)+'</strong><span>'+x.correct+'/'+x.count+'</span></div>').join('')+'</div></section>':'')+
 '<button class="primary" data-action="fluency-again">Ny session'+icon('arrow')+'</button><button class="text-button wide" data-action="fluency-exit">Til øvelserne</button><p class="storage-note">Resultatet gemmes separat og tæller ikke med i din samlede progression.</p>',false);
}
document.addEventListener('click',function(ev){
 const b=ev.target.closest('[data-action]');if(!b||b.disabled)return;
 const a=b.dataset.action;
 if(a==='fluency-open')setup();
 else if(a==='fluency-count'){chosenCount=Number(b.dataset.value);APP.querySelectorAll('[data-action="fluency-count"]').forEach(c=>{const yes=Number(c.dataset.value)===chosenCount;c.classList.toggle('active',yes);c.setAttribute('aria-pressed',String(yes));});APP.querySelector('[data-action="fluency-start"]').innerHTML='Start '+chosenCount+' toner'+icon('arrow');}
 else if(a==='fluency-start')start(chosenCount);
 else if(a==='fluency-resume')draw(true);
 else if(a==='fluency-answer')answer(b.dataset.value);
 else if(a==='fluency-next')advance();
 else if(a==='fluency-pause'){closeFluency();save();setup();}
 else if(a==='fluency-exit'){closeFluency();save();home();}
 else if(a==='fluency-again'){const f=ensure();start(f.count);}
 else if(a==='fluency-zoom'){stopTimer();save();const s=currentSession(),p=pitch(s.ids[s.index]);openZoom({key:'C',time:null,measures:[{treble:p.clef==='treble'?[p.note]:[],bass:p.clef==='bass'?[p.note]:[]}]},{measure:0,clef:p.clef,index:0});}
});
document.addEventListener('visibilitychange',()=>{if(page==='fluency-exercise'&&currentSession()?.phase==='question'){if(document.hidden){stopTimer();save();}else if(!clockStart)clockStart=performance.now();}});
window.addEventListener('pagehide',()=>{if(page==='fluency-exercise'){stopTimer();save();}});
document.getElementById('modal').addEventListener('close',()=>{if(page==='fluency-exercise'&&currentSession()?.phase==='question'&&!document.hidden&&!clockStart)clockStart=performance.now();});
window.addEventListener('storage',()=>{if(page==='fluency-exercise')draw();else if(page==='fluency-summary')results();else if(page==='fluency-setup')setup();});
home();
})(window);
