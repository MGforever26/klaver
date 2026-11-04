/* Curated original miniatures and source-checked public-domain excerpts. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./engine.js'),require('./learning.js'));else factory(root.NV,root.NV.learning);})(typeof globalThis!=='undefined'?globalThis:this,function(E,L){
'use strict';
for(const p of E.PIECES){p.collection=p.collection||'original';p.composer=p.composer||'Nodeværk';p.source=p.source||{title:'Original øvelse',license:'Originalt undervisningsmateriale til Nodeværk'};}
const specs=[
  {
    "id": "orig-fire-smaa-skridt",
    "title": "Fire små skridt",
    "subtitle": "Trinvis melodi over rolige bastoner",
    "level": 1,
    "key": "C",
    "time": "4/4",
    "tip": "Find C i begge hænder før start. Se de fire første toner som én bevægelse.",
    "collection": "original",
    "composer": "Nodeværk",
    "source": {
      "title": "Original øveminiature",
      "license": "CC0",
      "adaptation": "Skrevet til Nodeværk. Ikke et uddrag af et eksisterende værk."
    },
    "measures": [
      {
        "treble": "C4:q D4:q E4:q F4:q",
        "bass": "C3:w"
      },
      {
        "treble": "G4:h E4:q C4:q",
        "bass": "C3:w"
      },
      {
        "treble": "D4:q E4:q F4:q D4:q",
        "bass": "G2:w"
      },
      {
        "treble": "C4:w",
        "bass": "C3:w"
      }
    ]
  },
  {
    "id": "orig-en-lille-samtale",
    "title": "En lille samtale",
    "subtitle": "Hænderne skiftes til at føre melodien",
    "level": 1,
    "key": "G",
    "time": "4/4",
    "tip": "Bliv ved med at tælle, mens den ene hånd holder pause. F er fis i G-dur.",
    "collection": "original",
    "composer": "Nodeværk",
    "source": {
      "title": "Original øveminiature",
      "license": "CC0",
      "adaptation": "Skrevet til Nodeværk. Ikke et uddrag af et eksisterende værk."
    },
    "measures": [
      {
        "treble": "G4:q A4:q B4:h",
        "bass": "r:w"
      },
      {
        "treble": "r:w",
        "bass": "G3:q F3:q E3:h"
      },
      {
        "treble": "A4:h F4:h",
        "bass": "D3:w"
      },
      {
        "treble": "G4:w",
        "bass": "G3:w"
      }
    ]
  },
  {
    "id": "orig-skygge-paa-stien",
    "title": "Skygge på stien",
    "subtitle": "En enkel molmelodi med halvnoder",
    "level": 1,
    "key": "Am",
    "time": "3/4",
    "tip": "Hør forskellen mellem den korte begyndelse og den lange slutning i hver takt.",
    "collection": "original",
    "composer": "Nodeværk",
    "source": {
      "title": "Original øveminiature",
      "license": "CC0",
      "adaptation": "Skrevet til Nodeværk. Ikke et uddrag af et eksisterende værk."
    },
    "measures": [
      {
        "treble": "A4:q B4:q C5:q",
        "bass": "A2:hd"
      },
      {
        "treble": "B4:q A4:h",
        "bass": "E3:hd"
      },
      {
        "treble": "G4:q E4:q G4:q",
        "bass": "E3:hd"
      },
      {
        "treble": "A4:hd",
        "bass": "A2:hd"
      }
    ]
  },
  {
    "id": "orig-broen",
    "title": "Broen",
    "subtitle": "Gentagelser og et lille tertsspring",
    "level": 1,
    "key": "F",
    "time": "4/4",
    "tip": "Se efter gentagne toner. I F-dur spilles B som den sorte b-tangent.",
    "collection": "original",
    "composer": "Nodeværk",
    "source": {
      "title": "Original øveminiature",
      "license": "CC0",
      "adaptation": "Skrevet til Nodeværk. Ikke et uddrag af et eksisterende værk."
    },
    "measures": [
      {
        "treble": "F4:q F4:q A4:h",
        "bass": "F3:w"
      },
      {
        "treble": "G4:q A4:q B4:h",
        "bass": "B2:w"
      },
      {
        "treble": "A4:q G4:q E4:h",
        "bass": "C3:w"
      },
      {
        "treble": "F4:w",
        "bass": "F3:w"
      }
    ]
  },
  {
    "id": "orig-baaden",
    "title": "Båden",
    "subtitle": "To store slag i hver takt",
    "level": 1,
    "key": "C",
    "time": "6/8",
    "tip": "Tæl 1-la-li 2-la-li. Hver punkteret fjerdedel er ét stort pulsslag.",
    "collection": "original",
    "composer": "Nodeværk",
    "source": {
      "title": "Original øveminiature",
      "license": "CC0",
      "adaptation": "Skrevet til Nodeværk. Ikke et uddrag af et eksisterende værk."
    },
    "measures": [
      {
        "treble": "E4:qd G4:qd",
        "bass": "C3:qd G3:qd"
      },
      {
        "treble": "F4:qd A4:qd",
        "bass": "F3:qd C3:qd"
      },
      {
        "treble": "G4:qd D4:qd",
        "bass": "G2:qd G3:qd"
      },
      {
        "treble": "C4:hd",
        "bass": "C3:hd"
      }
    ]
  },
  {
    "id": "orig-det-stille-rum",
    "title": "Det stille rum",
    "subtitle": "Pauser i højre hånd over en lang bas",
    "level": 1,
    "key": "Dm",
    "time": "4/4",
    "tip": "Giv pausen en hel fjerdedel. Se fortsat frem mod næste tone.",
    "collection": "original",
    "composer": "Nodeværk",
    "source": {
      "title": "Original øveminiature",
      "license": "CC0",
      "adaptation": "Skrevet til Nodeværk. Ikke et uddrag af et eksisterende værk."
    },
    "measures": [
      {
        "treble": "D4:q r:q F4:h",
        "bass": "D3:w"
      },
      {
        "treble": "E4:q r:q G4:h",
        "bass": "C3:w"
      },
      {
        "treble": "F4:q E4:q D4:q C4:q",
        "bass": "A2:w"
      },
      {
        "treble": "D4:w",
        "bass": "D3:w"
      }
    ]
  },
  {
    "id": "orig-lys-i-vinduet",
    "title": "Lys i vinduet",
    "subtitle": "Ottendedele og enkle basintervaller",
    "level": 2,
    "key": "G",
    "time": "4/4",
    "tip": "Læs ottendedelene i par. Venstre hånd flytter først på tredje slag.",
    "collection": "original",
    "composer": "Nodeværk",
    "source": {
      "title": "Original øveminiature",
      "license": "CC0",
      "adaptation": "Skrevet til Nodeværk. Ikke et uddrag af et eksisterende værk."
    },
    "measures": [
      {
        "treble": "G4:q A4:8 B4:8 D5:h",
        "bass": "G2+D3:h B2+D3:h"
      },
      {
        "treble": "C5:q B4:8 A4:8 G4:h",
        "bass": "C3+E3:h C3+E3:h"
      },
      {
        "treble": "F4:8 G4:8 A4:q B4:q A4:q",
        "bass": "D3+A3:h D3+A3:h"
      },
      {
        "treble": "G4:h G4:h",
        "bass": "G2+B2:h G2+D3:h"
      }
    ]
  },
  {
    "id": "orig-vals-ved-kaien",
    "title": "Vals ved kajen",
    "subtitle": "Bas og to små akkordslag",
    "level": 2,
    "key": "F",
    "time": "3/4",
    "tip": "Lad bassen være let, og hold de to øverste toner i venstre hånd samlet.",
    "collection": "original",
    "composer": "Nodeværk",
    "source": {
      "title": "Original øveminiature",
      "license": "CC0",
      "adaptation": "Skrevet til Nodeværk. Ikke et uddrag af et eksisterende værk."
    },
    "measures": [
      {
        "treble": "A4:q G4:q F4:q",
        "bass": "F3:q A3+C4:q A3+C4:q"
      },
      {
        "treble": "G4:h A4:q",
        "bass": "C3:q G3+C4:q G3+C4:q"
      },
      {
        "treble": "B4:q A4:q G4:q",
        "bass": "C3:q E3+B3:q E3+B3:q"
      },
      {
        "treble": "F4:hd",
        "bass": "F3:q A3+C4:h"
      }
    ]
  },
  {
    "id": "orig-regndraaber",
    "title": "Regndråber",
    "subtitle": "Små ottendedelsgrupper i mol",
    "level": 2,
    "key": "Em",
    "time": "6/8",
    "tip": "Tæl to store slag. Lad øjnene læse tre ottendedele ad gangen.",
    "collection": "original",
    "composer": "Nodeværk",
    "source": {
      "title": "Original øveminiature",
      "license": "CC0",
      "adaptation": "Skrevet til Nodeværk. Ikke et uddrag af et eksisterende værk."
    },
    "measures": [
      {
        "treble": "E4:8 G4:8 B4:8 A4:8 G4:8 E4:8",
        "bass": "E3:qd B2:qd"
      },
      {
        "treble": "F4:8 A4:8 C5:8 B4:8 A4:8 F4:8",
        "bass": "A2:qd F3:qd"
      },
      {
        "treble": "G4:qd F4:q D#4:8",
        "bass": "B2:qd B2:qd"
      },
      {
        "treble": "E4:qd E4:qd",
        "bass": "E3:hd"
      }
    ]
  },
  {
    "id": "orig-over-bakken",
    "title": "Over bakken",
    "subtitle": "Tertser i højre hånd og to faste fortegn",
    "level": 2,
    "key": "D",
    "time": "4/4",
    "tip": "Læs begge toner i grebet før du spiller. F og C er forhøjede gennem stykket.",
    "collection": "original",
    "composer": "Nodeværk",
    "source": {
      "title": "Original øveminiature",
      "license": "CC0",
      "adaptation": "Skrevet til Nodeværk. Ikke et uddrag af et eksisterende værk."
    },
    "measures": [
      {
        "treble": "D4+F4:h E4+G4:h",
        "bass": "D3:h A2:h"
      },
      {
        "treble": "F4+A4:q G4+B4:q A4+C5:h",
        "bass": "D3:h A2:h"
      },
      {
        "treble": "G4+B4:h E4+G4:h",
        "bass": "G2:h A2:h"
      },
      {
        "treble": "D4+F4:w",
        "bass": "D3:w"
      }
    ]
  },
  {
    "id": "orig-nattog",
    "title": "Nattog",
    "subtitle": "En jævn bas under en forskudt melodistart",
    "level": 2,
    "key": "Am",
    "time": "4/4",
    "tip": "Hold bassen i gang under pausen. Højre hånd begynder på andet slag.",
    "collection": "original",
    "composer": "Nodeværk",
    "source": {
      "title": "Original øveminiature",
      "license": "CC0",
      "adaptation": "Skrevet til Nodeværk. Ikke et uddrag af et eksisterende værk."
    },
    "measures": [
      {
        "treble": "r:q E4:q A4:q C5:q",
        "bass": "A2:q E3:q A2:q E3:q"
      },
      {
        "treble": "B4:h G4:h",
        "bass": "G2:q D3:q G2:q D3:q"
      },
      {
        "treble": "A4:q G4:q F4:q E4:q",
        "bass": "D3:q A2:q E3:q B2:q"
      },
      {
        "treble": "A4:w",
        "bass": "A2:h E3:h"
      }
    ]
  },
  {
    "id": "orig-aabent-vand",
    "title": "Åbent vand",
    "subtitle": "En rolig vuggerytme med to b-fortegn",
    "level": 2,
    "key": "Bb",
    "time": "6/8",
    "tip": "Find B og Es før start. Læs den lange tone som ét stort slag.",
    "collection": "original",
    "composer": "Nodeværk",
    "source": {
      "title": "Original øveminiature",
      "license": "CC0",
      "adaptation": "Skrevet til Nodeværk. Ikke et uddrag af et eksisterende værk."
    },
    "measures": [
      {
        "treble": "D5:qd C5:8 B4:8 A4:8",
        "bass": "B2:qd F3:qd"
      },
      {
        "treble": "G4:qd B4:qd",
        "bass": "E3:qd B2:qd"
      },
      {
        "treble": "A4:8 B4:8 C5:8 E5:qd",
        "bass": "F3:qd C3:qd"
      },
      {
        "treble": "D5:qd B4:qd",
        "bass": "B2:hd"
      }
    ]
  },
  {
    "id": "orig-smaa-lanterner",
    "title": "Små lanterner",
    "subtitle": "Punkteret rytme og en ledetone",
    "level": 2,
    "key": "Gm",
    "time": "3/4",
    "tip": "Syng den punkterede rytme før du spiller. Fis i tredje takt peger mod G.",
    "collection": "original",
    "composer": "Nodeværk",
    "source": {
      "title": "Original øveminiature",
      "license": "CC0",
      "adaptation": "Skrevet til Nodeværk. Ikke et uddrag af et eksisterende værk."
    },
    "measures": [
      {
        "treble": "G4:qd A4:8 B4:q",
        "bass": "G2:q D3:h"
      },
      {
        "treble": "C5:q B4:q A4:q",
        "bass": "C3:q G3:h"
      },
      {
        "treble": "D5:q C5:q F#4:q",
        "bass": "D3:q A2:h"
      },
      {
        "treble": "G4:hd",
        "bass": "G2:hd"
      }
    ]
  },
  {
    "id": "orig-rundt-om-soeen",
    "title": "Rundt om søen",
    "subtitle": "Fire store slag med tre underdelinger",
    "level": 2,
    "key": "C",
    "time": "12/8",
    "tip": "Tæl fire punkterede fjerdedele i hver takt. Bevar samme puls gennem alle ottendedele.",
    "collection": "original",
    "composer": "Nodeværk",
    "source": {
      "title": "Original øveminiature",
      "license": "CC0",
      "adaptation": "Skrevet til Nodeværk. Ikke et uddrag af et eksisterende værk."
    },
    "measures": [
      {
        "treble": "E4:qd G4:qd A4:8 G4:8 F4:8 E4:qd",
        "bass": "C3:qd G3:qd C3:qd G3:qd"
      },
      {
        "treble": "F4:qd A4:qd G4:8 F4:8 E4:8 D4:qd",
        "bass": "F3:qd C3:qd F3:qd C3:qd"
      },
      {
        "treble": "G4:qd B4:qd A4:8 G4:8 F4:8 D4:qd",
        "bass": "G2:qd D3:qd G2:qd D3:qd"
      },
      {
        "treble": "E4:qd D4:qd C4:hd",
        "bass": "C3:qd G3:qd C3:hd"
      }
    ]
  },
  {
    "id": "orig-efterklang",
    "title": "Efterklang",
    "subtitle": "Bindebuer gennem taktstregen",
    "level": 3,
    "key": "Dm",
    "time": "4/4",
    "tip": "En bunden tone holdes. Slå den ikke an igen i næste takt; venstre hånd fortsætter.",
    "collection": "original",
    "composer": "Nodeværk",
    "source": {
      "title": "Original øveminiature",
      "license": "CC0",
      "adaptation": "Skrevet til Nodeværk. Ikke et uddrag af et eksisterende værk."
    },
    "measures": [
      {
        "treble": "F4:q A4:q G4:h~",
        "bass": "D3:h A2:h"
      },
      {
        "treble": "G4:q F4:8 E4:8 D4:h",
        "bass": "G2:h D3:h"
      },
      {
        "treble": "E4:q F4:q C#4:h",
        "bass": "A2:h E3:h"
      },
      {
        "treble": "D4:w",
        "bass": "D3:w"
      }
    ]
  },
  {
    "id": "orig-drejende-hjul",
    "title": "Drejende hjul",
    "subtitle": "Brudte akkorder under en sangbar melodi",
    "level": 3,
    "key": "Eb",
    "time": "4/4",
    "tip": "Se venstrehåndsmønstret som ét greb, og flyt hånden samlet ved harmoniskift.",
    "collection": "original",
    "composer": "Nodeværk",
    "source": {
      "title": "Original øveminiature",
      "license": "CC0",
      "adaptation": "Skrevet til Nodeværk. Ikke et uddrag af et eksisterende værk."
    },
    "measures": [
      {
        "treble": "G4:h B4:q G4:q",
        "bass": "E3:8 B3:8 G3:8 B3:8 E3:8 B3:8 G3:8 B3:8"
      },
      {
        "treble": "A4:h C5:q A4:q",
        "bass": "A2:8 E3:8 C3:8 E3:8 A2:8 E3:8 C3:8 E3:8"
      },
      {
        "treble": "F4:q G4:q A4:q F4:q",
        "bass": "B2:8 F3:8 D3:8 F3:8 B2:8 F3:8 A3:8 F3:8"
      },
      {
        "treble": "G4:h E4:h",
        "bass": "E3:8 B3:8 G3:8 B3:8 E3:h"
      }
    ]
  },
  {
    "id": "orig-mellem-husene",
    "title": "Mellem husene",
    "subtitle": "Synkoper over en stabil bas",
    "level": 3,
    "key": "A",
    "time": "4/4",
    "tip": "Tæl ottendedele hele vejen. Lad den bundne tone krydse tredje slag uden nyt anslag.",
    "collection": "original",
    "composer": "Nodeværk",
    "source": {
      "title": "Original øveminiature",
      "license": "CC0",
      "adaptation": "Skrevet til Nodeværk. Ikke et uddrag af et eksisterende værk."
    },
    "measures": [
      {
        "treble": "A4:8 B4:8 C5:q~ C5:8 B4:8 A4:q",
        "bass": "A2:q E3:q A3:q E3:q"
      },
      {
        "treble": "F4:8 G4:8 A4:q~ A4:8 G4:8 F4:q",
        "bass": "D3:q A3:q D3:q A3:q"
      },
      {
        "treble": "B4:8 C5:8 D5:q C5:8 B4:8 G4:q",
        "bass": "E3:q B3:q E3:q B3:q"
      },
      {
        "treble": "A4:h A4:h",
        "bass": "A2:h A2+E3:h"
      }
    ]
  },
  {
    "id": "orig-den-lange-boelge",
    "title": "Den lange bølge",
    "subtitle": "Seks ottendedele efterfulgt af lange toner",
    "level": 3,
    "key": "Em",
    "time": "12/8",
    "tip": "Opdel takten i fire store slag. Venstre hånd spiller ét anslag på hvert stort slag.",
    "collection": "original",
    "composer": "Nodeværk",
    "source": {
      "title": "Original øveminiature",
      "license": "CC0",
      "adaptation": "Skrevet til Nodeværk. Ikke et uddrag af et eksisterende værk."
    },
    "measures": [
      {
        "treble": "E4:8 F4:8 G4:8 A4:8 G4:8 F4:8 E4:qd B4:qd",
        "bass": "E3:qd B2:qd E3:qd B2:qd"
      },
      {
        "treble": "C5:8 B4:8 A4:8 G4:8 A4:8 B4:8 A4:qd E4:qd",
        "bass": "A2:qd E3:qd A2:qd E3:qd"
      },
      {
        "treble": "F4:8 G4:8 A4:8 B4:8 A4:8 F4:8 D#4:qd F4:qd",
        "bass": "B2:qd F3:qd B2:qd F3:qd"
      },
      {
        "treble": "E4:qd G4:qd F4:qd E4:qd",
        "bass": "E3:qd B2:qd E3:hd"
      }
    ]
  },
  {
    "id": "orig-tre-klangfarver",
    "title": "Tre klangfarver",
    "subtitle": "Treklange og omvendinger i As-dur",
    "level": 3,
    "key": "Ab",
    "time": "3/4",
    "tip": "Læs nederste og øverste tone i hvert greb, og placer den tredje tone imellem.",
    "collection": "original",
    "composer": "Nodeværk",
    "source": {
      "title": "Original øveminiature",
      "license": "CC0",
      "adaptation": "Skrevet til Nodeværk. Ikke et uddrag af et eksisterende værk."
    },
    "measures": [
      {
        "treble": "C4+E4+A4:h E4:q",
        "bass": "A2:hd"
      },
      {
        "treble": "D4+F4+A4:h F4:q",
        "bass": "D3:hd"
      },
      {
        "treble": "D4+E4+G4:h B4:q",
        "bass": "E3:hd"
      },
      {
        "treble": "C4+E4+A4:hd",
        "bass": "A2:hd"
      }
    ]
  },
  {
    "id": "orig-svingende-lygter",
    "title": "Svingende lygter",
    "subtitle": "To hænder i skiftende rytmer",
    "level": 3,
    "key": "F",
    "time": "12/8",
    "tip": "Hold de fire store slag. Se præcist, hvor hænderne mødes og hvor melodien spiller alene.",
    "collection": "original",
    "composer": "Nodeværk",
    "source": {
      "title": "Original øveminiature",
      "license": "CC0",
      "adaptation": "Skrevet til Nodeværk. Ikke et uddrag af et eksisterende værk."
    },
    "measures": [
      {
        "treble": "A4:qd G4:8 A4:8 C5:8 B4:qd A4:qd",
        "bass": "F3:qd C3:qd F3:q A3:8 C4:qd"
      },
      {
        "treble": "G4:qd A4:qd F4:8 E4:8 D4:8 C4:qd",
        "bass": "D3:qd A2:qd D3:qd A2:qd"
      },
      {
        "treble": "E4:qd G4:qd B4:8 A4:8 G4:8 E4:qd",
        "bass": "C3:q G3:8 E3:qd C3:qd G3:qd"
      },
      {
        "treble": "F4:qd A4:qd G4:qd F4:qd",
        "bass": "F3:qd C3:qd F3:hd"
      }
    ]
  },
  {
    "id": "orig-hurtige-fodspor",
    "title": "Hurtige fodspor",
    "subtitle": "Sekstendedelsfigurer i korte motiver",
    "level": 4,
    "key": "D",
    "time": "4/4",
    "tip": "Lær først hver firetonersgruppe langsomt. Bevar roen i venstre hånd.",
    "collection": "original",
    "composer": "Nodeværk",
    "source": {
      "title": "Original øveminiature",
      "license": "CC0",
      "adaptation": "Skrevet til Nodeværk. Ikke et uddrag af et eksisterende værk."
    },
    "measures": [
      {
        "treble": "F4:16 G4:16 A4:16 B4:16 A4:q F4:8 E4:8 D4:q",
        "bass": "D3:h A2:h"
      },
      {
        "treble": "G4:16 A4:16 B4:16 C5:16 B4:q A4:8 G4:8 E4:q",
        "bass": "G2:h D3:h"
      },
      {
        "treble": "A4:16 B4:16 C5:16 D5:16 C5:q B4:8 A4:8 G4:q",
        "bass": "A2:h E3:h"
      },
      {
        "treble": "F4:8 E4:8 D4:q D4:h",
        "bass": "D3:w"
      }
    ]
  },
  {
    "id": "orig-natlig-rundgang",
    "title": "Natlig rundgang",
    "subtitle": "Septimklange og en kromatisk ledetone",
    "level": 4,
    "key": "Am",
    "time": "4/4",
    "tip": "Læs de fire toner nedefra. Hold grebet let og spil langsomt nok til at kunne se næste akkord.",
    "collection": "original",
    "composer": "Nodeværk",
    "source": {
      "title": "Original øveminiature",
      "license": "CC0",
      "adaptation": "Skrevet til Nodeværk. Ikke et uddrag af et eksisterende værk."
    },
    "measures": [
      {
        "treble": "G4:8 A4:8 C5:q B4:q A4:q",
        "bass": "A2+C3+E3+G3:w"
      },
      {
        "treble": "F4:q A4:8 C5:8 B4:h",
        "bass": "D3+F3+A3+C4:w"
      },
      {
        "treble": "G#4:q B4:q D5:8 C5:8 B4:q",
        "bass": "E3+G#3+B3+D4:w"
      },
      {
        "treble": "A4:w",
        "bass": "A2+C3+E3+A3:w"
      }
    ]
  },
  {
    "id": "orig-stjerner-over-vandet",
    "title": "Stjerner over vandet",
    "subtitle": "Fem b-fortegn og små sekstendedele",
    "level": 4,
    "key": "Db",
    "time": "6/8",
    "tip": "Tænk i Des-dur før første tone. Tæl to store slag; sekstendedelene er blot en kort bevægelse ind i næste tone.",
    "collection": "original",
    "composer": "Nodeværk",
    "source": {
      "title": "Original øveminiature",
      "license": "CC0",
      "adaptation": "Skrevet til Nodeværk. Ikke et uddrag af et eksisterende værk."
    },
    "measures": [
      {
        "treble": "F4:16 G4:16 A4:8 D5:8 C5:q A4:8",
        "bass": "D3:8 A3:8 F3:8 D3:8 A3:8 F3:8"
      },
      {
        "treble": "B4:16 C5:16 D5:8 F5:8 E5:q D5:8",
        "bass": "G2:8 D3:8 B2:8 G2:8 D3:8 B2:8"
      },
      {
        "treble": "C5:8 B4:8 A4:8 G4:16 A4:16 B4:8 E4:8",
        "bass": "A2:8 E3:8 C3:8 A2:8 E3:8 C3:8"
      },
      {
        "treble": "F4:q E4:8 D4:qd",
        "bass": "D3:8 A3:8 F3:8 D3:qd"
      }
    ]
  },
  {
    "id": "orig-puls-i-moerket",
    "title": "Puls i mørket",
    "subtitle": "Synkoper og bindebuer i sammensat takt",
    "level": 4,
    "key": "Gm",
    "time": "12/8",
    "tip": "Tæl fire store slag, også når melodien begynder mellem slagene. Bindebuen fjerner et anslag, ikke tiden.",
    "collection": "original",
    "composer": "Nodeværk",
    "source": {
      "title": "Original øveminiature",
      "license": "CC0",
      "adaptation": "Skrevet til Nodeværk. Ikke et uddrag af et eksisterende værk."
    },
    "measures": [
      {
        "treble": "G4:8 A4:q~ A4:8 B4:q D5:qd C5:qd",
        "bass": "G2:qd D3:qd G2:qd D3:qd"
      },
      {
        "treble": "B4:q A4:8 G4:qd E4:8 F4:q~ F4:qd",
        "bass": "E3:qd B2:qd C3:qd G2:qd"
      },
      {
        "treble": "A4:8 B4:q C5:qd A4:8 G4:q F#4:qd",
        "bass": "D3:qd A2:qd D3:qd A2:qd"
      },
      {
        "treble": "G4:qd D5:qd B4:qd G4:qd",
        "bass": "G2:qd D3:qd G2:hd"
      }
    ]
  },
  {
    "id": "satie-gymno-bas",
    "title": "Gymnopédie · Vuggende bas",
    "subtitle": "Takt 1 til 4 · Bas og akkord",
    "level": 2,
    "key": "D",
    "time": "3/4",
    "tip": "Find akkordens håndform før du begynder. Flyt venstre hånd samlet fra bastonen til akkorden, og hold tre rolige slag.",
    "collection": "klassisk",
    "composer": "Erik Satie",
    "source": {
      "url": "https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=37",
      "title": "Gymnopédie nr. 1, takt 1 til 4",
      "license": "Public Domain",
      "adaptation": "Forenklet klaverarrangement. Originalens meloditoner er bevaret. Bas og mellemstemme er samlet i venstre hånd: bastonen slippes efter ét slag, før akkorden anslås. Dynamik og fraseringsbuer er udeladt."
    },
    "measures": [
      {
        "treble": "r:hd",
        "bass": "G2:q B3+D4+F4:h"
      },
      {
        "treble": "r:hd",
        "bass": "D2:q A3+C4+F4:h"
      },
      {
        "treble": "r:hd",
        "bass": "G2:q B3+D4+F4:h"
      },
      {
        "treble": "r:hd",
        "bass": "D2:q A3+C4+F4:h"
      }
    ]
  },
  {
    "id": "satie-gymno-melodi",
    "title": "Gymnopédie · Første frase",
    "subtitle": "Takt 5 til 8 · Melodi over bas",
    "level": 3,
    "key": "D",
    "time": "3/4",
    "tip": "Syng melodien indvendigt. Højre hånd begynder først på andet slag. Afprøv springet i venstre hånd alene, før du sætter hænderne sammen.",
    "collection": "klassisk",
    "composer": "Erik Satie",
    "source": {
      "url": "https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=37",
      "title": "Gymnopédie nr. 1, takt 5 til 8",
      "license": "Public Domain",
      "adaptation": "Forenklet klaverarrangement. Originalens meloditoner er bevaret. Bas og mellemstemme er samlet i venstre hånd: bastonen slippes efter ét slag, før akkorden anslås. Dynamik og fraseringsbuer er udeladt."
    },
    "measures": [
      {
        "treble": "r:q F5:q A5:q",
        "bass": "G2:q B3+D4+F4:h"
      },
      {
        "treble": "G5:q F5:q C5:q",
        "bass": "D2:q A3+C4+F4:h"
      },
      {
        "treble": "B4:q C5:q D5:q",
        "bass": "G2:q B3+D4+F4:h"
      },
      {
        "treble": "A4:hd",
        "bass": "D2:q A3+C4+F4:h"
      }
    ]
  },
  {
    "id": "satie-gymno-fortsat",
    "title": "Gymnopédie · Den åbne slutning",
    "subtitle": "Takt 13 til 18 · Seks takters frase",
    "level": 3,
    "key": "D",
    "time": "3/4",
    "tip": "Se et slag frem. De sidste to takter skifter fra den velkendte basveksling til fis og h; læs dem først.",
    "collection": "klassisk",
    "composer": "Erik Satie",
    "source": {
      "url": "https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=37",
      "title": "Gymnopédie nr. 1, takt 13 til 18",
      "license": "Public Domain",
      "adaptation": "Forenklet klaverarrangement. Originalens meloditoner er bevaret. Bas og mellemstemme er samlet i venstre hånd: bastonen slippes efter ét slag, før akkorden anslås. Dynamik og fraseringsbuer er udeladt."
    },
    "measures": [
      {
        "treble": "r:q F5:q A5:q",
        "bass": "G2:q B3+D4+F4:h"
      },
      {
        "treble": "G5:q F5:q C5:q",
        "bass": "D2:q A3+C4+F4:h"
      },
      {
        "treble": "B4:q C5:q D5:q",
        "bass": "G2:q B3+D4+F4:h"
      },
      {
        "treble": "A4:hd",
        "bass": "D2:q A3+C4+F4:h"
      },
      {
        "treble": "C5:hd",
        "bass": "F2:q A3+C4+F4:h"
      },
      {
        "treble": "F5:hd",
        "bass": "B1:q B3+D4+F4:h"
      }
    ]
  },
  {
    "id": "burgmuller-arabesque-loeb",
    "title": "Arabesque · Fire stigende løb",
    "subtitle": "Takt 3 til 6 · Sekstendedele",
    "level": 4,
    "key": "Am",
    "time": "2/4",
    "tip": "Tæl 1-e-og-a, 2-og. Hold venstre hånds to akkorder rolige, mens højre hånd flytter sit udgangspunkt opad. Begynd meget langsomt.",
    "collection": "klassisk",
    "composer": "Friedrich Burgmüller",
    "source": {
      "url": "https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=203",
      "title": "Arabesque, op. 100 nr. 2, takt 3 til 6",
      "license": "Public Domain",
      "adaptation": "Tonehøjder og varigheder er transskriberet fra Mutopias nodekilde. Fingersætning, dynamik, artikulation og fraseringsbuer er udeladt. Gentagelser spilles ikke automatisk."
    },
    "measures": [
      {
        "treble": "A4:16 B4:16 C5:16 B4:16 A4:8 r:8",
        "bass": "A3+C4+E4:q A3+C4+E4:q"
      },
      {
        "treble": "A4:16 B4:16 C5:16 D5:16 E5:8 r:8",
        "bass": "A3+C4+E4:q A3+C4+E4:q"
      },
      {
        "treble": "D5:16 E5:16 F5:16 G5:16 A5:8 r:8",
        "bass": "A3+D4+F4:q A3+D4+F4:q"
      },
      {
        "treble": "A5:16 B5:16 C6:16 D6:16 E6:8 r:8",
        "bass": "A3+C4+E4:q A3+C4+E4:q"
      }
    ]
  },
  {
    "id": "burgmuller-arabesque-svar",
    "title": "Arabesque · Pauser og bindebue",
    "subtitle": "Takt 7 til 10 · Første afslutning",
    "level": 3,
    "key": "Am",
    "time": "2/4",
    "tip": "Lad pauserne være præcise. D bliver holdt over taktstregen mellem anden og tredje takt i uddraget; anslå den ikke igen.",
    "collection": "klassisk",
    "composer": "Friedrich Burgmüller",
    "source": {
      "url": "https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=203",
      "title": "Arabesque, op. 100 nr. 2, takt 7 til 10",
      "license": "Public Domain",
      "adaptation": "Tonehøjder og varigheder er transskriberet fra Mutopias nodekilde. Fingersætning, dynamik, artikulation og fraseringsbuer er udeladt. Gentagelser spilles ikke automatisk."
    },
    "measures": [
      {
        "treble": "r:8 E5:8 E5:8 F5:8",
        "bass": "G3+C4+E4:q G3+C4+E4:q"
      },
      {
        "treble": "D5:8 r:8 D5:q~",
        "bass": "G3+B3+F4:q G3+B3+F4:q"
      },
      {
        "treble": "D5:8 G5:8 D5:8 E5:8",
        "bass": "G3+B3+F4:q G3+B3+F4:q"
      },
      {
        "treble": "C5:8 r:8 E5:q",
        "bass": "C4+E4:8 r:8 E4:q"
      }
    ]
  },
  {
    "id": "burgmuller-arabesque-venstre",
    "title": "Arabesque · Løbet i venstre hånd",
    "subtitle": "Takt 12 til 15 · Hænderne bytter rolle",
    "level": 4,
    "key": "Am",
    "time": "2/4",
    "tip": "Læs gis i venstre hånd, før du starter. Lad højre hånds punkterede fjerdedel vare gennem tre ottendedele, mens venstre hånd løber.",
    "collection": "klassisk",
    "composer": "Friedrich Burgmüller",
    "source": {
      "url": "https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=203",
      "title": "Arabesque, op. 100 nr. 2, takt 12 til 15 (anden del)",
      "license": "Public Domain",
      "adaptation": "Tonehøjder og varigheder er transskriberet fra Mutopias nodekilde. Fingersætning, dynamik, artikulation og fraseringsbuer er udeladt. Gentagelser spilles ikke automatisk."
    },
    "measures": [
      {
        "treble": "E5:qd B4:8",
        "bass": "G#3:16 A3:16 B3:16 A3:16 G#3:8 r:8"
      },
      {
        "treble": "C5:qd A4:8",
        "bass": "A3:16 B3:16 C4:16 D4:16 E4:8 r:8"
      },
      {
        "treble": "E5:qd B4:8",
        "bass": "G#3:16 A3:16 B3:16 A3:16 G#3:8 r:8"
      },
      {
        "treble": "C5:qd A4:8",
        "bass": "A3:16 B3:16 C4:16 D4:16 E4:8 r:8"
      }
    ]
  },
  {
    "id": "mozart-k2-aabning",
    "title": "Mozart K. 2 · Åbningen",
    "subtitle": "Takt 1 til 4 · Ottendedele og basspring",
    "level": 2,
    "key": "F",
    "time": "3/4",
    "tip": "Se på B i det faste fortegn. De to ottendedele begynder hver frase; lad dem føre frem til de to fjerdedele.",
    "collection": "klassisk",
    "composer": "W. A. Mozart",
    "source": {
      "url": "https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=1770",
      "title": "Menuet i F-dur, K. 2, takt 1 til 4",
      "license": "Public Domain",
      "adaptation": "Tonehøjder og varigheder er transskriberet fra Mutopias nodekilde. Fingersætning, dynamik, artikulation og fraseringsbuer er udeladt. Gentagelser spilles ikke automatisk."
    },
    "measures": [
      {
        "treble": "F5:8 A5:8 C5:q C5:q",
        "bass": "F3:h A3:q"
      },
      {
        "treble": "D5:8 F5:8 B4:q B4:q",
        "bass": "B3:h B3:q"
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
    "id": "mozart-k2-fortegn",
    "title": "Mozart K. 2 · Nye farver",
    "subtitle": "Takt 9 til 12 · Es og fis",
    "level": 3,
    "key": "F",
    "time": "3/4",
    "tip": "Find es og fis, før du spiller. Følg baslinjen helt ned til g i sidste takt, og hold samme tempo gennem springene.",
    "collection": "klassisk",
    "composer": "W. A. Mozart",
    "source": {
      "url": "https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=1770",
      "title": "Menuet i F-dur, K. 2, takt 9 til 12",
      "license": "Public Domain",
      "adaptation": "Tonehøjder og varigheder er transskriberet fra Mutopias nodekilde. Fingersætning, dynamik, artikulation og fraseringsbuer er udeladt. Gentagelser spilles ikke automatisk."
    },
    "measures": [
      {
        "treble": "C5:8 Eb5:8 A4:q A4:q",
        "bass": "F#3:hd"
      },
      {
        "treble": "B4:8 D5:8 G4:q G4:q",
        "bass": "G3:hd"
      },
      {
        "treble": "A4:8 C5:8 F#4:q F#4:q",
        "bass": "C4:q D4:q D3:q"
      },
      {
        "treble": "F#4:h G4:q",
        "bass": "G3:q D3:q G2:q"
      }
    ]
  },
  {
    "id": "mozart-k2-hjem",
    "title": "Mozart K. 2 · Tilbage mod F",
    "subtitle": "Takt 13 til 16 · Faldende sekvenser",
    "level": 2,
    "key": "F",
    "time": "3/4",
    "tip": "Sammenlign de tre første takter: figuren flyttes ned trin for trin. Læs basens slutning for sig, og spil derefter hele frasen uden stop.",
    "collection": "klassisk",
    "composer": "W. A. Mozart",
    "source": {
      "url": "https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=1770",
      "title": "Menuet i F-dur, K. 2, takt 13 til 16",
      "license": "Public Domain",
      "adaptation": "Tonehøjder og varigheder er transskriberet fra Mutopias nodekilde. Fingersætning, dynamik, artikulation og fraseringsbuer er udeladt. Gentagelser spilles ikke automatisk."
    },
    "measures": [
      {
        "treble": "B4:8 D5:8 G4:q G4:q",
        "bass": "E3:hd"
      },
      {
        "treble": "A4:8 C5:8 F4:q F4:q",
        "bass": "F3:hd"
      },
      {
        "treble": "G4:8 B4:8 E4:q E4:q",
        "bass": "B3:q C4:q C3:q"
      },
      {
        "treble": "E4:h F4:q",
        "bass": "F3:q C3:q F2:q"
      }
    ]
  },
  {
    "id": "petzold-menuet-aabning",
    "title": "Menuet i G · Åbningen",
    "subtitle": "Takt 1 til 4 · Kendt melodi i G-dur",
    "level": 2,
    "key": "G",
    "time": "3/4",
    "tip": "Find G-positionen og det faste fis. Spil venstre hånds lange toner helt ud, mens melodien fortsætter i ottendedele.",
    "collection": "klassisk",
    "composer": "Christian Petzold (tilskrevet)",
    "source": {
      "url": "https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=75",
      "title": "Menuet i G, BWV Anh. 114, takt 1 til 4",
      "license": "Public Domain",
      "adaptation": "Tonehøjder og varigheder er transskriberet fra Mutopias nodekilde. Fingersætning, dynamik, artikulation og fraseringsbuer er udeladt. Gentagelser spilles ikke automatisk. Forsiringer er udeladt. Værket står under Bach i den historiske udgave; kildefilen angiver tilskrivningen til Christian Petzold."
    },
    "measures": [
      {
        "treble": "D5:q G4:8 A4:8 B4:8 C5:8",
        "bass": "G3+B3+D4:h A3:q"
      },
      {
        "treble": "D5:q G4:q G4:q",
        "bass": "B3:hd"
      },
      {
        "treble": "E5:q C5:8 D5:8 E5:8 F5:8",
        "bass": "C4:hd"
      },
      {
        "treble": "G5:q G4:q G4:q",
        "bass": "B3:hd"
      }
    ]
  },
  {
    "id": "petzold-menuet-svar",
    "title": "Menuet i G · Frasens svar",
    "subtitle": "Takt 5 til 8 · Læs frem mod kadencen",
    "level": 2,
    "key": "G",
    "time": "3/4",
    "tip": "Se de faldende ottendedele som en bevægelse. I sidste takt arbejder venstre hånd videre under højre hånds lange A.",
    "collection": "klassisk",
    "composer": "Christian Petzold (tilskrevet)",
    "source": {
      "url": "https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=75",
      "title": "Menuet i G, BWV Anh. 114, takt 5 til 8",
      "license": "Public Domain",
      "adaptation": "Tonehøjder og varigheder er transskriberet fra Mutopias nodekilde. Fingersætning, dynamik, artikulation og fraseringsbuer er udeladt. Gentagelser spilles ikke automatisk. Forsiringer er udeladt. Værket står under Bach i den historiske udgave; kildefilen angiver tilskrivningen til Christian Petzold."
    },
    "measures": [
      {
        "treble": "C5:q D5:8 C5:8 B4:8 A4:8",
        "bass": "A3:hd"
      },
      {
        "treble": "B4:q C5:8 B4:8 A4:8 G4:8",
        "bass": "G3:hd"
      },
      {
        "treble": "F4:q G4:8 A4:8 B4:8 G4:8",
        "bass": "D4:q B3:q G3:q"
      },
      {
        "treble": "A4:hd",
        "bass": "D4:q D3:8 C4:8 B3:8 A3:8"
      }
    ]
  },
  {
    "id": "petzold-menuet-andendel",
    "title": "Menuet i G · Op i registeret",
    "subtitle": "Takt 17 til 20 · Ny position og cis",
    "level": 3,
    "key": "G",
    "time": "3/4",
    "tip": "Orientér dig i de høje toner før første anslag. Sidste takt har cis i højre hånd og et oktavspring i venstre. Øv landingen først.",
    "collection": "klassisk",
    "composer": "Christian Petzold (tilskrevet)",
    "source": {
      "url": "https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=75",
      "title": "Menuet i G, BWV Anh. 114, takt 17 til 20",
      "license": "Public Domain",
      "adaptation": "Tonehøjder og varigheder er transskriberet fra Mutopias nodekilde. Fingersætning, dynamik, artikulation og fraseringsbuer er udeladt. Gentagelser spilles ikke automatisk. Forsiringer er udeladt. Værket står under Bach i den historiske udgave; kildefilen angiver tilskrivningen til Christian Petzold."
    },
    "measures": [
      {
        "treble": "B5:q G5:8 A5:8 B5:8 G5:8",
        "bass": "G3:hd"
      },
      {
        "treble": "A5:q D5:8 E5:8 F5:8 D5:8",
        "bass": "F3:hd"
      },
      {
        "treble": "G5:q E5:8 F5:8 G5:8 D5:8",
        "bass": "E3:q G3:q E3:q"
      },
      {
        "treble": "C#5:q B4:8 C#5:8 A4:q",
        "bass": "A3:h A2:q"
      }
    ]
  }
];
const added=specs.map(L.fromSpec);for(const p of added){const errors=L.validateScore(p);if(errors.length)throw Error(p.id+': '+errors.join('; '));if(!E.PIECES.some(x=>x.id===p.id))E.PIECES.push(p);}return added;
});
