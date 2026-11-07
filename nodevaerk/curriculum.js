/* Nodeværk 2: bar reading, rhythm, two-hand coordination and optional placement. */
(function(root,factory){
  const base=typeof module==='object'&&module.exports?require('./engine.js'):root.NV;
  const coach=factory(base);
  if(typeof module==='object'&&module.exports)module.exports=coach;
  else root.NV.curriculum=coach;
})(typeof globalThis!=='undefined'?globalThis:this,function(E){
'use strict';
const oldQuestion=E.question;
E.SKILLS.passage='Takter og samspil';
const DOMAINS=['treble','bass','accidental','rhythm','interval','passage'];
/* Ordered by circle of fifths; each minor prints its relative major signature. */
const KEY_PAIRS=[
 ['C','Am','C','A'],['G','Em','G','E'],['F','Dm','F','D'],['D','Bm','D','B'],
 ['Bb','Gm','B','G'],['A','F#m','A','F'],['Eb','Cm','E','C'],['E','C#m','E','C'],
 ['Ab','Fm','A','F'],['B','G#m','B','G'],['Db','Bbm','D','B'],['F#','D#m','F','D']
];
const TONALITIES=KEY_PAIRS.flatMap(([major,minor,majorTonic,minorTonic],idx)=>[
 {id:major,key:major,tonic:majorTonic,mode:'major',difficulty:idx},
 {id:minor,key:major,tonic:minorTonic,mode:'minor',difficulty:idx}
]);
const TONALITY_MAP=Object.fromEntries(TONALITIES.map(t=>[t.id,t]));
function tonePool(level){return TONALITIES.filter(t=>level>=3||t.difficulty<=(level===1?2:6));}
function tonalityFor(level,serial){const pool=tonePool(level);return pool[((serial%pool.length)+pool.length)%pool.length];}
function selectTonality(level,r,requested=null){if(!requested)return pick(tonePool(level),r);const t=TONALITY_MAP[typeof requested==='string'?requested:requested.id];if(!t)throw Error('Ukendt toneart: '+requested);return t;}

const METERS=['2/4','3/4','4/4','6/8','12/8'];
const PATTERNS={
 '2/4':[[['q','q']],[['q','8','8'],['8','8','q']],[['8','8','8','8'],['qd','8'],['q','8','8']]],
 '3/4':[[['q','q','q']],[['h','q'],['q','h'],['q','8','8','q']],[['8','8','q','q'],['qd','8','q'],['q','q','q'],['hd']]],
 '4/4':[[['q','q','q','q']],[['h','q','q'],['q','q','h'],['q','8','8','q','q']],[['q','8','8','h'],['h','8','8','q'],['q','q','8','8','q'],['8','8','q','q','q']]],
 '6/8':[[['8','8','8','8','8','8']],[['qd','qd'],['q','8','q','8']],[['8','8','8','qd'],['qd','8','8','8'],['q','8','q','8']]],
 '12/8':[[['qd','qd','qd','qd'],['q','8','q','8','q','8','q','8']],[['qd','qd','qd','qd'],['q','8','qd','q','8','qd'],['qd','q','8','qd','q','8']],[['q','8','q','8','q','8','q','8'],['qd','8','8','8','qd','qd'],['qd','q','8','qd','q','8'],['q','8','qd','8','8','8','qd'],['8','8','8','qd','qd','qd']]]
};
function pick(xs,r){return xs[Math.floor(r()*xs.length)];}
function shuffle(xs,r){const a=xs.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(36);}
function keyed(q){q.id=q.skill+':score:'+hash(JSON.stringify([q.score,q.target,q.prompt]));return q;}
function parseDuration(s){const d=s.replace('d','');return {duration:d,dots:s.endsWith('d')?1:0};}
function beats(pattern){return pattern.reduce((sum,s)=>sum+E.beats(parseDuration(s)),0);}
function meterBeats(meter){const [n,d]=meter.split('/').map(Number);return 4*n/d;}
function meterFor(level,r){return pick(level===1?['3/4','4/4']:level===2?['2/4','3/4','4/4','6/8','12/8']:METERS,r);}
function patternFor(meter,level,r){
 const tier=level<=1?0:level===2?1:2;const pattern=pick(PATTERNS[meter][tier],r).slice();
 if(level>=5){for(let split=0;split<(level>=7?2:1);split++){
   const idx=pattern.flatMap((v,i)=>v==='8'||v==='q'?[i]:[]);
   if(!idx.length)break;const j=pick(idx,r);
   pattern.splice(j,1,...(pattern[j]==='8'?['16','16']:['8','8']));
 }}
 if(Math.abs(beats(pattern)-meterBeats(meter))>1e-9)throw Error('Forkert taktlængde: '+meter+' '+pattern.join(' '));
 return pattern;
}
function noteWalk(clef,count,level,r,tonality=null){
 const ranges=clef==='treble'?[[30,36],[28,38],[27,40],[26,42],[25,43],[24,44],[23,45],[22,45]]:[[19,25],[18,28],[17,30],[16,32],[15,32],[14,33],[13,34],[12,34]];
 const [low,high]=ranges[level-1];let base=low+Math.floor(r()*(high-low+1));
 if(tonality&&r()<.65){const tonic=E.LETTERS.indexOf(tonality.tonic);const options=Array.from({length:high-low+1},(_,j)=>j+low).filter(i=>((i%7)+7)%7===tonic);if(options.length)base=pick(options,r);}
 let step=base;
 return Array.from({length:count},(_,i)=>{if(i){const interval=pick(level===1?[-2,-1,0,1,2]:level<=4?[-3,-2,-1,0,1,2,3]:level<=6?[-5,-4,-3,-2,-1,0,1,2,3,4,5]:[-7,-5,-4,-3,-2,-1,0,1,2,3,4,5,7],r);step=Math.min(high,Math.max(low,step+interval));}return E.fromDiatonic(step);});
}
function makeLine(pattern,clef,level,r,tonality=null){
 const pts=noteWalk(clef,pattern.length,level,r,tonality);
 return pattern.map((d,i)=>{
   const spec=parseDuration(d);let n={...pts[i],...spec};
   if(level>=3&&i>0&&i<pattern.length-1&&r()<(level>=6?.19:.12))return {...E.rest(spec.duration),dots:spec.dots};
   if(level>=5&&i>0&&r()<(level>=7?.2:.11)){n={...n,acc:pick(['n','#','b'],r)};}
   return n;
 });
}
function accompaniment(meter,clef,level,r,tonality=null){
 const pat=meter==='12/8'?['qd','qd','qd','qd']:meter==='6/8'?['qd','qd']:meter==='3/4'?['hd']:meter==='2/4'?['h']:['h','h'];
 const line=makeLine(pat,clef,Math.min(2,level),r,tonality);
 if(level>=6){for(const note of line)if(!note.rest&&r()<.4){
  const i=E.diatonic(note);
  note.chord=[E.fromDiatonic(i+2),E.fromDiatonic(i+4)];
 }}
 return line;
}
function buildScore(level,r,activeClef='treble',count=1,otherHand=true,requestedTonality=null){
 const meter=meterFor(level,r),tonality=selectTonality(level,r,requestedTonality),key=tonality.key;
 const measures=[];
 for(let j=0;j<count;j++){
  const m={treble:[],bass:[]};m[activeClef]=makeLine(patternFor(meter,level,r),activeClef,level,r,tonality);
  if(otherHand)m[activeClef==='treble'?'bass':'treble']=accompaniment(meter,activeClef==='treble'?'bass':'treble',level,r,tonality);
  measures.push(m);
 }
 if(level>=7&&count>1)for(let j=0;j<count-1;j++){
   const prev=measures[j][activeClef],next=measures[j+1][activeClef];
   if(prev.length&&next.length>1&&!prev.at(-1).rest&&!next[0].rest&&r()<.42){
    const last=prev.at(-1);last.tie=true;
    const nextDuration={duration:next[0].duration,dots:next[0].dots};
    next[0]={...E.fromDiatonic(E.diatonic(last)),...nextDuration};
   }
 }
 const score={key,tonality:tonality.id,time:meter,measures};const errors=E.validateScore(score);
 if(errors.length)throw Error('Ugyldigt partitur: '+errors.join('; '));
 return score;
}
function noteNames(score,measure,clef){return E.resolveScore(score)[measure][clef].filter(n=>!n.rest).map(n=>n.name);}
function choices(correct,alternatives,r){const unique=[correct,...new Set(alternatives.filter(s=>s!==correct))].slice(0,4);if(unique.length!==4)throw Error('For få forskellige svar');const randomized=shuffle(unique,r);return {answer:String(randomized.indexOf(correct)),options:randomized.map((label,i)=>({value:String(i),label}))};}
function alternativeNames(score,m,clef,r){
 const notes=score.measures[m][clef].filter(n=>!n.rest);const base=noteNames(score,m,clef);const candidates=[];
 for(let k=0;k<notes.length;k++)for(const delta of [-2,-1,1,2]){
  const ix=score.measures[m][clef].findIndex(n=>n===notes[k]);
  if(ix<0)continue;const changed=E.fromDiatonic(E.diatonic(notes[k])+delta);
  const copy={...score,measures:score.measures.map((v,i)=>i===m?{...v,[clef]:v[clef].map((n,j)=>j===ix?{...changed,duration:n.duration,dots:n.dots}:n)}:v)};
  const str=noteNames(copy,m,clef).join(' · ');
  if(str!==base.join(' · '))candidates.push(str);
 }
 if(notes.length>=2){const swapped=base.slice();[swapped[0],swapped[1]]=[swapped[1],swapped[0]];candidates.push(swapped.join(' · '));}
 return shuffle([...new Set(candidates)],r);
}
function barNotes(level,r,skill='passage',clefOverride=null,tonality=null){
 const clef=clefOverride||pick(['treble','bass'],r),count=level>=7?4:level>=5?3:level>=3?2:1;
 const score=buildScore(level,r,clef,count,true,tonality),targetMeasure=count-1;
 const correct=noteNames(score,targetMeasure,clef).join(' · ');
 const alternatives=alternativeNames(score,targetMeasure,clef,r);
 const c=choices(correct,alternatives,r);
 const q={skill,level,type:'choice',score,target:null,kind:'bar-notes',clef,
  prompt:'Hvilken tonerække står i '+(clef==='treble'?'højre':'venstre')+' hånd i takt '+(targetMeasure+1)+'?',
  detail:'Læs hele takten fra venstre mod højre. Medtag kun toner, der anslås. Læg mærke til tonearten og eventuelle pauser.',
  answer:c.answer,answerLabel:correct,options:c.options,
  explanation:'Takt '+(targetMeasure+1)+' i '+E.KEY_NAMES[score.tonality||score.key]+': '+correct+'. Find først starttonen og følg trin, spring og gentagelser.'};
 return keyed(q);
}
function noteOnsets(notes){let t=0;return notes.map((n,i)=>{const o={index:i,at:t,n};t+=E.beats(n);return o;}).filter(x=>!x.n.rest);}
function momentLabel(at,meter){if(meter==='6/8'||meter==='12/8')return String(Math.round(at*2)+1);const whole=Math.floor(at)+1;return whole+(Math.abs(at%1-.5)<.001?'-og':Math.abs(at%1-.25)<.001?'-e':Math.abs(at%1-.75)<.001?'-a':'');}
function rhythmBar(level,r,tonality=null){
 const score=buildScore(level,r,'treble',level>=7?4:level>=5?3:level>=3?2:1,true,tonality),targetMeasure=score.measures.length-1;
 const hits=noteOnsets(score.measures[targetMeasure].treble);
 const selected=pick(hits.length>1?hits.slice(1):hits,r);const correct=momentLabel(selected.at,score.time);
 const allMoments=Array.from({length:Math.round(meterBeats(score.time)*2)},(_,i)=>i/2);
 const alternatives=shuffle(allMoments.map(v=>momentLabel(v,score.time)).filter(s=>s!==correct),r);
 const c=choices(correct,alternatives,r);
 const q={skill:'rhythm',level,type:'choice',kind:'bar-rhythm',score,target:{measure:targetMeasure,clef:'treble',index:selected.index},
  prompt:score.time==='6/8'||score.time==='12/8'?'På hvilken ottendedel begynder den grønne tone?':'På hvilket slag begynder den grønne tone?',
  detail:score.time==='12/8'?'Læs takten som fire hovedslag med tre ottendedele i hvert: 1-2-3, 4-5-6, 7-8-9, 10-11-12.':score.time==='6/8'?'Læs takten som to hovedslag med tre ottendedele i hvert: 1-2-3, 4-5-6.':'Tæl fra taktstregen. En ottendedel mellem to fjerdedelsslag hedder for eksempel 2-og.',
  answer:c.answer,answerLabel:correct,options:c.options,
  explanation:'Takt '+(targetMeasure+1)+' er i '+score.time+'. Den grønne tone starter på '+correct+(score.time==='12/8'?' (hovedslag '+(Math.floor((Number(correct)-1)/3)+1)+' af fire)':'')+'. Tæl alle tidligere nodeværdier og pauser med.'};
 return keyed(q);
}
function together(level,r,requestedTonality=null){
 const meter=level<=1?'4/4':meterFor(level,r);const tonality=selectTonality(level,r,requestedTonality),key=tonality.key;
 const treblePattern=level>=5?patternFor(meter,level,r):meter==='12/8'?['q','8','q','8','q','8','q','8']:meter==='6/8'?['8','8','8','8','8','8']:meter==='3/4'?['q','q','q']:meter==='2/4'?['8','8','q']:['q','q','q','q'];
 const bassAlternatives=meter==='12/8'?[['qd','qd','qd','qd'],['q','8','qd','qd','qd'],['qd','q','8','qd','qd']]:meter==='6/8'?[['qd','qd'],['q','8','qd'],['qd','q','8']]:meter==='3/4'?[['q','h'],['h','q'],['q','q','q']]:meter==='2/4'?[['q','q'],['h']]:[['h','h'],['q','h','q'],['h','q','q']];
 const count=level>=7?3:level>=5?2:1,measures=[];
 for(let i=0;i<count;i++){
  const top=i===0?treblePattern:level>=5?patternFor(meter,level,r):treblePattern;
  const bottom=i===0?pick(bassAlternatives,r):pick(bassAlternatives,r);
  const treble=makeLine(top,'treble',level,r,tonality),bass=makeLine(bottom,'bass',level,r,tonality);
  if(level>=6)for(const n of bass)if(!n.rest&&r()<.35){const x=E.diatonic(n);n.chord=[E.fromDiatonic(x+2),E.fromDiatonic(x+4)];}
  measures.push({treble,bass});
 }
 const score={key,tonality:tonality.id,time:meter,measures};
 const targetMeasure=count-1;
 if(E.validateScore(score).length)throw Error('Ugyldig samspilstakt');
 const t=noteOnsets(score.measures[targetMeasure].treble).map(x=>x.at),b=noteOnsets(score.measures[targetMeasure].bass).map(x=>x.at);
 const hits=b.filter(x=>t.some(y=>Math.abs(x-y)<.0001));const correct=hits.map(v=>momentLabel(v,meter)).join(' og ');
 const candidates=bassAlternatives.map(p=>{let at=0;return p.map(s=>{const val=at;at+=E.beats(parseDuration(s));return val;}).filter(v=>t.includes(v)).map(v=>momentLabel(v,meter)).join(' og ');}).filter(x=>x!==correct);
 const otherMoments=Array.from({length:Math.round(meterBeats(meter)*2)},(_,i)=>momentLabel(i/2,meter));for(let i=0;i<otherMoments.length;i++)for(let j=i;j<otherMoments.length;j++)candidates.push(otherMoments.slice(i,j+1).join(' og '));
 const c=choices(correct,shuffle([...new Set(candidates)],r),r);
 const q={skill:'passage',level,type:'choice',kind:'two-hands',score,target:null,
  prompt:(meter==='6/8'||meter==='12/8'?'På hvilke ottendedelspladser':'På hvilke slag')+' anslår begge hænder samtidig i takt '+(targetMeasure+1)+'?',
  detail:meter==='12/8'?'Tæl fire hovedslag, hver med tre ottendedele: 1-2-3, 4-5-6, 7-8-9, 10-11-12. Kun nye anslag tæller.':meter==='6/8'?'Tæl ottendedelene 1-2-3, 4-5-6. En tone, som stadig holdes, tæller ikke som et nyt anslag.':'Følg begge systemer fra venstre mod højre. Kun nye anslag tæller, ikke toner der holdes.',
  answer:c.answer,answerLabel:correct,options:c.options,
  explanation:'I takt '+(targetMeasure+1)+' anslår begge hænder en ny tone på '+correct+'. Følg de to stemmer efter slagene, ikke efter nodehovederne alene.'};
 return keyed(q);
}
function rekeyQuestion(q,tonality){
 const t=typeof tonality==='string'?TONALITY_MAP[tonality]:tonality;
 if(!t)return q;
 q.score.key=t.key;q.score.tonality=t.id;
 if(q.type==='pitch'){
  const n=E.targetNote(q);q.answer=n.id;q.answerLabel=n.name;
  q.explanation=(n.clef==='bass'?'F':'G')+'-nøgle: '+n.name+n.octave+'. '+q.detail;
 }
 delete q.id;return keyed(q);
}
function question(skill,level,r,requestedTonality=null){
 if(!DOMAINS.includes(skill)||level<1||level>E.MAX_LEVEL)throw Error('Ukendt færdighed eller niveau');
 const tonality=selectTonality(level,r,requestedTonality);
 if(skill==='passage')return r()<.35?together(level,r,tonality):barNotes(level,r,'passage',null,tonality);
 if(skill==='rhythm')return rhythmBar(level,r,tonality);
 if((skill==='treble'||skill==='bass')&&level>=2&&r()<(level>=5?.7:.48))return barNotes(level,r,skill,skill,tonality);
 return rekeyQuestion(oldQuestion(skill,level,r),tonality);
}
function group(state,focus='mixed',seed=Date.now()){
 const r=E.rng(seed),out=[];
 const due=state.mistakes.filter(x=>x.due<=state.groups&&(focus==='mixed'||x.q.skill===focus));
 if(due.length)out.push({...pick(due,r).q,review:true});
 let skills=focus==='mixed'?['treble','bass','rhythm','passage',state.groups%2===0?'accidental':'interval']:Array(5).fill(focus);
 skills=shuffle(skills,r);
 for(const skill of skills){if(out.length>=5)break;let q;for(let i=0;i<30;i++){q=question(skill,state.skills[skill].level,r,tonalityFor(state.skills[skill].level,state.groups*5+out.length));if(!out.some(x=>x.id===q.id))break;}out.push(q);}
 return out;
}
function assessment(state,seed=Date.now()){
 const r=E.rng(seed),rounds=[2,3,3],items=[];
 for(let round=0;round<3;round++){
  for(const skill of shuffle(DOMAINS,r)){
   const level=rounds[round];let q;
   const t=tonalityFor(level,round*6+items.length);
   if(skill==='passage')q=round===1?together(level,r,t):barNotes(level,r,'passage',null,t);
   else if(skill==='treble'||skill==='bass')q=round===0?rekeyQuestion(oldQuestion(skill,level,r),t):barNotes(level,r,skill,skill,t);
   else if(skill==='rhythm')q=rhythmBar(level,r,t);
   else q=rekeyQuestion(oldQuestion(skill,level,r),t);
   q.diagnostic=true;items.push(q);
  }
 }
 return items;
}
function applyAssessment(state,session,now=Date.now()){
 if(session.kind!=='assessment'||session.index!==session.questions.length)throw Error('Niveautjekket er ikke afsluttet');
 if(session.placed)return state.assessment;
 const results={};
 for(const skill of DOMAINS){
  const attempts=session.results.filter(x=>x.q.skill===skill).map(x=>x.result);
  if(attempts.length!==3)throw Error('Manglende svar i niveautjek: '+skill);
  const hits=attempts.filter(a=>a.correct),fast=E.median(hits.map(a=>Number.isFinite(a.equivalentMs)?a.equivalentMs:a.ms));
  const estimate=hits.length===3&&fast!==null&&fast<=E.LIMITS[skill]*1.8?3:hits.length>=2?2:1;
  const before=state.skills[skill].level;
  state.skills[skill].level=Math.max(before,estimate);state.skills[skill].window=[];
  results[skill]={correct:hits.length,total:3,proposed:estimate,level:state.skills[skill].level};
 }
 state.assessment={at:now,results};session.placed=true;
 return state.assessment;
}
const coach={DOMAINS,METERS,PATTERNS,TONALITIES,tonePool,tonalityFor,selectTonality,rekeyQuestion,patternFor,meterFor,buildScore,barNotes,rhythmBar,together,question,group,assessment,applyAssessment,momentLabel,noteOnsets};
E.question=question;E.group=group;
return coach;
});
