/* VexFlow is bundled locally. No CDN, web font or image request is needed. */
(function(root){'use strict';
const VF=root.Vex.Flow;
function staveNote(n,clef){
 const tones=NV.pitches(n),opts={clef,keys:n.rest?[clef==='bass'?'d/3':'b/4']:tones.map(p=>p.letter.toLowerCase()+'/'+p.octave),duration:n.duration+(n.dots?'d':'')+(n.rest?'r':''),auto_stem:true};
 const note=new VF.StaveNote(opts);tones.forEach((p,i)=>{if(p.acc)note.addModifier(new VF.Accidental(p.acc),i);});if(n.dots)VF.Dot.buildAndAttach([note],{all:true});return note;
}
function render(container,score,options={}){
 container.replaceChildren();const outerWidth=options.width||Math.max(290,Math.min(520,container.clientWidth||340));
 const dense=score.time==='12/8'||score.measures.some(m=>Math.max((m.treble||[]).length,(m.bass||[]).length)>=8);
 const width=dense?Math.max(580,Math.round(outerWidth/1.15),Math.round(580*(options.zoomFactor||1))):Math.max(280,Math.round(outerWidth/1.15));
 const indices=options.indices||score.measures.map((_,i)=>i);const allMeta=[];
 for(const mi of indices){const measure=score.measures[mi];const block=document.createElement('div');block.className='notation-system';block.dataset.measure=mi;if(score.time){const label=document.createElement('div');label.className='measure-caption';label.textContent='Takt '+(mi+1+(score.barOffset||0));block.appendChild(label);}const holder=document.createElement('div');block.appendChild(holder);container.appendChild(block);
 const renderer=new VF.Renderer(holder,VF.Renderer.Backends.SVG);renderer.resize(width,224);const ctx=renderer.getContext();
 const staves={treble:new VF.Stave(18,1,width-29),bass:new VF.Stave(18,101,width-29)};
 for(const clef of ['treble','bass']){const stave=staves[clef];stave.addClef(clef);if(score.key!=='C')stave.addKeySignature(score.key);if(score.time)stave.addTimeSignature(score.time);}
 const start=Math.max(staves.treble.getNoteStartX(),staves.bass.getNoteStartX());for(const s of Object.values(staves))s.setNoteStartX(start);
 for(const s of Object.values(staves))s.setContext(ctx).draw();
 new VF.StaveConnector(staves.treble,staves.bass).setType(VF.StaveConnector.type.BRACE).setContext(ctx).draw();
 new VF.StaveConnector(staves.treble,staves.bass).setType(VF.StaveConnector.type.SINGLE_LEFT).setContext(ctx).draw();
 const voices=[],noteLists={},beams=[];
 for(const clef of ['treble','bass']){let data=measure[clef]||[];if(!data.length)continue;const ns=data.map((n,i)=>{const sn=staveNote(n,clef);if(options.hand&&options.hand!=='both'&&options.hand!==clef)sn.setStyle({fillStyle:'#b4b9b1',strokeStyle:'#b4b9b1'});if(options.target&&options.target.measure===mi&&options.target.clef===clef&&options.target.index===i)sn.setStyle({fillStyle:'#13796c',strokeStyle:'#13796c'});return sn;});noteLists[clef]=ns;if(score.time){const compound=score.time==='6/8'||score.time==='12/8';const options=compound?{groups:[new VF.Fraction(3,8)]}:{};beams.push(...VF.Beam.generateBeams(ns,options));}const parts=(score.time||'4/4').split('/');const voice=new VF.Voice({num_beats:+parts[0],beat_value:+parts[1]}).setMode(VF.Voice.Mode.SOFT).addTickables(ns);voice.setStave(staves[clef]);voices.push(voice);}
 if(voices.length){const formatter=new VF.Formatter();for(const v of voices)formatter.joinVoices([v]);formatter.format(voices,Math.max(55,width-start-31));voices.forEach(v=>v.draw(ctx,v.getStave()));beams.forEach(b=>b.setContext(ctx).draw());}
 for(const clef of ['treble','bass']){const raw=measure[clef]||[],ns=noteLists[clef]||[];
  for(let i=0;i<raw.length;i++){
   const ids=NV.pitches(raw[i]).map((_,j)=>j);
   if(raw[i].tie)new VF.StaveTie({first_note:ns[i],last_note:ns[i+1]||undefined,first_indices:ids,last_indices:ids}).setContext(ctx).draw();
   if(i===0&&mi>0&&score.measures[mi-1][clef]?.at(-1)?.tie)new VF.StaveTie({last_note:ns[i],first_indices:ids,last_indices:ids}).setContext(ctx).draw();
  }
 }
 const svg=holder.querySelector('svg');svg.setAttribute('viewBox',`0 0 ${width} 224`);svg.removeAttribute('width');svg.removeAttribute('height');svg.setAttribute('role','img');svg.setAttribute('aria-label',`Klaverpartitur med G-nøgle øverst og F-nøgle nederst${score.time?', takt '+(mi+1):''}. ${options.target?'Læs den grønne tone.':''}`);svg.style.width=dense?width+'px':'100%';svg.style.display='block';
 if(options.target&&options.target.measure===mi){const sn=noteLists[options.target.clef]?.[options.target.index];if(sn){const x=sn.getNoteHeadBeginX()+5,y=sn.getYs()[0];const halo=document.createElementNS('http://www.w3.org/2000/svg','ellipse');halo.setAttribute('cx',x);halo.setAttribute('cy',y);halo.setAttribute('rx','14');halo.setAttribute('ry','13');halo.setAttribute('fill','#d9f0e7');svg.insertBefore(halo,svg.firstChild);}}
 for(const clef of ['treble','bass'])for(let i=0;i<(noteLists[clef]||[]).length;i++){const sn=noteLists[clef][i];allMeta.push({measure:mi,clef,index:i,x:sn.getNoteHeadBeginX(),y:sn.getYs()[0],bottom:staves[clef].getYForLine(4),spacing:staves[clef].getSpacingBetweenLines(),acc:measure[clef][i].acc||null,ticks:sn.getTicks().value()});}
 }
 return allMeta;
}
root.Notation={render,staveNote};
})(window);

