/* Nodeværk 2: bar reading, rhythm, two-hand coordination and optional placement. */
(function(root,factory){
  const base=typeof module==='object'&&module.exports?require('./engine.js'):root.NV;
  const coach=factory(base);
  if(typeof module==='object'&&module.exports)module.exports=coach;
  else root.NV.curriculum=coach;
})(typeof globalThis!=='undefined'?globalThis:this,function(E){
'use strict';
const oldQuestion=E.question;
const DOMAINS=['treble','bass','accidental','rhythm','interval','passage'];
const SIGS={C:'C-dur',G:'G-dur',F:'F-dur',D:'D-dur'};
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
function meterFor(level,r){return pick(level===1?['3/4','4/4']:level===2?['2/4','3/4','4/4']:METERS,r);}
function patternFor(meter,level,r){const tier=level<=1?0:level===2?1:2;const pattern=pick(PATTERNS[meter][tier],r);if(Math.abs(beats(pattern)-meterBeats(meter))>1e-9)throw Error('Forkert taktlængde: '+meter+' '+pattern.join(' '));return pattern;}
function noteWalk(clef,count,level,r){
 const ranges=clef==='treble'?[[30,36],[28,38],[27,40],[26,42]]:[[19,25],[18,28],[17,30],[16,32]];
 const [low,high]=ranges[level-1],base=low+Math.floor(r()*(high-low+1));let step=base;
 return Array.from({length:count},(_,i)=>{if(i){const interval=pick(level===1?[-2,-1,0,1,2]:[-3,-2,-1,0,1,2,3],r);step=Math.min(high,Math.max(low,step+interval));}return E.fromDiatonic(step);});
}
function makeLine(pattern,clef,level,r){const pts=noteWalk(clef,pattern.length,level,r);return pattern.map((d,i)=>{const spec=parseDuration(d);const n={...pts[i],...spec};if(level>=3&&i>0&&i<pattern.length-1&&r()<.12)return {...E.rest(spec.duration),dots:spec.dots};return n;});}
function accompaniment(meter,clef,level,r){
 const pat=meter==='12/8'?['qd','qd','qd','qd']:meter==='6/8'?['qd','qd']:meter==='3/4'?['hd']:meter==='2/4'?['h']:['h','h'];
 return makeLine(pat,clef,Math.min(2,level),r);
}
function buildScore(level,r,activeClef='treble',count=1,otherHand=true){
 const meter=meterFor(level,r),key=pick(level===1?['C']:level===2?['C','G','F']:['C','G','F','D'],r);
 const measures=[];
 for(let j=0;j<count;j++){
  const m={treble:[],bass:[]};m[activeClef]=makeLine(patternFor(meter,level,r),activeClef,level,r);
  if(otherHand)m[activeClef==='treble'?'bass':'treble']=accompaniment(meter,activeClef==='treble'?'bass':'treble',level,r);
  measures.push(m);
 }
 const score={key,time:meter,measures};const errors=E.validateScore(score);
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
function barNotes(level,r,skill='passage',clefOverride=null){
 const clef=clefOverride||pick(['treble','bass'],r),count=level>=3?2:1;
 const score=buildScore(level,r,clef,count,true),targetMeasure=count-1;
 const correct=noteNames(score,targetMeasure,clef).join(' · ');
 const alternatives=alternativeNames(score,targetMeasure,clef,r);
 const c=choices(correct,alternatives,r);
 const q={skill,level,type:'choice',score,target:null,kind:'bar-notes',
  prompt:'Hvilken tonerække står i '+(clef==='treble'?'højre':'venstre')+' hånd i takt '+(targetMeasure+1)+'?',
  detail:'Læs hele takten fra venstre mod højre. Medtag kun toner, der anslås. Læg mærke til tonearten og eventuelle pauser.',
  answer:c.answer,answerLabel:correct,options:c.options,
  explanation:'Takt '+(targetMeasure+1)+' i '+SIGS[score.key]+': '+correct+'. Find først starttonen og følg trin, spring og gentagelser.'};
 return keyed(q);
}
function noteOnsets(notes){let t=0;return notes.map((n,i)=>{const o={index:i,at:t,n};t+=E.beats(n);return o;}).filter(x=>!x.n.rest);}
function momentLabel(at,meter){if(meter==='6/8'||meter==='12/8')return String(Math.round(at*2)+1);const whole=Math.floor(at)+1;return whole+(Math.abs(at%1-.5)<.001?'-og':Math.abs(at%1-.25)<.001?'-e':Math.abs(at%1-.75)<.001?'-a':'');}
function rhythmBar(level,r){
 const score=buildScore(level,r,'treble',level>=3?2:1,true),targetMeasure=score.measures.length-1;
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
function together(level,r){
 const meter=level<=1?'4/4':meterFor(level,r);const key=level>=3?pick(['C','G','F','D'],r):'C';
 const treblePattern=meter==='12/8'?['q','8','q','8','q','8','q','8']:meter==='6/8'?['8','8','8','8','8','8']:meter==='3/4'?['q','q','q']:meter==='2/4'?['8','8','q']:['q','q','q','q'];
 const bassAlternatives=meter==='12/8'?[['qd','qd','qd','qd'],['q','8','qd','qd','qd'],['qd','q','8','qd','qd']]:meter==='6/8'?[['qd','qd'],['q','8','qd'],['qd','q','8']]:meter==='3/4'?[['q','h'],['h','q'],['q','q','q']]:meter==='2/4'?[['q','q'],['h']]:[['h','h'],['q','h','q'],['h','q','q']];
 const bassPattern=pick(bassAlternatives,r);const score={key,time:meter,measures:[{treble:makeLine(treblePattern,'treble',level,r),bass:makeLine(bassPattern,'bass',level,r)}]};
 if(E.validateScore(score).length)throw Error('Ugyldig samspilstakt');
 const t=noteOnsets(score.measures[0].treble).map(x=>x.at),b=noteOnsets(score.measures[0].bass).map(x=>x.at);
 const hits=b.filter(x=>t.some(y=>Math.abs(x-y)<.0001));const correct=hits.map(v=>momentLabel(v,meter)).join(' og ');
 const candidates=bassAlternatives.map(p=>{let at=0;return p.map(s=>{const val=at;at+=E.beats(parseDuration(s));return val;}).filter(v=>t.includes(v)).map(v=>momentLabel(v,meter)).join(' og ');}).filter(x=>x!==correct);
 const otherMoments=Array.from({length:Math.round(meterBeats(meter)*2)},(_,i)=>momentLabel(i/2,meter));for(let i=0;i<otherMoments.length;i++)for(let j=i;j<otherMoments.length;j++)candidates.push(otherMoments.slice(i,j+1).join(' og '));
 const c=choices(correct,shuffle([...new Set(candidates)],r),r);
 const q={skill:'passage',level,type:'choice',kind:'two-hands',score,target:null,
  prompt:meter==='6/8'||meter==='12/8'?'På hvilke ottendedelspladser anslår begge hænder en tone samtidig?':'På hvilke slag begynder begge hænder en tone samtidig?',
  detail:meter==='12/8'?'Tæl fire hovedslag, hver med tre ottendedele: 1-2-3, 4-5-6, 7-8-9, 10-11-12. Kun nye anslag tæller.':meter==='6/8'?'Tæl ottendedelene 1-2-3, 4-5-6. En tone, som stadig holdes, tæller ikke som et nyt anslag.':'Følg begge systemer fra venstre mod højre. Kun nye anslag tæller, ikke toner der holdes.',
  answer:c.answer,answerLabel:correct,options:c.options,
  explanation:'Begge hænder anslår en ny tone på '+correct+'. Følg de to stemmer efter slagene, ikke efter nodehovederne alene.'};
 return keyed(q);
}
function question(skill,level,r){
 if(!DOMAINS.includes(skill)||level<1||level>4)throw Error('Ukendt færdighed eller niveau');
 if(skill==='passage')return r()<.35?together(level,r):barNotes(level,r);
 if(skill==='rhythm')return rhythmBar(level,r);
 if((skill==='treble'||skill==='bass')&&level>=2&&r()<.48)return barNotes(level,r,skill,skill);
 return oldQuestion(skill,level,r);
}
function group(state,focus='mixed',seed=Date.now()){
 const r=E.rng(seed),out=[];
 const due=state.mistakes.filter(x=>x.due<=state.groups&&(focus==='mixed'||x.q.skill===focus));
 if(due.length)out.push({...pick(due,r).q,review:true});
 let skills=focus==='mixed'?['treble','bass','rhythm','passage',state.groups%2===0?'accidental':'interval']:Array(5).fill(focus);
 skills=shuffle(skills,r);
 for(const skill of skills){if(out.length>=5)break;let q;for(let i=0;i<30;i++){q=question(skill,state.skills[skill].level,r);if(!out.some(x=>x.id===q.id))break;}out.push(q);}
 return out;
}
function assessment(state,seed=Date.now()){
 const r=E.rng(seed),rounds=[2,3,3],items=[];
 for(let round=0;round<3;round++){
  for(const skill of shuffle(DOMAINS,r)){
   const level=rounds[round];let q;
   if(skill==='passage')q=round===1?together(level,r):barNotes(level,r);
   else if(skill==='treble'||skill==='bass')q=round===0?oldQuestion(skill,level,r):barNotes(level,r,skill,skill);
   else if(skill==='rhythm')q=rhythmBar(level,r);
   else q=oldQuestion(skill,level,r);
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
  const hits=attempts.filter(a=>a.correct),fast=E.median(hits.map(a=>a.ms));
  const estimate=hits.length===3&&fast!==null&&fast<=E.LIMITS[skill]*1.8?3:hits.length>=2?2:1;
  const before=state.skills[skill].level;
  state.skills[skill].level=Math.max(before,estimate);state.skills[skill].window=[];
  results[skill]={correct:hits.length,total:3,proposed:estimate,level:state.skills[skill].level};
 }
 state.assessment={at:now,results};session.placed=true;
 return state.assessment;
}
const coach={DOMAINS,METERS,PATTERNS,patternFor,meterFor,buildScore,barNotes,rhythmBar,together,question,group,assessment,applyAssessment,momentLabel,noteOnsets};
E.question=question;E.group=group;
return coach;
});
