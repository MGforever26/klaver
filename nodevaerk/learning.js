/* Nodeværk 3: reading, retention and playing. Existing v1 data remains readable. */
(function(root,factory){const E=typeof module==='object'&&module.exports?require('./engine.js'):root.NV;const C=typeof module==='object'&&module.exports?require('./curriculum.js'):E.curriculum;const api=factory(E,C);if(typeof module==='object'&&module.exports)module.exports=api;else E.learning=api;})(typeof globalThis!=='undefined'?globalThis:this,function(E,C){
'use strict';
const previousQuestion=E.question,previousRecord=E.record,previousPassages=E.passageQuestions,previousValidate=E.validateScore;
const DAY=86400000,INTERVAL_DAYS=[1,3,7,21,45];
const pick=(xs,r)=>xs[Math.floor(r()*xs.length)];
const shuffle=(xs,r)=>{const a=xs.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
function hash(x){let h=2166136261;for(const c of JSON.stringify(x)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return(h>>>0).toString(36);}
function identify(q){q.id='v3:'+q.skill+':'+hash([q.score,q.target,q.kind,q.answer]);return q;}
function parseLine(line){return line.trim().split(/\s+/).filter(Boolean).map(token=>{
 const [ps,raw='q']=token.split(':'),tie=raw.endsWith('~'),d=raw.replace('~',''),dots=(d.match(/d/g)||[]).length,duration=d.replace(/d/g,'');
 if(ps==='r')return {...E.rest(duration),dots};
 const tones=ps.split('+').map(s=>E.parse(s));return {...tones[0],duration,dots,...(tones.length>1?{chord:tones.slice(1)}:{}),...(tie?{tie:true}:{})};
});}
function fromSpec(p){return {...p,measures:p.measures.map(m=>({treble:parseLine(m.treble),bass:parseLine(m.bass)}))};}
function validateScore(score){const errors=previousValidate(score);
 for(const [mi,m]of score.measures.entries())for(const clef of ['treble','bass'])for(const [ni,n]of(m[clef]||[]).entries()){
  for(const p of E.pitches(n))if(!E.LETTERS.includes(p.letter)||!Number.isInteger(p.octave)||p.octave<1||p.octave>6||!['#','b','n',null,undefined].includes(p.acc))errors.push('Ugyldig akkordtone');
  if(n.rest&&n.tie)errors.push('En pause kan ikke bindes');
  if(n.tie){const next=m[clef][ni+1]||score.measures[mi+1]?.[clef]?.[0];
   if(!next||next.rest||E.pitches(n).length!==E.pitches(next).length||E.pitches(n).some((p,i)=>p.letter!==E.pitches(next)[i].letter||p.octave!==E.pitches(next)[i].octave))errors.push('Bindebue uden samme efterfølgende tone');
  }
 }
 return errors;
}
function concept(q){
 if(q.pieceId)return 'piece:'+q.pieceId+':'+q.target.measure+':'+q.target.clef+':'+q.target.index;
 if(q.type==='pitch'){const n=E.targetNote(q);return [q.skill,q.level,n.clef,n.letter,n.octave,n.alter,q.score.key,q.detail].join('|');}
 return [q.skill,q.level,q.kind||q.type,q.score.key,q.score.time,q.concept||''].join('|');
}
function migrate(s,now=Date.now()){
 if(!E.validState(s))throw Error('Fremskridt kunne ikke læses');
 if(!s.learning){s.learning={version:3,reviews:{},practice:[],introducedAt:now};
  for(const m of s.mistakes){const key=concept(m.q);s.learning.reviews[key]={key,q:m.q,stage:0,dueAt:0,dueGroup:m.due,lastAt:now,failed:true};}
 }
 s.learning.reviews=s.learning.reviews||{};s.learning.practice=s.learning.practice||[];return s;
}
function sequenceQuestion(score,clef,skill,level,measureIndices=null){
 const indices=measureIndices||score.measures.map((_,i)=>i),resolved=E.resolveScore(score),tokens=[],labels=[],groups=[];
 for(const mi of indices){let count=0;for(const n of resolved[mi][clef])if(!n.rest&&!n.tied)for(const p of n.tones){tokens.push(p.id);labels.push(p.name);count++;}groups.push({measure:mi,count});}
 return identify({skill,level,type:'sequence',kind:'sequence',score,target:null,clef,groups,expectedTokens:tokens,units:tokens.length,
  prompt:'Læs '+(indices.length>1?'begge takter':'hele takten')+' i '+(clef==='treble'?'højre':'venstre')+' hånd',
  detail:'Tilføj tonerne i rækkefølge. Spring pauser og toner, der er bundet fra den foregående tone, over. Akkorder læses nedefra.',
  answer:JSON.stringify(tokens),answerLabel:labels.join(' · '),explanation:labels.join(' · ')+'. Læs trin, spring og gentagelser fra venstre mod højre. En bindebue forlænger tonen uden nyt anslag.'});
}
function melodyQuestion(level,r,skill='passage',clef=null){clef=clef||pick(['treble','bass'],r);const score=C.buildScore(level,r,clef,level>=3?2:1,true);return sequenceQuestion(score,clef,skill,level);}
function chordQuestion(level,r){
 const clef=pick(['treble','bass'],r),key=pick(level===1?['C']:level===2?['C','G','F']:['C','G','D','F','Bb','Am','Dm'],r);
 const roots={C:['C','F','G'],G:['G','C','D'],D:['D','G','A'],F:['F','B','C'],Bb:['B','E','F'],Am:['A','D','E'],Dm:['D','G','A']};
 const letter=pick(roots[key],r),octave=clef==='bass'?2:4,root=E.diatonic(E.parse(letter+octave));
 let pts=(level===1?[0,pick([2,4],r)]:level===4&&r()<.5?[0,2,4,6]:[0,2,4]).map(i=>E.fromDiatonic(root+i));
 const inversion=level>=3?Math.floor(r()*3):0;for(let i=0;i<inversion;i++){const first=pts.shift();pts.push({...first,octave:first.octave+1});}
 const n={...pts[0],duration:'w',chord:pts.slice(1)},score={key,time:'4/4',measures:[{treble:clef==='treble'?[n]:[E.rest('w')],bass:clef==='bass'?[n]:[E.rest('w')]}]};
 const q=sequenceQuestion(score,clef,'interval',level);q.kind='chord';q.prompt='Hvilke toner står i grebet?';q.detail='Læs alle tonerne nedefra og op. Tilføj én tone ad gangen.';q.target={measure:0,clef,index:0};q.explanation=q.answerLabel+'. Tonerne spilles samtidig. Se afstanden mellem dem som et samlet greb.';return identify(q);
}
function intervalQuality(level,r){
 const clef=pick(['treble','bass'],r),start=(clef==='bass'?19:28)+Math.floor(r()*5),size=pick([2,3,4,5,6,7,8],r),dir=r()<.5?-1:1;
 const a=E.fromDiatonic(start),b=E.fromDiatonic(start+(size-1)*dir),names={2:['Lille sekund','Stor sekund'],3:['Lille terts','Stor terts'],4:['Ren kvart'],5:['Ren kvint'],6:['Lille sekst','Stor sekst'],7:['Lille septim','Stor septim'],8:['Ren oktav']};
 const semis={2:[1,2],3:[3,4],4:[5],5:[7],6:[8,9],7:[10,11],8:[12]},index=Math.floor(r()*semis[size].length),target=E.midi(a)+dir*semis[size][index],alter=target-E.midi(b);if(Math.abs(alter)>1)return intervalQuality(level,r);
 b.acc=alter===1?'#':alter===-1?'b':null;const correct=names[size][index],all=Object.values(names).flat(),options=shuffle([correct,...shuffle(all.filter(s=>s!==correct),r).slice(0,3)],r).map(label=>({value:label,label}));
 return identify({skill:'interval',level,type:'choice',kind:'interval-quality',score:{key:'C',time:null,measures:[{treble:clef==='treble'?[a,b]:[],bass:clef==='bass'?[a,b]:[]}]},target:null,prompt:'Hvilket interval er det helt præcist?',detail:'Læs både størrelsen og om intervallet er stort, lille eller rent.',answer:correct,answerLabel:correct,options,explanation:correct+': '+size+' stamtoner inklusive begge ender og '+semis[size][index]+' halvtoner.'});
}
const TAP_PATTERNS={
 1:[['4/4','G4:q G4:q G4:q G4:q'],['3/4','G4:q G4:h'],['4/4','G4:h G4:q G4:q']],
 2:[['4/4','G4:q G4:8 G4:8 G4:h'],['4/4','G4:q r:q G4:q G4:q'],['3/4','G4:qd G4:8 G4:q'],['6/8','G4:qd G4:8 G4:8 G4:8']],
 3:[['4/4','G4:8 G4:q G4:8 G4:q r:q'],['6/8','G4:8 r:8 G4:8 G4:q G4:8'],['12/8','G4:qd G4:q G4:8 G4:qd G4:qd'],['4/4','G4:q G4:q~ G4:q G4:q']],
 4:[['4/4','G4:16 G4:16 G4:8 G4:qd G4:8 G4:q'],['4/4','G4:8 G4:q~ G4:8 r:8 G4:8 G4:q'],['6/8','G4:16 G4:16 G4:8 G4:8 G4:qd'],['12/8','G4:q G4:8 G4:8 G4:q~ G4:qd G4:qd']]
};
function tapQuestion(level,r){const [time,line]=pick(TAP_PATTERNS[level],r),notes=parseLine(line),score={key:'C',time,measures:[{treble:notes,bass:[]}]};
 return identify({skill:'rhythm',level,type:'tap',kind:'tap',score,target:null,prompt:'Bank rytmen i takt',detail:'Læs først. Start optællingen, og bank kun ved nye anslag. Hold pulsen gennem pauser og bindebuer.',answer:'ok',answerLabel:'Rytmen ligger i pulsen',explanation:'Tæl underdelingerne, og lad pauserne få deres fulde plads.',units:4,tempo:level<=2?56:48});
}
function rhythmAdvanced(level,r){const q=tapQuestion(level,r);q.type='choice';q.kind='bar-rhythm';let at=0;const hits=[];for(const[nindex,n]of E.resolveScore(q.score)[0].treble.entries()){if(!n.rest&&!n.tied)hits.push({index:nindex,at});at+=n.beats;}const hit=pick(hits.slice(1).length?hits.slice(1):hits,r);q.target={measure:0,clef:'treble',index:hit.index};
 const compound=['6/8','12/8'].includes(q.score.time);const label=t=>compound?String(t*2+1).replace('.5','½'):C.momentLabel(t,q.score.time);
 const correct=label(hit.at),values=Array.from({length:at*4},(_,i)=>label(i/4));q.options=shuffle([correct,...shuffle([...new Set(values)].filter(x=>x!==correct),r).slice(0,3)],r).map(v=>({value:v,label:v}));q.answer=correct;q.answerLabel=correct;q.units=hit.index+1;
 q.prompt=compound?'På hvilken ottendedelsplads begynder den grønne tone?':'Hvornår begynder den grønne tone?';q.detail=compound?'En halv plads er en sekstendedel. Tæl også pauser og bundne toner.':'Sekstendedele tælles 1-e-og-a, 2-e-og-a. Bindebuer giver ingen nye anslag.';q.explanation='Den grønne tone begynder på '+correct+'. Læg varigheden af alle forudgående toner og pauser sammen.';return identify(q);
}
function question(skill,level,r){
 if(skill==='chords')return chordQuestion(level,r);
 if(skill==='tap')return tapQuestion(level,r);
 if(skill==='passage')return r()<.25?C.together(level,r):melodyQuestion(level,r);
 if((skill==='treble'||skill==='bass')&&level>=2&&r()<.45)return melodyQuestion(level,r,skill,skill);
 if(skill==='interval'&&level===4)return r()<.35?chordQuestion(level,r):intervalQuality(level,r);
 if(skill==='interval'&&level>=2&&r()<.25)return chordQuestion(level,r);
 if(skill==='rhythm'&&level===4)return rhythmAdvanced(level,r);
 return previousQuestion(skill,level,r);
}
function acceptsFocus(q,focus){return focus==='mixed'||focus==='review'||(focus==='chords'?q.kind==='chord':focus==='tap'?q.kind==='tap':q.skill===focus);}
function dueReviews(s,focus='mixed',now=Date.now()){migrate(s,now);return Object.values(s.learning.reviews).filter(x=>x.dueAt<=now&&(x.dueGroup||0)<=s.groups&&acceptsFocus(x.q,focus)).sort((a,b)=>a.dueAt-b.dueAt||a.lastAt-b.lastAt);}
function group(s,focus='mixed',seed=Date.now(),now=Date.now()){
 migrate(s,now);const r=E.rng(seed),out=[],due=dueReviews(s,focus,now);
 for(const entry of due.slice(0,focus==='review'?5:1)){
  let q=entry.q;
  if(!q.pieceId&&!entry.failed){for(let i=0;i<12;i++){const variant=question(q.kind==='chord'?'chords':q.kind==='tap'?'tap':q.skill,q.level,r);if(variant.kind===q.kind&&variant.score.key===q.score.key&&variant.score.time===q.score.time&&(q.type!=='pitch'||concept(variant)===entry.key)){q=variant;break;}}}
  out.push({...q,review:true,reviewKey:entry.key});
 }
 const domain=focus==='chords'?'interval':focus==='tap'?'rhythm':focus;
 const skills=focus==='mixed'||focus==='review'?shuffle(['treble','bass','rhythm','passage',s.groups%2?'interval':'accidental'],r):Array(5).fill(domain);
 for(const skill of skills){if(out.length>=5)break;let q;for(let i=0;i<25;i++){q=question(['chords','tap'].includes(focus)?focus:skill,s.skills[skill].level,r);if(!out.some(x=>x.id===q.id))break;}out.push(q);}
 return out;
}
function record(s,q,answer,ms,now=Date.now()){
 migrate(s,now);const result=previousRecord(s,q,answer,ms,now),key=q.reviewKey||concept(q),old=s.learning.reviews[key];
 if(!result.correct){s.learning.reviews[key]={key,q:{...q,review:false,reviewKey:undefined},stage:0,dueAt:now,dueGroup:s.groups+1,lastAt:now,failed:true};}
 else if(!old||q.review){const stage=old&&!old.failed?Math.min(old.stage+1,INTERVAL_DAYS.length-1):0;const days=INTERVAL_DAYS[Math.min(stage,INTERVAL_DAYS.length-1)];s.learning.reviews[key]={key,q:{...q,review:false,reviewKey:undefined},stage,dueAt:now+days*DAY,dueGroup:s.groups,lastAt:now,failed:false};
  if(q.review)s.mistakes=s.mistakes.filter(m=>concept(m.q)!==key);
 }
 return result;
}
function passageQuestions(p){return previousPassages(p).map(q=>{
 const n=E.targetNote(q);if((n.tones||[]).length<2)return q;
 return {...q,type:'sequence',kind:'chord',expectedTokens:n.tones.map(t=>t.id),units:n.tones.length,answer:JSON.stringify(n.tones.map(t=>t.id)),answerLabel:n.tones.map(t=>t.name).join(' · '),prompt:'Læs grebet i '+(q.target.clef==='treble'?'højre':'venstre')+' hånd',detail:'Takt '+(q.target.measure+1)+'. Tilføj tonerne nedefra og op.',explanation:n.tones.map(t=>t.name).join(' · ')+'. De spilles på samme tid.'};
 });}
function pulseInfo(time){const [n,d]=time.split('/').map(Number);const compound=d===8&&n%3===0&&n>3;return {beats:n*4/d,pulse:compound?1.5:1,pulses:compound?n/3:n,compound};}
function timeline(score,hand='both',start=0,end=score.measures.length){
 const resolved=E.resolveScore(score),events=[];let offset=0;const active={};
 for(let mi=start;mi<end;mi++){const m=resolved[mi];for(const clef of ['treble','bass']){if(hand!=='both'&&hand!==clef)continue;let at=0;
  for(const [index,n]of m[clef].entries()){if(!n.rest)for(const p of n.tones){const id=clef+':'+p.midi,prior=active[id];
   if(n.tied&&prior&&Math.abs(prior.at+prior.duration-(offset+at))<1e-7)prior.duration+=n.beats;
   else{const event={at:offset+at,duration:n.beats,midi:p.midi,clef,measure:mi,index};events.push(event);active[id]=event;}
  }at+=n.beats;}
 }offset+=pulseInfo(score.time).beats;}
 return {events,duration:offset};
}
function tapTargets(q){let at=0;return E.resolveScore(q.score).flatMap(m=>m.treble.map(n=>{const value=!n.rest&&!n.tied?at:null;at+=n.beats;return value;})).filter(v=>v!==null);}
function gradeTaps(q,taps,tempo){
 const pulse=pulseInfo(q.score.time).pulse,unitMs=60000/tempo/pulse,expected=tapTargets(q).map(t=>t*unitMs),tolerance=Math.max(85,Math.min(180,unitMs*.2));
 // Align by sequence with insertion/deletion penalties; an extra tap must not shift all remaining comparisons.
 const n=expected.length,m=taps.length,dp=Array.from({length:n+1},()=>Array(m+1).fill(0));for(let i=0;i<=n;i++)dp[i][0]=i;for(let j=0;j<=m;j++)dp[0][j]=j;
 for(let i=1;i<=n;i++)for(let j=1;j<=m;j++)dp[i][j]=Math.min(dp[i-1][j]+1,dp[i][j-1]+1,dp[i-1][j-1]+(Math.abs(expected[i-1]-taps[j-1])<=tolerance?0:1));
 const mistakes=dp[n][m],correct=mistakes===0;
 return {correct,expected:expected.length,actual:taps.length,mistakes,tolerance,feedback:correct?'Alle anslag lå i pulsen.':taps.length!==expected.length?'Du bankede '+taps.length+' gange; rytmen har '+expected.length+' nye anslag.':'Antallet passer. '+mistakes+' anslag lå uden for pulsen. Prøv at tælle underdelingerne.'};
}
function addPractice(s,entry,now=Date.now()){
 migrate(s,now);const run={...entry,at:now,id:'play:'+now+':'+s.learning.practice.length};s.learning.practice.push(run);return run;
}
function nextPiece(s,pieces=E.PIECES){migrate(s);const level=Math.max(1,Math.min(s.skills.treble.level,s.skills.bass.level));const practiced=new Set(s.learning.practice.map(x=>x.pieceId));return pieces.find(p=>p.level<=level&&!practiced.has(p.id))||pieces.find(p=>p.level<=Math.min(4,level+1)&&!practiced.has(p.id))||pieces[0];}
E.question=question;E.group=group;E.record=record;E.passageQuestions=passageQuestions;E.validateScore=validateScore;
return {DAY,INTERVAL_DAYS,parseLine,fromSpec,validateScore,concept,migrate,dueReviews,question,group,record,sequenceQuestion,melodyQuestion,chordQuestion,intervalQuality,tapQuestion,gradeTaps,tapTargets,pulseInfo,timeline,addPractice,nextPiece};
});
