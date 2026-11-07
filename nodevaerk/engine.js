/* Nodeværk 1.0. Music model and learning logic, independent of the renderer. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.NV=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const LETTERS=['C','D','E','F','G','A','B'];
const NATURAL={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
const KEYS={C:{},G:{F:1},D:{F:1,C:1},F:{B:-1},Bb:{B:-1,E:-1},Eb:{B:-1,E:-1,A:-1}};
Object.assign(KEYS,{A:{F:1,C:1,G:1},E:{F:1,C:1,G:1,D:1},Ab:{B:-1,E:-1,A:-1,D:-1},Db:{B:-1,E:-1,A:-1,D:-1,G:-1},Am:{},Dm:{B:-1},Em:{F:1},Gm:{B:-1,E:-1}});
const KEY_NAMES={C:'C-dur',G:'G-dur',D:'D-dur',F:'F-dur',Bb:'B-dur',Eb:'Es-dur'};
Object.assign(KEY_NAMES,{A:'A-dur',E:'E-dur',Ab:'As-dur',Db:'Des-dur',Am:'A-mol',Dm:'D-mol',Em:'E-mol',Gm:'G-mol'});
/* Twelve distinct major signatures and their relative natural minors.
 * Keys retain the original names and semantics for saved v1-v3 sessions.
 * For newly generated minor examples the renderer receives the equivalent
 * major signature, while score.tonality carries the minor centre. */
const SIGNATURE_COUNTS={
 C:0,G:1,D:2,A:3,E:4,B:5,'F#':6,Db:-5,Ab:-4,Eb:-3,Bb:-2,F:-1,
 Am:0,Em:1,Bm:2,'F#m':3,'C#m':4,'G#m':5,'D#m':6,Bbm:-5,Fm:-4,Cm:-3,Gm:-2,Dm:-1
};
const SHARP_ORDER=['F','C','G','D','A','E','B'];
const FLAT_ORDER=['B','E','A','D','G','C','F'];
for(const [name,count] of Object.entries(SIGNATURE_COUNTS)){
 const order=count>=0?SHARP_ORDER:FLAT_ORDER;
 KEYS[name]=Object.fromEntries(order.slice(0,Math.abs(count)).map(letter=>[letter,count>=0?1:-1]));
}
Object.assign(KEY_NAMES,{
 B:'H-dur','F#':'Fis-dur',Bm:'H-mol','F#m':'Fis-mol','C#m':'Cis-mol',
 'G#m':'Gis-mol','D#m':'Dis-mol',Bbm:'Bes-mol',Fm:'F-mol',Cm:'C-mol'
});
const SKILLS={treble:'G-nøgle',bass:'F-nøgle',accidental:'Fortegn',rhythm:'Rytme',interval:'Intervaller',passage:'Samlet læsning'};
const DUR={w:4,h:2,q:1,'8':.5,'16':.25};
const DURATION_NAMES={w:'Helnode',h:'Halvnode',q:'Fjerdedel','8':'Ottendedel','16':'Sekstendedel'};
const LIMITS={treble:6500,bass:6500,accidental:10000,rhythm:10000,interval:12000,passage:12000};
function parse(s,d='q',extra={}){const m=/^([A-G])([#bn]?)([1-6])$/.exec(s);if(!m)throw Error('Ugyldig tone: '+s);return {letter:m[1],octave:+m[3],acc:m[2]||null,duration:d,dots:0,...extra};}
function rest(d='q'){return {rest:true,duration:d,dots:0};}
function diatonic(n){return n.octave*7+LETTERS.indexOf(n.letter);}
function fromDiatonic(i){const octave=Math.floor(i/7);return parse(LETTERS[((i%7)+7)%7]+octave);}
function staffStep(n,clef){return diatonic(n)-(clef==='bass'?18:30);}// bottom line: G2 = 18, E4 = 30
function beats(n){if(!DUR[n.duration])throw Error('Ugyldig varighed');return DUR[n.duration]*(2-Math.pow(.5,n.dots||0));}
function spelling(n,alter=0){const normal={C:'C',D:'D',E:'E',F:'F',G:'G',A:'A',B:'H'};const sharp={C:'Cis',D:'Dis',E:'Eis',F:'Fis',G:'Gis',A:'Ais',B:'His'};const flat={C:'Ces',D:'Des',E:'Es',F:'Fes',G:'Ges',A:'As',B:'B'};return (alter===1?sharp:alter===-1?flat:normal)[n.letter];}
function pitchId(n,alter){return n.letter+':'+alter;}
function midi(n,alter=0){return 12*(n.octave+1)+NATURAL[n.letter]+alter;}
function pitches(n){return n.rest?[]:[n,...(n.chord||[])];}
function resolveMeasure(notes,key='C'){
 if(!KEYS[key])throw Error('Ukendt toneart');const memory={};
 return notes.map(n=>{if(n.rest)return {...n,beats:beats(n)};
  const tones=pitches(n).map(p=>{const id=p.letter+p.octave;let alter;
   if(p.acc!==null&&p.acc!==undefined){alter={n:0,'#':1,b:-1}[p.acc];if(alter===undefined)throw Error('Ugyldigt fortegn');memory[id]=alter;}
   else alter=Object.prototype.hasOwnProperty.call(memory,id)?memory[id]:(KEYS[key][p.letter]||0);
   return {...p,alter,midi:midi(p,alter),name:spelling(p,alter),id:pitchId(p,alter)};
  });return {...n,...tones[0],tones,beats:beats(n)};
 });
}
function resolveScore(score){
 const previous={treble:null,bass:null};
 return score.measures.map((m,mi)=>Object.fromEntries(['treble','bass'].map(clef=>[clef,resolveMeasure(m[clef]||[],score.key).map((n,ni)=>{
  const prev=previous[clef];const tied=!!(prev?.tie&&!n.rest&&prev.tones?.length===n.tones?.length&&prev.tones.every((p,i)=>p.letter===n.tones[i].letter&&p.octave===n.tones[i].octave));
  if(tied){n.tones=n.tones.map((p,i)=>p.acc===null||p.acc===undefined?{...p,alter:prev.tones[i].alter,midi:prev.tones[i].midi,name:prev.tones[i].name,id:prev.tones[i].id}:p);Object.assign(n,{midi:n.tones[0].midi,alter:n.tones[0].alter,name:n.tones[0].name,id:n.tones[0].id});}
  previous[clef]=n;return {...n,tied,measure:mi,clef,index:ni};
 })])));
}
function targetNote(q){const n=resolveScore(q.score)[q.target.measure][q.target.clef][q.target.index];return q.target.pitchIndex===undefined?n:n.tones[q.target.pitchIndex];}
function intervalNumber(a,b){return Math.abs(diatonic(a)-diatonic(b))+1;}
function durationLabel(n){return (n.dots?'Punkteret ':'')+(n.rest?({w:'helpause',h:'halvpause',q:'fjerdedelspause','8':'ottendedelspause','16':'sekstendedelspause'}[n.duration]):DURATION_NAMES[n.duration].toLowerCase());}
function beatLabel(n){return String(n).replace('.25','¼').replace('.5','½').replace('.75','¾').replace(/^0/,'');}
function median(xs){if(!xs.length)return null;const s=xs.slice().sort((a,b)=>a-b),i=Math.floor(s.length/2);return s.length%2?s[i]:(s[i-1]+s[i])/2;}
function newState(){return {version:1,attempts:[],totals:{answered:0,correct:0},skills:Object.fromEntries(Object.keys(SKILLS).map(k=>[k,{level:1,window:[],changes:[]}])) ,mistakes:[],groups:0,completedPieces:{},settings:{focus:'mixed',tempo:64},session:null};}
function validState(s){return !!(s&&s.version===1&&Array.isArray(s.attempts)&&s.skills&&Object.keys(SKILLS).every(k=>s.skills[k]&&Number.isInteger(s.skills[k].level)&&s.skills[k].level>=1&&s.skills[k].level<=4&&Array.isArray(s.skills[k].window))&&Array.isArray(s.mistakes)&&s.totals&&Number.isFinite(s.totals.answered)&&Number.isFinite(s.totals.correct)&&Number.isFinite(s.groups)&&s.completedPieces&&s.settings);}
function record(state,q,answer,ms,now=Date.now()){
 const correct=String(answer)===String(q.answer);const n=q.type==='pitch'?targetNote(q):null;
 const units=q.units|| (q.kind==='bar-notes'?Math.max(1,((q.score.measures[q.score.measures.length-1]||{})[q.prompt.includes('højre')?'treble':'bass']||[]).filter(n=>!n.rest).length):q.kind==='bar-rhythm'?Math.max(1,(q.target?.index||0)+1):q.kind==='two-hands'?4:1);
 const attempt={skill:q.skill,level:q.level,correct,ms:Math.max(0,Math.min(ms,180000)),at:now,id:q.id,note:n?n.clef+':'+n.letter+n.octave+':'+n.alter:null,answer:String(answer),expected:String(q.answer),key:q.score?.key||null,tonality:q.score?.tonality||null,meter:q.score?.time||null};
 attempt.equivalentMs=attempt.ms/units;
 state.attempts.push(attempt);
 state.totals.answered++;if(correct)state.totals.correct++;
 const sk=state.skills[q.skill];sk.window.push(attempt);if(sk.window.length>24)sk.window.shift();
 const recent=sk.window.filter(a=>a.level===sk.level).slice(-10);let change=0;
 if(recent.length===10){const hits=recent.filter(a=>a.correct),speed=median(hits.map(a=>Number.isFinite(a.equivalentMs)?a.equivalentMs:a.ms));if(hits.length>=9&&speed<=LIMITS[q.skill]&&sk.level<4)change=1;else if(hits.length<=5&&sk.level>1)change=-1;}
 if(change){sk.level+=change;sk.changes.push({level:sk.level,at:now});sk.window=[];}
 state.mistakes=state.mistakes.filter(x=>x.q.id!==q.id);
 if(!correct)state.mistakes.push({q:JSON.parse(JSON.stringify(q)),due:state.groups+1});
 if(state.mistakes.length>60)state.mistakes.shift();return {...attempt,change};
}
function rng(seed){let s=seed>>>0;return ()=>{s+=0x6D2B79F5;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};}
function pick(xs,r){return xs[Math.floor(r()*xs.length)];}
function shuffle(xs,r){const a=xs.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function scoreFor(notes,clef='treble',key='C'){return {key,time:null,measures:[{treble:clef==='treble'?notes:[],bass:clef==='bass'?notes:[]}]};}
function makePitch(skill,level,r){
 const clef=skill==='bass'?'bass':skill==='treble'?'treble':pick(['treble','bass'],r);
 const ranges={treble:[[30,35],[28,39],[26,42],[25,43]],bass:[[21,25],[18,28],[16,30],[15,31]]};
 const [lo,hi]=ranges[clef][level-1];let n=fromDiatonic(lo+Math.floor(r()*(hi-lo+1)));let score=scoreFor([n],clef),target={measure:0,clef,index:0},detail='Læs tonehovedets placering. Du skal kun svare med tonenavnet.';
 if(skill==='accidental'){
  if(level===1){n.acc=pick(['#','b'],r);detail='Læs både tonehovedet og fortegnet lige foran det.';}
  if(level===2){score.key=pick(['G','F'],r);n=parse(score.key==='G'?'F4':'B3');if(clef==='bass')n.octave=3;if(r()<.55)n.acc='n';score.measures[0][clef]=[n];detail='Se på de faste fortegn ved nøglen. Et opløsningstegn ophæver dem for tonen.';}
  if(level>=3){
   const key=level===4?pick(['G','D','F','Bb','Eb'],r):'C';score.key=key;
   const letters=level===4?Object.keys(KEYS[key]):LETTERS; n=parse(pick(letters,r)+(clef==='bass'?3:4));n.acc=level===4?'n':pick(['#','b'],r);
   const mode=level===3?'carry':pick(['carry','bar','octave','staff'],r);
   const again={...n,acc:null};const filler=fromDiatonic(diatonic(n)+2);
   if(mode==='bar'){score.time='4/4';score.measures=[{treble:[],bass:[],[clef]:[{...n,duration:'w'}]},{treble:[],bass:[],[clef]:[{...again,duration:'w'}]}];target.measure=1;target.index=0;detail='Du er i en ny takt. Det løse fortegn fra den forrige takt gælder ikke længere.';}
   else if(mode==='staff'){const other=clef==='treble'?'bass':'treble';n=parse('Bn3');score=scoreFor([n],clef,'Bb');score.measures[0][other]=[parse('B3')];target={measure:0,clef:other,index:0};detail='Et løst fortegn gælder kun i sit eget nodesystem. De faste fortegn gælder i begge.';}
   else{if(mode==='octave')again.octave+=(clef==='treble'?1:-1);score.measures[0][clef]=[n,filler,again];target.index=2;detail=mode==='octave'?'Et løst fortegn gælder kun den pågældende oktav. Her står tonen i en anden oktav.':'Et løst fortegn gælder samme tone i samme oktav resten af takten.';}
  }
 }
 const q={skill,level,type:'pitch',score,target,prompt:'Hvilken tone er det?',detail};const resolved=targetNote(q);q.answer=resolved.id;q.answerLabel=resolved.name;q.explanation=`${resolved.clef==='bass'?'F':'G'}-nøgle: ${resolved.name}${resolved.octave}. ${detail}`;return q;
}
function makeRhythm(level,r){
 let d=pick(level===1?['q','h','w','8']:level===2?['q','h','8']:['q','h','8','16'],r);let n=parse('G4',d,{dots:level>1&&d!=='16'&&r()<.55?1:0});if(level>=2&&r()<.25)n={...rest(d),dots:n.dots};
 const q={skill:'rhythm',level,type:level===1?'choice':'beats',score:scoreFor([n]),target:{measure:0,clef:'treble',index:0},prompt:level===1?'Hvilken nodeværdi ser du?':'Hvor mange slag varer den?',detail:'Vi tæller med fjerdedelen som ét slag.'};
 if(level===1){q.answer=d;q.answerLabel=DURATION_NAMES[d];q.options=['w','h','q','8'].map(x=>({value:x,label:DURATION_NAMES[x]}));}
 else{q.answer=String(beats(n));q.answerLabel=beatLabel(beats(n))+' slag';q.options=[.25,.5,.75,1,1.5,2,3,4].map(x=>({value:String(x),label:beatLabel(x)+' slag'}));}
 q.explanation=`${durationLabel(n).replace(/^./,s=>s.toUpperCase())}: ${beatLabel(beats(n))} ${beats(n)===1?'slag':'slag'}.${n.dots?' Punktet lægger halvdelen af den oprindelige varighed til.':''}${n.rest?' En pause har varighed ligesom en node, men du spiller ikke.':''}`;return q;
}
const INTERVALS=['','Prim','Sekund','Terts','Kvart','Kvint','Sekst','Septim','Oktav'];
function makeInterval(level,r){const clef=pick(['treble','bass'],r);const start=(clef==='bass'?20:30)+Math.floor(r()*4);const size=pick(level===1?[2,3]:level===2?[2,3,4,5]:[1,2,3,4,5,6,7,8],r);const direction=level>=3&&r()<.5?-1:1;const a=fromDiatonic(start),b=fromDiatonic(start+(size-1)*direction);const q={skill:'interval',level,type:'choice',score:scoreFor([a,b],clef),target:null,prompt:'Hvilket interval er det?',detail:'Tæl stamtonerne fra den første til den sidste, begge med. Vi spørger kun om størrelsen.',answer:String(size),answerLabel:INTERVALS[size],options:(level===1?[2,3,4,5]:level===2?[2,3,4,5]:[1,2,3,4,5,6,7,8]).map(x=>({value:String(x),label:INTERVALS[x]}))};q.explanation=`Fra ${spelling(a)} til ${spelling(b)} er der ${size} ${size===1?'stamtone':'stamtoner'}, når begge ender tælles med: ${INTERVALS[size].toLowerCase()}.`;return q;}
function notes(xs){return xs.map(x=>{const [p,d='q']=x.split(':');let dots=0;const duration=d.replace(/d/g,()=>{dots++;return '';});return p==='r'?{...rest(duration),dots}:parse(p,duration,{dots});});}
function measure(t,b){return {treble:notes(t.split(' ')),bass:notes(b.split(' '))};}
const PIECES=[
{id:'morgentrin',title:'Morgentrin',subtitle:'To hænder, rolige fjerdedele',level:1,key:'C',time:'4/4',tip:'Find midter-C. Læs højre og venstre hånd på samme slag, før du går videre.',measures:[measure('C4 D4 E4 G4','C3:h G3:h'),measure('F4 E4 D4 C4','F3:h C3:h')]},
{id:'vals',title:'En lille vals',subtitle:'Tre slag i hver takt',level:1,key:'C',time:'3/4',tip:'Tæl 1, 2, 3. Venstre hånd holder sin tone hele takten.',measures:[measure('E4 G4 C5','C3:hd'),measure('D5 C5 G4','G2:hd'),measure('A4 G4 F4','F3:hd'),measure('E4 D4 C4','C3:hd')]},
{id:'samtale',title:'En samtale',subtitle:'Læs over pauserne',level:2,key:'C',time:'4/4',tip:'En pause er også musik. Følg pulsen, mens den anden hånd spiller.',measures:[measure('E4 G4 r:h','r:h C3 D3'),measure('F4 A4 r:h','r:h F3 E3'),measure('G4:h E4:h','C3 G2 C3:h'),measure('D4:h C4:h','G2:h C3:h')]},
{id:'paa-vej',title:'På vej',subtitle:'Et fast kryds i G-dur',level:2,key:'G',time:'4/4',tip:'F er hævet i begge systemer. Find krydset ved hver nøgle, før du begynder.',measures:[measure('G4 A4 B4 D5','G2:h D3:h'),measure('C5 B4 A4 F4','C3:h D3:h'),measure('G4 B4 A4 F4','G2:h D3:h'),measure('G4:w','G2:w')]},
{id:'boelger',title:'Bløde bølger',subtitle:'B i F-dur og små spring',level:3,key:'F',time:'4/4',tip:'I dansk notation hedder H med b for B. Her gælder det faste b i alle oktaver.',measures:[measure('A4 G4 F4 E4','F3:h C3:h'),measure('F4 A4 B4 C5','B2:h C3:h'),measure('D5 C5 B4 G4','G2:h C3:h'),measure('A4:h F4:h','F3:w')]},
{id:'drejning',title:'En lille drejning',subtitle:'Ottendedele og opløsningstegn',level:4,key:'D',time:'4/4',tip:'F og C er hævet. I tredje takt ophæves F, indtil næste takt begynder.',measures:[measure('D4:8 E4:8 F4:8 G4:8 A4:h','D3:h A2:h'),measure('B4:8 A4:8 G4:8 F4:8 E4:h','G2:h A2:h'),measure('Fn4:8 E4:8 F4:8 G4:8 A4:h','D3:w'),measure('F4:h D4:h','D3:w')]}
];
function pieceTargets(p){const resolved=resolveScore(p),out=[];resolved.forEach((m,mi)=>{const events=[];for(const clef of ['treble','bass']){let at=0;m[clef].forEach((n,i)=>{if(!n.rest&&!n.tied)events.push({measure:mi,clef,index:i,onset:at,n});at+=n.beats;});}events.sort((a,b)=>a.onset-b.onset||(a.clef==='treble'?-1:1));out.push(...events);});return out;}
function passageQuestions(p){return pieceTargets(p).map((t,i)=>({id:'piece:'+p.id+':'+i,skill:'passage',level:p.level,type:'pitch',score:p,target:{measure:t.measure,clef:t.clef,index:t.index},prompt:`${t.clef==='treble'?'Højre':'Venstre'} hånd · takt ${t.measure+1}`,detail:`Slag ${beatLabel(t.onset+1)}. Læs den grønne tone.`,answer:t.n.id,answerLabel:t.n.name,explanation:`${t.clef==='treble'?'Højre':'Venstre'} hånd: ${t.n.name}${t.n.octave}. ${KEY_NAMES[p.key]}.${t.n.acc==='n'?' Opløsningstegnet ophæver det faste fortegn.':''}`,pieceId:p.id}));}
function question(skill,level,r){let q;if(skill==='rhythm')q=makeRhythm(level,r);else if(skill==='interval')q=makeInterval(level,r);else if(skill==='passage'){const p=pick(PIECES.filter(p=>p.level<=level),r);q=pick(passageQuestions(p),r);}else q=makePitch(skill,level,r);if(!q.id){const text=JSON.stringify([q.score,q.target,q.type]);let hash=2166136261;for(let i=0;i<text.length;i++){hash^=text.charCodeAt(i);hash=Math.imul(hash,16777619);}q.id=skill+':'+(hash>>>0).toString(36);}return q;}
function group(state,focus='mixed',seed=Date.now()){
 const r=rng(seed),qs=[];const due=state.mistakes.filter(x=>x.due<=state.groups&&(focus==='mixed'||x.q.skill===focus));if(due.length)qs.push({...pick(due,r).q,review:true});
 let skills=focus==='mixed'?shuffle(['treble','bass','accidental','rhythm','interval'],r):Array(5).fill(focus);
 if(focus==='mixed'&&state.groups>=3&&state.skills.treble.level>=2&&state.skills.bass.level>=2)skills[4]='passage';
 for(const s of skills){if(qs.length===5)break;let q;for(let i=0;i<20;i++){q=question(s,state.skills[s].level,r);if(!qs.some(x=>x.id===q.id))break;}qs.push(q);}return qs;
}
function validateScore(s){const errors=[];if(!KEYS[s.key])errors.push('Ukendt toneart');const expected=s.time?+s.time.split('/')[0]*4/(+s.time.split('/')[1]):null;s.measures.forEach((m,mi)=>{for(const clef of ['treble','bass']){const ns=m[clef]||[];if(expected&&ns.length&&Math.abs(ns.reduce((x,n)=>x+beats(n),0)-expected)>.0001)errors.push(`Takt ${mi+1}, ${clef}: forkert taktlængde`);ns.forEach(n=>{if(!n.rest&&(!LETTERS.includes(n.letter)||!Number.isInteger(n.octave)))errors.push('Ugyldig tone');});}});return errors;}
return {pitches,LETTERS,NATURAL,KEYS,KEY_NAMES,SKILLS,DUR,LIMITS,PIECES,parse,rest,diatonic,fromDiatonic,staffStep,beats,spelling,pitchId,midi,resolveMeasure,resolveScore,targetNote,intervalNumber,durationLabel,beatLabel,median,newState,validState,record,rng,question,group,passageQuestions,pieceTargets,validateScore};
});

