/* Public-domain passages verified against the named Mutopia source editions.
 * These are distinct windows, not copies of the already shipped excerpts. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./engine.js'),require('./learning.js'),require('./advanced.js'));else factory(root.NV,root.NV.learning);})(typeof globalThis!=='undefined'?globalThis:this,function(E,L){
'use strict';
const groups=[["satie-gymno","Gymnopédie nr. 1","satie-gymno-"],["burgmuller-arabesque","Arabesque","burgmuller-arabesque-"],["mozart-k2","Mozart K. 2","mozart-k2-"],["petzold-menuet","Menuet i G","petzold-menuet-"],["beethoven-furelise","Für Elise","beethoven-furelise-"],["chopin-prelude28-4","Præludium op. 28 nr. 4","chopin-prelude28-4-"],["mozart-turkish","Turkish March","mozart-turkish-"]];
for(const p of E.PIECES){for(const [id,name,prefix] of groups)if(p.id.startsWith(prefix)){p.workId=id;p.workName=name;}}
const specs=[
  {
    "id": "satie-gymno-t22-25",
    "title": "Gymnopédie · Ny frase",
    "subtitle": "Takt 22–25 · Melodi med løse fortegn",
    "level": 4,
    "key": "D",
    "time": "3/4",
    "tip": "C er nu sænket til C-natural flere steder. Find melodien i højre hånd før du samler hænderne.",
    "workId": "satie-gymno",
    "collection": "klassisk",
    "composer": "Erik Satie",
    "source": {
      "url": "https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=37",
      "title": "Gymnopédie · Ny frase, Takt 22–25",
      "license": "Public Domain",
      "adaptation": "Toner og varigheder transskriberet fra den frit anvendelige Mutopia-nodeudgave. Bas og mellemstemme er samlet i venstre hånd. Enkelte indre toner i brede akkorder er udeladt, så grebene kan spilles med én hånd. Meloditoner og løse fortegn er bevaret; fingersætning, dynamik, frasering og forsiringer er udeladt."
    },
    "measures": [
      {
        "treble": "A4:q B4:q Cn5:q",
        "bass": "A2:q A3+Cn4+E4:h"
      },
      {
        "treble": "E5:q D5:q B4:q",
        "bass": "D2:q G3+B3+E4:h"
      },
      {
        "treble": "D5:q Cn5:q B4:q",
        "bass": "D2:q G3+B3+E4:h"
      },
      {
        "treble": "D5:hd",
        "bass": "D2:q E3+A3+D4:h"
      }
    ]
  },
  {
    "id": "satie-gymno-t26-29",
    "title": "Gymnopédie · Kromatiske bevægelser",
    "subtitle": "Takt 26–29 · F og C sænkes igen",
    "level": 4,
    "key": "D",
    "time": "3/4",
    "tip": "Se efter opløsningstegnene foran F og C. Højre hånd bevæger sig gradvist op og falder tilbage.",
    "workId": "satie-gymno",
    "collection": "klassisk",
    "composer": "Erik Satie",
    "source": {
      "url": "https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=37",
      "title": "Gymnopédie · Kromatiske bevægelser, Takt 26–29",
      "license": "Public Domain",
      "adaptation": "Toner og varigheder transskriberet fra den frit anvendelige Mutopia-nodeudgave. Bas og mellemstemme er samlet i venstre hånd. Enkelte indre toner i brede akkorder er udeladt, så grebene kan spilles med én hånd. Meloditoner og løse fortegn er bevaret; fingersætning, dynamik, frasering og forsiringer er udeladt."
    },
    "measures": [
      {
        "treble": "D5:h D5:q",
        "bass": "D2:q F3+A3+D4:h"
      },
      {
        "treble": "E5:q Fn5:q G5:q",
        "bass": "D2:q A3+Cn4+Fn4:h"
      },
      {
        "treble": "A5:q Cn5:q D5:q",
        "bass": "D2:q A3+Cn4+E4:h"
      },
      {
        "treble": "E5:q D5:q B4:q",
        "bass": "D2:q G3+B3+E4:h"
      }
    ]
  },
  {
    "id": "satie-gymno-t30-33",
    "title": "Gymnopédie · Mod første afslutning",
    "subtitle": "Takt 30–33 · Lange toner over skiftende bas",
    "level": 4,
    "key": "D",
    "time": "3/4",
    "tip": "Hold de lange toner i højre hånd. Bassens akkorder skifter, selv når melodien står stille.",
    "workId": "satie-gymno",
    "collection": "klassisk",
    "composer": "Erik Satie",
    "source": {
      "url": "https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=37",
      "title": "Gymnopédie · Mod første afslutning, Takt 30–33",
      "license": "Public Domain",
      "adaptation": "Toner og varigheder transskriberet fra den frit anvendelige Mutopia-nodeudgave. Bas og mellemstemme er samlet i venstre hånd. Enkelte indre toner i brede akkorder er udeladt, så grebene kan spilles med én hånd. Meloditoner og løse fortegn er bevaret; fingersætning, dynamik, frasering og forsiringer er udeladt."
    },
    "measures": [
      {
        "treble": "D5:hd",
        "bass": "D2:q E3+A3+D4:h"
      },
      {
        "treble": "D5:h D5:q",
        "bass": "D2:q F3+A3+D4:h"
      },
      {
        "treble": "G5:hd",
        "bass": "E2:q B3+E4+G4:h"
      },
      {
        "treble": "F5:hd",
        "bass": "F2:q A3+C4+F4:h"
      }
    ]
  },
  {
    "id": "satie-gymno-t34-37",
    "title": "Gymnopédie · Første afslutning",
    "subtitle": "Takt 34–37 · Fra lille frase til skiftende akkorder",
    "level": 5,
    "key": "D",
    "time": "3/4",
    "tip": "Højre hånd bevæger sig i små trin; venstre hånd skal skifte fra bas til akkord med rolige, præcise spring.",
    "workId": "satie-gymno",
    "collection": "klassisk",
    "composer": "Erik Satie",
    "source": {
      "url": "https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=37",
      "title": "Gymnopédie · Første afslutning, Takt 34–37",
      "license": "Public Domain",
      "adaptation": "Toner og varigheder transskriberet fra den frit anvendelige Mutopia-nodeudgave. Bas og mellemstemme er samlet i venstre hånd. Enkelte indre toner i brede akkorder er udeladt, så grebene kan spilles med én hånd. Meloditoner og løse fortegn er bevaret; fingersætning, dynamik, frasering og forsiringer er udeladt."
    },
    "measures": [
      {
        "treble": "B4:q A4:q B4:q",
        "bass": "B1:q B3+D4+F4:h"
      },
      {
        "treble": "C5:q D5:q E5:q",
        "bass": "E2:q C4+E4+A4:h"
      },
      {
        "treble": "C5:q D5:q E5:q",
        "bass": "E2:q A3+C4+F4+A4:h"
      },
      {
        "treble": "F4:hd",
        "bass": "E2:q A3+D4:q B3+D4+G4:q"
      }
    ]
  },
  {
    "id": "petzold-menuet-t9-12",
    "title": "Menuet i G · Ny frase",
    "subtitle": "Takt 9–12 · Første tema vender tilbage",
    "level": 3,
    "key": "G",
    "time": "3/4",
    "tip": "Se, at de første to takter kendes fra åbningen; tredje og fjerde takt giver dem en ny fortsættelse.",
    "workId": "petzold-menuet",
    "collection": "klassisk",
    "composer": "Christian Petzold (tilskrevet)",
    "source": {
      "url": "https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=75",
      "title": "Menuet i G · Ny frase, Takt 9–12",
      "license": "Public Domain",
      "adaptation": "Toner og varigheder transskriberet fra den frit anvendelige Mutopia-nodeudgave. Bas og mellemstemme er samlet i venstre hånd. Enkelte indre toner i brede akkorder er udeladt, så grebene kan spilles med én hånd. Meloditoner og løse fortegn er bevaret; fingersætning, dynamik, frasering og forsiringer er udeladt."
    },
    "measures": [
      {
        "treble": "D5:q G4:8 A4:8 B4:8 C5:8",
        "bass": "B3:h A3:q"
      },
      {
        "treble": "D5:q G4:q G4:q",
        "bass": "G3:q B3:q G3:q"
      },
      {
        "treble": "E5:q C5:8 D5:8 E5:8 F5:8",
        "bass": "C4:hd"
      },
      {
        "treble": "G5:q G4:q G4:q",
        "bass": "B3:q C4:8 B3:8 A3:8 G3:8"
      }
    ]
  },
  {
    "id": "petzold-menuet-t13-16",
    "title": "Menuet i G · Første dels kadence",
    "subtitle": "Takt 13–16 · Faldende bevægelser",
    "level": 3,
    "key": "G",
    "time": "3/4",
    "tip": "Læs først den faldende bevægelse i højre hånd og find basgangen i de sidste to takter.",
    "workId": "petzold-menuet",
    "collection": "klassisk",
    "composer": "Christian Petzold (tilskrevet)",
    "source": {
      "url": "https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=75",
      "title": "Menuet i G · Første dels kadence, Takt 13–16",
      "license": "Public Domain",
      "adaptation": "Toner og varigheder transskriberet fra den frit anvendelige Mutopia-nodeudgave. Bas og mellemstemme er samlet i venstre hånd. Enkelte indre toner i brede akkorder er udeladt, så grebene kan spilles med én hånd. Meloditoner og løse fortegn er bevaret; fingersætning, dynamik, frasering og forsiringer er udeladt."
    },
    "measures": [
      {
        "treble": "C5:q D5:8 C5:8 B4:8 A4:8",
        "bass": "A3:h F3:q"
      },
      {
        "treble": "B4:q C5:8 B4:8 A4:8 G4:8",
        "bass": "G3:h B3:q"
      },
      {
        "treble": "A4:q B4:8 A4:8 G4:8 F4:8",
        "bass": "C4:q D4:q D3:q"
      },
      {
        "treble": "G4:hd",
        "bass": "G3:h G2:q"
      }
    ]
  },
  {
    "id": "petzold-menuet-t21-24",
    "title": "Menuet i G · Sekvens opad",
    "subtitle": "Takt 21–24 · Ottendedele og basvending",
    "level": 4,
    "key": "G",
    "time": "3/4",
    "tip": "Takt 21 har seks ottendedele i træk. Hold øje med Cis og H i næste takter.",
    "workId": "petzold-menuet",
    "collection": "klassisk",
    "composer": "Christian Petzold (tilskrevet)",
    "source": {
      "url": "https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=75",
      "title": "Menuet i G · Sekvens opad, Takt 21–24",
      "license": "Public Domain",
      "adaptation": "Toner og varigheder transskriberet fra den frit anvendelige Mutopia-nodeudgave. Bas og mellemstemme er samlet i venstre hånd. Enkelte indre toner i brede akkorder er udeladt, så grebene kan spilles med én hånd. Meloditoner og løse fortegn er bevaret; fingersætning, dynamik, frasering og forsiringer er udeladt."
    },
    "measures": [
      {
        "treble": "A4:8 B4:8 C#5:8 D5:8 E5:8 F5:8",
        "bass": "A3:hd"
      },
      {
        "treble": "G5:q F5:q E5:q",
        "bass": "B3:q D4:q C#4:q"
      },
      {
        "treble": "F5:q A4:q C#5:q",
        "bass": "D4:q F3:q A3:q"
      },
      {
        "treble": "D5:hd",
        "bass": "D4:q D3:q Cn4:q"
      }
    ]
  },
  {
    "id": "mozart-k2-t5-6",
    "title": "Mozart K. 2 · To små spejlfraser",
    "subtitle": "Takt 5–6 · Fra C–E–G til C–F–A",
    "level": 2,
    "key": "F",
    "time": "3/4",
    "tip": "Sammenlign de to takter: første starter med C–E, anden med C–F. De lange bastoner giver ro til læsningen.",
    "workId": "mozart-k2",
    "collection": "klassisk",
    "composer": "W. A. Mozart",
    "source": {
      "url": "https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=1770",
      "title": "Mozart K. 2 · To små spejlfraser, Takt 5–6",
      "license": "Public Domain",
      "adaptation": "Toner og varigheder transskriberet fra den frit anvendelige Mutopia-nodeudgave. Bas og mellemstemme er samlet i venstre hånd. Enkelte indre toner i brede akkorder er udeladt, så grebene kan spilles med én hånd. Meloditoner og løse fortegn er bevaret; fingersætning, dynamik, frasering og forsiringer er udeladt."
    },
    "measures": [
      {
        "treble": "C4:8 E4:8 G4:q G4:q",
        "bass": "C3:hd"
      },
      {
        "treble": "C4:8 F4:8 A4:q A4:q",
        "bass": "C3:hd"
      }
    ]
  }
];
specs.push(...[
  {
    "id": "petzold-menuet-t25-28",
    "title": "Menuet i G · Genkend melodien",
    "subtitle": "Takt 25–28 · Variation og faldende frase",
    "level": 4,
    "key": "G",
    "time": "3/4",
    "tip": "Sammenlign de to første takter: samme rytme, forskellig højde. Spil derefter den faldende linje med rolig puls.",
    "workId": "petzold-menuet",
    "workName": "Menuet i G",
    "collection": "klassisk",
    "composer": "Christian Petzold (tilskrevet)",
    "source": {
      "url": "https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=75",
      "title": "Menuet i G, Takt 25–28",
      "license": "Public Domain",
      "adaptation": "Toner og rytme transskriberet fra den offentligt tilgængelige Mutopia-nodeudgave. Nogle stemmeføringsdetaljer og ornamenter er udeladt. Spil efter originalkilden for fuld notation."
    },
    "measures": [
      {
        "treble": "D5:q G4:8 F4:8 G4:q",
        "bass": "B3:h B3:q"
      },
      {
        "treble": "E5:q G4:8 F4:8 G4:q",
        "bass": "C4:h C4:q"
      },
      {
        "treble": "D5:q C5:q B4:q",
        "bass": "B3:q A3:q G3:q"
      },
      {
        "treble": "A4:8 G4:8 F4:8 G4:8 A4:q",
        "bass": "D4:h r:q"
      }
    ]
  },
  {
    "id": "petzold-menuet-t29-32",
    "title": "Menuet i G · Sidste frase",
    "subtitle": "Takt 29–32 · Seks ottendedele og afslutning",
    "level": 4,
    "key": "G",
    "time": "3/4",
    "tip": "Læs de seks ottendedele som et løb, og mærk hvordan musikken derefter finder tilbage til G.",
    "workId": "petzold-menuet",
    "workName": "Menuet i G",
    "collection": "klassisk",
    "composer": "Christian Petzold (tilskrevet)",
    "source": {
      "url": "https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=75",
      "title": "Menuet i G, Takt 29–32",
      "license": "Public Domain",
      "adaptation": "Toner og rytme transskriberet fra den offentligt tilgængelige Mutopia-nodeudgave. Nogle stemmeføringsdetaljer og ornamenter er udeladt. Spil efter originalkilden for fuld notation."
    },
    "measures": [
      {
        "treble": "D4:8 E4:8 F4:8 G4:8 A4:8 B4:8",
        "bass": "D3:hd"
      },
      {
        "treble": "C5:q B4:q A4:q",
        "bass": "E3:q G3:q F3:q"
      },
      {
        "treble": "B4:8 D5:8 G4:q F4:q",
        "bass": "G3:q B2:q D3:q"
      },
      {
        "treble": "G4:hd",
        "bass": "G3:q D3:q G2:q"
      }
    ]
  },
  {
    "id": "mozart-k2-t17-20",
    "title": "Mozart K. 2 · Temaet igen",
    "subtitle": "Takt 17–20 · Kendte figurer, ændret bas",
    "level": 3,
    "key": "F",
    "time": "3/4",
    "tip": "Melodien ligner de første takter. Hør hvordan ændret venstrehåndsbas får samme figur til at virke anderledes.",
    "workId": "mozart-k2",
    "workName": "Mozart K. 2",
    "collection": "klassisk",
    "composer": "W. A. Mozart",
    "source": {
      "url": "https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=1770",
      "title": "Mozart K. 2, Takt 17–20",
      "license": "Public Domain",
      "adaptation": "Toner og rytme transskriberet fra den offentligt tilgængelige Mutopia-nodeudgave. Nogle stemmeføringsdetaljer og ornamenter er udeladt. Spil efter originalkilden for fuld notation."
    },
    "measures": [
      {
        "treble": "F5:8 A5:8 C5:q C5:q",
        "bass": "A3:hd"
      },
      {
        "treble": "D5:8 F5:8 B4:q B4:q",
        "bass": "B3:hd"
      },
      {
        "treble": "A4:8 C5:8 F4:q E4:q",
        "bass": "C4:h C3:q"
      },
      {
        "treble": "E4:h F4:q",
        "bass": "D3:hd"
      }
    ]
  },
  {
    "id": "mozart-k2-t21-24",
    "title": "Mozart K. 2 · Den sidste kadence",
    "subtitle": "Takt 21–24 · Sidste fire takter",
    "level": 3,
    "key": "F",
    "time": "3/4",
    "tip": "Sammenlign slutningen med den første frase. Basgangen i sidste takt giver en tydelig afslutning.",
    "workId": "mozart-k2",
    "workName": "Mozart K. 2",
    "collection": "klassisk",
    "composer": "W. A. Mozart",
    "source": {
      "url": "https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=1770",
      "title": "Mozart K. 2, Takt 21–24",
      "license": "Public Domain",
      "adaptation": "Toner og rytme transskriberet fra den offentligt tilgængelige Mutopia-nodeudgave. Nogle stemmeføringsdetaljer og ornamenter er udeladt. Spil efter originalkilden for fuld notation."
    },
    "measures": [
      {
        "treble": "F5:8 A5:8 C5:q C5:q",
        "bass": "A3:hd"
      },
      {
        "treble": "D5:8 F5:8 B4:q B4:q",
        "bass": "B3:hd"
      },
      {
        "treble": "A4:8 C5:8 F4:q E4:q",
        "bass": "C4:h C3:q"
      },
      {
        "treble": "E4:h F4:q",
        "bass": "F3:q C3:q F2:q"
      }
    ]
  },
  {
    "id": "beethoven-furelise-t1-4",
    "title": "Für Elise · De første figurer",
    "subtitle": "Takt 1–4 efter optakten · Sekstendedele og brudte akkorder",
    "level": 4,
    "key": "Am",
    "time": "3/8",
    "tip": "Første tonepar veksler E–Dis. Den venstre hånd bruger kendte A- og E-mol-figurer. Uddraget starter efter optakten.",
    "workId": "beethoven-furelise",
    "workName": "Für Elise",
    "collection": "klassisk",
    "composer": "Ludwig van Beethoven",
    "source": {
      "url": "https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=931",
      "title": "Für Elise, Takt 1–4 efter optakten",
      "license": "Public Domain",
      "adaptation": "Indledning transskriberet efter den frit tilgængelige Mutopia-nodeudgave. Uddraget begynder efter optakt; venstre hånd er i spilbart leje. Pedal, dynamik, artikulation og fraseringsbuer er udeladt."
    },
    "measures": [
      {
        "treble": "E5:16 D#5:16 E5:16 B4:16 Dn5:16 C5:16",
        "bass": "r:8 r:8 r:8"
      },
      {
        "treble": "A4:8 r:16 C4:16 E4:16 A4:16",
        "bass": "A2:16 E3:16 A3:16 r:16 r:8"
      },
      {
        "treble": "B4:8 r:16 E4:16 G#4:16 B4:16",
        "bass": "E2:16 E3:16 G#3:16 r:16 r:8"
      },
      {
        "treble": "C5:8 r:16 E4:16 E5:16 D#5:16",
        "bass": "A2:16 E3:16 A3:16 r:16 r:8"
      }
    ]
  },
  {
    "id": "beethoven-furelise-t5-7",
    "title": "Für Elise · Svaret",
    "subtitle": "Takt 5–7 · Det kendte tema i en ny vending",
    "level": 4,
    "key": "Am",
    "time": "3/8",
    "tip": "Gentag den øverste E–Dis-figur. Hold pauserne præcise, mens venstre hånd spiller den brudte akkord.",
    "workId": "beethoven-furelise",
    "workName": "Für Elise",
    "collection": "klassisk",
    "composer": "Ludwig van Beethoven",
    "source": {
      "url": "https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=931",
      "title": "Für Elise, Takt 5–7",
      "license": "Public Domain",
      "adaptation": "Indledning transskriberet efter den frit tilgængelige Mutopia-nodeudgave. Uddraget begynder efter optakt; venstre hånd er i spilbart leje. Pedal, dynamik, artikulation og fraseringsbuer er udeladt."
    },
    "measures": [
      {
        "treble": "E5:16 D#5:16 E5:16 B4:16 Dn5:16 C5:16",
        "bass": "r:8 r:8 r:8"
      },
      {
        "treble": "A4:8 r:16 C4:16 E4:16 A4:16",
        "bass": "A2:16 E3:16 A3:16 r:16 r:8"
      },
      {
        "treble": "B4:8 r:16 E4:16 C5:16 B4:16",
        "bass": "E2:16 E3:16 G#3:16 r:16 r:8"
      }
    ]
  },
  {
    "id": "chopin-prelude28-4-t1-4",
    "title": "Chopin · Forspillets første vending",
    "subtitle": "Præludium op. 28 nr. 4, takt 1–4 · Kromatiske akkorder",
    "level": 5,
    "key": "Em",
    "time": "4/4",
    "tip": "Højre hånd holder lange meloditoner. Venstre hånd skifter enkelte toner i akkorden. Begynd med én akkord ad gangen.",
    "workId": "chopin-prelude28-4",
    "workName": "Præludium op. 28 nr. 4",
    "collection": "klassisk",
    "composer": "Frédéric Chopin",
    "source": {
      "url": "https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=468",
      "title": "Præludium op. 28 nr. 4, Præludium op. 28 nr. 4, takt 1–4",
      "license": "Public Domain",
      "adaptation": "Toner og rytme transskriberet fra den offentligt tilgængelige Mutopia-nodeudgave. Nogle stemmeføringsdetaljer og ornamenter er udeladt. Spil efter originalkilden for fuld notation."
    },
    "measures": [
      {
        "treble": "B4:hd C5:q",
        "bass": "G3+B3+E4:8 G3+B3+E4:8 G3+B3+E4:8 G3+B3+E4:8 G3+B3+E4:8 G3+B3+E4:8 G3+B3+E4:8 G3+B3+E4:8"
      },
      {
        "treble": "B4:hd C5:q",
        "bass": "F#3+A3+E4:8 F#3+A3+E4:8 F#3+A3+E4:8 F#3+A3+E4:8 F#3+A3+D#4:8 F#3+A3+D#4:8 F#3+A3+D#4:8 F#3+A3+D#4:8"
      },
      {
        "treble": "B4:hd C5:q",
        "bass": "F3+A3+D#4:8 F3+A3+D#4:8 F3+A3+D#4:8 F3+A3+D#4:8 F3+A3+D4:8 F3+A3+D4:8 F3+G#3+D4:8 F3+G#3+D4:8"
      },
      {
        "treble": "B4:hd Bb4:q",
        "bass": "E3+G#3+D4:8 E3+G#3+D4:8 E3+G#3+D4:8 E3+G#3+D4:8 E3+G3+D4:8 E3+G3+D4:8 E3+G3+C#4:8 E3+G3+C#4:8"
      }
    ]
  },
  {
    "id": "chopin-prelude28-4-t5-8",
    "title": "Chopin · Den faldende spænding",
    "subtitle": "Præludium op. 28 nr. 4, takt 5–8 · Gentagelser med små forskelle",
    "level": 5,
    "key": "Em",
    "time": "4/4",
    "tip": "Se efter forskellen mellem første og anden halvdel af venstrehåndsakkorderne. Højre hånd får små ændringer.",
    "workId": "chopin-prelude28-4",
    "workName": "Præludium op. 28 nr. 4",
    "collection": "klassisk",
    "composer": "Frédéric Chopin",
    "source": {
      "url": "https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=468",
      "title": "Præludium op. 28 nr. 4, Præludium op. 28 nr. 4, takt 5–8",
      "license": "Public Domain",
      "adaptation": "Toner og rytme transskriberet fra den offentligt tilgængelige Mutopia-nodeudgave. Nogle stemmeføringsdetaljer og ornamenter er udeladt. Spil efter originalkilden for fuld notation."
    },
    "measures": [
      {
        "treble": "A4:hd Bn4:q",
        "bass": "E3+G3+C4:8 E3+G3+C4:8 E3+G3+C4:8 E3+G3+C4:8 E3+F#3+C4:8 E3+F#3+C4:8 E3+F#3+C4:8 E3+F#3+C4:8"
      },
      {
        "treble": "A4:hd B4:q",
        "bass": "E3+F#3+C4:8 E3+F#3+C4:8 E3+F#3+C4:8 E3+F#3+C4:8 D#3+F#3+C4:8 D#3+F#3+C4:8 D#3+F#3+C4:8 D#3+F#3+C4:8"
      },
      {
        "treble": "A4:hd B4:8d A4:16",
        "bass": "D3+F#3+C4:8 D3+F#3+C4:8 D3+F#3+C4:8 D3+F#3+C4:8 D3+F#3+C4:8 D3+F#3+C4:8 D3+F#3+C4:8 D3+F#3+C4:8"
      },
      {
        "treble": "A4:hd G#4:q",
        "bass": "D3+F3+C4:8 D3+F3+C4:8 D3+F3+C4:8 D3+F3+C4:8 D3+F3+B3:8 D3+F3+B3:8 D3+F3+B3:8 D3+F3+B3:8"
      }
    ]
  }
]);
specs.push(...[
  {
    "id": "mozart-turkish-t1-4",
    "title": "Turkish March · Temaets første fire takter",
    "subtitle": "Takt 1–4 efter optakten · Hurtig melodilæsning",
    "level": 4,
    "key": "Am",
    "time": "2/4",
    "tip": "Melodien begynder efter en kort optakt. De mange korte toner bliver lettere, når du genkender bevægelsen omkring C og E.",
    "workId": "mozart-turkish",
    "workName": "Turkish March",
    "composer": "W. A. Mozart",
    "source": {
      "url": "https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=108",
      "title": "Rondo Alla Turca, KV 331, første fire fulde takter",
      "license": "Public Domain",
      "adaptation": "Transskriberet fra Mutopias frit anvendelige nodeudgave. Optakten står uden for denne øvepassage; ornamenter og artikulation er udeladt. De spilles i den originale tonerækkefølge."
    },
    "measures": [
      {
        "treble": "C5:8 r:8 D5:16 C5:16 B4:16 C5:16",
        "bass": "A2:8 C4+E4:8 C4+E4:8 C4+E4:8"
      },
      {
        "treble": "E5:8 r:8 F5:16 E5:16 D#5:16 E5:16",
        "bass": "A2:8 C4+E4:8 C4+E4:8 C4+E4:8"
      },
      {
        "treble": "B4:16 A4:16 G#4:16 A4:16 B4:16 A4:16 G#4:16 A4:16",
        "bass": "A2:8 C4+E4:8 A2:8 C4+E4:8"
      },
      {
        "treble": "C6:q A5:8 C6:8",
        "bass": "A2:8 C4+E4:8 C4+E4:8 C4+E4:8"
      }
    ]
  },
  {
    "id": "mozart-turkish-t5-7",
    "title": "Turkish March · Svar med akkorder",
    "subtitle": "Takt 5–7 · Melodi og dobbeltgreb",
    "level": 5,
    "key": "Am",
    "time": "2/4",
    "tip": "Højre hånd skifter nu fra enkelttoner til dobbeltgreb. Fokusér på Fis–A og E–G i den ene hånd.",
    "workId": "mozart-turkish",
    "workName": "Turkish March",
    "composer": "W. A. Mozart",
    "source": {
      "url": "https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=108",
      "title": "Rondo Alla Turca, KV 331, næste tre fulde takter",
      "license": "Public Domain",
      "adaptation": "Transskriberet fra Mutopias frit anvendelige nodeudgave. Små forsiringer, fraseringsbuer og artikulation er udeladt; hovedtonerne og akkorderne følger kilden."
    },
    "measures": [
      {
        "treble": "B5:8 F#5+A5:8 E5+G5:8 F#5+A5:8",
        "bass": "E3:8 B3+E4:8 B3+E4:8 B3+E4:8"
      },
      {
        "treble": "B5:8 F#5+A5:8 E5+G5:8 F#5+A5:8",
        "bass": "E3:8 B3+E4:8 B3+E4:8 B3+E4:8"
      },
      {
        "treble": "B5:8 F#5+A5:8 E5+G5:8 D#5+F#5:8",
        "bass": "E3:8 B3+E4:8 B2:8 B2:8"
      }
    ]
  }
]);
// Gymnopédie uses the H-mol key signature (two sharps, shared with D-dur).
for(const p of specs)if(p.workId==='satie-gymno')p.tonality='Bm';
for(const p of E.PIECES)if(p.workId==='satie-gymno')p.tonality='Bm';
const added=specs.map(L.fromSpec);
for(const p of added){
 const errors=L.validateScore(p);
 if(errors.length)throw Error(p.id+': '+errors.join('; '));
 p.workName=groups.find(g=>g[0]===p.workId)?.[1];
 if(!E.PIECES.some(x=>x.id===p.id))E.PIECES.push(p);
}
return added;
});
