/* Playing studio and extended question controls; retains the existing app and storage identity. */
'use strict';
const L=E.learning;
L.migrate(state);
let sequence=[],tapRun=null,transport=null,transportTimers=[],transportNodes=[],catalogFilter='all',catalogLevel=0,catalogWork='all',catalogQuery='',studioConfig=null;
const oldAnswerControls=answerControls,oldRefreshAnswer=refreshAnswer,oldSubmit=submit,oldShowQuestion=showQuestion,oldFeedback=feedback,oldHome=home,oldProgress=progress,oldHelp=help,oldStopAudio=stopAudio;
function tokenName(id){const [letter,alter]=id.split(':');return E.spelling({letter},Number(alter));}
function tokenStrip(q){let boundary=0;const starts=new Map();for(const g of q.groups||[]){starts.set(boundary,g.measure+1);boundary+=g.count;}
 return '<div class="sequence-strip" aria-label="Din tonerække">'+q.expectedTokens.map((_,i)=>(starts.has(i)?'<span class="sequence-bar">Takt '+starts.get(i)+'</span>':'')+'<button class="sequence-slot '+(i===sequence.length?'current':'')+'" data-action="sequence-cut" data-index="'+i+'" aria-label="Tone '+(i+1)+(sequence[i]?': '+tokenName(sequence[i])+', ret herfra':'')+'">'+(sequence[i]?esc(tokenName(sequence[i])):'<span>'+(i+1)+'</span>')+'</button>').join('')+'</div>';
}
answerControls=function(q){
 if(q.type==='tap')return '<section class="tap-panel"><p class="subtle">'+q.tempo+' BPM · '+(L.pulseInfo(q.score.time).compound?'Klikket følger de punkterede fjerdedele':'Ét klik pr. fjerdedel')+'</p><div class="pulse-readout" id="tap-count" aria-live="polite">Klar</div><button class="primary" data-action="tap-start">Start med én takts optælling</button><button class="tap-pad" id="tap-pad" data-action="tap-hit" disabled>Bank her</button><p class="subtle" id="tap-status">Bank ved nye toner. Hold igen ved pauser og bindebuer.</p></section>';
 if(q.type!=='sequence')return oldAnswerControls(q);
 const controls=oldAnswerControls({...q,type:'pitch'});
 return '<div id="sequence-strip">'+tokenStrip(q)+'</div>'+controls.replace('<button id="submit-answer"','<div class="sequence-actions"><button id="sequence-add" class="secondary" data-action="sequence-add" disabled>Tilføj tone</button><button class="text-button" data-action="sequence-undo">Fortryd sidste</button></div><button id="submit-answer"');
};
refreshAnswer=function(){const q=current();if(q?.type!=='sequence')return oldRefreshAnswer();
 document.querySelectorAll('.note-key').forEach(b=>{const on=b.dataset.value===selectedLetter;b.classList.toggle('selected',on);b.setAttribute('aria-pressed',on);});
 document.querySelectorAll('.acc-key').forEach(b=>{const on=Number(b.dataset.value)===selectedAlter;b.classList.toggle('selected',on);b.setAttribute('aria-pressed',on);});
 document.getElementById('answer-preview').textContent=selectedLetter?E.spelling({letter:selectedLetter},selectedAlter):'Vælg en tone';
 document.getElementById('sequence-add').disabled=!selectedLetter||sequence.length>=q.expectedTokens.length;
 document.getElementById('submit-answer').disabled=sequence.length!==q.expectedTokens.length;
 document.getElementById('sequence-strip').innerHTML=tokenStrip(q);
};
showQuestion=function(scroll=false){stopTransport();tapRun=null;sequence=[];return oldShowQuestion(scroll);};
function storeEntry(q,answer,label,extra={}){const s=state.session;if(!s||s.results[s.index])return;const result={...E.record(state,q,answer,stopClock()),...extra},entry={q,answer,label,result};s.results[s.index]=entry;save();document.getElementById('answer-area').innerHTML=feedback(entry);announce(result.correct?'Rigtigt.':'Se forklaringen.');document.querySelector('[data-action="next"]')?.focus({preventScroll:true});}
submit=function(){const q=current();if(q?.type==='sequence'){if(sequence.length!==q.expectedTokens.length)return;storeEntry(q,JSON.stringify(sequence),sequence.map(tokenName).join(' · '));}else if(q?.type!=='tap')oldSubmit();};
feedback=function(entry){let html=oldFeedback(entry);const {q,result}=entry;
 if(q.type==='sequence'&&!result.correct){let actual=[];try{actual=JSON.parse(entry.answer);}catch{}const mismatches=q.expectedTokens.map((expected,i)=>actual[i]===expected?'':(i+1)+'. tone: '+tokenName(expected)).filter(Boolean);html=html.replace('</div><button class="primary"','<p class="sequence-correction">Ret disse pladser: '+esc(mismatches.join(' · '))+'.</p></div><button class="primary"');}
 if(q.type==='tap'){html=html.replace('Svaret er '+esc(q.answerLabel),'Prøv rytmen igen');html=html.replace('<p>'+esc(q.explanation)+'</p>','<p>'+esc(result.tapFeedback||q.explanation)+'</p><button class="text-button" data-action="tap-listen">Hør rytmen</button>');}
 return html;
};
function stopTransport(){for(const timer of transportTimers){clearTimeout(timer);clearInterval(timer);}transportTimers=[];for(const node of transportNodes){try{node.stop();}catch{}}transportNodes=[];transport=null;const startButton=document.getElementById('studio-start');if(startButton)startButton.disabled=false;document.querySelectorAll('.playing-measure').forEach(el=>el.classList.remove('playing-measure'));}
stopAudio=function(){oldStopAudio();stopTransport();};
async function ensureAudio(){
 const AudioCtx=window.AudioContext||window.webkitAudioContext;
 if(!AudioCtx)throw Error('Denne browser understøtter ikke lyd');
 if(!audio||audio.state==='closed')audio=new AudioCtx();
 if(audio.state!=='running')await audio.resume();
 if(audio.state!=='running')throw Error('Lyden blev ikke aktiveret af browseren');
 return audio;
}
function sound(midi,start,duration,volume=.12,click=false){const osc=audio.createOscillator(),gain=audio.createGain();osc.type=click?'sine':'triangle';osc.frequency.value=click?midi:440*Math.pow(2,(midi-69)/12);gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(volume,start+.008);gain.gain.exponentialRampToValueAtTime(.001,start+Math.max(.025,duration-.015));osc.connect(gain);gain.connect(audio.destination);osc.start(start);osc.stop(start+duration);osc.onended=()=>{osc.disconnect();gain.disconnect();};transportNodes.push(osc);}
function scheduleClicks(start,tempo,pulses,count,accentEvery){const period=60/tempo;for(let i=0;i<count;i++)sound(i%accentEvery===0?1100:740,start+i*period,.045,i%accentEvery===0?.12:.075,true);}
async function startTap(){const q=current();if(!q||q.type!=='tap'||state.session.results[state.session.index]||tapRun)return;
 const session=state.session;try{await ensureAudio();if(current()!==q||state.session!==session||page!=='exercise')return;
 const info=L.pulseInfo(q.score.time),period=60/q.tempo,lead=.2,start=audio.currentTime+lead+info.pulses*period,perfStart=performance.now()+1000*(lead+info.pulses*period),length=info.beats*q.score.measures.length/info.pulse*period;
 tapRun={q,taps:[],perfStart};transport={kind:'tap'};
 scheduleClicks(start-info.pulses*period,q.tempo,info.pulses,info.pulses*(1+q.score.measures.length),info.pulses);
 document.querySelector('[data-action="tap-start"]').disabled=true;document.getElementById('tap-pad').disabled=false;
 transportTimers.push(setInterval(()=>{if(!tapRun)return;const elapsed=(performance.now()-perfStart)/1000;document.getElementById('tap-count').textContent=elapsed<0?'Tæl '+(Math.max(1,Math.floor((elapsed+info.pulses*period)/period)+1)):String(Math.min(info.pulses*q.score.measures.length,Math.floor(elapsed/period)+1));document.getElementById('tap-status').textContent=elapsed<0?'Vent på optællingen.':'Bank ved nye anslag.';},40));
 transportTimers.push(setTimeout(()=>{if(!tapRun||current()!==q)return;const result=L.gradeTaps(q,tapRun.taps,q.tempo);tapRun=null;stopTransport();storeEntry(q,result.correct?'ok':'timing',''+result.actual+' anslag',{tapFeedback:result.feedback,tapMistakes:result.mistakes});},(lead+info.pulses*period+length)*1000+200));
 }catch{tapRun=null;stopTransport();document.getElementById('tap-status').textContent='Lyden kunne ikke starte. Tryk igen, når lyd er tilladt.';document.querySelector('[data-action="tap-start"]').disabled=false;}}
function tapHit(){if(!tapRun)return;const at=performance.now()-tapRun.perfStart;if(at< -160)return;tapRun.taps.push(at);const pad=document.getElementById('tap-pad');pad.classList.add('hit');setTimeout(()=>pad.classList.remove('hit'),75);}
async function listenScore(score,hand='both',tempo=64,start=0,end=score.measures.length){stopAudio();await ensureAudio();const info=L.pulseInfo(score.time),data=L.timeline(score,hand,start,end),unit=60/tempo/info.pulse,begin=audio.currentTime+.15;transport={kind:'listen'};for(const event of data.events)sound(event.midi,begin+event.at*unit,event.duration*unit,event.clef==='treble'?.12:.09);transportTimers.push(setTimeout(()=>{stopTransport();if(page==='piece')updateStudioListen();},data.duration*unit*1000+250));}
function updateStudioListen(){const b=document.querySelector('[data-action="studio-listen"]');if(b)b.textContent=transport?'Stop lyd':'Lyt til stykket';}
home=function(){stopAudio();oldHome();const next=L.nextPiece(state),due=L.dueReviews(state).length;const main=APP.querySelector('main');const section=document.createElement('section');section.className='card next-music';section.innerHTML='<div class="eyebrow">Ved klaveret</div><h2>'+esc(next.title)+'</h2><p>'+esc(next.subtitle)+'</p><button class="secondary" data-action="studio" data-id="'+next.id+'">Spil efter noder '+icon('arrow')+'</button>'+(due?'<button class="text-button" data-action="review-start">'+due+' områder klar til genbesøg</button>':'');main.querySelector('.practice-card')?.after(section);};
function pieceMatches(p){const query=(p.title+' '+(p.composer||'')+' '+p.subtitle+' '+E.KEY_NAMES[p.tonality||p.key]).toLocaleLowerCase('da');return(catalogWork==='all'||p.workId===catalogWork)&&(!catalogLevel||p.level===catalogLevel)&&(catalogFilter==='all'||catalogFilter==='new'&&!state.learning.practice.some(x=>x.pieceId===p.id)||p.collection===catalogFilter)&&(!catalogQuery||query.includes(catalogQuery.toLocaleLowerCase('da')));}
function workOptions(){const works=[...new Map(E.PIECES.filter(p=>p.workId).map(p=>[p.workId,p.workName||p.title.split(' · ')[0]])).entries()];return '<option value="all">Alle værker</option>'+works.map(([id,label])=>'<option value="'+esc(id)+'" '+(catalogWork===id?'selected':'')+'>'+esc(label)+'</option>').join('');}
function relatedPassagesMarkup(p){
 if(!p.workId)return '';
 const others=E.PIECES.filter(x=>x.workId===p.workId&&x.id!==p.id);
 if(!others.length)return '';
 return '<section class="card related-pieces"><div class="eyebrow">Andre passager fra samme værk</div><h2>'+esc(p.workName||p.title.split(' · ')[0])+'</h2><p class="subtle">'+others.length+' andre øveuddrag. Vælg en anden del af musikken.</p>'+others.map(x=>'<button class="related-row" data-action="piece" data-id="'+esc(x.id)+'"><span><strong>'+esc(x.title)+'</strong><small>'+esc(x.subtitle.split(' · ')[0])+' · Niveau '+x.level+'</small></span>'+icon('arrow')+'</button>').join('')+'</section>';
}
function renderCatalog(){const selected=E.PIECES.filter(pieceMatches),el=document.getElementById('piece-list');document.getElementById('piece-count').textContent=selected.length+' af '+E.PIECES.length+' stykker';el.innerHTML=selected.length?selected.map(p=>{const runs=state.learning.practice.filter(x=>x.pieceId===p.id),done=state.completedPieces[p.id];return '<button class="piece-card" data-action="piece" data-id="'+p.id+'"><div class="piece-cover" aria-hidden="true">'+(p.collection==='klassisk'?'♬':p.time==='3/4'?'¾':'♪')+'</div><div class="piece-info"><h3>'+esc(p.title)+'</h3><p>'+esc(p.subtitle)+'</p><div class="piece-meta">Niveau '+p.level+' · '+E.KEY_NAMES[p.tonality||p.key]+' · '+p.measures.length+' takter'+(runs.length?' · Spillet '+runs.length+' gange':done?' · Læst '+done.runs+' gange':'')+'</div></div>'+icon('arrow')+'</button>';}).join(''):'<p class="empty">Ingen stykker passer til filtrene. Vælg Alle eller prøv en kortere søgning.</p>';}
pieces=function(){stopAudio();page='pieces';shell('<section class="hero"><div class="eyebrow">Fra læsning til musik</div><h1>Find noget<br>at spille.</h1><p>Korte stykker, klassiske uddrag og nye udfordringer. Vælg et let, ukendt stykke til nodelæsning eller fordyb dig i et sværere.</p></section><label class="search-label">Find et stykke<input id="piece-search" type="search" placeholder="Titel, komponist eller toneart" value="'+esc(catalogQuery)+'"></label><div class="chips" aria-label="Samling">'+[['all','Alle'],['new','Ikke spillet'],['klassisk','Klassiske'],['original','Originale']].map(([key,label])=>'<button class="chip '+(catalogFilter===key?'active':'')+'" data-action="catalog-filter" data-value="'+key+'">'+label+'</button>').join('')+'</div><div class="row catalog-level"><label>Værk <select id="catalog-work">'+workOptions()+'</select></label><label>Niveau <select id="catalog-level"><option value="0">Alle niveauer</option>'+Array.from({length:E.MAX_LEVEL},(_,i)=>i+1).map(n=>'<option value="'+n+'" '+(catalogLevel===n?'selected':'')+'>'+n+'</option>').join('')+'</select></label><span class="subtle" id="piece-count"></span></div><div id="piece-list"></div>');renderCatalog();};
function sourceMarkup(p){return p.source?'<details class="source-note"><summary>Om noderne</summary><p>'+esc(p.composer||'Nodeværk')+'. '+esc(p.source.adaptation||p.source.title||'')+'</p>'+(p.source.url?'<a href="'+esc(p.source.url)+'" target="_blank" rel="noopener">Se nodekilden</a>':'')+'<p>'+esc(p.source.license||'')+'</p></details>':'';}
showPiece=function(id){stopAudio();pieceId=id;page='piece';const p=E.PIECES.find(p=>p.id===id);if(!p)return pieces();shell('<button class="back-button" data-action="nav" data-page="pieces">'+icon('back')+'Alle stykker</button><section class="piece-detail"><div class="eyebrow">Niveau '+p.level+' · '+E.KEY_NAMES[p.tonality||p.key]+' · '+p.time+'</div><h1>'+esc(p.title)+'</h1><p class="practice-tip">'+esc(p.tip)+'</p></section><div class="piece-actions"><button class="primary" data-action="studio" data-id="'+id+'">Spil efter noder</button><button class="secondary" data-action="start-piece" data-id="'+id+'">Læs tone for tone</button></div><button class="text-button" data-action="studio-listen" data-id="'+id+'">Lyt til stykket</button><div class="score-card"><div class="score-tools"><span class="eyebrow">Hele stykket</span><button class="text-button" data-action="zoom-piece">'+icon('zoom')+'Forstør</button></div><div class="score" id="piece-score"></div></div>'+sourceMarkup(p)+relatedPassagesMarkup(p));Notation.render(document.getElementById('piece-score'),p);window.scrollTo(0,0);};
function studio(id,keep=false){stopAudio();pieceId=id;page='studio';const p=E.PIECES.find(p=>p.id===id);if(!p)return pieces();
 if(!keep||!studioConfig||studioConfig.pieceId!==id)studioConfig={pieceId:id,hand:'both',mode:'read',tempo:p.tempo||Math.min(64,state.settings.tempo||56),start:0,end:Math.min(4,p.measures.length)};
 const cfg=studioConfig;pieceId=id;
 shell('<button class="back-button" data-action="piece" data-id="'+id+'">'+icon('back')+esc(p.title)+'</button><section class="studio-title"><div class="eyebrow">Ved klaveret · '+E.KEY_NAMES[p.tonality||p.key]+' · '+p.time+'</div><h1>'+esc(p.title)+'</h1></section><div class="chips studio-mode">'+[['read','Fra bladet'],['practice','Indstudering']].map(([v,t])=>'<button class="chip '+(cfg.mode===v?'active':'')+'" data-action="studio-mode" data-value="'+v+'">'+t+'</button>').join('')+'</div><p class="practice-tip">'+(cfg.mode==='read'?'Se kort på toneart, starttoner og mønstre. Vælg et roligt tempo, og spil igennem uden at rette undervejs.':'Arbejd med den passage, der driller. Brug én hånd, sænk tempoet, og sæt den tilbage i sammenhæng bagefter.')+'</p><section class="studio-controls"><label>Hænder<select id="studio-hand"><option value="both" '+(cfg.hand==='both'?'selected':'')+'>Begge hænder</option><option value="treble" '+(cfg.hand==='treble'?'selected':'')+'>Højre hånd</option><option value="bass" '+(cfg.hand==='bass'?'selected':'')+'>Venstre hånd</option></select></label><label>Fra takt<select id="studio-from">'+p.measures.map((_,i)=>'<option value="'+i+'" '+(i===cfg.start?'selected':'')+'>'+(i+1)+'</option>').join('')+'</select></label><label>Til takt<select id="studio-to">'+p.measures.map((_,i)=>'<option value="'+(i+1)+'" '+(i+1===cfg.end?'selected':'')+'>'+(i+1)+'</option>').join('')+'</select></label></section><label class="tempo">Tempo<input id="studio-tempo" type="range" min="32" max="120" step="2" value="'+cfg.tempo+'"><span id="studio-tempo-label">'+cfg.tempo+' BPM</span></label><p class="subtle">'+'Afspilning af de valgte takter i syntetisk klaverklang, uden metronom eller optælling.'+'</p><div class="studio-transport"><button class="primary" id="studio-start" data-action="studio-start">'+icon('play')+'Afspil valgte takter</button><button class="secondary" data-action="studio-stop">Stop</button></div><div class="studio-pulse" id="studio-pulse" aria-live="polite">Klar til takt '+(cfg.start+1)+' til '+cfg.end+'</div><div class="score-card studio-score"><div class="score-tools"><span class="eyebrow">Følg begge systemer</span><button class="text-button" data-action="studio-zoom">'+icon('zoom')+'Forstør</button></div><div id="studio-score" class="score"></div></div><section class="card practice-log"><h2>Hvordan gik gennemspilningen?</h2><p class="subtle">Din egen vurdering. Appen lytter ikke til klaveret.</p><div class="rating-buttons"><button class="secondary" data-action="practice-rate" data-value="flow">Holdt pulsen</button><button class="secondary" data-action="practice-rate" data-value="notes">Toner drillede</button><button class="secondary" data-action="practice-rate" data-value="rhythm">Rytmen drillede</button><button class="secondary" data-action="practice-rate" data-value="hands">Hænderne drillede</button></div><p id="practice-saved" class="subtle" aria-live="polite"></p></section>'+sourceMarkup(p));drawStudio();window.scrollTo(0,0);
}
function drawStudio(){const p=E.PIECES.find(p=>p.id===pieceId);Notation.render(document.getElementById('studio-score'),p,{indices:Array.from({length:studioConfig.end-studioConfig.start},(_,i)=>i+studioConfig.start),hand:studioConfig.hand});}
async function runStudio(){
 if(transport)stopAudio();
 const cfg={...studioConfig},p=E.PIECES.find(p=>p.id===cfg.pieceId);
 if(!p)return;
 try{
  const ctx=await ensureAudio();
  if(page!=='studio'||pieceId!==cfg.pieceId)return;
  const plan=L.studioPlaybackPlan(p,cfg.hand,cfg.tempo,cfg.start,cfg.end);
  if(!plan.events.length)throw Error('Der er ingen noder at afspille i det valgte udsnit');
  document.querySelectorAll('[data-action="practice-rate"]').forEach(el=>el.disabled=false);
  document.getElementById('practice-saved').textContent='';
  const lead=.08,begin=ctx.currentTime+lead,perfStart=performance.now()+lead*1000;
  transport={kind:'studio'};
  const startButton=document.getElementById('studio-start');
  startButton.disabled=true;
  for(const event of plan.events)sound(event.midi,begin+event.startSeconds,Math.max(.07,event.durationSeconds*.9),event.clef==='treble'?.12:.09);
  const label=document.getElementById('studio-pulse');
  label.textContent='Afspiller takt '+(cfg.start+1)+' til '+cfg.end;
  let previous=-1;
  transportTimers.push(setInterval(()=>{
   if(page!=='studio'||!transport||transport.kind!=='studio')return;
   const elapsed=Math.max(0,(performance.now()-perfStart)/1000);
   const bar=Math.min(cfg.end-cfg.start-1,Math.floor(elapsed/plan.barSeconds));
   if(bar!==previous){
    previous=bar;
    const measure=cfg.start+bar;
    label.textContent='Afspiller takt '+(measure+1)+' af '+p.measures.length;
    document.querySelectorAll('#studio-score .notation-system').forEach(el=>el.classList.toggle('playing-measure',Number(el.dataset.measure)===measure));
   }
  },75));
  transportTimers.push(setTimeout(()=>{
   stopTransport();
   if(page==='studio'&&document.getElementById('studio-pulse'))label.textContent='Afspilningen er slut. Du kan høre stykket igen eller prøve selv.';
  },(lead+plan.totalSeconds)*1000+150));
 }catch(err){
  console.error('Nodeværk: nodeafspilning',err);
  stopTransport();
  const label=document.getElementById('studio-pulse');
  if(label)label.textContent='Lyden kunne ikke starte: '+(err?.message||'Prøv igen og kontrollér telefonens lydstyrke.');
 }
}
progress=function(){oldProgress();L.migrate(state);
 const main=APP.querySelector('main'),skillCard=main.querySelector('.skill-row')?.closest('section.card');
 if(skillCard){
  skillCard.innerHTML='<h2>Vejen mod næste niveau</h2><p class="subtle">For at stige kræves mindst 9 korrekte af de seneste 10 svar på niveauet og tilstrækkelig læsehastighed. Hvert område har sin egen progression.</p>'+Object.keys(E.SKILLS).map(levelProgressMarkup).join('');
 }
 const coverage=L.keyCoverage(state),missing=coverage.remaining.slice(0,6).map(k=>E.KEY_NAMES[k]||k),sample=coverage.seen.slice(-8).map(k=>E.KEY_NAMES[k]||k);
 const coverageCard=document.createElement('section');coverageCard.className='card key-coverage';
 coverageCard.innerHTML='<div class="eyebrow">Nye tonearter</div><h2>Din bredde vokser</h2><div class="row key-counter"><strong>'+coverage.count+' / '+coverage.total+'</strong><span>tonearter mødt</span></div><div class="bar-track"><div class="bar-fill" style="width:'+Math.round(100*coverage.count/coverage.total)+'%"></div></div>'+
 (sample.length?'<p class="subtle">Senest registreret: '+esc(sample.join(', '))+'.</p>':'<p class="subtle">Oversigten begynder at tælle tonearter fra denne opdatering.</p>')+
 (missing.length?'<p class="subtle">Endnu ikke registreret, blandt andre: '+esc(missing.join(', '))+'.</p>':'<p class="subtle">Du har mødt alle 24 tonearter. Nu handler det om sikker læsning og gentagelse.</p>')+
 '<p class="subtle">At have mødt en toneart betyder, at du har besvaret mindst én opgave i den. Det er ikke det samme som at mestre den. Dine tidligere resultater er bevaret.</p>';
 if(skillCard)skillCard.after(coverageCard);else main.appendChild(coverageCard);
 const trends=L.performanceTrends(state),trendSection=document.createElement('section');
 trendSection.className='card trend-card';
 trendSection.innerHTML='<div class="eyebrow">Sammenlignelige opgaver</div><h2>Din hastighed og sikkerhed</h2>'+
 (trends.length?trends.slice(0,6).map(trendMarkup).join(''):'<p>Efter mindst 16 opgaver af samme type på samme niveau kan appen sammenligne dine otte tidlige og otte seneste svar. Dine nye svar bliver registreret automatisk.</p>')+
 '<p class="subtle">Vi sammenligner kun samme opgavetype på samme niveau. Svartiden normaliseres efter antallet af afkodede enheder. Kun korrekte svar bruges til tidsmedianen, alle otte til præcisionen. Små ændringer kan skyldes tilfældig variation. Bankerytmer og dit fysiske klaverspil indgår ikke i denne tidsmåling.</p>';
 coverageCard.after(trendSection);
 const section=document.createElement('section');section.className='card';const runs=state.learning.practice;section.innerHTML='<h2 style="font-size:19px">Ved klaveret</h2><p class="practice-count">'+runs.length+' gemte gennemspilninger · '+new Set(runs.map(r=>r.pieceId)).size+' forskellige stykker</p>'+runs.slice(-5).reverse().map(r=>{const p=E.PIECES.find(p=>p.id===r.pieceId);return '<div class="review-row"><strong>'+esc(p?.title||r.pieceId)+'</strong><p>Takt '+(r.start+1)+' til '+r.end+' · '+r.tempo+' BPM · '+({flow:'Holdt pulsen',notes:'Toner',rhythm:'Rytme',hands:'Hænder'}[r.rating]||r.rating)+'</p></div>';}).join('')+'<p class="subtle">Egne vurderinger holdes adskilt fra læseopgavernes resultater.</p>';APP.querySelector('main').appendChild(section);
 const due=L.dueReviews(state).length,scheduled=Object.keys(state.learning.reviews).length;const note=document.createElement('p');note.className='storage-note';note.textContent=due+' områder er klar til genbesøg. '+scheduled+' områder følges med gentagelser over flere dage.';section.after(note);
};
help=function(){oldHelp();const body=APP.querySelector('.help-content');const added=document.createElement('section');added.innerHTML='<h2>Nyt i Nodeværk 3</h2><p>Stykkerne kan høres uden metronom og optælling, én hånd ad gangen og i valgte taktudsnit. Fra bladet er til relativt let og ukendt musik. Indstudering er til at isolere og rette svære steder. Dine egne spillevurderinger tælles separat.</p><h2>Hele tonerækker og akkorder</h2><p>Vælg en tone, tilføj den, og fortsæt gennem hele rækken. Akkorder læses nedefra og op. Tryk på en udfyldt plads for at rette derfra. En bindebue mellem ens toner betyder, at tonen holdes uden et nyt anslag.</p><h2>Bank rytmen</h2><p>Læs rytmen, start optællingen, og bank på feltet ved hvert nyt anslag. I 6/8 og 12/8 følger klikket hovedslagene. Efter første forsøg kan du høre rytmen. Bedømmelsen af timing er vejledende på en telefon.</p><h2>Gentagelser over tid</h2><p>Fejl genbesøges i en senere gruppe. Korrekte svar vender tilbage efter cirka 1, 3, 7, 21 og 45 dage, når du bruger appen. Den samme færdighed kan dukke op i en ny variant. Der sendes ingen påmindelser.</p><h2>Bevarede fremskridt</h2><p>Nodeværk 3 bruger samme lager som før. Besvarelser, niveauer, læste stykker og den igangværende gruppe bevares. En lokal kopi fra før opdateringen gemmes, når der er plads.</p>';body.prepend(added);
 body.querySelectorAll('p').forEach(p=>{if(p.textContent.includes('De seks små stykker'))p.textContent='Øvestykkerne kan læses, høres og spilles ved klaveret. Appen optager ikke lyd og vurderer ikke dit fysiske klaverspil automatisk.';if(p.textContent.includes('Version 2.0'))p.textContent='Nodeværk · Version 3.0 · '+E.PIECES.length+' øvestykker';});
};
function studioAction(ev){const b=ev.target.closest('[data-action]');if(!b||b.disabled)return;const a=b.dataset.action;
 if(a==='sequence-add'){if(selectedLetter&&sequence.length<current().expectedTokens.length){sequence.push(selectedLetter+':'+selectedAlter);selectedLetter=null;selectedAlter=0;refreshAnswer();}}
 else if(a==='sequence-undo'){sequence.pop();refreshAnswer();}
 else if(a==='sequence-cut'){sequence=sequence.slice(0,Number(b.dataset.index));refreshAnswer();}
 else if(a==='tap-start')startTap();
 else if(a==='tap-hit'&&ev.detail===0)tapHit();
 else if(a==='tap-listen'){const q=current();listenScore(q.score,'treble',q.tempo).catch(()=>announce('Lyd kunne ikke starte.'));}
 else if(a==='studio')studio(b.dataset.id);
 else if(a==='catalog-filter'){catalogFilter=b.dataset.value;pieces();}
 else if(a==='review-start')start('review');
 else if(a==='guided-next'){
  const session=state.session,entries=session?.kind==='group'?session.results.slice(session.groupStart,session.index):[];
  const guide=L.nextGuidance(state,entries);state.session=null;save();
  if(guide.kind==='studio')studio(guide.pieceId);else start(guide.focus);
 }
 else if(a==='free-group'){state.session=null;save();home();}
 else if(a==='progress-from-summary'){state.session=null;save();progress();}
 else if(a==='studio-mode'){studioConfig.mode=b.dataset.value;studio(pieceId,true);}
 else if(a==='studio-start')runStudio();
 else if(a==='studio-stop'){stopAudio();document.getElementById('studio-start').disabled=false;document.getElementById('studio-pulse').textContent='Stoppet';}
 else if(a==='studio-listen'){if(transport){stopAudio();updateStudioListen();}else{const id=pieceId;listenScore(E.PIECES.find(p=>p.id===id),'both',state.settings.tempo||64).then(updateStudioListen).catch(()=>announce('Lyd kunne ikke starte.'));}}
 else if(a==='studio-listen-part'){const c=studioConfig;listenScore(E.PIECES.find(p=>p.id===pieceId),c.hand,c.tempo,c.start,c.end).catch(()=>announce('Lyd kunne ikke starte.'));}
 else if(a==='studio-zoom'){const c=studioConfig;openZoom(E.PIECES.find(p=>p.id===pieceId),null,Array.from({length:c.end-c.start},(_,i)=>c.start+i));}
 else if(a==='practice-rate'){stopAudio();L.addPractice(state,{...studioConfig,rating:b.dataset.value});L.markRoute(state,'repertoire');save();const text={flow:'Gemt. Prøv et nyt stykke på samme niveau, eller spil et længere udsnit.',notes:'Gemt. Find den første usikre tone, og læs den sammen med tonen før og efter.',rhythm:'Gemt. Bank rytmen først, og prøv derefter et lidt langsommere tempo.',hands:'Gemt. Prøv én hånd ad gangen, og saml derefter to takter.'};document.getElementById('practice-saved').textContent=text[b.dataset.value];document.querySelectorAll('[data-action="practice-rate"]').forEach(el=>el.disabled=true);document.getElementById('studio-start').disabled=false;}
}
document.addEventListener('click',studioAction);
document.addEventListener('pointerdown',ev=>{if(ev.target.closest('[data-action="tap-hit"]')){ev.preventDefault();tapHit();}});
document.addEventListener('input',ev=>{if(ev.target.id==='piece-search'){catalogQuery=ev.target.value;renderCatalog();}if(ev.target.id==='studio-tempo'){stopAudio();studioConfig.tempo=Number(ev.target.value);document.getElementById('studio-tempo-label').textContent=studioConfig.tempo+' BPM';document.getElementById('studio-start').disabled=false;}});
document.addEventListener('change',ev=>{const id=ev.target.id;if(id==='catalog-level'){catalogLevel=Number(ev.target.value);renderCatalog();}if(id==='catalog-work'){catalogWork=ev.target.value;renderCatalog();}if(id.startsWith('studio-')&&studioConfig){stopAudio();if(id==='studio-hand')studioConfig.hand=ev.target.value;if(id==='studio-from'){studioConfig.start=Number(ev.target.value);studioConfig.end=Math.max(studioConfig.end,studioConfig.start+1);}if(id==='studio-to'){studioConfig.end=Number(ev.target.value);studioConfig.start=Math.min(studioConfig.start,studioConfig.end-1);}studio(pieceId,true);}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){stopTransport();if(tapRun){tapRun=null;if(page==='exercise'&&!state.session.results[state.session.index])showQuestion();}}});
window.addEventListener('pagehide',stopTransport);
window.addEventListener('resize',()=>{if(page==='studio')drawStudio();});
home();
